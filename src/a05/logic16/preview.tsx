import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Logic16SceneLab} from './Logic16SceneLab';
function Preview(){
 const [speechText,setSpeechText]=useState(''),[voiceStatus,setVoiceStatus]=useState('');
 function speak(_scene:string,text:string){setSpeechText(text);
  if(typeof window==='undefined'||typeof window.speechSynthesis?.speak!=='function'||typeof SpeechSynthesisUtterance!=='function'){
    setVoiceStatus('음성합성이 없어도 화면 한글 대사로 학습할 수 있어요.');return;}
  try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=.92;window.speechSynthesis.speak(u);
   setVoiceStatus('한국어 음성을 요청했어요. 실제 재생과 청취는 기기/음성팩에 따라 달라요.');
  }catch{setVoiceStatus('음성 재생 실패. 학습 문구는 이 화면에 표시됩니다.');}
 }
 return <>{speechText&&<p className="a05-logic16-transcript" data-testid="logic16-voice-text">한국어 대사: {speechText}</p>}
  {voiceStatus&&<p className="a05-logic16-transcript" role="status">{voiceStatus}</p>}
  <Logic16SceneLab onSpeech={speak}/></>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Preview/></StrictMode>);
