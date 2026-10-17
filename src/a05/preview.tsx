import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { A05MosfetSceneLab } from './A05MosfetSceneLab';

function voicePreview(_sceneId: string, text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.94;
  window.speechSynthesis.speak(utterance);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><A05MosfetSceneLab onSpeech={voicePreview} /></StrictMode>,
);
