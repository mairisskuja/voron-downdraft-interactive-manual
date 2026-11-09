# Front mount and hotend fan: transcript, pp. 13–16

Source: `DownDraft_Assembly_Manual.pdf` (version 2026-08-15). Text from `pdftotext -layout`, checked against the page images.

## p.13: Toolhead assembly
Chapter page. The following pages have separate instructions for the 4010 and 5015 versions; follow only the steps for yours, then continue with the shared steps. The front mount holds the 2510 hotend fan and LEDs, the side fans give part cooling.

## p.14: Front mount
Shows: the 4010 and 5015 front mounts from the rear, four inserts highlighted.
Text: "Install four heatset inserts into the front mount: two in the lower side holes and two in the top holes."
Tip HEATSET INSERTS (with link https://voron.link/m5ybt4d).

## p.15: Hotend fan, 4010 version
Shows: the 2510 axial fan going into the rear of the front mount; a second view of the printed features that hold it.
Text: insert the fan into the rear of the front mount; it is held later by the left and right fan mounts. Check the fan orientation; position the cable so it can route through either fan mount's cable duct.
Note: ducts are not installed yet.

## p.16: Hotend fan, 5015 version
Shows: the fan, the printed spacer and M3x20 BHCS; and without the spacer, M3x16 BHCS.
Text: the fan is screwed directly into the front mount; an optional printed spacer concentrates airflow. M3x20 BHCS with the spacer, M3x16 BHCS without.
Note: some 2510 fans (Delta) have smaller screw holes: M2.5 heatset inserts and M2.5 screws.

## Steps (01-front-mount.cjs, 03-hotend-fan.cjs)

| id | Pages | Content |
| --- | --- | --- |
| fm-inserts | 14 | The front mount for the build (version, height, style) with its four inserts |
| hf-4010 | 15 | 4010: the 2510 fan in from behind |
| hf-5015 | 16 | 5015: the fan and spacer in from behind, then the four screws |

## CAD vs manual

| Manual | CAD | Shown |
| --- | --- | --- |
| Front mount Low / Middle / High (HARDWARE_COMPATIBILITY_LIST.md) | All three in the same place for each version | The one the compatibility list gives for the chosen hotend |
| p.15: the 4010 hotend fan | Modelled at the Low height only | Middle and High: a copy 6 or 20 mm higher, as the 5015 fans are spaced |
| p.16: M3x20 BHCS with the spacer | 4 M3x20 SHCS and the spacer, at the Low height only | Listed as BHCS; Middle and High: copies 6 or 20 mm higher |
| p.16: M3x16 BHCS without the spacer | Not modelled | The spacer version is drawn |
| The High fronts | The logo window is 33.7 mm lower than on the Low front, below the hotend fan | The logo parts are drawn there (see 02-leds.md) |
| Decorative fronts are in Extras | A body plus 0.6 mm face pieces; the 4010 Low Hex set has face pieces only | The face goes on the plain front there |

## Not drawn

- M2.5 inserts and screws for small-hole fans.
