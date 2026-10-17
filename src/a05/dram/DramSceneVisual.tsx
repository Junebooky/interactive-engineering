import { useId } from 'react';
import {
  bankSchedule, leakageVoltage, senseRead, shareCharge,
} from './dramModel';
import type { Bit, DramPhase, DramSceneId } from './dramModel';

export interface DramVisualState {
  wl: Bit;
  bl: Bit;
  cell: Bit;
  bit: Bit;
  phase: DramPhase;
  elapsed: number;
  refreshAt: number | null;
  banks: 1 | 2;
}
export function DramSceneVisual({ sceneId, state, revealed }: {
  sceneId: DramSceneId; state: DramVisualState; revealed: boolean;
}) {
  const ident = useId().replace(/:/g, '');
  if (!revealed) return <div className="a05-veiled" aria-label="예측 전에 실험 결과가 가려져 있습니다">
    <div className="a05-veiled-object" aria-hidden="true"><span /></div>
    <p>어떻게 될지 먼저 예상해 보세요. 예상 후 장면과 수치가 공개됩니다.</p>
  </div>;
  const read = senseRead(state.bit, state.phase);
  const voltage = sceneId === 'dram-write' ? state.cell
    : sceneId === 'dram-sense-restore' ? read.cellVoltage
    : leakageVoltage(state.elapsed, state.refreshAt);
  const blVoltage = sceneId === 'dram-sense-restore' ? read.bitlineVoltage : state.bl;
  const chargeSize = Math.max(0, Math.min(1, voltage)) * 80;
  const sensed = shareCharge(state.bit);
  const isBank = sceneId === 'dram-row-bank';
  const gradId = 'dramWafer' + ident, cellId = 'dramCell' + ident;
  return <div className="a05-visual a05-dram-visual">
    <svg viewBox="0 0 650 410" role="img" aria-label={
      isBank ? 'DRAM 두 요청 A와 B의 뱅크별 처리 타임라인'
      : 'DRAM 1T1C 접근 트랜지스터, 워드라인, 비트라인, 저장 커패시터의 계층형 2.5D 회로도'
    }>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#37768b" /><stop offset=".6" stopColor="#1e495d"/><stop offset="1" stopColor="#10253c"/>
        </linearGradient>
        <linearGradient id={cellId} x1="0" y1="0" x2=".8" y2="1">
          <stop stopColor="#baffef"/><stop offset=".6" stopColor="#4ad9c1"/><stop offset="1" stopColor="#2389a8"/>
        </linearGradient>
      </defs>
      <path d="M45 36 L564 36 L595 59 L595 341 L76 341 L45 317 Z"
        fill={'url(#' + gradId + ')'} stroke="#89cfdf" strokeWidth="2"/>
      <path d="M564 36 L595 59 L595 341 L564 317 Z" fill="#153045" stroke="#78aabb"/>
      <rect x="45" y="36" width="519" height="281" rx="14" fill="#14344a" stroke="#6aa6b7"/>
      <path d="M62 49 H549" stroke="#a1fff1" opacity=".5" strokeWidth="2"/>
      {isBank ? <>
        <text x="76" y="83" fill="#b1ffe9" fontSize="21" fontWeight="bold">메모리 뱅크와 요청 A / B</text>
        <text x="77" y="113" fill="#dbeaf3" fontSize="14">가상 시간 슬롯 (실제 DRAM 타이밍 아님)</text>
        {[0, 1, 2, 3, 4].map(i => <g key={i}>
          <line x1={158 + i * 81} x2={158 + i * 81} y1="153" y2="286" stroke="#aacad8" strokeDasharray="3 8" opacity=".5"/>
          <text x={153+i*81} y="308" fill="#bbd6e4" fontSize="12">{i}</text>
        </g>)}
        {[1, 2].map((n, i) => <g key={n}>
          <rect x="79" y={151+i*66} width="448" height="48" rx="9" fill="#0d253a" stroke="#66889b"/>
          <text x="88" y={179+i*66} fontSize="13" fill="#cbe3ee">BANK {n}</text>
        </g>)}
        {bankSchedule(state.banks).map((lane, i) => <g key={lane.request}>
          <rect x={158+lane.start*81} y={160+(lane.bank-1)*66} width={(lane.finish-lane.start)*81} height="29" rx="7"
            fill={i ? '#54b7ed' : '#78eccf'} stroke="#f1ffff" strokeWidth="1"/>
          <text x={173+lane.start*81} y={180+(lane.bank-1)*66} fill="#073347" fontSize="13" fontWeight="bold">
            요청 {lane.request}
          </text>
        </g>)}
        <text x="85" y="336" fill="#d9eefa" fontSize="12">다른 뱅크는 내부 처리가 겹칠 수 있지만 공유 버스/타이밍 제약은 남아요.</text>
      </> : <>
        <text x="80" y="76" fill="#b5ffe5" fontSize="21" fontWeight="bold">DRAM 1T1C · 1 Transistor + 1 Capacitor</text>
        <text x="82" y="105" fill="#bed5df" fontSize="13">반도체 구조를 단순화한 교육용 레이어드 회로 · 실제 축척 아님</text>
        <rect x="94" y="147" width="452" height="140" rx="12" fill="#0b2436" stroke="#6a95a9" strokeWidth="2"/>
        <path d="M104 159 H533" stroke="#41788e" strokeWidth="2"/>
        <path d="M135 192 H297" stroke="#70c6ef" strokeWidth="8" strokeLinecap="round"/>
        <text x="124" y="176" fill="#8fd7ff" fontSize="13" fontWeight="bold">BL · {blVoltage.toFixed(2)} × VDD</text>
        <path d="M302 198 H387" stroke="#a0b8c8" strokeWidth="5"/>
        <rect x="288" y="179" width="44" height="35" rx="7"
          fill={sceneId === 'dram-sense-restore' || state.wl ? '#43c9b0' : '#586f80'}
          stroke="#9cffe5" strokeWidth="2"/>
        <path d="M310 135 V174" stroke="#ffe2a1" strokeWidth="4"/>
        <text x="333" y="147" fill="#ffe2a1" fontSize="13">WL · {sceneId === 'dram-sense-restore' ? (state.phase === 'precharge' ? 'OFF' : 'ON') : (state.wl ? 'ON' : 'OFF')}</text>
        <text x="276" y="232" fill="#b3ffea" fontSize="13">1T</text>
        <path d="M385 168 V246" stroke="#bed3e0" strokeWidth="3"/>
        <path d="M404 168 V246" stroke="#bed3e0" strokeWidth="3"/>
        <rect x="412" y={246-chargeSize*.78} width="67" height={Math.max(1,chargeSize*.78)} rx="5"
          fill={'url(#' + cellId + ')'} opacity=".93"/>
        <path d="M401 246 H485 V168 H401" stroke="#bdfaea" strokeWidth="3" fill="none"/>
        <text x="406" y="262" fill="#e4f6fb" fontSize="12">1C · 셀 저장 전하</text>
        <text x="420" y="190" fill="#092c3e" fontSize="13" fontWeight="bold">{voltage.toFixed(2)}</text>
        {sceneId === 'dram-sense-restore' && <>
          <rect x="95" y="247" width="181" height="31" rx="7" fill={read.senseEnabled ? '#2d9ea0' : '#233f57'} stroke="#80d4da"/>
          <text x="108" y="268" fill="#efffff" fontSize="12">SENSE AMP: {read.senseEnabled ? 'ENABLED' : 'OFF'}</text>
          <text x="92" y="320" fill="#d0f8ea" fontSize="13">ΔV = {sensed.delta > 0 ? '+' : ''}{sensed.delta.toFixed(2)} × VDD · Cc:Cb = 1:9</text>
        </>}
        {sceneId === 'dram-leak-refresh' && <>
          <rect x="102" y="249" width="174" height="21" rx="7" fill="#163d51" stroke="#6ec8d8"/>
          <rect x="104" y="251" width={Math.max(0,170*voltage)} height="17" rx="6" fill="#67e4bc"/>
          <text x="102" y="319" fill="#bde8e2" fontSize="13">정규화 시간: {state.elapsed.toFixed(1)} (밀리초 아님)</text>
        </>}
        {sceneId === 'dram-write' && <text x="101" y="318" fill="#bde8e2" fontSize="13">
          {state.wl ? 'WL 연결: BL 변화가 셀에 쓰임' : 'WL 차단: 셀은 BL 변화와 분리'}
        </text>}
      </>}
      <text x="76" y="374" fill="#a8c7d8" fontSize="12">
        {isBank ? '뱅크 처리 시간과 데이터 버스 병목을 분리한 학습 모형' : '정규화 전압 · 쓰기 마진/공정/전하 누설/실제 DRAM 타이밍 비정량'}
      </text>
    </svg>
    <div className="a05-readouts" aria-live="polite">
      {isBank ? <>
        <span>뱅크 수<b>{state.banks}</b></span>
        <span>내부 처리 겹침<b>{state.banks === 2 ? '가능' : '불가'}</b></span>
        <span>가상 완료 슬롯<b>{state.banks === 2 ? '2' : '4'}</b></span>
        <span>버스·지연 제약<b>계속 존재</b></span>
      </> : <>
        <span>셀 저장 전압<b>{voltage.toFixed(2)} × VDD</b></span>
        <span>비트라인<b>{blVoltage.toFixed(2)} × VDD</b></span>
        <span>WL / 단계<b>{sceneId === 'dram-sense-restore' ? state.phase : (state.wl ? 'ON' : 'OFF')}</b></span>
        <span>상태<b>{sceneId === 'dram-sense-restore' ? read.restored ? '복원됨' : '복원 전' : sceneId === 'dram-leak-refresh' ? '누설·리프레시' : '쓰기·유지'}</b></span>
      </>}
    </div>
  </div>;
}
