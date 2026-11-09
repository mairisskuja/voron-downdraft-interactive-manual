// Part and step catalog for the VORON DownDraft interactive manual. This file holds the shared
// helpers and the build options; every chapter is a module in tools/chapters/ (NN-name.cjs,
// loaded in order) that adds its parts and returns its steps. Later chapters reach earlier parts
// through `ctx.ids`. CHAPTERS=01,03 builds only those chapter modules (for quick checks).
//
// Parts are picked from build/assembly.json (tools/step/convert_ocp.py) by their path in the
// STEP product tree, so the selection reads like the CAD browser. Every pick states how many
// instances it expects, and the build stops if the CAD no longer matches. Step order, titles and
// tips follow the official assembly manual (version 2026-08-15); `pages` holds its pages.
//
// Build options: the official CAD is a library with every alternative in its assembled place:
// both fan versions (4010, 5015), the three front mount heights, the decorative fronts, every
// hotend mount, both logo LED carriers, the nozzle LED mounts and the chain and PUG mounts. A
// part or step with `when` exists only in builds where it holds: 'variant=5015',
// 'wiring=chain|chain-pcb', 'hotend=dragon|chube', 'front!=plain' or an array of these (all must
// hold). Wiring has three values so that "has a toolhead PCB" is one condition: 'wiring=chain-pcb|pug'. A part on one of
// several alternative hosts lists them in `parents` (the first enabled one carries it).

const fs = require('fs');
const path = require('path');

// Hotends and their mounts, from HARDWARE_COMPATIBILITY_LIST.md. `mount` is the CAD body
// (STLs/Common_Parts/Hotend_Mounts), `code` the name on the mount, `height` the front mount
// that puts the hotend fan level with the heatsink.
const HOTENDS = [
  {value: 'revo-voron', label: 'E3D Revo Voron', mount: 'Revo_Voron_Mount', code: 'REVO', height: 'low'},
  {value: 'dragon', label: 'Phaetus Dragon SF / HF', mount: 'Dragon_Mount', code: 'DRGN', height: 'low'},
  {value: 'chube', label: 'Chube Compact', mount: 'Chube_Compact_Mount', code: 'CHBC', height: 'low'},
  {value: 'tz-v6', label: 'TZ-V6 v2 (V6 nozzle)', mount: 'TZ_V6_v2_Mount', code: 'TZV6.2', height: 'low'},
  {value: 'dragon-ace', label: 'Trianglelab Dragon Ace', mount: 'Dragon_Ace_Mount', code: 'D.ACE', height: 'middle'},
  {value: 'dragon-volcano', label: 'Trianglelab Dragon Ace Volcano', mount: 'RapidoHF_DragonVolcano_Mount', code: 'RAPID', height: 'middle'},
  {value: 'rapido-hf', label: 'Phaetus Rapido HF', mount: 'RapidoHF_DragonVolcano_Mount', code: 'RAPID', height: 'middle'},
  {value: 'tricorn-short', label: 'Tricorn Air Short', mount: 'Tricorn_Short_Mount', code: 'TRI.S', height: 'middle'},
  {value: 'revo-volcano', label: 'E3D Revo Voron Volcano', mount: 'ReVolcano_Mount', code: 'R.VOL', height: 'middle'},
  {value: 'goliath', label: 'Goliath / CHC XL', mount: 'Goliath_CHCXL_Mount', code: 'GOLIATH', height: 'high'},
  {value: 'dragon-uhf', label: 'Phaetus Dragon UHF', mount: 'Dragon_Rapido_UHF_Mount', code: 'D.UHF', height: 'high'},
  {value: 'rapido-uhf', label: 'Phaetus Rapido UHF', mount: 'Dragon_Rapido_UHF_Mount', code: 'D.UHF', height: 'high'},
  {value: 'rapido-x', label: 'Phaetus Rapido X', mount: 'Rapido_X_Mount', code: 'RAP X', height: 'high'},
  {value: 'tricorn-long', label: 'Tricorn Air Long', mount: 'Tricorn_Long_Mount', code: 'TRI.L', height: 'high'},
  {value: 'dragon-ace-mze', label: 'Trianglelab Dragon Ace + MZE', mount: 'Dragon_Ace_Mount_MZE', code: 'D.ACM', height: 'high'}
];
// `when` for every hotend on one front mount height.
const HEIGHT = h => 'hotend=' + HOTENDS.filter(x => x.height === h).map(x => x.value).join('|');
const OPTIONS = [
  {key: 'variant', label: 'Part cooling fans', type: 'select', default: '4010', values: [
    {value: '4010', label: 'Dual 4010', help: 'Slimmer and lighter, for all types of filament.'},
    {value: '5015', label: 'Dual 5015', help: 'Wider, with more airflow for faster or high flow printing.'}]},
  {key: 'hotend', label: 'Hotend', type: 'select', default: 'revo-voron', values: HOTENDS.map(h => ({value: h.value, label: h.label,
    help: `Hotend mount ${h.code}, front mount ${h.height[0].toUpperCase() + h.height.slice(1)}. The hotend itself is not in the CAD and is not drawn.`}))},
  {key: 'wiring', label: 'Wiring', type: 'select', default: 'chain-pcb', values: [
    {value: 'chain-pcb', label: 'Cable chain + toolhead PCB', help: 'Cable chain mount with a 36 mm toolhead board (the board is not in the CAD).'},
    {value: 'chain', label: 'Cable chain, no PCB', help: 'Cable chain mount, wiring straight through the chain.'},
    {value: 'pug', label: 'PCB + PUG umbilical', help: 'Toolhead PCB with a CANBUS umbilical and PUG strain relief.'}]},
  {key: 'logo', label: 'Logo LED', type: 'select', default: 'neopixel', values: [
    {value: 'neopixel', label: 'Neopixel', help: '[o]_Neopixel_Carrier.stl with one Neopixel.'},
    {value: 'barf', label: 'BARF', help: '[o]_BARF_LED_Carrier.stl with a BARF LED board.'}]},
  {key: 'nozzle', label: 'Nozzle LEDs', type: 'select', default: 'x2', values: [
    {value: 'x2', label: 'Two Neopixels', help: 'Nozzle_LEDx2_Mount.stl, as in the manual.'},
    {value: 'x1', label: 'One Neopixel', help: 'Nozzle_LEDx1_Mount.stl.'},
    {value: 'strip', label: 'LED strip', help: 'Nozzle_LED_Strip_Mount.stl and its backer, for a 144 pixels/m strip (the strip is not drawn).'}]},
  {key: 'front', label: 'Front style', type: 'select', default: 'plain', values: [
    {value: 'plain', label: 'Plain', help: 'The standard front mount.'},
    {value: 'brick', label: 'Brick', help: 'Decorative cut-outs for a two-colour print (Extras/Front_Mount_Cutter_Models).'},
    {value: 'hex', label: 'Hex', help: 'Decorative cut-outs for a two-colour print (Extras/Front_Mount_Cutter_Models).'},
    {value: 'voron', label: 'VORON', help: 'Decorative cut-outs for a two-colour print (Extras/Front_Mount_Cutter_Models).'}]}
];

