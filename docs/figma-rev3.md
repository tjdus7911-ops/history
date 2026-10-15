# Figma Rev.3 UI

## Design Authority

- File: `iL6dHoA2qFaggZjqNub77u`, Rev.3 pages only.
- 32 screens/states and 22 shared component families are indexed in `config/figma-rev3-ui.json`.
- Blue `#2D5BE3` means action/completion/correct; yellow `#F2A516` means current/in-progress; red `#E5484D` means wrong/weak/destructive.
- The user explicitly resolved the A1/B2 color conflict in favor of the Rev.3 system. No Rev.1/2/4 layout is used as a substitute.
- Typography uses Malgun Gothic as requested. Systems without that installed font use their sans-serif fallback; the font binary is not redistributed.
- Device status bars/home indicators belong to the OS, not to web page content. Safe-area padding is retained.

## Implementation Boundary

`dist/rev3-ui.js` replaces presentation renderers through narrow exam/OX adapters. Existing question data, story scripts, timer state transitions, grading, grade thresholds, canonical answer records and save/restore functions remain unchanged.

`dist/rev3.css` is the final authoritative UI token/component layer. Story-specific layout styles remain for existing screens without Rev.3 counterparts. Original Figma assets are local under `dist/rev3-assets`; no temporary Figma URL is used at runtime.

The chart presentation groups ten existing analysis eras into seven readable result columns (eight in the detailed heatmap). Totals and accuracy are recomputed from the unchanged era data. No analysis data is removed. Basic-exam ladders use grades 6/5/4, not advanced grades 3/2/1.

Stories, mnemonic tools, wrong-note details, original exam source information and OX learning statistics remain accessible. Detailed legacy records are retained behind a disclosure rather than crowding the Rev.3 record dashboard.

## Verification

`tests/rev3-mobile-qa.cjs` renders before/after views in mobile Chromium at 360, 375, 390, 412 and 430 CSS pixels. It covers native touch swipes over question/choice/gap areas, scroll, tap/auto-advance, zoom/sheet exclusions, first/last boundaries, retake record retention, timer expiry, OX feedback/results, chapter entry and layout overflow.

`tests/story-access-policy-test.cjs` exercises four-era chapter entry, replay, next-chapter progression and reload, validating externalized question assets against the existing immutable deployment manifest.

The QA screenshots use isolated browser storage and deterministic test attempts. They never reset or seed a real user's learning records. Loading/empty/error states are explicitly exercised as component states; the network view is also wired to failed question-image loads and retry.

Original Figma references and rendered captures are delivered in the task's comparison report. Main is updated only after native mobile QA and regression/build validation pass.

