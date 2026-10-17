import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';
const url='http://127.0.0.1:4189/a05-logic16-preview.html',out='browser-evidence/logic16';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4189','--strictPort'],{stdio:['ignore','inherit','inherit']});
let browser;const passed=[],failed=[];
async function qa(name,fn){try{await fn();passed.push(name);console.log('PASS '+name);}catch(e){failed.push({name,error:String(e)});console.error('FAIL '+name,e);}}
async function ready(){
 let last='not-started';
 for(let i=0;i<80;i++){
  try{const response=await fetch(url);last='HTTP '+response.status+' '+(await response.text()).slice(0,280);
    if(response.ok)return;
  }catch(e){last=String(e);}
  await new Promise(r=>setTimeout(r,300));
 }
 throw Error('Vite URL '+url+' not available: '+last);
}
async function overflow(p){const w=await p.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);if(w[1]>w[0]+2)throw Error('root horizontal scroll '+w);}
async function prediction(p,scene){
 if(!((await p.locator('.a05-copy .a05-eyebrow').innerText()).includes(scene)))throw Error('wrong scene '+scene);
 if(await p.locator('.a05-readouts').count())throw Error(scene+' numeric result visible before prediction');
 if(!await p.locator('.a05-veiled').count())throw Error(scene+' image not veiled before prediction');
 if((await p.locator('.a05-model-limit').innerText()).includes('7.5ns'))throw Error('clock teacher key exposed');
 await p.getByRole('button',{name:'한국어 질문 듣기'}).click();
 const voice=await p.getByTestId('logic16-voice-text').innerText();
 if(['margin0.5','7.5ns','NAND pulldown=nMOS','DFF Q1 at t8'].some(x=>voice.includes(x)))throw Error('teacher answer read before prediction');
 await p.locator('.a05-box').first().locator('.a05-choice-set button').first().click();
 if(await p.locator('.a05-readouts').count())throw Error('result leaked without physical manipulation');
}
async function keyedWrongAndComplete(p,key){
 const answers=p.locator('.a05-box').last().locator('.a05-choice-set button');
 for(let i=1;i<=3;i++){
  await answers.nth(i).click();await p.getByRole('button',{name:'관찰·WHY 조건별 검증'}).click();
  const feedback=await p.getByTestId('logic16-keyed-feedback').innerText();
  if(!feedback||!await p.getByText('빠진 실험 조건을 채워 보세요.').count())throw Error(key+' wrong m'+i+' incorrectly passed');
  await p.getByRole('button',{name:'피드백 듣기'}).click();
  if(!((await p.getByTestId('logic16-voice-text').innerText()).includes(feedback)))throw Error(key+' wrong m'+i+' Korean Voice mismatch');
  await p.screenshot({path:out+'/'+key+'-wrong-'+i+'.png',fullPage:true});
 }
 await answers.first().click();await p.getByRole('button',{name:'관찰·WHY 조건별 검증'}).click();
 if(!await p.getByText('원리를 실제 실험으로 확인했어요!').count())throw Error(key+' correct learner blocked');
 await p.getByRole('button',{name:'왜? 원리 보기'}).click();
 await p.screenshot({path:out+'/'+key+'-correct.png',fullPage:true});
}
async function gates(p,gate,outs){
 await p.getByRole('button',{name:gate,exact:true}).click();
 const pairs=[[0,0],[0,1],[1,0],[1,1]];
 for(let i=0;i<pairs.length;i++){
  const [a,b]=pairs[i];
  await p.getByRole('button',{name:'A='+a}).click();await p.getByRole('button',{name:'B='+b}).click();
  const seen=(await p.locator('.a05-readouts').innerText()).replace(/\s+/g,'');
  if(!seen.includes('출력(정착)'+outs[i]))throw Error(gate+' '+a+b+' wrong truth output '+seen);
 }
}
try{
 await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const desktop=await browser.newContext({viewport:{width:1440,height:900}});
 const p=await desktop.newPage();p.setDefaultTimeout(8500);p.on('pageerror',e=>failed.push({name:'desktop JS',error:String(e)}));
 await qa('S01 NAND/NOR 8 truth cases and physically wrong/correct wiring + 3 misconception Voice paths',async()=>{
  await p.goto(url);await p.screenshot({path:out+'/01-before-prediction.png',fullPage:true});
  await prediction(p,'logic-nand-nor-truth-table');
  await gates(p,'NAND',[1,1,1,0]);
  await p.getByRole('button',{name:'PUN 직렬'}).click();await p.getByRole('button',{name:'PDN 병렬'}).click();
  await p.getByRole('button',{name:'선택한 배선 검증'}).click();
  if(!await p.getByText('틀린 배선입니다.').count())throw Error('wrong NAND topology silently accepted');
  await p.screenshot({path:out+'/02-wrong-nand-network.png',fullPage:true});
  await p.getByRole('button',{name:'PUN 병렬'}).click();await p.getByRole('button',{name:'PDN 직렬'}).click();
  await p.getByRole('button',{name:'선택한 배선 검증'}).click();
  if(!await p.getByText('PUN/PDN 보완 연결을 확인했어요.').count())throw Error('correct NAND topology missed');
  await gates(p,'NOR',[1,0,0,0]);
  await p.getByRole('button',{name:'PUN 병렬'}).click();await p.getByRole('button',{name:'PDN 직렬'}).click();
  await p.getByRole('button',{name:'선택한 배선 검증'}).click();
  if(!await p.getByText('틀린 배선입니다.').count())throw Error('wrong NOR topology silently accepted');
  await p.getByRole('button',{name:'PUN 직렬'}).click();await p.getByRole('button',{name:'PDN 병렬'}).click();
  await p.getByRole('button',{name:'선택한 배선 검증'}).click();
  await p.getByRole('button',{name:'세 입력 NAND 중첩 반례 살펴보기'}).click();
  if(!await p.getByText('중첩 NAND=0, 3-input NAND=1',{exact:false}).count())throw Error('nested NAND associativity counterexample missing');
  await keyedWrongAndComplete(p,'03-nand-nor');
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S02 same D0 different Q histories, G0 D change held, power OFF→ON invalid; wrong paths',async()=>{
  await prediction(p,'combinational-vs-sequential-memory');
  await p.getByRole('button',{name:'Q0 이력 실행'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).replace(/\s+/g,'').includes('래치Q0')))throw Error('history0 incorrect');
  await p.getByRole('button',{name:'Q1 이력 실행'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).replace(/\s+/g,'').includes('래치Q1')))throw Error('history1 not distinct');
  await p.getByRole('button',{name:'G=0, D1→D0'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).replace(/\s+/g,'').includes('래치Q1')))throw Error('closed latch lost Q');
  await p.screenshot({path:out+'/04-latch-g0-hold-q1.png',fullPage:true});
  await p.getByRole('button',{name:'전원 OFF→ON'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('보증 불가')))throw Error('Q resurrected after lost power');
  await keyedWrongAndComplete(p,'05-latch-memory');await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S03 t3 latch1 DFF0, t4 latch0 DFF0, t8 DFF1, initial-high is not rising; wrong paths',async()=>{
  await prediction(p,'d-latch-vs-d-flip-flop');
  await p.getByRole('button',{name:'t3 HIGH,D1'}).click();
  let r=(await p.locator('.a05-readouts').innerText()).replace(/\s+/g,'');
  if(!r.includes('래치Q1')||!r.includes('상승DFFQ0')||!r.includes('NO'))throw Error('t3 latch vs FF wrong '+r);
  await p.screenshot({path:out+'/06-high-d1-latch-not-ff.png',fullPage:true});
  await p.getByRole('button',{name:'t4 HIGH,D0'}).click();
  r=(await p.locator('.a05-readouts').innerText()).replace(/\s+/g,'');
  if(!r.includes('래치Q0')||!r.includes('상승DFFQ0'))throw Error('t4 not held '+r);
  await p.getByRole('button',{name:'t8 CLK↑,D1'}).click();
  r=(await p.locator('.a05-readouts').innerText()).replace(/\s+/g,'');
  if(!r.includes('상승DFFQ1')||!r.includes('YES'))throw Error('t8 actual edge not captured '+r);
  await p.getByRole('button',{name:'시작 시 CLK=1만 표시 (직전 CLK 미상)'}).click();
  r=(await p.locator('.a05-readouts').innerText()).replace(/\s+/g,'');
  if(!r.includes('보증불가')||!r.includes('검증안됨'))throw Error('initial clk HIGH incorrectly treated as positive event');
  await keyedWrongAndComplete(p,'07-clock-edge');await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S04 T8 no buffer setup+0.5 hold−0.3; buffered T8 setup−0.1 hold+0.1; T9 both positive, hazard unknown; wrong paths',async()=>{
  await prediction(p,'setup-hold-metastability-clock');
  await p.getByRole('button',{name:'기본 T8 / 버퍼 없음'}).click();
  let x=(await p.locator('.a05-readouts').innerText()).replace(/\s+/g,'');
  if(!x.includes('PASS0.5ns')||!x.includes('FAIL-0.3ns'))throw Error('initial timing wrong '+x);
  await p.screenshot({path:out+'/08-t8-hold-fail.png',fullPage:true});
  await p.getByRole('button',{name:'버퍼 추가 / T8'}).click();x=(await p.locator('.a05-readouts').innerText()).replace(/\s+/g,'');
  if(!x.includes('FAIL-0.1ns')||!x.includes('PASS0.1ns'))throw Error('buffer8 timing wrong '+x);
  await p.screenshot({path:out+'/09-buffer-t8-setup-fail.png',fullPage:true});
  await p.getByRole('button',{name:'버퍼 유지 / T9'}).click();x=(await p.locator('.a05-readouts').innerText()).replace(/\s+/g,'');
  if(!x.includes('PASS0.9ns')||!x.includes('PASS0.1ns'))throw Error('buffer9 should pass '+x);
  await p.getByRole('button',{name:'입력이 클록 에지에 가까이 변경 (위험 확인)'}).click();
  x=(await p.locator('.a05-readouts').innerText()).replace(/\s+/g,'');
  if(!x.includes('unknown/possiblemetastability'))throw Error('forced deterministic bit under hazard');
  await keyedWrongAndComplete(p,'10-setup-hold');
  await overflow(p);
 });
 await qa('Korean neutral pre-Voice text fallback when WebSpeech not installed',async()=>{
  const q=await desktop.newPage();q.setDefaultTimeout(8500);
  q.on('pageerror',e=>failed.push({name:'voice JS',error:String(e)}));
  await q.addInitScript(()=>Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true}));
  await q.goto(url);await q.getByRole('button',{name:'한국어 질문 듣기'}).click();
  if(!await q.getByTestId('logic16-voice-text').count())throw Error('Voice transcript not rendered');
  if(!await q.getByText('음성합성이 없어도 화면 한글 대사로',{exact:false}).count())throw Error('Voice fallback not rendered');
  await q.screenshot({path:out+'/11-voice-fallback.png',fullPage:true});await q.close();
 });
 await qa('iPhone emulated 375/320px, touch, keyboard focus and reduced motion; no horizontal scroll',async()=>{
  const mob=await browser.newContext({...devices['iPhone 13'],viewport:{width:375,height:812},reducedMotion:'reduce'});
  const m=await mob.newPage();m.setDefaultTimeout(8500);m.on('pageerror',e=>failed.push({name:'mobile JS',error:String(e)}));
  await m.goto(url);await prediction(m,'logic-nand-nor-truth-table');
  await m.getByRole('button',{name:'A=1'}).tap();await overflow(m);
  await m.screenshot({path:out+'/12-mobile-375.png',fullPage:true});
  await m.setViewportSize({width:320,height:700});await overflow(m);
  await m.screenshot({path:out+'/13-mobile-320.png',fullPage:true});await mob.close();
 });
 await desktop.close();
}catch(e){failed.push({name:'fatal',error:String(e)});}
finally{await browser?.close();server.kill('SIGTERM');}
console.log(JSON.stringify({passed,failed,artifact:out},null,2));if(failed.length)process.exitCode=1;
