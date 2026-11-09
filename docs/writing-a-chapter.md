# Writing or fixing a chapter

How the chapters of the VORON DownDraft interactive manual are written and checked. Set up the build first (see the [README](../README.md#build)).

## Read first

1. [evidence.md](../evidence.md): the CAD, its variants, and how differences are recorded.
2. `tools/catalog.cjs`: the helpers, the build options and the hotend list.
3. One chapter module, e.g. `tools/chapters/04-part-cooling.cjs`, and its transcript in `docs/transcripts/`.
4. The official manual, `source/DownDraft_Assembly_Manual.pdf` (`npm run fetch-cad`). Verbatim text: `pdftotext -f P -l P -layout`; page images: `pdftoppm -f P -l P -scale-to 1100 -png`. Look at the image of every instruction page: the text alone does not say where parts go.
5. The CAD: `build/assembly.json` (`{protos, instances: [{proto, name, path, matrix, bbox}]}`, mm, Z up, front is −y). Query it with node. It is a library: every alternative part is in its assembled place.

## A chapter

`tools/chapters/NN-name.cjs` exports `ctx => [ ...steps ]`. It adds its parts with `ctx.add` / `ctx.each` and returns its steps in manual order. Ids a later chapter needs go on `ctx.ids`.

| Helper | Meaning |
| --- | --- |
| `pick(re, n)` | Instance indices whose `path.join('/')` matches `re`; throws unless exactly `n` |
| `near(re, points)` / `at(re, point)` | The unused instance of `re` nearest each point (within 1 mm) |
| `add(id, name, inst, kind, extra)` | One part, possibly several instances. `extra`: `parent`, `parents`, `when`, `note`, `fix: {vec, why}` (moves a piece the CAD places off its seat; at most 3 mm, recorded in the transcript) |
| `each(prefix, name, list, kind, extra)` | One part per instance (hardware) |
| `auto(ids, phase, gap)` | Movers along each fastener's own axis (bolts and inserts) |
| `move(ids, [dx,dy,dz], phase, gap, start)` | Movers from a fixed offset in mm |
| `again(movers)` | Carry a finished sub-assembly to its place (it was built earlier) |
| `out(movers)` | Take a part away (a support, a replaced screw); it is gone afterwards |
| `copy(i, vec, why)` | A copy of CAD instance `i` moved by `vec`, for a part the CAD draws in only one of the places an option puts it (record it in evidence.md) |

A mover can also turn while it moves (`rot: {axis, deg, pivot}`, e.g. a latch swinging shut) or follow a path (`via: [[dx,dy,dz], …]`, offsets towards the end, e.g. in through an opening and then up into a slot). A step's `pose` holds a part turned for that step.

**Build options** (`variant`, `hotend`, `wiring`, `logo`, `nozzle`, `front`): a part, step, text line (`{text, when}`), note or extra with `when` exists only where it holds: `'variant=5015'`, `'wiring=chain|chain-pcb'`, `'front!=plain'`, or an array of these (all must hold). `HEIGHT('high')` is the `when` for every hotend on the High front mount. A part on alternative hosts lists them in `parents`; the first enabled one carries it. The build checks every combination of options: each part is installed once and every part is shown.

**Steps:** `{id, section, title, pages, bench?, shift?, view: {az, el}, focus?, movers, text, notes?, extras?, when?, chapter?}`. `az` 0 looks from +x (right), −90 from the front, 90 from the back. In a bench step only the bench parts, their installed children and the movers show. Text is short imperative sentences; notes are the manual's red-headed tips, nearly verbatim. Never invent facts: a CAD-derived fact goes in the transcript's "CAD vs manual".

## Check your work

```bash
npm run build:data                                   # must finish without errors (checks every build)
node tools/snap.cjs pcf-4010-right                   # start pose left, end pose right
OPTS=variant=5015,wiring=pug node tools/snap.cjs pug-mount
OPTS=variant=5015 node tools/collide.cjs             # parts passing through each other
```

`collide.cjs` plays each step and lists contact between parts more than 3 mm before a part arrives; screws, inserts and bearings may touch along their own reach. Compare the snapshots with the manual pages: the right parts, the right places, a sensible direction of travel, a camera that shows the action. Check every build option your chapter touches.
