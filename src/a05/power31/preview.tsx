import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Power31SceneLab} from './Power31SceneLab';
function Preview(){
 const [voice,setVoice]=useState(''),[status,setStatus]=useState('');
 function speak(_id:string,text:string){
  setVoice(text);
  if(typeof window==='undefined'||typeof window.speechSynthesis?.speak!=='function'||typeof SpeechSynthesisUtterance!=='function'){
   setStatus('이 브라우저에는 한국어 음성합성 기능이 없어 문자를 대신 표시해요.');return;}
  try{window.speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(text);t.lang='ko-KR';t.rate=.93;window.speechSynthesis.speak(t);
   setStatus('한국어 음성 재생을 요청했습니다. 실제 청취 품질은 기기·한국어 음성팩에 따라 다릅니다.');
  }catch{setStatus('음성 재생에 실패했습니다. 화면 대사로 계속 학습할 수 있어요.');}
 }
 return <>{voice&&<p className="a05-power31-transcript" data-testid="power31-voice-text">한국어 요청: {voice}</p>}
  {status&&<p role="status" className="a05-power31-transcript">{status}</p>}<Power31SceneLab onSpeech={speak}/></>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Preview/></StrictMode>);
