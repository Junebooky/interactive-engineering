import {useId} from 'react';
import type {ReactNode} from 'react';
import {access6T,dataLocality,latch,simulateLru} from './sramModel';
import type {AccessMode,Bit,SramSceneId} from './sramModel';

export interface SramVisualState{
  q:Bit; feedback:boolean; supply:boolean;
  wl:Bit; bl:Bit; mode:AccessMode;
  cacheLines:1|2; cacheRan:boolean;
  resident:boolean; inputCount:number;
}
type Props={sceneId:SramSceneId;state:SramVisualState;revealed:boolean};
const M='#73e9cb',C='#66cce9',G='#ffd28a';
function Label({x,y,children,color='#e3f5f8',size=14}:{
 x:number;y:number;children:ReactNode;color?:string;size?:number
}){return <text x={x} y={y} fill={color} fontWeight="650" fontSize={size}>{children}</text>;}
function Tile({x,y,w,h,title,subtitle,fill='#20445a',accent=M}:{
 x:number;y:number;w:number;h:number;title:string;subtitle:string;fill?:string;accent?:string
}){return <g>
  <rect x={x+8} y={y+10} width={w} height={h} rx="13" fill="#061c2d" opacity=".7"/>
  <path d={`M${x} ${y} h${w-14} l14 12 v${h-12} h-${w} Z`} fill={fill} stroke={accent} strokeWidth="2"/>
  <path d={`M${x} ${y} h${w-14} l14 12 h-${w} Z`} fill={accent} opacity=".28"/>
  <Label x={x+13} y={y+28} size={15}>{title}</Label>
  <Label x={x+13} y={y+48} size={12} color="#d3e8ee">{subtitle}</Label>
</g>;}
export function SramSceneVisual({sceneId,state,revealed}:Props){
  const uid=useId().replace(/:/g,''); const grad='a05sram'+uid;
  if(!revealed)return <div className="a05-veiled" aria-label="예측 전 SRAM 실험 결과 가림">
    <div className="a05-veiled-object" aria-hidden="true"><span/></div>
    <p>먼저 추측해 보세요. 선택을 기록하면 회로와 관찰값이 나타납니다.</p>
  </div>;
  const lat=latch(state.q,state.feedback,state.supply);
  const cell=access6T(state.q,state.wl,state.bl,state.mode);
  const cache=simulateLru(state.cacheLines);
  const data=dataLocality(state.resident);
  return <div className="a05-visual a05-sram-visual">
    <svg viewBox="0 0 650 420" role="img" aria-label={
      sceneId==='sram-cross-coupled-inverters'?'교차 피드백 CMOS 인버터가 상보 상태를 유지하는 2.5D 회로':
      sceneId==='sram-6t-access'?'4T 교차 인버터와 2T 접근 트랜지스터로 이루어진 SRAM 셀':
      sceneId==='cpu-cache-vs-dram'?'CPU 캐시 용량별 가상 LRU 적중과 총 처리비용':
      'GPU 가중치 상주 여부에 따른 CPU DDR, SSD와 GPU 메모리 데이터 경로'
    }>
      <defs><linearGradient id={grad} x1="0" x2="1" y1="0" y2="1">
        <stop stopColor="#326b80"/><stop offset=".55" stopColor="#234159"/><stop offset="1" stopColor="#0c263a"/>
      </linearGradient></defs>
      <path d="M45 40 H559 L593 70 V349 H80 L45 316 Z" fill={'url(#'+grad+')'} stroke="#86b6ca" strokeWidth="2"/>
      <path d="M559 40 L593 70 V349 L559 317 Z" fill="#153044" stroke="#80aabe"/>
      <rect x="45" y="40" width="514" height="278" rx="15" fill="#132d43" stroke="#82b7c4"/>
      <path d="M62 54 H538" stroke="#d1fff6" strokeOpacity=".28" strokeWidth="2"/>
      <g data-scene-subject="sram-latch-or-path" data-scene-id={sceneId}>
      {sceneId==='sram-cross-coupled-inverters'&&<>
        <Label x={76} y={81} size={20} color={M}>서로 마주 보는 두 CMOS 인버터</Label>
        <path d="M135 114 H484" stroke={state.supply?G:'#63768a'} strokeWidth="3"/>
        <Label x={270} y={109} color={G} size={13}>전원 {state.supply?'ON':'OFF'}</Label>
        <Tile x={90} y={143} w={194} h={87} title="CMOS NOT #1" subtitle="Q ← NOT(Q̅)" accent={M}/>
        <Tile x={360} y={143} w={194} h={87} title="CMOS NOT #2" subtitle="Q̅ ← NOT(Q)" accent={C}/>
        <path d="M284 169 H359 M359 210 H285" stroke={state.feedback?M:'#698295'} strokeWidth="5"
          strokeDasharray={state.feedback?undefined:'7 8'} fill="none"/>
        <path d="M345 161 L360 169 L345 177 Z" fill={state.feedback?M:'#698295'}/>
        <path d="M300 202 L285 210 L300 218 Z" fill={state.feedback?C:'#698295'}/>
        <Label x={249} y={261} color={M} size={16}>Q = {lat.q??'?'}</Label>
        <Label x={378} y={261} color={C} size={16}>Q̅ = {lat.qBar??'?'}</Label>
        <Label x={121} y={297} color="#c9e3ec" size={12}>{lat.note}</Label>
      </>}
      {sceneId==='sram-6t-access'&&<>
        <Label x={72} y={80} color={M} size={19}>SRAM 6T · 4T 래치 + 2T 접근 nMOS</Label>
        <path d="M107 139 H542" stroke={G} strokeWidth="5"/><Label x={251} y={130} color={G}>WL {state.wl?'ON':'OFF'}</Label>
        <Tile x={168} y={171} w={135} h={77} title="인버터 #1" subtitle="2 MOSFET" accent={M}/>
        <Tile x={353} y={171} w={135} h={77} title="인버터 #2" subtitle="2 MOSFET" accent={C}/>
        <path d="M302 193 H353 M353 231 H302" stroke="#aefbec" strokeWidth="3"/>
        <Tile x={83} y={168} w={80} h={81} title="1T" subtitle={state.wl?'ON':'OFF'} accent={G}/>
        <Tile x={494} y={168} w={80} h={81} title="1T" subtitle={state.wl?'ON':'OFF'} accent={G}/>
        <path d="M118 144 V167 M528 144 V167" stroke={G} strokeWidth="3"/>
        <Label x={96} y={276} size={13} color={C}>BL {state.bl}</Label>
        <Label x={478} y={276} size={13} color={C}>BLB {1-state.bl}</Label>
        <Label x={227} y={281} size={16} color={M}>Q {cell.q}</Label>
        <Label x={360} y={281} size={16} color={C}>Q̅ {cell.qBar}</Label>
        <Label x={98} y={308} size={12} color="#d0e9ed">{state.mode==='read'?'읽기 중: 실제 소자에서 read disturb 가능':'쓰기: WL ON 시 외부 bitline drive가 래치 상태를 이김'}</Label>
      </>}
      {sceneId==='cpu-cache-vs-dram'&&<>
        <Label x={71} y={83} color={M} size={20}>CPU → SRAM 캐시 → DRAM</Label>
        <Tile x={78} y={113} w={145} h={88} title="CPU Core" subtitle="A,A,B,A,C 요청" accent={C}/>
        <Tile x={248} y={113} w={153} h={88} title={'SRAM '+state.cacheLines+' line'} subtitle={state.cacheRan?cache.hits+' HIT / '+cache.misses+' MISS':'직접 실행해 보기'} accent={M}/>
        <Tile x={431} y={113} w={132} h={88} title="DRAM" subtitle="MISS → 10 toy" accent={G}/>
        <path d="M223 151 H248 M401 151 H431" stroke="#afe7ee" strokeWidth="4" strokeDasharray="7 6"/>
        <Label x={79} y={238} size={13} color="#c9e1ec">히트 1 / 미스 10 · 단위: toy 시간 (ns 아님)</Label>
        {state.cacheRan&&<>
          {cache.frames.map((frame,i)=><g key={i}>
            <rect x={80+i*97} y="254" width="90" height="39" rx="8"
              fill={frame.hit?'#317b72':'#6b4e45'} stroke={frame.hit?M:G}/>
            <Label x={88+i*97} y={270} size={12} color="#fff9e5">{frame.request} {frame.hit?'HIT':'MISS'}</Label>
            <Label x={90+i*97} y={286} size={12} color="#fff9e5">+{frame.cost} toy</Label>
          </g>)}
        </>}
        <Label x={85} y={312} color={M} size={13}>{state.cacheRan?'누적 '+cache.total+' toy units':'실행 버튼으로 시간 흐름 관찰'}</Label>
      </>}
      {sceneId==='cpu-to-gpu-data-locality'&&<>
        <Label x={75} y={80} color={M} size={19}>모델 가중치의 이동과 입력의 이동을 구분</Label>
        <Tile x={72} y={123} w={144} h={81} title="eSSD / DDR" subtitle="호스트 메모리" accent={C}/>
        <Tile x={261} y={123} w={132} h={81} title="CPU / LINK" subtitle="호스트→GPU" accent={G}/>
        <Tile x={438} y={123} w={133} h={81} title="GPU VRAM" subtitle="GDDR 또는 HBM" accent={M}/>
        <path d="M215 156 H261 M393 156 H438" stroke={state.resident?'#5c7489':G}
          strokeWidth="5" strokeDasharray={state.resident?'4 7':undefined}/>
        <Label x={89} y={246} size={14} color={state.resident?M:G}>{state.resident?'GPU에 이미 있는 가중치 재사용':'가중치 GPU 적재 경로 필요'}</Label>
        <path d="M142 269 L480 269" stroke={C} strokeWidth="4" strokeDasharray="8 5"/>
        <path d="M467 261 L481 269 L467 277 Z" fill={C}/>
        <Label x={90} y={291} size={13} color={C}>새 입력·활성값은 계속 이동: {state.inputCount}회</Label>
        <Label x={95} y={310} size={11} color="#bcd4e0">대표 분리형 GPU 예시, 통합 메모리 대안 존재</Label>
      </>}
      </g>
      <Label x={71} y={381} size={12} color="#aecbd6">교육용 이상 논리·가상 시간·아키텍처 모형 · 물리 축척/실측 성능 아님</Label>
    </svg>
    <div className="a05-readouts" aria-live="polite">
      {sceneId==='sram-cross-coupled-inverters'?<>
        <span>되먹임<b>{state.feedback?'ON':'OFF'}</b></span><span>전원<b>{state.supply?'ON':'OFF'}</b></span>
        <span>Q / Q̅<b>{lat.q??'?'} / {lat.qBar??'?'}</b></span><span>정적 보존<b>{lat.stable?'가능':'보장 안 됨'}</b></span>
      </>:sceneId==='sram-6t-access'?<>
        <span>워드라인<b>{state.wl?'ON':'OFF'}</b></span><span>BL / BLB<b>{state.bl} / {1-state.bl}</b></span>
        <span>Q / Q̅<b>{cell.q} / {cell.qBar}</b></span><span>읽기 교란 위험<b>{cell.readDisturbPossible?'있음':'현재 미모델링'}</b></span>
      </>:sceneId==='cpu-cache-vs-dram'?<>
        <span>캐시 라인<b>{state.cacheLines}</b></span><span>히트<b>{state.cacheRan?cache.hits:'관찰 전'}</b></span>
        <span>미스<b>{state.cacheRan?cache.misses:'관찰 전'}</b></span><span>총 비용<b>{state.cacheRan?cache.total+' toy':'관찰 전'}</b></span>
      </>:<>
        <span>모델 GPU 상주<b>{state.resident?'YES':'NO'}</b></span><span>가중치 업로드<b>{data.modelUploadNeeded?'필요':'재사용'}</b></span>
        <span>새 입력 이동<b>{data.inputTransferRequired?'항상 존재':'없음'}</b></span><span>입력 실행<b>{state.inputCount}회</b></span>
      </>}
    </div>
  </div>;
}
