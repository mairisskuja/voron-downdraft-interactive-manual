// Hotend fan (manual pp. 15–16). The 2510 axial fan sits in the rear of the front mount, at the
// height of the front mount (Low 35.5, Middle 41.5, High 55.5 mm above the nozzle tip in the
// CAD). The 5015 CAD has the fan at all three heights but its printed spacer and four screws only
// at Low; the 4010 CAD has the fan only at Low. Those are drawn as copies moved to the other
// heights (`copy`, measured from the 5015 fans). See docs/transcripts/01-front-mount.md.
module.exports = ctx => {
  const {pick, add, each, auto, move, copy, HEIGHT} = ctx;
  const {fronts} = ctx.ids.fm;
  const LIFT = {low: 0, middle: 6, high: 20};
  const HEIGHTS = Object.keys(LIFT);
  const upBy = (list, h) => h === 'low' ? list : list.map(i => copy(i, [0, 0, LIFT[h]], `${h} front mount`));
  const fan4010 = pick(/\/4010:1\/4010_Hardware:1\/2510 Axial Fan/, 2);
  const fans = {}, spacers = {}, screws = {};
  for (const h of HEIGHTS) {
    fans[`4010-${h}`] = add(`hf-fan-4010-${h}`, '2510 axial fan', upBy(fan4010, h), 'fan',
      {parents: fronts['4010'], when: ['variant=4010', HEIGHT(h)], note: h === 'low' ? undefined : `drawn ${LIFT[h]} mm above the CAD's fan, for the ${h} front mount`});
    const z = 35.5 + LIFT[h];
    const f5 = pick(/\/5015:1\/5015_Hardware:1\/2510 Axial Fan/).filter(i => Math.abs(ctx.center(i)[2] - z) < 1);
    if (f5.length !== 2) throw Error(`5015 hotend fan at z ${z}: expected 2 solids, found ${f5.length}`);
    fans[`5015-${h}`] = add(`hf-fan-5015-${h}`, '2510 axial fan', f5, 'fan', {parents: fronts['5015'], when: ['variant=5015', HEIGHT(h)]});
    spacers[h] = add(`hf-spacer-${h}`, 'Hotend fan spacer', upBy(pick(/5015:1\/5015_2510_Fan_Spacer:/, 1), h), 'primary',
      {parents: fronts['5015'], when: ['variant=5015', HEIGHT(h)], note: '5015_2510_Fan_Spacer.stl (optional)'});
    screws[h] = each(`hf-m3x20-${h}`, 'M3x20 BHCS', upBy(pick(/5015_Hardware:1\/M3x20 SHCS/, 4), h), 'bolt',
      {parents: fronts['5015'], when: ['variant=5015', HEIGHT(h)], note: 'the CAD draws SHCS; the manual calls for BHCS'});
  }
  const F4 = HEIGHTS.map(h => fans[`4010-${h}`]), F5 = HEIGHTS.map(h => fans[`5015-${h}`]);
  ctx.ids.hf = {fans, F4, F5};
  const V = {az: 65, el: 20};
  return [
    {
      id: 'hf-4010', section: 'Hotend Fan', title: 'Hotend fan (4010)', pages: [15], when: 'variant=4010',
      view: V, movers: move(F4, [0, 45, 0], 0, 0),
      text: ['Insert the 2510 axial fan into the rear of the front mount. The fan will be held in place later by the left and right fan mounts.',
        'Check the fan orientation before installing it. Position the fan cable so it can route through the cable duct on either the left or right fan mount.'],
      notes: [{kind: 'tip', title: 'Note', text: 'Ducts are not installed yet. This visual shows the printed features that hold the 2510 axial fan in place.'}]
    },
    {
      id: 'hf-5015', section: 'Hotend Fan', title: 'Hotend fan and spacer (5015)', pages: [16], when: 'variant=5015',
      view: V,
      movers: [...move([...Object.values(spacers), ...F5], [0, 40, 0], 0, 0), ...move(Object.values(screws).flat(), [0, 55, 0], 1, 0.1)],
      text: ['For the 5015 version, the hotend fan is screwed directly into the front mount. An optional printed spacer can be used to concentrate airflow toward the hotend.',
        'Use M3x20 BHCS if installing the printed spacer. Use M3x16 BHCS if installing the fan without the spacer.',
        'Check the fan orientation before installing it, then route the fan cable through the cable duct on either the left or right fan mount.'],
      notes: [{kind: 'tip', title: 'Note', text: 'Some 2510 axial fans, including the common Delta version, have smaller screw holes. For these fans, you may install M2.5 heatset inserts and secure the fan to the front part with M2.5 screws.'}]
    }
  ];
};
