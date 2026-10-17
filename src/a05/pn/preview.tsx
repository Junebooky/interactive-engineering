import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {PnSceneLab} from './PnSceneLab';
function Preview(){
 const [transcript,setTranscript]=useState(''),[status,setStatus]=useState('');
 function speech(_id:string,text:string){
  setTranscript(text);
  if(typeof window==='undefined'||typeof window.speechSynthesis?.speak!=='function'||typeof SpeechSynthesisUtterance!=='function'){
   setStatus('이 브라우저는 음성을 지원하지 않지만 한국어 화면 텍스트로 계속 학습할 수 있어요.');return;
  }
  try{window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);
   utterance.lang='ko-KR';utterance.rate=.94;window.speechSynthesis.speak(utterance);
   setStatus('음성 재생을 요청했어요. 실제 소리는 기기와 설치된 음성팩에 따라 달라져요.');
  }catch{setStatus('음성 요청에 실패해도 화면 텍스트로 학습할 수 있어요.');}
 }
 return <>
  {transcript&&<p className="a05-pn-transcript" data-testid="pn-voice-transcript">요청한 음성: {transcript}</p>}
  {status&&<p className="a05-pn-voice-status" role="status">{status}</p>}
  <PnSceneLab onSpeech={speech}/>
 </>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Preview/></StrictMode>);
