import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {GpuSceneLab} from './GpuSceneLab';
function Preview(){
  const [transcript,setTranscript]=useState(''),[info,setInfo]=useState('');
  function speech(_id:string,txt:string){
    setTranscript(txt);
    if(typeof window==='undefined'||typeof window.speechSynthesis?.speak!=='function'||typeof SpeechSynthesisUtterance!=='function'){
      setInfo('이 브라우저에서 음성을 사용할 수 없어도 화면 텍스트로 학습을 계속할 수 있어요.');return;
    }
    try{
      window.speechSynthesis.cancel();
      const s=new SpeechSynthesisUtterance(txt);s.lang='ko-KR';s.rate=.94;
      window.speechSynthesis.speak(s);
      setInfo('한국어 재생을 요청했어요. 실제 출력은 음성 설정과 기기에 따라 달라집니다.');
    }catch{setInfo('음성이 실행되지 않아요. 화면 텍스트로 계속 진행할 수 있어요.');}
  }
  return <>
    {transcript&&<p className="a05-gpu-transcript" data-testid="gpu-voice-text">음성 요청: {transcript}</p>}
    {info&&<p role="status" className="a05-gpu-voice-status">{info}</p>}
    <GpuSceneLab onSpeech={speech}/>
  </>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Preview/></StrictMode>);
