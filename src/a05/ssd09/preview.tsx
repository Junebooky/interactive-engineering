import {StrictMode,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Ssd09SceneLab} from './Ssd09SceneLab';
function Preview(){
 const [speech,setSpeech]=useState(''),[status,setStatus]=useState('');
 function speak(_id:string,txt:string){
  setSpeech(txt);
  if(typeof window==='undefined'||typeof window.speechSynthesis?.speak!=='function'||typeof SpeechSynthesisUtterance!=='function'){
   setStatus('음성합성 미지원: 화면의 한국어 대사로 동일 내용을 읽을 수 있습니다.');return;}
  try{window.speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(txt);t.lang='ko-KR';t.rate=.93;window.speechSynthesis.speak(t);
   setStatus('한국어 음성 요청됨. 실제 청취/발음 품질은 한국어 기기 음성팩 검증이 필요합니다.');
  }catch{setStatus('음성 재생 실패: 텍스트 대사가 대신 표시됩니다.');}
 }
 return <>{speech&&<p data-testid="ssd09-voice-text" className="a05-ssd09-transcript">한국어 대사: {speech}</p>}
  {status&&<p role="status" className="a05-ssd09-transcript">{status}</p>}
  <Ssd09SceneLab onSpeech={speak}/></>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Preview/></StrictMode>);
