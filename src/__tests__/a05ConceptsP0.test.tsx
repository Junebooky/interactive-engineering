import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {courses} from '../content/courses';
import {resolveStepVisual} from '../engine/visualRegistry';
import {A05ConceptStructureVisual,A05_CONCEPT_META,A05_CONCEPT_VISUAL_IDS} from '../a05/concepts/A05ConceptStructureVisual';
import {A05_PUBLISHED_CONCEPTS,getA05ConceptVisualId,isA05ConceptVisualId} from '../a05/concepts/a05ConceptContract';

describe('A05 #70 P0 engineering concept architecture / science-safe reveal',()=>{
 it('has intentionally different structural diagram for every current A02 published lesson',()=>{
  const all=courses.flatMap(c=>c.lessons.map(l=>l.id));
  expect(new Set(all).size).toBe(10);
  expect(Object.keys(A05_PUBLISHED_CONCEPTS).sort()).toEqual([...all].sort());
  expect(new Set(A05_CONCEPT_VISUAL_IDS).size).toBe(10);
  const diagrams=all.map(id=>{
   const type=getA05ConceptVisualId(id);
   expect(type).toBeDefined();
   expect(isA05ConceptVisualId(type!)).toBe(true);
   return type;
  });
  expect(new Set(diagrams).size).toBe(10);
  expect(getA05ConceptVisualId('unknown-new-published-lesson')).toBeUndefined();
 });
 it('all existing CONCEPT steps resolve to science-owned A05 structural visual IDs',()=>{
  let concepts=0;
  for(const course of courses)for(const lesson of course.lessons)for(const step of lesson.steps){
   if(step.stepType!=='CONCEPT')continue;
   concepts++;
   const spec=resolveStepVisual(lesson.id,step);
   expect(spec.mode).toBe('concept');
   expect(spec.spoilerSafe).toBe(true);
   expect(spec.visualId).toBe(getA05ConceptVisualId(lesson.id));
  }
  expect(concepts).toBeGreaterThanOrEqual(9);
 });
 it.each(A05_CONCEPT_VISUAL_IDS)('%s SVG accessible geometry and zero active outcome/teacher-spoiler values',(id)=>{
  const html=renderToStaticMarkup(<A05ConceptStructureVisual visualId={id}
    title="교사 전용 정답과 초당 FLOPS 1234" caption="학습 완료 증거: TRUE" subtitle="5V/5mA 정답"/>);
  expect(html).toContain('<svg');
  expect(html).toContain('role="img"');
  expect(html).toContain('tabindex="0"');
  expect(html).toContain('aria-label');
  expect(html).toContain('개념 구조 도해');
  expect(html).toContain(A05_CONCEPT_META[id].title);
  expect(html).not.toContain('교사 전용');
  expect(html).not.toContain('학습 완료 증거');
  expect(html).not.toContain('1234');
  expect(html).not.toContain('초당 FLOPS');
  expect(html).not.toContain('학습 정답');
  expect(html).toContain('aria-pressed="false"');
 });
 it('SRAM is only cross-coupled 6T topology, NAND shows selection, GPU no universal HBM guarantee',()=>{
  const sr=renderToStaticMarkup(<A05ConceptStructureVisual visualId="sram-intro"/>);
  expect(sr).toContain('교차 피드백');
  expect(sr).toContain('4T 래치 + 2T 접근');
  expect(sr).not.toContain('Q=1');
  const na=renderToStaticMarkup(<A05ConceptStructureVisual visualId="nand-intro"/>);
  expect(na).toContain('상단 선택');
  expect(na).toContain('하단 선택');
  expect(na).not.toContain('10년 이상');
  const gpu=renderToStaticMarkup(<A05ConceptStructureVisual visualId="gpu-intro"/>);
  expect(gpu).toContain('HBM 스택 (예시)');
  expect(gpu).not.toContain('GB/s');
  const pn=renderToStaticMarkup(<A05ConceptStructureVisual visualId="pn-intro"/>);
  expect(pn).toContain('음의 억셉터');
  expect(pn).toContain('양의 도너');
 });
});
