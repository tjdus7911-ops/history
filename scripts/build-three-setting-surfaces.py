#!/usr/bin/env python3
"""Draw precise explanatory geometry and ink on authored blank paper surfaces.

The underlying imagegen PNGs are read and hashed, never painted or resized.
SVG coordinates use the same complete 1024x1536 background as CSS cover.
"""
import argparse
import hashlib
import html
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = 'docs/three-content/staging-setting-surface-inputs.json'
OUTPUT = 'docs/three-content/staging-setting-surface-generation.json'
FONT = 'Noto Sans CJK KR,Noto Sans KR,sans-serif'

def text(x, y, value, size=22, anchor='middle', weight=500, rotate=0, color='#38291f'):
    transform = f' transform="rotate({rotate} {x} {y})"' if rotate else ''
    return (f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" '
            f'font-weight="{weight}" text-anchor="{anchor}" dominant-baseline="central" '
            f'fill="{color}"{transform}>{html.escape(value)}</text>')

def office(config):
    result = []
    for tag in config['tags']:
        r = tag['paperRect']
        x = tag.get('inkCenterX', r['x'] + r['width']/2)
        y = tag.get('inkCenterY', r['y'] + r['height']/2)
        size = tag['fontSize']
        assert r['x'] <= x <= r['x']+r['width'] and r['y'] <= y <= r['y']+r['height']
        assert size*len(tag['hanja']) <= r['width']-4, tag
        result.append(f'<g data-department="{html.escape(tag["name"])}">'
                      + text(x,y,tag['hanja'],size,rotate=tag.get('rotate',0))+'</g>')
    assert len(config['tags']) == 9
    return ''.join(result)

def warehouse(config):
    # A deliberately schematic coast/route sketch: generic settlement labels
    # are a legend, not five invented dots with an asserted common founding date.
    out = ['<g stroke-linecap="round" stroke-linejoin="round">',
        '<path d="M307 278L380 278L387 300L415 307L423 320L402 330L407 344L394 360L392 382L379 413L361 455L307 459Z" fill="#937a47" fill-opacity=".25" stroke="#4a3b2b" stroke-width="2"/>',
        '<path d="M444 293L456 287L469 303L479 328L469 350L453 367L442 354L448 332L437 307Z" fill="#937a47" fill-opacity=".25" stroke="#4a3b2b" stroke-width="2"/>',
        '<path d="M468 423L482 409L497 415L506 406L511 417L495 431L481 439L468 437Z" fill="#937a47" fill-opacity=".25" stroke="#4a3b2b" stroke-width="2"/>',
        '<path d="M409 315Q428 348 452 361Q472 379 485 422M389 377Q419 383 452 361" fill="none" stroke="#765d3d" stroke-width="1.5" stroke-dasharray="5 4"/>',
        '<circle cx="409" cy="315" r="3.5" fill="#833f2c"/><circle cx="452" cy="361" r="3.5" fill="#833f2c"/>',
        text(357,314,'唐',23),text(456,383,'新羅',20),text(487,457,'日本',19),
        text(373,342,'赤山',17),text(418,403,'淸海鎭',15),
        text(397,253,'海路',21),
        '<path d="M522 253V465" stroke="#6e5238" stroke-width="1" opacity=".55"/>']
    labels=[('新羅坊','居留',273),('新羅所','管理',310),('新羅院','寺院',347),('新羅村','村落',384),('赤山法華院','寺院',429)]
    for term,role,y in labels:
        out.append(text(535,y,term,20,anchor='start'))
        out.append(text(724,y,role,18,anchor='end',weight=400))
    out.append('</g>')
    for tag in config['cargoTags']:
        out.append(text(tag['x'],tag['y'],tag['hanja'],tag['fontSize'],weight=tag['weight'],rotate=tag['rotate']))
    return ''.join(out)

