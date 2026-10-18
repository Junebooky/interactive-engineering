import { useState } from 'react';
import { A05SceneVisual } from './A05SceneVisual';
import {
  a05SceneIds, evaluateA05Scene, initialSceneValues,
} from './scenePhysics';
import type { A05Event, A05EventType, A05Result, A05SceneId, A05Values, LogicBit } from './scenePhysics';
import './a05Scenes.css';

type Choice = { id: string; label: string; misconception?: string };
type Story = {
  title: string; hook: string; question: string;
  prediction: string; predictions: Choice[];
  finalPrompt: string; finalChoices?: Choice[];
  displayText: string; speechText: string; why: string; nextHook: string;
  hints: readonly [string, string, string]; assumptions: string; misconceptions?: readonly [string, string, string];
};
const STORIES: Record<A05SceneId, Story> = {
  'mosfet-field': {
    title: '전압만으로 스위치를 열 수 있을까요?',
    hook: '손으로 누르지 않아도 열리는 스위치가 있을까요?',
    question: '게이트 전압을 올리면 실리콘 표면에서 어떤 변화가 생길까요?',
    prediction: '0, 0.6, 1.2 V 중 가장 뚜렷한 채널이 생길 것 같은 값을 골라 보세요.',
    predictions: [{ id: '0', label: '0 V' }, { id: '0.6', label: '0.6 V' }, { id: '1.2', label: '1.2 V' }],
    finalPrompt: '직접 관찰한 전자들은 어디에 모였나요?',
    finalChoices: [
      { id: 'oxide', label: '전자들이 산화막을 뚫고 게이트로 넘어갔어요.', misconception: '산화막은 절연체예요. 전기장은 영향을 주지만, 전자가 산화막을 통과하는 모습은 아니에요.' },
      { id: 'surface', label: '게이트 아래 실리콘 표면에 전자들이 모였어요.' },
      { id: 'zero', label: 'VDS가 있어도 문턱 아래의 드레인 전류는 항상 정확히 0이에요.', misconception: 'VDS가 걸린 실제 소자에는 문턱 아래 미세 전류가 있을 수 있어요. 하지만 이 장면은 VDS=0이므로 순 DC 전류는 0이 맞아요.' },
      { id: 'universal', label: '모든 MOSFET의 문턱은 언제나 0.7 V예요.', misconception: '문턱 전압은 실제 소자·공정·온도에 따라 달라요. 0.7 V는 이 실험의 가정이에요.' },
    ],
    displayText: '전압을 올리면 산화막 바로 아래가 어떻게 달라질까요?',
    speechText: '전압을 천천히 올려보세요. 전자들이 어디에 모이는지 먼저 예상해 볼까요?',
    hints: [
      '절연막이 전자를 그대로 통과시키는 물질일까요?',
      '전자는 산화막을 건너가나요, 실리콘 표면으로 모이나요?',
      '문턱 전압이 소자마다 달라질 가능성도 생각해 보세요.',
    ],
    why: '게이트의 전기장이 SiO₂ 절연막 너머 실리콘 표면의 전하 분포를 바꿔 반전층을 유도해요. 장채널 nMOS를 가정했고 문턱 아래 미세 전류·게이트 누설은 시각화하지 않았어요.',
    nextHook: '통로가 열렸어요. 그런데 양 끝 전압이 같아도 전류가 흐를까요?',
    assumptions: 'VGS 0–1.2 V · VDS=0 · Vth=0.7 V 가상 모델 · ID≈0은 순 DC 전류 기준',
  },
  'mosfet-current': {
    title: '길은 열렸는데, 전류가 왜 0일까요?',
    hook: '채널이 분명히 생겼는데 전류계가 0을 가리키고 있어요.',
    question: '소스와 드레인 전압이 같을 때도 전류가 흐를까요?',
    prediction: 'VDS가 0 V일 때와 1 V일 때의 전류를 먼저 예상해 보세요.',
    predictions: [
      { id: 'always', label: '채널만 열리면 둘 다 흐를 것 같아요.' },
      { id: 'needs-voltage', label: '0 V에서는 0, 1 V에서는 흐를 것 같아요.' },
      { id: 'never', label: '두 경우 모두 흐르지 않을 것 같아요.' },
    ],
    finalPrompt: '0 V에서 출발하는 곡선과 포화 구간을 보고, 가장 정확한 설명을 골라 보세요.',
    finalChoices: [
      { id: 'channel-always', label: '채널만 생기면 VDS가 0이어도 순 전류가 흘러요.', misconception: '채널은 통로이고, 순 전류에는 드레인과 소스 사이의 전압 차도 필요해요.' },
      { id: 'voltage-needed', label: '전압 차가 있어야 흐르고, 포화되어도 전류가 유지돼요.' },
      { id: 'saturation-zero', label: '핀치오프가 되면 전류가 완전히 끊겨요.', misconception: '핀치오프와 차단은 달라요. 이상 장채널 모형에서 포화 영역에도 전류는 흐릅니다.' },
      { id: 'same-direction', label: '전자 이동과 관습 전류는 같은 방향이에요.', misconception: '전자 이동은 소스→드레인, 관습 전류는 드레인→소스 방향으로 표시했어요.' },
    ],
    displayText: 'VDS 슬라이더를 움직여 전류-전압 곡선을 관찰해 보세요.',
    speechText: '채널이 있는데도 전류가 0이에요. 드레인 전압을 바꾸면 어떻게 될까요?',
    hints: [
      '양 끝의 전압이 같으면 어떤 쪽으로 밀어줄까요?',
      'VDS를 0에서 올릴 때 그래프가 어디에서 출발하나요?',
      '포화 영역에서 곡선이 0으로 내려가나요? 전자의 방향도 따로 보세요.',
    ],
    why: '장채널 square-law 근사: 선형 영역 ID=kn[(VGS−Vth)VDS−VDS²/2], 포화 영역 ID=kn(VGS−Vth)²/2. 여기서 kn=2 mA/V², VGS=1.5 V예요. 채널 길이 변조·온도·누설은 생략했어요.',
    nextHook: '이 스위치를 출력선 아래에 연결하면 ON일 때 출력도 1일까요?',
    assumptions: 'VGS=1.5 V 고정 · VDS 0–2 V · ID mA · 장채널 toy square-law',
  },
  'nmos-resistor-inverter': {
    title: 'nMOS가 ON인데 출력은 왜 LOW일까요?',
    hook: '스위치가 켜졌으니 출력도 1일까요? 정말 그럴까요?',
    question: '입력을 HIGH(5 V)로 바꾸면 출력은 올라갈까요, 내려갈까요?',
    prediction: '입력 HIGH에서 출력 논리를 먼저 골라보세요.',
    predictions: [{ id: 'up', label: '출력 1 (HIGH)' }, { id: 'down', label: '출력 0 (LOW)' }, { id: 'same', label: '입력과 항상 같음' }],
    finalPrompt: '5 V를 넣었을 때 약 0.45 V가 나온 이유를 설명해 보세요.',
    finalChoices: [
      { id: 'on-high', label: 'nMOS ON 자체가 무조건 출력 비트 1을 뜻해요.', misconception: '스위치 ON/OFF와 논리 0/1은 같은 개념이 아니에요. 출력선이 어디에 연결되는지를 보세요.' },
      { id: 'pulldown', label: '출력이 낮은 저항 경로를 통해 접지 근처로 당겨져요.' },
      { id: 'same', label: '출력 VOUT는 항상 입력 VIN과 똑같은 전압이에요.', misconception: '출력 노드에서는 풀업 저항과 nMOS 온저항이 전압을 나누고 있어요.' },
      { id: 'perfect', label: 'nMOS가 켜지면 완전한 0 Ω이어서 정확히 0.000 V예요.', misconception: '유한한 ON 저항 때문에 이 toy 모형은 약 0.45 V이고 논리 LOW로 해석해요.' },
    ],
    displayText: '입력 버튼으로 출력선을 접지 쪽에 연결해 보세요.',
    speechText: '출력선이 어디에 연결되는지 보세요. 스위치가 켜지면 어떤 일이 일어날까요?',
    hints: [
      '스위치가 닫힐 때 출력이 전원 쪽일까요, 접지 쪽일까요?',
      '풀업 저항 10 kΩ과 아래쪽 스위치 경로를 비교해 보세요.',
      '정확히 0 V가 아닌 약 0.45 V도 논리 0일 수 있을까요?',
    ],
    why: '저항형 인버터에서는 풀업 10 kΩ과 nMOS의 유한한 ON 저항이 전압을 나눠요. A02 PR #5의 Ron 모형을 그대로 사용해 Vin=5 V일 때 VOUT≈0.45 V입니다. 완전 단락이라고 부르지 않아요.',
    nextHook: '저항형 회로는 ON 동안 전력을 써요. 저항을 pMOS로 바꾸면 어떨까요?',
    assumptions: 'VDD=5 V · RD=10 kΩ · Ron은 A02 모델의 교육용 값 · 논리 LOW≈0.45 V',
  },
  'cmos-not-gate': {
    title: '두 스위치로 NOT을 완성해 볼까요?',
    hook: '저항 대신 위에 pMOS를 하나 더 넣었어요. 뭐가 달라질까요?',
    question: '입력이 0과 1일 때 어떤 스위치가 켜지는지 살펴보세요.',
    prediction: '입력 0 V에서 위쪽 pMOS 상태를 예상해 보세요.',
    predictions: [{ id: 'pmos-on', label: 'pMOS ON' }, { id: 'nmos-on', label: 'nMOS만 ON' }, { id: 'both-on', label: '둘 다 ON' }],
    finalPrompt: '서로 다른 입력을 실험한 뒤, CMOS NOT 게이트 진리표를 완성하세요.',
    displayText: '입력 0과 1을 번갈아 넣어 출력 반전을 확인해 보세요.',
    speechText: '이번에는 위쪽에 pMOS가 있어요. 입력을 바꾸면서 두 소자가 어떻게 번갈아 움직이는지 보세요.',
    hints: [
      '입력 0에서는 위쪽 pMOS가 켜질까요?',
      '입력 1에서는 아래쪽 nMOS가 켜질까요?',
      '이상적인 정지 상태의 관통경로와 실제 스위칭·누설 전력은 다르답니다.',
    ],
    why: 'CMOS는 pMOS 풀업과 nMOS 풀다운을 상보적으로 구동해 안정 상태에서 직접 VDD→GND 관통 경로를 억제해요. 실제 회로에는 누설 및 스위칭 전력이 존재합니다. 이는 이전의 저항형 nMOS 회로와 다른 토폴로지예요.',
    nextHook: 'CMOS 인버터 두 개를 되먹임하면 SRAM이 돼요. 커패시터 하나에 저장하는 DRAM과 무엇이 다를까요?',
    assumptions: '5 V 이상적인 CMOS 정지 논리 예제 · 실제 트랜지스터 곡선/누설/과도 응답은 생략',
    misconceptions: [
      'CMOS의 소비 전력이 항상 0은 아니에요. 실제 누설과 전환 중 전력이 남아요.',
      '논리 1은 단순히 전자가 있다는 뜻이 아니라 회로에서 정의한 전압 범위예요.',
      'NOT 게이트의 두 트랜지스터는 DRAM의 1T1C 저장 셀과 다른 구조예요.',
    ],
  },
};

