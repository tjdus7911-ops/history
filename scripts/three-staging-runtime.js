(function(root) {
  'use strict';
  const DATA = /*__THREE_STAGING_DATA__*/;
  const VALID_PHASES = new Set(['main','choice','branch','join']);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const sourceId = source => source?.sceneId || source?.threeSource?.sceneId;
  const rawSource = source => source?.threeSource || source || {};
  const definition = source => DATA.scenes[sourceId(source)];
  const entryId = state => state?.entry?.lineId || '';
  const phase = state => state?.phase || 'main';
  const choice = state => typeof state?.choiceId === 'string' ? state.choiceId : null;

  function context(source, state = {}) {
    const raw = rawSource(source), data = definition(source);
    // Some scenes end the main dialogue inside a book and return to the
    // people when the response menu opens. The last main line is still the
    // menu's entry, so its context must not leak into the response phase.
    if (phase(state) === 'choice') return raw.presentationContext || data?.presentationContext || 'scene';
    const id = entryId(state);
    if (DATA.contextOverrides[id]) return DATA.contextOverrides[id];
    return state.entry?.presentationContext || state.entry?.context || data?.lines[id]?.presentationContext || raw.presentationContext || 'scene';
  }

  function linePosition(data, lineId) {
    if (!data || !lineId) return null;
    const main = data.phaseLines.main.indexOf(lineId);
    if (main >= 0) return {phase:'main', index:main};
    const join = data.phaseLines.join.indexOf(lineId);
    if (join >= 0) return {phase:'join', index:join};
    for (const [choiceId, lines] of Object.entries(data.phaseLines.branch)) {
      const index = lines.indexOf(lineId);
      if (index >= 0) return {phase:'branch', index, choiceId};
    }
    return null;
  }

  function reached(data, state, lineId) {
    if (!lineId) return true;
    const target = linePosition(data, lineId), here = linePosition(data, entryId(state));
    const activePhase = phase(state);
    if (!target || !VALID_PHASES.has(activePhase)) return false;
    if (target.phase === 'main') {
      if (['choice','branch','join'].includes(activePhase)) return true;
      return here?.phase === 'main' && here.index >= target.index;
    }
    if (target.phase === 'branch') {
      if (choice(state) !== target.choiceId) return false;
      if (activePhase === 'join') return true;
      return activePhase === 'branch' && here?.phase === 'branch' && here.choiceId === target.choiceId && here.index >= target.index;
    }
    return activePhase === 'join' && here?.phase === 'join' && here.index >= target.index;
  }

  function active(source, state, rule) {
    const data = definition(source), activePhase = phase(state);
    if (!data || !VALID_PHASES.has(activePhase)) return false;
    if (rule.phases && !rule.phases.includes(activePhase)) return false;
    if (rule.lineIds && !rule.lineIds.includes(entryId(state))) return false;
    if (rule.scope === 'scene' && context(source,state) === 'record') return false;
    if (rule.scope === 'record' && context(source,state) !== 'record') return false;
    if (rule.choiceId && (!['branch','join'].includes(activePhase) || choice(state) !== rule.choiceId)) return false;
    for (const [sceneId, expected] of Object.entries(rule.requiresChoices || {})) {
      const actual = state.choicesByScene?.[sceneId];
      if (typeof actual !== 'string' || (Array.isArray(expected) ? !expected.includes(actual) : actual !== expected)) return false;
    }
    if (!reached(data,state,rule.from)) return false;
    if (rule.before && reached(data,state,rule.before)) return false;
    if (rule.through && reached(data,state,rule.through) && entryId(state) !== rule.through) return false;
    return true;
  }

  function matching(source, state, key) {
    return (definition(source)?.cues[key] || []).filter(rule => active(source,state,rule));
  }

  function actorVisibility(source, state = {}) {
    const data = definition(source);
    if (!data) return {hideNpc:false,hidePlayer:false};
    const line = data.lines[entryId(state)] || {};
    const speakerType = state.entry?.speakerType || line.kind;
    const blank = context(source,state) === 'record' || (phase(state) !== 'choice' && ['narration','thought'].includes(speakerType));
    const result = {hideNpc:blank,hidePlayer:blank};
    for (const rule of matching(source,state,'visibility')) {
      if (rule.hideNpc) result.hideNpc = true;
      if (rule.hidePlayer) result.hidePlayer = true;
    }
    return result;
  }

  function backgroundOverride(source, state = {}) {
    const rule = matching(source,state,'backgrounds').at(-1);
    return rule ? DATA.backgrounds[rule.assetId] || null : null;
  }

  function portraitOverride(source, state = {}, character) {
    const characterId = typeof character === 'string' ? character : character?.characterId;
    if (!characterId) return null;
    const matches = matching(source,state,'portraits').filter(rule => DATA.variants[rule.variant]?.characterId === characterId);
    matches.sort((a,b) => (a.priority || 0) - (b.priority || 0));
    return matches.length ? DATA.variants[matches.at(-1).variant] : null;
  }

  function resolve(source, state = {}) {
    const data = definition(source), empty = {sceneId:sourceId(source),context:'scene',props:[],caption:null,motions:{},hand:null};
    if (!data || !VALID_PHASES.has(phase(state))) return empty;
    const seen = new Set(), props = [];
    for (const rule of matching(source,state,'props')) {
      const art = DATA.props[rule.propId], key = rule.propId + ':' + (rule.label || '');
      if (!art || seen.has(key)) continue;
      seen.add(key); props.push({...art,label:rule.label || art.label,cueId:rule.cueId});
    }
    const displayContext = context(source,state);
    if (displayContext === 'record' && !props.length && DATA.props['record-book']) props.push({...DATA.props['record-book'],label:'서아가 펼친 기록책',cueId:'record-context'});
    const caption = matching(source,state,'captions').at(-1) || null, motions = {};
    for (const rule of matching(source,state,'motions')) motions[rule.target] = rule.value;
    const handRule = matching(source,state,'handActions').at(-1);
    return {sceneId:data.sceneId,context:displayContext,props,caption,motions,hand:handRule ? DATA.hands[handRule.variant] || null : null};
  }

  function spriteStyle(art, size = 1) {
    const r = art.sourceRect, width = art.sheetWidth, height = art.sheetHeight;
    const aspect = r.width / r.height, w = Math.min(1,aspect)*size, h = Math.min(1,1/aspect)*size;
    const xp = width === r.width ? 0 : r.x/(width-r.width)*100, yp = height === r.height ? 0 : r.y/(height-r.height)*100;
    return "background-image:url('"+art.src+"');background-size:"+(width/r.width*100)+'% '+(height/r.height*100)+'%;background-position:'+xp+'% '+yp+'%;--prop-w:'+w+';--prop-h:'+h;
  }

  function layers(source, state = {}) {
    const view = resolve(source,state);
    if (!view.props.length && !view.caption && !view.hand && !Object.keys(view.motions).length) return '';
    const props = view.props.map(prop => '<span class="three-staged-prop" data-three-prop="'+esc(prop.id)+'" data-prop-label="'+esc(prop.label)+'" data-staging-cue="'+esc(prop.cueId)+'" role="img" aria-label="'+esc(prop.label)+'"><span class="three-prop-sprite" style="'+esc(spriteStyle(prop))+'"></span></span>').join('');
    const hand = view.hand ? '<div class="three-staging-hand" data-hand-state="'+esc(view.hand.id)+'"><span class="three-prop-sprite" style="'+esc(spriteStyle(view.hand,2.6))+'"></span></div>' : '';
    // Captions are returned by resolve() for the existing context-label slot.
    // The layer adds physical artwork only, never an inventory/card interface.
    return '<aside class="three-staging-layer" data-staging-scene="'+esc(view.sceneId)+'" data-staging-line="'+esc(entryId(state))+'" data-staging-context="'+esc(view.context)+'" data-player-motion="'+esc(view.motions.player || '')+'" data-npc-motion="'+esc(view.motions.npc || '')+'" aria-hidden="true">'+(props?'<div class="three-staging-props">'+props+'</div>':'')+hand+'</aside>';
  }

  root.THREE_STAGING = Object.freeze({version:DATA.contentVersion,context,layers,resolve,actorVisibility,backgroundOverride,portraitOverride,
    audit:Object.freeze({sceneCount:Object.keys(DATA.scenes).length,propCount:Object.keys(DATA.props).length,variantCount:Object.keys(DATA.variants).length,sourceManuscriptSha256:DATA.sourceManuscriptSha256}),
    // Test/debug access is immutable by convention and never reads or writes
    // application saves, timers, cursors or DOM.
    sourceCueIds:source => (definition(source)?.cueIds || []).slice()});
})(globalThis);