def tomb(config):
    # Own schematic, drawn from the layer relationships in the cited source.
    # No source diagram is traced; no corridor or stone chamber is invented.
    out = ['<g stroke-linejoin="round">',
      '<path d="M260 473C300 429 338 302 509 300C681 302 727 430 770 473Z" fill="#a18158" stroke="#4d3b28" stroke-width="2.5"/>',
      '<path d="M295 470C331 423 371 336 509 335C647 337 692 425 735 470Z" fill="#a49a80" stroke="#514c3d" stroke-width="2"/>']
    # Rounded packing stones are above and around the wooden outer chamber.
    for row,y in enumerate(range(352,461,15)):
        for x in range(321+row%2*7,714,16):
            outer=((x-509)/220)**2+((y-470)/133)**2 <= .94
            chamber=393 <= x <= 625 and y >= 386
            if outer and not chamber:
                out.append(f'<ellipse cx="{x}" cy="{y}" rx="7" ry="5" fill="#bdb7a7" stroke="#6c6659" stroke-width="1"/>')
    out += ['<rect x="394" y="388" width="231" height="78" fill="#835a32" stroke="#493420" stroke-width="2"/>',
        '<rect x="405" y="399" width="209" height="57" fill="#342b24"/>',
        '<path d="M395 405H624M395 423H405M614 423H624M395 441H405M614 441H624M426 389V399M452 389V399M479 389V399M506 389V399M533 389V399M560 389V399M587 389V399" stroke="#51391f" stroke-width="2"/>',
        '<rect x="447" y="423" width="124" height="25" fill="#9b7548" stroke="#d2b88d" stroke-width="1.5"/>',
        '<path d="M449 421L562 414L574 422H449" fill="#b18b59" stroke="#51391f" stroke-width="1.5"/>',
        '<path d="M226 474H800" stroke="#4b3823" stroke-width="3"/>',
        '<path d="M654 333L711 314H785M652 365L713 353H793M393 421L320 425H226" fill="none" stroke="#f4ead6" stroke-width="5"/>',
        '<path d="M654 333L711 314H785M652 365L713 353H793M393 421L320 425H226" fill="none" stroke="#493522" stroke-width="1.7"/>',
        text(786,296,'봉토',23,anchor='end'),text(793,339,'돌무지',23,anchor='end'),text(224,408,'나무 덧널',23,anchor='start'),
        text(510,435,'관',17,color='#f1e4c8'),'</g>']
    return ''.join(out)

DRAWERS={'tomb-section':tomb,'warehouse-map-tags':warehouse,'office-departments':office}

def build():
    spec=json.loads((ROOT/SPEC).read_text())
    outputs={};surfaces={}
    for config in spec['surfaces']:
        base=ROOT/'dist'/config['backgroundSrc']
        assert base.is_file(),str(base)
        source_sha=hashlib.sha256(base.read_bytes()).hexdigest()
        assert source_sha==config['backgroundSha256'],config['id']
        width,height=config['width'],config['height']
        assert (width,height)==(1024,1536)
        content=(f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" preserveAspectRatio="xMidYMid slice">'
                 '<title>'+html.escape(config['label'])+'</title><desc>'+html.escape(config['description'])+'</desc>'
                 +DRAWERS[config['kind']](config)+'</svg>\n')
        src='assets/ancient/three-complete/overlays/'+config['id']+'.svg'
        outputs['dist/'+src]=content
        surfaces[config['id']]={k:v for k,v in config.items() if k not in ['tags','cargoTags']}
        surfaces[config['id']].update(src=src,sha256=hashlib.sha256(content.encode()).hexdigest(),
            pixelEditingPerformed=False,referenceImagePixelsChanged=False,sourceVisualReviewComplete=False,runtimeVisualReviewComplete=False,
            coordinateSpace='absolute full background pixels; CSS object-fit cover, centered',
            surfaceText=[t['name'] for t in config.get('tags',[])]+[t['hanja'] for t in config.get('cargoTags',[])])
    manifest={'schemaVersion':1,'status':'precise-svg-surfaces-source-validated-runtime-visual-review-pending',
        'sourceInput':SPEC,'sourcePixelEditingPerformed':False,'runtimeVisualReviewComplete':False,'surfaces':surfaces}
    outputs[OUTPUT]=json.dumps(manifest,ensure_ascii=False,indent=2)+'\n'
    return outputs

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--check',action='store_true');args=parser.parse_args()
    outputs=build()
    for name,content in outputs.items():
        p=ROOT/name
        if args.check:assert p.is_file() and p.read_text()==content,('Stale setting surface',name)
        else:p.parent.mkdir(parents=True,exist_ok=True);p.write_text(content)
    print(json.dumps({'status':'checked' if args.check else 'generated','svgSurfaces':len(outputs)-1,'sourceImagePixelsChanged':False}))

if __name__=='__main__':main()
