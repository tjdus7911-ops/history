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
def polygon(labels,cid,sr):
    x,y,w,h=(sr[k] for k in ('x','y','width','height'))
    selected=labels[y:y+h,x:x+w]==cid
    region=np.zeros((h,w),dtype=bool)
    left,right=[],[]
    for top in range(0,h):
        bottom=top+1
        ys,xs=np.where(selected[top:bottom])
        if not len(xs):continue
        bottom=top+int(ys.max())+1
        top+=int(ys.min())
        lo=max(0,int(xs.min())-1);hi=min(w,int(xs.max())+2)
        foreign=(labels[y+top:y+bottom,x+lo:x+hi]!=0)&(labels[y+top:y+bottom,x+lo:x+hi]!=cid)
        if foreign.any():lo=int(xs.min());hi=int(xs.max())+1
        left.extend([(lo,top),(lo,bottom)])
        right.extend([(hi,top),(hi,bottom)])
        region[top:bottom,lo:hi]=True
    foreign=(labels[y:y+h,x:x+w]!=0)&(labels[y:y+h,x:x+w]!=cid)&region
    sizes=np.bincount(labels.ravel())
    big=[int(i) for i in np.unique(labels[y:y+h,x:x+w][foreign]) if sizes[i]>1000]
    assert not big,('Neighbor enters CSS clip',cid,sr,big)
    assert np.all(region[selected]),'Clip removes alpha>32 subject pixels'
    pts=[]
    for point in left+right[::-1]:
        if pts and point==pts[-1]:continue
        while len(pts)>1 and (pts[-1][0]-pts[-2][0])*(point[1]-pts[-1][1]) == (pts[-1][1]-pts[-2][1])*(point[0]-pts[-1][0]):
            pts.pop()
        pts.append(point)
    return 'polygon('+','.join(f'{px/w*100:.4f}% {py/h*100:.4f}%' for px,py in pts)+')',len(pts)
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
            sr=entry.get('sourceRect',rect(sx,sy,min(im.width-sx,w+4),min(im.height-sy,int(h*fraction)+4)))
            clip,points=polygon(labs,cid,sr)
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
              'portraitFraming':entry.get('portraitFraming',sheet.get('portraitFraming','head-to-knees')),
              'nativeFacing':facing,'flipX':facing=='left',
              'cropReview':{'method':'alpha>32 component envelope and full-resolution visual review',
                'foreignPortraitComponents':0,'completeSolidSilhouetteInsideClip':True,'clipPolygonPointCount':points,
                'pixelEditingPerformed':False,'faceAnchorMethod':'manual visual region excluding headgear','runtimeComposite':'pending'}}
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

