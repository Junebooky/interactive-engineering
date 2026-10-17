import {useState} from 'react';
import {Dc10SceneVisual} from './Dc10SceneVisual';
import {dc10Order,dc10Probe,dc10RequiredEvidence,freshDc10,gradeDc10} from './dc10Model';
import type {Dc10Event,Dc10Evidence,Dc10Grade,Dc10SceneId,Dc10State} from './dc10Model';
import '../a05Scenes.css';import './dc10.css';
type Option={id:string;text:string;correction?:string};
type Copy={title:string;hook:string;question:string;prediction:string;predictions:[string,string];task:string;
 options:[Option,Option,Option,Option];hints:[string,string,string];why:string;next:string;beforeVoice:string;physics:string};
const COPY:Record<Dc10SceneId,Copy>={
 'ai-roofline-bottleneck':{
 title:'GPU가 계산을 잘해도 데이터 때문에 기다릴까요?',hook:'연산 성능과 메모리 공급 속도는 서로 다른 상한입니다.',
 question:'1바이트당 계산 10회와 80회에서 어떤 자원이 먼저 부족할까요?',
 prediction:'계산 상한과 대역폭을 따로 생각해 보세요. 연산집약도와 대역폭을 바꾸면 병목이 바뀔까요?',
 predictions:['두 상한 중 낮은 쪽이 병목일 수 있습니다.','계산 최고치만 알면 어떤 작업의 속도든 정확히 알 수 있어요.'],
 task:'10/80 FLOP/B × 100/200 GB/s 네 조건을 각각 선택한 뒤 ‘현재 조건 관찰’을 눌러 상한을 확인하세요.',
 options:[
 {id:'min-compute-memory',text:'FLOP/B × B/s는 FLOP/s이고 실제 성능의 상한은 연산 최고치와 메모리 공급 상한 중 작은 값입니다.'},
 {id:'m1',text:'FLOP/B와 TFLOP/s는 같은 단위이므로 그냥 값을 더하면 돼요.',correction:'FLOP/B는 작업의 연산집약도이고 TFLOP/s는 초당 연산량이에요. 대역폭을 곱해야 시간당 상한이 됩니다.'},
 {id:'m2',text:'HBM 용량 두 배면 자동으로 메모리 대역폭도 두 배예요.',correction:'메모리 용량과 대역폭은 서로 다른 속성입니다. 메모리 GB가 늘어도 GB/s가 자동 증가하지 않습니다.'},
 {id:'m3',text:'Roofline은 모든 LLM 요청의 실제 지연시간을 정확히 예측해요.',correction:'Roofline은 컴퓨트/메모리 커널 성능 상한 모델이며 점유율·캐시·통신·실행 오버헤드·요청 지연은 별도입니다.'}],
 hints:['연산량÷바이트 수로 FLOP/B를 계산합니다.','BW의 B/s와 I의 FLOP/B를 곱해 보세요.','두 상한 중 낮은 값이 병목입니다.'],
 why:'가상 peak 4 TFLOP/s, BW 100 GB/s라면 I10의 메모리 상한1 TFLOP/s, I80의 계산 상한4 TFLOP/s. ridge는40 FLOP/B이며 BW200이면20 FLOP/B로 바뀝니다. 모두 실제 측정속도가 아닌 toy 상한입니다.',
 next:'같은 모델이라도 첫 토큰과 그다음 토큰의 데이터 흐름은 왜 다를까요?',
 beforeVoice:'연산 최고 속도와 데이터를 공급하는 속도 중 어느 것이 더 작을지 먼저 예측하세요.',
 physics:'Peak4 TFLOP/s·BW100/200 십진 GB/s·I10/80 toy. 캐시, 점유율, 실행 효율, LLM latency와 측정치는 모델 밖.'
 },
 'llm-prefill-decode-kv':{
 title:'첫 토큰과 다음 토큰은 왜 기다림이 다를까요?',hook:'요청을 처리하는 prefill과 이전 KV를 재사용하는 decode를 구분하세요.',
 question:'문맥 토큰·동시 배치가 늘면 어떤 메모리 데이터가 증가할까요?',
 prediction:'이미 모델이 상주할 때 매 토큰 SSD 재읽기가 꼭 필요한지, K/V head가 query head 수와 같은지 생각하세요.',
 predictions:['모델 가중치와 KV 캐시는 별개이고 문맥·배치에 따라 KV가 커져요.','생성 토큰마다 SSD에서 모델 전체를 다시 읽어야 해요.'],
 task:'4토큰·batch1에서 관찰 후 16토큰·batch1, 16토큰·batch4, 연결 경로 ON인 LPDDR offload를 각각 실제 관찰하세요.',
 options:[
 {id:'kv-by-kv-heads',text:'KV toy bytes=배치×레이어×KV heads×head dim×retained tokens×원소 byte×2(K,V). Query heads와 KV heads는 다를 수 있어요.'},
 {id:'m1',text:'모델이 HBM에 있어도 매 토큰마다 SSD에서 전체 가중치를 재로딩해요.',correction:'가중치가 가속기 메모리에 이미 상주할 수 있으므로 매 토큰 SSD 전체 재읽기는 필수가 아닙니다.'},
 {id:'m2',text:'Prefill과 decode의 연산 강도·시간은 언제나 동일해요.',correction:'Prefill은 입력 문맥을 처리하고 decode는 순차 토큰을 생성하며 과거 KV를 참조합니다. 병목과 시간 특성은 다를 수 있어요.'},
 {id:'m3',text:'KV를 LPDDR로 옮기면 전송비용이나 지원 경로 확인 없이 무조건 빨라져요.',correction:'오프로딩은 용량과 전송비용의 절충이며 지원된 연결과 구성 확인이 필요합니다. 데이터 이동 지연을 0으로 놓을 수 없어요.'}],
 hints:['먼저 모델의 상주 여부와 KV 캐시를 분리합니다.','GQA/MQA에서는 query head 수와 KV head 수가 다를 수 있어요.','메모리 계층을 옮기는 링크에 시간과 용량 비용이 있어요.'],
 why:'toy는 layers2, KV heads2, query heads8, dim16, bytes/element2, K와 V 두 텐서. 문맥4·batch1은512 B, 문맥16·batch1은2048 B, 문맥16·batch4는8192 B. GQA에서 query heads8을 곱하면 잘못 과장됩니다. LPDDR offload는 경로가 지원될 때만 수행되고 실제 지연/TTFT 수치는 계산하지 않습니다.',
 next:'이 계산을 수많은 요청에 적용할 때 시설의 냉각 전력은 어디에 들어갈까요?',
 beforeVoice:'문맥과 동시 요청을 키우면 모델 크기 자체가 커지는지, 별도 KV 캐시가 늘어나는지 예상하세요.',
 physics:'2layers×2 KV heads×dim16×2B×K/V2 토이. 양자화·패딩·sliding-window·실측 TTFT/토큰속도·제품별 offload 없음.'
 },
 'rack-power-pue-thermal':{
 title:'PUE가 좋아지면 AI 응답도 반드시 빨라질까요?',hook:'시설 전체 전력과 IT 부하, 애플리케이션 작업량은 다른 측정입니다.',
 question:'IT 전력 1 MW로 고정하고 PUE 1.4/1.2를 바꾸면 시설 전력은 얼마나 바뀔까요?',
 prediction:'설비 냉각/전원 손실과 GPU 작업 처리량을 별도 축으로 생각해 보세요.',
 predictions:['PUE는 시설/IT 에너지 비율이고 작업속도는 별도 측정이에요.','PUE 1.2이면 GPU가 1.2배 빨라집니다.'],
 task:'PUE 1.4 + 작업량1000, PUE1.2 + 작업량1000, PUE1.2 + 작업량1500 세 조합을 각각 직접 관찰하세요.',
 options:[
 {id:'pue-is-energy-not-speed',text:'PUE는 같은 경계/기간의 전체 시설 에너지÷IT 에너지. 처리량·작업당 kWh·GPU 이용률은 별도로 측정해야 합니다.'},
 {id:'m1',text:'PUE 1.2라는 수는 곧 응답 속도가 1.2배라는 뜻이에요.',correction:'PUE는 전기 에너지 비율이지 태스크/초나 응답 지연 측정이 아닙니다.'},
 {id:'m2',text:'PUE를 낮추면 GPU 활용률과 AI 작업당 효율이 무조건 높아져요.',correction:'GPU 점유율, 모델 workload 및 총 처리량은 별도 축이라 PUE 하나로 서비스 효율은 확정되지 않아요.'},
 {id:'m3',text:'냉각 펌프·팬·UPS 전력은 0이라 시설 계측에서 무시해요.',correction:'냉각·전력 전달 손실·UPS는 시설 에너지의 일부입니다. 단, 계측 경계와 기간을 먼저 정의해야 합니다.'}],
 hints:['IT 분모와 시설 전체 분자를 구분하세요.','같은 IT 부하를 가정하고 시설 계수를 곱합니다.','처리량 1000↔1500 tasks/s 토글은 PUE와 독립입니다.'],
 why:'동일 기간 toy에서 IT=1MW, PUE1.4→시설1.4MW(추가.4), PUE1.2→시설1.2MW(추가.2). 앱 작업량은 독립적으로 1000/1500 tasks/s. 정식 PUE는 에너지 비율이며 이 전력비 계산은 시간평균 동등성 toy입니다. 낮은 PUE만으로 GPU 속도 향상·작업당 에너지 개선을 보장하지 않습니다.',
 next:'서버를 늘렸는데 단일 스위치가 죽으면 서비스를 계속할 수 있을까요?',
 beforeVoice:'IT 전력이 같아도 전원·냉각 설비가 추가 에너지를 쓸까요? 서비스 처리량은 별도일까요?',
 physics:'동일 기간 IT1MW·PUE1.4/1.2·tasks/s1000/1500 가상 고정점. 시설 실제 연간 PUE, 지연, kWh/task, 냉각 설비 인증 아님.'
 },
 'ai-dc-end-to-end-resilience':{
 title:'서버 두 대면 스위치가 꺼져도 자동 복구할까요?',hook:'백업 하드웨어 수보다 살아 있는 물리 경로, 설정, 복구 가능한 상태가 중요합니다.',
 question:'공유 스위치 A가 멈춘 뒤에도 백업 스위치 B·케이블·세션·재시도 없이 응답이 이어질까요?',
 prediction:'서버가 둘일 때도 공유 스위치 하나가 단일 장애점일지 먼저 예상해 보세요.',
 predictions:['백업 회선과 경로 설정, 세션 복제·재시도 등 별도 조건이 필요해요.','서버 2대만 있으면 네트워크 연결과 세션은 모두 자동 복구돼요.'],
 task:'A 정지·B 미설치→B 설치하지만 회선 미연결→B 물리연결/구성/자동 정책이나 local session→replicated session 복구를 차례로 ‘현재 조건 관찰’하세요.',
 options:[
 {id:'route-state-policy-needed',text:'서버 수와 무관하게 독립된 건강한 링크·구성·전환 정책·세션 복구가 있어야 조건부 복구할 수 있어요. 실제 RTO·무손실은 별도입니다.'},
 {id:'m1',text:'GPU/서버가 두 대면 공통 스위치 장애도 통신이 자동 이어져요.',correction:'공유 스위치 하나만 쓰면 두 서버가 모두 통신 불능일 수 있어요. 독립된 실제 경로가 필요합니다.'},
 {id:'m2',text:'모든 추론 토큰은 반드시 NAND→GPU를 계속 이동해야 해요.',correction:'모델이 HBM 등에 상주할 수 있으며 SSD 초기 적재 경로와 반복 추론 경로는 다릅니다.'},
 {id:'m3',text:'백업 전원만 있으면 데이터/세션/네트워크 장애는 전부 무손실 복구돼요.',correction:'전원·네트워크 경로·세션/저장 일관성은 별도입니다. 복구시간·유실 보증이 자동으로 생기지 않아요.'}],
 hints:['서버 둘이 하나의 스위치에만 매달린 경우를 재현하세요.','백업 스위치를 ‘설치’만 한 것과 실제 배선/설정은 다릅니다.','경로가 살아도 local-only 세션과 자동 복구 정책이 필요해요.'],
 why:'공유 스위치만 정지하면 서버가 2대여도 NO_ROUTE. 스위치B 설치만 하고 선을 연결하지 않아도 NO_ROUTE. 물리 회선+config+auto failover가 생겨도 localOnly 상태는 STATE_NOT_RECOVERABLE. replicated/stateless+재시도 가능한 상태에서 조건부 RECOVERY_POSSIBLE이며 cold model과 지연·복제 일관성은 보장되지 않습니다. 학습 잡은 체크포인트가 추가로 필요합니다.',
 next:'이제 TTFT·tokens/s·에너지·복구 품질을 함께 실측한다면 무엇부터 개선할까요?',
 beforeVoice:'서버 두 대가 같은 한 스위치를 거치면 스위치 고장 후에도 길이 있을까요?',
 physics:'두 서버·두 스위치 추상 모델. 실제 복구 확률, RTO/RPO/SLA, 복제 일관성, PSU 공통원인, 장비 플랫폼별 데이터 경로 보증 없음.'
 }};
