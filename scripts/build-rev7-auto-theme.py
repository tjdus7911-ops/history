#!/usr/bin/env python3
"""Generate dist/rev7-auto.css: a presentation-only override layer that re-maps the legacy warm
(beige / brown / gold) palette, large radii and brown shadows of the exam, OX, wrong-note and
record screens onto the Rev.7 tokens (white / navy / coral / teal, 3-8px radii).
Reads CSS only; never touches data or markup. Story / game stylesheets are intentionally not processed."""
import colorsys, re, sys
import tinycss2

SRC = ['editorial', 'exam-library', 'exam-memory', 'exam-memory-results', 'exam-memory-nav', 'exam-mobile', 'ox-quiz']
SKIP_SELECTOR = re.compile(r'conversation|stage|dialogue|game|story|scene|three-|proto-|\bmodal\b|sheet|toast|overlay|backdrop|scrim|hv-|\.hero|era-hero|era-detail-hero|season|chapter|status-modal|loading|splash|install', re.I)
COLOR = re.compile(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)')

def parse_hex(token):
    t = token.lower()
    if t.startswith('rgb'):
        nums = [float(x) for x in re.findall(r'[\d.]+', t)[:4]]
        r, g, b = nums[:3]; a = nums[3] if len(nums) > 3 else 1.0
        return r, g, b, a
    h = t[1:]
    if len(h) in (3, 4): h = ''.join(c * 2 for c in h)
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
    return r, g, b, a

def classify(token):
    r, g, b, a = parse_hex(token)
    if a < 0.2: return 'keep'
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    hue = h * 360
    warm = r >= b + 8 and (hue < 70 or hue > 340) and s > 0.04
    green = 70 <= hue <= 170 and s > 0.12 and g > r + 8
    red = (hue < 15 or hue > 340) and s > 0.35 and r > g + 40 and l < 0.55
    navy = 190 <= hue <= 260 and s > 0.12 and l < 0.40
    return dict(warm=warm, green=green, red=red, navy=navy, l=l, s=s, hue=hue)

def map_color(token, ctx):
    c = classify(token)
    if c == 'keep' or not isinstance(c, dict): return None
    l = c['l']
    if token.lower() in ('#fff', '#ffffff'): return None
    if c['green']:
        if ctx == 'bg': return 'var(--r7-teal-soft)' if l > 0.85 else 'var(--r7-teal)'
        if ctx == 'border': return 'var(--r7-teal-soft)' if l > 0.85 else 'var(--r7-teal)'
        return 'var(--r7-teal-ink)'
    if c['red']:
        if ctx == 'bg': return 'var(--r7-danger-soft)' if l > 0.85 else 'var(--r7-danger)'
        return 'var(--r7-danger)'
    if c['navy']:
        return 'var(--r7-ink)'
    if c['warm']:
        if ctx == 'bg':
            if l > 0.93: return 'var(--r7-sunken)'
            if l > 0.80: return 'var(--r7-line)'
            if l > 0.55: return 'var(--r7-line-strong)'
            return 'var(--r7-ink)'
        if ctx == 'border':
            return 'var(--r7-line)' if l > 0.70 else 'var(--r7-coral)'
        # text
        if l > 0.80: return 'var(--r7-line-strong)'
        if l > 0.55: return 'var(--r7-faint)'
        if c['s'] > 0.40 and l > 0.30: return 'var(--r7-coral-ink)'
        if l > 0.35: return 'var(--r7-sub)'
        return 'var(--r7-ink)'
    return None

def remap(value, ctx):
    changed = False
    def sub(m):
        nonlocal changed
        new = map_color(m.group(0), ctx)
        if new: changed = True; return new
        return m.group(0)
    out = COLOR.sub(sub, value)
    return out, changed

def radius(value):
    changed = False
    def sub(m):
        nonlocal changed
        n = float(m.group(1)); unit = m.group(2)
        if unit == 'px' and 9 <= n < 900:
            changed = True
            return ('6px' if n <= 13 else '8px')
        return m.group(0)
    out = re.sub(r'(\d+(?:\.\d+)?)(px)\b', sub, value)
    return out, changed

def process_decls(content):
    out = []
    for d in tinycss2.parse_declaration_list(content, skip_whitespace=True, skip_comments=True):
        if d.type != 'declaration': continue
        name = d.name.lower(); val = tinycss2.serialize(d.value).strip(); imp = ' !important' if d.important else ''
        new = None
        if name == 'color' or name in ('fill', 'stroke', 'caret-color', 'text-decoration-color'):
            v, ch = remap(val, 'text'); new = v if ch else None
        elif name in ('background', 'background-color'):
            if 'gradient' in val: v, ch = remap(val, 'bg')
            else: v, ch = remap(val, 'bg')
            new = v if ch else None
        elif name.startswith('border') and name.endswith('radius'):
            if re.search(r'50%|9{3}|[1-9]\d{3}px', val): new = None
            else:
                v, ch = radius(val); new = v if ch else None
        elif name.startswith('border') or name.startswith('outline'):
            v, ch = remap(val, 'border'); new = v if ch else None
        elif name == 'box-shadow':
            if val.strip() != 'none' and not re.search(r'inset', val): new = 'none'
        if new is not None: out.append(f'{name}:{new}{imp}')
    return out

def selector_text(prelude):
    return tinycss2.serialize(prelude).strip()

def prefix(sel):
    parts = [p.strip() for p in re.split(r',(?![^(]*\))', sel) if p.strip()]
    res = []
    for p in parts:
        if re.match(r'^(html|:root)\b', p): res.append(p)
        elif p.startswith('body'): res.append('html ' + p)
        else: res.append('html body ' + p)
    return ', '.join(res)

def walk(rules, out, depth=0):
    for r in rules:
        if r.type == 'qualified-rule':
            sel = selector_text(r.prelude)
            if SKIP_SELECTOR.search(sel) or 'keyframes' in sel: continue
            decls = process_decls(r.content)
            if decls: out.append(('  ' * depth) + f'{prefix(sel)} {{ {"; ".join(decls)}; }}')
        elif r.type == 'at-rule' and r.lower_at_keyword in ('media', 'supports') and r.content is not None:
            inner = []
            walk(tinycss2.parse_rule_list(r.content, skip_whitespace=True, skip_comments=True), inner, depth + 1)
            if inner:
                out.append(('  ' * depth) + f'@{r.lower_at_keyword} {tinycss2.serialize(r.prelude).strip()} {{')
                out.extend(inner); out.append('  ' * depth + '}')

def main():
    out = ['/* GENERATED by scripts/build-rev7-auto-theme.py — do not edit by hand. Presentation only. */']
    for name in SRC:
        css = open(f'dist/{name}.css', encoding='utf-8').read()
        out.append(f'/* ---- {name}.css ---- */')
        walk(tinycss2.parse_stylesheet(css, skip_whitespace=True, skip_comments=True), out)
    open('dist/rev7-auto.css', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
    print('rules:', len(out))
main()
