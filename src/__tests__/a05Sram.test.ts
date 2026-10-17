import {describe,it,expect} from 'vitest';
import type {SramCellState} from '../a05/sram/sramModel';
import {access6T,assessSram,dataLocality,latch,simulateLru,REQUESTS,transitionSramCell} from '../a05/sram/sramModel';
describe('A06 05 SRAM, 6T, cache and GPU locality physics',()=>{
 it('cross-coupled inverter is stable only if both feedback and VDD exist',()=>{
   expect(latch(1,true,true)).toMatchObject({q:1,qBar:0,stable:true});
   expect(latch(0,true,true)).toMatchObject({q:0,qBar:1,stable:true});
   expect(latch(1,false,true)).toMatchObject({q:null,qBar:null,stable:false});
   expect(latch(1,true,false)).toMatchObject({q:null,qBar:null,stable:false});
 });
 it('6T access: WL=0 isolates, WL=1 drives write/read; read exposes disturb risk',()=>{
   expect(access6T(0,0,1,'write').q).toBe(0);
   expect(access6T(0,1,1,'write').q).toBe(1);
   expect(access6T(1,0,0,'read').readBit).toBeNull();
   expect(access6T(1,1,0,'read')).toMatchObject({q:1,qBar:0,readBit:1,readDisturbPossible:true});
 });
 it('VDD loss cannot resurrect old Q even if power returns; explicit initialization is required',()=>{
   const before=latch(1,true,true);expect(before.q).toBe(1);
   const lost=latch(null,true,false);expect(lost).toMatchObject({q:null,stable:false});
   const afterOn=latch(null,true,true);expect(afterOn).toMatchObject({q:null,qBar:null,stable:false});
   expect(latch(0,true,true)).toMatchObject({q:0,stable:true});
 });
 it('6T persists writes on both BL-first and WL-first orders and preserves Q after WL off and READ',()=>{
   const initial:SramCellState={q:0,wl:0,bl:0,mode:'write'};
   const blFirst=transitionSramCell(initial,{type:'bl',value:1});
   expect(blFirst.q).toBe(0); // isolated
   const written1=transitionSramCell(blFirst,{type:'wl',value:1});
   expect(written1.q).toBe(1);
   const off=transitionSramCell(written1,{type:'wl',value:0});
   expect(off.q).toBe(1);
   const wlFirst=transitionSramCell(initial,{type:'wl',value:1});
   const written2=transitionSramCell(wlFirst,{type:'bl',value:1});
   expect(written2.q).toBe(1);
   const read=transitionSramCell(written2,{type:'mode',value:'read'});
   expect(read.q).toBe(1);
   const readChange=transitionSramCell(read,{type:'bl',value:0});
   expect(readChange.q).toBe(1); // READ does not write
   const readOff=transitionSramCell(readChange,{type:'wl',value:0});
   expect(readOff.q).toBe(1);
   const isolated=transitionSramCell(off,{type:'bl',value:0});
   expect(isolated.q).toBe(1);
 });
 it('A,A,B,A,C toy LRU reports 41/32 as time costs, not nanoseconds',()=>{
   expect(REQUESTS).toEqual(['A','A','B','A','C']);
   const one=simulateLru(1),two=simulateLru(2);
   expect(one.total).toBe(41);expect(one.hits).toBe(1);expect(one.misses).toBe(4);
   expect(two.total).toBe(32);expect(two.hits).toBe(2);expect(two.misses).toBe(3);
   expect(one.frames.map(x=>x.hit)).toEqual([false,true,false,false,false]);
   expect(two.frames.map(x=>x.hit)).toEqual([false,true,false,true,false]);
 });
 it('resident GPU weights still require new input transfer',()=>{
   expect(dataLocality(true)).toMatchObject({modelUploadNeeded:false,inputTransferRequired:true});
   expect(dataLocality(false)).toMatchObject({modelUploadNeeded:true,inputTransferRequired:true});
 });
 it('all scenes gate success on both observation and explanation',()=>{
   const cases=[
     ['sram-cross-coupled-inverters',['q0','q1','volatile'],'volatile-feedback'],
     ['sram-6t-access',['isolated','wrote','read'],'four-plus-two'],
     ['cpu-cache-vs-dram',['one','two'],'reuse-not-twice'],
     ['cpu-to-gpu-data-locality',['resident','not-resident','input'],'weights-vs-input']
   ] as const;
   for(const [id,facts,key] of cases){
     expect(assessSram(id,facts,null).passed).toBe(false);
     expect(assessSram(id,[],key).passed).toBe(false);
     expect(assessSram(id,facts,key).passed).toBe(true);
   }
 });
});
