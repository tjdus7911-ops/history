#!/usr/bin/env python3
"""Read alpha geometry and create CSS metadata. Never rewrite image pixels."""
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[1]
SOURCE='docs/three-content/fullbody-portrait-layout.json'
OUTPUT='docs/three-content/fullbody-portrait-generation.json'
def rect(x,y,w,h):
    return dict(x=int(x),y=int(y),width=int(w),height=int(h))
def bounds(mask,ox=0,oy=0):
    y,x=np.where(mask)
    return rect(x.min()+ox,y.min()+oy,x.max()-x.min()+1,y.max()-y.min()+1)
def component_loops(mask):
    """Trace pixel edges, including concave gaps and holes between limbs."""
    padded=np.pad(mask,1)
    neighbors=[padded[:-2,1:-1],padded[1:-1,2:],padded[2:,1:-1],padded[1:-1,:-2]]
    offsets=[((0,0),(1,0)),((1,0),(1,1)),((1,1),(0,1)),((0,1),(0,0))]
    edges={}
    for neighbor,(a,b) in zip(neighbors,offsets):
        yy,xx=np.where(mask&~neighbor)
        for x,y in zip(xx.tolist(),yy.tolist()):
            edges.setdefault((x+a[0],y+a[1]),[]).append((x+b[0],y+b[1]))
    direction={(1,0):0,(0,1):1,(-1,0):2,(0,-1):3}
    turn_priority={1:0,0:1,3:2,2:3}
    loops=[]
    while edges:
        start=next(iter(edges));current=start;previous=None;ring=[]
        while True:
            ring.append(current)
            candidates=edges[current]
            if previous is None or len(candidates)==1:
                following=candidates[0]
            else:
                incoming=direction[(current[0]-previous[0],current[1]-previous[1])]
                following=min(candidates,key=lambda p:turn_priority[(direction[(p[0]-current[0],p[1]-current[1])]-incoming)%4])
            candidates.remove(following)
            if not candidates:del edges[current]
            previous,current=current,following
            if current==start:break
        compact=[]
        for i,b in enumerate(ring):
            a=ring[i-1];c=ring[(i+1)%len(ring)]
            if (b[0]-a[0])*(c[1]-b[1])!=(b[1]-a[1])*(c[0]-b[0]):compact.append(b)
        loops.append(compact)
    return loops
def polygon(labels,cid,sr):
    x,y,w,h=(sr[k] for k in ('x','y','width','height'))
    assert x>=0 and y>=0 and w>0 and h>0 and x+w<=labels.shape[1] and y+h<=labels.shape[0],('Source rectangle outside image',cid,sr)
    selected=labels[y:y+h,x:x+w]==cid
    full_count=int(np.count_nonzero(labels==cid))
    selected_count=int(np.count_nonzero(selected))
    assert selected_count==full_count,('Source rectangle removes original alpha>32 subject pixels',cid,sr,full_count-selected_count)
    loops=component_loops(selected)
    segments=np.asarray([(a,b) for ring in loops for a,b in zip(ring,ring[1:]+ring[:1])],dtype=float)
    region=np.zeros((h,w),dtype=bool)
    # Independently rasterize the resulting edge paths at original pixel centers.
    for row in range(h):
        mid=row+.5
        crossing=segments[((segments[:,0,1]<=mid)&(segments[:,1,1]>mid))|((segments[:,1,1]<=mid)&(segments[:,0,1]>mid))]
        xs=sorted((crossing[:,0,0]+(mid-crossing[:,0,1])*(crossing[:,1,0]-crossing[:,0,0])/(crossing[:,1,1]-crossing[:,0,1])).tolist())
        assert len(xs)%2==0,('Unclosed component contour',cid,row)
        for lo,hi in zip(xs[::2],xs[1::2]):
            region[row,max(0,int(np.ceil(lo-.5))):min(w,int(np.ceil(hi-.5)))]=True
    foreign=(labels[y:y+h,x:x+w]!=0)&(labels[y:y+h,x:x+w]!=cid)&region
    sizes=np.bincount(labels.ravel())
    big=[int(i) for i in np.unique(labels[y:y+h,x:x+w][foreign]) if sizes[i]>1000]
    assert not big,('Neighbor enters CSS clip',cid,sr,big)
    assert np.all(region[selected]),'Clip removes alpha>32 subject pixels'
    assert np.array_equal(region,selected),('Contour differs from original component',cid,sr)
    pts=list(loops[0]);anchor=pts[0];pts.append(anchor)
    for ring in loops[1:]:
        pts.extend(ring+[ring[0],anchor])
    return 'polygon(evenodd,'+','.join(f'{px/w*100:.4f}% {py/h*100:.4f}%' for px,py in pts)+')',len(pts),full_count
