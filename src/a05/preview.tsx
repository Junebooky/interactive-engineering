import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { A05MosfetSceneLab } from './A05MosfetSceneLab';

function M01StandalonePreview() {
  const [voiceNotice,setVoiceNotice]=useState('');
  function voicePreview(_sceneId:string,text:string) {
    const available=typeof window !== 'undefined' &&
      typeof window.speechSynthesis?.speak==='function' &&
      typeof SpeechSynthesisUtterance==='function';
    if(!available){
      setVoiceNotice('이 브라우저에서는 음성 재생을 지원하지 않아요. 화면의 문장을 읽으며 계속 진행할 수 있어요.');
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const spoken=new SpeechSynthesisUtterance(text);
      spoken.lang='ko-KR';spoken.rate=.94;
      window.speechSynthesis.speak(spoken);
      setVoiceNotice('한국어 음성 재생을 요청했어요. 실제 재생 여부는 기기 음성 설정에 따라 달라질 수 있어요.');
    } catch {
      setVoiceNotice('음성을 재생할 수 없어요. 학습은 화면의 문장으로 계속할 수 있어요.');
    }
  }
  return <>
    {voiceNotice && <p role="status" aria-live="polite" style={{
      background:'#112b39',color:'#e3fff1',border:'1px solid #5aaea8',
      margin:0,padding:'12px 20px',fontFamily:'system-ui'
    }}>{voiceNotice}</p>}
    <A05MosfetSceneLab onSpeech={voicePreview}/>
  </>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><M01StandalonePreview/></StrictMode>,
);
