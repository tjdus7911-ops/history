"""Measure alpha and skin regions without rewriting the generated PNGs."""
import json,hashlib
from pathlib import Path
from collections import deque
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
plan=json.loads((ROOT/'docs/three-content/support-portrait-plan.json').read_text(encoding='utf-8'))
missing=json.loads((ROOT/'docs/three-content/support-npc-before.json').read_text(encoding='utf-8'))
solo=next(p for p in missing if p['scene']=='THR-C02-S03' and '장교' in p['speaker'])
plans=[{'id':'support-c02-s03-officer-v1','people':[solo],'columns':1,'rows':1}]+plan
for item in plans:
 if item['id']=='support-atlas-26-v1':item.update(columns=1,rows=1)
out={'version':1,'reviewMethod':'Generated images visually inspected for distinct figures; alpha/skin geometry measured without image rewriting.','sheets':[]}
def box(mask,ox=0,oy=0):
 ys,xs=np.where(mask);return {'x':int(xs.min())+ox,'y':int(ys.min())+oy,'width':int(xs.max()-xs.min()+1),'height':int(ys.max()-ys.min()+1)}
def component(mask):
 seen=np.zeros(mask.shape,dtype=bool);best=[];hh,ww=mask.shape
 for y,x in zip(*np.where(mask)):
  if seen[y,x]:continue
  queue=deque([(y,x)]);seen[y,x]=True;found=[]
  while queue:
   yy,xx=queue.popleft();found.append((yy,xx))
   for ny,nx in [(yy-1,xx),(yy+1,xx),(yy,xx-1),(yy,xx+1)]:
    if 0<=ny<hh and 0<=nx<ww and mask[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;queue.append((ny,nx))
  if len(found)>len(best):best=found
 result=np.zeros(mask.shape,dtype=bool)
 for y,x in best:result[y,x]=True
 return result
for sheet in plans:
 path=ROOT/'dist/assets/ancient/three-complete/characters'/ (sheet['id']+'.png')
 if not path.exists():continue
 a=np.array(Image.open(path).convert('RGBA')).astype('int32');h,w=a.shape[:2];cols=sheet.get('columns',3);rows=sheet.get('rows',2)
 record={'sheetId':sheet['id'],'src':path.relative_to(ROOT/'dist').as_posix(),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'width':w,'height':h,'columns':cols,'rows':rows,'cells':[]}
 for i,p in enumerate(sheet['people']):
  row,col=divmod(i,cols);x0=round(col*w/cols);x1=round((col+1)*w/cols);y0=round(row*h/rows);y1=round((row+1)*h/rows);cell=a[y0:y1,x0:x1];alpha=cell[:,:,3]>64
  rect={'x':x0,'y':y0,'width':x1-x0,'height':y1-y0};bounds=box(alpha,x0,y0)
  r,g,b=cell[:,:,0],cell[:,:,1],cell[:,:,2];skin=(r>140)&(g>90)&(b>65)&(r>g+10)&(g>b+10)&alpha
  skin[bounds['y']-y0+int(bounds['height']*.24):,:]=False
  face=box(component(skin),x0,y0)
  # The lower neck belongs to the torso, not the facial scale anchor.
  face['height']=min(face['height'],round(face['width']*1.3))
  record['cells'].append({'characterId':p['id'],'name':p['speaker'],'sourceSceneId':p['scene'],'row':row,'column':col,'sourceRect':rect,'faceBounds':face,'alphaBounds':bounds,'upperBodyBounds':{'x':bounds['x'],'y':bounds['y'],'width':bounds['width'],'height':round(bounds['height']*.58)},'ageEvidence':'child (authored role)' if any(t in p['speaker'] for t in ['아이','학동','조카']) else 'adult fictional role','sourceEvidence':p['text'],'nativeFacing':'left' if sheet['id'] in {'support-atlas-25-v1','support-atlas-26-v1'} or (sheet['id'],i) in {('support-atlas-23-v1',0),('support-atlas-23-v1',1),('support-atlas-23-v1',2),('support-atlas-23-v1',4),("support-atlas-19-v1",0),("support-atlas-19-v1",1),("support-atlas-19-v1",3),("support-atlas-20-v1",0),("support-atlas-20-v1",1)} else 'right','flipX':sheet['id'] in {'support-atlas-25-v1','support-atlas-26-v1'} or (sheet['id'],i) in {('support-atlas-23-v1',0),('support-atlas-23-v1',1),('support-atlas-23-v1',2),('support-atlas-23-v1',4),("support-atlas-19-v1",0),("support-atlas-19-v1",1),("support-atlas-19-v1",3),("support-atlas-20-v1",0),("support-atlas-20-v1",1)},'visualFileReview':True})
 out['sheets'].append(record)
(ROOT/'docs/three-content/support-portrait-generation.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Measured',len(out['sheets']),'sheets',sum(len(s['cells']) for s in out['sheets']),'characters')