module.exports = function catalog(asm) {
  const I = asm.instances;
  const center = i => I[i].bbox[0].map((v, k) => (v + I[i].bbox[1][k]) / 2);
  const inside = (c, i, m = 0.5) => c.every((v, k) => v > I[i].bbox[0][k] - m && v < I[i].bbox[1][k] + m);
  const volume = i => I[i].bbox[1].reduce((s, v, k) => s * (v - I[i].bbox[0][k]), 1);
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const pick = (re, n) => {
    const out = I.map((_, i) => i).filter(i => !I[i].copy && re.test(I[i].path.join('/')));
    if (n !== undefined && out.length !== n) throw Error(`${re}: expected ${n} instances, found ${out.length}`);
    return out;
  };
  const parts = [], used = new Set();
  // The one instance of `re` nearest to a point (mm), for parts the CAD names alike. It must
  // lie within 1 mm, so a moved part in a new CAD release stops the build.
  const at = (re, p) => {
    const i = pick(re).filter(j => !used.has(j)).sort((a, b) => dist(center(a), p) - dist(center(b), p))[0];
    if (i === undefined || dist(center(i), p) > 1) throw Error(`${re}: nothing within 1 mm of ${p}`);
    return i;
  };
  const add = (id, name, inst, kind, extra = {}) => {
    inst = [].concat(inst);
    if (!inst.length || inst.some(i => i === undefined)) throw Error(`${id}: missing instance`);
    if (!kinds[kind]) throw Error(`${id}: unknown kind ${kind}`);
    inst.forEach(i => used.add(i));
    parts.push({id, name, inst, kind, ...extra});
    return id;
  };
  const free = (re, n) => {
    const out = pick(re).filter(i => !used.has(i));
    if (n !== undefined && out.length !== n) throw Error(`${re}: expected ${n} free instances, found ${out.length}`);
    return out;
  };
  // A copy of a CAD instance moved by vec (mm), for a part the CAD draws in only one of the places
  // an option puts it (the 4010 hotend fan exists only at the Low height). `why` is required.
  const copy = (i, vec, why) => {
    if (!why) throw Error('copy needs a reason');
    const src = I[i], m = src.matrix.slice(); [3, 7, 11].forEach((k, j) => { m[k] += vec[j]; });
    I.push({...src, copy: true, matrix: m, bbox: src.bbox.map(c => c.map((v, j) => v + vec[j])), path: [...src.path.slice(0, -1), src.path.at(-1) + ` (copy: ${why})`]});
    return I.length - 1;
  };
  const part = id => { const p = parts.find(q => q.id === id); if (!p) throw Error(`unknown part ${id}`); return p; };
  // Hardware gets one part per instance, so each piece can travel along its own axis.
  const each = (prefix, name, list, kind, extra = {}) => list.map((i, n) => add(`${prefix}-${n + 1}`, name, i, kind, typeof extra === 'function' ? extra(i) : extra));
  // Instances by nearest point, in the order given.
  const near = (re, points) => points.map(p => at(re, p));

  const auto = (ids, phase = 0, gap = 0.08, start = 0) => [].concat(ids).map((id, n) => ({id, vec: 'auto', phase, delay: start + n * gap}));
  const move = (ids, vec, phase = 0, gap = 0.1, start = 0) => [].concat(ids).map((id, n) => ({id, vec, phase, delay: start + n * gap}));
  const again = movers => movers.map(m => ({...m, again: true}));
  const out = movers => movers.map(m => ({...m, out: true}));

  const INSERTS = {kind: 'tip', title: 'Heatset inserts', text: 'This design uses heatset inserts throughout the assembly. Make sure you are using the correct inserts before starting. Refer to the hardware reference for a close-up photo and the BOM for dimensions. If you have not used heatset inserts before, we recommend reviewing the linked guide first.', link: 'https://voron.link/m5ybt4d'};

  const kinds = {
    primary: 'Printed, primary colour', accent: 'Printed, accent colour ([a] files)', glass: 'Printed, clear ([c] files)',
    motor: 'Motors', motion: 'Gears and shafts', bearing: 'Bearings', bolt: 'Screws', washer: 'Washers',
    insert: 'Heat set inserts', nut: 'Nuts', magnet: 'Magnets', spring: 'Springs', ptfe: 'PTFE and couplers',
    hotend: 'Hotend', fan: 'Fans', electronics: 'Electronics', rail: 'Linear rail', extrusion: 'Extrusion', misc: 'Other'
  };

  const ctx = {
    asm, I, pick, free, at, near, center, inside, volume, dist, add, each, part, parts, kinds, copy,
    auto, move, again, out, notes: {INSERTS}, HOTENDS, HEIGHT, ids: {}
  };
  const dir = path.join(__dirname, 'chapters');
  const only = process.env.CHAPTERS ? process.env.CHAPTERS.split(',') : null;
  const files = fs.readdirSync(dir).filter(f => /^\d\d-.*\.cjs$/.test(f)).sort();
  // Chapters as in the manual's table of contents; a step may name its own chapter.
  const CHAPTERS = {'01': 'Front Mount', '02': 'Hotend Fan', '03': 'LEDs', '04': 'Part Cooling Fans', '05': 'Hotend Mount',
    '06': 'Extruder Mounting', '07': 'Toolhead Mounting', '08': 'Toolhead Optional Mounts', '09': 'Cable Chain', '10': 'PCB + PUG Umbilical'};
  const steps = [];
  for (const f of files) {
    if (only && !only.some(o => f.startsWith(o))) continue;
    const chapter = CHAPTERS[f.slice(0, 2)];
    if (!chapter) throw Error(`${f}: no chapter title for ${f.slice(0, 2)}`);
    steps.push(...require(path.join(dir, f))(ctx).map(s => ({chapter, ...s})));
  }
  return {parts, steps, kinds, options: OPTIONS};
};
