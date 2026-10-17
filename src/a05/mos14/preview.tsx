import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Mos14SceneLab} from './Mos14SceneLab';
function Preview(){
 const [speechText,setSpeechText]=useState(''),[voiceStatus,setVoiceStatus]=useState('');
 function speech(_scene:string,text:string){
  setSpeechText(text);
  if(typeof window==='undefined'||typeof window.speechSynthesis?.speak!=='function'||typeof SpeechSynthesisUtterance!=='function'){
   setVoiceStatus('이 기기의 한국어 음성 재생을 지원하지 않지만 학생 화면 글자로 계속 학습할 수 있어요.');return;
  }
  try{
   window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);
   utterance.lang='ko-KR';utterance.rate=.93;window.speechSynthesis.speak(utterance);
   setVoiceStatus('한국어 음성 재생 요청을 보냈어요. 실제 소리는 기기의 음성팩과 설정에 따라 달라집니다.');
  }catch{setVoiceStatus('음성 재생은 실패했지만 화면 글자로 학습할 수 있어요.');}
 }
 return <>{speechText&&<p className="a05-mos14-transcript" data-testid="mos14-voice-text">재생 요청 음성: {speechText}</p>}
  {voiceStatus&&<p className="a05-mos14-voice-status" role="status">{voiceStatus}</p>}
  <Mos14SceneLab onSpeech={speech}/></>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Preview/></StrictMode>);
