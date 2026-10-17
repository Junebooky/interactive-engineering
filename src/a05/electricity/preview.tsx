import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ElectricitySceneLab} from './ElectricitySceneLab';
function Preview(){
 const [transcript,setTranscript]=useState(''),[status,setStatus]=useState('');
 function speak(_sceneId:string,text:string){
  setTranscript(text);
  if(typeof window==='undefined'||typeof window.speechSynthesis?.speak!=='function'||typeof SpeechSynthesisUtterance!=='function'){
   setStatus('이 브라우저에서 음성을 지원하지 않지만 화면 텍스트로 계속 학습할 수 있어요.');return;
  }
  try{window.speechSynthesis.cancel();
   const msg=new SpeechSynthesisUtterance(text);msg.lang='ko-KR';msg.rate=.94;
   window.speechSynthesis.speak(msg);
   setStatus('음성 재생을 요청했어요. 실제 청취 여부는 음성팩과 기기 설정에 따릅니다.');
  }catch{setStatus('음성 출력이 실패했어요. 화면 텍스트로 계속할 수 있어요.');}
 }
 return <>
  {transcript&&<p className="a05-electricity-transcript" data-testid="electricity-voice-text"><strong>요청한 한국어 음성:</strong> {transcript}</p>}
  {status&&<p className="a05-electricity-voice-status" role="status">{status}</p>}
  <ElectricitySceneLab onSpeech={speak}/>
 </>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Preview/></StrictMode>);
