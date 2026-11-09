// Part cooling fans (manual pp. 21–25). Each fan goes into its duct (the left and right fan
// mounts) on the bench; the duct is then fitted to the front assembly with one M3x6 BHCS into
// the lower side insert. 5015: a 5015_Fan_Spring sits in the right duct and another inside the
// front assembly on the left. The CAD also has Vindr 5015 fans in the same place; the generic
// 5015 is drawn. See docs/transcripts/03-part-cooling.md.
module.exports = ctx => {
  const {pick, add, near, each, auto, move, again} = ctx;
  const {fronts} = ctx.ids.fm;
  const duct = {}, fan = {}, screw = {};
  for (const v of ['4010', '5015']) {
    const when = `variant=${v}`, on = {parents: fronts[v], when};
    duct[`${v}-left`] = add(`pcf-duct-${v}-left`, `Left fan mount (${v})`, pick(new RegExp(`/${v}:1/${v}_Fan_Mount_Left:`), 1), 'primary', {...on, note: `${v}_Fan_Mount_Left.stl`});
    duct[`${v}-right`] = add(`pcf-duct-${v}-right`, `Right fan mount (${v})`, pick(new RegExp(`/${v}:1/${v}_Fan_Mount_Right:`), 1), 'primary', {...on, note: `${v}_Fan_Mount_Right.stl`});
    const HW = s => new RegExp(`/${v}:1/${v}_Hardware:1/${s}`);
    const z = v === '4010' ? 7.2 : 10.8, y = v === '4010' ? -24.9 : -36.2, x = v === '4010' ? 19.8 : 26.4;
    const [sl, sr] = near(HW('M3x6 BHCS'), [[-x, y, z], [x, y, z]]);
    screw[`${v}-left`] = add(`pcf-m3x6-${v}-left`, 'M3x6 BHCS', sl, 'bolt', on);
    screw[`${v}-right`] = add(`pcf-m3x6-${v}-right`, 'M3x6 BHCS', sr, 'bolt', on);
  }
  const blower = (re, n, side) => pick(re, n).filter(i => side * ctx.center(i)[0] > 0);
  fan['4010-left'] = add('pcf-fan-4010-left', '4010 blower fan', blower(/4010_Hardware:1\/4010 Blower Fan/, 2, -1), 'fan', {parent: duct['4010-left'], when: 'variant=4010'});
  fan['4010-right'] = add('pcf-fan-4010-right', '4010 blower fan', blower(/4010_Hardware:1\/4010 Blower Fan/, 2, 1), 'fan', {parent: duct['4010-right'], when: 'variant=4010'});
  fan['5015-left'] = add('pcf-fan-5015-left', '5015 blower fan', pick(/5015_Hardware:1\/5015 Blower Fan \(2\)/, 3), 'fan', {parent: duct['5015-left'], when: 'variant=5015'});
  fan['5015-right'] = add('pcf-fan-5015-right', '5015 blower fan', pick(/5015_Hardware:1\/5015 Blower Fan \(1\)/, 3), 'fan', {parent: duct['5015-right'], when: 'variant=5015'});
  const [springL, springR] = near(/5015:1\/5015_Fan_Spring_x2:/, [[-20.7, -38.7, 46.7], [20.6, 10.3, 45.5]]);
  const springRight = add('pcf-spring-right', '5015 fan spring', springR, 'primary', {parent: duct['5015-right'], when: 'variant=5015', note: '5015_Fan_Spring_x2.stl (one of two)'});
  const springLeft = add('pcf-spring-left', '5015 fan spring', springL, 'primary', {parents: fronts['5015'], when: 'variant=5015', note: '5015_Fan_Spring_x2.stl (one of two)'});
  ctx.ids.pcf = {duct};
  const out = (side, v) => side === 'left' ? [-40, 0, 0] : [40, 0, 0];
  const S4 = 'Part Cooling Fans (4010)', S5 = 'Part Cooling Fans (5015)';
  const ZIP = {kind: 'tip', title: 'Optional', text: 'Insert zip ties through the holes on the inside rear of the fan mounts for additional cable management.'};
  const LEFTCABLE = 'For the left fan, you may need to remove the cable from the retainer on the fan body. Take care not to pull the wires from the fan PCB.';
  const NOSPRING = {kind: 'warn', title: 'Note', text: 'Do not install the 5015_Fan_Spring parts when using slightly oversized 5215 fans, such as Berserker Vindrs. There is not enough clearance for the springs with these fans.'};
  return [
    {
      id: 'pcf-4010-right-fan', section: S4, title: 'Right duct fan', pages: [21], when: 'variant=4010',
      bench: [duct['4010-right']], view: {az: 20, el: 20},
      movers: move(fan['4010-right'], [32, 30, 12]),
      text: ['Install the 4010 fan into the fan duct, then route the fan cable through the cable channel.']
    },
    {
      id: 'pcf-4010-right', section: S4, title: 'Right duct', pages: [21], when: 'variant=4010',
      view: {az: 20, el: 20},
      movers: [...again(move(duct['4010-right'], out('right'))), ...auto(screw['4010-right'], 1)],
      text: ['Secure the duct assembly to the front assembly with one M3x6 BHCS.']
    },
    {
      id: 'pcf-4010-left-fan', section: S4, title: 'Left duct fan', pages: [22], when: 'variant=4010',
      bench: [duct['4010-left']], view: {az: 160, el: 20},
      movers: move(fan['4010-left'], [-33, 28, 14]),
      text: ['Insert the 4010 fan into the left duct, then route the fan cable through the cable channel.', LEFTCABLE]
    },
    {
      id: 'pcf-4010-left', section: S4, title: 'Left duct', pages: [22], when: 'variant=4010',
      view: {az: 160, el: 20},
      movers: [...again(move(duct['4010-left'], out('left'))), ...auto(screw['4010-left'], 1)],
      text: ['Secure the duct assembly to the front assembly with one M3x6 BHCS.'], notes: [ZIP]
    },
    {
      id: 'pcf-5015-right-fan', section: S5, title: 'Right duct fan', pages: [23], when: 'variant=5015',
      bench: [duct['5015-right']], view: {az: 20, el: 20},
      movers: [...move(springRight, [21, -21, 6]), ...move(fan['5015-right'], [30, -6, 16], 1)],
      text: ['Install 5015_Fan_Spring_x2 inside the right duct, then insert the 5015 fan. Route the fan cable through the cable channel.'],
      notes: [NOSPRING]
    },
    {
      id: 'pcf-5015-right', section: S5, title: 'Right duct', pages: [23], when: 'variant=5015',
      view: {az: 20, el: 20},
      movers: [...again(move(duct['5015-right'], out('right'))), ...auto(screw['5015-right'], 1)],
      text: ['Secure the duct assembly to the front assembly with one M3x6 BHCS.']
    },
    {
      id: 'pcf-5015-left-fan', section: S5, title: 'Left duct fan', pages: [24], when: 'variant=5015',
      bench: [duct['5015-left']], view: {az: 160, el: 20},
      movers: move(fan['5015-left'], [-29, -19, -3]),
      text: ['Insert the 5015 fan into the left duct, then route the fan cable through the cable channel.', LEFTCABLE]
    },
    {
      id: 'pcf-5015-spring', section: S5, title: 'Spring in the front assembly', pages: [24], when: 'variant=5015',
      view: {az: 110, el: 25},
      movers: move(springLeft, [-10, 8, 15]),
      text: ['Viewed from the rear, install 5015_Fan_Spring_x2 inside the front assembly.'], notes: [NOSPRING]
    },
    {
      id: 'pcf-5015-left', section: S5, title: 'Left duct', pages: [25], when: 'variant=5015',
      view: {az: 160, el: 20},
      movers: [...again(move(duct['5015-left'], out('left'))), ...auto(screw['5015-left'], 1)],
      text: ['Secure the duct assembly to the front assembly with one M3x6 BHCS.'], notes: [ZIP]
    }
  ];
};
