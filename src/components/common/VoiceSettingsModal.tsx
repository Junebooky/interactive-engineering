import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Volume2, Play, Settings2, ShieldCheck, Cpu } from 'lucide-react';
import { voiceEngine, type VoiceDescriptor } from '../../lib/voice/webSpeechEngine';
import { sfx } from '../../lib/sound/sfx';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ isOpen, onClose }) => {
  const [voices, setVoices] = useState<VoiceDescriptor[]>([]);
  const [selectedURI, setSelectedURI] = useState<string>('');
  const [rate, setRate] = useState<number>(1.0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'neuralComparison'>('settings');

  useEffect(() => {
    return voiceEngine.subscribe((state) => {
      setVoices(state.availableVoices);
      setSelectedURI(state.selectedVoiceURI);
      setRate(state.rate);
      setIsSpeaking(state.isSpeaking);
    });
  }, []);

  if (!isOpen) return null;

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sfx.playClick();
    const uri = e.target.value;
    setSelectedURI(uri);
    voiceEngine.setSelectedVoice(uri);
  };

  const handleRateChange = (newRate: number) => {
    sfx.playClick();
    setRate(newRate);
    voiceEngine.setRate(newRate);
  };

  const handlePreview = () => {
    sfx.playClick();
    voiceEngine.previewVoice(
      '안녕하세요! MOS 커패시터와 반도체 공학 튜터 음성입니다. 산화막 전계와 표면 반전을 생생하게 학습해 보세요.'
    );
  };

  const speedOptions = [
    { label: '0.75x (느리게)', value: 0.75 },
    { label: '0.9x (차분하게)', value: 0.9 },
    { label: '1.0x (표준)', value: 1.0 },
    { label: '1.1x (경쾌하게)', value: 1.1 },
    { label: '1.25x (빠르게)', value: 1.25 },
  ];

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const modal = (
    <div className="modal-backdrop voice-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="한국어 음성 튜터 설정">
      <div className="voice-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="voice-modal-header">
          <div className="voice-header-title">
            <Settings2 size={20} className="text-cyan" />
            <h2>자연스러운 한국어 음성 튜터 설정 (Issue #41)</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="설정 닫기">
            <X size={18} />
          </button>
        </div>

        <div className="voice-modal-tabs">
          <button
            type="button"
            className={`voice-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Volume2 size={16} /> 브라우저 음성 & 속도 제어
          </button>
          <button
            type="button"
            className={`voice-tab-btn ${activeTab === 'neuralComparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('neuralComparison')}
          >
            <Cpu size={16} /> Neural TTS 비교 분석
          </button>
        </div>

        {activeTab === 'settings' && (
          <div className="voice-modal-body">
            {/* Engine Status Badge */}
            <div className="voice-status-banner">
              <ShieldCheck size={16} />
              <span>현재 클라이언트 Web Speech API 사용 중 (비용 0원 · 제로 레이턴시)</span>
            </div>

            {/* Voice Selector */}
            <div className="voice-field-group">
              <label htmlFor="voice-select" className="voice-field-label">
                한국어 음성 선택 ({voices.length > 0 ? `${voices.length}개 감지됨` : '기본 음성'})
              </label>
              <select
                id="voice-select"
                className="voice-select-input"
                value={selectedURI}
                onChange={handleVoiceChange}
              >
                {voices.length > 0 ? (
                  voices.map((v) => (
                    <option key={v.uri} value={v.uri}>
                      {v.name} ({v.lang}){v.isDefault ? ' — 추천 기본값' : ''}
                    </option>
                  ))
                ) : (
                  <option value="">브라우저 기본 한국어 음성 (ko-KR)</option>
                )}
              </select>
              <p className="voice-field-help">
                Chrome, Edge, Safari 등 브라우저와 OS에 내장된 한국어 음성 엔진을 자동으로 감지합니다.
              </p>
            </div>

            {/* Speed / Rate Selector */}
            <div className="voice-field-group">
              <label className="voice-field-label">낭독 속도 조절 (현재: {rate.toFixed(2)}x)</label>
              <div className="voice-speed-buttons">
                {speedOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`speed-option-btn ${Math.abs(rate - opt.value) < 0.02 ? 'active' : ''}`}
                    onClick={() => handleRateChange(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Action */}
            <div className="voice-preview-card">
              <div className="preview-text-box">
                <p className="preview-label">샘플 낭독 문장:</p>
                <p className="preview-sample">
                  "안녕하세요! MOS 커패시터와 반도체 공학 튜터 음성입니다. 산화막 전계와 표면 반전을 생생하게 학습해 보세요."
                </p>
              </div>
              <button
                type="button"
                className={`btn-preview-voice ${isSpeaking ? 'speaking' : ''}`}
                onClick={handlePreview}
                disabled={isSpeaking}
              >
                <Play size={16} />
                <span>{isSpeaking ? '음성 출력 중...' : '선택 음성 미리듣기'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'neuralComparison' && (
          <div className="voice-modal-body neural-comparison-body">
            <div className="neural-policy-banner">
              <strong>🔒 오너 지침 준수:</strong> 유료 API 사용은 사전 승인 전 전면 금지되며, 현재는 무료 공개 사양 기반 A/B 비교 분석만 제공합니다.
            </div>

            <div className="neural-table-wrapper">
              <table className="neural-comparison-table">
                <thead>
                  <tr>
                    <th>제공사 / 모델</th>
                    <th>한국어 대표 음성</th>
                    <th>자연스러움 / 공학 발음</th>
                    <th>비용 / 라이선스</th>
                    <th>추천 등급</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="current-row">
                    <td><strong>Web Speech API (현재)</strong></td>
                    <td>Google 한국어, Yuna, Heami</td>
                    <td>브라우저 의존, 약어 정규화 필터 적용 완료</td>
                    <td>무료 (0원) / 무제한</td>
                    <td><span className="badge-free">현재 적용 중</span></td>
                  </tr>
                  <tr>
                    <td><strong>Azure Speech Neural</strong></td>
                    <td>ko-KR-SunHiNeural, InJoonNeural</td>
                    <td>자연스러운 문맥 억양, SSML 발음 사전 우수</td>
                    <td>$16 / 100만 자 (월 50만 자 무료)</td>
                    <td><span className="badge-recommend">차기 1순위 추천</span></td>
                  </tr>
                  <tr>
                    <td><strong>Google Cloud TTS (Chirp 3 HD)</strong></td>
                    <td>ko-KR-Chirp3-HD-Aoede</td>
                    <td>풍부한 감정 표현, 긴 문맥 호흡 자연스러움</td>
                    <td>$16 / 100만 자 (월 100만 자 무료)</td>
                    <td><span className="badge-recommend">차기 공동 1순위</span></td>
                  </tr>
                  <tr>
                    <td><strong>ElevenLabs Multilingual v2</strong></td>
                    <td>Korean Turbo v2.5</td>
                    <td>극도로 인간 같은 톤, 스타강사 복제 가능</td>
                    <td>$0.15~0.30 / 1,000자 (고비용)</td>
                    <td><span className="badge-hold">비용 검토 후 대기</span></td>
                  </tr>
                  <tr>
                    <td><strong>OpenAI Audio TTS</strong></td>
                    <td>alloy, nova, shimmer (ko-KR)</td>
                    <td>안정적이나 한국어 특화 운율 다소 평탄</td>
                    <td>$15 / 100만 자 (hd $30)</td>
                    <td><span className="badge-hold">대안 후보</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="neural-summary-note">
              <p>💡 <strong>캐싱 및 보안 아키텍처 제안:</strong></p>
              <ul>
                <li>고정된 개념 질문·힌트·Why 설명은 정적 빌드 시 사전 생성(Pre-rendered Opus/MP3)하여 CDN 캐싱으로 API 호출 비용 95% 이상 절감.</li>
                <li>실시간 조작 피드백만 브라우저 Web Speech 엔진 또는 백엔드 보안 프록시를 통해 on-demand 생성 (클라이언트 API 키 노출 금지).</li>
              </ul>
            </div>
          </div>
        )}

        <div className="voice-modal-footer">
          <button type="button" className="btn-modal-done" onClick={onClose}>
            완료
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
