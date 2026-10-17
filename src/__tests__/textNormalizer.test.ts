import { describe, it, expect } from 'vitest';
import { normalizeEngineeringSpeech } from '../lib/voice/textNormalizer';

describe('Engineering Speech Normalizer (Issue #41 compliance)', () => {
  it('should normalize semiconductor acronyms and voltages', () => {
    const input = 'V_GS 전압을 0.7V 이상으로 올려 nMOS 채널을 형성하세요.';
    const normalized = normalizeEngineeringSpeech(input);
    expect(normalized).toContain('게이트 전압');
    expect(normalized).toContain('0.7 볼트');
    expect(normalized).toContain('엔모스');
  });

  it('should normalize units like mA, Ohm, and power equations', () => {
    const input = 'V = I * R 공식에 의해 12V에서 30Ohm 저항이면 400mA 전류가 흐릅니다.';
    const normalized = normalizeEngineeringSpeech(input);
    expect(normalized).toContain('12 볼트');
    expect(normalized).toContain('30 옴');
    expect(normalized).toContain('400 밀리암페어');
    expect(normalized).toContain('브이는 아이 곱하기 알');
  });

  it('should normalize all Issue #41 engineering acronyms and expressions correctly', () => {
    // MOSFET, SRAM, DRAM, GDDR7, HBM, CXL, DDR5, GB/s, Gb/s, 0.7 V, 10 ms, μF/cm², 128×24÷8
    const testCases: [string, string][] = [
      ['MOSFET 스위칭 특성', '모스펫'],
      ['SRAM 6T 셀 구조', '에스램'],
      ['DRAM 1T1C 커패시터', '디램'],
      ['GDDR7 초고속 그래픽 메모리', '지디디알 세븐'],
      ['HBM 스택 메모리 대역폭', '에이치비엠'],
      ['CXL 차세대 인터커넥트', '씨엑스엘'],
      ['DDR5 서버 메모리 모듈', '디디알 파이브'],
      ['대역폭 1024 GB/s 도달', '1024 초당 기가바이트'],
      ['핀당 18 Gb/s 속도', '18 초당 기가비트'],
      ['문턱전압 0.7 V 도달', '0.7 볼트'],
      ['리프레시 주기 10 ms', '10 밀리초'],
      ['산화막 용량 0.69 µF/cm²', '0.69 마이크로패럿 퍼 제곱센티미터'],
      ['산화막 용량 0.35 μF/cm²', '0.35 마이크로패럿 퍼 제곱센티미터'],
      ['계산식 128×24÷8 결과', '128 곱하기 24 나누기 8'],
      ['플랫밴드 VFB와 문턱전압 VT', '플랫밴드 전압'],
      ['산화막 두께 tox와 유효 두께 EOT', '산화막 두께 티오엑스'],
      ['SiO2 절연막', '실리콘 산화막'],
    ];

    for (const [raw, expectedPart] of testCases) {
      const normalized = normalizeEngineeringSpeech(raw);
      expect(normalized).toContain(expectedPart);
    }
  });
});
