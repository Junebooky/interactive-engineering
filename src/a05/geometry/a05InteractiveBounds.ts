/** A05 educational physics-only world coordinate authoring for Issue #80.
 * Calibrated label-union frames below use real Chromium getBBox of 34 sceneIds\n * in two educational physical states at 1440px, plus mobile overflow failures.\n * A stable ~8-unit guard accounts for text antialias variation across 320/390.\n * Numbers are SVG user units (NOT CSS pixels, HTML readout card sizes or physical
 * cross-device dimensions). Subject groups exclude decorative backing plates,
 * dedicated 2.5D UI panel and result readout cards. Union remains fixed over
 * all choices/physical stages within each sceneId. A02 owns actual camera math.
 * Meta is an A05 handoff, not approval of A02's current proxy DOM scale.
 */
export type A05WorldBox=Readonly<{x:number;y:number;width:number;height:number}>;
export type A05InteractiveFraming=Readonly<{
 sceneId:string;familyId:string;defaultViewBox:string;
 subjectBounds:A05WorldBox;essentialLabelBounds:A05WorldBox;
 stableBounds:A05WorldBox;policy:'fit-subject'|'fit-diagram';
}>;
export const A05_INTERACTIVE_WORLD_BOUNDS:Readonly<Record<string,A05InteractiveFraming>>={
  'mosfet-field':{sceneId:'mosfet-field',familyId:'mosfet',defaultViewBox:'0 0 630 370',subjectBounds:{x:89,y:82,width:452,height:228},essentialLabelBounds:{x:81,y:50,width:473,height:268},stableBounds:{x:81,y:50,width:473,height:268},policy:'fit-subject'},
  'mosfet-current':{sceneId:'mosfet-current',familyId:'mosfet',defaultViewBox:'0 0 630 370',subjectBounds:{x:89,y:82,width:452,height:228},essentialLabelBounds:{x:81,y:50,width:473,height:273},stableBounds:{x:81,y:50,width:473,height:273},policy:'fit-subject'},
  'nmos-resistor-inverter':{sceneId:'nmos-resistor-inverter',familyId:'mosfet-logic',defaultViewBox:'0 0 630 370',subjectBounds:{x:91,y:75,width:438,height:242},essentialLabelBounds:{x:84,y:47,width:445,height:309},stableBounds:{x:84,y:47,width:445,height:309},policy:'fit-diagram'},
  'cmos-not-gate':{sceneId:'cmos-not-gate',familyId:'mosfet-logic',defaultViewBox:'0 0 630 370',subjectBounds:{x:91,y:75,width:455,height:242},essentialLabelBounds:{x:83,y:50,width:470,height:305},stableBounds:{x:83,y:50,width:470,height:305},policy:'fit-diagram'},
  'elec-charge-current':{sceneId:'elec-charge-current',familyId:'electricity',defaultViewBox:'0 0 780 420',subjectBounds:{x:110,y:118,width:536,height:222},essentialLabelBounds:{x:110,y:75,width:549,height:273},stableBounds:{x:110,y:75,width:549,height:273},policy:'fit-diagram'},
  'elec-resistor-kcl':{sceneId:'elec-resistor-kcl',familyId:'electricity',defaultViewBox:'0 0 650 410',subjectBounds:{x:69,y:115,width:478,height:197},essentialLabelBounds:{x:61,y:57,width:486,height:256},stableBounds:{x:61,y:57,width:486,height:256},policy:'fit-diagram'},
  'elec-rc-delay':{sceneId:'elec-rc-delay',familyId:'electricity',defaultViewBox:'0 0 650 410',subjectBounds:{x:69,y:115,width:489,height:197},essentialLabelBounds:{x:65,y:58,width:511,height:261},stableBounds:{x:65,y:58,width:511,height:261},policy:'fit-diagram'},
  'elec-power-energy':{sceneId:'elec-power-energy',familyId:'electricity',defaultViewBox:'0 0 650 410',subjectBounds:{x:69,y:115,width:489,height:197},essentialLabelBounds:{x:64,y:55,width:507,height:266},stableBounds:{x:64,y:55,width:507,height:266},policy:'fit-diagram'},
  'pn-band-gap':{sceneId:'pn-band-gap',familyId:'pn',defaultViewBox:'0 0 650 415',subjectBounds:{x:80,y:111,width:443,height:205},essentialLabelBounds:{x:69,y:57,width:454,height:271},stableBounds:{x:69,y:57,width:454,height:271},policy:'fit-diagram'},
  'pn-doping':{sceneId:'pn-doping',familyId:'pn',defaultViewBox:'0 0 650 415',subjectBounds:{x:80,y:111,width:452,height:205},essentialLabelBounds:{x:68,y:57,width:464,height:284},stableBounds:{x:68,y:57,width:464,height:284},policy:'fit-diagram'},
  'pn-equilibrium':{sceneId:'pn-equilibrium',familyId:'pn',defaultViewBox:'0 0 650 415',subjectBounds:{x:80,y:111,width:490,height:205},essentialLabelBounds:{x:67,y:60,width:512,height:270},stableBounds:{x:67,y:60,width:512,height:270},policy:'fit-diagram'},
  'pn-depletion-bias':{sceneId:'pn-depletion-bias',familyId:'pn',defaultViewBox:'0 0 650 415',subjectBounds:{x:80,y:111,width:467,height:205},essentialLabelBounds:{x:67,y:60,width:480,height:259},stableBounds:{x:67,y:60,width:480,height:259},policy:'fit-diagram'},
  'pn-diode-to-mos':{sceneId:'pn-diode-to-mos',familyId:'pn',defaultViewBox:'0 0 650 415',subjectBounds:{x:80,y:111,width:490,height:205},essentialLabelBounds:{x:67,y:57,width:515,height:268},stableBounds:{x:67,y:57,width:515,height:268},policy:'fit-diagram'},
  'mos14-oxide-field':{sceneId:'mos14-oxide-field',familyId:'mos14',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:93,width:493,height:278},essentialLabelBounds:{x:48,y:30,width:585,height:348},stableBounds:{x:48,y:30,width:585,height:348},policy:'fit-subject'},
  'mos14-accumulation-inversion':{sceneId:'mos14-accumulation-inversion',familyId:'mos14',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:93,width:493,height:278},essentialLabelBounds:{x:48,y:30,width:585,height:348},stableBounds:{x:48,y:30,width:585,height:348},policy:'fit-subject'},
  'mos14-capacitance-cv':{sceneId:'mos14-capacitance-cv',familyId:'mos14',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:93,width:493,height:278},essentialLabelBounds:{x:48,y:30,width:585,height:348},stableBounds:{x:48,y:30,width:585,height:348},policy:'fit-subject'},
  'mos14-cap-to-nmosfet':{sceneId:'mos14-cap-to-nmosfet',familyId:'mos14',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:93,width:493,height:278},essentialLabelBounds:{x:48,y:30,width:585,height:348},stableBounds:{x:48,y:30,width:585,height:348},policy:'fit-subject'},
  'dram-write':{sceneId:'dram-write',familyId:'dram',defaultViewBox:'0 0 650 410',subjectBounds:{x:77,y:110,width:480,height:220},essentialLabelBounds:{x:72,y:47,width:485,height:283},stableBounds:{x:72,y:47,width:485,height:283},policy:'fit-diagram'},
  'dram-sense-restore':{sceneId:'dram-sense-restore',familyId:'dram',defaultViewBox:'0 0 650 410',subjectBounds:{x:77,y:110,width:480,height:222},essentialLabelBounds:{x:72,y:47,width:485,height:285},stableBounds:{x:72,y:47,width:485,height:285},policy:'fit-diagram'},
  'dram-leak-refresh':{sceneId:'dram-leak-refresh',familyId:'dram',defaultViewBox:'0 0 650 410',subjectBounds:{x:77,y:110,width:480,height:221},essentialLabelBounds:{x:72,y:47,width:485,height:284},stableBounds:{x:72,y:47,width:485,height:284},policy:'fit-diagram'},
  'dram-row-bank':{sceneId:'dram-row-bank',familyId:'dram',defaultViewBox:'0 0 650 410',subjectBounds:{x:77,y:110,width:459,height:225},essentialLabelBounds:{x:67,y:54,width:469,height:293},stableBounds:{x:67,y:54,width:469,height:293},policy:'fit-diagram'},
  'sram-cross-coupled-inverters':{sceneId:'sram-cross-coupled-inverters',familyId:'sram',defaultViewBox:'0 0 650 420',subjectBounds:{x:72,y:108,width:498,height:200},essentialLabelBounds:{x:68,y:54,width:502,height:254},stableBounds:{x:68,y:54,width:502,height:254},policy:'fit-diagram'},
  'sram-6t-access':{sceneId:'sram-6t-access',familyId:'sram',defaultViewBox:'0 0 650 420',subjectBounds:{x:72,y:108,width:503,height:211},essentialLabelBounds:{x:64,y:54,width:526,height:265},stableBounds:{x:64,y:54,width:526,height:265},policy:'fit-diagram'},
  'cpu-cache-vs-dram':{sceneId:'cpu-cache-vs-dram',familyId:'sram',defaultViewBox:'0 0 650 420',subjectBounds:{x:72,y:108,width:503,height:216},essentialLabelBounds:{x:63,y:56,width:516,height:268},stableBounds:{x:63,y:56,width:516,height:268},policy:'fit-diagram'},
  'cpu-to-gpu-data-locality':{sceneId:'cpu-to-gpu-data-locality',familyId:'sram',defaultViewBox:'0 0 650 420',subjectBounds:{x:72,y:108,width:503,height:213},essentialLabelBounds:{x:64,y:54,width:523,height:267},stableBounds:{x:64,y:54,width:523,height:267},policy:'fit-diagram'},
  'nand-threshold':{sceneId:'nand-threshold',familyId:'nand04',defaultViewBox:'0 0 680 400',subjectBounds:{x:56,y:124,width:567,height:178},essentialLabelBounds:{x:54,y:69,width:569,height:233},stableBounds:{x:54,y:69,width:569,height:233},policy:'fit-diagram'},
  'nand-page-block':{sceneId:'nand-page-block',familyId:'nand04',defaultViewBox:'0 0 680 400',subjectBounds:{x:56,y:124,width:580,height:202},essentialLabelBounds:{x:54,y:68,width:582,height:258},stableBounds:{x:54,y:68,width:582,height:258},policy:'fit-diagram'},
  'ssd-ftl-reliability':{sceneId:'ssd-ftl-reliability',familyId:'nand04',defaultViewBox:'0 0 680 400',subjectBounds:{x:56,y:124,width:545,height:192},essentialLabelBounds:{x:48,y:67,width:553,height:249},stableBounds:{x:48,y:67,width:553,height:249},policy:'fit-diagram'},
  'nvme-transfer':{sceneId:'nvme-transfer',familyId:'nand04',defaultViewBox:'0 0 680 400',subjectBounds:{x:56,y:124,width:573,height:201},essentialLabelBounds:{x:53,y:66,width:576,height:259},stableBounds:{x:53,y:66,width:576,height:259},policy:'fit-diagram'},
  'ai-datacenter-pipeline':{sceneId:'ai-datacenter-pipeline',familyId:'nand04',defaultViewBox:'0 0 680 400',subjectBounds:{x:56,y:124,width:584,height:233},essentialLabelBounds:{x:48,y:64,width:612,height:323},stableBounds:{x:48,y:64,width:612,height:323},policy:'fit-diagram'},
  'gpu-compute-feeding':{sceneId:'gpu-compute-feeding',familyId:'gpu',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:120,width:480,height:190},essentialLabelBounds:{x:64,y:61,width:496,height:269},stableBounds:{x:64,y:61,width:496,height:269},policy:'fit-diagram'},
  'gpu-memory-family-roles':{sceneId:'gpu-memory-family-roles',familyId:'gpu',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:120,width:485,height:188},essentialLabelBounds:{x:61,y:62,width:537,height:246},stableBounds:{x:61,y:62,width:537,height:246},policy:'fit-diagram'},
  'gpu-gddr-width-rate':{sceneId:'gpu-gddr-width-rate',familyId:'gpu',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:120,width:473,height:190},essentialLabelBounds:{x:62,y:62,width:491,height:272},stableBounds:{x:62,y:62,width:491,height:272},policy:'fit-diagram'},
  'gpu-hbm-tradeoffs':{sceneId:'gpu-hbm-tradeoffs',familyId:'gpu',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:120,width:485,height:190},essentialLabelBounds:{x:61,y:60,width:515,height:262},stableBounds:{x:61,y:60,width:515,height:262},policy:'fit-diagram'},
};
export function getA05InteractiveWorldBounds(sceneId:string):A05InteractiveFraming|undefined {
 return A05_INTERACTIVE_WORLD_BOUNDS[sceneId];
}
