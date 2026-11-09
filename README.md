# VORON DownDraft: interactive assembly manual (unofficial)

**Open it: https://iconic-fab.com/voron/downdraft/** (free, in the browser, no install)

An animated 3D companion to the official [VORON DownDraft assembly manual](https://github.com/VoronDesign/voron-downdraft/blob/main/Manual/DownDraft_Assembly_Manual.pdf), the modular toolhead for the Trident, V2, Legacy and Switchwire. Every step of the official manual is shown on the official CAD model: the parts of each step fly into place, labelled, with the manual's text and tips beside them and a link to the page it comes from.

> **Independent community project.** Not affiliated with, endorsed by or supported by the VORON Design team. The official manual is the reference: where the two differ, follow the manual. All credit for the toolhead, the CAD and the manual goes to the VORON team and community; see [CREDITS.md](CREDITS.md).

**Status:** beta. The whole manual, pp. 14–44: front mount, hotend fan, LEDs, part cooling fans, hotend mount, extruder and toolhead mounting, and both rear-mount examples (cable chain, PCB + PUG umbilical). 22–24 steps, depending on the build options.

## Your build

The steps, the drawing and the part counts follow the options you pick (on the start card or under *Configure*):

| Option | Choices |
| --- | --- |
| Part cooling fans | Dual 4010 (default) or dual 5015 |
| Hotend | 15 hotends from the official compatibility list. The hotend picks its hotend mount and the front mount height (Low, Middle, High) |
| Wiring | Cable chain with a toolhead PCB, cable chain without one, or PCB + PUG umbilical |
| Logo LED | Neopixel or BARF |
| Nozzle LEDs | Two Neopixels, one Neopixel or an LED strip |
| Front style | Plain, or the two-colour Brick, Hex and VORON fronts |

The official CAD holds every printed part and most of the hardware, but not the hotend, the extruder, the toolhead PCB, the PUG, the cable chain or the carriage: those are listed in their steps, not drawn. A link can carry options, e.g. `?variant=5015&hotend=goliath#pug-mount`.

## What you can do

- **Steps:** play, scrub or replay each step; jump between chapters; *Auto* plays through the build (double-click it for 2× speed).
- **Exploded view:** pull the toolhead apart along its assembly paths with the spacing slider.
- **Parts:** click any part to see its name and jump to the step that installs it; isolate or recolour it. *Configure* lists the parts and hardware for your build.
- **Display:** linework styles, filled or outline parts, line colour, light and dark mode.
- **Export:** save the current view as SVG, PNG or PDF (A3 hidden-line drawing).
- **Deep links:** every step has its own address, e.g. [`#hm-mount`](https://iconic-fab.com/voron/downdraft/#hm-mount).

Where the CAD and the manual differ, the drawing shows the CAD and the difference is written down in [docs/transcripts/](docs/transcripts/).

## Found a mistake?

[Open an issue](https://github.com/mairisskuja/voron-downdraft-interactive-manual/issues) here, **not** on the VORON repository. Please include the step's address and what is wrong. Pull requests are welcome: [docs/writing-a-chapter.md](docs/writing-a-chapter.md) explains how a chapter is written and checked.

For help with your build, the VORON community is on [Discord](https://discord.gg/voron) and the [forum](https://forum.vorondesign.com).

## Build

Needs Node 20+, [uv](https://docs.astral.sh/uv/) (for Python 3.12 and native OpenCascade), `curl` and `unzip`.

```bash
npm install         # build tools (meshoptimizer)
npm run setup       # once: Python venv with cadquery-ocp (native OpenCascade)
npm run fetch-cad   # the official STEP file and manual from VoronDesign/voron-downdraft (pinned commit)
npm run build:all   # reads the STEP file (about 45 seconds), then builds dist/ (index.html + model-<hash>.bin)
npm run serve       # http://localhost:8768/
```

| Path | What it is |
| --- | --- |
| `CHANGELOG.md` | What changed in each release |
| `tools/catalog.cjs` | Shared helpers, the build options and the hotend list |
| `tools/chapters/NN-*.cjs` | One module per chapter: parts, steps, text, manual page references |
| `docs/transcripts/` | Page-by-page transcripts of the official manual, with "CAD vs manual" and "Not drawn" |
| `tools/snap.cjs` | Renders steps to PNG without a browser (`node tools/snap.cjs <step id or section>`, `OPTS=variant=5015,wiring=pug` for another build) |
| `tools/collide.cjs` | Plays every step and reports parts that pass through each other (`node tools/collide.cjs [step id...]`) |
| `tools/step/convert_ocp.py` | Reads the STEP file into `build/assembly.json` |
| `tools/simplify-hardware.cjs`, `tools/build-*.cjs` | Simplify hardware meshes, pack the model and build `dist/index.html` |
| `src/` | The page: template, viewer, export worker, logos |
| `tools/teardown/` | Hidden-line renderer used for exports (MIT, Jakub Krehel) |

## License

GPL-3.0, the same as the VORON DownDraft it is built from. See [LICENSE](LICENSE) and [CREDITS.md](CREDITS.md).

"VORON" and the VORON logo belong to VORON Design and are used only to identify the toolhead this manual is for.

Made by Mairis Skuja · [Iconic FAB](https://iconic-fab.com).
