/** A05 authored world coordinates, not DOM/CSS pixels.
 * 10 CONCEPT subject groups exclude SVG title, full-canvas dark substrate and UI.
 * Bounds union neutral diagram geometry+labels over all static states.
 * The essential-label/stable bounds were tightened from actual Chromium SVG
 * getBBox measurement in 1440, 390 and 320 screenshots, with 5-7 SVG units
 * of per-side safety margin. A02 must measure viewport/clip separately.
 * A02 camera must distinguish subjectBounds from essentialLabelBounds, preserve both.
 */
import type {A05ConceptVisualId} from './A05ConceptStructureVisual';
export type A05WorldBounds=Readonly<{x:number;y:number;width:number;height:number}>;
export type A05AuthoredFraming=Readonly<{
 sceneId:A05ConceptVisualId;familyId:string;
 defaultViewBox:'0 0 640 360';subjectBounds:A05WorldBounds;
 essentialLabelBounds:A05WorldBounds;stableBounds:A05WorldBounds;
 policy:'fit-diagram';maxStateVariance:0;
}>;
export const A05_CONCEPT_WORLD_BOUNDS:Readonly<Record<A05ConceptVisualId,A05AuthoredFraming>>={
 'circuit-intro':{sceneId:'circuit-intro',familyId:'circuit-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:55,y:62,width:490,height:241},essentialLabelBounds:{x:49,y:39,width:513,height:269},stableBounds:{x:49,y:39,width:513,height:269},policy:'fit-diagram',maxStateVariance:0},
 'ohms-intro':{sceneId:'ohms-intro',familyId:'ohms-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:60,y:67,width:488,height:236},essentialLabelBounds:{x:54,y:61,width:511,height:249},stableBounds:{x:54,y:61,width:511,height:249},policy:'fit-diagram',maxStateVariance:0},
 'pn-intro':{sceneId:'pn-intro',familyId:'pn-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:69,y:90,width:477,height:180},essentialLabelBounds:{x:63,y:78,width:500,height:227},stableBounds:{x:63,y:78,width:500,height:227},policy:'fit-diagram',maxStateVariance:0},
 'mos-cap-intro':{sceneId:'mos-cap-intro',familyId:'mos-cap-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:146,y:92,width:356,height:208},essentialLabelBounds:{x:54,y:86,width:465,height:235},stableBounds:{x:54,y:86,width:465,height:235},policy:'fit-diagram',maxStateVariance:0},
 'mosfet-intro':{sceneId:'mosfet-intro',familyId:'mosfet-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:73,y:83,width:491,height:213},essentialLabelBounds:{x:67,y:77,width:514,height:245},stableBounds:{x:67,y:77,width:514,height:245},policy:'fit-diagram',maxStateVariance:0},
 'dram-intro':{sceneId:'dram-intro',familyId:'dram-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:71,y:110,width:490,height:171},essentialLabelBounds:{x:65,y:77,width:445,height:226},stableBounds:{x:65,y:77,width:445,height:226},policy:'fit-diagram',maxStateVariance:0},
 'sram-intro':{sceneId:'sram-intro',familyId:'sram-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:38,y:92,width:582,height:101},essentialLabelBounds:{x:24,y:61,width:602,height:245},stableBounds:{x:24,y:61,width:602,height:245},policy:'fit-diagram',maxStateVariance:0},
 'nand-intro':{sceneId:'nand-intro',familyId:'nand-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:127,y:54,width:451,height:278},essentialLabelBounds:{x:121,y:48,width:418,height:299},stableBounds:{x:121,y:48,width:418,height:299},policy:'fit-diagram',maxStateVariance:0},
 'gpu-intro':{sceneId:'gpu-intro',familyId:'gpu-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:61,y:117,width:519,height:155},essentialLabelBounds:{x:55,y:102,width:531,height:200},stableBounds:{x:55,y:102,width:531,height:200},policy:'fit-diagram',maxStateVariance:0},
 'gears-intro':{sceneId:'gears-intro',familyId:'gears-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:173,y:125,width:248,height:130},essentialLabelBounds:{x:158,y:70,width:272,height:250},stableBounds:{x:158,y:70,width:272,height:250},policy:'fit-diagram',maxStateVariance:0},
};