export interface Dc10LabProps{onEvent?:(e:Dc10Event)=>void;onSpeech?:(id:Dc10SceneId,text:string)=>void}
export function Dc10SceneLab({onEvent,onSpeech}:Dc10LabProps){
 const [index,setIndex]=useState(0),sceneId=dc10Order[index],story=COPY[sceneId];
 const [state,setState]=useState<Dc10State>(freshDc10),[prediction,setPrediction]=useState<string|null>(null);
 const [evidence,setEvidence]=useState<Dc10Evidence[]>([]),[hasProbe,setHasProbe]=useState(false),[status,setStatus]=useState('');
 const [answer,setAnswer]=useState<string|null>(null),[feedback,setFeedback]=useState<Dc10Grade|null>(null),[why,setWhy]=useState(false),[hint,setHint]=useState(0);
 const emit=(type:Dc10Event['type'],payload?:Record<string,unknown>)=>onEvent?.({sceneId,type,payload});
 const speak=(text:string)=>{emit('voice.requested',{text});onSpeech?.(sceneId,text);};
 const ctl=(label:string,fn:()=>void,selected=false)=><button type="button" aria-pressed={selected} className={selected?'selected':''} onClick={fn}>{label}</button>;
 function change(patch:Partial<Dc10State>,key:string){
  const next={...state,...patch};setState(next);setHasProbe(false);setStatus('조건을 바꾸었습니다. 현재 조건 관찰 버튼으로 새 상태를 측정하세요.');
  setAnswer(null);setFeedback(null);setWhy(false);emit('parameter.changed',{key,physical:next});
 }
 function probe(){
  const x=dc10Probe(sceneId,state);setHasProbe(true);setStatus(x.display);
  if(x.evidence)setEvidence(prev=>prev.includes(x.evidence!)?prev:[...prev,x.evidence!]);
  emit('observation.recorded',{accepted:x.evidence!==null,evidence:x.evidence,display:x.display,physical:state,result:x.result});
 }
 function enter(i:number){
  if(i<0||i>=dc10Order.length)return;
  setIndex(i);setState(freshDc10());setPrediction(null);setEvidence([]);setHasProbe(false);setStatus('');
  setAnswer(null);setFeedback(null);setWhy(false);setHint(0);
  onEvent?.({sceneId:dc10Order[i],type:'scene.enter'});
 }
 const selectedWrong=story.options.find(x=>x.id===feedback?.misconception)?.correction;
 return <div className="a05-lab a05-dc10-lab" lang="ko">
  <header className="a05-head"><p className="a05-eyebrow">A05 · AI DATACENTER · LESSON 10</p><h1>한 요청이 GPU에서 데이터센터까지</h1>
   <p>Roofline · Prefill/Decode · PUE · 독립된 장애 복구 경로</p>
   <nav className="a05-stepnav" aria-label="데이터센터 네 단계">{dc10Order.map((id,i)=><button type="button" key={id} disabled={i>index} aria-current={i===index?'step':undefined} className={i===index?'active':''} onClick={()=>enter(i)}>{i+1}</button>)}</nav>
  </header>
  <main className="a05-stage"><section className="a05-copy" aria-label="학생 예측과 실험">
   <span className="a05-eyebrow">{sceneId} · {index+1}/4</span><h2>{story.title}</h2><p className="a05-hook">{story.hook}</p>
   <p className="a05-question">{story.question}</p>
   <div className="a05-box"><h3>먼저 예측하세요</h3><p>{story.prediction}</p><div className="a05-choice-set">
    {story.predictions.map((p,i)=><button key={i} type="button" disabled={prediction!==null} aria-pressed={prediction===String(i)} className={prediction===String(i)?'selected':''} onClick={()=>{setPrediction(String(i));emit('prediction.recorded',{answer:i});}}>{p}</button>)}
   </div></div>
   {prediction!==null&&<div className="a05-box"><h3>독립 변수 조작</h3><p>{story.task}</p>
    <div className="a05-dc10-controls">
     {sceneId==='ai-roofline-bottleneck'&&<>
      <strong>연산집약도 FLOP/B</strong><div className="a05-control-buttons">
       {ctl('I = 10 FLOP/B',()=>change({intensity:10},'intensity10'),state.intensity===10)}
       {ctl('I = 80 FLOP/B',()=>change({intensity:80},'intensity80'),state.intensity===80)}</div>
      <strong>메모리 공급 대역폭</strong><div className="a05-control-buttons">
       {ctl('BW = 100 GB/s',()=>change({bandwidthGb:100},'bw100'),state.bandwidthGb===100)}
       {ctl('BW = 200 GB/s',()=>change({bandwidthGb:200},'bw200'),state.bandwidthGb===200)}</div>
     </>}
     {sceneId==='llm-prefill-decode-kv'&&<>
      <strong>문맥 길이와 동시 배치</strong><div className="a05-control-buttons">
       {ctl('Context 4',()=>change({contextTokens:4},'context4'),state.contextTokens===4)}
       {ctl('Context 16',()=>change({contextTokens:16},'context16'),state.contextTokens===16)}
       {ctl('Batch 1',()=>change({batch:1},'batch1'),state.batch===1)}
       {ctl('Batch 4',()=>change({batch:4},'batch4'),state.batch===4)}</div>
      <strong>모델 상주 및 KV 오프로딩 설정 (지원 경로 확인 필수)</strong><div className="a05-control-buttons">
       {ctl('Model HBM 상주',()=>change({modelResident:true},'modelResident'),state.modelResident)}
       {ctl('Model 비상주',()=>change({modelResident:false},'modelNotResident'),!state.modelResident)}
       {ctl('LPDDR 경로 ON',()=>change({offloadPathSupported:true},'lpddrPathOn'),state.offloadPathSupported)}
       {ctl('LPDDR 경로 OFF',()=>change({offloadPathSupported:false},'lpddrPathOff'),!state.offloadPathSupported)}
       {ctl('KV in HBM',()=>change({offload:'none'},'offloadNone'),state.offload==='none')}
       {ctl('KV LPDDR offload',()=>change({offload:'LPDDR'},'offloadLpddr'),state.offload==='LPDDR')}</div>
     </>}
     {sceneId==='rack-power-pue-thermal'&&<>
      <strong>시설 에너지 비율 (시간평균 toy)</strong><div className="a05-control-buttons">
       {ctl('PUE 1.4',()=>change({pue:1.4},'pue14'),state.pue===1.4)}
       {ctl('PUE 1.2',()=>change({pue:1.2},'pue12'),state.pue===1.2)}</div>
      <strong>애플리케이션 처리량은 별도 변수</strong><div className="a05-control-buttons">
       {ctl('1000 tasks/s',()=>change({throughput:1000},'task1000'),state.throughput===1000)}
       {ctl('1500 tasks/s',()=>change({throughput:1500},'task1500'),state.throughput===1500)}</div>
     </>}
     {sceneId==='ai-dc-end-to-end-resilience'&&<>
      <strong>공유 주 회선과 서버 수</strong><div className="a05-control-buttons">
       {ctl('Switch A 정상',()=>change({switch1Healthy:true},'switchAHealthy'),state.switch1Healthy)}
       {ctl('Switch A 장애',()=>change({switch1Healthy:false},'switchAFailed'),!state.switch1Healthy)}
       {ctl('서버 1대',()=>change({servers:1},'servers1'),state.servers===1)}
       {ctl('서버 2대',()=>change({servers:2},'servers2'),state.servers===2)}</div>
      <strong>백업 스위치와 진짜 회선/설정 (서로 독립)</strong><div className="a05-control-buttons">
       {ctl('Switch B 미설치',()=>change({switch2Installed:false},'switchBAbsent'),!state.switch2Installed)}
       {ctl('Switch B 설치',()=>change({switch2Installed:true},'switchBInstalled'),state.switch2Installed)}
       {ctl('B 회선 연결',()=>change({routeBConnected:true},'routeBConnected'),state.routeBConnected)}
       {ctl('B 회선 분리',()=>change({routeBConnected:false},'routeBDisconnected'),!state.routeBConnected)}
       {ctl('B 경로 구성 ON',()=>change({routeBConfigured:true},'routeBConfigOn'),state.routeBConfigured)}
       {ctl('B 경로 구성 OFF',()=>change({routeBConfigured:false},'routeBConfigOff'),!state.routeBConfigured)}</div>
      <strong>장애 후 복구 정책·세션 (하드웨어 수와 별개)</strong><div className="a05-control-buttons">
       {ctl('Failover 없음',()=>change({failoverPolicy:'none'},'policyNone'),state.failoverPolicy==='none')}
       {ctl('Failover 자동',()=>change({failoverPolicy:'automatic'},'policyAuto'),state.failoverPolicy==='automatic')}
       {ctl('Local-only state',()=>change({sessionState:'localOnly'},'stateLocal'),state.sessionState==='localOnly')}
       {ctl('Replicated state',()=>change({sessionState:'replicated'},'stateReplica'),state.sessionState==='replicated')}
       {ctl('Stateless',()=>change({sessionState:'stateless'},'stateless'),state.sessionState==='stateless')}
       {ctl('Backup cold',()=>change({backupWarm:false},'backupCold'),!state.backupWarm)}
       {ctl('Backup warm',()=>change({backupWarm:true},'backupWarm'),state.backupWarm)}</div>
      <strong>추가 반례: 학습 체크포인트·공통 전원·복제 저장</strong><div className="a05-control-buttons">
       {ctl('추론 (infer)',()=>change({jobType:'infer'},'jobInfer'),state.jobType==='infer')}
       {ctl('학습 (train)',()=>change({jobType:'train'},'jobTrain'),state.jobType==='train')}
       {ctl('Checkpoint 없음',()=>change({checkpointAvailable:false},'checkpointNo'),!state.checkpointAvailable)}
       {ctl('Checkpoint 확보',()=>change({checkpointAvailable:true},'checkpointYes'),state.checkpointAvailable)}
       {ctl('복제 저장 정상',()=>change({storageReplicaHealthy:true},'replicaHealthy'),state.storageReplicaHealthy)}
       {ctl('복제 저장 장애',()=>change({storageReplicaHealthy:false},'replicaFailed'),!state.storageReplicaHealthy)}
       {ctl('공통 전원 정상',()=>change({sharedPowerHealthy:true},'powerHealthy'),state.sharedPowerHealthy)}
       {ctl('공통 전원 장애',()=>change({sharedPowerHealthy:false},'powerFailed'),!state.sharedPowerHealthy)}</div>
     </>}
     <button type="button" className="a05-primary" onClick={probe}>현재 조건 관찰</button>
     {status&&<p role="status" aria-live="polite" data-testid="dc10-stage-status" className="a05-note">{status}</p>}
     {status&&<button type="button" onClick={()=>speak(status)}>현재 관찰 한국어 듣기</button>}
    </div></div>}
   {hasProbe&&evidence.length>0&&<div className="a05-box"><h3>내가 확인한 조건과 물리적 이유</h3>
    <p data-testid="dc10-evidence">학생 실험: {evidence.join(' / ')}</p>
    <div className="a05-choice-set">{story.options.map(o=><button type="button" key={o.id} aria-pressed={answer===o.id} className={answer===o.id?'selected':''} onClick={()=>{setAnswer(o.id);setFeedback(null);setWhy(false);}}>{o.text}</button>)}</div>
    <button type="button" className="a05-primary" onClick={()=>{const g=gradeDc10(sceneId,evidence,answer);setFeedback(g);emit('answer.checked',{passed:g.passed,misconception:g.misconception,evidence});}}>관찰·물리 WHY 평가</button>
   </div>}
   <div className="a05-tools"><button type="button" onClick={()=>speak(story.beforeVoice)}>한국어 질문 듣기</button>
    {prediction!==null&&<button type="button" disabled={hint===3} onClick={()=>{setHint(Math.min(3,hint+1));emit('hint.opened',{level:Math.min(3,hint+1)});}}>힌트 {hint}/3</button>}</div>
   {hint>0&&<div className="a05-hint">{story.hints.slice(0,hint).map((p,i)=><p key={i}>{i+1}. {p}</p>)}</div>}
   {feedback&&<section role="status" aria-live="polite" className="a05-result"><h3>{feedback.passed?'네 가지 관찰을 연결해 이해했어요!':'빠진 실험 조건이나 이유를 확인하세요'}</h3>
    {feedback.conditions.map(c=><p key={c.key}><strong>{c.passed?'✓':'△'} {c.key}</strong> — {c.passed?'확인':'미확인'}</p>)}
    {!feedback.passed&&selectedWrong&&<p data-testid="dc10-keyed-feedback">{selectedWrong}</p>}
    {!feedback.passed&&<p>미완료 실험 {dc10RequiredEvidence(sceneId).filter(k=>!evidence.includes(k)).length}개를 실제로 진행해야 해요.</p>}
    <button type="button" onClick={()=>speak(feedback.passed?story.next:selectedWrong||'방문하지 않은 조건을 직접 실험하고 선택 이유를 검증해 보세요.')}>피드백 듣기</button>
    <button type="button" onClick={()=>setWhy(!why)}>{why?'해설 접기':'왜? 자세한 원리 보기'}</button>
   </section>}
   {feedback&&why&&<div className="a05-why"><h3>왜?</h3><p>{feedback.passed?story.why:'다른 조건의 정답은 아직 숨겨져 있어요. 직접 실험하고 다시 검증해 주세요.'}</p>
    {feedback.passed&&<p>{story.next}</p>}</div>}
   {feedback?.passed&&index<3&&<button type="button" className="a05-primary" onClick={()=>enter(index+1)}>다음 장면으로 →</button>}
   {feedback?.passed&&index===3&&<p className="a05-why">Lesson10 A05 독립 학습 장면 완료. A02 공식 학습 엔진/진도·이력/Voice 통합은 별도 검증 필요.</p>}
  </section>
  <section className="a05-canvas-col" aria-label="AI 데이터센터 2.5D 물리 개념 원본 도식">
   <div className="a05-canvas-header"><span>A05 AI DC10 · ORIGINAL SVG</span><span>{hasProbe?'관찰된 현재 조건':'수치·정답 예측/조작 전 가림'}</span></div>
   <Dc10SceneVisual sceneId={sceneId} state={state} revealed={prediction!==null} hasProbe={hasProbe}/>
   <div className="a05-model-limit"><strong>물리 모형 한계</strong> {hasProbe?story.physics:'학생이 직접 예측하고 현재 조건을 관찰하기 전까지 미방문 조건의 계산값을 보여주지 않습니다.'}</div>
   <div className="a05-source">A06 Lesson10 source cc579ef1 · A07 EDU_QA_PASS_SOURCE (원고만) · A05 Preview는 정식 A02 앱과 별개</div>
  </section></main></div>;
}
