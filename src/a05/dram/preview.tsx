import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DramSceneLab } from './DramSceneLab';
function DramPreview() {
  const [voiceInfo,setVoiceInfo]=useState('');
  const [voiceTranscript,setVoiceTranscript]=useState('');
  const speak=(_sceneId:string,text:string)=>{
    setVoiceTranscript(text);
    const available=typeof window !== 'undefined' &&
      typeof window.speechSynthesis?.speak==='function' &&
      typeof SpeechSynthesisUtterance==='function';
    if(!available){
      setVoiceInfo('이 브라우저에서는 음성을 지원하지 않아요. 화면의 텍스트로 학습을 계속할 수 있어요.');
      return;
    }
    try{
      window.speechSynthesis.cancel();
      const utterance=new SpeechSynthesisUtterance(text);
      utterance.lang='ko-KR'; utterance.rate=.94;
      window.speechSynthesis.speak(utterance);
      setVoiceInfo('음성 재생을 요청했어요. 실제 발화 여부는 기기와 음성 설정에 따라 달라집니다.');
    }catch{
      setVoiceInfo('음성 재생에 실패했어요. 화면의 텍스트로 학습을 계속할 수 있어요.');
    }
  };
  return <>
    {voiceTranscript && <p className="a05-dram-transcript" data-testid="a05-dram-voice-transcript"><strong>요청한 음성 문장:</strong> {voiceTranscript}</p>}
    {voiceInfo && <p role="status" aria-live="polite" className="a05-dram-voice-status">{voiceInfo}</p>}
    <DramSceneLab onSpeech={speak}/>
  </>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><DramPreview/></StrictMode>);
