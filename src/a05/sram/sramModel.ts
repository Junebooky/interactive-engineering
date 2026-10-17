/** A05 / A06 lesson 05 SRAM–CPU locality models. All timing units are illustrative. */
export type Bit = 0|1;
export type SramSceneId='sram-cross-coupled-inverters'|'sram-6t-access'|'cpu-cache-vs-dram'|'cpu-to-gpu-data-locality';
export const sramSceneOrder:readonly SramSceneId[]=[
  'sram-cross-coupled-inverters','sram-6t-access','cpu-cache-vs-dram','cpu-to-gpu-data-locality',
];
export interface SramEvent {
  sceneId:SramSceneId;
  type:'scene.enter'|'prediction.recorded'|'parameter.changed'|'answer.checked'|'hint.opened'|'voice.requested';
  payload?:Record<string,number|boolean|string>;
}
export function latch(q:Bit, feedback:boolean, supply:boolean){
  return {q:supply&&feedback?q:null, qBar:supply&&feedback?(1-q) as Bit:null,
    stable:supply&&feedback,
    note:!supply?'전원 OFF: 상태 유지 불가(휘발성)':!feedback?'되먹임 OFF: 안정 저장 보장 불가':'상보 피드백: 안정 논리 모형'};
}
export type AccessMode='write'|'read';
export function access6T(q:Bit, wordline:Bit, bl:Bit, mode:AccessMode){
  const qNext=wordline&&mode==='write'?bl:q;
  return {q:qNext,qBar:(1-qNext) as Bit,connected:wordline===1,
    readBit:wordline&&mode==='read'?q:null,readDisturbPossible:wordline&&mode==='read'};
}
export type CacheRequest='A'|'B'|'C';
export const REQUESTS:readonly CacheRequest[]=['A','A','B','A','C'];
export interface CacheFrame {request:CacheRequest;hit:boolean;evicted:CacheRequest|null;slots:CacheRequest[];cost:number;total:number}
export function simulateLru(lines:1|2,seq:readonly CacheRequest[]=REQUESTS):{frames:CacheFrame[];total:number;hits:number;misses:number}{
  const cache:CacheRequest[]=[];let total=0,hits=0,misses=0;
  const frames=seq.map(request=>{
    const index=cache.indexOf(request);
    const hit=index!==-1, cost=hit?1:10;
    hit?hits++:misses++;
    if(hit)cache.splice(index,1);
    let evicted:CacheRequest|null=null;
    if(!hit&&cache.length===lines)evicted=cache.shift()??null;
    cache.push(request);
    total+=cost;
    return {request,hit,evicted,slots:[...cache],cost,total};
  });
  return {frames,total,hits,misses};
}
export function dataLocality(modelResident:boolean){
  return {modelUploadNeeded:!modelResident,
    modelPath:modelResident?'GPU device DRAM/HBM/GDDR에서 가중치 재사용':'저장소/호스트 경로에서 GPU 메모리로 가중치 로드',
    inputTransferRequired:true,
    inputPath:'새 입력/활성값은 계산 경로를 통해 계속 이동',
    architecture:'개별 GPU 메모리 + 호스트 메모리 예시; 통합 메모리·다른 경로도 존재'};
}
export interface SramFeedback {passed:boolean;conditions:{label:string;passed:boolean;help:string}[]}
export function assessSram(id:SramSceneId,observations:readonly string[],answer:string|null):SramFeedback{
  const seen=(x:string)=>observations.includes(x);
  const checks:SramFeedback['conditions']=[];
  if(id==='sram-cross-coupled-inverters'){
    checks.push({label:'두 상보 비트를 전원+피드백 상태에서 관찰',passed:seen('q0')&&seen('q1'),help:'전원과 되먹임을 켜고 Q를 0과 1로 각각 놓아보세요.'});
    checks.push({label:'전원 OFF에서 데이터 휘발 확인',passed:seen('volatile'),help:'전원을 끄면 안정 유지가 불가능함을 확인하세요.'});
  }else if(id==='sram-6t-access'){
    checks.push({label:'WL OFF 격리',passed:seen('isolated'),help:'WL을 닫은 채 BL을 바꾸어 기존 Q가 유지되는지 보세요.'});
    checks.push({label:'WL ON 쓰기·읽기',passed:seen('wrote')&&seen('read'),help:'WL ON 쓰기 후 읽기에서 6T의 접근 nMOS 두 개 역할을 보세요.'});
  }else if(id==='cpu-cache-vs-dram'){
    checks.push({label:'LRU 1라인 41 toy 단위',passed:seen('one'),help:'캐시 1라인 시뮬레이션을 실행해 보세요.'});
    checks.push({label:'LRU 2라인 32 toy 단위',passed:seen('two'),help:'캐시 2라인으로 바꾸고 실행해 보세요.'});
  }else{
    checks.push({label:'상주/미상주 모델 로딩 경로 비교',passed:seen('resident')&&seen('not-resident'),help:'가중치 모델의 GPU 상주 여부를 바꾸어 비교하세요.'});
    checks.push({label:'새 입력은 상주 상태에도 이동',passed:seen('input'),help:'반복 추론 입력 이동 버튼을 실행해 보세요.'});
  }
  const keys:Record<SramSceneId,string>={
    'sram-cross-coupled-inverters':'volatile-feedback','sram-6t-access':'four-plus-two',
    'cpu-cache-vs-dram':'reuse-not-twice','cpu-to-gpu-data-locality':'weights-vs-input'};
  checks.push({label:'관찰 결과의 공학적 이유 설명',passed:answer===keys[id],help:'정답은 버튼 조작이 아니라 현상을 설명해야 합니다.'});
  return {passed:checks.every(c=>c.passed),conditions:checks};
}
