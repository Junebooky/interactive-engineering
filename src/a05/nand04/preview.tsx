import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Nand04SceneLab} from './Nand04SceneLab';
function Preview(){
 const [speechText,setSpeechText]=useState(''),[voiceStatus,setVoiceStatus]=useState('');
 function speak(_scene:string,text:string){
  setSpeechText(text);
  if(typeof window==='undefined'||typeof window.speechSynthesis?.speak!=='function'||typeof SpeechSynthesisUtterance!=='function'){
   setVoiceStatus('이 브라우저는 음성 재생을 지원하지 않지만 글자로 계속 학습할 수 있어요.');return;
  }
  try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=.93;window.speechSynthesis.speak(u);
   setVoiceStatus('한국어 음성 재생을 요청했어요. 실제 음성 지원은 기기와 설치된 음성팩에 따라 달라요.');
  }catch{setVoiceStatus('음성이 재생되지 않아도 화면 글자로 학습할 수 있어요.');}
 }
 return <>{speechText&&<p className="a05-nand04-transcript" data-testid="nand04-voice-text">한국어 요청 대사: {speechText}</p>}
  {voiceStatus&&<p className="a05-nand04-transcript" role="status">{voiceStatus}</p>}
  <Nand04SceneLab onSpeech={speak}/></>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Preview/></StrictMode>);
