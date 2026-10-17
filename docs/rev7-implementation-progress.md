# Rev.7 implementation progress

Source: Figma page `132:4`, 73 screen frames, 69 saved detailed responses. No additional Figma calls were used during implementation. Base: `a9314e2b03459f731a8a4d7b3fad40f7d4c18d66`; branch: `design/rev7-complete`.

## Sections

| Section | Changes | Verification |
|---|---|---|
| My records | M-01 summary and entry cards, M-02 period/era filters and weekday chart, M-09 empty state | Three-width screenshots for populated records; VM route/back/forward and record immutability checks passed |
| Wrong review | W-01 canonical list, needed/completed state, W-02 apply/cancel sheet, W-03 empty, W-08 full original explanation detail; existing runtime for W-04–07 and W-10 | Three-width list/sheet/detail screenshots; canonical bulk IDs and preserved records tested |
| OX | O-01 all-era and era rows, O-02–04 question and feedback, O-06 analysis, O-08 resume choice, O-09 empty | VM correct/incorrect/resume/analysis tests passed; OX main screenshots at 360/390/412 |
| Home | 280×360 hero cards, season labels, real saved scene counts, weakness summary from existing analysis | Code implemented; final visual checks in progress |
| Story | S-01 timeline, S-02 era layout, S-03 coming state, S-04 sheet, S-04B scene list; current-dialogue player, exit/menu/resume presentation; original script/choice commands | VM entry/chapter/list tests passed; end-to-end play and final visual checks in progress |
| Exams | E-01 direct cover entry; E-02 cover; E-03 practice header/footer; E-08 pause; E-10–12 result tabs; E-14 retry; E-15–17 history and trend; existing snapshot-based explanations | Timer, cover, immutable result history, era analysis and weakness regression tests passed; mobile validation in progress |
| Resource states | Real image loading/failure/retry, original zoom viewers, offline bootstrap fallback, initial wrong-note skeleton | Implemented; network failure and offline verification pending |

## Intentionally unchanged

- W-11: no detailed design response.
- O-05: no detailed design response; original OX result renderer retained.
- O-07: no detailed design response; populated OX wrong-note renderer retained. Confirmed O-09 is used only for the empty case.
- C-02: no detailed design response; existing toast/banner behavior retained.

## Differences requiring truthful data handling

- Daily study minutes, dated scene counts, chapter expected minutes, and story duration are not recorded by the existing schema. Missing values say “기록 없음” or “—”; Figma sample values were not invented and the schema was not extended.
- Existing official grading passes at 60/100. Figma sample goal-line numbers do not override grading.
- E-09 now paints between synchronous grading and result analysis rendering using browser animation frames. It introduces no fixed delay, changes no timer/grade calculation, and is covered by a duplicate-result preservation test.
- Figma E-04 shows a marked-question state. The app has no saved bookmark/mark field; this new feature was not invented. The existing answered/current/unanswered states and six-column layout are implemented.
- Existing extra filters, summaries and recordbook actions remain available through disclosure menus.

## Latest verification

- GitHub Actions run 39035560460 passed runtime preservation, 360/390/412 priority layouts, and production build.
- The expanded browser flow covers OX feedback/resume/analysis, exam cover/map/pause/submission/result/review, and story chapter/scene/player/menu/exit at all three widths. Final run is tracked in task outputs.
- Corrected real scene counts to use the existing chapterScenes runtime; no chapter content was modified.
- Restored verified official pass-rate badges and the suspended-exam retry guard.
- Original grading thresholds remain 60/70/80 for advanced certification; the result graph uses the true minimum 60-point pass line.

## Local test constraints

Chrome subprocess startup fails in this Windows sandbox. Responsive screenshots are therefore taken through the connected browser viewport capability on an isolated QA origin, not the user's saved app origin. The checked-in Playwright suite and GitHub workflow provide independent repeatable CI verification.

The checkout externalizes 8,647 original asset files through its existing GitHub asset origin. Tests requiring physical `dist/assets` files cannot pass against this checkout; source manifests and actual external-image rendering must be checked instead. No original asset URL, question, answer, explanation, script, chapter, scene, choice, or save schema was edited.

This is a progress record, not a declaration that all 69 screens have passed visual QA. Final per-frame status and screenshots are maintained in the task outputs.
