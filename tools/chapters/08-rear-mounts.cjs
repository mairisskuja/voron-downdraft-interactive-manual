// Toolhead optional mounts (manual p. 32), the cable chain option (pp. 33–39) and the PCB + PUG
// umbilical option (pp. 40–44). Square nuts in the rear slots of the hotend mount hold the
// mounts: the chain mount uses the right side only, the PUG mount both. Drawn: the generic
// 3-hole chain mount (3hole_Chain_SB_NH_36_PCB_Mount) and the generic left PUG mount with its
// integrated clamp (PUG_Integrated/Generic_Left_Umbilical_PCB36_Pug_Mount), as in the CAD's
// hardware. Not in the CAD: the cable chain, the PUG, the toolhead PCB and their screws, and the
// chain mount's three top inserts (drawn as copies of an insert, placed in the mount's holes).
// See docs/transcripts/05-rear-mounts.md.
module.exports = ctx => {
  const {pick, add, near, each, auto, move, again, copy} = ctx;
  const {MOUNTS} = ctx.ids.hm;
  const onMount = {parents: MOUNTS};
  const C = s => new RegExp('Common_Parts:1/' + s);
  const HW = s => C('Hardware \\(2\\):1/' + s);
  const CHAIN = 'wiring=chain|chain-pcb', PUG = 'wiring=pug', PCB = 'wiring=chain-pcb|pug';
  const chainMount = add('rm-chain', 'Cable chain + PCB mount', pick(C('PCB_And_Chain_Mounts:1/Cable_Chain_PCB_Mounts:1/3hole_Chain_SB_NH_36_PCB_Mount:'), 1), 'primary',
    {...onMount, when: CHAIN, note: '3hole_Chain_SB_NH_36_PCB_Mount.stl (generic 3-hole chain; extruder-specific versions exist)'});
  const pugMount = add('rm-pug', 'PCB + PUG umbilical mount', pick(C('PCB_And_Chain_Mounts:1/Umbilical_PCB_Mounts:1/PUG_Integrated:1/Generic_Left_Umbilical_PCB36_Pug_Mount:'), 1), 'primary',
    {...onMount, when: PUG, note: 'PUG_Integrated/Generic_Left_Umbilical_PCB36_Pug_Mount.stl (extruder-specific versions exist)'});
  const clamp = add('rm-pug-clamp', 'PUG clamp', pick(C('PCB_And_Chain_Mounts:1/Umbilical_PCB_Mounts:1/PUG_Integrated:1/PUG_Integrated_Clamp:'), 1), 'primary',
    {parent: pugMount, when: PUG, note: 'PUG_Integrated/PUG_Integrated_Clamp.stl'});
  const REAR = [chainMount, pugMount], onRear = {parents: REAR};
  // Square nuts in the rear slots, and the screws that hold the mount: right side for both, left for the PUG mount.
  const [nutRL, nutRU] = near(HW('M3 Square Nut'), [[20.4, 18.5, 70.3], [15.4, 18.5, 76.8]]);
  const [nutLL, nutLU] = near(HW('M3 Square Nut'), [[-20.3, 18.5, 70.3], [-15.3, 18.5, 76.8]]);
  const nutsR = each('rm-nut-right', 'M3 square nut', [nutRL, nutRU], 'nut', onMount);
  const nutsL = each('rm-nut-left', 'M3 square nut', [nutLL, nutLU], 'nut', {...onMount, when: PUG});
  const lowR = add('rm-m3x8-right', 'M3x8 BHCS', at(HW('M3x8 BHCS'), [24.1, 18.5, 70.3]), 'bolt', onRear);
  const upR = add('rm-m3x16-right', 'M3x16 BHCS', at(HW('M3x16 BHCS'), [21.1, 18.5, 76.8]), 'bolt', onRear);
  const lowL = add('rm-m3x8-left', 'M3x8 BHCS', at(HW('M3x8 BHCS'), [-24.0, 18.5, 70.3]), 'bolt', {...onRear, when: PUG});
  const upL = add('rm-m3x16-left', 'M3x16 BHCS', at(HW('M3x16 BHCS'), [-21.0, 18.5, 76.8]), 'bolt', {...onRear, when: PUG});
  function at(re, p) { return ctx.at(re, p); }
  // Inserts. Board holes on the back face, shared by both mounts.
  const boardIns = each('rm-insert-board', 'M3 heat set insert', near(HW('M3 Threaded Insert'), [[-21.8, 48.0, 95.6], [22.0, 48.0, 95.6], [-19.1, 48.0, 102.5], [-7.1, 48.0, 89.8]]), 'insert', onRear);
  // Chain mount: three on top, for the chain's fixed end link. Copies of the front mount's top insert (vertical, 5 mm long).
  const src = pick(/\/4010:1\/4010_Hardware:1\/M3 Threaded Insert/).find(i => ctx.dist(ctx.center(i), [10.6, -17.2, 73.8]) < 1);
  const sc = ctx.center(src);
  const top = [[-0.75, 52.75], [7.25, 49.25], [7.25, 56.25]].map(([x, y]) => copy(src, [x - sc[0], y - sc[1], 106.7 - sc[2]], 'chain mount top insert'));
  const chainIns = each('rm-insert-chain', 'M3 heat set insert', top, 'insert', {parent: chainMount, when: CHAIN, note: 'not in the CAD; drawn in the mount’s insert holes'});
  // PUG mount: two on the front (the clamp screws) and two on the left.
  const pugIns = each('rm-insert-pug', 'M3 heat set insert', near(HW('M3 Threaded Insert'), [[-13.7, 24.1, 99.7], [-26.0, 43.8, 99.7], [-29.2, 43.1, 83.0], [-29.2, 27.5, 77.1]]), 'insert', {parent: pugMount, when: PUG});
  const clampScrews = [add('rm-clamp-m3x8', 'M3x8 BHCS', at(HW('M3x8 BHCS'), [-27.2, 42.4, 99.7]), 'bolt', {parent: clamp, when: PUG}),
    add('rm-clamp-m3x12', 'M3x12 BHCS', at(HW('M3x12 BHCS'), [-17.6, 24.1, 99.7]), 'bolt', {parent: clamp, when: PUG})];
  const spacers = each('rm-spacer', 'PCB spacer 4 mm', near(C('PCB_And_Chain_Mounts:1/PCB_4mm_Spacers:'), [[-21.9, 52, 95.6], [21.9, 52, 95.6]]), 'primary', {...onRear, when: PCB, note: 'PCB_4mm_Spacer_x2.stl'});
  const BOARD = [{name: 'Toolhead PCB (36 mm)', qty: 1}, {name: 'M3x10 BHCS', qty: 2}];
  const BACK = {az: 120, el: 25}, BENCH = {az: 150, el: 25};
  const C1 = 'Cable Chain', C2 = 'PCB + PUG Umbilical';
  return [
    {
      id: 'rm-nuts', section: 'Toolhead Mounts', title: 'Square nuts for the rear mounts', pages: [32], chapter: 'Toolhead Optional Mounts',
      // The rear slots open at the top: the nuts drop in from above (the lower ones slide down a nut-sized channel).
      view: BACK, movers: [...move(nutsR, [0, 0, 20], 0, 0.15), ...move(nutsL, [0, 0, 20], 0, 0.15)],
      text: ['Several mounts are available for attaching hardware to the rear of the toolhead: cable chain mounts, various toolhead PCB mounts, a generic ADXL board mount and a PUG umbilical mount.',
        'To attach them, M3 square nuts are used in the rear slots of the hotend mount. Some mounts use only one side, while others use both sides.',
        {text: 'The cable chain mount uses the right side only.', when: CHAIN}, {text: 'The PCB + PUG umbilical mount uses both sides.', when: PUG}],
      notes: [{kind: 'tip', title: 'M3 square nuts', text: 'Keep the toolhead level during installs so the M3 square nuts do not slip out.'},
        {kind: 'warn', title: 'Note', text: 'Some of these provided mount options are extruder specific and may not fit if a spacer is placed between the toolhead and the extruder, e.g. a filament cutter.'}]
    },
    // Cable chain option
    {
      id: 'cc-inserts', section: 'Cable Chain', title: 'Cable chain mount inserts', pages: [34], chapter: C1, when: CHAIN,
      bench: [chainMount], view: BENCH,
      // The chain arm runs behind the right board insert: it comes in at an angle.
      movers: [...boardIns.map((id, k) => ({id, vec: k === 1 ? [9, 14, -6] : [0, 14, 0], phase: 0, delay: k * 0.1})), ...auto(chainIns, 1, 0.1)],
      text: ['Add 4 heatset inserts to the front of the cable chain mount.', 'Add 3 heatset inserts to the top of the cable chain mount.'],
      notes: [ctx.notes.INSERTS]
    },
    {
      id: 'cc-mount', section: 'Cable Chain', title: 'Cable chain mount', pages: [35], chapter: C1, when: CHAIN,
      view: BACK, movers: [...again(move(chainMount, [0, 40, 0])), ...auto([lowR, upR], 1, 0.15)],
      text: ['The cable chain mount uses only the right side of M3 square nuts.',
        'Secure the mount to the toolhead using an M3x8 BHCS in the lower hole on the right side at the rear of the toolhead, into the M3 square nuts. Then use an M3x16 BHCS in the upper hole.']
    },
    {
      id: 'cc-chain', section: 'Cable Chain', title: 'Cable chain', pages: [36], chapter: C1, when: CHAIN,
      view: BACK, movers: [],
      text: ['Secure the cable chain with M3x6 FHCS. Some cable chains use two screws, others use three.',
        'For a proper cable chain bend, use the fixed end link at the toolhead side, and use the unfixed end link opposite the toolhead.'],
      extras: [{name: 'Cable chain', qty: 1}, {name: 'M3x6 FHCS', qty: 3}],
      notes: [{kind: 'tip', title: 'Not drawn', text: 'The cable chain is not in the CAD.'}]
    },
    {
      id: 'cc-pcb', section: 'Cable Chain', title: 'Toolhead board', pages: [37, 38, 39], chapter: C1, when: 'wiring=chain-pcb',
      view: BACK, movers: spacers.map((id, k) => ({id, vec: [k ? 13 : -13, 19.5, -8.4], phase: 0, delay: k * 0.15})),
      text: ['Line up the two spacers behind the PCB. These provide clearance for the components on the toolhead PCB.',
        'Align the PCB and spacers with the mounting holes on the PCB mount, then secure the board with two M3x10 BHCS.'],
      extras: BOARD,
      notes: [{kind: 'tip', title: 'Not drawn', text: 'The toolhead PCB and its screws are not in the CAD. Skip this step if you are not using a toolhead PCB.'}]
    },
    // PCB + PUG umbilical option
    {
      id: 'pug-inserts', section: 'PCB + PUG Umbilical', title: 'PUG mount inserts', pages: [41], chapter: C2, when: PUG,
      bench: [pugMount], view: BENCH,
      movers: [...move(boardIns, [0, 14, 0], 0, 0.1), ...pugIns.map((id, k) => ({id, vec: k === 1 ? [-9.9, -9.9, 0] : [-14, 0, 0], phase: 1, delay: k * 0.1}))],
      text: ['Add 4 heatset inserts to the back of the PUG/chain mount.', 'Add 2 heatset inserts to the front of the PUG/chain mount.', 'Add 2 heatset inserts to the left of the PUG/chain mount.'],
      notes: [ctx.notes.INSERTS]
    },
    {
      id: 'pug-mount', section: 'PCB + PUG Umbilical', title: 'PCB + PUG umbilical mount', pages: [42], chapter: C2, when: PUG,
      view: BACK, movers: [...again(move(pugMount, [0, 40, 0])), ...auto([lowL, lowR], 1, 0.15), ...auto([upL, upR], 2, 0.15)],
      text: ['The PCB + PUG umbilical mount uses M3 square nuts on both sides of the hotend mount.',
        'Secure the toolhead PCB mount to the rear of the toolhead using two M3x8 BHCS in the lower left and right mounting holes. These fasten into the M3 square nuts.',
        'Then secure the upper mounting holes with two M3x16 BHCS to M3 square nuts.']
    },
    {
      id: 'pug-clamp', section: 'PCB + PUG Umbilical', title: 'PUG and clamp', pages: [43], chapter: C2, when: PUG,
      view: {az: 150, el: 30}, // The M3x8 runs at 45° in the CAD (axis −0.71, −0.71, 0, measured from its mesh); the M3x12 along −x.
      movers: [...move(clamp, [-30, 0, 0]), {id: clampScrews[0], vec: [-15.6, -15.6, 0], phase: 1, delay: 0}, {id: clampScrews[1], vec: [-22, 0, 0], phase: 1, delay: 0.15}],
      text: ['Place the CANBUS wire between the two halves of the PUG, then seat the assembled PUG into the mount. The grooves on the PUG should rest inside the mount.',
        'Install the clamp over the PUG and secure it with one M3x8 BHCS and one M3x12 BHCS.'],
      extras: [{name: 'PUG (parametric umbilical gland), two halves', qty: 1}, {name: 'CANBUS umbilical cable', qty: 1}],
      notes: [{kind: 'tip', title: 'PUG', text: 'PUG (Parametric umbilical gland) by fbeauKmi.', link: 'https://www.printables.com/model/378567-pug-parametric-umbilical-gland'},
        {kind: 'tip', title: 'Not drawn', text: 'The PUG and the cable are not in the CAD.'}]
    },
    {
      id: 'pug-pcb', section: 'PCB + PUG Umbilical', title: 'Toolhead board', pages: [44], chapter: C2, when: PUG,
      view: BACK, movers: spacers.map((id, k) => ({id, vec: [k ? 13 : -13, 19.5, -8.4], phase: 0, delay: k * 0.15})),
      text: ['Line up the two spacers behind the PCB. These provide clearance for the components on the toolhead PCB.',
        'Align the PCB and spacers with the mounting holes on the PCB mount, then secure the board with two M3x10 BHCS.'],
      extras: BOARD,
      notes: [{kind: 'tip', title: 'Not drawn', text: 'The toolhead PCB and its screws are not in the CAD.'}]
    },
    {
      id: 'finale', chapter: 'Next Steps', section: 'Next Steps', title: 'Assembly completed!', pages: [45], finale: true,
      view: {az: -125, el: 18}, movers: [],
      text: ['Your DownDraft is built. Mount it on your printer’s carriage with the four mounting screws, then wire and configure it.'],
      notes: [{kind: 'tip', title: 'How to get help', text: 'If you need assistance with your build, head over to the VORON Discord and post your questions, or use the VORON subreddit.', link: 'https://discord.gg/voron'},
        {kind: 'tip', title: 'Documentation', text: 'Setup and calibration are described on the VORON documentation pages.', link: 'https://docs.vorondesign.com/'}]
    }
  ];
};
