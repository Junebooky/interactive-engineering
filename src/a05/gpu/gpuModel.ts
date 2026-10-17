/** A06 G03 GPU & DRAM family educational toy models. No SKU or sustained real-world throughput guarantees. */
export type GpuSceneId='compute-feeding'|'memory-family-roles'|'gddr-width-rate'|'hbm-tradeoffs';
export const gpuSceneOrder:readonly GpuSceneId[]=['compute-feeding','memory-family-roles','gddr-width-rate','hbm-tradeoffs'];
export type ComputeRate=16|32;export type FeedRate=8|16|32;
export type PinRate=24|32;export type Placement='cpu-dimm'|'gpu-board'|'gpu-package';
export type Family='DDR/RDIMM'|'GDDR6/GDDR7'|'HBM';
export type Topology='gddr-board'|'hbm-stack';
export interface GpuEvent{
  sceneId:GpuSceneId;
  type:'scene.enter'|'prediction.recorded'|'parameter.changed'|'answer.checked'|'hint.opened'|'voice.requested';
  payload?:Record<string,string|number|boolean>;
}
export interface GpuFeedback{passed:boolean;conditions:{label:string;passed:boolean;help:string}[];}
export function computeFeeding(compute:ComputeRate,feed:FeedRate,work=64){
  if(work<=0)throw Error('positive workload required');
  const throughput=Math.min(compute,feed);
  return {work,compute,feed,throughput,toySeconds:work/throughput,
    bottleneck:feed<compute?'data supply':feed>compute?'compute':'balanced',
    assumption:'fully overlapped steady-state pipeline, no startup or drain cost'};
}
export const placement:Readonly<Record<Family,{site:Placement;role:string;disclaimer:string}>>={
  'DDR/RDIMM':{site:'cpu-dimm',role:'CPU/서버 측 시스템 메모리',disclaimer:'서버 모듈 형식 예시'},
  'GDDR6/GDDR7':{site:'gpu-board',role:'GPU 보드 가까운 장치 DRAM',disclaimer:'모든 GPU가 GDDR를 쓴다는 뜻 아님'},
  'HBM':{site:'gpu-package',role:'일부 AI/HPC 패키지의 적층 DRAM',disclaimer:'모든 GPU에 HBM이 필수는 아님'},
};
export function memoryPlacementMatches(family:Family,site:Placement){return placement[family].site===site;}
export function theoreticalBandwidth(busWidthBits:number,perPinGbps:number,efficiency=1){
  if(busWidthBits<=0||perPinGbps<=0||efficiency<0||efficiency>1)throw Error('invalid positive width/rate/efficiency');
  return {maxGBps:busWidthBits*perPinGbps/8,
    modelGBps:busWidthBits*perPinGbps*efficiency/8,
    assumption:'decimal GB/s; width bits × Gb/s per pin ÷ 8; toy 100% efficiency'};
}
export type Signal='NRZ'|'PAM3';
export function signalLevels(signal:Signal){return signal==='NRZ'?2:3;}
/** Relative visual descriptors ONLY, not measured cost, power, bandwidth or thermal values. */
export function packaging(topology:Topology){
  return topology==='hbm-stack'?{
    dram:'HBM = stacked DRAM',connection:'TSV in HBM stack; interposer or equivalent link between GPU and HBM',
    lanes:'넓은 패키지 I/O',tradeoff:'적층·미세배선·열관리·비용 복잡',
  }:{
    dram:'GDDR = DRAM chips on board',connection:'GPU package ↔ board traces ↔ GDDR packages',
    lanes:'보드 신호 경로',tradeoff:'보드 공간·신호무결성·성능/비용 균형',
  };
}
export function assessGpu(id:GpuSceneId,seen:readonly string[],answer:string|null):GpuFeedback{
  const has=(x:string)=>seen.includes(x);
  const tests:GpuFeedback['conditions']=[];
  if(id==='compute-feeding'){
    tests.push({label:'feed=8에서 compute 16와 32 비교',passed:has('core16feed8')&&has('core32feed8'),help:'공급 속도를 8로 두고 compute 16/32를 모두 측정하세요.'});
    tests.push({label:'공급 제약 해소 비교',passed:has('feed32'),help:'feed를 32로 올려 병목이 이동하는지 보세요.'});
  }else if(id==='memory-family-roles'){
    tests.push({label:'CPU DIMM ↔ DDR/RDIMM 매칭',passed:has('cpu-dimm'),help:'CPU DIMM 위치의 메모리를 선택하세요.'});
    tests.push({label:'GPU board ↔ GDDR / GPU package ↔ HBM',passed:has('gpu-board')&&has('gpu-package'),help:'보드 GDDR와 가까운 적층 HBM의 설치 위치를 각각 관찰하세요.'});
  }else if(id==='gddr-width-rate'){
    tests.push({label:'128×24÷8 = 384 GB/s',passed:has('rate24'),help:'24 Gb/s/pin 상태의 결과 384 GB/s를 확인하세요.'});
    tests.push({label:'128×32÷8 = 512 GB/s',passed:has('rate32'),help:'32 Gb/s/pin 상태의 결과 512 GB/s를 확인하세요.'});
  }else{
    tests.push({label:'GDDR board와 HBM package 둘 다 관찰',passed:has('gddr')&&has('hbm'),help:'보드 DRAM과 TSV 적층 DRAM을 비교하세요.'});
    tests.push({label:'열·비용·공정 한계 관찰',passed:has('constraints'),help:'실제 제품 우위가 아닌 정성적 열/제조 제약 패널을 열어보세요.'});
  }
  const answers:Record<GpuSceneId,string>={
    'compute-feeding':'supply-limits','memory-family-roles':'all-dram-roles',
    'gddr-width-rate':'theoretical-pam3','hbm-tradeoffs':'relative-tradeoffs'};
  tests.push({label:'병목과 모델 한계의 공학적 설명',passed:answer===answers[id],help:'관찰 후 모델 가정과 왜 그런지 설명하는 정답을 골라야 해요.'});
  return {passed:tests.every(c=>c.passed),conditions:tests};
}
