import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {A05_INTERACTIVE_WORLD_BOUNDS,getA05InteractiveWorldBounds} from '../a05/geometry/a05InteractiveBounds';
import {A05SceneVisual} from '../a05/A05SceneVisual';
import {courses} from '../content/courses';
describe('A05 #80 tight authored SVG physics world bounds contract',()=>{
 it('covers every actually published A05 2.5D simulator, excluding A02-owned ohms and gear 2D',()=>{
  const ids=[...new Set(courses.flatMap(c=>c.lessons.flatMap(l=>l.steps.map(s=>s.simulatorType).filter((x):x is string=>Boolean(x)))))];
  const a05Ids=ids.filter(id=>!['ohmsLaw','gears','mosfet','inverter'].includes(id));
  for(const id of a05Ids)expect(getA05InteractiveWorldBounds(id),id).toBeDefined();
  expect(Object.keys(A05_INTERACTIVE_WORLD_BOUNDS)).toHaveLength(34);
  expect(getA05InteractiveWorldBounds('missing-new-scene')).toBeUndefined();
 });
 it('assigns physically bounded subject and labelled unions inside each native SVG viewBox',()=>{
  for(const [id,v] of Object.entries(A05_INTERACTIVE_WORLD_BOUNDS)){
   expect(v.sceneId).toBe(id);
   const [sx,sy,w,h]=v.defaultViewBox.split(' ').map(Number);
   expect(w).toBeGreaterThan(500);
   expect(h).toBeGreaterThan(300);
   for(const box of [v.subjectBounds,v.stableBounds,v.essentialLabelBounds]){
    expect(box.width,id).toBeGreaterThan(0);
    expect(box.height,id).toBeGreaterThan(0);
    expect(box.x).toBeGreaterThanOrEqual(sx);
    expect(box.y).toBeGreaterThanOrEqual(sy);
    expect(box.x+box.width).toBeLessThanOrEqual(sx+w);
    expect(box.y+box.height).toBeLessThanOrEqual(sy+h);
   }
   expect(v.stableBounds.x).toBeLessThanOrEqual(v.subjectBounds.x);
   expect(v.stableBounds.y).toBeLessThanOrEqual(v.subjectBounds.y);
   expect(v.stableBounds.x+v.stableBounds.width).toBeGreaterThanOrEqual(v.subjectBounds.x+v.subjectBounds.width);
   expect(v.stableBounds.y+v.stableBounds.height).toBeGreaterThanOrEqual(v.subjectBounds.y+v.subjectBounds.height);
   expect(v.stableBounds.width).toBeLessThanOrEqual(w);
   expect(v.stableBounds.height).toBeLessThanOrEqual(h);
  }
 });
 it.each(['mosfet-field','mosfet-current','nmos-resistor-inverter','cmos-not-gate'] as const)(
  '%s provides a native SVG scientific subject (not scaled HTML readouts)',sceneId=>{
   const result=renderToStaticMarkup(<A05SceneVisual sceneId={sceneId} values={{
    vgs:1.5,vds:1,vin:5,out0:null,out1:null}} showObservation/>);
   expect(result).toContain('data-scene-subject=');
   expect(result).toContain(`data-scene-id="${sceneId}"`);
   expect(result).toContain('class="a05-readouts"');
   const beforeMetrics=result.slice(0,result.indexOf('class="a05-readouts"'));
   expect(beforeMetrics).toContain('</svg>');
   expect(beforeMetrics).toContain('</g>');
 });
});