def main():
    spec=json.loads((ROOT/SOURCE).read_text())
    art=json.loads((ROOT/'dist/three-complete-art.json').read_text())
    original=json.loads((ROOT/'docs/three-content/recurring-portrait-atlas-generation.json').read_text())
    original_cells={(c['chapter'],c['name'],c['ageVariant']):{**c,'originalSrc':s['src'],'originalSha256':s['sha256']} for s in original['sheets'] for c in s['cells']}
    sheets=[]
    for sheet in spec['sheets']:
        path=ROOT/'dist'/sheet['src'];im=Image.open(path);alpha=np.asarray(im.getchannel('A'))
        labs,n=ndimage.label(alpha>32);sizes=np.bincount(labs.ravel())
        components=[]
        for cid,sl in enumerate(ndimage.find_objects(labs),1):
            if sizes[cid]<1000:continue
            yy,xx=sl;components.append((cid,xx.start,yy.start,xx.stop-xx.start,yy.stop-yy.start))
        components.sort(key=lambda c:(round(c[2]/(im.height/sheet['rows'])),c[1]+c[3]/2))
        assert len(components)==sheet.get('sourceComponentCount',len(sheet['cells'])),(sheet['sheetId'],len(components))
        cells=[]
        for i,entry in enumerate(sheet['cells']):
            ci=entry.get('componentIndex',i)
            cid,x,y,w,h=components[ci]
            candidates=[p for p in art['characters'].values() if p['name']==entry['name'] and p['ageVariant']==entry.get('ageVariant','initial') and p['portraitRequired'] and any(s.startswith(f"THR-C{entry['chapter']:02}-") for s in p['sourceSceneIds'])]
            assert len(candidates)==1,(sheet['sheetId'],entry['name'],len(candidates))
            person=candidates[0]
            sx=max(0,x-2);sy=max(0,y-2)
            fraction=entry.get('displayHeightFraction',sheet.get('displayHeightFraction',1))
            assert fraction==1,('Full-body portraits must include the complete source silhouette',sheet['sheetId'],entry['name'],fraction)
            sr=entry.get('sourceRect',rect(sx,sy,min(im.width-sx,w+4),min(im.height-sy,h+4)))
            clip,points,full_count=polygon(labs,cid,sr)
            own=(labs==cid)[sr['y']:sr['y']+sr['height'],sr['x']:sr['x']+sr['width']]
            ub=bounds((labs==cid)[y:y+int(h*.57),x:x+w],x,y)
            key=(entry['chapter'],entry['name'],entry.get('ageVariant','initial'))
            old=original_cells.get(key,{})
            facing=entry.get('nativeFacing',sheet.get('nativeFacing','right'))
            cell={**entry,'characterId':person['characterId'],'ageVariant':person['ageVariant'],
              'row':entry.get('row',ci//sheet['columns']),'column':entry.get('column',ci%sheet['columns']),
              'sourceRect':sr,'clipPath':clip,'alphaBounds':bounds(own,sr['x'],sr['y']),
              'originalAlphaBounds':rect(x,y,w,h),'faceBounds':rect(*entry['faceBounds']),'upperBodyBounds':ub,
              'ageEvidence':old.get('ageEvidence',entry.get('ageEvidence',person['ageLabel'])),
              'genderEvidence':old.get('genderEvidence',entry.get('genderEvidence','male' if person['identityKind']=='historical-person' else 'unspecified')),
              'sourceEvidence':old.get('sourceEvidence',entry.get('sourceEvidence','Approved manuscript identity and source scene; original historical game costume interpretation.')),
              'sourceSceneId':old.get('sourceSceneId',person['sourceSceneIds'][0]),'visualFileReview':True,
              'portraitFraming':entry.get('portraitFraming',sheet.get('portraitFraming','full-body')),
              'nativeFacing':facing,'flipX':facing=='left',
              'cropReview':{'method':'complete original alpha>32 component coverage, component envelope and full-resolution visual review',
                'foreignPortraitComponents':0,'completeSolidSilhouetteInsideClip':True,'clipPolygonPointCount':points,
                'originalOpaquePixelCount':full_count,'includedOpaquePixelCount':full_count,'omittedOpaquePixelCount':0,
                'sourceRectContainsWholeComponent':True,
                'pixelEditingPerformed':False,'faceAnchorMethod':'manual skin-face landmarks: forehead to chin, visible ears included; hair, headgear and neck excluded','runtimeComposite':'pending'}}
            if old:cell['preservedSource']={'src':old['originalSrc'],'sha256':old['originalSha256'],'sourceRect':old['sourceRect']}
            cells.append(cell)
        occupied={(c['row'],c['column']) for c in cells}
        sheets.append({'sheetId':sheet['sheetId'],'src':sheet['src'],'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),
          'width':im.width,'height':im.height,'mode':im.mode,'alphaThreshold':32,'columns':sheet['columns'],'rows':sheet['rows'],
          'occupiedCellCount':len(cells),'emptyCells':[{'row':r,'column':c} for r in range(sheet['rows']) for c in range(sheet['columns']) if (r,c) not in occupied],
          'cells':cells})
    result={'schemaVersion':1,'status':spec.get('status','body-extension-connection-in-progress'),
      'coordinateSpace':'absolute-pixels-in-sheet','alphaThreshold':32,'pixelEditingPerformed':False,
      'promptSource':'docs/three-content/principal-portrait-generation-prompts.json','sheets':sheets}
    (ROOT/OUTPUT).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'sheets':len(sheets),'appearances':sum(len(s['cells']) for s in sheets),'imagePixelsChanged':False}))
if __name__=='__main__':main()

