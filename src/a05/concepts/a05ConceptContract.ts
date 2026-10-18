import {A05_CONCEPT_VISUAL_IDS,type A05ConceptVisualId} from './A05ConceptStructureVisual';

/** Immutable assignment for the ten actually published lessons on A02 PR #73
 * e319a095. All lesson step IDs belong to A02 Engine; A05 maps only static
 * CONCEPT domain structures. Other step types must use existing 2.5D scenes. */
export const A05_PUBLISHED_CONCEPTS:Readonly<Record<string,A05ConceptVisualId>>={
 'electricity-rc-foundations':'circuit-intro',
 'pn-doping-foundations':'pn-intro',
 'mos-capacitor-foundations':'mos-cap-intro',
 'semiconductor-mosfet-fundamentals':'mosfet-intro',
 'lesson-dram':'dram-intro',
 'lesson-sram':'sram-intro',
 'nand-essd-storage-pipeline':'nand-intro',
 'lesson-gpu':'gpu-intro',
 'circuits-ohms-law':'ohms-intro',
 'mechanics-gears-transmission':'gears-intro',
};
export function isA05ConceptVisualId(id:string):id is A05ConceptVisualId{
 return (A05_CONCEPT_VISUAL_IDS as readonly string[]).includes(id);
}
/** Reject any unreviewed lesson rather than deceptively recycling a battery.
 * A02 visualRegistry is responsible for calling this only for CONCEPT and for
 * retaining interactive simulatorType on the other published steps. */
export function getA05ConceptVisualId(lessonId:string):A05ConceptVisualId|undefined{
 return A05_PUBLISHED_CONCEPTS[lessonId];
}
