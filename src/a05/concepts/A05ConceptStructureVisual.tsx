import React, {useId, useState} from 'react';
import './a05Concepts.css';

/** A05 science-owned CONCEPT structure pack. NO experiment values, equations, currents,
 * solutions or learning-completion signals are emitted by these static diagrams.
 * A02 owns each published step's visual registry/FSM; A03 owns UX approval. */
export const A05_CONCEPT_VISUAL_IDS = [
 'circuit-intro','ohms-intro','pn-intro','mos-cap-intro','mosfet-intro',
 'dram-intro','sram-intro','nand-intro','gpu-intro','gears-intro',
] as const;
export type A05ConceptVisualId = typeof A05_CONCEPT_VISUAL_IDS[number];
export interface A05ConceptStructureProps {
 visualId:string;
 /** A02 may pass existing registry text; safe diagram never renders dynamic story spoilers. */
 title?:string;subtitle?:string;caption?:string;
}

export const A05_CONCEPT_META:Readonly<Record<A05ConceptVisualId,{title:string;detail:string;limitation:string}>>={
 'circuit-intro':{title:'전원·스위치·저항의 관계',detail:'전원, 열린 접점, 전기적 연결과 부하의 위치',limitation:'개념용 회로 접속도. 전압·전류·정답·측정치 미표시'},
 'ohms-intro':{title:'직류 측정 회로 구조',detail:'전원·전류계·부하와 병렬 전압 측정 단자',limitation:'측정기 위치 개념도. 실제 전압·전류·부하 상태 미계산'},
 'pn-intro':{title:'P형·N형 실리콘 접합',detail:'다수 캐리어, 접합 부근 공핍층과 이온화 도펀트',limitation:'평형 구조의 정성적 단면. 공간전하 폭·전류·바이어스 비계량'},
 'mos-cap-intro':{title:'MOS 커패시터의 층 구조',detail:'게이트 전극과 실리콘 사이에 절연 산화막이 존재',limitation:'이상적 층 단면. 전하 축적 방향·용량·전압 결과 미표시'},
 'mosfet-intro':{title:'nMOS 트랜지스터 단면',detail:'소스·드레인과 절연된 게이트·실리콘 기판',limitation:'게이트 채널은 조건 의존적. 사전 단계에서 도통 상태를 단정하지 않음'},
 'dram-intro':{title:'DRAM 1T1C 셀 연결',detail:'워드라인 게이트·비트라인 접속·저장 커패시터',limitation:'셀 토폴로지만 표시. 저장 비트·전하량·감지·복원 결과 미표시'},
 'sram-intro':{title:'SRAM 6T 셀 연결',detail:'교차 결합 CMOS 인버터 2개와 접근 트랜지스터 2개',limitation:'6T 논리 수준의 배선 개요. Q/반전Q의 실제 저장값 미표시'},
 'nand-intro':{title:'3D NAND 수직 스트링',detail:'수직 채널을 둘러싼 워드라인 게이트와 선택 소자',limitation:'층상 구조의 개념용 절개도. 트랩 전하·문턱·보존 기간 미표시'},
 'gpu-intro':{title:'GPU 연산과 외부 메모리',detail:'연산 클러스터·메모리 제어기·선택 가능한 HBM 스택 경로',limitation:'배치·데이터 연결 개념도. 실제 대역폭·FLOPS·성능 미표시'},
 'gears-intro':{title:'외접 기어 두 개의 기계적 맞물림',detail:'두 회전축과 피치원·실제 치형의 기하학적 접촉',limitation:'교육용 단순 치형. 실제 치압각·백래시·각속도·토크 미계산'},
};