export type A05MosfetSceneLabProps = {
  onEvent?: (event: A05Event) => void;
  onSpeech?: (sceneId: A05SceneId, speechText: string) => void;
};

/** Standalone sample for A02 handoff. Does not register a new engine simulatorType. */
export function A05MosfetSceneLab({ onEvent, onSpeech }: A05MosfetSceneLabProps) {
  const [index, setIndex] = useState(0);
  const sceneId = a05SceneIds[index];
  const story = STORIES[sceneId];
  const [values, setValues] = useState<A05Values>(() => initialSceneValues(sceneId));
  const [prediction, setPrediction] = useState<string | null>(null);
  const [finalChoice, setFinalChoice] = useState<string | null>(null);
  const [visited, setVisited] = useState<number[]>([]);
  const [result, setResult] = useState<A05Result | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [showWhy, setShowWhy] = useState(false);

  function emit(type: A05EventType, payload?: A05Event['payload']) {
    onEvent?.({ sceneId, type, payload });
  }
  function moveTo(next: number) {
    const nextId = a05SceneIds[next];
    if (!nextId) return;
    setIndex(next);
    setValues(initialSceneValues(nextId));
    setPrediction(null);
    setFinalChoice(null);
    setVisited([]);
    setResult(null);
    setHintCount(0);
    setShowWhy(false);
    onEvent?.({ sceneId: nextId, type: 'scene.enter' });
  }
  function changeVoltage(key: 'vgs' | 'vds' | 'vin', voltage: number) {
    const v = key === 'vin' ? (voltage ? 5 : 0) : voltage;
    setValues(prev => ({ ...prev, [key]: v }));
    setVisited(prev => prev.includes(v) ? prev : [...prev, v]);
    setResult(null);
    setShowWhy(false);
    emit('parameter.changed', { key, value: v });
  }
  function observeCurrentVoltage(){
    // A student must explicitly observe the initial 0V scene. A default field/first render
    // never creates a physical observation/progress record.
    const current=controlKey==='vin'?values.vin:controlKey==='vgs'?values.vgs:values.vds;
    setVisited(prev=>prev.includes(current)?prev:[...prev,current]);
    setResult(null);setShowWhy(false);
    emit('parameter.changed',{key:controlKey,value:current});
  }
  function changeBit(key: 'out0' | 'out1', bit: LogicBit) {
    setValues(prev => ({ ...prev, [key]: bit }));
    setResult(null);
    setShowWhy(false);
    emit('parameter.changed', { key, value: bit });
  }
  function chooseFinal(id: string) {
    setFinalChoice(id);
    setResult(null);
    setShowWhy(false);
  }
  function check() {
    const next = evaluateA05Scene(sceneId, visited, finalChoice, values);
    setResult(next);
    emit('answer.checked', { passed: next.passed, observationPassed: next.observationPassed, answerPassed: next.answerPassed });
  }
  function speak(text: string) {
    emit('voice.requested', { text });
    onSpeech?.(sceneId, text);
  }
  const controlKey = sceneId === 'mosfet-field' ? 'vgs' : sceneId === 'mosfet-current' ? 'vds' : 'vin';
  const controlValue = values[controlKey];
  const finalChoices = story.finalChoices;
  const physicalReady = prediction !== null && evaluateA05Scene(sceneId, visited, null, values).observationPassed;

  return <div className="a05-lab" lang="ko">
    <header className="a05-head">
      <p className="a05-eyebrow">A05 · 인터랙티브 공학 실험실 / M01</p>
      <h1>MOSFET에서 NOT 게이트까지</h1>
      <p>예상하고, 직접 조작하고, 원리를 발견해 보세요.</p>
      <nav className="a05-stepnav" aria-label="MOSFET 레슨 진행">
        {a05SceneIds.map((id, i) => <button key={id} type="button"
          aria-current={i === index ? 'step' : undefined} aria-label={'장면 ' + (i + 1)}
          className={i === index ? 'active' : ''}
          disabled={i > index}
          onClick={() => moveTo(i)}>{String(i + 1).padStart(2, '0')}</button>)}
      </nav>
    </header>
    <main className="a05-stage">
      <div className="a05-copy">
        <span className="a05-eyebrow">{sceneId} · {index + 1} / 4</span>
        <h2>{story.title}</h2>
        <p className="a05-hook">{story.hook}</p>
        <p className="a05-question">{prediction === null ? story.question : physicalReady ? '관찰한 결과를 바탕으로 원리를 설명해 보세요.' : '이제 실험 조작에 집중해 보세요.'}</p>
        {prediction === null && <div className="a05-box">
          <h3>먼저 예상하기</h3>
          <p>{story.prediction}</p>
          <div className="a05-choice-set">
            {story.predictions.map(c => <button key={c.id} type="button" aria-pressed={prediction === c.id}
              className={prediction === c.id ? 'selected' : ''} disabled={prediction !== null}
              onClick={() => { setPrediction(c.id); emit('prediction.recorded', { choice: c.id }); }}>{c.label}</button>)}
          </div>
        </div>}
        {prediction !== null && !physicalReady && <div className="a05-box a05-experiment-guidance" role="status">실험은 오른쪽 2.5D 모델 아래의 ‘실험 조작’에서 진행해요. 낮은 전압과 높은 전압을 비교하면 한 가지 원리 질문이 열립니다.</div>}
        {physicalReady && !result?.passed && <div className="a05-box">
            <h3>관찰한 원리 확인하기</h3>
            <p>{story.finalPrompt}</p>
            {finalChoices ? <div className="a05-choice-set">
              {finalChoices.map(c => <button type="button" key={c.id} aria-pressed={finalChoice === c.id}
                className={finalChoice === c.id ? 'selected' : ''}
                onClick={() => chooseFinal(c.id)}>{c.label}</button>)}
            </div> : <div className="a05-truth" role="group" aria-label="NOT 게이트 진리표">
              {(['out0', 'out1'] as const).map((key, i) => <div className="a05-truth-row" key={key}>
                <span>입력 {i} → 출력 ?</span>
                {([0, 1] as const).map(bit => <button type="button" key={bit} aria-pressed={values[key] === bit}
                  className={values[key] === bit ? 'selected' : ''} onClick={() => changeBit(key, bit)}>{bit}</button>)}
              </div>)}
            </div>}
            <button className="a05-primary" type="button" onClick={check}>관찰 결과 확인하기</button>
          </div>}
        <div className="a05-tools">
          <button type="button" onClick={() => speak(story.speechText)}>한국어 질문 듣기</button>
          {prediction !== null && <button type="button" disabled={hintCount === 3} onClick={() => {
            setHintCount(prev => Math.min(prev + 1, 3));
            emit('hint.opened', { level: Math.min(hintCount + 1, 3) });
          }}>힌트 {hintCount}/3</button>}
        </div>
        {hintCount > 0 && <div className="a05-hint" aria-live="polite">
          {story.hints.slice(0, hintCount).map((hint, i) => <p key={i}>힌트 {i + 1}: {hint}</p>)}
        </div>}
        {result && <section className="a05-result" aria-live="polite" role="status">
          <h3>{result.passed ? '원리를 연결했어요!' : '어느 조건이 다른지 확인해 볼까요?'}</h3>
          {result.conditions.map(c => <p key={c.label}><strong>{c.passed ? '✓' : '△'} {c.label}</strong> — {c.feedback}</p>)}
          {!result.answerPassed && finalChoices && <p>{finalChoices.find(c => c.id === finalChoice)?.misconception}</p>}
          {story.misconceptions && <details><summary>헷갈리기 쉬운 생각 3가지</summary>
            {story.misconceptions.map((m, i) => <p key={i}>{i + 1}. {m}</p>)}
          </details>}
          {result.passed && <p>좋아요. 다음 질문으로 이어가 볼까요?</p>}
          <button type="button" onClick={() => speak(result.passed ? '직접 관찰한 결과와 원리를 잘 연결했어요. ' + story.nextHook : result.conditions.filter(c => !c.passed).map(c => c.feedback).join(' '))}>검사 결과 듣기</button>
          {result.passed && <button type="button" onClick={() => setShowWhy(!showWhy)}>{showWhy ? '원리 접기' : '왜 그럴까요? 원리 보기'}</button>}
        </section>}
        {showWhy && result?.passed && <div className="a05-why"><h3>왜 그럴까요?</h3><p>{story.why}</p>
          <button type="button" className="a05-audio" onClick={() => speak(story.why)}>원리 듣기</button>
          {result.passed && <p className="a05-next">{story.nextHook}</p>}</div>}
        {result?.passed && index < a05SceneIds.length - 1 && <button type="button" className="a05-primary" onClick={() => moveTo(index + 1)}>다음 질문으로 →</button>}
        {result?.passed && index === a05SceneIds.length - 1 && <div className="a05-why"><p className="a05-next">{story.nextHook}</p><p>이 샘플은 A02 앱 진도와 연동되지 않아요.</p></div>}
      </div>
      <div className="a05-canvas-col">
        <div className="a05-canvas-header"><span>LIVE 2.5D MODEL</span><span>{prediction === null ? '예상 먼저' : '조작 가능'}</span></div>
        <A05SceneVisual sceneId={sceneId} values={values} showObservation={prediction !== null} />
        {prediction !== null && <div className="a05-mosfet-dock" role="region" aria-label="실험 조작" data-testid="a08-mosfet-experiment-dock">
            <h3>직접 조작하기</h3>
            <p>{story.displayText}</p>
            {controlKey === 'vin' ? <div className="a05-control-buttons" role="group" aria-label="입력 전압 전환">
              <button type="button" aria-pressed={controlValue === 0} onClick={() => changeVoltage('vin', 0)}>입력 0 V</button>
              <button type="button" aria-pressed={controlValue === 5} onClick={() => changeVoltage('vin', 5)}>입력 5 V</button>
            </div> : <>
              <label className="a05-slider-label" htmlFor="a05-voltage">
                {controlKey === 'vgs' ? '게이트 전압 VGS' : '드레인-소스 전압 VDS'} <strong>{controlValue.toFixed(1)} V</strong>
              </label>
              <input id="a05-voltage" type="range" value={controlValue} min={0}
                max={controlKey === 'vgs' ? 1.2 : 2} step=".1"
                onChange={e => changeVoltage(controlKey, Number(e.target.value))}/>
              <button type="button" className="a05-mosfet-observe-current" onClick={observeCurrentVoltage}>현재 {controlValue.toFixed(1)} V 직접 관찰</button>
              <p className="a05-note">현재 값을 직접 관찰하거나 키보드 방향키로 0.1 V씩 바꿔 비교하세요.</p>
            </>}
          </div>}
        <div className="a05-model-limit"><strong>모델 범위</strong> {story.assumptions}</div>
        <div className="a05-source">교육 스토리: A06 PR #7 · 장면 구현: A05 · 학습 엔진: A02 별도 통합</div>
      </div>
    </main>
  </div>;
}
