// LEDs (manual pp. 17–20). The logo LED (a Neopixel, or a BARF board) sits in its carrier behind
// the diffuser and mask in the front mount; the nozzle LEDs (two Neopixels in the manual) sit in
// a mount low in the front. The CAD has both logo carriers, all three nozzle mounts and the
// Neopixels of each version. One Neopixel mount: the CAD's right Neopixel is drawn moved to the
// middle. LED strip: the strip is not in the CAD. See docs/transcripts/02-leds.md.
//
// The CAD places the logo parts and the nozzle LED mounts for the 5015 Low front mount. The other
// fronts have their logo window and nozzle-mount seat elsewhere, measured by matching the 5015 Low
// front's geometry in each: the 4010 fronts are 12.7 mm shallower at the logo (3 mm at the nozzle
// mount, as the CAD's 4010 Neopixels are); the Middle fronts lift the logo 1.5 mm (4010) or 3 mm
// (5015), the High fronts lower it 33.7 mm, below the hotend fan. Those parts are drawn as copies
// in the chosen front's window and seat.
module.exports = ctx => {
  const {pick, add, near, each, move, copy, HEIGHT} = ctx;
  const {FRONTS} = ctx.ids.fm;
  const L = s => new RegExp('Common_Parts:1/Logo_Led:1/' + s);
  const N = s => new RegExp('Common_Parts:1/Nozzle_Led:1/' + s);
  const onFront = {parents: FRONTS};
  const WINDOWS = [];
  for (const [v, dy] of [['5015', 0], ['4010', 12.7]]) for (const [h, dz] of [['low', 0], ['middle', v === '4010' ? 1.5 : 3], ['high', -33.7]]) {
    WINDOWS.push({tag: v === '5015' && h === 'low' ? '' : `-${v}-${h}`, dy, dz, when: [`variant=${v}`, HEIGHT(h)], why: `logo window of the ${v} ${h} front mount`});
  }
  const src = {
    diffuser: pick(L('\\[c\\]_LED_Diffuser:'), 1), mask: pick(L('\\[o\\]_LED_Diffuser_Mask:'), 1),
    np: pick(L('\\[o\\]_Neopixel_Carrier:'), 1), barf: pick(L('\\[o\\]_BARF_LED_Carrier:'), 1),
    npLed: pick(L('Hardware:1/rgbw_led_pcb'), 14), barfLed: pick(L('Hardware:1/RGBW_LED_circular_panel'))
  };
  const DIFFUSERS = [], MASKS = [], CARRIERS = [], LOGO_LEDS = [];
  for (const w of WINDOWS) {
    const at = list => w.dy || w.dz ? list.map(i => copy(i, [0, w.dy, w.dz], w.why)) : list;
    const note = w.dy || w.dz ? ', drawn in this front mount’s logo window' : '';
    const both = x => [].concat(w.when, x || []);
    DIFFUSERS.push(add('led-diffuser' + w.tag, 'LED diffuser', at(src.diffuser), 'glass', {...onFront, when: both(), note: '[c]_LED_Diffuser.stl, translucent' + note}));
    MASKS.push(add('led-mask' + w.tag, 'LED diffuser mask', at(src.mask), 'primary', {...onFront, when: both(), note: '[o]_LED_Diffuser_Mask.stl, opaque' + note}));
    const npCarrier = add('led-carrier-np' + w.tag, 'Neopixel carrier', at(src.np), 'primary', {...onFront, when: both('logo=neopixel'), note: '[o]_Neopixel_Carrier.stl' + note});
    const barfCarrier = add('led-carrier-barf' + w.tag, 'BARF LED carrier', at(src.barf), 'primary', {...onFront, when: both('logo=barf'), note: '[o]_BARF_LED_Carrier.stl' + note});
    CARRIERS.push(npCarrier, barfCarrier);
    LOGO_LEDS.push(add('led-logo-np' + w.tag, 'Neopixel (logo)', at(src.npLed), 'electronics', {parent: npCarrier, when: both('logo=neopixel')}),
      add('led-logo-barf' + w.tag, 'BARF LED board', at(src.barfLed), 'electronics', {parent: barfCarrier, when: both('logo=barf')}));
  }
  // Nozzle LED mounts and strip backers: the CAD's, in the 5015 seat; for the 4010, copies 3 mm back.
  const NOZ = [['x2', 'Nozzle LED mount (2 LEDs)', 'Nozzle_LEDx2_Mount'], ['x1', 'Nozzle LED mount (1 LED)', 'Nozzle_LEDx1_Mount'], ['strip', 'Nozzle LED strip mount', 'Nozzle_LED_Strip_Mount']];
  const nozzleMount = {'4010': {}, '5015': {}};
  for (const [key, name, cad] of NOZ) {
    const i = pick(N(cad + ':'), 1);
    nozzleMount['5015'][key] = add(`led-nozzle-${key}`, name, i, 'primary', {...onFront, when: [`nozzle=${key}`, 'variant=5015'], note: cad + '.stl'});
    nozzleMount['4010'][key] = add(`led-nozzle-${key}-4010`, name, i.map(j => copy(j, [0, 3, 0], '4010 nozzle LED seat')), 'primary',
      {...onFront, when: [`nozzle=${key}`, 'variant=4010'], note: cad + '.stl, drawn in the 4010 front mount’s seat'});
  }
  const backer = {
    '4010': add('led-backer-4010', 'LED strip backer (4010)', pick(N('Nozzle_LED_Strip_Backer_4010:'), 1).map(j => copy(j, [0, 3, 0], '4010 nozzle LED seat')), 'primary', {parent: nozzleMount['4010'].strip, when: ['nozzle=strip', 'variant=4010'], note: 'Nozzle_LED_Strip_Backer_4010.stl'}),
    '5015': add('led-backer-5015', 'LED strip backer (5015)', pick(N('Nozzle_LED_Strip_Backer_5015:'), 1), 'primary', {parent: nozzleMount['5015'].strip, when: ['nozzle=strip', 'variant=5015'], note: 'Nozzle_LED_Strip_Backer_5015.stl'})
  };
  const NP = v => new RegExp(`/${v}:1/${v}_Hardware:1/Neopixel Mini Button PCB`);
  const nozzleLeds = [];
  for (const v of ['4010', '5015']) {
    const y = v === '4010' ? -22.2 : -25.2;
    const [left, right] = near(NP(v), [[-5.5, y, 18.2], [5.5, y, 18.2]]);
    nozzleLeds.push(...each(`led-np-${v}`, 'Neopixel (nozzle)', [left, right], 'electronics', {parent: nozzleMount[v].x2, when: ['nozzle=x2', `variant=${v}`]}));
    nozzleLeds.push(add(`led-np1-${v}`, 'Neopixel (nozzle)', copy(right, [-5.5, 0, 0], 'one-LED nozzle mount'), 'electronics',
      {parent: nozzleMount[v].x1, when: ['nozzle=x1', `variant=${v}`], note: 'the CAD’s right Neopixel, drawn in the middle'}));
  }
  const NOZZLE_MOUNTS = [...Object.values(nozzleMount['5015']), ...Object.values(nozzleMount['4010'])];
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
      movers: [...move(LOGO_LEDS, [0, -14, 0], 0, 0), ...move(nozzleLeds, [0, 0, 14], 0, 0, 0.2), ...move(Object.values(backer), [0, -10, -8], 1, 0)],
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
