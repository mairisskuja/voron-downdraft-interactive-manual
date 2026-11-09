# Changelog

Changes to the interactive manual at https://iconic-fab.com/voron/downdraft/. Dates are release dates. Where the drawing differs from the official CAD or manual, the details are in [docs/transcripts/](docs/transcripts/) under "CAD vs manual", and in [evidence.md](evidence.md).

## 2026-11-10

### Fixed

- **Hotend names:** the Dragon Ace, Dragon Ace Volcano and Dragon Ace + MZE are Trianglelab hotends; the picker said Phaetus. Their option values (`dragon-ace`, `dragon-volcano`, `dragon-ace-mze`) are unchanged, so existing links still work.

## 2026-11-09 (update)

### Fixed

- **Logo LED and nozzle LEDs on the 4010** ([`#led-insert`](https://iconic-fab.com/voron/downdraft/#led-insert)): the CAD places the diffuser, mask, logo LED carrier and nozzle LED mounts for the 5015 front mount, so on the 4010 they stood 12.7 mm (logo) and 3 mm (nozzle mount) in front of the front mount. They now sit in the 4010 front's window and seat, measured from its geometry.
- **Chain mount board inserts** ([`#cc-inserts`](https://iconic-fab.com/voron/downdraft/#cc-inserts)): the CAD's four board inserts belong to the PUG mount's back face and floated beside the chain mount. The chain mount's inserts are now drawn in its own bores on its front face (towards the toolhead), and its PCB spacers in front of them ([`#cc-pcb`](https://iconic-fab.com/voron/downdraft/#cc-pcb)).
- Paths: the chain mount's PCB spacers come in from the toolhead side; the LED strip backer from the front and below.

## 2026-11-09: first release

- The whole official manual (version 2026-08-15), pp. 14–44, on the official CAD (`Downdraft_Toolheads.step`, VoronDesign/voron-downdraft `c1fbbd0`): front mount, hotend fan, LEDs, part cooling fans, hotend mount, extruder and toolhead mounting, and both rear-mount examples. 22–24 steps, depending on the build options.
- Build options: part cooling fans (dual 4010 or dual 5015); hotend (15 hotends from the hardware compatibility list, each picking its hotend mount and the front mount height); wiring (cable chain with or without a toolhead PCB, or PCB + PUG umbilical); logo LED (Neopixel or BARF); nozzle LEDs (two, one or a strip); front style (plain, Brick, Hex, VORON).
- The logo LED parts (diffuser, mask, carrier, LED) sit in the logo window of the chosen front mount: the High fronts have it below the hotend fan, 33.7 mm lower than the CAD draws them.
- Parts the CAD draws in only one place are copied to where an option puts them: the logo LED parts at each front mount's logo window, the 4010 hotend fan at the Middle and High heights, the 5015 fan spacer and screws, a single nozzle Neopixel, the chain mount's three top inserts.
- Parts move along collision-checked paths (`tools/collide.cjs`): the ducts' fans come in at an angle, the extruder nuts slide in from the sides, the PCB spacers clear the chain arm.
- Every combination of build options (2,160) is checked at build time: each part is installed once and every part is shown.
- Exploded view, parts panel, SVG / PNG / PDF export, deep links per step, bottom navigation bar.
