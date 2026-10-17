import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DramSceneLab } from './DramSceneLab';
createRoot(document.getElementById('root')!).render(<StrictMode>
  <DramSceneLab onSpeech={(_, text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const spoken = new SpeechSynthesisUtterance(text);
    spoken.lang='ko-KR'; spoken.rate=0.94;
    window.speechSynthesis.speak(spoken);
  }}/>
</StrictMode>);
