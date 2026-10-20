"""Deterministically import the complete attached manuscript, never synthesize dialogue or exams."""
import re,json,hashlib,pathlib,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
source=ROOT/'docs/proto-v4/manuscript.md'
text=source.read_text(encoding='utf-8'); sha=hashlib.sha256(text.encode()).hexdigest()
cat={q['officialQuestionId']:q for q in json.loads((ROOT/'dist/official-exam-catalog.json').read_text(encoding='utf-8'))}
supp=json.loads((ROOT/'docs/story-exams/supplement-60-basic.json').read_text(encoding='utf-8'))
def find_rows(v):
 if isinstance(v,dict):
  if 'officialQuestionId' in v: yield v
  for x in v.values(): yield from find_rows(x)
 elif isinstance(v,list):
  for x in v: yield from find_rows(x)
for q in find_rows(supp):cat.setdefault(q['officialQuestionId'],q)
circles='①②③④⑤'
questions=[]
for block in re.split(r'^#### 제',text,flags=re.M)[1:]:
 block=block.split('\n### ')[0]
 m=re.search(r'배치: (\d-\d) / ID: `(official-[^`]+)` / 정답: ([①②③④⑤])',block)
 if not m:continue
 scene,oid,answer=m.groups(); src=cat[oid]
 pick=lambda key:re.search(r'^- '+key+r': (.+)$',block,re.M).group(1)
 opts=re.findall(r'^  - ([①②③④⑤]) (.+?) → (.+)$',block,re.M)
 assert len(opts) in [4,5],oid
 q={**src,'officialQuestionId':oid,'question':pick('발문'),'clue':pick('자료 핵심'),'choices':[o[1] for o in opts],'choiceExplanations':[o[2] for o in opts], 'answerIndex0':circles.index(answer),'answerNumber1':circles.index(answer)+1,'choiceCount':len(opts),'sceneKey':scene,'learningKeywordIds':[], 'questionImage':re.search(r'원문 이미지 경로: `([^`]+)`',block).group(1).removeprefix('dist/'),'proposed':{'editorialFocusSummary':pick('배치 이유'),'requiresReadSceneIds':[],'playExplanation':pick('자료 핵심')+' 정답은 '+answer+' '+pick('정답 내용')}}
 assert src.get('answer',q['answerIndex0'])==q['answerIndex0'],oid
 q['questionImageSha256']=src.get('detailImageSha256',src.get('questionImageSha256',src.get('sourceImageSha256','')))
 questions.append(q)
assert len(questions)==26 and len({q['officialQuestionId'] for q in questions})==26
# Separately reviewed official originals supplement, without changing the manuscript.
additions_path=ROOT/'docs/proto-v4/exam-additions.json'
additions_text=additions_path.read_text(encoding='utf-8'); additions=json.loads(additions_text)
for q in questions:q['sceneKey']=additions.get('placementOverrides',{}).get(q['officialQuestionId'],q['sceneKey'])
for q in additions['questions']:
 assert q['officialQuestionId'] not in {x['officialQuestionId'] for x in questions}
 assert q['answer']==q['answerIndex0'] and len(q['choices'])==len(q['choiceExplanations'])==q['choiceCount']
 assert hashlib.sha256((ROOT/'dist'/q['questionImage']).read_bytes()).hexdigest()==q['questionImageSha256']
 questions.append(q)
