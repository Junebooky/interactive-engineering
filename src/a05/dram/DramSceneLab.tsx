import { useState } from 'react';
import { DramSceneVisual } from './DramSceneVisual';
import {
  dramEvaluate, dramSceneOrder, leakageVoltage, shareCharge, writeCell,
} from './dramModel';
import type { Bit, DramEvent, DramFeedback, DramPhase, DramSceneId } from './dramModel';
import type { DramVisualState } from './DramSceneVisual';
import '../a05Scenes.css';
import './dramScenes.css';

type Choice = { id: string; text: string; misconception?: string };
type Story = {
  title: string; hook: string; question: string; prediction: string; choices: Choice[];
  prompt: string; answers: Choice[]; hints: readonly [string, string, string];
  why: string; nextHook: string; speech: string; assumption: string;
};
const STORY: Record<DramSceneId, Story> = {
  'dram-write': {
    title: '스위치 하나로 1비트를 담을 수 있을까요?',
    hook: '작은 커패시터 하나에 전하를 담으면 잠깐 기억이 될까요?',
    question: '비트라인에 1을 넣고 워드라인을 열면 무엇이 바뀔까요?',
    prediction: 'WL이 꺼져 있을 때 BL만 1로 바꾸면 셀이 충전될까요?',
    choices: [{id:'stay',text:'아니요, WL이 닫혀 있으면 셀은 그대로예요.'},{id:'charge',text:'네, BL을 올리기만 해도 충전돼요.'}],
    prompt: 'BL=1 → WL ON → WL OFF → BL=0 순서로 실험해 보세요.',
    answers: [
      {id:'isolated',text:'WL OFF일 땐 셀이 비트라인과 분리되어 저장 전압을 잠시 유지해요.'},
      {id:'off-writes',text:'WL을 닫아도 BL만 바꾸면 셀에 바로 쓰여요.',misconception:'접근 nMOS가 차단되면 BL의 변화는 이상화된 셀에 전달되지 않아요.'},
      {id:'generates',text:'커패시터가 전기를 계속 생산해서 기억해요.',misconception:'전하를 저장하는 것이지 새 에너지를 만드는 장치가 아니에요.'},
      {id:'always-perfect',text:'모든 실제 DRAM의 1은 언제나 정확히 VDD예요.',misconception:'쓰기 손실, 셀 산포·누설 등 실제 마진이 있어요. 이 그림은 정규화 모형이에요.'},
    ],
    hints:['WL은 어떤 트랜지스터의 게이트에 이어져 있을까요?','WL OFF일 때 BL과 셀이 연결되어 있나요?','실제 소자의 저장 전압은 조금씩 달라질 수 있어요.'],
    why:'대표적인 DRAM 1T1C는 접근 트랜지스터(1T)와 커패시터(1C)를 사용해요. WL ON에서 BL 전압을 셀에 쓰며, OFF에서는 회로가 분리되어 잠시 유지됩니다. 전원 중단 후 영구 보존되지는 않아요.',
    nextHook:'저장된 1을 읽으면 전하가 그대로 남아 있을까요?',
    speech:'비트라인에 1을 놓고 워드라인을 열어볼까요? 닫은 뒤에도 셀에 남아 있나요?',
    assumption:'VDD를 1로 정규화한 이상적인 1T1C · 쓰기 부스트, 접근 소자 손실, 산포는 생략',
  },
  'dram-sense-restore': {
    title:'읽기만 했는데 전하가 옅어질까요?',
    hook:'읽기 과정에서 아주 작은 셀의 전하가 큰 비트라인으로 나뉠 수 있어요.',
    question:'작은 ±ΔV를 분명한 논리 0 또는 1로 어떻게 판단할까요?',
    prediction:'BL을 0.5×VDD로 사전충전했을 때 1을 읽으면 BL이 어느 쪽으로 변할까요?',
    choices:[{id:'plus',text:'0.5보다 조금 높아져요.'},{id:'minus',text:'0.5보다 조금 낮아져요.'},{id:'unchanged',text:'절대 변하지 않아요.'}],
    prompt:'비트 선택 → 사전충전 → 전하 공유 → 감지 증폭 → 셀 복원을 차례로 실행해 보세요.',
    answers:[
      {id:'restore',text:'전하 공유로 셀 상태가 흔들려서 센스앰프가 증폭한 뒤 다시 복원해요.'},
      {id:'untouched',text:'읽어도 셀의 전하는 조금도 달라지지 않아요.',misconception:'비트라인과 연결되는 순간 전하 공유가 일어나 셀 전압도 변해요.'},
      {id:'random',text:'센스앰프가 임의의 0/1을 만들어 저장해요.',misconception:'센스앰프는 원래 저장된 정보에 따른 작은 차이를 증폭해요.'},
      {id:'large',text:'처음 생기는 BL 미세 변화는 이미 완전한 0/1 전압이에요.',misconception:'처음 변화는 작은 ±ΔV이고 센스앰프가 논리 레벨로 키웁니다.'},
    ],
    hints:['BL이 0.5, 셀이 1 또는 0이면 서로 연결할 때 전하가 어디로 갈까요?','아주 작은 차이를 크게 키워주는 회로는 뭘까요?','감지만 하고 끝내면 셀에는 어떤 전압이 남아 있을까요?'],
    why:'교육용 Ccell:Cbitline=1:9, BL 프리차지 0.5×VDD에서 공유 전압은 (Cc×Vcell+Cb×0.5)/(Cc+Cb)로 0.55 또는 0.45입니다. 센스앰프가 작은 차이를 증폭해 0/1로 판단하고 셀 값을 재기록합니다. 실제 지연·전압·노이즈는 다릅니다.',
    nextHook:'읽지 않아도 전하가 서서히 샌다면 어떤 장치가 필요할까요?',
    speech:'전압이 아주 조금만 움직이네요. 이 작은 차이를 증폭한 다음 다시 셀에 써 볼까요?',
    assumption:'정규화 VDD=1 · BL 사전충전 0.5 · Cc:Cb=1:9 · ΔV=±0.05 가상, 실제 DRAM 감지 전압 아님',
  },
  'dram-leak-refresh': {
    title:'기억이 시간이 지나며 흐릿해진다면?',
    hook:'전원이 켜져 있어도 커패시터의 전하는 조금씩 샐 수 있어요.',
    question:'저장된 1의 전하가 감소하는데 어떻게 비트를 보존할까요?',
    prediction:'시간이 지나면 읽기 여유는 어떻게 될까요?',
    choices:[{id:'shrink',text:'전압 여유가 줄어들어요.'},{id:'same',text:'전원만 켜져 있으면 항상 같아요.'}],
    prompt:'가상 시간 0에서 1 이상으로 올린 뒤, 리프레시 버튼으로 다시 충전해 보세요.',
    answers:[
      {id:'leak',text:'누설로 전압 여유가 줄어들기 전에 주기적으로 재충전해야 해요.'},
      {id:'power',text:'전원이 켜져 있으면 DRAM 전하 누설은 완전히 0이에요.',misconception:'전원 공급이 있어도 저장 전하는 누설돼서 주기적 복원이 필요해요.'},
      {id:'flash',text:'리프레시는 NAND 쓰기 마모 관리와 같은 작업이에요.',misconception:'DRAM 리프레시와 플래시의 wear leveling은 다른 이유와 메커니즘이에요.'},
      {id:'same-clock',text:'모든 실제 DRAM 셀은 정확히 똑같은 누설률과 주기예요.',misconception:'온도, 셀 분포, 제품 정책에 따라 값은 달라요. 시간축은 가상 단위예요.'},
    ],
    hints:['커패시터는 완전히 밀폐된 전하 저장소일까요?','저장 전압이 약해지면 센스앰프가 구별하기 쉬울까요?','제품·온도마다 누설과 리프레시가 달라질 수 있어요.'],
    why:'실제 DRAM은 저장 전하가 점차 누설되므로 판독 마진이 충분할 때 데이터를 다시 쓰는 리프레시가 필요해요. 여기서는 셀 1의 정규화 전압을 q=max(0,1−0.2×가상 경과시간)으로 단순화합니다. 시간은 ms가 아닙니다.',
    nextHook:'이런 셀이 많다면 주소별로 접근을 어떻게 나눠야 할까요?',
    speech:'가상 시간 슬라이더를 옮겨볼까요? 전하가 줄어든 뒤 리프레시하면 어떻게 될까요?',
    assumption:'시간축 0–2는 가상 단위(ms 아님) · 누설률 0.2/단위 · 리프레시/보존 시점 단순화',
  },
  'dram-row-bank': {
    title:'요청 두 개를 동시에 처리할 수 있을까요?',
    hook:'메모리로 들어오는 두 요청이 같은 뱅크에 몰리면 대기할 수도 있어요.',
    question:'뱅크를 둘로 나누면 대기줄이 언제 짧아질까요?',
    prediction:'A와 B가 서로 다른 뱅크에서 작업할 때 어떻게 될까요?',
    choices:[{id:'can-overlap',text:'일부 내부 작업은 겹쳐 수행할 수 있어요.'},{id:'always-twice',text:'모든 경우 실제 대역폭이 무조건 2배가 돼요.'}],
    prompt:'1 뱅크에서 직렬 처리 → 2 뱅크에서 겹치는 타임라인을 비교하세요.',
    answers:[
      {id:'conditional',text:'서로 다른 뱅크라면 내부 처리가 겹칠 수 있지만 공용 버스 제약은 남아요.'},
      {id:'twice',text:'뱅크가 두 배면 어떤 데이터라도 항상 정확히 두 배 빨라요.',misconception:'공유 데이터 버스·컨트롤러·타이밍·뱅크 충돌이 있어서 단정할 수 없어요.'},
      {id:'capacity',text:'메모리 용량 GB와 전송률 GB/s는 같은 단위예요.',misconception:'GB는 용량, GB/s는 초당 전송량입니다.'},
      {id:'constant-latency',text:'모든 DRAM 접근 시간은 항상 동일해요.',misconception:'행 버퍼 적중, 뱅크 상태, 리프레시, 스케줄링에 따라 지연은 변해요.'},
    ],
    hints:['A와 B가 같은 내부 뱅크 자원을 쓰면 어떤 일이 생길까요?','다른 뱅크라도 밖으로 나가는 버스는 공유할 수 있어요.','GB와 GB/s의 뜻을 각각 말해 볼까요?'],
    why:'이 모델에서는 각 뱅크 내부 처리에 가상 2 슬롯이 필요하다고 가정해요. 같은 뱅크는 A:0–2, B:2–4; 두 뱅크는 각각 0–2에 내부 동작이 겹쳐요. 실제 메모리 트래픽/전송/타이밍에서 2배 성능을 보장하지 않아요.',
    nextHook:'GPU 연산기가 많은데 DRAM이 데이터를 제때 공급하지 못한다면?',
    speech:'뱅크를 둘로 나눠볼까요? 어떤 요청은 더 일찍 시작하지만 공용 길은 여전히 있겠죠?',
    assumption:'요청 A/B 각 2개 가상 슬롯 · 1/2 bank · 데이터 버스/실제 tRCD·tRP·tRFC는 제외',
  },
};

