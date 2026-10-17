/**
 * Normalizes engineering notations and formulas into natural Korean pronunciation.
 */
export function normalizeEngineeringSpeech(text: string): string {
  if (!text) return '';

  return text
    // Common equations first before stripping operators
    .replace(/V\s*=\s*I\s*[*×x]\s*R/gi, '브이는 아이 곱하기 알')
    .replace(/P\s*=\s*I\^2\s*[*×x]\s*R/gi, '전력은 전류 제곱 곱하기 저항')
    .replace(/P\s*=\s*I\s*[*×x]\s*V/gi, '전력은 전류 곱하기 전압')
    // Replace markdown bold, italic, code
    .replace(/[*_`#]/g, '')
    // Electrical & Semiconductor symbols
    .replace(/V_GS|Vgs|V_gs/gi, '게이트 전압')
    .replace(/V_DS|Vds|V_ds/gi, '드레인 전압')
    .replace(/V_th|Vth/gi, '문턱 전압')
    .replace(/V_DD|Vdd/gi, '전원 전압')
    .replace(/V_in|Vin/gi, '입력 전압')
    .replace(/V_out|Vout/gi, '출력 전압')
    .replace(/I_D|Id/gi, '드레인 전류')
    .replace(/R_D|Rd/gi, '풀업 저항')
    .replace(/nMOS|NMOS/g, '엔모스')
    .replace(/pMOS|PMOS/g, '피모스')
    .replace(/MOSFET/gi, '모스펫')
    .replace(/GND/g, '접지')
    .replace(/HIGH/g, '하이')
    .replace(/LOW/g, '로우')
    .replace(/ON/g, '켜짐')
    .replace(/OFF/g, '꺼짐')
    // Units
    .replace(/(\d+(?:\.\d+)?)\s*V(?![a-zA-Z])/g, '$1 볼트')
    .replace(/(\d+(?:\.\d+)?)\s*mA(?![a-zA-Z])/g, '$1 밀리암페어')
    .replace(/(\d+(?:\.\d+)?)\s*A(?![a-zA-Z])/g, '$1 암페어')
    .replace(/(\d+(?:\.\d+)?)\s*kΩ|kOhm/gi, '$1 킬로옴')
    .replace(/(\d+(?:\.\d+)?)\s*Ω|Ohm/gi, '$1 옴')
    .replace(/(\d+(?:\.\d+)?)\s*W(?![a-zA-Z])/g, '$1 와트')
    .replace(/(\d+(?:\.\d+)?)\s*T(?![a-zA-Z])/g, '$1개 치차')
    .replace(/(\d+(?:\.\d+)?)\s*deg|도/g, '$1도')
    .replace(/(\d+(?:\.\d+)?)\s*N·m|Nm/g, '$1 뉴턴미터')
    .trim();
}
