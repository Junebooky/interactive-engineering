/**
 * Normalizes engineering notations, formulas, acronyms, and units into natural Korean pronunciation.
 * Spec aligned with Issue #41 and Lesson 01-14 Engineering Curriculum.
 */
export function normalizeEngineeringSpeech(text: string): string {
  if (!text) return '';

  return text
    // Common equations first before stripping operators
    .replace(/V\s*=\s*I\s*[*×x]\s*R/gi, '브이는 아이 곱하기 알')
    .replace(/P\s*=\s*I\^2\s*[*×x]\s*R/gi, '전력은 전류 제곱 곱하기 저항')
    .replace(/P\s*=\s*I\s*[*×x]\s*V/gi, '전력은 전류 곱하기 전압')
    .replace(/C\s*=\s*Q\s*[/÷]\s*V/gi, '커패시턴스는 전하 나누기 전압')
    .replace(/C\s*=\s*ε\s*[*×x]?\s*A\s*[/÷]\s*d/gi, '커패시턴스는 입실론 곱하기 면적 나누기 두께')

    // Arithmetic expressions e.g. 128×24÷8, 64*16/4
    .replace(/(\d+)\s*[×*]\s*(\d+)\s*[÷/]\s*(\d+)/g, '$1 곱하기 $2 나누기 $3')

    // Acronyms (Hardware / Memory / Architectures)
    .replace(/\bGDDR7\b/gi, '지디디알 세븐')
    .replace(/\bGDDR6X?\b/gi, '지디디알 식스')
    .replace(/\bDDR5\b/gi, '디디알 파이브')
    .replace(/\bDDR4\b/gi, '디디알 포')
    .replace(/\bHBM3E\b/gi, '에이치비엠 쓰리이')
    .replace(/\bHBM3\b/gi, '에이치비엠 쓰리')
    .replace(/\bHBM\b/gi, '에이치비엠')
    .replace(/\bSRAM\b/gi, '에스램')
    .replace(/\bDRAM\b/gi, '디램')
    .replace(/\bCXL\b/gi, '씨엑스엘')
    .replace(/\bPCIe\b/gi, '피씨아이이')
    .replace(/\bNVMe\b/gi, '엔브이엠이')
    .replace(/\beSSD\b/gi, '이에스에스디')
    .replace(/\bSSD\b/gi, '에스에스디')
    .replace(/\bNAND\b/gi, '낸드')
    .replace(/\bFTL\b/gi, '에프티엘')
    .replace(/\bPLP\b/gi, '피엘피')
    .replace(/\bWAF\b/gi, '더블유에이에프')
    .replace(/\bCTF\b/gi, '전하 트랩 플래시 씨티에프')
    .replace(/\bSLC\b/gi, '에스엘씨')
    .replace(/\bMLC\b/gi, '엠엘씨')
    .replace(/\bTLC\b/gi, '티엘씨')
    .replace(/\bQLC\b/gi, '큐엘씨')
    .replace(/\bLBA\b/gi, '엘비에이')
    .replace(/\bDMA\b/gi, '디엠에이')
    .replace(/\bNIC\b/gi, '엔아이씨')
    .replace(/\bEOT\b/gi, '유효 산화막 두께 이오티')
    .replace(/\btox\b/gi, '산화막 두께 티오엑스')
    .replace(/SiO[2₂]/g, '실리콘 산화막')

    // High / Low frequency C-V
    .replace(/HF\s*[/–-]\s*LF/gi, '고주파 저주파')
    .replace(/C[–-]V/g, '씨브이')

    // Replace markdown bold, italic, code
    .replace(/[*_`#]/g, '')

    // Electrical & Semiconductor symbols
    .replace(/V_FB|Vfb\b/gi, '플랫밴드 전압')
    .replace(/V_th|Vth\b/gi, '문턱 전압')
    .replace(/V_GS|Vgs|V_gs\b/gi, '게이트 전압')
    .replace(/V_DS|Vds|V_ds\b/gi, '드레인 전압')
    .replace(/V_GB|Vgb|V_gb\b/gi, '게이트-바디 전압')
    .replace(/V_BS|Vbs|V_bs\b/gi, '바디-소스 전압')
    .replace(/V_DD|Vdd\b/gi, '전원 전압')
    .replace(/V_in|Vin\b/gi, '입력 전압')
    .replace(/V_out|Vout\b/gi, '출력 전압')
    .replace(/I_D|Id\b/gi, '드레인 전류')
    .replace(/I_gate|Igate\b/gi, '게이트 전류')
    .replace(/R_D|Rd\b/gi, '풀업 저항')
    .replace(/C[′']ox|C_ox|Cox\b/gi, '산화막 커패시턴스')
    .replace(/C[′']dep|C_dep|Cdep\b/gi, '공핍 커패시턴스')
    .replace(/nMOS|NMOS/g, '엔모스')
    .replace(/pMOS|PMOS/g, '피모스')
    .replace(/MOSFET/gi, '모스펫')
    .replace(/MOS\b/gi, '모스')
    .replace(/\bGND\b/g, '접지')
    .replace(/\bHIGH\b/g, '하이')
    .replace(/\bLOW\b/g, '로우')
    .replace(/\bON\b/g, '켜짐')
    .replace(/\bOFF\b/g, '꺼짐')

    // Compound Engineering Units (Case-sensitive for Byte vs bit)
    .replace(/(\d+(?:\.\d+)?)\s*GB\/s/g, '$1 초당 기가바이트')
    .replace(/(\d+(?:\.\d+)?)\s*Gb\/s/g, '$1 초당 기가비트')
    .replace(/(\d+(?:\.\d+)?)\s*MB\/s/g, '$1 초당 메가바이트')
    .replace(/(\d+(?:\.\d+)?)\s*Mb\/s/g, '$1 초당 메가비트')
    .replace(/(\d+(?:\.\d+)?)\s*TB\/s/g, '$1 초당 테라바이트')
    .replace(/(\d+(?:\.\d+)?)\s*Tb\/s/g, '$1 초당 테라비트')
    .replace(/(\d+(?:\.\d+)?)\s*[µμ]F\/cm[²2]/gi, '$1 마이크로패럿 퍼 제곱센티미터')
    .replace(/(\d+(?:\.\d+)?)\s*F\/m[²2]/gi, '$1 패럿 퍼 제곱미터')

    // Time & Frequency Units
    .replace(/(\d+(?:\.\d+)?)\s*ms\b/gi, '$1 밀리초')
    .replace(/(\d+(?:\.\d+)?)\s*[µμ]s\b/gi, '$1 마이크로초')
    .replace(/(\d+(?:\.\d+)?)\s*ns\b/gi, '$1 나노초')
    .replace(/(\d+(?:\.\d+)?)\s*ps\b/gi, '$1 피코초')
    .replace(/(\d+(?:\.\d+)?)\s*GHz\b/gi, '$1 기가헤르츠')
    .replace(/(\d+(?:\.\d+)?)\s*MHz\b/gi, '$1 메가헤르츠')
    .replace(/(\d+(?:\.\d+)?)\s*kHz\b/gi, '$1 킬로헤르츠')
    .replace(/(\d+(?:\.\d+)?)\s*Hz\b/gi, '$1 헤르츠')

    // Distance & Energy Units
    .replace(/(\d+(?:\.\d+)?)\s*nm\b/gi, '$1 나노미터')
    .replace(/(\d+(?:\.\d+)?)\s*[µμ]m\b/gi, '$1 마이크로미터')
    .replace(/(\d+(?:\.\d+)?)\s*eV\b/gi, '$1 일렉트론볼트')

    // Electrical units
    .replace(/(\d+(?:\.\d+)?)\s*V(?![a-zA-Z])/g, '$1 볼트')
    .replace(/(\d+(?:\.\d+)?)\s*mA(?![a-zA-Z])/g, '$1 밀리암페어')
    .replace(/(\d+(?:\.\d+)?)\s*uA|[µμ]A(?![a-zA-Z])/g, '$1 마이크로암페어')
    .replace(/(\d+(?:\.\d+)?)\s*nA(?![a-zA-Z])/g, '$1 나노암페어')
    .replace(/(\d+(?:\.\d+)?)\s*A(?![a-zA-Z])/g, '$1 암페어')
    .replace(/(\d+(?:\.\d+)?)\s*kΩ|kOhm/gi, '$1 킬로옴')
    .replace(/(\d+(?:\.\d+)?)\s*MΩ|MOhm/gi, '$1 메가옴')
    .replace(/(\d+(?:\.\d+)?)\s*Ω|Ohm/gi, '$1 옴')
    .replace(/(\d+(?:\.\d+)?)\s*pF(?![a-zA-Z])/g, '$1 피코패럿')
    .replace(/(\d+(?:\.\d+)?)\s*nF(?![a-zA-Z])/g, '$1 나노패럿')
    .replace(/(\d+(?:\.\d+)?)\s*[µμ]F(?![a-zA-Z])/g, '$1 마이크로패럿')
    .replace(/(\d+(?:\.\d+)?)\s*W(?![a-zA-Z])/g, '$1 와트')
    .replace(/(\d+(?:\.\d+)?)\s*T(?![a-zA-Z])/g, '$1개 치차')
    .replace(/(\d+(?:\.\d+)?)\s*deg|도/g, '$1도')
    .replace(/(\d+(?:\.\d+)?)\s*N·m|Nm/g, '$1 뉴턴미터')
    .trim();
}
