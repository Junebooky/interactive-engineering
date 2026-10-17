import {useState} from 'react';
import {Package06SceneVisual} from './Package06SceneVisual';
import {fabAdvance,fabStageValid,freshPackage06,gradePackage06,package06Order} from './package06Model';
import type {FabAction,InterposerKind,Package06Event,Package06Grade,Package06SceneId,Package06State,PackageTopology,Screening} from './package06Model';
import '../a05Scenes.css';import './package06.css';
type Option={id:string;text:string;correction?:string};
type Script={title:string;hook:string;question:string;prediction:string;predictions:[string,string];task:string;
 options:[Option,Option,Option,Option];hints:[string,string,string];why:string;next:string;beforeVoice:string;physics:string};
const SCRIPT:Record<Package06SceneId,Script>={
 'fab-pattern-to-die':{
 title:'웨이퍼에 한 번 빛을 쏘면 완성 칩인가요?',hook:'마스크와 여러 층을 정렬해 회로를 만들고 검사합니다.',
 question:'포토 뒤 식각과 도핑, 금속배선, 테스트는 어떤 순서일까요?',
 prediction:'웨이퍼→포토→식각/막/주입→배선→검사→절단의 원인 순서를 예상하세요.',
 predictions:['여러 단계와 검사, 반복 층이 필요할 것 같아요.','포토 공정 1회만으로 완성칩이라고 생각해요.'],
 task:'단계 버튼을 실제 순서대로 눌러 진행하세요. 틀린 단계는 진행에 포함하지 않습니다. 층1/2와 결함 없음/있음도 각각 비교하세요.',
 options:[
 {id:'repeat-and-test',text:'웨이퍼·포토·식각/막/주입·배선·검사·절단을 반복적 층 제작/선별과 연결해야 해요.'},
 {id:'m1',text:'한 번 노광하면 트랜지스터와 모든 금속 층이 즉시 완성돼요.',correction:'포토 한 번으로 소자와 여러 금속 배선이 완성되지 않습니다. 패턴·식각·증착·주입·정렬을 반복해요.'},
 {id:'m2',text:'웨이퍼의 모든 다이는 완벽해 공정 검사는 생략해요.',correction:'같은 웨이퍼에서도 결함·다이 별 편차가 생겨 양품/불량 선별 검사가 필요합니다.'},
 {id:'m3',text:'공정 이름 3nm는 모든 트랜지스터의 단일 물리길이 3nm예요.',correction:'노드 이름은 공정 세대·마케팅 분류로, 특정 한 치수와 동치가 아닙니다.'}],
 hints:['포토와 금속배선 사이에 막 형성·식각/주입이 있을까요?','시험은 절단·조립 전 불량을 거를 수 있어요.','반복 층과 공정 노드 이름의 한계를 구분하세요.'],
 why:'웨이퍼에 수많은 소자를 새기려면 포토/식각/증착/주입과 금속배선을 여러 번 정렬합니다. 물리 결함과 전기 특성을 시험하고 다이를 절단/선별합니다. “3nm” 같은 노드명은 특정 고정 게이트 길이 보증이 아닙니다.',
 next:'큰 단일 다이를 작은 칩렛 네 개로 나누면 제품 수율도 자동으로 개선될까요?',
 beforeVoice:'사진처럼 한 번 인쇄한다고 모든 회로가 완성될지 예측해 보세요.',
 physics:'여섯 공정 카드의 교육용 toy 순서이며 실제 라인의 복잡한 제조 반복/검증 단계와 다름.'
 },
 'chiplet-yield-model':{
 title:'작은 칩렛 4개를 묶으면 수율도 4배 좋아질까요?',hook:'다이 하나의 정상 확률과 완제품 조립 성공은 다른 확률입니다.',
 question:'네 개 모두 정상이어야 하는 무선별 패키지와 양품 KGD 선별 후 조립의 확률은?',
 prediction:'면적100mm² 다이1개 vs 25mm² 칩렛4개, D0/0.005, KGD 전/후와 패키지 조립 100/95% 조건을 예측하세요.',
 predictions:['각 칩 양품률과 4칩 동시 정상/선별 후 조건부 성공은 다를 거예요.','작은 칩 4개면 시스템 수율이 반드시 더 좋아져요.'],
 task:'D=0과 .005/mm², KGD NONE/ON, 조립100/95%를 각각 직접 바꿔 individual과 four-die·assembly를 비교하세요.',
 options:[
 {id:'conditional-kgd-package-yield',text:'무선별4개 성공은 작은칩 Y⁴×조립Y, 이상적 KGD로 양품 선별하면 조립조건부 성공≈조립Y지만 후보 다이 검사·재고 비용이 들어요.'},
 {id:'m1',text:'칩렛은 작으니 검사하지 않은 네 개의 완제품 수율도 반드시 상승해요.',correction:'칩 하나 양품확률과 네 개 모두 양품일 확률은 다릅니다. 검사 없는4다이는 각 확률을 곱해요.'},
 {id:'m2',text:'KGD 네 개면 결합 공정의 실패와 테스트 비용이 모두 없어져요.',correction:'KGD는 조립 전 불량을 줄이는 선택 방식이지 조립 실패·테스트·재고 비용을 없애지 않습니다.'},
 {id:'m3',text:'칩렛 분할은 배선·열·전력 비용을 무조건 줄여요.',correction:'칩렛 연결은 전력·통신·패키지 열·비용 증가를 만들 수 있어 실제 장점은 조건부입니다.'}],
 hints:['독립 양품 네 개 동시 성공은 곱으로 계산하세요.','선별된 KGD만 무한 후보에서 골라낼 수 있다면 성공 조건이 달라져요.','패키징 실패와 후보/검사 비용을 제거하면 계산이 과도하게 낙관적입니다.'],
 why:'D=.005/mm² 포아송 toy에서 단일100mm²는 e^-0.5≈0.60653, 작은25mm² 한 개는 e^-0.125≈0.882497. 네 개를 무선별 조립하면 0.882497⁴≈0.60653, 조립Y.95 후 ≈0.57620. 이상적 양품 KGD 네 개를 충분한 후보에서 선별하면 **이미 정상인 네 개를 조건**으로 한 조립 성공은 .95; 평균 후보 다이는 4/0.882497≈4.532개로 비용이 0은 아닙니다. 실제 KGD 검출 실패·이음 비용도 존재해요.',
 next:'HBM 수직 연결과 GPU 옆 칩 사이 연결의 차이는 어디에 있을까요?',
 beforeVoice:'작은 다이 하나의 정상 확률과 네 개를 묶은 패키지 수율이 같을지 예측하세요.',
 physics:'결함 포아송 독립 toy, 4개 25mm² + 1개100mm², D0/.005/mm², perfect KGD만 가정; 실제 비용/escape/통신/공정별 수율 아님.'
 },
 'hbm-tsv-interposer':{
 title:'HBM의 TSV와 GPU 옆 인터포저는 같은 연결일까요?',hook:'HBM은 여러 DRAM 다이를 수직 적층하고 GPU 옆에서 고밀도로 연결할 수 있어요.',
 question:'HBM 스택 내부 수직 연결과 옆 GPU 다이 사이 배선을 따로 설명하세요.',
 prediction:'PCB GDDR 보드 배선, HBM 내부 TSV, GPU 옆 고밀도 인터포저 경로가 어떤 역할인지 먼저 예상해 보세요.',
 predictions:['스택 안 수직선과 옆 다이 연결판은 서로 다른 역할일 거예요.','HBM과 GPU는 같은 실리콘 하나여서 연결이 따로 없어요.'],
 task:'보드 GDDR→HBM stacked→TSV ON→GPU+HBM interposer 실리콘/RDL 예시를 각각 조작해 경로를 비교하세요.',
 options:[
 {id:'tsv-internal-interposer-sideways',text:'TSV는 HBM DRAM 스택 내부 수직 층간 연결, interposer/RDL은 별도 GPU와 HBM을 옆으로 고밀도 연결하는 배선 경로예요.'},
 {id:'m1',text:'GPU 연산코어와 HBM 셀은 언제나 같은 단일 실리콘 다이에 있어요.',correction:'GPU 계산 다이와 HBM DRAM 적층 다이는 일반적으로 별도 다이들로 패키지에서 옆으로 연결돼요.'},
 {id:'m2',text:'GPU-HBM 인터포저는 반드시 실리콘 재료만 가능해요.',correction:'고밀도 배선 역할을 하는 구조는 실리콘·유기/재배선(RDL) 등 여러 구현이 존재합니다.'},
 {id:'m3',text:'화면의 2.5D SVG를 그리는 기술이 곧 2.5D 실제 칩 제조법이에요.',correction:'2.5D 화면은 사용자 시각화이고 반도체 2.5D 패키징은 다이 연결·재배선·실물 공정을 뜻해요.'}],
 hints:['TSV는 스택 메모리 다이를 위아래로 연결합니다.','GPU와 HBM은 옆으로 나란히 놓아도 신호선이 필요해요.','실리콘과 RDL 기반 플랫폼의 차이를 생각해 보세요.'],
 why:'HBM은 DRAM 다이 여러 장을 적층하며 TSV·마이크로범프 등으로 층간 연결할 수 있습니다. GPU 옆 HBM을 패키지 상에서 연결할 때는 실리콘 인터포저나 RDL 계열 고밀도 배선을 사용합니다. 실물 2.5D 조립은 화면 2.5D SVG와 전혀 다른 뜻이며 제품별 topology가 다릅니다.',
 next:'이렇게 붙인 칩의 열은 어떻게 바깥으로 빼낼까요?',
 beforeVoice:'HBM 수직 층간 연결과 GPU 옆으로 가는 신호선이 같은 역할일지 예상하세요.',
 physics:'정성적 HBM TSV/interposer 배치 toy. 실제 제조 기술별 interposer 소재, 신호 성능, CoWoS 옵션/대역폭은 단정하지 않음.'
 },
 'package-power-heat':{
 title:'같은 발열에서 냉각 경로를 개선하면 몇 K 낮아질까요?',hook:'전력과 열저항을 조합해야 패키지의 상승 온도를 비교할 수 있습니다.',
 question:'20W/40W, Rθ 0.2/0.4K/W일 때 주위25°C 대비 ΔT는?',
 prediction:'전력과 열저항을 각각 두 배로 바꾸면 정상상태 패키지 상승 온도가 어떻게 될지 예측하세요.',
 predictions:['열상승은 발열W×K/W와 관련되며 냉각이 좋아지면 낮아질 거예요.','TSV만 추가하면 발열·전력 모두 0이 될 거예요.'],
 task:'전력20W/40W와 열저항0.2K/W/0.4K/W 조합 4개를 스스로 조절해 ΔT와 가상 Tj를 비교하세요.',
 options:[
 {id:'p-times-r-thermal',text:'toy ΔT=P×Rθ이므로20W×0.2K/W=4K,40W×0.4K/W=16K예요. 실제 여러 열경로/시간 응답은 별도입니다.'},
 {id:'m1',text:'TSV와 인터포저를 많이 넣으면 GPU와 HBM의 전력 발열은 사라져요.',correction:'신호 경로를 붙여도 소비된 전력이 저절로 없어지진 않습니다. 열은 별도의 방열경로로 빠져야 해요.'},
 {id:'m2',text:'냉각팬만 설치하면 GPU 소비전력과 시설전력은 정확히 0W가 돼요.',correction:'팬·펌프 자체도 전력을 사용하고 칩의 연산 소비전력을 없애지 않습니다.'},
 {id:'m3',text:'열저항0.2K/W는 냉각 환경·시간·위치와 무관한 실제 절대 상수예요.',correction:'0.2K/W는 교육용 선택값입니다. 실제 열 경로는 접촉·유동·시간·위치·온도에 따라 달라집니다.'}],
 hints:['와트에 K/W를 곱하면 남는 단위는 무엇일까요?','같은 W에서 더 낮은 Rθ면 더 낮은 ΔT입니다.','실물 HBM/GPU는 여러 열경로와 동적 상태가 있어요.'],
 why:'주위25°C와 단일 정상상태 등가 열저항만 고려하면 P20W,Rθ.2→4K 및 가상29°C, P40W,Rθ.4→16K 및41°C입니다. 혼합20×.4=8K,40×.2=8K. 실제 온도는 열원/인터포저/히트스프레더/유체·시간별 열저항 등이 달라질 수 있어 별도 설계 검증이 필요합니다.',
 next:'VRM·CDU와 데이터센터 전원/냉각으로 열 문제를 이어갈까요?',
 beforeVoice:'전력과 열저항을 바꾸면 주위보다 몇 도 올라갈지 먼저 예상하세요.',
 physics:'주위25°C 고정 단일 정상상태 P×Rθ toy. 실제 칩 junction 온도·물리 측정/유량/시간/열 간섭 예측 아님.'
 }
};
export interface Package06LabProps{onEvent?:(e:Package06Event)=>void;onSpeech?:(id:Package06SceneId,txt:string)=>void}
export function Package06SceneLab({onEvent,onSpeech}:Package06LabProps){
 const [index,setIndex]=useState(0),sceneId=package06Order[index],story=SCRIPT[sceneId];
 const [state,setState]=useState<Package06State>(freshPackage06),[prediction,setPrediction]=useState<string|null>(null);
 const [seen,setSeen]=useState<string[]>([]),[answer,setAnswer]=useState<string|null>(null);
 const [feedback,setFeedback]=useState<Package06Grade|null>(null),[hint,setHint]=useState(0),[why,setWhy]=useState(false),[systemMsg,setSystemMsg]=useState('');
 const revealed=prediction!==null,observed=seen.length>0;
 const emit=(type:Package06Event['type'],payload?:Record<string,unknown>)=>onEvent?.({sceneId,type,payload});
 const speak=(txt:string)=>{emit('voice.requested',{text:txt});onSpeech?.(sceneId,txt);};
 const observe=(key:string)=>setSeen(xs=>xs.includes(key)?xs:[...xs,key]);
 function change(next:Package06State,key:string){setState(next);observe(key);setAnswer(null);setFeedback(null);setWhy(false);emit('parameter.changed',{key,accepted:true,physical:next});}
 function enter(i:number){if(i<0||i>=package06Order.length)return;setIndex(i);setState(freshPackage06());setSeen([]);setPrediction(null);setAnswer(null);setFeedback(null);setHint(0);setWhy(false);setSystemMsg('');onEvent?.({sceneId:package06Order[i],type:'scene.enter'});}
 const ctl=(label:string,act:()=>void,on=false)=><button type="button" aria-pressed={on} className={on?'selected':''} onClick={act}>{label}</button>;
 function fab(action:FabAction){
  const x=fabAdvance(state.fab,action);setSystemMsg(x.code+': '+x.feedback);emit('parameter.changed',{action,accepted:x.accepted,code:x.code,history:x.history});
  if(!x.accepted)return;
  setState(prev=>({...prev,fab:x.history,fabError:''}));setAnswer(null);setFeedback(null);setWhy(false);
  if(action==='reset'){setSeen(prev=>prev.filter(k=>!['ordered-fab'].includes(k)));return;}
  if(fabStageValid(x.history))observe('ordered-fab');
 }
 function setScreening(screening:Screening){change({...state,screening},screening);}
 function setDensity(density:0|0.005){change({...state,density},density===0?'density0':'density005');}
 function setAssembly(assembly:1|0.95){change({...state,assembly},assembly===1?'assembly1':'assembly095');}
 function topology(v:PackageTopology){change({...state,topology:v,tsv:false},v==='board'?'board':v==='hbm-stack'?'stack':'interposer-enter');}
 function interposerKind(v:InterposerKind){
  if(state.topology!=='interposer'){setSystemMsg('먼저 GPU+HBM interposer 구조를 선택하세요.');return;}
  change({...state,interposer:v},'interposer-'+v);
 }
 function enableTsv(){
  if(state.topology==='board'){setSystemMsg('PCB board GDDR 모델에서 HBM 스택 내부 TSV를 생성할 수 없습니다.');return;}
  change({...state,tsv:true},'tsv');
 }
 const wrong=story.options.find(x=>x.id===feedback?.misconception)?.correction;
 return <div className="a05-lab a05-package06-lab" lang="ko">
  <header className="a05-head"><p className="a05-eyebrow">A05 · WAFER / CHIPLET / HBM PACKAGING · LESSON 06</p>
   <h1>웨이퍼에서 HBM 패키지와 열까지</h1><p>제조 공정·양품선별·고밀도 인터커넥트·전력 열경로 네 개 탐구</p>
   <nav className="a05-stepnav" aria-label="패키징 네 단계">{package06Order.map((id,i)=><button key={id} type="button" disabled={i>index} aria-current={i===index?'step':undefined} className={i===index?'active':''} onClick={()=>enter(i)}>{i+1}</button>)}</nav>
  </header>
  <main className="a05-stage"><section className="a05-copy" aria-label="학생 예측·실험·원리">
   <span className="a05-eyebrow">{sceneId} · {index+1}/4</span><h2>{story.title}</h2><p className="a05-hook">{story.hook}</p><p className="a05-question">{story.question}</p>
   <div className="a05-box"><h3>결과를 보기 전에 예상하세요</h3><p>{story.prediction}</p><div className="a05-choice-set">
    {story.predictions.map((txt,i)=><button key={i} type="button" disabled={revealed} aria-pressed={prediction===String(i)} className={prediction===String(i)?'selected':''} onClick={()=>{setPrediction(String(i));emit('prediction.recorded',{prediction:i});}}>{txt}</button>)}</div></div>
   {revealed&&<div className="a05-box"><h3>독립 조건을 직접 조작</h3><p>{story.task}</p>
    <div className="a05-package06-controls">
    {sceneId==='fab-pattern-to-die'&&<>
     <strong>섞인 제조 단계 카드 (오른쪽 순서만 유효)</strong><div className="a05-control-buttons">
      {ctl('다이 절단',()=>fab('dice'))}{ctl('웨이퍼 준비',()=>fab('wafer'))}{ctl('전기 테스트',()=>fab('test'))}
      {ctl('포토·마스크',()=>fab('photo'))}{ctl('금속배선',()=>fab('metal'))}{ctl('식각·증착·주입',()=>fab('process'))}
      {ctl('RESET 공정',()=>fab('reset'))}
     </div>
     <strong>반복 층과 결함 마커를 따로 비교</strong><div className="a05-control-buttons">
      {ctl('Layer 1',()=>change({...state,layers:1},'layers1'),state.layers===1)}
      {ctl('Layer 2',()=>change({...state,layers:2},'layers2'),state.layers===2)}
      {ctl('결함 OFF',()=>change({...state,defect:false},'defect0'),!state.defect)}
      {ctl('결함 ON',()=>change({...state,defect:true},'defect1'),state.defect)}
     </div></>}
    {sceneId==='chiplet-yield-model'&&<>
     <strong>독립 결함밀도 D</strong><div className="a05-control-buttons">
      {ctl('D = 0/mm²',()=>setDensity(0),state.density===0)}
      {ctl('D = 0.005/mm²',()=>setDensity(.005),state.density===.005)}</div>
     <strong>패키지 조립 전 선별</strong><div className="a05-control-buttons">
      {ctl('무선별 (none)',()=>setScreening('none'),state.screening==='none')}
      {ctl('이상적 KGD 선별',()=>setScreening('KGD'),state.screening==='KGD')}</div>
     <strong>패키지 한 개당 조립 수율</strong><div className="a05-control-buttons">
      {ctl('Assembly 100%',()=>setAssembly(1),state.assembly===1)}
      {ctl('Assembly 95%',()=>setAssembly(.95),state.assembly===.95)}</div>
    </>}
    {sceneId==='hbm-tsv-interposer'&&<>
     <strong>외부 연결 구조를 독립 비교</strong><div className="a05-control-buttons">
      {ctl('GDDR board PCB',()=>topology('board'),state.topology==='board')}
      {ctl('HBM DRAM stack',()=>topology('hbm-stack'),state.topology==='hbm-stack')}
      {ctl('GPU+HBM interposer',()=>topology('interposer'),state.topology==='interposer')}</div>
     <strong>HBM DRAM 적층 내부 수직선 / GPU 옆 인터포저 종류</strong><div className="a05-control-buttons">
      {ctl('TSV ON (stack 내부)',enableTsv,state.tsv)}
      {ctl('실리콘 interposer',()=>interposerKind('silicon'),state.topology==='interposer'&&state.interposer==='silicon')}
      {ctl('RDL interposer',()=>interposerKind('RDL'),state.topology==='interposer'&&state.interposer==='RDL')}</div>
    </>}
    {sceneId==='package-power-heat'&&<>
     <strong>가상 발열</strong><div className="a05-control-buttons">
      {ctl('Power 20W',()=>change({...state,power:20},'power20'),state.power===20)}
      {ctl('Power 40W',()=>change({...state,power:40},'power40'),state.power===40)}</div>
     <strong>독립 가상 열저항</strong><div className="a05-control-buttons">
      {ctl('Rθ 0.2K/W',()=>change({...state,thermalR:.2},'r02'),state.thermalR===.2)}
      {ctl('Rθ 0.4K/W',()=>change({...state,thermalR:.4},'r04'),state.thermalR===.4)}</div>
    </>}
    {systemMsg&&<p role="status" className="a05-note" data-testid="package06-stage-status" aria-live="polite">{systemMsg}</p>}
    {systemMsg&&<button type="button" onClick={()=>speak(systemMsg)}>현재 공정/배선 안내 듣기</button>}
    </div></div>}
   {revealed&&observed&&<div className="a05-box"><h3>직접 관찰한 뒤 이유 설명</h3><div className="a05-choice-set">
    {story.options.map(option=><button type="button" key={option.id} aria-pressed={answer===option.id} className={answer===option.id?'selected':''} onClick={()=>{setAnswer(option.id);setFeedback(null);setWhy(false);}}>{option.text}</button>)}</div>
    <button type="button" className="a05-primary" onClick={()=>{const r=gradePackage06(sceneId,seen,answer);setFeedback(r);emit('answer.checked',{passed:r.passed,misconception:r.misconception,evidence:seen});}}>관찰·물리 WHY 평가</button>
   </div>}
   <div className="a05-tools"><button type="button" onClick={()=>speak(story.beforeVoice)}>한국어 질문 듣기</button>
    {revealed&&<button type="button" disabled={hint===3} onClick={()=>{const next=Math.min(3,hint+1);setHint(next);emit('hint.opened',{level:next});}}>힌트 {hint}/3</button>}</div>
   {hint>0&&<div className="a05-hint">{story.hints.slice(0,hint).map((hint,i)=><p key={i}>{i+1}. {hint}</p>)}</div>}
   {feedback&&<section role="status" aria-live="polite" className="a05-result">
    <h3>{feedback.passed?'패키징의 원리와 수치를 확인했어요!':'빠진 조건을 다시 관찰해 보세요'}</h3>
    {feedback.conditions.map(x=><p key={x.key}><strong>{x.passed?'✓':'△'} {x.key}</strong> — {x.passed?'완료':x.help}</p>)}
    {!feedback.passed&&wrong&&<p data-testid="package06-keyed-feedback">{wrong}</p>}
    <button type="button" onClick={()=>speak(feedback.passed?story.next:wrong||feedback.conditions.filter(x=>!x.passed).map(x=>x.help).join(' '))}>피드백 듣기</button>
    <button type="button" onClick={()=>setWhy(!why)}>{why?'해설 접기':'왜? 자세한 원리 보기'}</button>
   </section>}
   {feedback&&why&&<div className="a05-why"><h3>왜?</h3><p>{feedback.passed?story.why:'독립 조건을 모두 관찰하고 원리를 맞혀야 해설이 열립니다.'}</p>{feedback.passed&&<p>{story.next}</p>}</div>}
   {feedback?.passed&&index<3&&<button type="button" className="a05-primary" onClick={()=>enter(index+1)}>다음 장면으로 →</button>}
   {feedback?.passed&&index===3&&<p className="a05-why">06 패키징 4장면 독립 학습 완료. 공식 A02 LessonPlayer/Voice/진도 저장은 별도 인계 범위입니다.</p>}
  </section>
  <section className="a05-canvas-col" aria-label="웨이퍼·칩렛·HBM 2.5D 원본 도식">
   <div className="a05-canvas-header"><span>A05 PACKAGING 06 · ORIGINAL SVG</span><span>{revealed&&observed?'학생 조작 결과':'정답/숫자 조작 전 숨김'}</span></div>
   <Package06SceneVisual sceneId={sceneId} state={state} revealed={revealed&&observed}/>
   <div className="a05-model-limit"><strong>물리 범위</strong> {revealed&&observed?story.physics:'학생이 직접 예상하고 독립 조건을 조작한 다음에야 교육용 수치와 제한을 공개합니다.'}</div>
   <div className="a05-source">A06 06 authoritative blob 7a40bec1 · A07 EDU_QA_PASS_SOURCE · 실제 실리콘 패키지 수율·온도 실측이 아닌 교육용 모형</div>
  </section></main></div>;
}
