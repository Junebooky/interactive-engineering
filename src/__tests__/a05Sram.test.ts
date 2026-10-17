import {describe,it,expect} from 'vitest';
import {access6T,assessSram,dataLocality,latch,simulateLru,REQUESTS} from '../a05/sram/sramModel';
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
