import {useState} from 'react';
import {SramSceneVisual} from './SramSceneVisual';
import {assessSram,sramSceneOrder,transitionSramCell,simulateLru} from './sramModel';
import type {Bit,SramEvent,SramFeedback,SramSceneId} from './sramModel';
import type {SramVisualState} from './SramSceneVisual';
import '../a05Scenes.css';
import './sramScenes.css';

type Choice={id:string;text:string;whyWrong?:string};
type Story={
  title:string;hook:string;question:string;prediction:string;
  predictions:Choice[];prompt:string;answers:Choice[];
  hints:readonly [string,string,string];why:string;nextHook:string;speech:string;assumptions:string;
};
const LESSON:Record<SramSceneId,Story>={
  'sram-cross-coupled-inverters':{
    title:'두 개의 NOT을 연결하면 무엇을 기억할까요?',
    hook:'MOSFET을 조합해 만든 CMOS NOT 게이트 두 개를 서로 마주 보게 연결했어요.',
    question:'Q=1, Q̅=0을 만든 뒤 입력을 떼면 얼마나 버틸까요?',
    prediction:'상호 피드백과 전원이 모두 있다면 무슨 일이 생길까요?',
    predictions:[{id:'stable',text:'상보적인 두 상태 중 하나를 유지해요.'},{id:'both',text:'출력이 둘 다 1이 돼요.'}],
    prompt:'전원·되먹임 ON 상태에서 Q=0과 1을 비교한 뒤, 전원을 꺼 보세요.',
    answers:[
      {id:'volatile-feedback',text:'상보 상태는 전원과 양방향 피드백이 있어야 안정하며, 전원 OFF면 휘발해요.'},
      {id:'single-inverter',text:'NOT 게이트 하나만으로 모든 입력을 떼어도 영구 저장돼요.',whyWrong:'단일 인버터는 외부 입력을 반전하며, 안정 저장에는 교차 피드백이 필요해요.'},
      {id:'both-high',text:'정상 SRAM은 Q와 Q̅가 둘 다 1인 상태를 보관해요.',whyWrong:'두 인버터의 출력은 이상적으로 서로 반대 값이에요.'},
      {id:'nonvolatile',text:'SRAM은 전원을 꺼도 데이터가 영원히 남아요.',whyWrong:'SRAM은 휘발성이고 DRAM처럼 전원 공급이 필요해요.'},
    ],
    hints:['출력이 반대 인버터 입력에 다시 들어간다는 점을 보세요.','Q가 1이라면 반대편 Q̅는 무엇일까요?','전원 공급 없이 CMOS가 상태를 유지할 수 있을까요?'],
    why:'두 CMOS 인버터를 서로 교차 연결하면 Q와 Q̅가 상보인 두 안정 상태를 만들 수 있어요. 정적 상태에서는 DRAM처럼 주기적으로 셀을 리프레시하지 않지만 전원은 필요합니다. 되먹임 OFF의 순간적인 아날로그 보존은 이 논리 장면에서 보장하지 않아요.',
    nextHook:'저장된 비트를 바깥에서 읽거나 바꾸려면 어떤 스위치가 필요할까요?',
    speech:'두 인버터를 마주 연결했어요. 전원을 껐다 켜면 저장된 숫자가 어떻게 될지 직접 예상해 보세요.',
    assumptions:'이상화된 전원·CMOS 상보 래치, 전원 OFF 데이터는 불확정 표시; 정확한 메타안정성/누설 생략',
  },
  'sram-6t-access':{
    title:'기억을 꺼내려면 문이 몇 개 필요할까요?',
    hook:'마주 연결된 인버터 두 개에 BL, BLB의 양쪽 출입문을 더해 보세요.',
    question:'WL OFF에서 BL을 바꿔도 셀이 덮어써질까요?',
    prediction:'외부 쓰기 드라이버가 셀에 닿지 않으면 어떻게 될까요?',
    predictions:[{id:'hold',text:'워드라인이 닫히면 저장값이 유지돼요.'},{id:'overwrite',text:'BL만 바꾸면 언제나 셀이 바뀌어요.'}],
    prompt:'WL OFF·BL1 격리 → WL ON 쓰기 → READ 모드로 변경해 관찰하세요.',
    answers:[
      {id:'four-plus-two',text:'6T는 4T 교차 인버터 래치와 2T 접근 소자이고, 읽기는 교란 위험이 있어요.'},
      {id:'one-cap',text:'6T SRAM은 DRAM처럼 커패시터 1개에만 저장해요.',whyWrong:'6T 래치는 4개 트랜지스터 인버터와 2개 접근 트랜지스터예요. 1T1C DRAM과 달라요.'},
      {id:'wl-off',text:'WL=0에서도 BL이 바뀌면 Q가 반드시 바뀌어요.',whyWrong:'접근 트랜지스터 두 개는 WL이 켜져야 BL/BLB를 래치에 연결해요.'},
      {id:'perfect-read',text:'실제 SRAM 읽기는 언제나 완전 비파괴라 교란 가능성이 없어요.',whyWrong:'읽기 시 셀과 BL 연결로 내부 노드 전압이 변하며 read disturb/잡음 여유를 검토해야 해요.'},
    ],
    hints:['CMOS 인버터 둘에는 nMOS/pMOS가 모두 몇 개 있나요?','WL로 제어하는 접근 스위치는 양쪽에 각각 하나예요.','읽기 전압 교란 가능성과 1T1C 전하 공유를 구별해요.'],
    why:'대표 6T SRAM 셀은 4T로 된 두 교차 CMOS 인버터와 2T 접근 nMOS를 가집니다. 쓰기에서는 외부 BL/BLB 구동이 래치 상태를 바꾸고, 읽기 안정성은 소자 크기/잡음 여유에 의존해요. 이 장면은 안정 동작의 논리적 근사입니다.',
    nextHook:'이 비싸고 빠른 셀을 CPU 옆에 조금만 둔다면 무슨 이득이 있을까요?',
    speech:'비트라인과 워드라인을 바꿔 보세요. 어느 조작에서 저장된 비트가 달라지는지 예상해 볼까요?',
    assumptions:'6T=4T+2T 이상화 안정 논리; 쓰기 assist·precharge·sense margins·read disturb 실제 전압 비정량',
  },
  'cpu-cache-vs-dram':{
    title:'CPU는 왜 작은 SRAM 캐시를 좋아할까요?',
    hook:'같은 A를 여러 번 요청하는데 매번 먼 DRAM까지 걸어가는 건 낭비겠죠?',
    question:'1라인과 2라인 LRU 캐시에서 같은 A,A,B,A,C 요청의 비용은?',
    prediction:'라인을 하나에서 두 개로 늘리면 어떤 차이가 날까요?',
    predictions:[{id:'some',text:'재사용 기회가 늘어 작업에 따라 유리해져요.'},{id:'always2x',text:'항상 처리 속도가 정확히 2배 빨라져요.'}],
    prompt:'1라인, 2라인 각각 LRU 실험을 실행해 히트/미스와 누적 toy 시간 41/32를 비교해 보세요.',
    answers:[
      {id:'reuse-not-twice',text:'A의 재사용 덕분에 41→32 toy 단위지만, 캐시 2배가 항상 성능 2배는 아니에요.'},
      {id:'infinite',text:'캐시에는 모든 데이터를 무제한 저장할 수 있어요.',whyWrong:'캐시는 크기·전력·면적 제약이 있어 미스가 발생해요.'},
      {id:'twice',text:'캐시 라인 2개면 어떤 프로그램도 무조건 두 배 빨라요.',whyWrong:'적중 패턴과 miss 페널티에 따라 달라져요. 이 예도 41→32이지 20.5가 아니에요.'},
      {id:'same-cost',text:'히트와 DRAM 미스는 항상 지연이 같아요.',whyWrong:'toy 가정은 hit=1, miss=10; 실제 계층별 지연은 하드웨어·부하에 따라 달라요.'},
    ],
    hints:['캐시에 남아 있는 A를 다시 읽으면 어디로 갈까요?','1라인에 B가 들어오면 A는 남을까요?','여기서 시간 숫자는 실제 CPU ns가 아니라 가상 단위예요.'],
    why:'LRU 가상 실험: 1라인에서는 A(miss),A(hit),B(miss),A(miss),C(miss)로 41 toy 단위. 2라인은 A(miss),A(hit),B(miss),A(hit),C(miss)로 32 toy 단위. hit=1/miss=10을 총 비용으로 가정하며 실제 CPU 지연/캐시 정책과 다를 수 있어요.',
    nextHook:'CPU와 GPU는 어떤 데이터를 더 가까이 놓아야 할까요?',
    speech:'A를 반복해서 읽는 데 캐시가 얼마나 도움 될까요? 한 줄과 두 줄을 비교해 보세요.',
    assumptions:'요청 A,A,B,A,C / LRU 1·2라인 / hit1·miss10 가상 단위, 실제 ns/메모리 성능 아님',
  },
  'cpu-to-gpu-data-locality':{
    title:'AI 모델을 매 토큰 SSD에서 다시 읽을까요?',
    hook:'모델 가중치를 GPU 메모리에 이미 실었다면 다음 추론은 어떤 데이터를 읽어야 할까요?',
    question:'GPU 모델 상주와 새로운 입력 데이터 이동은 같은 일일까요?',
    prediction:'모델 상주 시에도 무엇이 계속 움직일까요?',
    predictions:[{id:'input',text:'새 입력과 활성값/출력은 이동해요.'},{id:'nothing',text:'가중치와 입력 모두 이동하지 않아요.'}],
    prompt:'모델을 GPU에 상주/미상주로 바꾸어 경로를 비교하고 새 입력 1회를 전달해 보세요.',
    answers:[
      {id:'weights-vs-input',text:'GPU에 가중치가 상주하면 전량 재로딩은 줄지만 새 입력/활성값 이동은 남아요.'},
      {id:'per-token',text:'모든 추론 토큰에서 SSD 모델 전체를 반드시 새로 읽어요.',whyWrong:'모델이 GPU DRAM에 상주하면 매 토큰 SSD 전체 로딩이 필수는 아니에요.'},
      {id:'same-memory',text:'CPU SRAM 캐시와 GPU HBM은 물리 저장 방식도 역할도 같아요.',whyWrong:'SRAM 캐시와 HBM의 DRAM 저장 및 목적·비용·용량은 다릅니다.'},
      {id:'no-input',text:'모델이 상주하면 사용자 입력조차 전혀 전달되지 않아요.',whyWrong:'새 입력·중간 활성값·출력은 해당 데이터 경로를 계속 지나갑니다.'},
    ],
    hints:['모델 가중치와 새 사용자 요청 중 무엇이 이미 저장돼 있나요?','GPU 내부에도 SRAM 캐시와 GDDR/HBM DRAM 계층이 있어요.','일부 플랫폼은 CPU/GPU 통합 메모리를 공유하므로 경로가 다를 수 있어요.'],
    why:'대표적인 분리형 GPU 플랫폼에서는 CPU와 GPU 각각의 캐시/DRAM 및 연결을 사용합니다. 모델이 GPU 장치 DRAM에 상주한다면 같은 가중치 전체를 매 토큰 SSD에서 읽을 필요가 없지만, 신규 입력과 활성값은 이동해요. CPU/GPU가 메모리를 공유하는 설계도 있으므로 그림은 보편 제품 구조가 아닙니다.',
    nextHook:'연산은 준비됐지만 GPU로 데이터가 늦게 온다면, GDDR/HBM 대역폭이 왜 중요할까요?',
    speech:'GPU 메모리에 가중치를 이미 둔다면 저장소까지 계속 왕복할까요? 새 입력은 여전히 들어와야겠죠.',
    assumptions:'개별 GPU+호스트 DDR/eSSD 대표 경로 · 전송량·대역폭 실측 아님 · 통합 메모리 대안 존재',
  },
};
function fresh():SramVisualState{return {q:0,feedback:true,supply:true,wl:0,bl:0,mode:'write',cacheLines:1,cacheRan:false,resident:false,inputCount:0};}
export interface SramLabProps{onEvent?:(e:SramEvent)=>void;onSpeech?:(id:SramSceneId,text:string)=>void;}
export function SramSceneLab({onEvent,onSpeech}:SramLabProps){
  const [step,setStep]=useState(0),id=sramSceneOrder[step],story=LESSON[id];
  const [state,setState]=useState<SramVisualState>(fresh);
  const [prediction,setPrediction]=useState<string|null>(null);
  const [answer,setAnswer]=useState<string|null>(null);
  const [seen,setSeen]=useState<string[]>([]);
  const [hint,setHint]=useState(0);
  const [result,setResult]=useState<SramFeedback|null>(null);
  const [why,setWhy]=useState(false);
  function event(type:SramEvent['type'],payload?:SramEvent['payload']){onEvent?.({sceneId:id,type,payload});}
  function observe(fact:string){setSeen(xs=>xs.includes(fact)?xs:[...xs,fact]);}
  function update(next:SramVisualState,label:string){
    setState(next);setResult(null);setWhy(false);event('parameter.changed',{label});
  }
  function advance(i:number){
    if(i<0||i>=sramSceneOrder.length)return;
    setStep(i);setState(fresh());setPrediction(null);setAnswer(null);setSeen([]);setHint(0);setResult(null);setWhy(false);
    onEvent?.({sceneId:sramSceneOrder[i],type:'scene.enter'});
  }
  function q(value:Bit){
    // Manual Q choice is an explicit initialization; power-on alone NEVER resurrects the old bit.
    if(!state.feedback||!state.supply)return;
    update({...state,q:value},'Q initialized '+value);
    observe(value?'q1':'q0');
  }
  function setSupply(value:boolean){
    update({...state,supply:value,q:value?state.q:null},'VDD '+value);
    if(!value)observe('volatile');
  }
  function setFeedback(value:boolean){
    update({...state,feedback:value,q:value?state.q:null},'feedback '+value);
  }
  function setBl(value:Bit){
    const next=transitionSramCell(state,{type:'bl',value});
    update({...state,...next},'BL '+value);
    if(state.wl===0&&value!==state.q)observe('isolated');
    if(next.wl===1&&next.mode==='write')observe('wrote');
  }
  function setWl(value:Bit){
    const next=transitionSramCell(state,{type:'wl',value});
    update({...state,...next},'WL '+value);
    if(value===1&&next.mode==='write')observe('wrote');
    if(value===1&&next.mode==='read')observe('read');
  }
  function setMode(mode:'read'|'write'){
    const next=transitionSramCell(state,{type:'mode',value:mode});
    update({...state,...next},'mode '+mode);
    if(mode==='write'&&next.wl===1)observe('wrote');
    if(mode==='read'&&next.wl===1)observe('read');
  }
  function runCache(){
    const report=simulateLru(state.cacheLines);
    update({...state,cacheRan:true},'LRU '+state.cacheLines+' lines');
    observe(state.cacheLines===1?'one':'two');
    event('parameter.changed',{total:report.total});
  }
  function setResident(resident:boolean){
    update({...state,resident},'resident '+resident);
    observe(resident?'resident':'not-resident');
  }
  function sendInput(){
    update({...state,inputCount:state.inputCount+1},'input sample');
    observe('input');
  }
  function speak(text:string){event('voice.requested',{text});onSpeech?.(id,text);}
  const show=prediction!==null;
  const physicalReady=show&&assessSram(id,seen,null).conditions.slice(0,-1).every(c=>c.passed);
  const btn=(text:string,fn:()=>void,active:boolean)=>(
    <button type="button" aria-pressed={active} className={active?'selected':''} onClick={fn}>{text}</button>
  );
  return <div className="a05-lab a05-sram-lab" lang="ko">
    <header className="a05-head">
      <p className="a05-eyebrow">A05 · 2.5D DISCOVERY LAB / SRAM 05</p>
      <h1>CMOS 기억 → SRAM 6T → CPU 캐시 → GPU 데이터</h1>
      <p>먼저 예상하고 직접 조작한 뒤 그 이유를 설명해 보세요.</p>
      <nav className="a05-stepnav" aria-label="SRAM 레슨 순서">{sramSceneOrder.map((sid,i)=>
        <button key={sid} type="button" disabled={i>step} aria-current={i===step?'step':undefined}
          className={i===step?'active':''} onClick={()=>advance(i)}>{String(i+1).padStart(2,'0')}</button>)}</nav>
    </header>
    <main className="a05-stage">
      <section className="a05-copy" aria-label="실험 단계">
        <span className="a05-eyebrow">{id} · {step+1}/4</span>
        <h2>{story.title}</h2><p className="a05-hook">{story.hook}</p><p className="a05-question">{!show?story.question:physicalReady?'관찰한 상태를 바탕으로 원리 하나를 설명하세요.':'이제 실험 조작과 관찰에 집중해 보세요.'}</p>
        {!show&&<div className="a05-box"><h3>결과를 보기 전에 예상하기</h3><p>{story.prediction}</p>
          <div className="a05-choice-set">{story.predictions.map(c=><button key={c.id} type="button"
            disabled={show} className={prediction===c.id?'selected':''} aria-pressed={prediction===c.id}
            onClick={()=>{setPrediction(c.id);event('prediction.recorded',{choice:c.id});}}>{c.text}</button>)}</div>
        </div>}
        {show&&!physicalReady&&<div className="a05-box a05-sram-experiment-guidance" role="status">2.5D 장면 바로 아래의 실험 조작에서 상태를 비교해 보세요. 조건을 확인하면 원리 질문으로 넘어갑니다.</div>}
        {physicalReady&&!result?.passed&&<div className="a05-box"><h3>관찰한 원리 설명하기</h3>
            <div className="a05-choice-set">{story.answers.map(c=><button key={c.id} type="button"
              className={answer===c.id?'selected':''} aria-pressed={answer===c.id}
              onClick={()=>{setAnswer(c.id);setResult(null);setWhy(false);}}>{c.text}</button>)}</div>
            <button type="button" className="a05-primary" onClick={()=>{
              const next=assessSram(id,seen,answer);setResult(next);event('answer.checked',{passed:next.passed});
            }}>조건별로 결과 확인</button>
          </div>}
        <div className="a05-tools"><button type="button" onClick={()=>speak(story.speech)}>한국어 질문 듣기</button>
          {show&&<button type="button" disabled={hint===3} onClick={()=>{
            setHint(Math.min(3,hint+1));event('hint.opened',{level:Math.min(3,hint+1)});
          }}>힌트 {hint}/3</button>}
        </div>
        {hint>0&&<div className="a05-hint">{story.hints.slice(0,hint).map((t,i)=><p key={i}>{i+1}. {t}</p>)}</div>}
        {result&&<section className="a05-result" role="status" aria-live="polite">
          <h3>{result.passed?'현상과 이유를 연결했어요!':'어느 조건을 놓쳤는지 살펴볼까요?'}</h3>
          {result.conditions.map(c=><p key={c.label}><strong>{c.passed?'✓':'△'} {c.label}</strong> — {c.passed?'직접 관찰하거나 답했어요.':c.help}</p>)}
          {!result.passed&&<p>{story.answers.find(x=>x.id===answer)?.whyWrong}</p>}
          <button type="button" onClick={()=>speak(result.passed?story.nextHook:result.conditions.filter(c=>!c.passed).map(c=>c.help).join(' '))}>피드백 듣기</button>
          {result.passed&&<button type="button" onClick={()=>setWhy(!why)}>{why?'원리 접기':'왜? 원리 보기'}</button>}
        </section>}
        {why&&result?.passed&&<div className="a05-why"><h3>왜 그럴까요?</h3><p>{story.why}</p>
          {result.passed&&<p className="a05-next">{story.nextHook}</p>}</div>}
        {result?.passed&&step<3&&<button type="button" className="a05-primary" onClick={()=>advance(step+1)}>다음 질문으로 →</button>}
        {result?.passed&&step===3&&<div className="a05-why"><p className="a05-next">{story.nextHook}</p>
          <p>샘플 실험은 A02 Lesson Engine/영구 진도와 아직 통합되지 않았습니다.</p></div>}
      </section>
      <section className="a05-canvas-col" aria-label="실시간 2.5D SRAM 그래픽">
        <div className="a05-canvas-header"><span>LIVE 2.5D · SRAM/CACHE</span><span>{show?'관찰 가능':'예측 먼저'}</span></div>
        <SramSceneVisual sceneId={id} state={state} revealed={show}/>
        {show&&<div className="a05-sram-experiment-dock" data-testid="a08-sram-experiment-dock" role="region" aria-label="실험 조작"><h3>실험 조작 · 직접 조작하기</h3><p>{story.prompt}</p>
            {id==='sram-cross-coupled-inverters'&&<div className="a05-sram-controls">
              <strong>교차 인버터 (Q와 Q̅)</strong><div className="a05-control-buttons">
                {btn('Q = 0',()=>q(0),state.q===0)}{btn('Q = 1',()=>q(1),state.q===1)}
              </div><p className="a05-note">전원 OFF 후 ON은 이전 Q를 복원하지 않아요. Q=?인 경우 전원과 되먹임을 켜고 Q=0/1로 명시적으로 초기화하세요.</p><div className="a05-control-buttons">
                {btn('피드백 ON',()=>setFeedback(true),state.feedback)}
                {btn('피드백 OFF',()=>setFeedback(false),!state.feedback)}
              </div><div className="a05-control-buttons">
                {btn('전원 ON',()=>setSupply(true),state.supply)}{btn('전원 OFF',()=>setSupply(false),!state.supply)}
              </div>
            </div>}
            {id==='sram-6t-access'&&<div className="a05-sram-controls">
              <strong>BL · 상보 BLB</strong><div className="a05-control-buttons">
                {btn('BL 0 / BLB 1',()=>setBl(0),state.bl===0)}{btn('BL 1 / BLB 0',()=>setBl(1),state.bl===1)}
              </div><strong>WL · 접근</strong><div className="a05-control-buttons">
                {btn('WL OFF',()=>setWl(0),state.wl===0)}{btn('WL ON',()=>setWl(1),state.wl===1)}
              </div><strong>드라이버 동작</strong><div className="a05-control-buttons">
                {btn('WRITE',()=>setMode('write'),state.mode==='write')}{btn('READ',()=>setMode('read'),state.mode==='read')}
              </div>
              <p className="a05-note">READ는 저장 Q의 논리값만 관찰합니다. 실제 BL 전압/읽기 교란의 양은 모델링하지 않았어요.</p>
            </div>}
            {id==='cpu-cache-vs-dram'&&<div className="a05-sram-controls">
              <strong>캐시 크기 변경 후 LRU 실행</strong><div className="a05-control-buttons">
                {btn('1라인 SRAM',()=>update({...state,cacheLines:1,cacheRan:false},'cache 1'),state.cacheLines===1)}
                {btn('2라인 SRAM',()=>update({...state,cacheLines:2,cacheRan:false},'cache 2'),state.cacheLines===2)}
              </div><button type="button" className="a05-primary" onClick={runCache}>A,A,B,A,C LRU 실행</button>
              <p className="a05-note">hit=1, miss=10 toy 시간 · 실제 CPU ns, 주파수, 측정 성능과 다름</p>
            </div>}
            {id==='cpu-to-gpu-data-locality'&&<div className="a05-sram-controls">
              <strong>GPU 모델 가중치 상태</strong><div className="a05-control-buttons">
                {btn('미상주 · 모델 로드',()=>setResident(false),!state.resident)}
                {btn('상주 · 가중치 재사용',()=>setResident(true),state.resident)}
              </div><button type="button" className="a05-primary" onClick={sendInput}>새 입력 전달하기 ({state.inputCount}회)</button>
              <p className="a05-note">모델 상주와 무관하게 사용자 입력과 중간 데이터는 이동합니다.</p>
            </div>}
          </div>}
        <div className="a05-model-limit"><strong>모델 가정</strong> {story.assumptions}</div>
        <div className="a05-source">A06 PR #7 레슨 05 교차 참조 · A05 모델/장면 · A02 별도 인계</div>
      </section>
    </main>
  </div>;
}