/** Basic isometric slab; layered top/front/right surfaces have meaningful depth, not pseudo-result animation. */
function Plate({x,y,w,h,label,accent='#78d9d4',fill='#21485d',small=false}:{
 x:number;y:number;w:number;h:number;label:string;accent?:string;fill?:string;small?:boolean
}){
 return <g>
  <path d={`M${x} ${y+h}l12 9h${w}l-12-9z`} fill="#102735" stroke="#668da0" strokeWidth="1"/>
  <path d={`M${x+w} ${y}l12 9v${h}l-12-9z`} fill="#132c3b" stroke="#668da0" strokeWidth="1"/>
  <rect x={x} y={y} width={w} height={h} rx="5" fill={fill} stroke={accent} strokeWidth="1.6"/>
  <path d={`M${x+8} ${y+7}H${x+w-8}`} stroke={accent} opacity=".32" strokeWidth="2"/>
  <text x={x+w/2} y={y+h/2+5} textAnchor="middle" fontSize={small?11:14} fontWeight="700" fill="#f4fbfc">{label}</text>
 </g>;
}
function Note({x,y,children,anchor='middle',color='#bcdce4'}:{
 x:number;y:number;children:React.ReactNode;anchor?:'middle'|'start'|'end';color?:string
}){return <text x={x} y={y} textAnchor={anchor} fill={color} fontSize="12" fontWeight="600">{children}</text>;}
function Wire({d,kind='signal'}:{d:string;kind?:'signal'|'select'|'quiet'}){
 return <path d={d} fill="none" stroke={kind==='select'?'#f1c577':kind==='quiet'?'#799fae':'#87d8e1'} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round"/>;
}
function Gear({cx,cy,n=12,angle=0,r=54,tint='#58bdd2'}:{cx:number;cy:number;n?:number;angle?:number;r?:number;tint?:string}){
 const points:string[]=[];
 // Stylized tooth outlines around pitch circle, not an involute/dynamic torque simulation.
 for(let k=0;k<n;k++){
  const theta=angle+(k/n)*Math.PI*2;
  for(const [phase,rad] of [[0,r-8],[.17,r+7],[.47,r+7],[.66,r-8],[.98,r-8]]){
   const a=theta+phase*Math.PI*2/n;
   points.push(`${(cx+Math.cos(a)*rad).toFixed(2)},${(cy+Math.sin(a)*rad).toFixed(2)}`);
  }
 }
 return <g>
  <path d={`M ${points.join(' L ')} Z`} fill="#21495c" stroke={tint} strokeWidth="2.4"/>
  <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e3f7f8" strokeDasharray="4 8" opacity=".28"/>
  <circle cx={cx} cy={cy} r="17" fill="#122b3b" stroke={tint} strokeWidth="2"/>
  <circle cx={cx} cy={cy} r="5" fill="#c0e0e4"/>
 </g>;
}

