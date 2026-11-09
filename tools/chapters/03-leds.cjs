// LEDs (manual pp. 17–20). The logo LED (a Neopixel, or a BARF board) sits in its carrier behind
// the diffuser and mask in the front mount; the nozzle LEDs (two Neopixels in the manual) sit in
// a mount low in the front. The CAD has both logo carriers, all three nozzle mounts and the
// Neopixels of each version. One Neopixel mount: the CAD's right Neopixel is drawn moved to the
// middle. LED strip: the strip is not in the CAD. See docs/transcripts/02-leds.md.
//
//
// The logo window sits at a different height on each front mount; the CAD has the logo parts at
// the Low window only. Measured by matching the Low mount's logo pocket in the other mounts:
// Middle +1.5 mm (4010) / +3.0 mm (5015), High −33.7 mm (below the hotend fan). The diffuser,
// mask, carrier and logo LED are drawn as copies at the window of the chosen front mount.
module.exports = ctx => {
  const {pick, add, near, each, move, copy, HEIGHT} = ctx;
  const {FRONTS} = ctx.ids.fm;
  const L = s => new RegExp('Common_Parts:1/Logo_Led:1/' + s);
  const N = s => new RegExp('Common_Parts:1/Nozzle_Led:1/' + s);
  const onFront = {parents: FRONTS};
  const WINDOWS = [
    {tag: '', dz: 0, when: HEIGHT('low')},
    {tag: '-mid4010', dz: 1.5, when: ['variant=4010', HEIGHT('middle')], why: 'logo window of the 4010 Middle front mount'},
    {tag: '-mid5015', dz: 3, when: ['variant=5015', HEIGHT('middle')], why: 'logo window of the 5015 Middle front mount'},
    {tag: '-high', dz: -33.7, when: HEIGHT('high'), why: 'logo window of the High front mount'}
  ];
  const src = {
    diffuser: pick(L('\\[c\\]_LED_Diffuser:'), 1), mask: pick(L('\\[o\\]_LED_Diffuser_Mask:'), 1),
    np: pick(L('\\[o\\]_Neopixel_Carrier:'), 1), barf: pick(L('\\[o\\]_BARF_LED_Carrier:'), 1),
    npLed: pick(L('Hardware:1/rgbw_led_pcb'), 14), barfLed: pick(L('Hardware:1/RGBW_LED_circular_panel'))
  };
  const DIFFUSERS = [], MASKS = [], CARRIERS = [], LOGO_LEDS = [];
  for (const w of WINDOWS) {
    const at = list => w.dz ? list.map(i => copy(i, [0, 0, w.dz], w.why)) : list;
    const note = w.dz ? `, drawn ${w.dz > 0 ? '+' : ''}${w.dz} mm at this front mount’s logo window` : '';
    const both = x => [].concat(w.when, x || []);
    DIFFUSERS.push(add('led-diffuser' + w.tag, 'LED diffuser', at(src.diffuser), 'glass', {...onFront, when: both(), note: '[c]_LED_Diffuser.stl, translucent' + note}));
    MASKS.push(add('led-mask' + w.tag, 'LED diffuser mask', at(src.mask), 'primary', {...onFront, when: both(), note: '[o]_LED_Diffuser_Mask.stl, opaque' + note}));
    const npCarrier = add('led-carrier-np' + w.tag, 'Neopixel carrier', at(src.np), 'primary', {...onFront, when: both('logo=neopixel'), note: '[o]_Neopixel_Carrier.stl' + note});
    const barfCarrier = add('led-carrier-barf' + w.tag, 'BARF LED carrier', at(src.barf), 'primary', {...onFront, when: both('logo=barf'), note: '[o]_BARF_LED_Carrier.stl' + note});
    CARRIERS.push(npCarrier, barfCarrier);
    LOGO_LEDS.push(add('led-logo-np' + w.tag, 'Neopixel (logo)', at(src.npLed), 'electronics', {parent: npCarrier, when: both('logo=neopixel')}),
      add('led-logo-barf' + w.tag, 'BARF LED board', at(src.barfLed), 'electronics', {parent: barfCarrier, when: both('logo=barf')}));
  }
  const nozzleMount = {
    x2: add('led-nozzle-x2', 'Nozzle LED mount (2 LEDs)', pick(N('Nozzle_LEDx2_Mount:'), 1), 'primary', {...onFront, when: 'nozzle=x2', note: 'Nozzle_LEDx2_Mount.stl'}),
    x1: add('led-nozzle-x1', 'Nozzle LED mount (1 LED)', pick(N('Nozzle_LEDx1_Mount:'), 1), 'primary', {...onFront, when: 'nozzle=x1', note: 'Nozzle_LEDx1_Mount.stl'}),
    strip: add('led-nozzle-strip', 'Nozzle LED strip mount', pick(N('Nozzle_LED_Strip_Mount:'), 1), 'primary', {...onFront, when: 'nozzle=strip', note: 'Nozzle_LED_Strip_Mount.stl'})
  };
  const backer = {
    '4010': add('led-backer-4010', 'LED strip backer (4010)', pick(N('Nozzle_LED_Strip_Backer_4010:'), 1), 'primary', {parent: nozzleMount.strip, when: ['nozzle=strip', 'variant=4010'], note: 'Nozzle_LED_Strip_Backer_4010.stl'}),
    '5015': add('led-backer-5015', 'LED strip backer (5015)', pick(N('Nozzle_LED_Strip_Backer_5015:'), 1), 'primary', {parent: nozzleMount.strip, when: ['nozzle=strip', 'variant=5015'], note: 'Nozzle_LED_Strip_Backer_5015.stl'})
  };
  const NP = v => new RegExp(`/${v}:1/${v}_Hardware:1/Neopixel Mini Button PCB`);
  const nozzleLeds = [];
  for (const v of ['4010', '5015']) {
    const y = v === '4010' ? -22.2 : -25.2;
    const [left, right] = near(NP(v), [[-5.5, y, 18.2], [5.5, y, 18.2]]);
    nozzleLeds.push(...each(`led-np-${v}`, 'Neopixel (nozzle)', [left, right], 'electronics', {parent: nozzleMount.x2, when: ['nozzle=x2', `variant=${v}`]}));
    nozzleLeds.push(add(`led-np1-${v}`, 'Neopixel (nozzle)', copy(right, [-5.5, 0, 0], 'one-LED nozzle mount'), 'electronics',
      {parent: nozzleMount.x1, when: ['nozzle=x1', `variant=${v}`], note: 'the CAD’s right Neopixel, drawn in the middle'}));
  }
  const NOZZLE_MOUNTS = Object.values(nozzleMount);
  ctx.ids.led = {DIFFUSERS, MASKS, CARRIERS, NOZZLE_MOUNTS};
  const STRIP = {name: 'LED strip, 144 pixels/m', qty: 1, when: 'nozzle=strip'};
  return [
    {
      id: 'led-wiring', section: 'LED Wiring', title: 'Wire the LEDs', pages: [17],
      bench: [...LOGO_LEDS, ...nozzleLeds], view: {az: -90, el: 10}, movers: [],
      text: ['Wire the LEDs in series, connecting the DOUT pad from one LED to the DIN pad on the next LED.',
        'Follow the wiring path shown on the manual’s page: the logo LED is first in the chain (index 1), followed by the right toolhead LED (index 2), then the left toolhead LED (index 3).',
        'Use 3 × 0.16 mm² (AWG26–30) wire: about 70 mm from the logo LED to the right toolhead LED and 12 mm between the toolhead LEDs. Cut the leads to the controller board to the required length.'],
      extras: [{name: 'Wire, 3 × 0.16 mm² (AWG26–30)', qty: 1}],
      notes: [{kind: 'tip', title: 'Not drawn', text: 'The CAD has no wires: see the wiring diagram on page 17 of the official manual.'}]
    },
    {
      id: 'led-carriers', section: 'LEDs', title: 'LEDs into their carriers', pages: [18],
      bench: [...CARRIERS, ...NOZZLE_MOUNTS], view: {az: -60, el: 25},
      movers: [...move(LOGO_LEDS, [0, -14, 0], 0, 0), ...move(nozzleLeds, [0, 0, 14], 0, 0, 0.2), ...move(Object.values(backer), [0, 0, 12], 1, 0)],
      text: ['Fit the wired logo LED into its carrier and the toolhead LEDs into the nozzle LED mount.',
        {text: 'For an LED strip, fit the strip into its mount with the backer for your version.', when: 'nozzle=strip'}],
      extras: [STRIP]
    },
    {
      id: 'led-diffuser', section: 'LEDs', title: 'Diffuser and mask', pages: [19],
      view: {az: 55, el: 30},
      movers: [...DIFFUSERS, ...MASKS].map(id => ({id, vec: [0, 30, 0], via: [[0, 12, 0]], phase: 0, delay: 0})),
      text: ['Insert the diffuser and mask, then slide both parts forward until they are fully seated.'],
      notes: [{kind: 'tip', title: 'LED diffuser and mask', text: 'Print the diffuser in translucent filament to help spread the light evenly. Print the mask in opaque filament to block light bleed and keep the logo edges crisp.'}]
    },
    {
      id: 'led-insert', section: 'LEDs', title: 'LEDs into the front mount', pages: [20],
      view: {az: 60, el: 25},
      movers: [...move(CARRIERS, [0, 30, 0], 0, 0), ...move(NOZZLE_MOUNTS, [0, 30, 0], 1, 0)],
      text: ['Install the wired LEDs and carriers, then route the wires through the wire channels.']
    }
  ];
};
