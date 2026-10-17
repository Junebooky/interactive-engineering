import {useState} from 'react';
import {Nand04SceneVisual} from './Nand04SceneVisual';
import {gradeNand04,nand04Advance,nand04Fresh,nand04SceneOrder} from './nand04Model';
import type {Nand04Event,Nand04EventType,Nand04Grade,Nand04SceneId,Nand04State,Nand04TxnAction} from './nand04Model';
import '../a05Scenes.css';import './nand04.css';
type Choice={id:string;text:string;feedback?:string};
type Story={title:string;hook:string;question:string;prediction:string;predictions:Choice[];
 task:string;answers:Choice[];hints:readonly [string,string,string];why:string;next:string;
 speech:string;bounds:string};
const STORY:Record<Nand04SceneId,Story>={
 'nand-threshold':{
  title:'전원을 꺼도 사진은 어떻게 남아 있을까요?',
  hook:'두 메모리의 전원을 껐다 다시 켠다고 상상해 보세요.',
  question:'NAND와 DRAM은 어떤 상태를 저장하고 어떻게 읽을까요?',
  prediction:'전원을 껐다 켠 다음에도 구별할 수 있는 기억 상태가 있는지, 어디서 관찰할지 예상해 보세요.',
  predictions:[{id:'charge',text:'전원을 껐다 켜도 구별할 방법이 남을 수 있어요.'},{id:'no',text:'전원을 껐다 켜면 모든 장치는 항상 같은 상태가 돼요.'}],
  task:'NAND 저장 전하 상태 low/high, 읽기 기준 0.3/1/2V와 전원 OFF→ON을 조작하세요.',
  answers:[
   {id:'retention-vs-read',text:'저장 전하가 셀 문턱 상태에 영향을 주고 전원 복구 후에 읽어 구별할 수 있어요. 비휘발성과 전원 없는 읽기는 달라요.'},
   {id:'m1',text:'비휘발성이면 배터리·전원이 없을 때도 언제나 직접 읽을 수 있어요.',feedback:'비휘발은 정보 보존의 뜻이고 실제 읽기는 전원을 켠 회로와 센스 기능이 필요해요.'},
   {id:'m2',text:'NAND는 모든 데이터에 DRAM처럼 수십 ms 주기로 무조건 refresh를 해요.',feedback:'일반 NAND는 DRAM 주기 refresh와 다르게 전하 보존/리텐션/읽기교란 제약이 있어요.'},
   {id:'m3',text:'모든 NAND 셀은 오직 1비트 저장 방식만 존재해요.',feedback:'TLC·QLC 같은 다중 문턱 레벨 모델도 존재하며 모든 NAND가 SLC는 아니에요.'}
  ],
  hints:['비휘발 데이터 유지와 무전원 읽기 동작은 같을까요?','문턱 전압을 비교하려면 읽기회로가 필요한가요?','다중 상태 문턱을 구분하는 TLC·QLC도 있을까요?'],
  why:'NAND는 전하 트랩 또는 부유 게이트 등으로 상태를 오랫동안 보존하고 그 문턱을 전원이 공급된 센스 회로에서 구분합니다. 두 문턱 low/high와 1.0V read는 2-state toy이며 실제 셀 분포, retention·temperature·read-disturb는 생략해요. DRAM은 짧은 보존과 refresh가 필요한 다른 소자입니다.',
  next:'같은 논리 주소를 수정할 때 왜 다른 물리 페이지가 필요할까요?',
  speech:'다른 두 메모리의 전원을 꺼서 보관했다가 다시 켤 때 어떻게 될지 먼저 예상해 주세요.',
  bounds:'2 상태 임계전압 low 0.5V/high 1.5V/read 0.3/1/2V toy. 제품별 실제 셀 문턱값, 보존시간, MLC/TLC·QLC 인코딩과 다름.'
 },
 'nand-page-block':{
  title:'파일 한 줄만 수정하는데 블록 지우기가 필요할까요?',
  hook:'NAND의 쓰기 단위와 지우기 단위는 다를 수 있어요.',
  question:'같은 파일 주소를 새 값으로 바꾸면 어디에 기록할까요?',
  prediction:'같은 파일 주소를 수정할 때 어떤 물리 페이지 조작이 필요한지 먼저 예상해 보세요.',
  predictions:[{id:'move',text:'쓰기와 지우기 단위를 조사해야 해요.'},{id:'same',text:'NAND 안에서는 어떤 페이지든 무제한 제자리 수정할 수 있어요.'}],
  task:'장난감 2블록×4페이지의 초기 A → 같은 LBA 수정 B → GC 후 블록 지우기를 비교하세요.',
  answers:[
   {id:'page-vs-block',text:'프로그램은 페이지 단위, 지우기는 블록 단위여서 새 페이지에 수정본을 쓰고 옛 기록을 무효화한 뒤 GC로 공간을 회수할 수 있어요.'},
   {id:'m1',text:'이미 프로그램한 NAND 페이지는 제자리에서 무한히 쓰고 지울 수 있어요.',feedback:'일반 NAND에선 이미 프로그램된 페이지를 논리주소처럼 자유롭게 제자리 덮어쓰지 못해 새 페이지가 필요해요.'},
   {id:'m2',text:'GC는 사용자 파일을 아무 이유 없이 무작위 삭제하는 작업이에요.',feedback:'GC는 살아 있는 페이지의 데이터를 지키며 무효 공간을 회수하는 내부 관리 작업이에요.'},
   {id:'m3',text:'페이지 한 개와 지우는 블록 한 개의 크기는 언제나 같아요.',feedback:'지우기는 여러 페이지가 들어 있는 블록 단위인 경우가 일반적이며 모형 한 블록은 페이지 네 개예요.'}
  ],
  hints:['쓰기와 지우기의 물리적인 단위를 구별해 보세요.','같은 LBA를 새로운 빈 물리 페이지에 기록하면 어떨까요?','블록을 지우기 전 유효한 페이지는 보존해야 해요.'],
  why:'NAND의 페이지 프로그램과 블록 지우기는 다릅니다. 이 모형은 블록 두 개/각 네 페이지로 LBA7 처음 A를 B로 바꾸면 빈 B1:P0에 새 값을 기록하고 이전 B0:P0을 무효화합니다. GC는 살아 있는 페이지를 잃지 않도록 이동·보호한 뒤 블록을 지웁니다. 실제 페이지 순서·크기·오버프로비저닝은 제품마다 달라요.',
  next:'논리주소와 물리페이지가 달라지는 일을 SSD 안의 누가 맡을까요?',
  speech:'작은 NAND에서 같은 파일 주소를 수정해 보세요. 어느 칸을 쓸지 먼저 골라 보세요.',
  bounds:'2 blocks×4 pages / LBA7 A→B toy; garbage collection physically must preserve valid pages; 실제 프로그램 순서/erase 횟수 보증 아님'
 },
 'ssd-ftl-reliability':{
  title:'SSD 안의 주소 담당자와 신뢰성 기능을 살펴볼까요?',
  hook:'서버용 SSD도 모델마다 부품과 보호 기능이 달라요.',
  question:'같은 호스트 주소가 SSD 내부에서 항상 같은 물리 위치를 가리킬까요?',
  prediction:'논리주소와 물리 페이지의 대응을 먼저 예상하고, 어떤 기능이 실제 제품에 있는지 따로 선택해 보세요.',
  predictions:[{id:'design',text:'설계에 따라 주소·보호 동작이 달라질 수도 있어요.'},{id:'fixed',text:'제품이 eSSD이면 내부 구성은 전부 동일해요.'}],
  task:'hot/cold 쓰기, ECC 유무, PLP 유무, DRAM 캐시 유무를 각각 선택해 FTL 상태를 관찰하세요.',
  answers:[
   {id:'ftl-feature-options',text:'FTL은 LBA→물리 위치를 바꿀 수 있고, 마모·ECC·지연·전원 보호/DRAM 사용 여부는 제품별 설계와 사양을 확인해야 해요.'},
   {id:'ssd-plp-universal',text:'모든 eSSD에는 반드시 PLP가 장착돼 있고 그 기능이 똑같아요.',feedback:'PLP는 개별 SSD 데이터시트에서 지원 여부와 실제 보호 범위를 확인해야 해요.'},
   {id:'ssd-dram-universal',text:'SSD라면 내부에 전용 DRAM 캐시가 반드시 있어야 해요.',feedback:'DRAMless SSD와 호스트 메모리 버퍼를 활용하는 설계도 있으므로 모든 장치에서 필요하지 않아요.'},
   {id:'ecc-perfect',text:'ECC를 켜면 SSD의 모든 가능한 오류가 완전히 사라져요.',feedback:'ECC에는 정정 가능한 오류 한계가 있으므로 오류 확률이 0이 되지는 않아요.'}
  ],
  hints:['LBA와 실제 물리주소가 꼭 일대일 고정일까요?','PLP·DRAM 유무는 eSSD라는 이름만으로 정해질까요?','ECC는 무한한 개수의 오류를 복원할 수 있을까요?'],
  why:'FTL은 호스트 LBA와 NAND 페이지 관계를 관리하며 프로그램/GC/마모 평준화를 수행합니다. ECC는 정정 범위 내 오류를 줄이되 무오류 보장이 아니고, DRAM 캐시/DRAMless·PLP 존재는 SKU마다 다릅니다. hot/cold는 추상적인 마모 차이이며 실제 DWPD/성능을 예측하지 않습니다.',
  next:'SSD의 읽기 명령과 읽어온 데이터는 어느 방향으로 움직일까요?',
  speech:'같은 호스트 주소로 쓰기를 반복할 때 내부 위치와 제품 기능 후보를 비교해 보세요.',
  bounds:'ECC/PLP/DRAM 선택은 서로 독립적인 제품 옵션 카드; eSSD 단어만으로 실제 하드웨어 확정 불가. toy 지표 DWPD 아님'
 },
 'nvme-transfer':{
  title:'SSD에서 GPU까지 데이터는 어떤 길로 갈까요?',
  hook:'NVMe, PCIe, NAND, SSD 컨트롤러의 역할을 분리해 봐요.',
  question:'읽기 요청 명령과 읽기 데이터의 출발점은 같을까요?',
  prediction:'NVMe 명령, PCIe 연결, SSD 컨트롤러와 NAND를 섞은 카드에서 요청과 실제 읽기 데이터의 화살표를 구분해 보세요.',
  predictions:[{id:'directions',text:'명령과 읽은 데이터의 방향을 각각 따져볼게요.'},{id:'same',text:'모든 요청과 데이터는 언제나 같은 방향으로만 가요.'}],
  task:'호스트 READ 요청 → NAND READ payload → 호스트에서 GPU로 별도 전송을 순서대로 조작하세요.',
  answers:[
   {id:'command-dma-staging',text:'NVMe는 명령·큐 인터페이스, PCIe는 연결이고 호스트→SSD 요청과 SSD→host DDR의 DMA read payload는 별도예요. GPU 이동은 추가 단계예요.'},
   {id:'m1',text:'NVMe는 SSD를 꽂는 물리 케이블 이름 자체예요.',feedback:'NVMe는 명령·큐와 장치 인터페이스이고 PCIe는 대표적인 실제 전송/연결 경로예요.'},
   {id:'m2',text:'CPU 코어가 읽기 payload를 항상 바이트 하나하나 직접 복사해야 해요.',feedback:'CPU는 I/O를 설정할 수 있지만 장치 DMA가 읽기 payload를 호스트 DDR로 옮길 수도 있어요.'},
   {id:'m3',text:'SSD READ를 누르면 모든 기기에서 바로 GPU HBM에 무조건 적재돼요.',feedback:'기본 경로는 host DDR staging이며 지원 플랫폼의 직접 GPU 경로는 별도 옵션이에요.'}
  ],
  hints:['읽으라고 요청하는 명령은 누가 시작하나요?','명령의 규칙과 전송 매체는 같은 개념인가요?','host DDR을 거치는 경로와 GPU direct 조건을 비교해 보세요.'],
  why:'일반 host-staging 예시: NVMe READ 요청은 호스트 소프트웨어·큐에서 PCIe를 통해 컨트롤러로, NAND 데이터는 컨트롤러/PCIe DMA를 통해 host DDR로 돌아옵니다. 이후 GPU 메모리로의 전송은 별도 경로이며 GPUDirect Storage 같은 예외는 지원 조건을 명시해야 합니다.',
  next:'AI 모델이 GPU 메모리에 이미 있으면 매 토큰마다 SSD를 읽어야 할까요?',
  speech:'NVMe와 PCIe, SSD 컨트롤러, NAND 카드를 각각 어떻게 연결할지 먼저 골라 보세요.',
  bounds:'host DDR staging 교육 예시만, Nvme-oF/GPU direct 경로 가능. 실제 시스템 내 장치/호스트 물리 경로와 DMA 가용 조건은 제품별로 다름'
 },
 'ai-datacenter-pipeline':{
  title:'AI 질문 한 줄에도 SSD에서 데이터가 다시 출발할까요?',
  hook:'이미 GPU 메모리에 적재된 모델과 새로 로딩할 모델은 달라요.',
  question:'하나의 추론 요청과 여러 서버 학습 체크포인트의 병목은 같을까요?',
  prediction:'모델이 이미 GPU 메모리에 있는 경우와 저장소에서 처음 적재해야 하는 경우의 경로를 예상해 보세요.',
  predictions:[{id:'paths',text:'모델이 놓인 위치와 실행 상태를 먼저 비교해 볼게요.'},{id:'same',text:'AI 요청은 어떤 환경에서도 같은 경로를 매번 반복해요.'}],
  task:'초기 모델 로딩, GPU resident 추론, checkpoint 기록, 두 서버 네트워크 조건을 직접 선택하세요.',
  answers:[
   {id:'resident-vs-cold',text:'처음 로딩과 모델이 이미 GPU 메모리에 있는 추론은 다르고, 체크포인트 SSD 저장·다중 서버 NIC/네트워크 및 전원/냉각도 필요해요.'},
   {id:'m1',text:'AI가 토큰 하나를 생성할 때마다 SSD에서 모델 전체를 언제나 다시 로드해요.',feedback:'이미 GPU 메모리/캐시에 상주한 모델은 토큰마다 전체 SSD 재로딩이 필수는 아니에요.'},
   {id:'m2',text:'GPU HBM이 빠르니까 장기 저장 NAND/SSD와 CPU DDR은 언제나 불필요해요.',feedback:'HBM, CPU DDR, NAND/SSD는 속도·용량·보존 방식과 목적이 달라요.'},
   {id:'m3',text:'AI 데이터센터는 GPU만 연결하면 네트워크·전원·냉각 없이도 돼요.',feedback:'GPU 외에 CPU·SSD·NIC·네트워크, 충분한 전력·냉각·복구 설계가 있어야 운영돼요.'}
  ],
  hints:['모델이 이미 GPU 메모리에 있다면 SSD 재로딩이 늘 필요할까요?','체크포인트는 어디에 남기나요?','두 서버 학습과 전원/냉각까지 고려해 보세요.'],
  why:'AI 서비스의 모델 적재, 추론, 분산 학습과 체크포인트는 각각 저장·계산·네트워크 수요가 다릅니다. cold load는 NAND/SSD에서 CPU 메모리를 거쳐 GPU에 올라갈 수 있고, resident inference는 이미 올라간 가중치를 토큰마다 SSD에서 재로딩하지 않아도 됩니다. 실제 오프로딩/페이지잉·GPUDirect·네트워크 환경은 시스템마다 달라요.',
  next:'이 시스템을 만드는 공정과 패키징, GPU 전원·냉각도 탐구해 볼까요?',
  speech:'모델이 이미 메모리에 있을 때와 처음 불러오는 때의 경로를 따로 그려 봐요.',
  bounds:'1/2서버 상황과 load/infer/checkpoint 구분만. 실제 토큰/s, 전력, PUE, 클러스터 성능은 이 모델에서 예측하지 않음'
 }
};
export interface Nand04LabProps{onEvent?:(e:Nand04Event)=>void;onSpeech?:(sceneId:Nand04SceneId,txt:string)=>void}
export function Nand04SceneLab({onEvent,onSpeech}:Nand04LabProps){
 const [index,setIndex]=useState(0),id=nand04SceneOrder[index],story=STORY[id];
 const [state,setState]=useState<Nand04State>(nand04Fresh);
 const [prediction,setPrediction]=useState<string|null>(null),[answer,setAnswer]=useState<string|null>(null);
 const [seen,setSeen]=useState<string[]>([]),[hint,setHint]=useState(0);
 const [feedback,setFeedback]=useState<Nand04Grade|null>(null),[why,setWhy]=useState(false);
 const [visited,setVisited]=useState(false);
 const [sequenceMessage,setSequenceMessage]=useState('');
 const reveal=prediction!==null;
 const emit=(type:Nand04EventType,payload?:Record<string,unknown>)=>onEvent?.({sceneId:id,type,payload});
 function observe(tag:string){setSeen(xs=>xs.includes(tag)?xs:[...xs,tag]);}
 function change(next:Nand04State,tag:string){
  setState(next);observe(tag);setVisited(true);setFeedback(null);setWhy(false);
  emit('parameter.changed',{tag});
 }
 /** A07 P1: reject physically impossible transitions BEFORE changing SVG/model or grade evidence. */
 function sequence(action:Nand04TxnAction){
  const page=id==='nand-page-block',kind=page?'page':'transport';
  const history=page?state.pageHistory:state.transportHistory;
  const outcome=nand04Advance(kind,history,action);
  setSequenceMessage(outcome.code+': '+outcome.explanation);
  setFeedback(null);setWhy(false);
  if(!outcome.accepted){emit('parameter.changed',{action,accepted:false,code:outcome.code,episode:state.episode,history:[...history]});return;}
  const episode=state.episode+(outcome.reset?1:0);
  setState(prev=>({...prev,pageStage:page?(outcome.phase==='updated'||outcome.phase==='collected'?outcome.phase:'initial'):prev.pageStage,
   transport:!page?(outcome.phase==='read-data'||outcome.phase==='to-gpu'?outcome.phase:'command'):prev.transport,
   pageHistory:page?outcome.history:prev.pageHistory,transportHistory:page?prev.transportHistory:outcome.history,
   episode,lastCode:outcome.code}));
  setSeen(outcome.history);setVisited(outcome.history.length>0);
  setAnswer(null);
  emit('parameter.changed',{action,accepted:true,code:outcome.code,episode,history:[...outcome.history],phase:outcome.phase,reset:outcome.reset});
 }
 function enter(i:number){
  if(i<0||i>=nand04SceneOrder.length)return;
  setIndex(i);setState(nand04Fresh());setPrediction(null);setAnswer(null);setSeen([]);setHint(0);
  setFeedback(null);setWhy(false);setVisited(false);setSequenceMessage('');onEvent?.({sceneId:nand04SceneOrder[i],type:'scene.enter'});
 }
 function correct(){
  const result=gradeNand04(id,seen,answer);
  setFeedback(result);setWhy(false);emit('answer.checked',{passed:result.passed,misconception:result.misconception});
 }
 function speak(t:string){emit('voice.requested',{text:t});onSpeech?.(id,t);}
 const ctl=(label:string,fn:()=>void,active:boolean)=><button type="button" aria-pressed={active}
  className={active?'selected':''} onClick={fn}>{label}</button>;
 const wrong=story.answers.find(x=>x.id===feedback?.misconception)?.feedback;
 const hasEvidence=seen.length>=2&&visited;
 return <div className="a05-lab a05-nand04-lab" lang="ko">
  <header className="a05-head"><p className="a05-eyebrow">A05 · NAND / eSSD / NVMe / AI DATA JOURNEY · N04</p>
   <h1>SSD에서 AI까지, 데이터는 어디로 여행할까요?</h1>
   <p>다섯 실험 · 먼저 예측한 뒤 전하·페이지·전송 경로를 비교하세요.</p>
   <nav className="a05-stepnav" aria-label="NAND 데이터 여행 5단계">
    {nand04SceneOrder.map((scene,i)=><button type="button" key={scene} disabled={i>index}
     aria-current={index===i?'step':undefined} className={index===i?'active':''} onClick={()=>enter(i)}>{i+1}</button>)}
   </nav>
  </header>
  <main className="a05-stage"><section className="a05-copy" aria-label="학습자 질문 및 조작">
   <span className="a05-eyebrow">{id} · {index+1}/5</span>
   <h2>{story.title}</h2><p className="a05-hook">{story.hook}</p><p className="a05-question">{story.question}</p>
   <div className="a05-box"><h3>예측 먼저</h3><p>{story.prediction}</p><div className="a05-choice-set">
    {story.predictions.map(x=><button key={x.id} disabled={reveal} type="button"
      className={prediction===x.id?'selected':''} aria-pressed={prediction===x.id}
      onClick={()=>{setPrediction(x.id);emit('prediction.recorded',{choice:x.id});}}>{x.text}</button>)}
   </div></div>
   {reveal&&<>
    <div className="a05-box"><h3>직접 움직여 보기</h3><p>{story.task}</p>
     {id==='nand-threshold'&&<div className="a05-nand04-controls">
      <strong>저장된 셀 전하/문턱 상태</strong><div className="a05-control-buttons">
       {ctl('Low state',()=>change({...state,cell:'low'},'low'),state.cell==='low')}
       {ctl('High state',()=>change({...state,cell:'high'},'high'),state.cell==='high')}
      </div><strong>읽기 기준 전압</strong><div className="a05-control-buttons">
       {([0.3,1,2] as const).map(v=>ctl(v+' V',()=>change({...state,readV:v},'read-voltage'),state.readV===v))}
      </div><strong>전원 제거/재인가</strong><div className="a05-control-buttons">
       {ctl('Power OFF',()=>change({...state,power:'off'},'power-off'),state.power==='off')}
       {ctl('Power ON',()=>change({...state,power:'on'},state.power==='off'?'power-cycle':'power-on'),state.power==='on')}
      </div></div>}
     {id==='nand-page-block'&&<div className="a05-nand04-controls">
      <strong>장난감 LBA7 A → B / 두 블록</strong><div className="a05-control-buttons">
       {ctl('초기 A 저장',()=>sequence('initial'),state.pageHistory.length===1)}
       {ctl('같은 LBA 수정 B',()=>sequence('updated'),state.pageHistory.length===2)}
       {ctl('GC · 무효 블록 지우기',()=>sequence('collected'),state.pageHistory.length===3)}
       {ctl('RESET · 새 페이지 실험',()=>sequence('reset'),false)}
      </div></div>}
     {id==='ssd-ftl-reliability'&&<div className="a05-nand04-controls">
      <strong>쓰기가 잦은 주소와 드문 주소 비교</strong><div className="a05-control-buttons">
       {ctl('Hot writes',()=>change({...state,writePattern:'hot'},'hot'),state.writePattern==='hot')}
       {ctl('Cold writes',()=>change({...state,writePattern:'cold'},'cold'),state.writePattern==='cold')}
      </div><strong>오류 정정 ECC와 보호 기능 PLP (제품별 선택지)</strong><div className="a05-control-buttons">
       {ctl('ECC '+(state.ecc?'ON':'OFF'),()=>change({...state,ecc:!state.ecc},'ecc-option'),state.ecc)}
       {ctl('PLP '+(state.plp?'ON':'OFF'),()=>change({...state,plp:!state.plp},'plp-option'),state.plp)}
       {ctl('DRAM '+(state.dramCache?'있음':'없음'),()=>change({...state,dramCache:!state.dramCache},'dram-option'),state.dramCache)}
      </div></div>}
     {id==='nvme-transfer'&&<div className="a05-nand04-controls">
      <strong>요청/읽기 payload/이후 GPU 이동 분리</strong><div className="a05-control-buttons">
       {ctl('NVMe READ 명령',()=>sequence('command'),state.transportHistory.length===1)}
       {ctl('PCIe DMA payload',()=>sequence('read-data'),state.transportHistory.length===2)}
       {ctl('DDR → GPU 별도 이동',()=>sequence('to-gpu'),state.transportHistory.length===3)}
       {ctl('RESET · 새 NVMe READ',()=>sequence('reset'),false)}
      </div></div>}
     {(id==='nand-page-block'||id==='nvme-transfer')&&sequenceMessage&&<p className="a05-note" role="status" data-testid="nand04-transaction-result" aria-live="polite">{sequenceMessage}</p>}
     {(id==='nand-page-block'||id==='nvme-transfer')&&sequenceMessage&&<button type="button" onClick={()=>speak(sequenceMessage)}>전이 결과 듣기</button>}
     {id==='ai-datacenter-pipeline'&&<div className="a05-nand04-controls">
      <strong>모델 로딩/상주 추론/체크포인트</strong><div className="a05-control-buttons">
       {ctl('처음 모델 로딩',()=>change({...state,ai:'cold-load'},'cold-load'),state.ai==='cold-load')}
       {ctl('상주 추론',()=>change({...state,ai:'resident-infer'},'resident-infer'),state.ai==='resident-infer')}
       {ctl('학습 체크포인트',()=>change({...state,ai:'checkpoint'},'checkpoint'),state.ai==='checkpoint')}
      </div><strong>서버</strong><div className="a05-control-buttons">
       {ctl('서버 1대',()=>change({...state,servers:1},'one-server'),state.servers===1)}
       {ctl('서버 2대',()=>change({...state,servers:2},'two-servers'),state.servers===2)}
      </div></div>}
    </div>
    <div className="a05-box"><h3>관찰과 원리를 연결해 보세요</h3><div className="a05-choice-set">
     {story.answers.map(x=><button type="button" key={x.id} aria-pressed={answer===x.id}
       className={answer===x.id?'selected':''} onClick={()=>{setAnswer(x.id);setFeedback(null);setWhy(false);}}>{x.text}</button>)}
    </div><button type="button" className="a05-primary" onClick={correct}>실험/이유 조건 검증</button></div>
   </>}
   <div className="a05-tools"><button type="button" onClick={()=>speak(story.speech)}>한국어 질문 듣기</button>
    {reveal&&<button type="button" disabled={hint===3} onClick={()=>{setHint(Math.min(3,hint+1));emit('hint.opened',{level:Math.min(3,hint+1)});}}>힌트 {hint}/3</button>}
   </div>
   {hint>0&&<div className="a05-hint">{story.hints.slice(0,hint).map((t,i)=><p key={i}>{i+1}. {t}</p>)}</div>}
   {feedback&&<section className="a05-result" role="status" aria-live="polite">
    <h3>{feedback.passed?'NAND부터 AI까지 원리를 발견했어요!':'아직 놓친 조건이 있어요'}</h3>
    {feedback.conditions.map(c=><p key={c.label}><strong>{c.passed?'✓':'△'} {c.label}</strong> — {c.passed?'관찰 완료':c.help}</p>)}
    {!feedback.passed&&feedback.misconception&&<p data-testid="nand04-keyed-feedback">{hasEvidence?wrong:'먼저 서로 다른 실험 조건 둘 이상을 조작해 관찰한 뒤 오개념 해설을 확인하세요.'}</p>}
    <button type="button" onClick={()=>speak(feedback.passed?story.next:hasEvidence&&wrong?wrong:feedback.conditions.filter(c=>!c.passed).map(c=>c.help).join(' '))}>피드백 듣기</button>
    <button type="button" onClick={()=>setWhy(v=>!v)}>{why?'원리 접기':'왜? 원리 보기'}</button>
   </section>}
   {why&&feedback&&<section className="a05-why"><h3>왜?</h3><p>{hasEvidence?story.why:'서로 다른 조작 조건 둘 이상을 비교하면 원리 해설을 읽을 수 있어요.'}</p>{feedback.passed&&<p>{story.next}</p>}</section>}
   {feedback?.passed&&index<4&&<button type="button" className="a05-primary" onClick={()=>enter(index+1)}>다음 질문으로 →</button>}
   {feedback?.passed&&index===4&&<div className="a05-why">NAND·eSSD·NVMe·AI 여정을 마쳤어요. A02 정식 진도 통합/저장은 별도입니다.</div>}
  </section>
  <section className="a05-canvas-col" aria-label="NAND에서 AI까지 2.5D 인터랙티브 관찰">
   <div className="a05-canvas-header"><span>LIVE NAND 2.5D / N04</span><span>{reveal?'실험 중':'예측 먼저'}</span></div>
   <Nand04SceneVisual sceneId={id} state={state} revealed={reveal}/>
   <div className="a05-model-limit"><strong>모형 범위</strong> {reveal?story.bounds:'교육용 장난감 모형입니다. 답이 되는 단위·물리 가정은 예측 뒤에만 공개합니다.'}</div>
   <div className="a05-source">A06 Lesson04 exact blob 3feba6f3 · A07 EDU_QA_PASS_SOURCE · A05 원본 SVG/React · 실제 SKU 측정 아님</div>
  </section>
  </main></div>;
}
