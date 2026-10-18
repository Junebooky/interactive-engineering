/** A05 educational physics-only world coordinate authoring for Issue #80.
 * Numbers are SVG user units (NOT CSS pixels, HTML readout card sizes or physical
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
  'mosfet-field':{sceneId:'mosfet-field',familyId:'mosfet',defaultViewBox:'0 0 630 370',subjectBounds:{x:89,y:82,width:452,height:228},essentialLabelBounds:{x:82,y:59,width:507,height:269},stableBounds:{x:78,y:52,width:517,height:280},policy:'fit-subject'},
  'mosfet-current':{sceneId:'mosfet-current',familyId:'mosfet',defaultViewBox:'0 0 630 370',subjectBounds:{x:89,y:82,width:452,height:228},essentialLabelBounds:{x:82,y:59,width:507,height:269},stableBounds:{x:78,y:52,width:517,height:280},policy:'fit-subject'},
  'nmos-resistor-inverter':{sceneId:'nmos-resistor-inverter',familyId:'mosfet-logic',defaultViewBox:'0 0 630 370',subjectBounds:{x:91,y:75,width:455,height:242},essentialLabelBounds:{x:88,y:65,width:486,height:280},stableBounds:{x:82,y:58,width:505,height:293},policy:'fit-diagram'},
  'cmos-not-gate':{sceneId:'cmos-not-gate',familyId:'mosfet-logic',defaultViewBox:'0 0 630 370',subjectBounds:{x:91,y:75,width:455,height:242},essentialLabelBounds:{x:88,y:65,width:486,height:280},stableBounds:{x:82,y:58,width:505,height:293},policy:'fit-diagram'},
  'elec-charge-current':{sceneId:'elec-charge-current',familyId:'electricity',defaultViewBox:'0 0 780 420',subjectBounds:{x:109,y:118,width:537,height:222},essentialLabelBounds:{x:95,y:80,width:585,height:274},stableBounds:{x:86,y:72,width:603,height:289},policy:'fit-diagram'},
  'elec-resistor-kcl':{sceneId:'elec-resistor-kcl',familyId:'electricity',defaultViewBox:'0 0 650 410',subjectBounds:{x:69,y:115,width:489,height:197},essentialLabelBounds:{x:67,y:70,width:529,height:251},stableBounds:{x:58,y:65,width:544,height:266},policy:'fit-diagram'},
  'elec-rc-delay':{sceneId:'elec-rc-delay',familyId:'electricity',defaultViewBox:'0 0 650 410',subjectBounds:{x:69,y:115,width:489,height:197},essentialLabelBounds:{x:67,y:70,width:529,height:251},stableBounds:{x:58,y:65,width:544,height:266},policy:'fit-diagram'},
  'elec-power-energy':{sceneId:'elec-power-energy',familyId:'electricity',defaultViewBox:'0 0 650 410',subjectBounds:{x:69,y:115,width:489,height:197},essentialLabelBounds:{x:67,y:70,width:529,height:251},stableBounds:{x:58,y:65,width:544,height:266},policy:'fit-diagram'},
  'pn-band-gap':{sceneId:'pn-band-gap',familyId:'pn',defaultViewBox:'0 0 650 415',subjectBounds:{x:80,y:111,width:490,height:205},essentialLabelBounds:{x:70,y:68,width:540,height:260},stableBounds:{x:62,y:61,width:553,height:279},policy:'fit-diagram'},
  'pn-doping':{sceneId:'pn-doping',familyId:'pn',defaultViewBox:'0 0 650 415',subjectBounds:{x:80,y:111,width:490,height:205},essentialLabelBounds:{x:70,y:68,width:540,height:260},stableBounds:{x:62,y:61,width:553,height:279},policy:'fit-diagram'},
  'pn-equilibrium':{sceneId:'pn-equilibrium',familyId:'pn',defaultViewBox:'0 0 650 415',subjectBounds:{x:80,y:111,width:490,height:205},essentialLabelBounds:{x:70,y:68,width:540,height:260},stableBounds:{x:62,y:61,width:553,height:279},policy:'fit-diagram'},
  'pn-depletion-bias':{sceneId:'pn-depletion-bias',familyId:'pn',defaultViewBox:'0 0 650 415',subjectBounds:{x:80,y:111,width:490,height:205},essentialLabelBounds:{x:70,y:68,width:540,height:260},stableBounds:{x:62,y:61,width:553,height:279},policy:'fit-diagram'},
  'pn-diode-to-mos':{sceneId:'pn-diode-to-mos',familyId:'pn',defaultViewBox:'0 0 650 415',subjectBounds:{x:80,y:111,width:490,height:205},essentialLabelBounds:{x:70,y:68,width:540,height:260},stableBounds:{x:62,y:61,width:553,height:279},policy:'fit-diagram'},
  'mos14-oxide-field':{sceneId:'mos14-oxide-field',familyId:'mos14',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:93,width:493,height:278},essentialLabelBounds:{x:76,y:43,width:519,height:332},stableBounds:{x:67,y:37,width:538,height:343},policy:'fit-subject'},
  'mos14-accumulation-inversion':{sceneId:'mos14-accumulation-inversion',familyId:'mos14',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:93,width:493,height:278},essentialLabelBounds:{x:76,y:43,width:519,height:332},stableBounds:{x:67,y:37,width:538,height:343},policy:'fit-subject'},
  'mos14-capacitance-cv':{sceneId:'mos14-capacitance-cv',familyId:'mos14',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:93,width:493,height:278},essentialLabelBounds:{x:76,y:43,width:519,height:332},stableBounds:{x:67,y:37,width:538,height:343},policy:'fit-subject'},
  'mos14-cap-to-nmosfet':{sceneId:'mos14-cap-to-nmosfet',familyId:'mos14',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:93,width:493,height:278},essentialLabelBounds:{x:76,y:43,width:519,height:332},stableBounds:{x:67,y:37,width:538,height:343},policy:'fit-subject'},
  'dram-write':{sceneId:'dram-write',familyId:'dram',defaultViewBox:'0 0 650 410',subjectBounds:{x:77,y:110,width:492,height:225},essentialLabelBounds:{x:71,y:71,width:525,height:274},stableBounds:{x:64,y:64,width:542,height:292},policy:'fit-diagram'},
  'dram-sense-restore':{sceneId:'dram-sense-restore',familyId:'dram',defaultViewBox:'0 0 650 410',subjectBounds:{x:77,y:110,width:492,height:225},essentialLabelBounds:{x:71,y:71,width:525,height:274},stableBounds:{x:64,y:64,width:542,height:292},policy:'fit-diagram'},
  'dram-leak-refresh':{sceneId:'dram-leak-refresh',familyId:'dram',defaultViewBox:'0 0 650 410',subjectBounds:{x:77,y:110,width:492,height:225},essentialLabelBounds:{x:71,y:71,width:525,height:274},stableBounds:{x:64,y:64,width:542,height:292},policy:'fit-diagram'},
  'dram-row-bank':{sceneId:'dram-row-bank',familyId:'dram',defaultViewBox:'0 0 650 410',subjectBounds:{x:77,y:110,width:492,height:225},essentialLabelBounds:{x:71,y:71,width:525,height:274},stableBounds:{x:64,y:64,width:542,height:292},policy:'fit-diagram'},
  'sram-cross-coupled-inverters':{sceneId:'sram-cross-coupled-inverters',familyId:'sram',defaultViewBox:'0 0 650 420',subjectBounds:{x:72,y:108,width:503,height:217},essentialLabelBounds:{x:71,y:67,width:533,height:262},stableBounds:{x:64,y:58,width:553,height:286},policy:'fit-diagram'},
  'sram-6t-access':{sceneId:'sram-6t-access',familyId:'sram',defaultViewBox:'0 0 650 420',subjectBounds:{x:72,y:108,width:503,height:217},essentialLabelBounds:{x:71,y:67,width:533,height:262},stableBounds:{x:64,y:58,width:553,height:286},policy:'fit-diagram'},
  'cpu-cache-vs-dram':{sceneId:'cpu-cache-vs-dram',familyId:'sram',defaultViewBox:'0 0 650 420',subjectBounds:{x:72,y:108,width:503,height:217},essentialLabelBounds:{x:71,y:67,width:533,height:262},stableBounds:{x:64,y:58,width:553,height:286},policy:'fit-diagram'},
  'cpu-to-gpu-data-locality':{sceneId:'cpu-to-gpu-data-locality',familyId:'sram',defaultViewBox:'0 0 650 420',subjectBounds:{x:72,y:108,width:503,height:217},essentialLabelBounds:{x:71,y:67,width:533,height:262},stableBounds:{x:64,y:58,width:553,height:286},policy:'fit-diagram'},
  'nand-threshold':{sceneId:'nand-threshold',familyId:'nand04',defaultViewBox:'0 0 680 400',subjectBounds:{x:56,y:124,width:584,height:233},essentialLabelBounds:{x:53,y:76,width:596,height:300},stableBounds:{x:47,y:68,width:607,height:313},policy:'fit-diagram'},
  'nand-page-block':{sceneId:'nand-page-block',familyId:'nand04',defaultViewBox:'0 0 680 400',subjectBounds:{x:56,y:124,width:584,height:233},essentialLabelBounds:{x:53,y:76,width:596,height:300},stableBounds:{x:47,y:68,width:607,height:313},policy:'fit-diagram'},
  'ssd-ftl-reliability':{sceneId:'ssd-ftl-reliability',familyId:'nand04',defaultViewBox:'0 0 680 400',subjectBounds:{x:56,y:124,width:584,height:233},essentialLabelBounds:{x:53,y:76,width:596,height:300},stableBounds:{x:47,y:68,width:607,height:313},policy:'fit-diagram'},
  'nvme-transfer':{sceneId:'nvme-transfer',familyId:'nand04',defaultViewBox:'0 0 680 400',subjectBounds:{x:56,y:124,width:584,height:233},essentialLabelBounds:{x:53,y:76,width:596,height:300},stableBounds:{x:47,y:68,width:607,height:313},policy:'fit-diagram'},
  'ai-datacenter-pipeline':{sceneId:'ai-datacenter-pipeline',familyId:'nand04',defaultViewBox:'0 0 680 400',subjectBounds:{x:56,y:124,width:584,height:233},essentialLabelBounds:{x:53,y:76,width:596,height:300},stableBounds:{x:47,y:68,width:607,height:313},policy:'fit-diagram'},
  'gpu-compute-feeding':{sceneId:'gpu-compute-feeding',familyId:'gpu',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:120,width:485,height:190},essentialLabelBounds:{x:69,y:70,width:550,height:266},stableBounds:{x:62,y:63,width:560,height:280},policy:'fit-diagram'},
  'gpu-memory-family-roles':{sceneId:'gpu-memory-family-roles',familyId:'gpu',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:120,width:485,height:190},essentialLabelBounds:{x:69,y:70,width:550,height:266},stableBounds:{x:62,y:63,width:560,height:280},policy:'fit-diagram'},
  'gpu-gddr-width-rate':{sceneId:'gpu-gddr-width-rate',familyId:'gpu',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:120,width:485,height:190},essentialLabelBounds:{x:69,y:70,width:550,height:266},stableBounds:{x:62,y:63,width:560,height:280},policy:'fit-diagram'},
  'gpu-hbm-tradeoffs':{sceneId:'gpu-hbm-tradeoffs',familyId:'gpu',defaultViewBox:'0 0 650 405',subjectBounds:{x:80,y:120,width:485,height:190},essentialLabelBounds:{x:69,y:70,width:550,height:266},stableBounds:{x:62,y:63,width:560,height:280},policy:'fit-diagram'},
};
export function getA05InteractiveWorldBounds(sceneId:string):A05InteractiveFraming|undefined {
 return A05_INTERACTIVE_WORLD_BOUNDS[sceneId];
}
