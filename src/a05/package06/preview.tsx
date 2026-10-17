import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Package06SceneLab} from './Package06SceneLab';
function Preview(){
 const [text,setText]=useState(''),[status,setStatus]=useState('');
 function speak(_id:string,txt:string){setText(txt);
  if(typeof window==='undefined'||typeof window.speechSynthesis?.speak!=='function'||typeof SpeechSynthesisUtterance!=='function'){
   setStatus('한국어 음성합성 기능이 없어 대사를 화면에 표시합니다.');return;
  }
  try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(txt);u.lang='ko-KR';u.rate=.93;window.speechSynthesis.speak(u);
   setStatus('한국어 음성을 요청했습니다. 실제 청취·발음 검증은 실기기에서 필요합니다.');
  }catch{setStatus('음성 실행에 실패했습니다. 텍스트 대사를 볼 수 있습니다.');}
 }
 return <>{text&&<p data-testid="package06-voice-text" className="a05-package06-transcript">한국어 대사: {text}</p>}
  {status&&<p role="status" className="a05-package06-transcript">{status}</p>}
  <Package06SceneLab onSpeech={speak}/></>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Preview/></StrictMode>);
