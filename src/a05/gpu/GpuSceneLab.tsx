import {useState} from 'react';
import {GpuSceneVisual} from './GpuSceneVisual';
import {assessGpu,gpuSceneOrder} from './gpuModel';
import type {ComputeRate,Family,FeedRate,GpuEvent,GpuFeedback,GpuSceneId,PinRate,Placement,Signal,Topology} from './gpuModel';
import type {GpuVisualState} from './GpuSceneVisual';
import '../a05Scenes.css';
import './gpuScenes.css';

type Choice={id:string;text:string;correction?:string};
type Story={
  title:string;hook:string;question:string;prediction:string;predictions:Choice[];
  prompt:string;answers:Choice[];hints:readonly [string,string,string];
  why:string;next:string;speech:string;assumptions:string;
};
const LESSON:Record<GpuSceneId,Story>={
  'compute-feeding':{
    title:'GPU 코어가 놀고 있는데 코어를 더 사야 할까요?',
    hook:'연산기는 준비됐는데 계산할 데이터가 늦게 오면 어떡할까요?',
    question:'공급=8일 때 계산=16→32로 늘리면 총 시간이 반이 될까요?',
    prediction:'연산과 공급이 완전히 겹치는 교육용 파이프라인이라면 어느 쪽이 병목일까요?',
    predictions:[{id:'feed',text:'데이터 공급 8이 병목일 것 같아요.'},{id:'core',text:'코어가 2배면 언제나 시간은 절반이 돼요.'}],
    prompt:'먼저 FEED=8에서 COMPUTE=16,32를 비교하고, FEED=32로 올려 보세요.',
    answers:[
      {id:'supply-limits',text:'겹친 처리율은 min(compute,feed), FEED=8이면 8 toy s로 그대로예요.'},
      {id:'always-half',text:'GPU 코어가 두 배면 메모리와 무관하게 시간은 무조건 절반이에요.',correction:'데이터가 8개씩만 공급된다면 16이나 32 계산기 모두 공급을 기다려요.'},
      {id:'gb-gbps',text:'메모리 용량 GB가 두 배면 GB/s 대역폭도 자동 두 배예요.',correction:'GB는 저장량, GB/s는 시간당 전송률로 서로 달라요.'},
      {id:'same',text:'응답 지연시간과 긴 작업의 평균 처리율은 똑같은 값이에요.',correction:'짧은 작업의 startup/drain 시간과 정상상태 처리율은 구분해야 해요.'},
    ],
    hints:['공급 8개로 계산 32개를 매초 계속 채울 수 있을까요?','먼저 compute만 16→32로 바꾸고 결과를 비교하세요.','공급도 32로 높이면 어떤 병목이 생기는지 보세요.'],
    why:'교육용 work=64, 완전 겹친 정상상태 파이프라인 처리율=min(compute,feed). FEED=8이면 compute 16과 32 모두 64/8=8 toy s. 순차 모델은 64/feed+64/compute로 별개이며, startup/drain과 재사용을 생략한 근사예요.',
    next:'그렇다면 CPU DDR, 보드 GDDR, 패키지 HBM은 왜 설치 위치가 다를까요?',
    speech:'GPU가 빠르더라도 재료가 늦게 도착하면 멈춰요. 코어와 데이터 공급 두 숫자를 바꿔 보세요.',
    assumptions:'64 toy work · 겹친 파이프라인 정상상태 · 계산 16/32, 공급 8/16/32 toy units/s · 실제 GPU FLOPS/초 아님',
  },
  'memory-family-roles':{
    title:'DDR, GDDR, HBM은 어떤 사이일까요?',
    hook:'서버 CPU와 GPU가 같은 방식으로 DRAM을 배치할 필요가 있을까요?',
    question:'보드와 패키지 자리 차이는 메모리의 용도를 어떻게 바꿀까요?',
    prediction:'이 셋 가운데 HBM은 DRAM일까요, 다른 저장 소자일까요?',
    predictions:[{id:'all-dram',text:'모두 DRAM인데 패키징과 목표가 달라요.'},{id:'hbm-other',text:'HBM은 DRAM과 전혀 다른 비휘발 저장장치예요.'}],
    prompt:'메모리 가족과 장착 위치를 각각 독립적으로 선택하세요. 잘못된 짝도 직접 눌러 판단해 보세요.',
    answers:[
      {id:'all-dram-roles',text:'셋 모두 DRAM이고 DDR/RDIMM·GDDR·HBM은 위치/대역폭/열/비용이 달라요.'},
      {id:'not-dram',text:'HBM은 DRAM이 아니고 전원 꺼도 모델이 남아요.',correction:'HBM은 적층된 DRAM이므로 데이터는 휘발하며 전원·리프레시가 필요해요.'},
      {id:'all-hbm',text:'모든 GPU는 반드시 HBM만 쓸 수 있어요.',correction:'GDDR 계열 메모리를 탑재하는 GPU와 다른 메모리 구조도 있어요.'},
      {id:'always-best',text:'GDDR7이나 HBM은 어떤 비용·열·용량 조건에서도 항상 최고예요.',correction:'전송률·용량·가격·열·호환성을 같이 고려해야 해요.'},
    ],
    hints:['DDR/RDIMM은 어느 종류의 서버 소켓·슬롯 가까이에 있나요?','GPU 보드의 DRAM과 GPU 패키지 근처 적층 DRAM은 연결 비용이 달라요.','특정 제품의 실제 메모리 지원 방식은 모델마다 다릅니다.'],
    why:'DDR/RDIMM은 CPU 시스템 메모리로 자주 사용되며 GDDR6/7은 GPU 보드 메모리, HBM은 일부 AI/HPC GPU 패키지의 적층 DRAM입니다. 모두 DRAM이며 제품별 용량·성능·소비전력·가격은 다릅니다.',
    next:'128bit 연결 폭은 같아도 핀당 신호 속도가 빠르면 이론상 얼마나 늘까요?',
    speech:'CPU DIMM, GPU 보드, GPU 패키지 각각에 어떤 DRAM이 놓이는지 하나씩 확인해 보세요.',
    assumptions:'DDR/RDIMM CPU / GDDR6/7 board GPU / HBM package는 대표 배치 예시; 특정 GPU/서버 지원 확정 아님',
  },
  'gddr-width-rate':{
    title:'같은 길, 더 빠른 신호면 얼마나 보낼까요?',
    hook:'128bit 폭에서 핀마다 매초 24 또는 32기가비트를 보내는 가상 연결을 상상해 보세요.',
    question:'128×24÷8과 128×32÷8의 단위는 무엇일까요?',
    prediction:'핀당 속도를 24에서 32 Gb/s로 바꾸면 대역폭 상한은?',
    predictions:[{id:'rise',text:'전송률이 커지면 이론 대역폭도 커질 것 같아요.'},{id:'same',text:'전송률이 바뀌어도 대역폭은 같을 것 같아요.'}],
    prompt:'가상의 128bit 버스에 24 또는 32Gb/s/pin을 적용하고 GB/s 숫자 퀴즈 두 문제에 답하세요. 정답 검증 전까지 계기판을 가립니다.',
    answers:[
      {id:'theoretical-pam3',text:'이론 GB/s=bit폭×Gb/s/pin÷8; PAM3는 신호 레벨 3개이지 3bit/clk 아님.'},
      {id:'same-gb',text:'Gb/s와 GB/s는 똑같은 단위예요.',correction:'대문자 B는 바이트이고 8비트=1바이트이므로 ÷8 해야 해요.'},
      {id:'three-bits',text:'PAM3이면 신호 한 개당 정확히 3비트를 보내요.',correction:'3개의 진폭 레벨을 의미하며 3비트는 8상태가 필요해요.'},
      {id:'measured',text:'이론 공식으로 계산한 값이 실제 모든 GDDR GPU의 측정값이에요.',correction:'폭·핀당 속도 모두 가상, 100% 효율 이론상 상한이며 실효값 아님.'},
    ],
    hints:['1바이트가 몇 비트였나요?','128×24÷8을 직접 계산해 보세요.','NRZ는 두 레벨, PAM3는 세 레벨이지 비트 3개가 아니에요.'],
    why:'단일 가상 128bit 인터페이스에서 24Gb/s/pin이면 (128×24)/8=384GB/s, 32이면 512GB/s (십진 표기). PAM3는 3개의 신호 진폭이며 3bit/cycle을 의미하지 않고 실제 선로 부호화와 실효값·SKU는 별도입니다.',
    next:'HBM처럼 연결을 아주 넓게 만들면 어떤 어려움이 새로 생길까요?',
    speech:'전송률과 바이트 단위를 구분해 계산해 보세요. 결과는 실제 GPU 제품의 속도가 아닌 가상 이론치예요.',
    assumptions:'가상 128-bit ×24/32 Gb/s/pin, 100% 모델 효율; 십진 이론 상한 계산 모델 · 실제 SKU 데이터 아님',
  },
  'hbm-tradeoffs':{
    title:'HBM을 GPU 곁에 쌓으면 전부 해결될까요?',
    hook:'엄청 넓은 신호 길을 만들면 온도와 제조 비용까지 사라질까요?',
    question:'HBM 내부 TSV와 GPU↔HBM 사이 연결층은 같은 부품일까요?',
    prediction:'패키지 HBM과 보드 GDDR 중 각각 다른 장점·한계가 있지 않을까요?',
    predictions:[{id:'tradeoff',text:'연결 폭의 이점과 제조·열·비용 제약을 같이 봐야 해요.'},{id:'universal',text:'HBM은 모든 상황에서 무조건 더 좋아요.'}],
    prompt:'GPU 보드 GDDR와 HBM 적층 패키지를 오가며 연결을 관찰하고 제약 패널을 여세요.',
    answers:[
      {id:'relative-tradeoffs',text:'HBM은 TSV를 통한 적층 DRAM·넓은 I/O이지만 열·제조·비용 제약이 있어요.'},
      {id:'no-ssd',text:'HBM이 있으면 SSD나 서버 DDR은 항상 전혀 필요 없어요.',correction:'메모리는 작동 중 데이터 저장, SSD는 비휘발 저장, DDR은 다른 계층에 쓰여요.'},
      {id:'gpu-core',text:'HBM 자체가 GPU 행렬연산 코어예요.',correction:'HBM은 GPU 코어에 공급하는 적층 DRAM이자 메모리 부품이에요.'},
      {id:'same-2d',text:'화면의 2.5D 일러스트와 반도체 2.5D 패키징은 같은 공정이에요.',correction:'화면 2.5D는 시각적 깊이 효과, 반도체 2.5D는 칩 간 고밀도 패키지 연결 기술이에요.'},
    ],
    hints:['학습 전원 OFF 상태에서도 모델 가중치를 보관하려면 무엇이 필요할까요?','가까운 적층 구조의 발열은 공짜로 사라질까요?','TSV는 HBM 내부 층 간 길, 인터포저는 GPU와 HBM을 연결하는 별도 길이에요.'],
    why:'HBM은 DRAM 다이를 수직으로 적층하고 층 사이 TSV를 이용합니다. GPU와 HBM 사이 고밀도 연결은 인터포저나 다른 패키징 방식으로 구현할 수 있어요. 넓은 I/O 이점에도 제조 수율·열·비용·공급 제약이 남습니다. 이 인터랙션은 정성적 구조 비교이지 제품별 실측 성능 비교가 아닙니다.',
    next:'그렇다면 AI 모델은 전원이 꺼진 뒤 어디에 남아 있을까요? NAND와 SSD 이야기로 이어가요.',
    speech:'보드 쪽과 패키지 쪽 배치를 비교해 봐요. 어떤 차이가 있을지 예상해 볼까요?',
    assumptions:'HBM도 DRAM · TSV 층간, interposer/연결층 GPU↔HBM · 정성적 교육용 비교, 실제 온도·대역폭 수치 아님',
  },
};
function fresh():GpuVisualState{return {compute:16,feed:8,family:'DDR/RDIMM',site:'cpu-dimm',pinRate:24,signal:'NRZ',topology:'gddr-board',showConstraints:false};}
export interface GpuLabProps{onEvent?:(e:GpuEvent)=>void;onSpeech?:(id:GpuSceneId,txt:string)=>void;}
export function GpuSceneLab({onEvent,onSpeech}:GpuLabProps){
  const [index,setIndex]=useState(0),sceneId=gpuSceneOrder[index],story=LESSON[sceneId];
  const [state,setState]=useState<GpuVisualState>(fresh),[prediction,setPrediction]=useState<string|null>(null);
  const [answer,setAnswer]=useState<string|null>(null),[seen,setSeen]=useState<string[]>([]);
  const [hint,setHint]=useState(0),[feedback,setFeedback]=useState<GpuFeedback|null>(null),[why,setWhy]=useState(false);
  const [matching,setMatching]=useState<string|null>(null);
  const [rateAnswers,setRateAnswers]=useState<{24:number|null;32:number|null}>({24:null,32:null});
  function emit(type:GpuEvent['type'],payload?:GpuEvent['payload']){onEvent?.({sceneId,type,payload});}
  function obs(id:string){setSeen(v=>v.includes(id)?v:[...v,id]);}
  function change(next:GpuVisualState,description:string){setState(next);setFeedback(null);setWhy(false);emit('parameter.changed',{description});}
  function enter(i:number){
    if(i<0||i>=gpuSceneOrder.length)return;
    setIndex(i);setState(fresh());setPrediction(null);setAnswer(null);setSeen([]);setHint(0);setFeedback(null);setWhy(false);setMatching(null);setRateAnswers({24:null,32:null});
    onEvent?.({sceneId:gpuSceneOrder[i],type:'scene.enter'});
  }
  function compute(v:ComputeRate){change({...state,compute:v},'compute '+v);if(state.feed===8)obs(v===16?'core16feed8':'core32feed8');}
  function feed(v:FeedRate){change({...state,feed:v},'feed '+v);if(v===32)obs('feed32');}
  function memoryFamily(family:Family){change({...state,family},'family '+family);setMatching(null);}
  function memorySite(site:Placement){change({...state,site},'site '+site);setMatching(null);}
  function gradeMatch(){
    const correct=state.family==='DDR/RDIMM'?state.site==='cpu-dimm':
      state.family==='HBM'?state.site==='gpu-package':state.site==='gpu-board';
    setMatching(correct?'정합: '+state.family+' → '+state.site:
      state.family==='HBM'?'오답: HBM은 대표적으로 GPU 패키지 가까운 적층 DRAM이에요.':
      state.family==='DDR/RDIMM'?'오답: DDR/RDIMM은 이 서버 모형에서 CPU DIMM 쪽에 놓여요.':
      '오답: GDDR6과 GDDR7은 이 모형에서 GPU 보드 DRAM이에요.');
    if(correct)obs('pair-'+state.family);
    emit('parameter.changed',{description:'pair graded',family:state.family,site:state.site,correct});
  }
  function numericChoice(pinRate:PinRate,value:number){
    setRateAnswers(xs=>({...xs,[pinRate]:value}));
    setSeen(xs=>{
      const without=xs.filter(x=>x!=='quiz'+pinRate);
      return value===(pinRate===24?384:512)?[...without,'quiz'+pinRate]:without;
    });
    setFeedback(null);setWhy(false);
    emit('parameter.changed',{description:'rate quiz',pinRate,value});
  }
  function rate(v:PinRate){change({...state,pinRate:v},'rate '+v);obs(v===24?'rate24':'rate32');}
  function topology(v:Topology){change({...state,topology:v},'topology '+v);obs(v==='hbm-stack'?'hbm':'gddr');}
  function constraints(){change({...state,showConstraints:true},'constraints');obs('constraints');}
  function speak(text:string){emit('voice.requested',{text});onSpeech?.(sceneId,text);}
  const reveal=prediction!==null;
  // Both *correct* numerical selections are required before revealing derived readouts or aria values.
  // A wrong answer must never unlock the correct answer through a graph, Voice or explanatory caption.
  const numericUnlocked=rateAnswers[24]===384&&rateAnswers[32]===512;
  const sceneRevealed=reveal&&(sceneId!=='gddr-width-rate'||numericUnlocked);
  const action=(text:string,fn:()=>void,active:boolean)=>(
    <button type="button" aria-pressed={active} className={active?'selected':''} onClick={fn}>{text}</button>
  );
  return <div className="a05-lab a05-gpu-lab" lang="ko">
    <header className="a05-head">
      <p className="a05-eyebrow">A05 · GPU 2.5D DATA-LANE LAB / G03</p>
      <h1>GPU가 빠른데 왜 기다릴까? DDR·GDDR·HBM</h1>
      <p>데이터 공급, 메모리 위치, 전송률, 패키지 제약을 손으로 연결해 보세요.</p>
      <nav className="a05-stepnav" aria-label="GPU G03 레슨 진행">
        {gpuSceneOrder.map((x,i)=><button key={x} type="button" disabled={i>index}
          aria-current={i===index?'step':undefined} className={i===index?'active':''}
          onClick={()=>enter(i)}>{String(i+1).padStart(2,'0')}</button>)}
      </nav>
    </header>
    <main className="a05-stage">
      <section className="a05-copy" aria-label="학습 단계">
        <span className="a05-eyebrow">{sceneId} · {index+1}/4</span>
        <h2>{story.title}</h2><p className="a05-hook">{story.hook}</p><p className="a05-question">{story.question}</p>
        <div className="a05-box"><h3>먼저 예상해 보세요</h3><p>{story.prediction}</p>
          <div className="a05-choice-set">{story.predictions.map(c=><button type="button" key={c.id} disabled={reveal}
            aria-pressed={prediction===c.id} className={prediction===c.id?'selected':''}
            onClick={()=>{setPrediction(c.id);emit('prediction.recorded',{choice:c.id});}}>{c.text}</button>)}</div>
        </div>
        {reveal&&<>
          <div className="a05-box"><h3>직접 움직여 보기</h3><p>{story.prompt}</p>
            {sceneId==='compute-feeding'&&<div className="a05-gpu-controls">
              <strong>계산 처리량 (toy/s)</strong><div className="a05-control-buttons">
                {action('compute 16',()=>compute(16),state.compute===16)}
                {action('compute 32',()=>compute(32),state.compute===32)}
              </div><strong>메모리 공급 (toy/s)</strong><div className="a05-control-buttons">
                {action('feed 8',()=>feed(8),state.feed===8)}{action('feed 16',()=>feed(16),state.feed===16)}
                {action('feed 32',()=>feed(32),state.feed===32)}
              </div>
            </div>}
            {sceneId==='memory-family-roles'&&<div className="a05-gpu-controls">
              <strong>① 메모리 가족 선택</strong><div className="a05-control-buttons">
                {(['DDR/RDIMM','GDDR6','GDDR7','HBM'] as const).map(f=>action(f,()=>memoryFamily(f),state.family===f))}
              </div><strong>② 설치 위치 별도 선택</strong><div className="a05-control-buttons">
                {action('CPU DIMM',()=>memorySite('cpu-dimm'),state.site==='cpu-dimm')}
                {action('GPU 보드',()=>memorySite('gpu-board'),state.site==='gpu-board')}
                {action('GPU 패키지',()=>memorySite('gpu-package'),state.site==='gpu-package')}
              </div>
              <button type="button" className="a05-primary" onClick={gradeMatch}>선택한 짝 검사하기</button>
              {matching&&<p className="a05-note" role="status">{matching}</p>}
              <p className="a05-note">먼저 가족과 위치를 각자 고른 다음 짝을 검사하세요. 정답 위치는 이 가족을 검사한 뒤에만 확인할 수 있습니다. 실제 메모리 지원은 제품마다 다릅니다.</p>
            </div>}
            {sceneId==='gddr-width-rate'&&<div className="a05-gpu-controls">
              <strong>핀당 전송률 / 이론 상한</strong><div className="a05-control-buttons">
                {action('24 Gb/s/pin',()=>rate(24),state.pinRate===24)}
                {action('32 Gb/s/pin',()=>rate(32),state.pinRate===32)}
              </div><strong>신호 레벨 모형</strong><div className="a05-control-buttons">
                {action('NRZ 2레벨',()=>change({...state,signal:'NRZ' as Signal},'NRZ'),state.signal==='NRZ')}
                {action('PAM3 3레벨',()=>change({...state,signal:'PAM3' as Signal},'PAM3'),state.signal==='PAM3')}
              </div>
              <strong>독립 계산 ① 128bit × 24Gb/s/pin ÷ 8 = ? GB/s</strong>
              <div className="a05-control-buttons">{([384,192,3072] as const).map(v=>action(v+' GB/s',()=>numericChoice(24,v),rateAnswers[24]===v))}</div>
              <strong>독립 계산 ② 128bit × 32Gb/s/pin ÷ 8 = ? GB/s</strong>
              <div className="a05-control-buttons">{([512,384,4096] as const).map(v=>action(v+' GB/s',()=>numericChoice(32,v),rateAnswers[32]===v))}</div>
              <p className="a05-note" role="status">{!numericUnlocked?
                '두 문제의 계산 결과를 직접 선택하세요. 오답을 고를 때는 계기판 숫자·음성을 공개하지 않습니다.':
                '두 계산을 확인했어요. 이제 이론 모형 계기판을 비교하고 답을 검증하세요.'}</p>
              </div>}
            {sceneId==='hbm-tradeoffs'&&<div className="a05-gpu-controls">
              <div className="a05-control-buttons">
                {action('GDDR GPU 보드',()=>topology('gddr-board'),state.topology==='gddr-board')}
                {action('HBM TSV 적층',()=>topology('hbm-stack'),state.topology==='hbm-stack')}
              </div>
              <button type="button" className="a05-primary" onClick={constraints}>열·제조·비용 제약 보기</button>
            </div>}
          </div>
          <div className="a05-box"><h3>관찰한 핵심은 무엇일까요?</h3>
            <div className="a05-choice-set">{story.answers.map(c=><button type="button" key={c.id}
              aria-pressed={answer===c.id} className={answer===c.id?'selected':''}
              onClick={()=>{setAnswer(c.id);setFeedback(null);setWhy(false);}}>{c.text}</button>)}</div>
            <button className="a05-primary" type="button" onClick={()=>{
              const r=assessGpu(sceneId,seen,answer);setFeedback(r);emit('answer.checked',{passed:r.passed});
            }}>조건별로 확인하기</button>
          </div>
        </>}
        <div className="a05-tools"><button type="button" onClick={()=>speak(story.speech)}>한국어 질문 듣기</button>
          {reveal&&<button type="button" disabled={hint===3} onClick={()=>{
            setHint(Math.min(3,hint+1));emit('hint.opened',{level:Math.min(3,hint+1)});
          }}>힌트 {hint}/3</button>}</div>
        {hint>0&&<div className="a05-hint">{story.hints.slice(0,hint).map((t,i)=><p key={i}>{i+1}. {t}</p>)}</div>}
        {feedback&&<section className="a05-result" role="status" aria-live="polite">
          <h3>{feedback.passed?'원리와 관찰을 연결했어요!':'빠진 조건이 있는지 살펴볼까요?'}</h3>
          {feedback.conditions.map(c=><p key={c.label}><strong>{c.passed?'✓':'△'} {c.label}</strong> — {c.passed?'확인했어요.':c.help}</p>)}
          {!feedback.passed&&<p>{story.answers.find(x=>x.id===answer)?.correction}</p>}
          <button type="button" onClick={()=>speak(feedback.passed?story.next:feedback.conditions.filter(c=>!c.passed).map(c=>c.help).join(' '))}>피드백 듣기</button>
          <button type="button" onClick={()=>setWhy(!why)}>{why?'원리 접기':'왜? 원리 보기'}</button>
        </section>}
        {why&&feedback&&<div className="a05-why"><h3>왜 그럴까요?</h3><p>{story.why}</p>
          {feedback.passed&&<p className="a05-next">{story.next}</p>}</div>}
        {feedback?.passed&&index<3&&<button type="button" className="a05-primary" onClick={()=>enter(index+1)}>다음 질문으로 →</button>}
        {feedback?.passed&&index===3&&<div className="a05-why"><p className="a05-next">{story.next}</p><p>A02 앱 통합은 별도입니다.</p></div>}
      </section>
      <section className="a05-canvas-col" aria-label="2.5D GPU 메모리 인터랙티브 시각화">
        <div className="a05-canvas-header"><span>LIVE GPU 2.5D · G03</span><span>{sceneRevealed?'관찰':'정답 계산 전 — 수치 은닉'}</span></div>
        <GpuSceneVisual sceneId={sceneId} state={state} revealed={sceneRevealed} familyMatchChecked={matching!==null}/>
        <div className="a05-model-limit"><strong>모형 범위</strong> {sceneId==='memory-family-roles'&&matching===null?'대표적인 CPU·GPU 메모리 배치를 단순화한 교육용 모형입니다. 선택한 가족을 검사한 후 예시 위치를 확인하세요.':story.assumptions}</div>
        <div className="a05-source">A06 PR #7 G03 스토리보드 / A05 직접 구현 / 공인 제품 수치 아님</div>
      </section>
    </main>
  </div>;
}
