#!/usr/bin/env python3
"""Validate authored staging links and compile the pure browser presentation API.

This script reads the approved story/art without editing either. Image pixels,
dialogue order, scoring, saves and cursor progression are outside its scope.
"""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def read(relative):
    return json.loads((ROOT / relative).read_text(encoding='utf-8'))

def require(condition, message):
    if not condition:
        raise AssertionError(message)

def checked_file(src, sha=None):
    path = ROOT / 'dist' / src
    require(path.is_file(), f'Missing staging asset: {src}')
    actual = hashlib.sha256(path.read_bytes()).hexdigest()
    if sha:
        require(actual == sha, f'Staging asset changed: {src}')
    return actual

def validate_rect(art):
    r = art.get('sourceRect') or art.get('sprite', {}).get('sourceRect')
    width = art.get('sheetWidth') or art.get('sprite', {}).get('sheetWidth')
    height = art.get('sheetHeight') or art.get('sprite', {}).get('sheetHeight')
    require(r is not None and width and height, f'Missing source rectangle: {art.get("id")}')
    require(r['x'] >= 0 and r['y'] >= 0 and r['width'] > 0 and r['height'] > 0 and
            r['x'] + r['width'] <= width and r['y'] + r['height'] <= height,
            f'Out-of-bounds staging rectangle: {art.get("id")}')

