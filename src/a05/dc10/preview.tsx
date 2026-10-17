import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Dc10SceneLab} from './Dc10SceneLab';
function Preview(){
 const [text,setText]=useState(''),[status,setStatus]=useState('');
 function speak(_id:string,content:string){
  setText(content);
  if(typeof window==='undefined'||typeof window.speechSynthesis?.speak!=='function'||typeof SpeechSynthesisUtterance!=='function'){
   setStatus('한국어 음성합성 기능이 없어 대사를 화면에 표시합니다.');return;
  }
  try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(content);u.lang='ko-KR';u.rate=.93;window.speechSynthesis.speak(u);
   setStatus('한국어 음성 재생을 요청했습니다. 실제 청취 및 발음은 실기기 확인이 필요합니다.');
  }catch{setStatus('음성 재생이 불가능하여 한국어 대사 텍스트를 표시합니다.');}
 }
 return <>{text&&<p className="a05-dc10-transcript" data-testid="dc10-voice-text">한국어 대사: {text}</p>}
 {status&&<p role="status" className="a05-dc10-transcript">{status}</p>}
 <Dc10SceneLab onSpeech={speak}/></>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Preview/></StrictMode>);
