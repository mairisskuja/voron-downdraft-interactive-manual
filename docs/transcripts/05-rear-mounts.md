# Rear mounts: cable chain and PCB + PUG umbilical: transcript, pp. 32–44

## p.32: Toolhead optional mounts
Text: mounts for the rear of the toolhead: cable chain mounts, toolhead PCB mounts, a generic ADXL mount, a PUG umbilical mount. M3 square nuts in the rear slots of the hotend mount hold them; some use one side, others both. Keep the toolhead level so the nuts do not slip out. Note: some mounts are extruder specific and may not fit with a spacer such as a filament cutter. Two examples follow.

## p.33: Cable chain option
Chapter page: for builds without a PCB or with a non-CANBUS breakout PCB.

## p.34: Cable chain mount inserts
Text: 4 heatset inserts on the front of the cable chain mount, 3 on top.

## p.35: Cable chain mount
Text: uses only the right side of square nuts. M3x8 BHCS in the lower hole on the right at the rear, M3x16 BHCS in the upper hole.

## p.36: Cable chain
Text: secure the cable chain with M3x6 FHCS (two or three screws). Fixed end link at the toolhead, unfixed link opposite.

## pp. 37–39: PCB spacers and board
Text: line up the two spacers behind the PCB (4 mm spacers shown); align the PCB and spacers with the mount; secure with two M3x10 BHCS. Skip if not using a toolhead PCB.

## p.40: PCB + PUG umbilical option
Chapter page: a toolhead PCB with a CANBUS umbilical and the PUG strain relief (PUG by fbeauKmi).

## p.41: PUG mount inserts
Text: 4 heatset inserts on the back, 2 on the front, 2 on the left of the PUG/chain mount.

## p.42: PCB + PUG umbilical mount
Text: uses square nuts on both sides. Two M3x8 BHCS in the lower left and right holes, two M3x16 BHCS in the upper holes.

## p.43: PUG mount and clamp
Text: CANBUS wire between the two halves of the PUG, PUG seated in the mount (grooves inside). Clamp over the PUG with one M3x8 BHCS and one M3x12 BHCS.

## p.44: PCB spacers and board
Text: the two spacers behind the PCB; align and secure the board with two M3x10 BHCS.

## Steps (08-rear-mounts.cjs)

| id | Pages | Content |
| --- | --- | --- |
| rm-nuts | 32 | Square nuts dropped into the rear slots from the top: right side (chain), both sides (PUG) |
| cc-inserts | 34 | Chain mount: 4 board inserts, 3 on top |
| cc-mount | 35 | Chain mount on, M3x8 and M3x16 BHCS |
| cc-chain | 36 | The cable chain listed |
| cc-pcb | 37–39 | Spacers; the PCB and its screws listed (chain with PCB) |
| pug-inserts | 41 | PUG mount: 4 board inserts, 2 front, 2 left |
| pug-mount | 42 | PUG mount on, 2 M3x8 and 2 M3x16 BHCS |
| pug-clamp | 43 | Clamp and its two screws; the PUG listed |
| pug-pcb | 44 | Spacers; the PCB and its screws listed |
| finale | 45 | Assembly completed |

## CAD vs manual

| Manual | CAD | Shown |
| --- | --- | --- |
| The chain mount (3 top inserts in the example) | 2-hole and 3-hole generic chain mounts, plus extruder-specific versions | The generic 3-hole mount |
| p.34: 4 inserts on the front of the chain mount | The CAD's four board inserts (and the 4 mm PCB spacers) fit the PUG mount's back face | Chain mount: copies in its own bores on its front face (towards the toolhead), the spacers in front of them; the PCB goes on that side |
| p.34: 3 top inserts | Not modelled | Copies of an insert placed in the three 4.6 mm holes on top (found by comparing the 3-hole and 2-hole mounts) |
| p.41: the PUG/chain mount | Generic left and right integrated PUG mounts, a generic PUG mount with a separate clamp, extruder-specific versions | The integrated left mount and its clamp, which match the CAD's clamp screws and left-face inserts |
| Wiring | — | Option *Wiring*: chain with PCB, chain without PCB, PCB + PUG |

## Not drawn

- The cable chain and its M3x6 FHCS; the toolhead PCB and its two M3x10 BHCS; the PUG and the CANBUS cable.
