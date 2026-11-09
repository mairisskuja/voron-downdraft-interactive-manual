# Hotend mount, extruder and toolhead mounting: transcript, pp. 26–31

## p.26: Hotend mount, non-Orbiter v2 mounting
Text: for extruders that do not use the Orbiter v2 mounting pattern, install four heatset inserts into the hotend/extruder mount from below, then two into the Alternative_Extruder_Spacer.

## p.27: Hotend
Text: attach the hotend to the hotend mount with four M3x8 SHCS or M2.5x8 SHCS, depending on the hotend, cables to the rear. Optional zip ties. Secure the hotend assembly to the front assembly with two M3x6 BHCS. Route the cables behind the hotend, up and out the rear; they must not be pinched between the toolhead and carriage mount.

## p.28: PTFE stickout
Text: install the 4 mm OD × 2 mm ID PTFE tube so it extends above the toolhead far enough to seal against the extruder; the stickout varies with the hotend and extruder. Optional: chamfer the entry.

## p.29: Extruder mounting
Text: Orbiter v2 pattern extruders attach directly to the hotend mount: one M3 square nut into the slot, then an M3 screw; repeat on the other side. Screw length depends on the extruder: long enough to engage the nuts, not so long that it protrudes through the bottom. Square nuts take more torque than inserts and reduce toolhead nod. Non-Orbiter v2: the Alternative_Extruder_Spacer with four M3x8 BHCS, LGX Lite pattern extruders fitted to the spacer first.

## p.30: Toolhead mounting screws
Text: two lower M3x35 SHCS from the front, protruding about 5 mm at the rear; two upper M3x25 SHCS from the front. They must pass the 5015 fans: if needed loosen the lower side screws, push the screws past, re-tighten.

## p.31: Toolhead mounting
Text: secured to the carriage with the four screws from the front; seat it flat, tighten in an X pattern. Mounting compatibility: the CW2 toolhead pattern (CW2 carriages, Tap and CNC carriage mounts for StealthBurner).

## Steps (05-hotend-mount.cjs)

| id | Pages | Content |
| --- | --- | --- |
| hm-alt-inserts | 26 | The hotend mount; the non-Orbiter inserts and spacer listed |
| hm-hotend | 27 | The hotend mount; the hotend and its screws listed |
| hm-mount | 27 | Mount onto the front assembly, two M3x6 BHCS |
| hm-ptfe | 28 | The PTFE tube listed |
| ex-orbiter | 29 | Square nuts in from the sides, the extruder screws from above |
| th-screws | 30 | M3x35 and M3x25 SHCS from the front |
| th-carriage | 31 | Text only |

## CAD vs manual

| Manual | CAD | Shown |
| --- | --- | --- |
| A hotend mount per hotend | 14 mounts in the same place (Blank included) | Option *Hotend*: the mount for it; the Blank mount is not offered |
| p.29: "M3 BHCS" for the extruder | Two M3x8 BHCS | Drawn as M3x8, with a note that the length depends on the extruder |
| p.29: nut slot | The extruder nut slots are closed on top (a ceiling at the nut's top face) and open to the sides | The nuts slide in from the left and right |

## Not drawn

- The hotend and its four screws; the PTFE tube; the extruder; the non-Orbiter inserts and the Alternative_Extruder_Spacer; the carriage.
