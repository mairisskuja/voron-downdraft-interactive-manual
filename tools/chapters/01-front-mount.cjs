// Front mount (manual p. 14). The front mount is the root of the toolhead: everything else rides
// on it. The CAD has, for each fan version (4010, 5015), three front mounts (Low, Middle, High:
// the hotend fan height) and, under Extras, the same three with decorative cut-outs (Brick, Hex,
// VORON: a front body plus thin face pieces for a second colour). The build options pick one
// body: version, the height of the chosen hotend and the front style.
// See docs/transcripts/01-front-mount.md.
module.exports = ctx => {
  const {pick, add, near, each, auto, HEIGHT} = ctx;
  const VERSIONS = ['4010', '5015'], HEIGHTS = ['Low', 'Middle', 'High'];
  const STYLES = [{value: 'brick', cad: 'Brick'}, {value: 'hex', cad: 'Hex'}, {value: 'voron', cad: 'VORON'}];
  const fronts = {};   // fronts[version] = [part ids]
  const inlays = [];
  for (const v of VERSIONS) {
    fronts[v] = [];
    for (const h of HEIGHTS) {
      const when = [`variant=${v}`, HEIGHT(h.toLowerCase())];
      // Each decorative set: a front body with the pattern cut in, plus face pieces 0.6 mm thick.
      // Some sets have no body of their own (the face goes on the plain front).
      const sets = STYLES.map(st => {
        const all = pick(new RegExp(`${v}_${st.cad}_Cutter:1/\\[a\\]_${v}_Front_Mount_${h}_${st.cad}:`));
        const deep = all.filter(i => ctx.I[i].bbox[1][1] - ctx.I[i].bbox[0][1] > 5);
        if (deep.length > 1) throw Error(`${v} ${h} ${st.cad}: expected at most one front body, found ${deep.length}`);
        return {...st, deep, faces: all.filter(i => !deep.includes(i))};
      });
      const onPlain = ['plain', ...sets.filter(x => !x.deep.length).map(x => x.value)];
      const plain = add(`fm-${v}-${h.toLowerCase()}`, `Front mount ${h} (${v})`, pick(new RegExp(`/${v}:1/\\[a\\]_${v}_Front_Mount_${h}:1$`), 1), 'accent',
        {when: [...when, 'front=' + onPlain.join('|')], note: `[a]_${v}_Front_Mount_${h}.stl`});
      fronts[v].push(plain);
      for (const st of sets) {
        let body = plain;
        if (st.deep.length) {
          body = add(`fm-${v}-${h.toLowerCase()}-${st.value}`, `Front mount ${h} ${st.cad} (${v})`, st.deep, 'accent',
            {when: [...when, `front=${st.value}`], note: `[a]_${v}_Front_Mount_${h}_${st.cad}.3mf, body`});
          fronts[v].push(body);
        }
        inlays.push(add(`fm-${v}-${h.toLowerCase()}-${st.value}-face`, `Front face, ${st.cad} pattern`, st.faces, 'primary',
          {when: [...when, `front=${st.value}`], parent: body, note: `[a]_${v}_Front_Mount_${h}_${st.cad}.3mf, second-colour face`}));
      }
    }
  }
  const FRONTS = [...fronts['4010'], ...fronts['5015']];
  const HW = v => new RegExp(`/${v}:1/${v}_Hardware:1/M3 Threaded Insert`);
  const ins = {
    '4010': each('fm-insert-4010', 'M3 heat set insert', near(HW('4010'), [[-18.8, -24.9, 7.2], [18.7, -24.9, 7.2], [-10.7, -17.2, 73.8], [10.6, -17.2, 73.8]]), 'insert', {parents: fronts['4010'], when: 'variant=4010'}),
    '5015': each('fm-insert-5015', 'M3 heat set insert', near(HW('5015'), [[-23.6, -36.2, 10.8], [23.5, -36.2, 10.8], [-10.7, -17.7, 73.8], [10.6, -17.7, 73.8]]), 'insert', {parents: fronts['5015'], when: 'variant=5015'})
  };
  ctx.ids.fm = {fronts, FRONTS, ins, VERSIONS, HEIGHTS};
  return [
    {
      id: 'fm-inserts', section: 'Front', title: 'Front mount inserts', pages: [14],
      bench: [...FRONTS, ...inlays], view: {az: 60, el: 25},
      movers: [...auto(ins['4010'], 0, 0.15), ...auto(ins['5015'], 0, 0.15)],
      text: ['Install four heatset inserts into the front mount: two in the lower side holes and two in the top holes.',
        {text: 'For your hotend, the compatibility list calls for the Low front mount.', when: HEIGHT('low')},
        {text: 'For your hotend, the compatibility list calls for the Middle front mount.', when: HEIGHT('middle')},
        {text: 'For your hotend, the compatibility list calls for the High front mount.', when: HEIGHT('high')},
        {text: 'The decorative front is printed in two colours: the face pattern in the second colour.', when: 'front!=plain'}],
      notes: [ctx.notes.INSERTS,
        {kind: 'tip', title: 'Front mount height', text: 'There are three front mounts for each version (Low, Middle, High) that position the hotend fan at different heights. The hardware compatibility list says which one suits your hotend; picking your hotend under Configure picks the front mount.'}]
    }
  ];
};
