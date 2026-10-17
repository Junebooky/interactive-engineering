import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {SramSceneLab} from './SramSceneLab';
function SramPreview(){
  const [status,setStatus]=useState('');
  const [transcript,setTranscript]=useState('');
  const speak=(_id:string,txt:string)=>{
    setTranscript(txt);
    if(typeof window==='undefined'||typeof window.speechSynthesis?.speak!=='function'||typeof SpeechSynthesisUtterance!=='function'){
      setStatus('이 브라우저에서 한국어 음성을 지원하지 않아도 화면 텍스트로 실험할 수 있어요.');return;
    }
    try{
      window.speechSynthesis.cancel();const speech=new SpeechSynthesisUtterance(txt);
      speech.lang='ko-KR';speech.rate=.94;window.speechSynthesis.speak(speech);
      setStatus('음성 재생을 요청했어요. 실제 소리는 기기·브라우저 설정에 따라 달라져요.');
    }catch{setStatus('음성 재생에 실패했어요. 화면 텍스트로 계속 진행해 주세요.');}
  };
  return <>
    {transcript&&<p className="a05-sram-transcript" data-testid="sram-transcript">요청한 음성 문장: {transcript}</p>}
    {status&&<p className="a05-sram-voice-status" role="status">{status}</p>}
    <SramSceneLab onSpeech={speak}/>
  </>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><SramPreview/></StrictMode>);
