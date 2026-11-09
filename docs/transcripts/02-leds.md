# LEDs: transcript, pp. 17–20

## p.17: LED wiring
Shows: three LEDs in series, and the path: logo LED (index 1) → right toolhead LED (index 2) → left toolhead LED (index 3); 70 mm and 12 mm of 3 × 0.16 mm² (AWG26–30) wire between them, the leads to the controller cut to length.
Text: wire the LEDs in series, DOUT of one to DIN of the next; follow the path shown.

## p.18: LEDs
Shows: the logo LED going into its carrier and the toolhead LEDs into the nozzle LED mount, wired.

## p.19: Diffuser insertion
Shows: diffuser (highlighted) and mask; both going into the front mount, 4010 and 5015.
Text: insert the diffuser and mask, then slide both parts forward until they are fully seated.
Tip LED DIFFUSER AND MASK: translucent diffuser, opaque mask.

## p.20: LEDs insertion
Shows: the logo LED carrier and the nozzle LED mount going into the front mount; the wire channels. "Similar for both versions".
Text: install the wired LEDs and carriers, then route the wires through the wire channels.

## Steps (03-leds.cjs)

| id | Pages | Content |
| --- | --- | --- |
| led-wiring | 17 | The LEDs on the bench (no wires in the CAD) |
| led-carriers | 18 | Logo LED into its carrier, nozzle LEDs into their mount |
| led-diffuser | 19 | Diffuser and mask in from behind, then forward |
| led-insert | 20 | The carrier and the nozzle LED mount into the front mount |

## CAD vs manual

| Manual | CAD | Shown |
| --- | --- | --- |
| The logo LED in the front mount (shown on the Low front) | The logo parts sit at the Low front's logo window; the other fronts have the window elsewhere: Middle +1.5 mm (4010) / +3.0 mm (5015), High −33.7 mm, below the hotend fan (measured by matching the Low front's logo pocket) | Diffuser, mask, carrier and LED drawn at the chosen front's window |
| p.18: two toolhead LEDs | Two Neopixels per version; mounts for one LED and for a strip too | Option *Nozzle LEDs*. One LED: the CAD's right Neopixel moved 5.5 mm to the middle |
| Logo LED | Neopixel carrier with a Neopixel, BARF carrier with a BARF board | Option *Logo LED* |
| p.19: diffuser and mask slide in | They fit their pocket with no clearance in the CAD | The animation slides them along the pocket |

## Not drawn

- The wires; the LED strip (strip option).