export function A05ConceptStructureVisual({visualId}:A05ConceptStructureProps){
 const uid=useId().replace(/:/g,'');
 const [zoomed,setZoomed]=useState(false);
 const meta=(A05_CONCEPT_VISUAL_IDS as readonly string[]).includes(visualId)
  ? A05_CONCEPT_META[visualId as A05ConceptVisualId] : undefined;
 // Fail visibly rather than misidentifying an unknown domain as a basic battery circuit.
 if(!meta)return <div role="status" className="a05-concept-unsupported">구조 시각화 매핑이 없습니다. 담당자 검수가 필요합니다.</div>;
 return <figure className="a05-concept-stage a03-concept-visual" data-testid="a05-concept-stage" data-visual-id={visualId} data-zoomed={zoomed}>
  <div className="a05-concept-toolbar"><span>구조 모형 · 측정값 없음</span>
   <button type="button" aria-pressed={zoomed} onClick={()=>setZoomed(v=>!v)} aria-label={zoomed?'구조 원래 크기':'구조 확대'}>{zoomed?'원래 크기':'구조 확대'}</button>
  </div>
  <div className={zoomed?'a05-concept-scroll is-zoomed':'a05-concept-scroll'} data-testid="a05-concept-scroll">
  <svg viewBox="0 0 640 360" role="img" tabIndex={0} aria-label={meta.title+'. '+meta.detail+'. '+meta.limitation} className="a05-concept-svg">
   <title id={uid+'-title'}>{meta.title}</title>
   <desc id={uid+'-desc'}>{meta.detail}. {meta.limitation}.</desc>
   <rect x="2" y="2" width="636" height="356" rx="15" fill="#102333"/>
   <path d="M22 56L612 56M22 321L612 321" stroke="#36556a" strokeWidth="1"/>
   <text x="24" y="35" fontSize="16" fontWeight="800" fill="#f1fcfd">{meta.title}</text>
   <text x="24" y="341" fontSize="11" fill="#c5dfe5">개념 구조 도해 · 실험값·정답 아님</text>

   {visualId==='circuit-intro'&&<g data-scene-subject="circuit-intro" data-scene-id="circuit-intro">
    <Plate x={55} y={131} w={110} h={100} label="DC 전원" accent="#f1c577" fill="#574735"/>
    <Note x={110} y={122} color="#f1c577">+ 단자</Note><Note x={110} y={264}>− 단자</Note>
    <Wire d="M110 130V93H262" />
    <Wire d="M348 93H494V169"/><Wire d="M494 221V283H110V231"/>
    <circle cx="262" cy="93" r="7" fill="#77dfcc"/><circle cx="348" cy="93" r="7" fill="#77dfcc"/>
    <Wire d="M262 93L329 63" kind="select"/><Note x={301} y={57} color="#f1c577">열린 접점(모형)</Note>
    <Plate x={443} y={169} w={101} h={52} label="저항 부하" />
    <Note x={302} y={299}>회로 요소의 위치 관계</Note>
   </g>}

   {visualId==='ohms-intro'&&<g data-scene-subject="ohms-intro" data-scene-id="ohms-intro">
    <Plate x={60} y={136} w={104} h={96} label="전원" accent="#f1c577"/>
    <Wire d="M112 136V91H213"/><Wire d="M274 91H501V150"/><Wire d="M501 214V283H112V232"/>
    <Plate x={213} y={67} w={61} h={48} label="A" accent="#75c9e0"/>
    <Plate x={455} y={150} w={92} h={64} label="저항" />
    <Wire d="M501 150V130H320V165"/>
    <Wire d="M501 214V257H320V213"/>
    <Plate x={290} y={165} w={61} h={48} label="V" accent="#75c9e0"/>
    <Note x={256} y={131}>전류계 직렬</Note><Note x={321} y={243}>전압계 병렬</Note>
    <Note x={308} y={301}>측정 단자의 상대적 위치만 설명</Note>
   </g>}

   {visualId==='pn-intro'&&<g data-scene-subject="pn-intro" data-scene-id="pn-intro">
    <Plate x={69} y={130} w={233} h={140} label="P형 영역" accent="#75bfe5"/>
    <Plate x={312} y={130} w={233} h={140} label="N형 영역" accent="#79e2c7"/>
    <rect x="273" y="130" width="70" height="140" fill="#8c8c62" fillOpacity=".35" stroke="#f1c577" strokeDasharray="4 5" strokeWidth="2"/>
    <Note x={186} y={117}>정공이 다수</Note><Note x={428} y={117}>전자가 다수</Note>
    <Note x={307} y={96} color="#f1c577">접합 근처 공핍층(개략)</Note>
    {[145,185,225].map(y=><g key={y}>
      <circle cx="287" cy={y} r="9" fill="#deaa74"/><text x="287" y={y+4} textAnchor="middle" fontSize="12" fill="#102333">−</text>
      <circle cx="328" cy={y} r="9" fill="#9bded0"/><text x="328" y={y+4} textAnchor="middle" fontSize="12" fill="#102333">+</text>
    </g>)}
    <Note x={307} y={296}>P측 음의 억셉터 · N측 양의 도너 고정 이온</Note>
   </g>}

   {visualId==='mos-cap-intro'&&<g data-scene-subject="mos-cap-intro" data-scene-id="mos-cap-intro">
    <Plate x={146} y={92} w={355} h={49} label="게이트 전극" accent="#b9cfe0" fill="#526575"/>
    <Plate x={146} y={145} w={355} h={26} label="절연 산화막" accent="#f1c577" fill="#765636" small/>
    <Plate x={146} y={175} w={355} h={124} label="실리콘 기판" accent="#77bad9"/>
    <Note x={102} y={117} anchor="middle">금속</Note><Note x={90} y={161}>절연체</Note>
    <Note x={78} y={235}>반도체</Note><Note x={319} y={312}>게이트–기판 사이에 직류 도전 경로 없음(이상적 절연)</Note>
   </g>}

   {visualId==='mosfet-intro'&&<g data-scene-subject="mosfet-intro" data-scene-id="mosfet-intro">
    <Plate x={200} y={83} w={237} h={43} label="게이트" accent="#d8e1eb" fill="#536879"/>
    <Plate x={200} y={130} w={237} h={22} label="절연 산화막" accent="#f1c577" fill="#715036" small/>
    <Plate x={73} y={156} w={490} h={140} label="P형 바디 / 실리콘" accent="#7cb6d6"/>
    <rect x="97" y="155" width="115" height="67" rx="4" fill="#176353" stroke="#77e8cb" strokeWidth="2"/>
    <rect x="431" y="155" width="111" height="67" rx="4" fill="#176353" stroke="#77e8cb" strokeWidth="2"/>
    <Note x={152} y={196} color="#f5fcfc">N+ 소스</Note><Note x={485} y={196} color="#f5fcfc">N+ 드레인</Note>
    <rect x="215" y="158" width="215" height="17" rx="5" fill="none" stroke="#e4cf92" strokeDasharray="6 5" strokeWidth="2"/>
    <Note x={323} y={192} color="#f1c577">채널 가능 영역</Note>
    <Note x={318} y={313}>게이트는 산화막으로 실리콘과 분리됨</Note>
   </g>}

   {visualId==='dram-intro'&&<g data-scene-subject="dram-intro" data-scene-id="dram-intro">
    <Wire d="M82 110H248" kind="quiet"/><Note x={166} y={95}>비트라인 (BL)</Note>
    <Wire d="M248 110V159"/><Plate x={211} y={160} w={75} h={53} label="1T" accent="#7dded4"/>
    <Wire d="M286 186H381"/>
    <Wire d="M230 238V215" kind="select"/><Wire d="M71 238H230" kind="select"/>
    <Note x={144} y={255} color="#f1c577">워드라인 (WL) → 게이트</Note>
    <Wire d="M381 186V154"/>
    <path d="M353 154H409M353 171H409" stroke="#7addcc" strokeWidth="6"/>
    <Wire d="M381 171V243" kind="quiet"/>
    <Plate x={351} y={243} w={71} h={32} label="기준" accent="#9bb8c4" small/>
    <Note x={454} y={158} anchor="start">1C 저장</Note>
    <Note x={454} y={178} anchor="start">커패시터</Note>
    <Note x={313} y={294}>1T 스위치와 1C는 직렬로 데이터 경로에 접속</Note>
   </g>}

   {visualId==='sram-intro'&&<g data-scene-subject="sram-intro" data-scene-id="sram-intro">
    <Plate x={161} y={126} w={124} h={67} label="NOT A" accent="#67c6e1"/>
    <Plate x={369} y={126} w={124} h={67} label="NOT B" accent="#67c6e1"/>
    <Wire d="M285 146H316V99H348V146H369" kind="select"/>
    <Wire d="M493 177H537V236H118V177H161" kind="select"/>
    <Note x={325} y={91} color="#f1c577">교차 피드백</Note>
    <Note x={311} y={265}>Q · Q̅ 노드는 서로의 입력에 되돌아감</Note>
    <Plate x={63} y={126} w={70} h={65} label="접근 T" small/>
    <Plate x={522} y={126} w={75} h={65} label="접근 T" small/>
    <Wire d="M133 157H161"/><Wire d="M493 157H522"/>
    <Wire d="M98 126V92H557V126" kind="select"/>
    <Note x={320} y={79} color="#f1c577">공통 WL (접근 트랜지스터 게이트)</Note>
    {/* Actual external BL / complementary BL̅ terminals terminate on the OUTER
         contacts of the two access FETs; the common WL above only touches gates. */}
    <Wire d="M38 159H63" /><Wire d="M597 159H620" />
    <Wire d="M38 106V159" kind="quiet"/><Wire d="M620 106V159" kind="quiet"/>
    <Note x={38} y={98} anchor="middle" color="#87d8e1">BL</Note>
    <Note x={606} y={98} anchor="middle" color="#87d8e1">BL̅</Note>
    <Note x={325} y={297}>4T 래치 + 2T 접근 = 6T (개념 수준)</Note>
   </g>}

   {visualId==='nand-intro'&&<g data-scene-subject="nand-intro" data-scene-id="nand-intro">
    <rect x="188" y="85" width="80" height="221" rx="18" fill="#176457" stroke="#80e4d1" strokeWidth="3"/>
    <Note x={228} y={77}>수직 채널 홀</Note>
    {[113,159,205,251].map((y,i)=><g key={i}>
     <path d={`M127 ${y}h202v25H127z`} fill="#29526b" stroke="#77cfe8" strokeWidth="1.5"/>
     <rect x="184" y={y-3} width="88" height="31" rx="8" fill="#bb8547" fillOpacity=".58" stroke="#f1c577" strokeWidth="1"/>
     <Note x={410} y={y+18} anchor="start">WL {i+1} / 셀 게이트</Note>
     <Wire d={`M330 ${y+11}H393`} kind="quiet"/>
    </g>)}
    <Plate x={178} y={54} w={101} h={27} label="상단 선택" small accent="#f1c577"/>
    <Plate x={178} y={305} w={101} h={27} label="하단 선택" small accent="#f1c577"/>
    <Note x={447} y={304}>게이트 / 절연막 / 트랩층 반복</Note>
   </g>}

   {visualId==='gpu-intro'&&<g data-scene-subject="gpu-intro" data-scene-id="gpu-intro">
    <Plate x={61} y={117} w={220} h={155} label="GPU 연산 클러스터" accent="#73cbe4"/>
    {[0,1,2].map(i=>[0,1,2,3].map(j=><rect key={i+'-'+j} x={92+j*43} y={171+i*24} width="33" height="15" rx="3" fill="#2a8b7c" stroke="#7de4d1"/>))}
    <Plate x={309} y={143} w={84} h={103} label="제어기" accent="#f1c577" small/>
    <Wire d="M281 195H309"/><Wire d="M393 195H437"/>
    {[0,1,2,3].map(i=><rect key={i} x="440" y={128+i*31} width="140" height="25" rx="4" fill="#47606b" stroke="#b8d4da" strokeWidth="1.5"/>)}
    <Note x={510} y={120}>HBM 스택 (예시)</Note>
    <Note x={324} y={293}>GPU ↔ 컨트롤러 ↔ 메모리 경로의 개념 배치</Note>
   </g>}

   {visualId==='gears-intro'&&<g data-scene-subject="gears-intro" data-scene-id="gears-intro">
    <Gear cx={238} cy={190} n={12} r={58} tint="#7ac5e7"/>
    <Gear cx={355} cy={190} n={12} angle={Math.PI/12} r={58} tint="#7be4cb"/>
    <circle cx={296.5} cy={190} r="5" fill="#f1c577"/>
    <Wire d="M238 130V98M355 130V98" kind="quiet"/>
    <Note x={238} y={88}>축 1</Note><Note x={355} y={88}>축 2</Note>
    <Note x={294} y={289}>외접 치형의 정적 배치 · 두 축의 기하학적 관계</Note>
    <Note x={311} y={311}>움직임·속도·토크 크기는 실험에서 관찰</Note>
   </g>}
  </svg>
  </div>
  <figcaption className="a05-concept-caption"><strong>{meta.detail}</strong><span>{meta.limitation}</span></figcaption>
 </figure>;
}
