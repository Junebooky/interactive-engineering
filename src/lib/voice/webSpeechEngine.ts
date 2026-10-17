import { normalizeEngineeringSpeech } from './textNormalizer';

export interface VoiceDescriptor {
  uri: string;
  name: string;
  lang: string;
  isDefault: boolean;
}

export interface VoiceEngineState {
  isSpeaking: boolean;
  currentText: string;
  isSupported: boolean;
  enabled: boolean;
  selectedVoiceURI: string;
  rate: number;
  availableVoices: VoiceDescriptor[];
}

export interface VoiceStateListener {
  (state: VoiceEngineState): void;
}

class WebSpeechVoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isSupported: boolean = false;
  private enabled: boolean = false;
  private isSpeaking: boolean = false;
  private currentText: string = '';
  private rate: number = 1.0;
  private lastMilestoneTime: number = 0;
  private milestoneCooldownMs: number = 4000;
  private listeners: Set<VoiceStateListener> = new Set();
  private availableVoices: VoiceDescriptor[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;

      const storedRate = localStorage.getItem('ie_voice_rate');
      if (storedRate) {
        const parsed = parseFloat(storedRate);
        if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2.0) {
          this.rate = parsed;
        }
      }

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

    // Filter to Korean voices, fallback to all if none
    const koVoices = voices.filter(v => v.lang.startsWith('ko') || v.lang === 'ko-KR');
    const displayList = koVoices.length > 0 ? koVoices : voices;

    this.availableVoices = displayList.map(v => ({
      uri: v.voiceURI,
      name: v.name,
      lang: v.lang,
      isDefault: v.default || v.name.includes('Google') || v.name.includes('Yuna'),
    }));

    const savedURI = typeof window !== 'undefined' ? localStorage.getItem('ie_voice_uri') : null;
    if (savedURI) {
      const match = voices.find(v => v.voiceURI === savedURI);
      if (match) {
        this.selectedVoice = match;
        this.notify();
        return;
      }
    }

    // Default preference: Google 한국어 -> Yuna/Sora/Apple -> Heami -> Any ko-KR
    if (koVoices.length > 0) {
      const preferred = koVoices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Yuna') || 
        v.name.includes('Sora') ||
        v.name.includes('Heami')
      );
      this.selectedVoice = preferred || koVoices[0];
    } else {
      this.selectedVoice = voices[0];
    }
    this.notify();
  }

  public getAvailableVoices(): VoiceDescriptor[] {
    return this.availableVoices;
  }

  public setSelectedVoice(voiceURI: string) {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    const match = voices.find(v => v.voiceURI === voiceURI);
    if (match) {
      this.selectedVoice = match;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ie_voice_uri', voiceURI);
      }
      this.notify();
    }
  }

  public getSelectedVoiceURI(): string {
    return this.selectedVoice?.voiceURI || '';
  }

  public setRate(newRate: number) {
    const clamped = Math.max(0.5, Math.min(2.0, newRate));
    this.rate = clamped;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ie_voice_rate', clamped.toString());
    }
    this.notify();
  }

  public getRate(): number {
    return this.rate;
  }

  public subscribe(listener: VoiceStateListener): () => void {
    this.listeners.add(listener);
    this.notify();
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const payload: VoiceEngineState = {
      isSpeaking: this.isSpeaking,
      currentText: this.currentText,
      isSupported: this.isSupported,
      enabled: this.enabled,
      selectedVoiceURI: this.selectedVoice?.voiceURI || '',
      rate: this.rate,
      availableVoices: this.availableVoices,
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

  public previewVoice(customText?: string) {
    const sample = customText || '안녕하세요! 반도체와 전기공학 튜터 음성입니다. MOSFET과 커패시터 원리를 생생하게 들려드릴게요.';
    this.speak(sample, { force: true });
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
    utterance.lang = this.selectedVoice?.lang || 'ko-KR';
    utterance.rate = this.rate;
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