function fresh(): DramVisualState {
  return { wl:0, bl:0, cell:0, bit:1, phase:'precharge', elapsed:0, refreshAt:null, banks:1 };
}
export type DramLabProps = {
  onEvent?: (event: DramEvent) => void;
  onSpeech?: (sceneId: DramSceneId, speechText: string) => void;
};
export function DramSceneLab({onEvent,onSpeech}: DramLabProps) {
  const [index,setIndex] = useState(0);
  const sceneId = dramSceneOrder[index], story = STORY[sceneId];
  const [prediction,setPrediction] = useState<string | null>(null);
  const [answer,setAnswer] = useState<string | null>(null);
  const [state,setState] = useState<DramVisualState>(fresh);
  const [observed,setObserved] = useState<string[]>([]);
  const [feedback,setFeedback] = useState<DramFeedback | null>(null);
  const [hint,setHint] = useState(0);
  const [why,setWhy] = useState(false);

  function event(type:DramEvent['type'],payload?:DramEvent['payload']) {
    onEvent?.({sceneId,type,payload});
  }
  function facts(id:string) { setObserved(previous=>previous.includes(id)?previous:[...previous,id]); }
  function mutate(next:DramVisualState, action:string) {
    setState(next);
    setFeedback(null);setWhy(false);
    event('parameter.changed',{action});
  }
  function enter(i:number) {
    if (i < 0 || i >= dramSceneOrder.length) return;
    setIndex(i);setState(fresh());setPrediction(null);setAnswer(null);
    setObserved([]);setFeedback(null);setHint(0);setWhy(false);
    onEvent?.({sceneId:dramSceneOrder[i],type:'scene.enter'});
  }
  function bl(bit:Bit) {
    const next={...state,bl:bit,cell:writeCell(state.cell,bit,state.wl)};
    mutate(next,'bl '+bit);
    if (bit===0 && state.wl===0 && state.cell===1 && observed.includes('charged')) facts('held');
  }
  function wl(bit:Bit) {
    const next={...state,wl:bit,cell:writeCell(state.cell,state.bl,bit)};
    mutate(next,'wl '+bit);
    if(bit===1 && state.bl===1 && next.cell===1)facts('charged');
  }
  function phase(next:DramPhase) {
    const allowed:Record<DramPhase,DramPhase | null>={
      precharge:'shared',shared:'sensed',sensed:'restored',restored:null,
    };
    if(allowed[state.phase]!==next)return;
    mutate({...state,phase:next},'phase '+next);
    if(next==='shared')facts('shared');
    if(next==='sensed')facts('sensed');
    if(next==='restored')facts('restored');
    event('action.triggered',{phase:next});
  }
  function time(t:number) {
    mutate({...state,elapsed:t},'time '+t);
    if(t>=1 && leakageVoltage(t,state.refreshAt)<1)facts('leaked');
  }
  function refresh() {
    mutate({...state,refreshAt:state.elapsed},'refresh');
    if(observed.includes('leaked'))facts('refreshed');
    event('action.triggered',{action:'refresh'});
  }
  function bank(n:1|2) {
    mutate({...state,banks:n},'bank '+n);
    facts(n===1?'serial':'parallel');
  }
  function speak(value:string) {
    event('voice.requested',{value});
    onSpeech?.(sceneId,value);
  }
  const check=()=>{
    const next=dramEvaluate(sceneId,observed,answer);
    setFeedback(next);
    event('answer.checked',{passed:next.passed});
  };
  const changed = prediction!==null;
  const touchButton = (label:string, handler:()=>void, active=false)=>(
    <button type="button" aria-pressed={active} className={active?'selected':''} onClick={handler}>{label}</button>
  );
  return <div className="a05-lab a05-dram-lab" lang="ko">
    <header className="a05-head">
      <p className="a05-eyebrow">A05 · DRAM 2.5D DISCOVERY LAB / D02</p>
      <h1>DRAM 1T1C · 기억하고, 읽고, 다시 채우기</h1>
      <p>예상 → 직접 조작 → 관찰 → 원리 설명 → 다음 질문</p>
      <nav className="a05-stepnav" aria-label="DRAM 레슨 진행">
        {dramSceneOrder.map((id,i)=><button type="button" key={id} disabled={i>index}
          aria-current={i===index?'step':undefined} className={i===index?'active':''}
          onClick={()=>enter(i)}>{String(i+1).padStart(2,'0')}</button>)}
      </nav>
    </header>
    <main className="a05-stage">
      <section className="a05-copy" aria-label="실험 순서">
        <span className="a05-eyebrow">{sceneId} · STEP {index+1}/4</span>
        <h2>{story.title}</h2>
        <p className="a05-hook">{story.hook}</p><p className="a05-question">{story.question}</p>
        <div className="a05-box">
          <h3>먼저 예상해 보세요</h3><p>{story.prediction}</p>
          <div className="a05-choice-set">{story.choices.map(choice=><button type="button" key={choice.id}
            disabled={changed} aria-pressed={prediction===choice.id}
            className={prediction===choice.id?'selected':''}
            onClick={()=>{setPrediction(choice.id);event('prediction.recorded',{answer:choice.id});}}>
            {choice.text}</button>)}</div>
        </div>
        {changed && <>
          <div className="a05-box"><h3>직접 실험해 보기</h3><p>{story.prompt}</p>
            {sceneId==='dram-write' && <div className="a05-dram-control-grid">
              <div><strong>BL · 비트라인</strong><div className="a05-control-buttons">
                {touchButton('BL = 0',()=>bl(0),state.bl===0)}{touchButton('BL = 1',()=>bl(1),state.bl===1)}
              </div></div>
              <div><strong>WL · 워드라인</strong><div className="a05-control-buttons">
                {touchButton('WL OFF',()=>wl(0),state.wl===0)}{touchButton('WL ON',()=>wl(1),state.wl===1)}
              </div></div>
            </div>}
            {sceneId==='dram-sense-restore' && <>
              <div className="a05-dram-control-grid"><strong>셀 저장 비트 선택 (프리차지 단계)</strong>
                <div className="a05-control-buttons">
                  {touchButton('셀 0',()=>mutate({...state,bit:0},'cellBit 0'),state.bit===0)}
                  {touchButton('셀 1',()=>mutate({...state,bit:1},'cellBit 1'),state.bit===1)}
                </div>
              </div>
              <p className="a05-note">전하 공유 후 셀의 1과 BL의 전압이 모두 {shareCharge(1).sharedVoltage.toFixed(2)}로 옮겨가는 모습을 비교하세요.</p>
              <div className="a05-dram-actions">
                <button type="button" disabled={state.phase!=='precharge'} onClick={()=>phase('shared')}>1. 전하 공유 (WL ON)</button>
                <button type="button" disabled={state.phase!=='shared'} onClick={()=>phase('sensed')}>2. 센스앰프 활성화</button>
                <button type="button" disabled={state.phase!=='sensed'} onClick={()=>phase('restored')}>3. 셀 복원</button>
              </div>
            </>}
            {sceneId==='dram-leak-refresh' && <>
              <label className="a05-slider-label" htmlFor="a05-dram-time">가상 시간 <strong>{state.elapsed.toFixed(1)} (toy)</strong></label>
              <input type="range" id="a05-dram-time" min="0" max="2" step=".1"
                value={state.elapsed} onChange={e=>time(Number(e.target.value))}/>
              <button type="button" className="a05-primary" onClick={refresh}>셀 리프레시 (재충전)</button>
              <p className="a05-note">현재 전하: {leakageVoltage(state.elapsed,state.refreshAt).toFixed(2)} × 정규화 VDD. 단위는 밀리초가 아니에요.</p>
            </>}
            {sceneId==='dram-row-bank' && <div className="a05-control-buttons">
              {touchButton('1 뱅크 · 직렬',()=>bank(1),state.banks===1)}
              {touchButton('2 뱅크 · 부분 겹침',()=>bank(2),state.banks===2)}
            </div>}
          </div>
          <div className="a05-box"><h3>관찰한 원리는 무엇일까요?</h3>
            <div className="a05-choice-set">{story.answers.map(choice=><button type="button" key={choice.id}
              aria-pressed={answer===choice.id} className={answer===choice.id?'selected':''}
              onClick={()=>{setAnswer(choice.id);setFeedback(null);setWhy(false);}}>{choice.text}</button>)}</div>
            <button type="button" className="a05-primary" onClick={check}>조건별로 확인하기</button>
          </div>
        </>}
        <div className="a05-tools">
          <button type="button" onClick={()=>speak(story.speech)}>한국어 질문 듣기</button>
          {changed && <button type="button" disabled={hint>=3}
            onClick={()=>{setHint(Math.min(3,hint+1));event('hint.opened',{level:Math.min(3,hint+1)});}}>힌트 {hint}/3</button>}
        </div>
        {hint>0 && <div className="a05-hint" role="status">{story.hints.slice(0,hint).map((h,i)=><p key={i}>{i+1}. {h}</p>)}</div>}
        {feedback && <div className="a05-result" role="status" aria-live="polite">
          <h3>{feedback.passed?'원리를 발견했어요!':'빠진 조건이 있는지 다시 볼까요?'}</h3>
          {feedback.conditions.map(c=><p key={c.label}>
            <strong>{c.passed?'✓':'△'} {c.label}</strong> — {c.passed?'관찰·설명 조건을 확인했어요.':c.explanation}
          </p>)}
          {!feedback.passed && story.answers.find(c=>c.id===answer)?.misconception &&
            <p>{story.answers.find(c=>c.id===answer)?.misconception}</p>}
          <button type="button" onClick={()=>speak(feedback.passed?story.nextHook:feedback.conditions.filter(c=>!c.passed).map(c=>c.explanation).join(' '))}>피드백 듣기</button>
          <button type="button" onClick={()=>setWhy(!why)}>{why?'원리 접기':'왜? 원리 확인하기'}</button>
        </div>}
        {feedback && why && <div className="a05-why"><h3>왜 그럴까요?</h3><p>{story.why}</p>
          {feedback.passed && <p className="a05-next">{story.nextHook}</p>}</div>}
        {feedback?.passed && index<3 && <button type="button" className="a05-primary" onClick={()=>enter(index+1)}>다음 질문으로 →</button>}
        {feedback?.passed && index===3 && <div className="a05-why"><strong>다음 이야기</strong>
          <p className="a05-next">{story.nextHook}</p><p>A02 앱/Voice 학습 엔진은 아직 별도 통합 전입니다.</p></div>}
      </section>
      <section className="a05-canvas-col" aria-label="DRAM 실시간 2.5D 시각화">
        <div className="a05-canvas-header"><span>DRAM 1T1C · LIVE 2.5D</span><span>{changed?'실험 가능':'예측 먼저'}</span></div>
        <DramSceneVisual sceneId={sceneId} state={state} revealed={changed}/>
        <div className="a05-model-limit"><strong>모델 범위</strong> {story.assumption}</div>
        <div className="a05-source">출처: A06 PR #7 D02 스토리보드 · 2.5D 제작 A05 · 제작용 toy model</div>
      </section>
    </main>
  </div>;
}
