import { describe, it, expect } from 'vitest';
import { normalizeEngineeringSpeech } from '../lib/voice/textNormalizer';

describe('Engineering Speech Normalizer', () => {
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
});
