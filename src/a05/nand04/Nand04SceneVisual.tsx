import {useId} from 'react';
import {nand04Ai,nand04Pages,nand04Ssd,nand04Threshold,nand04Transport} from './nand04Model';
import type {Nand04SceneId,Nand04State} from './nand04Model';
function Txt({x,y,children,fill='#e5fdff',size=14}:{x:number;y:number;children:React.ReactNode;fill?:string;size?:number}){
 return <text x={x} y={y} fill={fill} fontSize={size} fontWeight="600">{children}</text>;
}
function Layer({x,y,w=138,h=74,title,sub,color='#55dbca'}:{x:number;y:number;w?:number;h?:number;title:string;sub:string;color?:string}){
 return <g><rect x={x+9} y={y+10} width={w} height={h} rx="9" fill="#081b2a" opacity=".7"/>
  <path d={`M${x} ${y} h${w-17} l17 13 v${h-13} h-${w} Z`} fill="#21465c" stroke={color} strokeWidth="2"/>
  <path d={`M${x} ${y} h${w-17} l17 13 h-${w} Z`} fill={color} opacity=".35"/>
  <Txt x={x+9} y={y+29} fill="#f4ffff" size={15}>{title}</Txt>
  <Txt x={x+9} y={y+50} fill="#badce7" size={11}>{sub}</Txt></g>;
}
export function Nand04SceneVisual({sceneId,state,revealed}:{sceneId:Nand04SceneId;state:Nand04State;revealed:boolean}){
 const uid=useId().replace(/:/g,'');
 if(!revealed)return <div className="a05-veiled" aria-label="NAND 실험 상태/교사 정답은 학생 예측 전에 공개하지 않습니다">
  <div className="a05-veiled-object" aria-hidden="true"><span/></div><p>직접 예상한 뒤 전하·페이지·전송 경로를 실험으로 열어보세요.</p>
 </div>;
 const threshold=nand04Threshold(state.cell,state.readV,state.power);
 const page=nand04Pages(state.pageStage),ssd=nand04Ssd(state.writePattern,state.ecc,state.plp,state.dramCache);
 const xfer=nand04Transport(state.transport),ai=nand04Ai(state.ai,state.servers);
 return <div className="a05-visual a05-nand04-visual">
  <svg role="img" viewBox="0 0 680 400" aria-label={
   sceneId==='nand-threshold'?'NAND 저장 전하에 따른 읽기 문턱, 전원 ON/OFF 도식':
   sceneId==='nand-page-block'?'장난감 2블록×4페이지 실제 유효·무효·빈 NAND 배열':
   sceneId==='ssd-ftl-reliability'?'SSD 논리주소 변환, 선택적 ECC·PLP·DRAM 컨트롤러 도식':
   sceneId==='nvme-transfer'?'NVMe 요청과 PCIe DMA 읽기 데이터의 단계별 다른 방향':
   'SSD, CPU DDR, GPU 메모리, GPU 연산기, 네트워크가 시나리오별로 연결되는 도식'
  }>
   <defs><linearGradient id={'nand'+uid}><stop stopColor="#285773"/><stop offset="1" stopColor="#0e2b40"/></linearGradient></defs>
   <path d="M30 58 H594 L645 94 V335 L80 360 L30 326 Z" fill={'url(#nand'+uid+')'} stroke="#73cfd0" strokeWidth="2"/>
   <path d="M594 58 L645 94 V335 L594 298 Z" fill="#112c43" stroke="#83adb7"/>
   <g data-scene-subject="nand-pipeline" data-scene-id={sceneId}>
   {sceneId==='nand-threshold'&&<>
    <Txt x={62} y={96} size={20} fill="#91e6da">NAND 전하 상태와 문턱 전압</Txt>
    <Layer x={72} y={139} title="Charge state" sub={state.cell.toUpperCase()}/>
    <Layer x={271} y={139} title={'Vt '+threshold.vt.toFixed(1)+' V'} sub="2-state toy"/>
    <Layer x={467} y={139} title={'Read '+state.readV+' V'} sub={state.power==='on'?'powered sense':'power OFF'}/>
    <path d="M212 171 H269 M409 171 H466" stroke="#bcffe4" strokeWidth="5" strokeDasharray="7 5"/>
    <Txt x={89} y={265} size={17} fill="#e0faf4">{state.power==='off'?'전원 OFF · 읽기 불가능':threshold.reading==='on'?'전원 ON · 읽기 통로 ON':'전원 ON · 읽기 통로 OFF'}</Txt>
    <Txt x={89} y={290} size={13}>저장 전하 상태는 짧은 OFF→ON 사이 유지된다는 장난감 가정</Txt>
   </>}
   {sceneId==='nand-page-block'&&<>
    <Txt x={62} y={95} size={20} fill="#91e6da">LBA 7 · 물리 페이지는 새 곳에 기록</Txt>
    {[0,1].map(b=><g key={b}>
     <Txt x={85+b*293} y={132} size={17} fill="#c3edfb">BLOCK {b} · ERASE UNIT</Txt>
     {[0,1,2,3].map(p=>{const v=page.pages[b*4+p];return <g key={p}>
      <rect x={85+b*293+p*64} y={153} width="57" height="83" rx="5"
       fill={v.status==='valid'?'#267767':v.status==='invalid'?'#a05b4c':'#254659'}
       stroke={v.status==='valid'?'#a3ffdf':'#7395a9'} strokeWidth="2"/>
      <Txt x={92+b*293+p*64} y={182} size={13}>P{p}</Txt>
      <Txt x={89+b*293+p*64} y={203} size={10}>{v.status==='valid'?'VALID':v.status==='invalid'?'INVALID':'ERASED'}</Txt>
      {v.revision&&<Txt x={105+b*293+p*64} y={223} size={12}>{v.revision}</Txt>}
     </g>})}
    </g>)}
    <Txt x={84} y={287} fill="#b8f1da">LBA7 → {page.mapping.LBA7}</Txt>
    <Txt x={84} y={314} size={12}>TOY: 페이지 program · 블록 erase · 유효 페이지를 잃지 않는 GC</Txt>
   </>}
   {sceneId==='ssd-ftl-reliability'&&<>
    <Txt x={60} y={93} size={19} fill="#a2f3df">호스트 논리주소 ≠ 물리 페이지</Txt>
    <Layer x={56} y={155} title="HOST LBA7" sub="logical address" color="#a4c8ff"/>
    <Layer x={243} y={155} title="SSD / FTL" sub={state.writePattern==='hot'?'hot writes':'cold writes'}/>
    <Layer x={446} y={155} title="NAND page" sub={state.writePattern==='hot'?'fresh map':'stable map'} color="#ffe0a1"/>
    <path d="M194 188 H242 M382 188 H445" stroke="#a5ffdd" strokeWidth="5" strokeDasharray="8 5"/>
    <Txt x={66} y={281} size={14}>ECC: {state.ecc?'선택됨 · 무오류 보장 아님':'꺼짐 (모형 비교)'}</Txt>
    <Txt x={66} y={304} size={14}>PLP: {state.plp?'선택 제품 예시':'없는 제품 예시'}</Txt>
    <Txt x={380} y={281} size={14}>DRAM: {state.dramCache?'있음':'DRAMless 예시'}</Txt>
   </>}
   {sceneId==='nvme-transfer'&&<>
    <Txt x={63} y={92} size={19} fill="#a6f8e4">명령·읽기 payload·GPU 이동은 별개</Txt>
    <Layer x={61} y={163} w={163} title={state.transport==='read-data'?'NAND → SSD':'Host CPU'} sub="initiator / data source"/>
    <Layer x={263} y={163} w={150} title={xfer.via} sub={xfer.kind}/>
    <Layer x={458} y={163} w={154} title={state.transport==='read-data'?'host DDR':state.transport==='command'?'SSD/NAND':'GPU DRAM'} sub="destination"/>
    <path d="M224 195 H262 M414 195 H457" fill="none" stroke="#9cffe4" strokeWidth="5" strokeDasharray="8 5"/>
    <path d="M447 186 L462 195 L447 204" fill="#caffef"/>
    <Txt x={76} y={282} size={15} fill="#ffe8b8">{xfer.label}</Txt>
    <Txt x={76} y={313} size={12}>{xfer.detail}</Txt>
   </>}
   {sceneId==='ai-datacenter-pipeline'&&<>
    <Txt x={62} y={91} size={20} fill="#8ef0de">AI 모델과 요청: 상태별로 다른 경로</Txt>
    {ai.sequence.map((v,i)=>{const xx=56+(i%3)*205,yy=i<3?142:254;return <Layer key={i}
     x={xx} y={yy} w={177} h={71} title={v} sub={'stage '+(i+1)} color={i===0?'#ffe1a0':'#7cddcd'}/>})}
    <Txt x={70} y={375} size={12}>서버 {state.servers}대 · {state.servers===2?'NIC/네트워크 경유 가능':'단일 노드 예시'} · 실제 시간치 아님</Txt>
   </>}
   </g>
   <Txt x={58} y={388} size={11} fill="#a5c5d1">정성적 원본 2.5D · 제품 기능/경로·신뢰성 수치 확정 아님</Txt>
  </svg>
  <div className="a05-readouts">
   {sceneId==='nand-threshold'?<>
    <span>전원<b>{state.power==='on'?'ON':'OFF'}</b></span><span>보존된 state<b>{threshold.retainedCell}</b></span>
    <span>읽기 V<b>{state.readV} V</b></span><span>센싱<b>{threshold.reading}</b></span>
   </>:sceneId==='nand-page-block'?<>
    <span>논리 주소<b>LBA7</b></span><span>물리 매핑<b>{page.mapping.LBA7}</b></span>
    <span>블록 erase<b>{page.erasedBlock0?'BLOCK 0 후 정리':'보존 중'}</b></span>
    <span>유효 페이지<b>{page.pages.filter(p=>p.status==='valid').length}</b></span>
   </>:sceneId==='ssd-ftl-reliability'?<>
    <span>FTL 상태<b>{ssd.physical}</b></span><span>ECC<b>{state.ecc?'선택 (한계 존재)':'미선택'}</b></span>
    <span>PLP<b>{state.plp?'있는 제품 예':'없는 제품 예'}</b></span><span>DRAM 캐시<b>{state.dramCache?'있음':'DRAMless'}</b></span>
   </>:sceneId==='nvme-transfer'?<>
    <span>화살표 종류<b>{xfer.kind}</b></span><span>시작<b>{xfer.from}</b></span>
    <span>연결<b>{xfer.via}</b></span><span>도착<b>{xfer.to}</b></span>
   </>:<>
    <span>시나리오<b>{state.ai}</b></span><span>시작 상태<b>{ai.source}</b></span>
    <span>서버<b>{state.servers}대</b></span><span>병목 예<b>{ai.bottleneck}</b></span>
   </>}
  </div>
  <p className="a05-note">설명 범위: NAND 비휘발성과 읽기 전원 필요, 페이지/블록 불일치, 제품별 SSD ECC·PLP·DRAM, NVMe 명령 vs PCIe DMA, AI 사전 적재 여부. 모두 교육용이며 SKU 보증이 아니에요.</p>
 </div>;
}