def build():
    story = read('dist/three-story-script.json')
    cues = read('docs/three-content/staging-cues.json')
    props = read('docs/three-content/staging-prop-generation.json')
    acting = read('docs/three-content/staging-acting-generation.json')
    art = read('dist/three-complete-art.json')
    source_photos = art['sourcePhotos']
    require(len(source_photos) == 3, 'Expected three original genealogy photographs')
    for photo in source_photos:
        require(photo['sourceKind'] == 'user-original-photo', 'Genealogy must use the original photographs')
        checked_file(photo['src'], photo['sha256'])
    require(story['source']['sha256'] == cues['sourceManuscriptSha256'], 'Staging manuscript version differs')
    for record in props['generation'] + acting['generation']:
        checked_file(record['repoSrc'], record['sha256'])
    for asset in list(props['props'].values()) + list(acting['hands'].values()) + list(acting['variants'].values()):
        checked_file(asset['src'], asset.get('sha256'))
        validate_rect(asset)
        for surface in asset.get('photoSurfaces', []):
            rect = asset['sprite']['sourceRect']
            require(surface['photoNumber'] in [1,2,3], 'Unknown original genealogy photograph')
            require(surface['width'] > 0 and surface['height'] > 0 and
                    surface['x'] >= rect['x'] and surface['y'] >= rect['y'] and
                    surface['x'] + surface['width'] <= rect['x'] + rect['width'] and
                    surface['y'] + surface['height'] <= rect['y'] + rect['height'],
                    f'Genealogy surface outside character crop: {asset["id"]}')
        if asset.get('photoSurfaces'):
            require(sorted(surface['photoNumber'] for surface in asset['photoSurfaces']) == [1,2,3], 'All three original genealogy photographs must remain inserted')
    scenes = story['prologue']['scenes'] + [scene for chapter in story['chapters'] for scene in chapter['scenes']]
    require(len(scenes) == 218, 'Expected 218 approved playable scenes')
    scene_ids = {scene['sceneId'] for scene in scenes}
    require(set(cues['scenes']) <= scene_ids, 'Staging contains an unknown scene')
    choices = {scene['sceneId']:{choice['choiceId'] for choice in scene['choices']} for scene in scenes}
    result, audit_scenes, all_lines = {}, [], set()
    cue_count = 0
    for scene in scenes:
        scene_id = scene['sceneId']
        lines = scene['main'] + scene['join'] + [line for choice in scene['choices'] for line in [choice['spokenLine']] + choice['reply']]
        line_ids = {line['lineId'] for line in lines}
        all_lines.update(line_ids)
        authored = cues['scenes'].get(scene_id, {})
        cue_ids, counts = [], {}
        for group, rules in authored.items():
            require(isinstance(rules,list), f'Invalid staging group: {scene_id}/{group}')
            counts[group] = len(rules)
            for index, rule in enumerate(rules):
                rule['cueId'] = f'{scene_id}:{group}:{index+1}'
                cue_ids.append(rule['cueId'])
                for field in ['from','through','before']:
                    require(not rule.get(field) or rule[field] in line_ids, f'Unknown line: {rule.get(field)}')
                for line_id in rule.get('lineIds', []):
                    require(line_id in line_ids, f'Unknown caption line: {line_id}')
                require(not rule.get('choiceId') or rule['choiceId'] in choices[scene_id], f'Unknown local choice: {rule.get("choiceId")}')
                for previous, selected in rule.get('requiresChoices', {}).items():
                    expected = selected if isinstance(selected,list) else [selected]
                    require(previous in choices and set(expected) <= choices[previous], f'Unknown historical choice: {previous}/{selected}')
                    require(previous != scene_id, 'Use local choiceId for current-scene branch conditions')
                if group == 'props': require(rule['propId'] in props['props'], f'Missing prop {rule["propId"]}')
                if group == 'portraits': require(rule['variant'] in acting['variants'], f'Missing acting variant {rule["variant"]}')
                if group == 'backgrounds': require(rule['assetId'] in acting['backgrounds'], f'Missing background {rule["assetId"]}')
                if group == 'handActions': require(rule['variant'] in acting['hands'], f'Missing hand action {rule["variant"]}')
                if group == 'bookActions': require(rule['variant'] in ['ground','lifting','held'], 'Unknown arrival book state')
                if group == 'actorPresence':
                    person = art['characters'].get(rule['characterId'])
                    require(person and person['name'] == rule['characterName'], 'Unknown visual cast identity')
                    require(rule['characterName'] in scene['cast'], 'Visual cast absent from the approved scene')
                    require(rule['position'] == person['position'], 'Visual cast position differs from approved art')
        cue_count += len(cue_ids)
        record_lines = [line['lineId'] for line in lines if cues.get('contextOverrides',{}).get(line['lineId'],line.get('presentationContext',scene.get('presentationContext','scene'))) == 'record']
        result[scene_id] = {
            'sceneId':scene_id,'presentationContext':scene.get('presentationContext','scene'),
            'phaseLines':{'main':[line['lineId'] for line in scene['main']],
                          'join':[line['lineId'] for line in scene['join']],
                          'branch':{choice['choiceId']:[line['lineId'] for line in [choice['spokenLine']] + choice['reply']] for choice in scene['choices']}},
            'lines':{line['lineId']:{'kind':line['kind'],'speaker':line['speaker'],'presentationContext':line.get('presentationContext',scene.get('presentationContext','scene'))} for line in lines},
            'cues':authored,'cueIds':cue_ids}
        audit_scenes.append({'sceneId':scene_id,'authoredStaging':scene['staging'],
                             'runtimeCueCounts':counts,'runtimeCueIds':cue_ids,'recordLineIds':record_lines,
                             'status':'implemented-presentation-cues-awaiting-browser-review' if cue_ids or record_lines else 'existing-cast-background-and-dialogue-presentation',
                             'customIllustrationCompletion':'not-inferred-from-cue-count'})
    require(set(cues.get('contextOverrides',{})) <= all_lines, 'Unknown context override line')
    data = {'contentVersion':cues['contentVersion'],'sourceManuscriptSha256':cues['sourceManuscriptSha256'],
            'contextOverrides':cues.get('contextOverrides',{}),'props':props['props'],
            'variants':acting['variants'],'backgrounds':acting['backgrounds'],'hands':acting['hands'],
            'sourcePhotos':source_photos,'scenes':result}
    source = (ROOT/'scripts/three-staging-runtime.js').read_text(encoding='utf-8')
    require(source.count('/*__THREE_STAGING_DATA__*/') == 1, 'Missing or repeated staging data slot')
    compiled = source.replace('/*__THREE_STAGING_DATA__*/',json.dumps(data,ensure_ascii=False,separators=(',',':')))
    audit = {'schemaVersion':1,'status':'runtime-linked-cues-source-validated-browser-review-pending',
             'sourceManuscriptSha256':cues['sourceManuscriptSha256'],'sceneCount':len(scenes),
             'authoredUtteranceCount':len(all_lines),'explicitCueCount':cue_count,
             'scenesWithExplicitCues':sum(bool(scene['runtimeCueIds']) for scene in audit_scenes),
             'propImageCount':len(props['props']),'handActionImageCount':len(acting['hands']),
             'actorVariantImageCount':len(acting['variants']),'backgroundStateImageCount':len(acting['backgrounds']),
             'originalGenealogyPhotoCount':len(source_photos),
             'sourcePixelsEdited':False,'saveMutations':False,'cursorMutations':False,'autoAdvance':False,
             'runtimeVisualReviewComplete':False,
             'allAuthoredStagingVerified':False,
             'completionLedger':'docs/three-content/staging-completion-ledger.json',
             'sceneAudit':audit_scenes,
             'limitations':['Source line links and asset rectangles are validated separately from actual browser composition.',
                            'Generic props are original fictional illustrations, not archaeological or historical-document facsimiles.',
                            'An explicit presentation cue does not imply that every authored background detail, hand interaction or audio cue has a custom illustration.']}
    return {'dist/three-staging.js':compiled,'docs/three-content/staging-runtime-audit.json':json.dumps(audit,ensure_ascii=False,indent=2)+'\n'}, audit

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true')
    args = parser.parse_args()
    files,audit = build()
    for relative,content in files.items():
        path = ROOT/relative
        if args.check: require(path.is_file() and path.read_text(encoding='utf-8') == content,f'Stale staging output: {relative}')
        else: path.write_text(content,encoding='utf-8')
    print(json.dumps({key:audit[key] for key in ['sceneCount','authoredUtteranceCount','explicitCueCount','propImageCount','handActionImageCount','actorVariantImageCount','backgroundStateImageCount']},ensure_ascii=False))

if __name__ == '__main__':
    main()
