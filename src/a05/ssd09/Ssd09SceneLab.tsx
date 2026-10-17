import {useState} from 'react';
import {Ssd09SceneVisual} from './Ssd09SceneVisual';
import {fresh09,gradeSsd09,latencyModel,latencyPick,plpAdvance,plpConfigure,plpEnergy,ssd09Order,ssdEndurance} from './ssd09Model';
import type {BitsPerCell,LatencySet,OpPercent,PlpAction,PlpAckMode,PlpTrial,Relocated,Ssd09Event,Ssd09Grade,Ssd09Id,Ssd09State} from './ssd09Model';
import '../a05Scenes.css';
import './ssd09.css';
type Choice={id:string;text:string;feedback?:string};
type Story={title:string;hook:string;question:string;prediction:string;predictions:[string,string];action:string;answers:[Choice,Choice,Choice,Choice];hints:readonly [string,string,string];why:string;next:string;beforeVoice:string;limits:string};
const story:Record<Ssd09Id,Story>={
 'nand-cell-voltage-windows':{
  title:'셀에 네 비트를 넣으면 상태는 몇 개가 될까요?',hook:'같은 전압 창에 더 많은 상태를 배치해 보세요.',
  question:'SLC와 TLC, QLC의 상태 중심 개수와 간격은 같은가요?',
  prediction:'1/3/4비트에서 필요한 구별 상태 수와 1V 가상 창의 중심 간격을 먼저 예상하세요.',
  predictions:['상태가 많아지면 같은 1V 창의 상태 중심 간격은 좁아질 거예요.','4비트면 전압 중심은 딱 4개일 거예요.'],
  action:'SLC/TLC/QLC 2/8/16개 중심과 0 또는 ±0.08V 가상 교란을 각각 실험하세요.',
  answers:[
   {id:'centers-gap-15',text:'SLC 2상태/1간격, TLC 8상태/7간격, QLC 16상태/15간격. 실제 NAND 분포·성능을 그대로 뜻하지 않아요.'},
   {id:'m1',text:'QLC 4비트면 저장 전압 상태는 정확히 4개예요.',feedback:'4비트 조합은 2의4제곱, 16개입니다. 중심 16개 사이에는 간격 15개가 있어요.'},
   {id:'m2',text:'저장 비트가 증가해도 상태를 구별하는 전압 여유는 언제나 같아요.',feedback:'같은 가상 1V 창에서 중심 수가 늘면 간격은 줄고 분포 교란의 상대 영향이 커집니다.'},
   {id:'m3',text:'QLC가 더 조밀하면 어떤 NAND도 반드시 수명과 속도가 좋아져요.',feedback:'저장 밀도와 지연·내구성은 다른 목표이며 제품 공정·ECC·controller·사용 조건별로 달라집니다.'}
  ],
  hints:['4비트 조합은 2×2×2×2로 세어 보세요.','16개 중심을 양끝까지 놓을 때 두 점 사이 구간은 몇 개일까요?','실제 센싱 분포는 교란·온도·보존·ECC 영향을 받습니다.'],
  why:'균등한 1V 전압 중심 모형에서 상태중심 개수 N=2^bits, 인접 중심 간격=1/(N−1)V입니다. SLC 2개/1간격=1V, TLC 8개/7간격≈0.142857V, QLC 16개/15간격≈0.066667V. 노이즈 ±0.08V은 toy 분포 반폭일 뿐 실제 NAND BER을 예측하지 않습니다.',
  next:'파일을 한 번 수정하면 NAND는 몇 번 기록할까요?',
  beforeVoice:'한 개 셀의 비트 수를 늘리면 몇 가지 상태를 구별해야 할지 먼저 선택해 주세요.',
  limits:'균등 배치된 1V 가상 센터 모델, 실제 Vth/프로그램/검증/retention 특성과 무관'
 },
 'ssd-write-amplification':{
  title:'호스트가 1GiB를 쓰면 NAND도 1GiB만 쓸까요?',hook:'낡은 블록을 지울 때 살아 있는 페이지를 다른 곳으로 옮기기도 해요.',
  question:'NAND 내부 유효 페이지 이동이 0.6GiB라면 WAF는 얼마인가요?',
  prediction:'호스트 1GiB와 물리 NAND 내부 이사 0/0.6GiB를 먼저 따로 예상하세요.',
  predictions:['GC에서 유효 페이지를 옮기면 NAND 실제 기록량은 증가할 것 같아요.','호스트 기록이 같으면 NAND 내부 기록도 어떤 조건에서나 동일해요.'],
  action:'GC OFF 기준, GC ON+유효 페이지 이동 0.6GiB, OP 10/20%를 각기 비교하세요. OP 두 배가 WAF 반감을 보장한다고 가정하지 마세요.',
  answers:[
   {id:'host-vs-nand-waf',text:'WAF=물리 NAND 총 기록/host 기록. 이사 0이면 1.0, 이사 0.6GiB면 1.6이에요. OP 효과는 장치와 쓰기 패턴에 달려요.'},
   {id:'m1',text:'GC는 사용자 파일을 무작위로 삭제하는 작업이에요.',feedback:'GC는 무효 공간을 회수하되 여전히 유효한 데이터는 안전하게 보존·이동해야 해요.'},
   {id:'m2',text:'호스트 1GiB 기록이면 NAND 물리 기록도 항상 1GiB이에요.',feedback:'블록 GC 과정의 유효 페이지 이사 등 추가 NAND 기록이 생기면 실제 기록은 더 커집니다.'},
   {id:'m3',text:'OP를 10%→20%로 늘리면 WAF는 예외 없이 반으로 줄어요.',feedback:'OP 용량은 GC 여유의 한 요소일 뿐이고 장치·쓰기 패턴·GC 정책별로 결과가 다릅니다.'}
  ],
  hints:['사용자 파일은 이사할 수 있지만 임의 삭제되진 않아요.','WAF 분모에는 호스트 쓰기, 분자에는 물리 쓰기를 사용해요.','OP 증가는 모든 조건에서 WAF 절반을 의미하지 않아요.'],
  why:'호스트가 1GiB를 기록하고 내부 이동이 0이면 물리 NAND 1GiB/WAF1.0. GC로 유효 페이지 0.6GiB를 추가 기록하면 총1.6GiB/WAF1.6입니다. 여분 용량 OP10/20%의 변화만으로 WAF 변화를 단정할 수 없습니다. 실제 펌웨어/부하와 시간에 따라 달라요.',
  next:'컨트롤러가 쓰기를 마쳤다고 알린 직후 정전이 생긴다면?',
  beforeVoice:'파일 기록과 NAND 내부 유효 데이터 이사를 각각 얼마나 해야 하는지 먼저 예상해 보세요.',
  limits:'호스트 1GiB, 이동 0/0.6GiB, OP10/20% fictional toy; 실제 SSD 실측 WAF나 DWPD 아님'
 },
 'ssd-plp-power-loss':{
  title:'SSD WRITE ACK 직후 정전이면 파일은 안전할까요?',hook:'완료 응답, 플러시 요청과 실제 저장이 언제 일어나는지 이어 보세요.',
  question:'컨트롤러 ACK와 NAND 비휘발 media commit 사이에 정전이 생길 수 있나요?',
  prediction:'캐시 ACK, flush 발행/완료, PLP 사용, 정전/미디어 저장의 인과 순서를 먼저 예상하세요.',
  predictions:['ACK와 비휘발 media commit은 서로 다른 사건일 수 있어요.','ACK는 모든 eSSD에서 실제 NAND 기록 완료를 보증해요.'],
  action:'직접 WRITE→ACK→정전의 위험 사례와 WRITE→ACK→media commit→정전의 보존 사례를 완성하세요. Flush ISSUED/COMPLETED 사건도 구별하고, PLP 유효에너지0.6J 대비 남은 일0.4/1.2J를 각각 비교하세요.',
  answers:[
   {id:'ack-is-not-media-commit',text:'휘발 캐시 ACK만으로 영속 저장은 확정 안 돼요. flush/FUA 완료·NAND commit·PLP 보호 범위와 가용 에너지는 기기 계약 및 사건 순서별로 확인해야 해요.'},
   {id:'m1',text:'어떤 WRITE ACK라도 NAND commit이 완전히 끝났다는 뜻이에요.',feedback:'ACK가 휘발 캐시에 대한 응답일 수 있습니다. 비휘발 기록 또는 계약된 flush/FUA 완료와 구별해야 해요.'},
   {id:'m2',text:'모든 eSSD에는 어떤 쓰기도 무조건 보호하는 같은 PLP가 있어요.',feedback:'PLP 존재·보호 범위·추가 메타데이터 에너지·장치 정책은 SKU별로 확인해야 합니다.'},
   {id:'m3',text:'커패시터 nominal0.8J면 작업량과 관계없이 모든 기록이 반드시 영구 보존돼요.',feedback:'toy 유효에너지는 0.6J입니다. 1.2J 잔여 작업엔 부족하며 0.4J도 기기 정책·FTL metadata 완전성을 보증하지 않아요.'}
  ],
  hints:['ACK 시점과 media commit 시점을 구분해 보세요.','Flush를 발행했다고 바로 COMPLETED가 되나요?','0.8J 중 유효75%와 남은 작업0.4/1.2J를 각각 비교하세요.'],
  why:'커패시터 E=0.5×0.1F×(5²−3²)=0.8J, 8W에서 이상 hold-up0.1초입니다. toy 손실 고려 사용가능0.6J이므로 0.4J는 에너지 관점 가능, 1.2J는 부족. 그 자체로 호스트 캐시·FTL mapping metadata와 NAND commit 성공을 보증하지 않습니다. 휘발 ACK→media 이전 정전은 PLP 범위 확인이 필요하며 flush ISSUED는 COMPLETED가 아닙니다. 장치 계약이 명시된 완료 후에만 더 강한 영속성 근거가 됩니다.',
  next:'데이터는 보존되더라도 요청 응답이 꼬리에서 느릴 수 있겠죠?',
  beforeVoice:'쓰기가 완료되었다는 ACK를 받은 순간에 데이터가 어디 있는지 먼저 예상해 보세요.',
  limits:'가상 C0.1F, 5→3V, 8W, nominal0.8J/usable0.6J, 남은 일0.4/1.2J. 장치별 ACK/Flush/FUA/PLP 보증 다름'
 },
 'essd-dwpd-tail-latency':{
  title:'평균과 p99, DWPD는 서로 무엇을 재나요?',hook:'100개 기록에서 정말 99번째 느린 값이 최대일까요?',
  question:'측정 순서가 섞인 카드의 99번째와 정렬한 99번째는 같을까요?',
  prediction:'100개 응답을 정렬한 뒤 nearest-rank 99번째 위치를 직접 고르세요. 평균·p99·5년 쓰기량을 나눠 예측해요.',
  predictions:['샘플을 작은 값부터 정렬한 후 99번째를 선택해야 할 것 같아요.','기록 순서가 뒤섞여도 원래 순서의 99번째가 정확한 p99예요.'],
  action:'A/B 각각 100개 latency 카드를 정렬하고 99번째를 선택한 뒤 평균을 계산하세요. B에서 최댓값20ms를 p99이라고 선택하면 거부됩니다. DWPD 2TB×1×365×5를 구분하세요.',
  answers:[
   {id:'nearest-rank-and-dwpd',text:'p99 nearest-rank는 정렬한 100개 중 #99, A=20ms B=1ms(최대20ms). DWPD는 쓰기 내구성, toy2TB×1×365×5=3650TB/3.65PB예요.'},
   {id:'m1',text:'DWPD는 하루 동안 디스크의 읽기 횟수를 뜻해요.',feedback:'DWPD는 하루에 해당 드라이브 용량만큼 쓸 수 있는 횟수라는 쓰기 내구성 지표예요.'},
   {id:'m2',text:'평균 latency가2ms 미만이면 p99도 언제나2ms 미만이에요.',feedback:'느린 꼬리5%가 있으면 평균은1.95ms여도 sorted rank99 p99은20ms일 수 있어요.'},
   {id:'m3',text:'QD와 쓰기 패턴이 바뀌어도 p99 수치는 어떤 SSD에서나 동일해요.',feedback:'p99은 워크로드·큐 깊이·GC·시간·측정 방식별로 달라집니다. toy 100개로 실물성능 보증 불가예요.'}
  ],
  hints:['DWPD의 W는 Write예요.','nearest-rank는 값의 순위를 먼저 정렬해요.','100개면 ceil(0.99×100)=99번째이고 최댓값은100번째입니다.'],
  why:'A=95개1ms+5개20ms→평균1.95ms, 정렬 #99=20ms. B=99개1ms+1개20ms→평균1.19ms, 정렬 #99=1ms이지만 최대는20ms. decimal2TB×1DWPD×365×5=3650TB(3.65PB) 장난감 호스트 쓰기 내구성 예시. 실제 제품 성능, GiB/TB, 보증 조건은 별도입니다.',
  next:'AI 서비스의 전체 성능 병목과 복구 전략을 연결해 볼까요?',
  beforeVoice:'백 개의 요청 지연을 작은 값부터 정렬한 뒤 아흔아홉 번째 카드를 직접 찾으세요.',
  limits:'섞인 순서/nearest-rank 100개와 decimal TB·PB toy; 어떤 실제 eSSD p99/DWPD 보증도 아님'
 }
};
export interface Ssd09LabProps{onEvent?:(event:Ssd09Event)=>void;onSpeech?:(sceneId:Ssd09Id,text:string)=>void}
export function Ssd09SceneLab({onEvent,onSpeech}:Ssd09LabProps){
 const [index,setIndex]=useState(0),sceneId=ssd09Order[index],meta=story[sceneId];
 const [state,setState]=useState<Ssd09State>(fresh09),[prediction,setPrediction]=useState<string|null>(null);
 const [seen,setSeen]=useState<string[]>([]),[answer,setAnswer]=useState<string|null>(null);
 const [feedback,setFeedback]=useState<Ssd09Grade|null>(null),[hint,setHint]=useState(0),[why,setWhy]=useState(false);
 const [transaction,setTransaction]=useState(''),[rankMessage,setRankMessage]=useState('');
 const revealed=prediction!==null,observed=seen.length>0;
 const emit=(type:Ssd09Event['type'],payload?:Record<string,unknown>)=>onEvent?.({sceneId,type,payload});
 const speak=(txt:string)=>{emit('voice.requested',{text:txt});onSpeech?.(sceneId,txt);};
 const observe=(key:string)=>setSeen(old=>old.includes(key)?old:[...old,key]);
 function change(next:Ssd09State,key:string){setState(next);observe(key);setFeedback(null);setAnswer(null);setWhy(false);
  emit('parameter.changed',{key,sceneId,physicalState:next});}
 function enter(i:number){if(i<0||i>=ssd09Order.length)return;setIndex(i);setState(fresh09());setPrediction(null);setSeen([]);setAnswer(null);
  setFeedback(null);setWhy(false);setHint(0);setTransaction('');setRankMessage('');onEvent?.({sceneId:ssd09Order[i],type:'scene.enter'});}
 const ctl=(text:string,fn:()=>void,active=false)=><button type="button" className={active?'selected':''} aria-pressed={active} onClick={fn}>{text}</button>;
 function alterCell(bits:BitsPerCell){const name=bits===1?'SLC':bits===3?'TLC':'QLC';change({...state,bits},name);}
 function alterNoise(noise:0|0.08){change({...state,noise},noise===0?'noise0':'noise08');}
 function alterOp(op:OpPercent){change({...state,op},'op'+op);}
 function alterGc(gc:boolean,relocated:Relocated){const key=gc&&relocated===.6?'move':'base';
  change({...state,gc,relocated},key);}
 function configureTrial(change:Partial<Pick<PlpTrial,'volatileCache'|'ackMode'|'plpEnabled'|'remainingWorkJ'>>){
  const result=plpConfigure(state.plp,change);
  setTransaction(result.code+': '+result.message+' / 현재 episode '+state.plp.episode);
  emit('parameter.changed',{kind:'plpConfiguration',accepted:result.accepted,code:result.code,
   episode:state.plp.episode,change,priorOutage:state.plp.powerLossVerdict});
  if(!result.accepted)return;
  setState(prev=>({...prev,plp:result.trial}));setFeedback(null);setAnswer(null);setWhy(false);
 }
 function alterPlp(plpEnabled:boolean,work:0.4|1.2){
  configureTrial({plpEnabled,remainingWorkJ:work});
 }
 function alterCache(volatileCache:boolean){configureTrial({volatileCache});}
 function alterAck(ackMode:PlpAckMode){configureTrial({ackMode});}
 function transact(action:PlpAction){
  const result=plpAdvance(state.plp,action);
  setTransaction(result.code+': '+result.message+' / 근거 '+result.evidence);
  emit('parameter.changed',{kind:'plpEvent',action,accepted:result.accepted,code:result.code,episode:result.trial.episode,
    orderedHistory:result.trial.events,evidence:result.evidence});
  if(!result.accepted)return;
  setState(prev=>({...prev,plp:result.trial}));setFeedback(null);setAnswer(null);setWhy(false);
  if(action==='flush-issue')observe('flush-issued');
  if(action==='flush-complete')observe('flush-completed');
  if(action==='power-loss'&&result.evidence==='at-risk'&&result.trial.ack)observe('risk');
  if(action==='power-loss'&&result.evidence==='durable-under-declared-policy')observe('commit');
  // PLP capacity observation only counts when accepted WRITE→ACK→actual outage occurs in its episode,
  // not when learner merely visits an enabled PLP hardware option.
  if(action==='power-loss'&&result.trial.ack&&result.trial.plpEnabled){
   if(result.evidence==='energetically-possible-unverified')observe('plp-enough');
   if(result.evidence==='energy-insufficient')observe('plp-not-enough');
  }
 }
 function latencyChoose(which:LatencySet){setState(prev=>({...prev,latency:which,sorted:false,selectedRank:null}));setFeedback(null);setAnswer(null);setRankMessage('새 분포를 선택했습니다. 이전 분포의 정렬·순위는 이어받지 않아요.');emit('parameter.changed',{kind:'distribution',which});}
 function sortCards(){setState(prev=>({...prev,sorted:true,selectedRank:null}));setFeedback(null);setAnswer(null);
  setRankMessage('100개를 오름차순으로 정렬했습니다. #99 또는 #100을 직접 눌러 보세요.');emit('parameter.changed',{kind:'sort',dataset:state.latency});}
 function selectRank(idx:number){
  const x=latencyPick(state.latency,state.sorted,idx);setRankMessage(x.code+': '+(x.valid?'정렬된 #99 결과를 확인했어요.':'정렬되지 않았거나 99번째가 아닌 위치입니다. p99은 max가 아닐 수 있어요.'));
  emit('parameter.changed',{kind:'rank',dataset:state.latency,index:idx,accepted:x.valid,code:x.code});
  setFeedback(null);setAnswer(null);
  if(!x.valid)return;
  setState(prev=>({...prev,selectedRank:idx}));observe(state.latency+'-sorted-99');
 }
 function meanCard(){if(!state.sorted||state.selectedRank!==99){setRankMessage('먼저 이 분포의 정렬된 #99를 확인해야 평균 비교도 인정됩니다.');return;}
  observe(state.latency+'-mean');setRankMessage('선택한 '+state.latency+'의 평균은 '+latencyModel(state.latency).meanMs+'ms입니다. p99과 비교하세요.');
  emit('parameter.changed',{kind:'mean',dataset:state.latency});}
 const wrong=meta.answers.find(c=>c.id===feedback?.misconception)?.feedback;
 return <div className="a05-lab a05-ssd09-lab" lang="ko">
  <header className="a05-head"><p className="a05-eyebrow">A05 · eSSD RELIABILITY / LESSON 09</p>
   <h1>NAND QLC에서 eSSD 신뢰성까지</h1><p>전압 중심, GC 이동, ACK·PLP 인과, 100개 지연 분포를 직접 관찰하세요.</p>
   <nav className="a05-stepnav" aria-label="eSSD 신뢰성 네 장면">{ssd09Order.map((s,i)=><button key={s} type="button" disabled={i>index}
    aria-current={i===index?'step':undefined} className={i===index?'active':''} onClick={()=>enter(i)}>{i+1}</button>)}</nav>
  </header>
  <main className="a05-stage"><section className="a05-copy" aria-label="학생용 SSD 체험">
   <span className="a05-eyebrow">{sceneId} · {index+1}/4</span><h2>{meta.title}</h2>
   <p className="a05-hook">{meta.hook}</p><p className="a05-question">{meta.question}</p>
   <div className="a05-box"><h3>먼저 예측하세요</h3><p>{meta.prediction}</p>
    <div className="a05-choice-set">{meta.predictions.map((x,i)=><button key={i} type="button" disabled={revealed} aria-pressed={prediction===String(i)}
     className={prediction===String(i)?'selected':''} onClick={()=>{setPrediction(String(i));emit('prediction.recorded',{prediction:i});}}>{x}</button>)}</div></div>
   {revealed&&<div className="a05-box"><h3>직접 실험 조건 바꾸기</h3><p>{meta.action}</p><div className="a05-ssd09-controls">
    {sceneId==='nand-cell-voltage-windows'&&<>
     <strong>저장상태 중심 개수 (한 셀당 bits)</strong><div className="a05-control-buttons">
      {ctl('SLC · 1bit',()=>alterCell(1),state.bits===1)}
      {ctl('TLC · 3bit',()=>alterCell(3),state.bits===3)}
      {ctl('QLC · 4bit',()=>alterCell(4),state.bits===4)}</div>
     <strong>정량 교란의 가상 반폭</strong><div className="a05-control-buttons">
      {ctl('noise ±0V',()=>alterNoise(0),state.noise===0)}
      {ctl('noise ±0.08V',()=>alterNoise(.08),state.noise===.08)}</div>
    </>}
    {sceneId==='ssd-write-amplification'&&<>
     <strong>호스트는 항상 1 GiB 기록</strong><div className="a05-control-buttons">
      {ctl('GC OFF · 추가 이동0',()=>alterGc(false,0),!state.gc)}
      {ctl('GC ON · 유효 0.6GiB 이동',()=>alterGc(true,.6),state.gc&&state.relocated===.6)}</div>
     <strong>Overprovisioning 가상 공간</strong><div className="a05-control-buttons">
      {ctl('OP 10%',()=>alterOp(10),state.op===10)}
      {ctl('OP 20%',()=>alterOp(20),state.op===20)}</div>
    </>}
    {sceneId==='ssd-plp-power-loss'&&<>
     <strong>쓰기 전 캐시 물리속성과 ACK 완료 계약 (WRITE 시작 후 변경 잠금)</strong><div className="a05-control-buttons">
      {ctl('휘발 캐시 ON',()=>alterCache(true),state.plp.volatileCache)}
      {ctl('휘발 캐시 OFF',()=>alterCache(false),!state.plp.volatileCache)}
      {ctl('ACK: volatileCache',()=>alterAck('volatileCache'),state.plp.ackMode==='volatileCache')}
      {ctl('ACK: afterMediaCommit',()=>alterAck('afterMediaCommit'),state.plp.ackMode==='afterMediaCommit')}</div>
     <strong>PLP 유무와 NAND 남은 에너지 비용 (실제 제품 보증 아님 · WRITE 전만 설정)</strong><div className="a05-control-buttons">
      {ctl('PLP OFF',()=>alterPlp(false,state.plp.remainingWorkJ),!state.plp.plpEnabled)}
      {ctl('PLP ON · 0.4J',()=>alterPlp(true,.4),state.plp.plpEnabled&&state.plp.remainingWorkJ===.4)}
      {ctl('PLP ON · 1.2J',()=>alterPlp(true,1.2),state.plp.plpEnabled&&state.plp.remainingWorkJ===1.2)}</div>
     <strong>정확한 순서대로 한 사건씩 실행 (잘못된 순서 거부)</strong><div className="a05-control-buttons">
      {ctl('1 호스트 WRITE',()=>transact('write'))}
      {ctl('2 컨트롤러 ACK',()=>transact('ack'))}
      {ctl('3 Flush ISSUED',()=>transact('flush-issue'))}
      {ctl('4 Flush COMPLETED',()=>transact('flush-complete'))}
      {ctl('별도 NAND media COMMIT',()=>transact('media-commit'))}
      {ctl('지원된 FUA COMPLETED',()=>transact('fua-complete'))}
      {ctl('POWER LOSS',()=>transact('power-loss'))}
      {ctl('RESET · 새 실험',()=>transact('reset'))}</div>
     {transaction&&<p role="status" className="a05-note" data-testid="ssd09-transaction" aria-live="polite">{transaction}</p>}
     {transaction&&<button type="button" onClick={()=>speak(transaction)}>사건 결과 한국어로 듣기</button>}
    </>}
    {sceneId==='essd-dwpd-tail-latency'&&<>
     <strong>100개 latency 가상 분포 (선택 시 기존 정렬은 무효)</strong><div className="a05-control-buttons">
      {ctl('분포 A',()=>latencyChoose('A'),state.latency==='A')}
      {ctl('분포 B',()=>latencyChoose('B'),state.latency==='B')}</div>
     <strong>섞인 원래 순서 대신 정렬된 순위 선택</strong><div className="a05-control-buttons">
      {ctl('100개 정렬',sortCards,state.sorted)}
      {ctl('원본/정렬 #99 선택',()=>selectRank(99),state.selectedRank===99)}
      {ctl('최댓값 #100 오답 선택',()=>selectRank(100),false)}
      {ctl('선택한 분포 평균 계산',meanCard,false)}</div>
     <strong>5년 decimal DWPD 계산</strong><div className="a05-control-buttons">
      {ctl('2TB ×1DWPD×365×5 계산',()=>{observe('dwpd');setRankMessage('5년(1825일) toy 호스트 쓰기 '+ssdEndurance().writeTb+' decimal TB / '+ssdEndurance().writePbDecimal+' PB. 읽기량 아님.');emit('parameter.changed',{kind:'dwpd'});},false)}
      {ctl('Queue depth 1 · label',()=>change({...state,queueDepth:1},'qd-1'),state.queueDepth===1)}
      {ctl('Queue depth 8 · label',()=>change({...state,queueDepth:8},'qd-8'),state.queueDepth===8)}</div>
     {rankMessage&&<p className="a05-note" role="status" data-testid="ssd09-rank-result">{rankMessage}</p>}
     {rankMessage&&<button type="button" onClick={()=>speak(rankMessage)}>순위/단위 결과 듣기</button>}
    </>}
   </div></div>}
   {revealed&&observed&&<div className="a05-box"><h3>실험 뒤 원리를 설명하세요</h3>
    <div className="a05-choice-set">{meta.answers.map(x=><button key={x.id} type="button" aria-pressed={answer===x.id}
     className={answer===x.id?'selected':''} onClick={()=>{setAnswer(x.id);setFeedback(null);setWhy(false);}}>{x.text}</button>)}</div>
    <button type="button" className="a05-primary" onClick={()=>{const x=gradeSsd09(sceneId,seen,answer);setFeedback(x);setWhy(false);
     emit('answer.checked',{passed:x.passed,misconception:x.misconception,evidence:seen});}}>관찰과 설명 검증</button>
   </div>}
   <div className="a05-tools"><button type="button" onClick={()=>speak(meta.beforeVoice)}>한국어 질문 듣기</button>
    {revealed&&<button type="button" disabled={hint===3} onClick={()=>{setHint(Math.min(3,hint+1));emit('hint.opened',{level:Math.min(3,hint+1)});}}>힌트 {hint}/3</button>}</div>
   {hint>0&&<div className="a05-hint">{meta.hints.slice(0,hint).map((x,i)=><p key={i}>{i+1}. {x}</p>)}</div>}
   {feedback&&<section className="a05-result" role="status" aria-live="polite">
    <h3>{feedback.passed?'eSSD의 서로 다른 신뢰성 경계를 확인했어요!':'아직 확인하지 않은 조건이 있어요'}</h3>
    {feedback.conditions.map(x=><p key={x.key}><strong>{x.passed?'✓':'△'} {x.key}</strong> — {x.passed?'관찰 완료':x.help}</p>)}
    {!feedback.passed&&wrong&&<p data-testid="ssd09-keyed-feedback">{seen.length>=2?wrong:'서로 다른 조작 조건 둘을 먼저 관찰하세요.'}</p>}
    <button type="button" onClick={()=>speak(feedback.passed?meta.next:seen.length>=2&&wrong?wrong:feedback.conditions.filter(x=>!x.passed).map(x=>x.help).join(' '))}>피드백 듣기</button>
    <button type="button" onClick={()=>setWhy(!why)}>{why?'원리 접기':'왜? 자세히 보기'}</button>
   </section>}
   {feedback&&why&&<div className="a05-why"><h3>왜?</h3><p>{feedback.passed?meta.why:'조건을 완료하고 올바른 원리를 확인하면 해설을 볼 수 있어요.'}</p>{feedback.passed&&<p>{meta.next}</p>}</div>}
   {feedback?.passed&&index<3&&<button type="button" className="a05-primary" onClick={()=>enter(index+1)}>다음 질문으로 →</button>}
   {feedback?.passed&&index===3&&<p className="a05-why">09번 eSSD 신뢰성 4장면 완료. 실제 제품 앱 진도 저장은 A02 별도 연결입니다.</p>}
  </section>
  <section className="a05-canvas-col" aria-label="eSSD 2.5D 가상 상태 시각화">
   <div className="a05-canvas-header"><span>eSSD RELIABILITY 2.5D</span><span>{revealed&&observed?'관찰 중':'예측·조작 전 정답 숨김'}</span></div>
   <Ssd09SceneVisual sceneId={sceneId} state={state} revealed={revealed&&observed} evidence={seen}/>
   <div className="a05-model-limit"><strong>물리 경계</strong> {revealed&&observed?meta.limits:'교육용 모형입니다. 정답이 되는 수치·분포·기기 가정은 먼저 예상하고 조작한 뒤 확인하세요.'}</div>
   <div className="a05-source">A06 Lesson09 blob a2fb4bd5 · A07 EDU_QA_PASS_SOURCE · 전압/GC/PLP/p99 수치는 가상·제품 측정 아님</div>
  </section></main></div>;
}
