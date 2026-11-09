# Credits and sources

## VORON DownDraft

The VORON DownDraft toolhead is designed by the **VORON Design team** and its community contributors: https://vorondesign.com

Everything this interactive manual shows of the toolhead comes from their open-source release:

| Source | Used for | License |
| --- | --- | --- |
| [VoronDesign/voron-downdraft](https://github.com/VoronDesign/voron-downdraft) at commit [`c1fbbd0`](https://github.com/VoronDesign/voron-downdraft/tree/c1fbbd00bca80a59a633dccc43d0cc3b640d2e81) | `CAD/Downdraft_Toolheads.zip` (`Downdraft_Toolheads.step`): both fan versions, every hotend mount, LED, chain and PCB mount, and their hardware | GPL-3.0 |
| [DownDraft_Assembly_Manual.pdf](https://github.com/VoronDesign/voron-downdraft/blob/c1fbbd00bca80a59a633dccc43d0cc3b640d2e81/Manual/DownDraft_Assembly_Manual.pdf), version 2026-08-15 | Step order, step titles, instructions and tips (adapted) | GPL-3.0 |
| `HARDWARE_COMPATIBILITY_LIST.md`, `BOM.md` and `DownDraft.md` in the same commit | Hotend list, hotend mount names, front mount heights, hardware | GPL-3.0 |
| [VoronDesign/Voron-Extras](https://github.com/VoronDesign/Voron-Extras/tree/6d982a5cc6d55445e2f91c9958c2b1df93519e16/Images/Logo/SVG) | VORON stripes symbol (`Stripes_Logo.svg`): header, loading screen and favicon | GPL-3.0 |

The PUG (parametric umbilical gland) used in the umbilical option is by fbeauKmi: https://www.printables.com/model/378567-pug-parametric-umbilical-gland (not drawn).

Contributors to the DownDraft repository: https://github.com/VoronDesign/voron-downdraft/graphs/contributors

### What this project changed

- The STEP assembly is tessellated and rendered as line art in the browser. Geometry is not edited; hardware meshes (screws, inserts, fans…) are simplified at build time to within 0.05 mm of the CAD.
- Where the CAD draws a part in only one of the places a build option puts it (the 4010 hotend fan at the Low height, the 5015 fan spacer and screws, a single nozzle Neopixel, the chain mount's top inserts), a copy of the CAD part is placed where it goes. Each one is listed in [evidence.md](evidence.md).
- Manual pages are split into animated steps. Instruction and tip text is taken from the official manual, shortened or reworded in places to fit the interactive format. Every step links to the page of the official manual it is based on.
- Hardware counts and part lists are computed from the CAD model.

## Interactive manual

Created by **Mairis Skuja · [Iconic FAB](https://iconic-fab.com)**.

- Renderer and exports: built on the *teardown* line-art renderer by Jakub Krehel ([jakubkrehel/skills](https://github.com/jakubkrehel/skills), MIT, notice in `tools/teardown/LICENSE`).
- three.js (MIT), jsPDF (MIT) and svg2pdf.js (MIT) are loaded from public CDNs at runtime.
- Hardware mesh simplification at build time: [meshoptimizer](https://github.com/zeux/meshoptimizer) by Arseny Kapoulkine (MIT), a development dependency only.
- STEP reading at build time: [cadquery-ocp](https://github.com/CadQuery/OCP) (Apache-2.0), Python bindings for [Open CASCADE Technology](https://dev.opencascade.org/) (LGPL-2.1 with an exception), a build tool only.

## Not affiliated

This is an independent community project. It is **not affiliated with, endorsed by or supported by the VORON Design team**. "VORON" and the VORON logo belong to VORON Design and are used here only to identify the toolhead this manual is for. The official assembly manual is the reference: where the two differ, follow the official manual.
