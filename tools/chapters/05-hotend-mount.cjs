// Hotend mount (manual pp. 26–28), extruder mounting (p. 29) and toolhead mounting (pp. 30–31).
// The CAD has every hotend mount in its place on top of the front assembly; the `hotend` option
// picks one (two hotends can share a mount). The hotend, the extruder, the PTFE tube and the
// carriage are not in the CAD: they are listed, not drawn. The hotend mount carries the extruder
// nuts and screws and, later, the chain or PUG mount. See docs/transcripts/04-hotend-mount.md.
module.exports = ctx => {
  const {pick, add, near, each, auto, move, again, HOTENDS} = ctx;
  const {fronts, FRONTS} = ctx.ids.fm;
  const mounts = {};
  for (const h of HOTENDS) {
    if (mounts[h.mount]) { mounts[h.mount].values.push(h.value); continue; }
    mounts[h.mount] = {values: [h.value], code: h.code};
  }
  const MOUNTS = Object.entries(mounts).map(([cad, m]) => add(`hm-${cad.toLowerCase().replace(/_mount$/, '').replace(/_/g, '-')}`, `Hotend mount (${m.code})`,
    pick(new RegExp(`Hotend_Mounts:1/${cad}:`), 1), 'primary', {parents: FRONTS, when: 'hotend=' + m.values.join('|'), note: `Hotend_Mounts/${cad}.stl`}));
  const onMount = {parents: MOUNTS};
  const mountScrews = [], nuts = [], extScrews = [], lower = [], upper = [];
  for (const v of ['4010', '5015']) {
    const HW = s => new RegExp(`/${v}:1/${v}_Hardware:1/${s}`), when = `variant=${v}`, y = v === '4010' ? -17.2 : -17.3;
    mountScrews.push(...each(`hm-m3x6-${v}`, 'M3x6 BHCS', near(HW('M3x6 BHCS'), [[-10.7, y, 76.1], [10.6, y, 76.1]]), 'bolt', {...onMount, when}));
    nuts.push(...each(`ex-nut-${v}`, 'M3 square nut', near(HW('M3 Square Nut'), [[-19.5, 0, 76.4], [17.5, 0, 76.4]]), 'nut', {...onMount, when}));
    extScrews.push(...each(`ex-screw-${v}`, 'M3 BHCS (extruder)', near(HW('M3x8 BHCS'), [[-19.5, 0, 79.8], [17.5, 0, 79.8]]), 'bolt',
      {...onMount, when, note: 'drawn as M3x8; the length depends on your extruder'}));
    lower.push(...each(`th-m3x35-${v}`, 'M3x35 SHCS', near(HW('M3x35 SHCS'), [[-16.3, 0.3, 19.4], [16.3, 0.3, 19.4]]), 'bolt', {parents: fronts[v], when}));
    upper.push(...each(`th-m3x25-${v}`, 'M3x25 SHCS', near(HW('M3x25 SHCS'), [[-16.3, 13.6, 71.0], [16.2, 13.6, 71.0]]), 'bolt', {parents: fronts[v], when}));
  }
  ctx.ids.hm = {MOUNTS};
  const hotendLines = HOTENDS.map(h => ({text: `Yours is the ${h.code} mount, for the ${h.label}.`, when: `hotend=${h.value}`}));
  const BACK = {az: 120, el: 30};
  return [
    {
      id: 'hm-alt-inserts', section: 'Hotend Mount', title: 'Non-Orbiter v2 extruders', pages: [26],
      bench: MOUNTS, view: {az: -60, el: -35}, movers: [],
      text: ['For extruders that do not use the Orbiter v2 mounting pattern, install four heatset inserts into the hotend/extruder mount from below.',
        'Then, install two heatset inserts into the Alternative_Extruder_Spacer.',
        'Skip this step for an extruder with the Orbiter v2 mounting pattern (drawn here).'],
      extras: [{name: 'M3 heat set insert (non-Orbiter v2 only)', qty: 6}, {name: 'Alternative_Extruder_Spacer.stl (non-Orbiter v2 only)', qty: 1}],
      notes: [{kind: 'tip', title: 'Not drawn', text: 'The drawing follows the Orbiter v2 mounting pattern, which needs neither these inserts nor the spacer.'}]
    },
    {
      id: 'hm-hotend', section: 'Hotend Mount', title: 'Hotend into the mount', pages: [27],
      bench: MOUNTS, view: {az: -60, el: 25}, movers: [],
      text: ['Attach the hotend to the hotend mount using four M3x8 SHCS or M2.5x8 SHCS, depending on your hotend. Position the hotend so the cables face the rear of the toolhead.', ...hotendLines],
      extras: [{name: 'Hotend', qty: 1}, {name: 'M3x8 or M2.5x8 SHCS (for your hotend)', qty: 4}],
      notes: [{kind: 'tip', title: 'Optional', text: 'Add zip ties to the rear of the hotend mount to help retain the hotend wiring.'},
        {kind: 'tip', title: 'Not drawn', text: 'The official CAD has the hotend mounts but no hotends, so the drawing shows the mount without one.'}]
    },
    {
      id: 'hm-mount', section: 'Hotend Mount', title: 'Hotend assembly onto the front', pages: [27],
      view: {az: 55, el: 30},
      movers: [...again(move(MOUNTS, [0, 0, 45])), ...auto(mountScrews, 1)],
      text: ['Secure the hotend assembly to the front assembly with two M3x6 BHCS.',
        'Route the cables behind the hotend, then up and out the rear of the toolhead. Make sure the cables will not be pinched between the toolhead and carriage mount.']
    },
    {
      id: 'hm-ptfe', section: 'Hotend Mount', title: 'PTFE stickout', pages: [28],
      view: {az: 55, el: 30}, movers: [],
      text: ['Install the 4 mm OD × 2 mm ID PTFE tube so it extends above the toolhead far enough to seal against the extruder.',
        'The required stickout will vary depending on your hotend and extruder combination.'],
      extras: [{name: 'PTFE tube, 4 mm OD × 2 mm ID', qty: 1}],
      notes: [{kind: 'tip', title: 'Optional', text: 'Lightly chamfer the inside edge of the PTFE tube entry with a drill bit to make filament insertion easier.'},
        {kind: 'tip', title: 'Not drawn', text: 'The PTFE tube is not in the CAD.'}]
    },
    {
      id: 'ex-orbiter', section: 'Extruder Mounting', title: 'Orbiter v2 mounting', pages: [29], chapter: 'Extruder Mounting',
      view: {az: 35, el: 35},
      // The nut slots open to the sides: the left nut slides in from the left, the right one from the right.
      movers: [...nuts.map((id, k) => ({id, vec: [k % 2 ? 18 : -18, 0, 0], phase: 0, delay: (k % 2) * 0.2})), ...auto(extScrews, 1, 0.2)],
      text: ['Extruders that use the Orbiter v2 mounting pattern attach directly to the hotend mount.',
        'Insert one M3 square nut into the slot, then secure that side of the extruder with an M3 screw. Repeat for the other side.',
        'Choose M3 screws long enough to fully engage the M3 square nuts, but not so long that they protrude through the bottom of the hotend mount: the length depends on the extruder.'],
      extras: [{name: 'Extruder (Orbiter v2 mounting pattern)', qty: 1}],
      notes: [{kind: 'tip', title: 'Square nuts', text: 'M3 square nuts are used to secure the extruder because they can be tightened with more torque than heatset inserts. This helps reduce toolhead “nod” caused by extruder forces.'},
        {kind: 'tip', title: 'Non-Orbiter v2 mounting', text: 'For extruders that do not use the Orbiter v2 mounting pattern, first attach the Alternative_Extruder_Spacer to the toolhead using four M3x8 BHCS. The extruder can then be mounted to the Alternative_Extruder_Spacer. For extruders that use the LGX Lite mounting pattern, attach the extruder to the Alternative_Extruder_Spacer before installing that assembly onto the toolhead.'},
        {kind: 'tip', title: 'Not drawn', text: 'The extruder is not in the CAD: the drawing shows its nuts and screws only.'}]
    },
    {
      id: 'th-screws', section: 'Toolhead Mounting', title: 'Toolhead mounting screws', pages: [30], chapter: 'Toolhead Mounting',
      view: {az: -70, el: 15},
      movers: [...auto(lower, 0, 0.15), ...auto(upper, 1, 0.15)],
      text: ['Insert the two lower M3x35 SHCS from the front. The screws should protrude about 5 mm from the rear of the toolhead.',
        'Insert the two upper M3x25 SHCS from the front.',
        {text: 'These screws need to pass by the 5015 fans. If there is not enough clearance to slide the upper screws past the fans, loosen the lower side screws on the toolhead. Push the mounting screws past the fans, then re-tighten the side screws.', when: 'variant=5015'}]
    },
    {
      id: 'th-carriage', section: 'Toolhead Mounting', title: 'Onto the carriage', pages: [31], chapter: 'Toolhead Mounting',
      view: BACK, movers: [],
      text: ['The toolhead is secured to the carriage using the four mounting screws inserted from the front.',
        'Make sure the toolhead is seated flat against the carriage before tightening the screws in an X pattern.'],
      notes: [{kind: 'tip', title: 'Mounting compatibility', text: 'DownDraft uses the CW2 toolhead mounting pattern. This allows the assembled toolhead to mount directly to a standard CW2 carriage, as well as Tap and other CNC carriage mounts designed for StealthBurner compatibility.'},
        {kind: 'tip', title: 'Not drawn', text: 'The carriage is not in the DownDraft CAD.'}]
    }
  ];
};
