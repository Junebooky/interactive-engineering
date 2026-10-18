import React, { useId } from 'react';

interface ConceptIntroSceneVisualProps {
  visualId: string;
  title: string;
  subtitle: string;
  caption: string;
}

export const ConceptIntroSceneVisual: React.FC<ConceptIntroSceneVisualProps> = ({
  visualId,
  title,
  subtitle,
  caption,
}) => {
  const uid = useId().replace(/:/g, '');

  return (
    <div className="a03-concept-visual" role="img" aria-label={`${title} - ${caption}`}>
      <svg
        viewBox="0 0 780 420"
        className="a03-concept-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#132B3E" />
            <stop offset="100%" stopColor="#0B1A26" />
          </linearGradient>
          <linearGradient id={`grad-metal-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8D6DF" />
            <stop offset="100%" stopColor="#8198A7" />
          </linearGradient>
          <linearGradient id={`grad-oxide-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E5A663" />
            <stop offset="100%" stopColor="#AD6E32" />
          </linearGradient>
          <linearGradient id={`grad-si-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#25556E" />
            <stop offset="100%" stopColor="#143445" />
          </linearGradient>
          <linearGradient id={`grad-teal-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2CD5B3" />
            <stop offset="100%" stopColor="#0E8C78" />
          </linearGradient>
          <linearGradient id={`grad-gold-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FAD375" />
            <stop offset="100%" stopColor="#C49226" />
          </linearGradient>
        </defs>

        {/* 2.5D Wafer Base Plate */}
        <path
          d="M60 85 L690 85 730 120 730 355 690 385 60 385 30 355 30 120 Z"
          fill={`url(#grad-bg-${uid})`}
          stroke="#26485E"
          strokeWidth="2.5"
        />
        <path d="M60 85 L690 85 730 120 100 120 Z" fill="#204054" opacity="0.45" />

        {/* Header Title inside SVG */}
        <text x="65" y="55" fill="#E2F1F8" fontSize="18" fontWeight="800" letterSpacing="-0.3">
          {title}
        </text>
        <text x="65" y="75" fill="#7FA4B5" fontSize="12" fontWeight="600">
          {subtitle}
        </text>

        {/* Visual Domain Diagram Switching */}
        {visualId === 'circuit-intro' && (
          <g transform="translate(40, 20)">
            {/* Battery 5V Source */}
            <rect x="90" y="140" width="100" height="120" rx="14" fill={`url(#grad-gold-${uid})`} stroke="#FFE59E" strokeWidth="2" />
            <text x="140" y="185" textAnchor="middle" fontSize="22" fontWeight="850" fill="#261E0E">5 V</text>
            <text x="140" y="215" textAnchor="middle" fontSize="12" fontWeight="700" fill="#4A3C1E">직류 전원</text>
            <text x="140" y="130" textAnchor="middle" fontSize="15" fontWeight="800" fill="#FAD375">+</text>
            <text x="140" y="280" textAnchor="middle" fontSize="18" fontWeight="800" fill="#A8BED0">−</text>

            {/* Circuit Conducting Wires */}
            <path d="M140 140 V105 H320" stroke="#5E96A8" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M420 105 H600 V235 H140 V260" stroke="#5E96A8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Knife Switch (Open) */}
            <circle cx="320" cy="105" r="9" fill="#2CD5B3" stroke="#C4F7ED" strokeWidth="2" />
            <circle cx="420" cy="105" r="9" fill="#2CD5B3" stroke="#C4F7ED" strokeWidth="2" />
            <path d="M320 105 L395 55" stroke="#FAD375" strokeWidth="8" strokeLinecap="round" />
            <text x="360" y="45" textAnchor="middle" fontSize="13" fontWeight="800" fill="#FFEAA8">열린 스위치 (단절)</text>

            {/* Load Resistor */}
            <rect x="545" y="145" width="110" height="60" rx="10" fill={`url(#grad-metal-${uid})`} stroke="#E1EFF8" strokeWidth="2" />
            <text x="600" y="180" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0C1B24">1 kΩ 저항</text>

            {/* Explanatory callouts */}
            <rect x="230" y="280" width="310" height="38" rx="8" fill="#0E2433" stroke="#254B60" />
            <text x="385" y="304" textAnchor="middle" fontSize="13" fontWeight="700" fill="#99D5E8">
              폐루프가 없으면 전압은 남아도 전류는 0 A입니다
            </text>
          </g>
        )}

        {visualId === 'pn-intro' && (
          <g transform="translate(60, 30)">
            {/* P-type silicon */}
            <rect x="80" y="120" width="230" height="130" rx="8" fill="#1C455C" stroke="#3A7599" strokeWidth="2" />
            <text x="195" y="155" textAnchor="middle" fontSize="18" fontWeight="800" fill="#8CE1FF">P형 실리콘 (P-Type)</text>
            <text x="195" y="185" textAnchor="middle" fontSize="12" fill="#BFE8F7">다수 캐리어: 양공 (Holes, ⊕)</text>
            <text x="195" y="210" textAnchor="middle" fontSize="12" fill="#9CCAD8">3족 보론(B) 억셉터 도핑</text>

            {/* N-type silicon */}
            <rect x="310" y="120" width="230" height="130" rx="8" fill="#16394D" stroke="#2D6280" strokeWidth="2" />
            <text x="425" y="155" textAnchor="middle" fontSize="18" fontWeight="800" fill="#7DEBCB">N형 실리콘 (N-Type)</text>
            <text x="425" y="185" textAnchor="middle" fontSize="12" fill="#B9F5E4">다수 캐리어: 전자 (Electrons, ⊖)</text>
            <text x="425" y="210" textAnchor="middle" fontSize="12" fill="#9CCAD8">5족 인(P) 도너 도핑</text>

            {/* Depletion Junction */}
            <line x1="310" y1="105" x2="310" y2="265" stroke="#FAD375" strokeWidth="4" strokeDasharray="6 4" />
            <text x="310" y="95" textAnchor="middle" fontSize="13" fontWeight="800" fill="#FAD375">접합면 (PN Junction)</text>

            {/* Built-in field indicator */}
            <path d="M260 280 H360" stroke="#FFEAA8" strokeWidth="3" markerEnd="url(#arrow)" />
            <text x="310" y="305" textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFEAA8">내부 전계 (N → P 방향)</text>
          </g>
        )}

        {visualId === 'mos-cap-intro' && (
          <g transform="translate(60, 30)">
            {/* Gate Metal */}
            <rect x="160" y="100" width="360" height="36" rx="6" fill={`url(#grad-metal-${uid})`} stroke="#E6F2FA" strokeWidth="2" />
            <text x="340" y="124" textAnchor="middle" fontSize="15" fontWeight="800" fill="#0B1A24">금속 게이트 전극 (Metal Gate)</text>

            {/* Gate Oxide Dielectric */}
            <rect x="160" y="136" width="360" height="24" rx="3" fill={`url(#grad-oxide-${uid})`} stroke="#FFA752" strokeWidth="1.5" />
            <text x="340" y="153" textAnchor="middle" fontSize="12" fontWeight="800" fill="#FFFFFF">절연 산화막 (SiO₂ Dielectric)</text>

            {/* P-Substrate */}
            <rect x="160" y="160" width="360" height="120" rx="6" fill={`url(#grad-si-${uid})`} stroke="#3A7599" strokeWidth="2" />
            <text x="340" y="215" textAnchor="middle" fontSize="16" fontWeight="800" fill="#A8E2F7">P형 실리콘 기판 (P-type Substrate)</text>
            <text x="340" y="240" textAnchor="middle" fontSize="12" fill="#75A8BA">산화막 바로 아래 계면에서 전하 축적·공핍·반전 발생</text>
          </g>
        )}

        {visualId === 'mosfet-intro' && (
          <g transform="translate(50, 25)">
            {/* Gate Stack */}
            <rect x="250" y="90" width="180" height="32" rx="6" fill={`url(#grad-metal-${uid})`} stroke="#E3EFF7" strokeWidth="2" />
            <text x="340" y="112" textAnchor="middle" fontSize="14" fontWeight="850" fill="#0C1B24">게이트 (Gate)</text>

            <rect x="250" y="122" width="180" height="18" fill={`url(#grad-oxide-${uid})`} stroke="#FF9C3D" strokeWidth="1.5" />
            <text x="340" y="136" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFF">절연 산화막 (SiO₂)</text>

            {/* P-Substrate Body */}
            <rect x="100" y="140" width="480" height="150" rx="10" fill={`url(#grad-si-${uid})`} stroke="#3B799E" strokeWidth="2" />
            <text x="340" y="245" textAnchor="middle" fontSize="16" fontWeight="800" fill="#9CE2FA">P형 실리콘 기판 (Body)</text>

            {/* Source N+ */}
            <rect x="130" y="140" width="100" height="65" rx="6" fill="#186358" stroke="#37E1BA" strokeWidth="2" />
            <text x="180" y="172" textAnchor="middle" fontSize="14" fontWeight="800" fill="#CEF8EE">소스 (N+)</text>
            <text x="180" y="192" textAnchor="middle" fontSize="10" fill="#8CEFD7">전자 공급</text>

            {/* Drain N+ */}
            <rect x="450" y="140" width="100" height="65" rx="6" fill="#186358" stroke="#37E1BA" strokeWidth="2" />
            <text x="500" y="172" textAnchor="middle" fontSize="14" fontWeight="800" fill="#CEF8EE">드레인 (N+)</text>
            <text x="500" y="192" textAnchor="middle" fontSize="10" fill="#8CEFD7">전자 수집</text>

            {/* Channel Path Arrow */}
            <path d="M235 155 H445" stroke="#FAD375" strokeWidth="3" strokeDasharray="5 3" />
            <text x="340" y="175" textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFECA8">VGS ≥ Vth 일 때 전도 채널 형성</text>
          </g>
        )}

        {visualId === 'dram-intro' && (
          <g transform="translate(60, 30)">
            {/* Wordline */}
            <line x1="80" y1="120" x2="480" y2="120" stroke="#FAD375" strokeWidth="6" strokeLinecap="round" />
            <text x="90" y="105" fontSize="13" fontWeight="800" fill="#FAD375">워드라인 (WL - 게이트 제어)</text>

            {/* Bitline */}
            <line x1="150" y1="80" x2="150" y2="280" stroke="#4FE1C4" strokeWidth="6" strokeLinecap="round" />
            <text x="160" y="270" fontSize="13" fontWeight="800" fill="#4FE1C4">비트라인 (BL - 전하 입출력)</text>

            {/* 1T Transistor Symbol */}
            <rect x="230" y="145" width="70" height="50" rx="8" fill="#1D4C63" stroke="#79B5D2" strokeWidth="2" />
            <text x="265" y="175" textAnchor="middle" fontSize="14" fontWeight="800" fill="#E6F5FC">1T</text>
            <text x="265" y="210" textAnchor="middle" fontSize="11" fill="#A8D5EA">스위치</text>

            {/* 1C Capacitor Symbol */}
            <rect x="360" y="140" width="80" height="60" rx="10" fill={`url(#grad-teal-${uid})`} stroke="#75F6DC" strokeWidth="2" />
            <text x="400" y="175" textAnchor="middle" fontSize="15" fontWeight="850" fill="#04201A">1C</text>
            <text x="400" y="220" textAnchor="middle" fontSize="12" fontWeight="700" fill="#67E3C7">전하 저장 노드</text>

            {/* Connection */}
            <path d="M150 170 H230 M300 170 H360" stroke="#9FD4E8" strokeWidth="4" />
          </g>
        )}

        {visualId === 'sram-intro' && (
          <g transform="translate(70, 30)">
            {/* Inverter 1 */}
            <rect x="130" y="130" width="120" height="70" rx="10" fill="#1A4A61" stroke="#5DAFCF" strokeWidth="2" />
            <text x="190" y="165" textAnchor="middle" fontSize="16" fontWeight="800" fill="#A4E3F7">인버터 1 (NOT)</text>
            <text x="190" y="185" textAnchor="middle" fontSize="12" fill="#E6F5FA">출력 노드 Q</text>

            {/* Inverter 2 */}
            <rect x="350" y="130" width="120" height="70" rx="10" fill="#1A4A61" stroke="#5DAFCF" strokeWidth="2" />
            <text x="410" y="165" textAnchor="middle" fontSize="16" fontWeight="800" fill="#A4E3F7">인버터 2 (NOT)</text>
            <text x="410" y="185" textAnchor="middle" fontSize="12" fill="#E6F5FA">출력 노드 /Q</text>

            {/* Cross-Coupled Feedback Loops */}
            <path d="M250 150 H300 V110 H310 M350 150 H300 V190 H290" stroke="#FAD375" strokeWidth="4" fill="none" />
            <text x="300" y="95" textAnchor="middle" fontSize="13" fontWeight="800" fill="#FAD375">상호 결합 래치 피드백 루프</text>
            <text x="300" y="250" textAnchor="middle" fontSize="12" fill="#B3D9E8">전원만 켜져 있으면 리프레시 없이 상태 영구 보존</text>
          </g>
        )}

        {visualId === 'nand-intro' && (
          <g transform="translate(70, 30)">
            {/* 3D Vertical String representation */}
            <rect x="120" y="90" width="100" height="40" rx="6" fill="#18485E" stroke="#55A1BF" strokeWidth="2" />
            <text x="170" y="115" textAnchor="middle" fontSize="12" fontWeight="700" fill="#C5EAF7">SSL (선택 트랜지스터)</text>

            <rect x="120" y="138" width="100" height="38" rx="6" fill={`url(#grad-oxide-${uid})`} stroke="#FFA64D" strokeWidth="2" />
            <text x="170" y="162" textAnchor="middle" fontSize="12" fontWeight="800" fill="#FFF">Cell 3 (트랩층)</text>

            <rect x="120" y="184" width="100" height="38" rx="6" fill={`url(#grad-oxide-${uid})`} stroke="#FFA64D" strokeWidth="2" />
            <text x="170" y="208" textAnchor="middle" fontSize="12" fontWeight="800" fill="#FFF">Cell 2 (트랩층)</text>

            <rect x="120" y="230" width="100" height="38" rx="6" fill={`url(#grad-oxide-${uid})`} stroke="#FFA64D" strokeWidth="2" />
            <text x="170" y="254" textAnchor="middle" fontSize="12" fontWeight="800" fill="#FFF">Cell 1 (트랩층)</text>

            {/* Vertical Channel Hole */}
            <rect x="70" y="85" width="25" height="190" rx="8" fill="#2CD5B3" stroke="#8AFAEA" strokeWidth="2" />
            <text x="82" y="295" textAnchor="middle" fontSize="11" fontWeight="700" fill="#75F6DC">수직 채널</text>

            {/* Explanation card */}
            <rect x="260" y="125" width="280" height="110" rx="10" fill="#0E2331" stroke="#25516B" />
            <text x="280" y="155" fontSize="14" fontWeight="800" fill="#FAD375">비휘발성 전하 트랩 (CTN)</text>
            <text x="280" y="180" fontSize="12" fill="#BFDFEE">질화막 층에 전자를 가두어</text>
            <text x="280" y="202" fontSize="12" fill="#BFDFEE">전원이 꺼져도 10년 이상 비트 보존</text>
          </g>
        )}

        {visualId === 'gpu-intro' && (
          <g transform="translate(60, 30)">
            {/* GPU Core Array (SM) */}
            <rect x="80" y="90" width="240" height="170" rx="12" fill="#133D52" stroke="#3CA9CF" strokeWidth="2.5" />
            <text x="200" y="120" textAnchor="middle" fontSize="16" fontWeight="850" fill="#9CE3FA">GPU 스트리밍 멀티프로세서</text>
            <text x="200" y="140" textAnchor="middle" fontSize="11" fill="#6FB7D1">수천 개 SIMT 연산 코어 배열</text>

            {/* SM Mini Cores */}
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={110 + col * 46}
                  y={155 + row * 22}
                  width={38}
                  height={16}
                  rx={3}
                  fill="#0D7C6D"
                  stroke="#5CF0D6"
                  strokeWidth="1"
                />
              ))
            )}

            {/* High-Speed HBM Stack */}
            <rect x="380" y="90" width="180" height="170" rx="12" fill="#2A2414" stroke="#FAD375" strokeWidth="2.5" />
            <text x="470" y="120" textAnchor="middle" fontSize="16" fontWeight="850" fill="#FFEAA8">HBM 고대역폭 메모리</text>
            <text x="470" y="140" textAnchor="middle" fontSize="11" fill="#C4B07B">3D 실리콘 관통전극(TSV) 스택</text>
            {[0, 1, 2, 3].map((layer) => (
              <rect
                key={layer}
                x={405}
                y={155 + layer * 22}
                width={130}
                height={16}
                rx={3}
                fill="#C49226"
                stroke="#FFE08F"
                strokeWidth="1"
              />
            ))}

            {/* Interconnect Bus */}
            <path d="M320 175 H380" stroke="#FFECA8" strokeWidth="6" strokeDasharray="8 4" />
            <text x="350" y="210" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFECA8">초광대역 버스</text>
          </g>
        )}

        {visualId === 'gears-intro' && (
          <g transform="translate(60, 30)">
            {/* Driving Gear (Left) */}
            <circle cx="200" cy="180" r="70" fill="#1C4B63" stroke="#48ACD4" strokeWidth="3" />
            <circle cx="200" cy="180" r="14" fill="#0C1F2B" stroke="#68C7ED" strokeWidth="2" />
            <text x="200" y="175" textAnchor="middle" fontSize="14" fontWeight="800" fill="#D3F2FD">Gear 1</text>
            <text x="200" y="195" textAnchor="middle" fontSize="12" fill="#88CBE8">N1 구동</text>

            {/* Driven Gear (Right) */}
            <circle cx="340" cy="180" r="70" fill="#143D52" stroke="#37E1BA" strokeWidth="3" />
            <circle cx="340" cy="180" r="14" fill="#0C1F2B" stroke="#66F3D2" strokeWidth="2" />
            <text x="340" y="175" textAnchor="middle" fontSize="14" fontWeight="800" fill="#CEF8EE">Gear 2</text>
            <text x="340" y="195" textAnchor="middle" fontSize="12" fill="#7EE7CD">N2 종동</text>

            {/* Pitch Point Contact */}
            <circle cx="270" cy="180" r="6" fill="#FAD375" />
            <line x1="270" y1="130" x2="270" y2="230" stroke="#FAD375" strokeWidth="2.5" strokeDasharray="5 3" />
            <text x="270" y="115" textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFEAA8">접촉 피치점 (작용·반작용)</text>
            <text x="270" y="255" textAnchor="middle" fontSize="12" fill="#BCE0EE">외접 기어 맞물림 시 회전 방향 반전</text>
          </g>
        )}

        {/* Footer Caption */}
        <text x="390" y="372" textAnchor="middle" fontSize="12" fill="#8AA8B8">
          {caption}
        </text>
      </svg>
    </div>
  );
};
