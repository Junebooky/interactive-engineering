/** A05 authored world coordinates, not DOM/CSS pixels.
 * 10 CONCEPT subject groups exclude SVG title, full-canvas dark substrate and UI.
 * Bounds union neutral diagram geometry+labels over all static states.
 * Coordinates are *approximate initial science annotation candidates* until verified
 * in actual Chromium getBBox tests at exact HEAD; no auto cropping authorized.
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
const padded=(s:A05WorldBounds):A05WorldBounds=>({x:s.x-4,y:s.y-4,width:s.width+8,height:s.height+8});
export const A05_CONCEPT_WORLD_BOUNDS:Readonly<Record<A05ConceptVisualId,A05AuthoredFraming>>={
 'circuit-intro':{sceneId:'circuit-intro',familyId:'circuit-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:55,y:62,width:490,height:241},essentialLabelBounds:{x:45,y:44,width:521,height:265},stableBounds:padded({x:45,y:44,width:521,height:265}),policy:'fit-diagram',maxStateVariance:0},
 'ohms-intro':{sceneId:'ohms-intro',familyId:'ohms-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:60,y:67,width:488,height:236},essentialLabelBounds:{x:55,y:65,width:501,height:249},stableBounds:padded({x:55,y:65,width:501,height:249}),policy:'fit-diagram',maxStateVariance:0},
 'pn-intro':{sceneId:'pn-intro',familyId:'pn-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:69,y:90,width:477,height:180},essentialLabelBounds:{x:65,y:75,width:490,height:230},stableBounds:padded({x:65,y:75,width:490,height:230}),policy:'fit-diagram',maxStateVariance:0},
 'mos-cap-intro':{sceneId:'mos-cap-intro',familyId:'mos-cap-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:146,y:92,width:356,height:208},essentialLabelBounds:{x:58,y:88,width:463,height:230},stableBounds:padded({x:58,y:88,width:463,height:230}),policy:'fit-diagram',maxStateVariance:0},
 'mosfet-intro':{sceneId:'mosfet-intro',familyId:'mosfet-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:73,y:83,width:491,height:213},essentialLabelBounds:{x:70,y:77,width:503,height:241},stableBounds:padded({x:70,y:77,width:503,height:241}),policy:'fit-diagram',maxStateVariance:0},
 'dram-intro':{sceneId:'dram-intro',familyId:'dram-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:71,y:110,width:490,height:171},essentialLabelBounds:{x:62,y:85,width:523,height:229},stableBounds:padded({x:62,y:85,width:523,height:229}),policy:'fit-diagram',maxStateVariance:0},
 'sram-intro':{sceneId:'sram-intro',familyId:'sram-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:38,y:92,width:582,height:101},essentialLabelBounds:{x:34,y:75,width:589,height:233},stableBounds:padded({x:34,y:75,width:589,height:233}),policy:'fit-diagram',maxStateVariance:0},
 'nand-intro':{sceneId:'nand-intro',familyId:'nand-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:127,y:54,width:451,height:278},essentialLabelBounds:{x:122,y:50,width:506,height:284},stableBounds:padded({x:122,y:50,width:506,height:284}),policy:'fit-diagram',maxStateVariance:0},
 'gpu-intro':{sceneId:'gpu-intro',familyId:'gpu-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:61,y:117,width:519,height:155},essentialLabelBounds:{x:57,y:103,width:533,height:211},stableBounds:padded({x:57,y:103,width:533,height:211}),policy:'fit-diagram',maxStateVariance:0},
 'gears-intro':{sceneId:'gears-intro',familyId:'gears-intro',defaultViewBox:'0 0 640 360',subjectBounds:{x:173,y:125,width:248,height:130},essentialLabelBounds:{x:160,y:73,width:290,height:247},stableBounds:padded({x:160,y:73,width:290,height:247}),policy:'fit-diagram',maxStateVariance:0},
};
