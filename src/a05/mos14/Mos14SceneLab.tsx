import {useState} from 'react';
import {Mos14SceneVisual} from './Mos14SceneVisual';
import {gradeMos14,mos14Scenes} from './mos14Model';
import type {Mos14Bias,Mos14Device,Mos14Event,Mos14Feedback,Mos14Oxide,Mos14Phase,Mos14SceneId,Mos14State,Mos14Vds} from './mos14Model';
import '../a05Scenes.css';import './mos14.css';
type Option={key:string;label:string;wrong?:string};
type LessonStory={title:string;hook:string;question:string;prediction:string;predictions:Option[];
 task:string;answers:Option[];hints:readonly [string,string,string];why:string;next:string;voice:string;bounds:string};
const STORY:Record<Mos14SceneId,LessonStory>={
 'mos-oxide-field-without-dc-path':{
  title:'절연막을 둔 채 실리콘을 조절할 수 있을까요?',
  hook:'금속–산화막–반도체의 세 층을 만나 봐요.',
  question:'게이트 전압을 바꾸면 산화막 아래에서 무슨 일이 생길까요?',
  prediction:'게이트와 실리콘 사이에 절연막이 있어도 전압을 바꿀 때 전하 분포가 달라질지 예상해 보세요.',
  predictions:[{key:'field',label:'직접 전자가 통과하지 않아도 다른 효과가 있을 것 같아요.'},{key:'none',label:'절연막이므로 그 아래는 어떤 변화도 없어요.'}],
  task:'게이트 전압 −0.5/ +0.3 V, 외부 게이트 충전 순간/정착 상태를 각각 비교하세요.',
  answers:[
   {key:'field-not-dc',label:'절연막 속 정상 DC 전도와 전기장 효과는 달라요. 전압을 바꾸는 순간 외부 충전 전류가 있을 수 있어요.'},
   {key:'m1',label:'절연막이 있으면 전기장도 절대로 실리콘에 닿지 않아요.',wrong:'절연막을 통과하는 DC 전도와 전기장의 영향은 다른 물리 현상이에요.'},
   {key:'m2',label:'전압을 올리는 순간에도 외부 게이트 배선의 전류는 늘 0이에요.',wrong:'커패시터의 전하를 새로 채우는 동안 외부 회로에 과도 충전 전류가 존재할 수 있어요.'},
   {key:'m3',label:'실물 초박막 절연막은 누설·파괴가 물리적으로 불가능해요.',wrong:'실물에는 누설·터널링·산화막 파괴와 열화가 있을 수 있어요.'}
  ],
  hints:['커패시터 두 판은 도선으로 직접 이어졌을까요?','전압을 바꾸는 동안 게이트 표면의 전하가 달라질까요?','이상적 정상 DC와 실제 누설/충전 과도는 구별하세요.'],
  why:'MOS=Metal–Oxide–Semiconductor입니다. 이상적인 유전체는 정상상태의 직접 DC 전도가 없지만 전계는 p-Si 표면 전하를 움직일 수 있어요. 외부 게이트 회로는 전압 변경 순간 정전용량 충전 전류를 흘릴 수 있습니다. 실물 터널링·트랩·TDDB 등은 모형 밖이에요.',
  next:'p형 실리콘의 표면에 정공이 더 모일까요, 전자가 더 모일까요?',
  voice:'게이트와 실리콘 사이를 자세히 봐주세요. 전압을 바꾸면 아래쪽 전하는 어떻게 될지 먼저 골라볼까요?',
  bounds:'이상 1D p-Si, ideal insulating SiO₂ · IG,DC=0 toy; 과도 변화 중 external charging 가능. VFB=0 가정은 14-S02/03 모형의 특수 조건'
 },
 'mos-accumulation-depletion-inversion':{
  title:'p형 실리콘 표면의 운반자는 변할까요?',
  hook:'바탕 실리콘의 도핑 원자 종류는 바꾸지 않아요.',
  question:'게이트 전압이 변할 때 정공·고정 이온·전자 중 무엇이 보일까요?',
  prediction:'−0.5/0/+0.3/+1.1 V 네 장면에서 이동 운반자와 고정 acceptor 이온을 예상해 보세요.',
  predictions:[{key:'surface',label:'도핑은 그대로이고 움직이는 운반자의 분포가 달라질 것 같아요.'},{key:'dopant',label:'표면이 바뀌면 붕소 원자가 인 원자로 바뀔 것 같아요.'}],
  task:'4가지 게이트 bias의 정공(+)·전자(−)·고정 acceptor(−)를 살펴보고 이 모형의 VFB/VT를 확인하세요.',
  answers:[
   {key:'bulk-unchanged',label:'p형 bulk와 고정 acceptor 이온은 남아요. 음전압 축적→0V 특수 flatband→양전압 공핍→더 높은 양전압 반전으로 표면 캐리어가 바뀌어요.'},
   {key:'m1',label:'반전되면 acceptor 도핑 원자가 donor 원자로 변해요.',wrong:'도핑 원자는 변하지 않고 전자와 정공의 공간 분포가 달라져요.'},
   {key:'m2',label:'모든 MOS는 VGB=0에서 flatband이고 VT=0.7V예요.',wrong:'여기만 특별히 VFB=0 toy를 택했습니다. 실제 VFB·VT는 일함수와 산화막/계면 전하 등에도 달라져요.'},
   {key:'m3',label:'공핍층엔 전자·정공·고정 이온이 전부 사라져 진공이 돼요.',wrong:'공핍은 이동 가능한 다수 캐리어가 줄어드는 것이며 고정 도핑 이온은 남습니다.'}
  ],
  hints:['바뀌는 것이 원자 종류일까요, 캐리어 분포일까요?','Flatband는 모든 칩에서 외부 0V일까요?','정공이 밀려나도 고정 acceptor 이온은 움직이지 않아요.'],
  why:'특별히 VFB=0인 이상적 p-Si, 300K, NA=10¹⁶cm⁻³, 산화막 5nm에서는 toy VT≈0.785V. −0.5V는 정공 축적, 0V는 이 모형에서만 flatband, +0.3V는 공핍, +1.1V는 강한 반전이에요. 이 그림은 충분히 기다린 준평형의 정성적 상태이고 빠른 스윕에서는 deep depletion이 나타날 수 있어요. M01 Vth0.7은 별도 모형입니다.',
  next:'산화막 두께를 두 배로 늘리면 단위면적 정전용량은 어떨까요?',
  voice:'p형이라는 이름은 그대로예요. 게이트 전압을 바꿀 때 겉부분의 전하가 어떻게 될지 먼저 예상해 보세요.',
  bounds:'p-Si NA 1e16cm⁻³, ni1e10cm⁻³, 300K, VFB=0 특수 toy, tox5nm. 1D 준평형 정성 도식, 빠른 스윕 deep depletion/약한 반전 생략'
 },
 'mos-oxide-capacitance-cv':{
  title:'산화막을 두껍게 하면 전하 제어는 어떻게 될까요?',
  hook:'같은 SiO₂ 재료와 면적에서 두께만 바꿀게요.',
  question:'5nm에서 10nm가 되면 기하학적 산화막 정전용량은 어떻게 달라질까요?',
  prediction:'두께가 두 배일 때 C′ox는 절반/같음/두 배 중 어디에 가까울까요?',
  predictions:[{key:'half',label:'절반 정도로 줄 것 같아요.'},{key:'double',label:'두 배로 늘 것 같아요.'},{key:'same',label:'두께와는 무관할 것 같아요.'}],
  task:'SiO₂ 두께 5/10nm를 직접 바꾸고 C′ox(µF/cm²)를 비교하세요. 심화 버튼으로 정성적 HF/LF C–V를 열어 보세요.',
  answers:[
   {key:'inverse-series-frequency',label:'기하학적 C′ox=εox/tox는 두께에 반비례하고, 공핍층은 직렬로 작용해 전체 C가 작아져요. HF/LF C–V는 응답 조건에 따라 달라요.'},
   {key:'m1',label:'두께가 2배면 산화막 C는 정확히 2배 커져요.',wrong:'동일 유전체/면적에서 t는 분모이므로 두꺼워질수록 C는 작아집니다.'},
   {key:'m2',label:'공핍 상태의 총 C는 C′ox+C′dep로 단순 합산해요.',wrong:'직렬이면 1/Ctotal=1/Cox+1/Cdep입니다.'},
   {key:'m3',label:'실측 inversion C–V는 모든 주파수에서 정확히 같은 곡선이에요.',wrong:'AC 소수캐리어 응답·트랩·측정 주파수에 따라 달라질 수 있어요.'}
  ],
  hints:['C=εA/t에서 t는 분모에 있을까요?','직렬 커패시터는 합보다 역수 합을 떠올리세요.','빠른 AC 변화에 소수 캐리어가 항상 따라갈까요?'],
  why:'SiO₂ εr3.9, ε0=8.8541878128×10⁻¹²F/m로 C′ox(5nm)≈0.690627µF/cm², 10nm≈0.345313µF/cm²입니다. 단위면적 기하학적 산화막 C′ox와 실제 총 게이트 C–V는 다릅니다. 공핍층은 직렬로 보며 반전의 HF/LF 응답은 별도이고 정성 스케치는 실측 곡선이 아니에요.',
  next:'산화막 아래에 전자 길을 만들었다고 곧바로 전류가 흐를까요?',
  voice:'두께만 바꿔보세요. 전하를 저장하는 능력이 얼마큼 달라질지 먼저 선택해 볼까요?',
  bounds:'ideal parallel-plate SiO₂ εr3.9, tox5/10nm, C′ox 기하학적 값만 정량, Cdep toy 0.5*Cox, HF/LF 도식 실측 아님'
 },
 'mos-cap-to-nmosfet-bridge':{
  title:'전자 길이 보여도 드레인 전류가 있을까요?',
  hook:'게이트 아래 채널과 소스–드레인 단자는 서로 다른 조건이에요.',
  question:'어떤 단자를 붙이고 어느 전압을 걸어야 드레인 전류를 정의할 수 있을까요?',
  prediction:'2단자 MOS 커패시터, n+ S/D 추가 VDS=0, S/D 추가 VDS>0의 차이를 예상해 보세요.',
  predictions:[{key:'terminal',label:'드레인 단자와 두 단자 사이 전압을 구분해 봐야 할 것 같아요.'},{key:'always',label:'표면에 전자만 보이면 어떤 구조든 큰 전류가 흘러요.'}],
  task:'2단자 커패시터와 n+ source/drain 추가를 비교한 뒤 VDS=0 및 +0.5V에서 정성적 ID를 관찰하세요.',
  answers:[
   {key:'terminals-and-vds',label:'커패시터엔 ID가 정의되지 않아요. S/D가 있는 nMOS에서 VDS=0이면 이상적 순 ID=0, 적절한 채널과 VDS>0이면 전류가 흐를 수 있어요.'},
   {key:'m1',label:'드레인 단자 없는 MOS 커패시터에서도 표면 반전만 생기면 ID가 저절로 흘러요.',wrong:'드레인 단자가 없다면 ID라는 측정량부터 정의할 수 없습니다.'},
   {key:'m2',label:'VGS>VT면 VDS=0에서도 ID는 반드시 양수예요.',wrong:'이상적 정상상태의 순 드레인-소스 전류는 VDS=0이면 0입니다.'},
   {key:'m3',label:'MOSFET 게이트에 PN 다이오드 순방향 전류를 넣어 채널을 만듭니다.',wrong:'절연 게이트의 전계가 표면 캐리어를 제어하며 직접 PN 전도와는 다릅니다.'}
  ],
  hints:['드레인 단자가 없다면 ID는 무슨 뜻일까요?','전류가 흐르려면 두 단자 사이 전위차가 필요한가요?','산화막 게이트의 전계 제어와 PN 접합 순방향 주입을 구분하세요.'],
  why:'p형 몸체에서 양의 VGB로 반전 채널이 생길 수 있지만 MOS 커패시터에는 source/drain이 없으므로 ID는 미정의입니다. n+ S/D를 추가하면 nMOS 구조가 되고 VDS=0의 이상적인 순 ID는 0이며, VDS>0·적절한 채널이면 흐를 수 있어요. 몸체를 source에 연결한 toy에서 VGB=VGS=1.1V로 취급하며 실제 subthreshold·온도·누설은 모형 밖입니다.',
  next:'다음 01 MOSFET 레슨에서 VGS와 VDS를 직접 조절해 보세요.',
  voice:'표면의 전자 길을 관찰해 보세요. 이 길만으로 전류가 흐를까요? 단자를 하나씩 붙여보세요.',
  bounds:'2단자 MOS cap I_D undefined, S/D 추가 nMOS VDS0 ideal ID0, VDS+0.5 qualitative possible; toy VGB=VGS 1.1V only with source-body tied, no numeric ID'
 },
};
const fresh=():Mos14State=>({gateV:0,oxideNm:5,phase:'steady',device:'capacitor',vds:0,showCv:false});
export interface Mos14LabProps{onEvent?:(e:Mos14Event)=>void;onSpeech?:(id:Mos14SceneId,text:string)=>void}
export function Mos14SceneLab({onEvent,onSpeech}:Mos14LabProps){
 const [index,setIndex]=useState(0),id=mos14Scenes[index],story=STORY[id];
 const [state,setState]=useState<Mos14State>(fresh),[prediction,setPrediction]=useState<string|null>(null);
 const [answer,setAnswer]=useState<string|null>(null),[seen,setSeen]=useState<string[]>([]);
 const [feedback,setFeedback]=useState<Mos14Feedback|null>(null),[hint,setHint]=useState(0),[why,setWhy]=useState(false);
 const revealed=prediction!==null;
 const event=(type:Mos14Event['type'],payload?:Record<string,unknown>)=>onEvent?.({sceneId:id,type,payload});
 const observe=(key:string)=>setSeen(v=>v.includes(key)?v:[...v,key]);
 function change(next:Mos14State,key:string,label:string){setState(next);setFeedback(null);setWhy(false);observe(key);event('parameter.changed',{label});}
 function enter(i:number){if(i<0||i>=4)return;setIndex(i);setState(fresh());setPrediction(null);setAnswer(null);setSeen([]);setFeedback(null);setHint(0);setWhy(false);onEvent?.({sceneId:mos14Scenes[i],type:'scene.enter'});}
 function bias(v:Mos14Bias){
  const tag=v===-0.5?'accumulation':v===0?'flatband':v===0.3?'depletion':'inversion';
  change({...state,gateV:v},id==='mos-oxide-field-without-dc-path'?(v<0?'negative':'positive'):tag,'bias '+v);
 }
 function oxide(v:Mos14Oxide){change({...state,oxideNm:v},v===5?'tox5':'tox10','oxide '+v);}
 function phase(v:Mos14Phase){change({...state,phase:v},v,'phase '+v);}
 function cv(){change({...state,showCv:true},'cv','qualitative HF/LF C-V');}
 function device(v:Mos14Device){
  change({...state,device:v,vds:0,gateV:1.1},v==='capacitor'?'cap':'nmos-zero','device '+v);
 }
 function vds(v:Mos14Vds){change({...state,device:'nmos',vds:v,gateV:1.1},v===0?'nmos-zero':'nmos-positive','nMOS VDS '+v);}
 const control=(label:string,fn:()=>void,active:boolean)=><button type="button" aria-pressed={active}
  className={active?'selected':''} onClick={fn}>{label}</button>;
 function speak(message:string){event('voice.requested',{text:message});onSpeech?.(id,message);}
 return <div className="a05-lab a05-mos14-lab" lang="ko">
  <header className="a05-head"><p className="a05-eyebrow">A05 · MOS CAPACITOR / LESSON 14</p>
   <h1>절연막의 전계로 실리콘을 바꿀 수 있을까요?</h1>
   <p>질문 → 예상 → 직접 조작 → 수치·전하 관찰 → 오개념·왜? 설명</p>
   <nav className="a05-stepnav" aria-label="MOS 커패시터 4단계">
    {mos14Scenes.map((x,i)=><button key={x} type="button" disabled={i>index} aria-current={i===index?'step':undefined}
     className={index===i?'active':''} onClick={()=>enter(i)}>{i+1}</button>)}</nav>
  </header>
  <main className="a05-stage"><section className="a05-copy" aria-label="학생용 예측·실험">
   <span className="a05-eyebrow">{id} · {index+1}/4</span>
   <h2>{story.title}</h2><p className="a05-hook">{story.hook}</p><p className="a05-question">{story.question}</p>
   <div className="a05-box"><h3>먼저 예상해 보세요</h3><p>{story.prediction}</p><div className="a05-choice-set">
    {story.predictions.map(c=><button type="button" key={c.key} disabled={revealed}
     aria-pressed={prediction===c.key} className={prediction===c.key?'selected':''}
     onClick={()=>{setPrediction(c.key);event('prediction.recorded',{choice:c.key});}}>{c.label}</button>)}</div></div>
   {revealed&&<>
    <div className="a05-box"><h3>직접 움직여 보기</h3><p>{story.task}</p>
     {id==='mos-oxide-field-without-dc-path'&&<div className="a05-mos14-controls">
      <strong>게이트 전압</strong><div className="a05-control-buttons">
       {control('−0.5V',()=>bias(-0.5),state.gateV===-0.5)}
       {control('+0.3V',()=>bias(0.3),state.gateV===0.3)}
      </div><strong>외부 회로의 시간 상태</strong><div className="a05-control-buttons">
       {control('전압 변경 순간',()=>phase('switching'),state.phase==='switching')}
       {control('정착 후',()=>phase('steady'),state.phase==='steady')}
      </div></div>}
     {id==='mos-accumulation-depletion-inversion'&&<div className="a05-mos14-controls">
      <strong>p형 벌크 그대로 · VGB</strong><div className="a05-control-buttons">
       {control('−0.5V',()=>bias(-0.5),state.gateV===-0.5)}
       {control('0V',()=>bias(0),state.gateV===0)}
       {control('+0.3V',()=>bias(0.3),state.gateV===0.3)}
       {control('+1.1V',()=>bias(1.1),state.gateV===1.1)}
      </div><p className="a05-note">VFB=0V는 **이 모형에만** 특수하게 가정했어요. 장면은 충분히 시간이 지난 준평형입니다.</p></div>}
     {id==='mos-oxide-capacitance-cv'&&<div className="a05-mos14-controls">
      <strong>SiO₂ 산화막 두께</strong><div className="a05-control-buttons">
       {control('5nm',()=>oxide(5),state.oxideNm===5)}
       {control('10nm',()=>oxide(10),state.oxideNm===10)}
      </div><button type="button" onClick={cv}>HF/LF C–V 정성 비교 확장</button>
      <p className="a05-note">C′ox는 산화막 단위면적 값입니다. 고주파/저주파 곡선은 정성 스케치만 설명하며 실측 값이 아니에요.</p></div>}
     {id==='mos-cap-to-nmosfet-bridge'&&<div className="a05-mos14-controls">
      <strong>구조 카드</strong><div className="a05-control-buttons">
       {control('2단자 MOS cap',()=>device('capacitor'),state.device==='capacitor')}
       {control('n+ S/D 부착 nMOS',()=>device('nmos'),state.device==='nmos')}
      </div><strong>소스–드레인 전압</strong><div className="a05-control-buttons">
       {control('VDS 0V',()=>vds(0),state.vds===0&&state.device==='nmos')}
       {control('VDS +0.5V',()=>vds(0.5),state.vds===0.5&&state.device==='nmos')}
      </div></div>}
    </div>
    <div className="a05-box"><h3>원리를 직접 고르세요</h3><div className="a05-choice-set">
     {story.answers.map(c=><button type="button" key={c.key} aria-pressed={answer===c.key}
      className={answer===c.key?'selected':''} onClick={()=>{setAnswer(c.key);setFeedback(null);setWhy(false);}}>{c.label}</button>)}</div>
     <button type="button" className="a05-primary" onClick={()=>{const f=gradeMos14(id,seen,answer);setFeedback(f);event('answer.checked',{passed:f.passed});}}>실험·설명 검증</button>
    </div>
   </>}
   <div className="a05-tools"><button type="button" onClick={()=>speak(story.voice)}>한국어 질문 듣기</button>
    {revealed&&<button type="button" disabled={hint===3} onClick={()=>{setHint(Math.min(3,hint+1));event('hint.opened',{level:Math.min(3,hint+1)});}}>힌트 {hint}/3</button>}</div>
   {hint>0&&<div className="a05-hint" role="status">{story.hints.slice(0,hint).map((t,i)=><p key={i}>{i+1}. {t}</p>)}</div>}
   {feedback&&<section className="a05-result" role="status" aria-live="polite">
    <h3>{feedback.passed?'전하와 단자 조건을 연결했어요!':'놓친 실험 조건을 찾아볼까요?'}</h3>
    {feedback.conditions.map(c=><p key={c.label}><strong>{c.passed?'✓':'△'} {c.label}</strong> — {c.passed?'관찰했어요.':c.help}</p>)}
    {!feedback.passed&&<p>{story.answers.find(c=>c.key===answer)?.wrong}</p>}
    <button type="button" onClick={()=>speak(feedback.passed?story.next:feedback.conditions.filter(c=>!c.passed).map(c=>c.help).join(' '))}>피드백 듣기</button>
    <button type="button" onClick={()=>setWhy(!why)}>{why?'왜? 접기':'왜? 원리 보기'}</button>
   </section>}
   {feedback&&why&&<section className="a05-why"><h3>왜 그럴까요?</h3><p>{story.why}</p>{feedback.passed&&<p>{story.next}</p>}</section>}
   {feedback?.passed&&index<3&&<button type="button" className="a05-primary" onClick={()=>enter(index+1)}>다음 질문으로 →</button>}
   {feedback?.passed&&index===3&&<div className="a05-why">MOS 커패시터 탐험이 끝났어요. 다음 01 MOSFET 모형과 비교해 보세요. A02 제품 앱 진도는 별도입니다.</div>}
  </section>
  <section className="a05-canvas-col" aria-label="원본 MOS 단면의 학습 실험">
   <div className="a05-canvas-header"><span>LIVE MOS CAP 2.5D</span><span>{revealed?'예상 후 관찰':'예측 전 값 비공개'}</span></div>
   <Mos14SceneVisual sceneId={id} state={state} revealed={revealed}/>
   <div className="a05-model-limit"><strong>물리 범위</strong> {story.bounds}</div>
   <div className="a05-source">A06 14 원고 d356f8ae · A07 Source EDU_PASS · A05 독자 SVG · 실제 반도체 계측값 아님</div>
  </section></main></div>;
}
