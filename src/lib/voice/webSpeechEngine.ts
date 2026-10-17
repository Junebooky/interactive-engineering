import { normalizeEngineeringSpeech } from './textNormalizer';

export interface VoiceStateListener {
  (state: { isSpeaking: boolean; currentText: string; isSupported: boolean; enabled: boolean }): void;
}

class WebSpeechVoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isSupported: boolean = false;
  private enabled: boolean = false;
  private isSpeaking: boolean = false;
  private currentText: string = '';
  private lastMilestoneTime: number = 0;
  private milestoneCooldownMs: number = 4000;
  private listeners: Set<VoiceStateListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();
      
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }

      const stored = localStorage.getItem('ie_voice_enabled');
      this.enabled = stored === 'true';
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Preference: Google 한국어 -> Yuna/Sora/Apple -> Heami -> Any ko-KR
    const koVoices = voices.filter(v => v.lang.startsWith('ko') || v.lang === 'ko-KR');
    if (koVoices.length > 0) {
      const preferred = koVoices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Yuna') || 
        v.name.includes('Sora') ||
        v.name.includes('Heami')
      );
      this.selectedVoice = preferred || koVoices[0];
    }
  }

  public subscribe(listener: VoiceStateListener): () => void {
    this.listeners.add(listener);
    this.notify();
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const payload = {
      isSpeaking: this.isSpeaking,
      currentText: this.currentText,
      isSupported: this.isSupported,
      enabled: this.enabled,
    };
    this.listeners.forEach(fn => fn(payload));
  }

  public setEnabled(enable: boolean) {
    this.enabled = enable;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ie_voice_enabled', enable ? 'true' : 'false');
    }
    if (!enable) {
      this.cancel();
    }
    this.notify();
  }

  public getEnabled(): boolean {
    return this.enabled;
  }

  public getIsSupported(): boolean {
    return this.isSupported;
  }

  public cancel() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (err) {
        console.warn('SpeechSynthesis cancel error:', err);
      }
    }
    this.isSpeaking = false;
    this.currentText = '';
    this.notify();
  }

  public speak(
    rawText: string, 
    options?: { isMilestone?: boolean; force?: boolean }
  ) {
    if (!this.isSupported || !this.synth) return;
    if (!this.enabled && !options?.force) return;
    if (!rawText || !rawText.trim()) return;

    // Milestone cooldown check
    if (options?.isMilestone) {
      const now = Date.now();
      if (now - this.lastMilestoneTime < this.milestoneCooldownMs) {
        return; // Suppress milestone spam while slider is moving
      }
      this.lastMilestoneTime = now;
    }

    // Cancel ongoing speech before new utterance
    this.cancel();

    const normalized = normalizeEngineeringSpeech(rawText);
    const utterance = new SpeechSynthesisUtterance(normalized);
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.lang = 'ko-KR';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.currentText = rawText;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentText = '';
      this.notify();
    };

    utterance.onerror = () => {
      // Interrupted errors are expected on cancel()
      this.isSpeaking = false;
      this.currentText = '';
      this.notify();
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis speak failed:', e);
      this.isSpeaking = false;
      this.currentText = '';
      this.notify();
    }
  }
}

export const voiceEngine = new WebSpeechVoiceEngine();
