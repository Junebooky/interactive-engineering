import type {Step} from '../types';
import {getA05ConceptVisualId} from '../a05/concepts/a05ConceptContract';
import {A05_CONCEPT_META} from '../a05/concepts/A05ConceptStructureVisual';

export type VisualMode='interactive'|'concept';
export interface VisualSpec {
 mode:VisualMode;
 visualId:string;
 title:string;
 subtitle:string;
 caption:string;
 spoilerSafe:boolean;
 simulatorType?:string;
 sceneId?:string;
}
/** A05 PR#78 proposes this stricter contract for A02 PR#73, not an app engine
 * ownership transfer. Interactive steps KEEP their current A02 simulatorType.
 * Every noninteractive published step gets its exact lesson's A05 concept
 * geometry; UNKNOWN lessons throw instead of falsely showing a generic battery.
 * A02 must independently review this app contract and its future lesson sync. */
export function resolveStepVisual(lessonId:string,step:Step):VisualSpec{
 if(step.stepType!=='CONCEPT'&&step.simulatorType){
  return {
   mode:'interactive',visualId:step.simulatorType,title:step.title,
   subtitle:step.storyLead||'',caption:'실험 결과는 실제 조작 후 확인하세요',
   spoilerSafe:false,simulatorType:step.simulatorType,sceneId:step.simulatorType
  };
 }
 if(step.stepType==='CONCEPT'&&step.simulatorType){
  // Pre-observation concept stage must never render a live interactive simulator.
  // Prevent current Step's accidental simulatorType from leaking teacher readouts.
  const id=getA05ConceptVisualId(lessonId);
  if(!id)throw Error('A05_CONCEPT_UNMAPPED_LESSON:'+lessonId);
  const info=A05_CONCEPT_META[id];
  return {mode:'concept',visualId:id,title:info.title,subtitle:info.detail,caption:info.limitation,spoilerSafe:true};
 }
 const id=getA05ConceptVisualId(lessonId);
 if(!id)throw Error('A05_CONCEPT_UNMAPPED_LESSON:'+lessonId);
 const info=A05_CONCEPT_META[id];
 return {mode:'concept',visualId:id,title:info.title,subtitle:info.detail,caption:info.limitation,spoilerSafe:true};
}