assert len(questions)==len({q['officialQuestionId'] for q in questions})
bg=['buyeo-village','buyeo-ritual','buyeo-village','goguryeo-village','goguryeo-village','goguryeo-house','goguryeo-village','okjeo-coast','okjeo-house','okjeo-tomb','dongye-boundary','dongye-village','dongye-village','dongye-village','samhan-sodo','samhan-farm','byeonhan-port']
chapters=[];learning=[];queues=[];i=0
for ch in re.split(r'^## CH\.',text,flags=re.M)[1:]:
 header=ch.splitlines()[0];num=int(header[:2]);title=header[3:].strip();country=title.split(' — ')[0]
 chapter={'number':num,'chapterNumber':num,'title':title,'arc':'동생이 남긴 표식을 따라 '+country+'의 생활을 배운다.','scenes':[]}
 for block in re.split(r'^### ',ch,flags=re.M)[1:]:
  sm=re.match(r'(\d)-(\d)\. (.+)',block)
  if not sm:continue
  c,s,title=sm.groups();s=int(s);key=f'{c}-{s}';sid=f'proto_ch{int(c):02}_s{s}'
  setup=re.search(r'^배경: (.+)',block,re.M).group(1)
  body=block.split('실제 기출 연결')[0].splitlines()[2:]
  outro=block.split('[문제 종료 뒤 마지막 대화]')[1].split('\n## ')[0] if '[문제 종료 뒤 마지막 대화]' in block else ''
  sc={'number':s,'sceneId':sid,'title':title,'country':country,'period':'원삼국 시대','place':setup.split('. 핵심:')[0],'location':country+' · '+setup.split('. 핵심:')[0],'background':setup,'backgroundId':bg[i],'main':[],'choices':[],'join':[],'outro':[],'learning':[],'stageDirections':[]}
  phase='main';target=sc['main'];direction='';counter=0;black=key=='1-1'
  def line(speaker,raw):
   global counter
   counter+=1
   emph=re.findall(r'\*\*(.+?)\*\*',raw)
   return {'speaker':speaker,'text':raw.replace('**',''),'emphasis':emph,'lineId':sid+f'-l{counter:03}','learningKeywordIds':[],'stageDirection':direction,'blackout':black,'expression':'worried' if re.search('걱정|무서|미안|다치',raw) else 'smile' if re.search('고맙|좋아|웃|함께',raw) else 'neutral'}
  for raw in body:
   raw=raw.strip()
   if not raw:continue
   if raw.startswith('말 선택:'):phase='choice';continue
   if raw.startswith('['):
    direction=raw.strip('[]');sc['stageDirections'].append(direction)
    if '차가운 들판' in direction:black=False
    if raw.startswith('[합류'):phase='join';target=sc['join']
    continue
   m=re.match(r'([AB])\. “(.+)”',raw)
   if m:
    choice={'id':sid+'-'+m[1],'label':m[2].replace('**',''),'emphasis':re.findall(r'\*\*(.+?)\*\*',m[2]),'reply':[]}
    sc['choices'].append(choice);target=choice['reply'];continue
   m=re.match(r'(?:→ )?([^:]+): “(.+)”$',raw)
   if m:target.append(line(*m.groups()));direction=''
  for raw in outro.splitlines():
   m=re.match(r'([^:]+): “(.+)”$',raw)
   if m:sc['outro'].append(line(*m.groups()))
   elif raw.startswith('['):sc['stageDirections'].append(raw.strip('[]'))
  assert sc['main'] and sc['join'] and len(sc['choices'])==2,key
  all_lines=sc['main']+sc['join']+sc['outro']+[l for c in sc['choices'] for l in c['reply']]
  words=list(dict.fromkeys(w for l in all_lines for w in l['emphasis']))
  # Repeat emphasis for every occurrence of a marked learning term, including unmarked repeats.
  for n,w in enumerate(words):
   topic={'id':sid+f'-k{n+1}','title':w,'keyword':w,'firstSceneId':sid,'sceneIds':[sid],'facts':list(dict.fromkeys(l['text'] for l in all_lines if w in l['text'])),'questionIds':[q['officialQuestionId'] for q in questions if q['sceneKey']==key]}
   sc['learning'].append(topic);learning.append(topic)
   for l in all_lines:
    if len(w)>1 and w in l['text'] or w in l['emphasis']:l['emphasis']=list(dict.fromkeys(l['emphasis']+[w]));l['learningKeywordIds'].append(topic['id'])
  queue={'sceneId':sid,'afterLineId':sc['join'][-1]['lineId'],'officialQuestionIds':[q['officialQuestionId'] for q in questions if q['sceneKey']==key],'targetCount':3}
  assert len(queue['officialQuestionIds'])<=3,key
  queue['missingQuestionCount']=3-len(queue['officialQuestionIds']);queues.append(queue);sc['quizAfter']=queue
  for q in questions:
   if q['sceneKey']==key:q['learningKeywordIds']=[l['id'] for l in sc['learning']];q['proposed']['requiresReadSceneIds']=[sid]
  chapter['scenes'].append(sc);i+=1
 chapters.append(chapter)
assert [len(c['scenes']) for c in chapters]==[3,4,3,4,3]
scenes=[s for c in chapters for s in c['scenes']]
for n,s in enumerate(scenes):s['nextSceneId']=scenes[n+1]['sceneId'] if n+1<len(scenes) else None
terms={w for sc in scenes for section in ['main','join','outro'] for l in sc[section] for w in l['emphasis'] if len(w)>1}
for sc in scenes:
 for l in sc['main']+sc['join']+sc['outro']+[l for c in sc['choices'] for l in c['reply']]:
  l['emphasis']=sorted(set(l['emphasis'])|{w for w in terms if w in l['text']},key=lambda w:(-len(w),w))
 for choice in sc['choices']:choice['emphasis']=sorted(set(choice['emphasis'])|{w for w in terms if w in choice['label']},key=lambda w:(-len(w),w))
out={'schemaVersion':2,'contentVersion':'proto-five-countries-17-scenes-v4','title':'눈떠보니 원삼국 — 동생이 남긴 길','sourcePath':'docs/proto-v4/manuscript.md','sourceSha256':sha,'saveCompatibility':{'previousContentVersion':'proto-compact-5-scenes-v2','previousSceneCounts':{},'legacyCompletionMilestones':{}},'chapters':chapters,'learning':learning,'examPlan':{'questions':questions,'queues':queues,'targetSlots':51,'unfilledSlots':51-len(questions),'blockedCandidates':[],'revision':2,'additionsSourceSha256':hashlib.sha256(additions_text.encode()).hexdigest()},'counts':{'sceneCount':17,'mainChapterCount':5,'choiceSceneCount':17,'choiceAlternatives':34,'officialQuestions':len(questions),'authoredUtterances':sum(len(s['main'])+len(s['join'])+len(s['outro'])+sum(len(c['reply']) for c in s['choices']) for s in scenes),'learningTopicCount':len(learning)}}
payload=json.dumps(out,ensure_ascii=False,indent=2)+'\n'
js='/* Generated from docs/proto-v4/manuscript.md; do not edit. */\nconst PROTO_REVISION_SOURCE_SHA256='+json.dumps(sha)+';\nconst PROTO_REVISION_SOURCE='+payload.strip()+';\nconst PROTO_STORY_SCRIPT=PROTO_REVISION_SOURCE.chapters;\nconst PROTO_LEGACY_STUDY_QUESTIONS=[];\n'
for path,data in [('dist/proto-story-script.json',payload),('dist/proto-story-script.js',js)]:
 p=ROOT/path
 if '--check' in sys.argv:assert p.read_text(encoding='utf-8')==data,path+' is stale'
 else:p.write_text(data, encoding='utf-8')
print(json.dumps(out['counts'],ensure_ascii=False))
