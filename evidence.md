# Evidence: CAD, official manual and decisions

What each fact on the page comes from. Sources are pinned in [CREDITS.md](CREDITS.md): VoronDesign/voron-downdraft `c1fbbd0` (2026-11-09), `CAD/Downdraft_Toolheads.zip` and the assembly manual version 2026-08-15. Each chapter's page-by-page record, with "CAD vs manual" and "Not drawn", is in [docs/transcripts/](docs/transcripts/).

## Geometry

- `Downdraft_Toolheads.step`: 261 unique solids placed 292 times. It is a library: both fan versions (4010, 5015), the three front mount heights of each, the decorative fronts (Brick, Hex, VORON), all 14 hotend mounts, both logo LED carriers, the three nozzle LED mounts, every chain, PCB and PUG mount and the extras, each in its assembled place.
- Read with native OpenCascade (`tools/step/convert_ocp.py`), deflection 0.1 mm.
- Axes: Z up, millimetres, nozzle region near z = 0. The toolhead's front is −y (the front mount), the rear mounts are at +y. +x is the right side seen from the front.

## Build options and the CAD

| Option | CAD | Drawn |
| --- | --- | --- |
| Part cooling fans | `4010:1` and `5015:1` subassemblies | The chosen version's front mount, ducts, fans and hardware |
| Hotend | `Common_Parts/Hotend_Mounts`: 14 mounts (the Blank mount is not offered) | The mount for the hotend (HARDWARE_COMPATIBILITY_LIST.md); two hotends can share one |
| Front mount height | `[a]_<version>_Front_Mount_Low/Middle/High` | The height the compatibility list gives for the hotend. Hotend fan heights measured from the fan screw holes: Low 35.5, Middle 41.5, High 55.5 mm |
| Front style | `Extras/Front_Mount_Cutters/<version>_<style>_Cutter` | The decorative body and its 0.6 mm face pieces. Where a set has no body of its own (4010 Low Hex), the face goes on the plain front |
| Wiring | `PCB_And_Chain_Mounts` | Cable chain: `3hole_Chain_SB_NH_36_PCB_Mount`. PUG: `PUG_Integrated/Generic_Left_Umbilical_PCB36_Pug_Mount` and `PUG_Integrated_Clamp` (the clamp, its screws and the left-face inserts in the CAD's hardware match it) |
| Logo LED | `Logo_Led`: Neopixel and BARF carriers; a Neopixel (`rgbw_led_pcb`) and a BARF board | The chosen carrier and LED |
| Nozzle LEDs | `Nozzle_Led`: x1, x2 and strip mounts and the strip backers; two Neopixels per version | The chosen mount; the strip is not in the CAD |

The 5015 CAD also has Vindr 5015 fans in the same place as the generic 5015; the generic one is drawn. The extruder-specific chain and PUG mounts (Orbiter v2, Galileo 2, Wildwood, E3D Roto) and the Extras (Crossbow cutter mount, E3D PZ mount, ADXL mount, LED jigs, Roto Vitamins, WWG2 bodies, the bowden mounts and the alternative extruder spacer) are not drawn.

## Copies of CAD parts

Where the CAD draws a part in only one of the places an option puts it, a copy of the CAD instance is moved there (`copy` in `tools/catalog.cjs`, the reason is required):

| Part | CAD | Copy |
| --- | --- | --- |
| 4010 hotend fan | Low height only | +6 mm (Middle), +20 mm (High), as the 5015 fans are spaced |
| 5015 hotend fan spacer and its 4 screws | Low height only | +6 mm, +20 mm |
| Logo LED parts (diffuser, mask, carrier, LED) | At the 5015 Low front mount's logo window only | At the window of the chosen front, measured by matching the 5015 Low front's logo pocket in the others: 4010 fronts 12.7 mm further back; Middle +1.5 mm (4010) / +3.0 mm (5015); High −33.7 mm (below the hotend fan) |
| Nozzle LED mounts and the 4010 strip backer | In the 5015 front's seat | 4010: 3 mm further back, matching the 4010 front's seat and the CAD's 4010 Neopixels |
| Nozzle Neopixel, one-LED mount | Two Neopixels (x2 mount) | The right one, moved 5.5 mm to the middle |
| Chain mount board inserts (4) and PCB spacers (2) | The CAD's board inserts and spacers fit the PUG mount (its back face, y 50) | Chain mount: copies in its own four insert bores, which open on its front face (y 54.6, towards the toolhead, found by fitting the 2.3 mm bores); the spacers in front of it at its 36 mm board holes |
| Chain mount top inserts (3) | Not in the CAD | Copies of the front mount's top insert, in the three 4.6 mm holes on top of the 3-hole chain mount (found by comparing it with the 2-hole mount) |

## Decisions

- The front mount is the root of the toolhead: everything rides on it. The ducts and the hotend mount are built on the bench and then carried on.
- The manual calls the 5015 hotend fan screws M3x20 BHCS; the CAD draws SHCS. The part list follows the manual.
- Steps with nothing to move (wiring, the hotend, the PTFE tube, the cable chain, the carriage) show the parts involved and list what is not drawn.
