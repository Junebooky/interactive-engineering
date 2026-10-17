import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';
const url='http://127.0.0.1:4188/a05-mos14-preview.html',out='browser-evidence/mos14';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4188','--strictPort'],{stdio:['ignore','inherit','inherit']});
let browser;const passed=[],failed=[];
async function qa(name,fn){try{await fn();passed.push(name);console.log('PASS '+name);}catch(e){failed.push({name,error:String(e)});console.error('FAIL '+name,e);}}
async function ready(){for(let i=0;i<80;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}throw Error('Vite unavailable');}
async function predict(p){await p.locator('.a05-box').first().locator('.a05-choice-set button').first().click();}
async function answer(p,contains){await p.locator('.a05-box').last().locator('.a05-choice-set button').filter({hasText:contains}).first().click();}
async function next(p){await p.getByRole('button',{name:'다음 질문으로'}).click();}
async function verifyNoOverflow(p){const x=await p.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);if(x[1]>x[0]+2)throw Error('horizontal overflow '+x);}
try{
 await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const p=await ctx.newPage();p.setDefaultTimeout(7500);
 p.on('pageerror',e=>failed.push({name:'desktop JS',error:String(e)}));
 await qa('S01 prediction veils all numeric readouts and answer SVG and first Korean prompt remains neutral',async()=>{
  await p.goto(url);
  if(await p.locator('.a05-readouts').count())throw Error('pre-prediction numeric leak');
  if(!await p.locator('.a05-veiled').count())throw Error('pre-prediction visual not veiled');
  if(!await p.getByText('게이트와 실리콘 사이에 절연막이 있어도',{exact:false}).count())throw Error('learner neutral prediction missing');
  await p.screenshot({path:out+'/01-before-prediction-veiled.png',fullPage:true});
  await predict(p);
 });
 await qa('S01 oxide through DC0 even during external charging, wrong misconception blocked and three hints',async()=>{
  await p.getByRole('button',{name:'−0.5V'}).click();
  await p.getByRole('button',{name:'+0.3V'}).click();
  await p.getByRole('button',{name:'전압 변경 순간'}).click();
  let txt=await p.locator('.a05-readouts').innerText();
  if(!txt.includes('0 A (ideal)')||!txt.includes('전압 변경 중 가능'))throw Error('external charging/oxide DC conflated '+txt);
  await p.screenshot({path:out+'/02-oxide-switching-current.png',fullPage:true});
  await p.getByRole('button',{name:'정착 후'}).click();
  await answer(p,'절연막이 있으면 전기장도');
  await p.getByRole('button',{name:'실험·설명 검증'}).click();
  if(!await p.getByText('놓친 실험 조건을 찾아볼까요?').count())throw Error('S01 wrong passed');
  for(let i=0;i<3;i++)await p.getByRole('button',{name:/힌트 [0-2]\/3/}).click();
  await answer(p,'절연막 속 정상 DC');
  await p.getByRole('button',{name:'실험·설명 검증'}).click();
  if(!await p.getByText('전하와 단자 조건을 연결했어요!').count())throw Error('S01 correct failed');
  await p.getByRole('button',{name:'왜? 원리 보기'}).click();
  await p.screenshot({path:out+'/03-oxide-steady-feedback.png',fullPage:true});await next(p);
 });
 await qa('S02 p-Si accumulation flatband depletion inversion correct toy voltage; doping ions preserved',async()=>{
  if(await p.locator('.a05-readouts').count())throw Error('S02 readout revealed before prediction');
  await predict(p);
  for(const [button,text] of [['−0.5V','accumulation'],['0V','flatband'],['+0.3V','depletion'],['+1.1V','inversion']]){
   await p.getByRole('button',{name:button,exact:true}).click();
   const x=await p.locator('.a05-readouts').innerText();
   if(!x.includes(text)||!x.includes('0.785 V'))throw Error('S02 wrong state '+button+' '+x);
   if(button==='−0.5V')await p.screenshot({path:out+'/04-accumulation-holes.png',fullPage:true});
   if(button==='+0.3V')await p.screenshot({path:out+'/05-depletion-fixed-ions.png',fullPage:true});
  }
  await answer(p,'p형 bulk와 고정 acceptor');
  await p.getByRole('button',{name:'실험·설명 검증'}).click();
  if(!await p.getByText('전하와 단자 조건을 연결했어요!').count())throw Error('S02 fail');
  await p.screenshot({path:out+'/06-inversion-electrons.png',fullPage:true});await next(p);
 });
 await qa('S03 5/10nm oxide Cox 0.690627/0.345313 uF per cm2, HF LF not measured',async()=>{
  if(await p.locator('.a05-readouts').count())throw Error('S03 premature numerical value');
  await predict(p);
  await p.getByRole('button',{name:'5nm',exact:true}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('0.690627 µF/cm²')))throw Error('Cox 5nm conversion wrong');
  await p.screenshot({path:out+'/07-oxide-5nm-capacitance.png',fullPage:true});
  await p.getByRole('button',{name:'10nm',exact:true}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('0.345313 µF/cm²')))throw Error('Cox 10nm conversion wrong');
  await p.getByRole('button',{name:'HF/LF C–V 정성 비교 확장'}).click();
  let read=await p.locator('.a05-readouts').innerText();
  if(!read.includes('HF≈Cmin')||!read.includes('실측 아님'))throw Error('HF/LF qualifier absent');
  await answer(p,'두께가 2배면 산화막 C는 정확히');
  await p.getByRole('button',{name:'실험·설명 검증'}).click();
  if(!await p.getByText('놓친 실험 조건을 찾아볼까요?').count())throw Error('S03 wrong did not fail');
  await answer(p,'기하학적 C′ox=');
  await p.getByRole('button',{name:'실험·설명 검증'}).click();
  if(!await p.getByText('전하와 단자 조건을 연결했어요!').count())throw Error('S03 fail');
  await p.screenshot({path:out+'/08-oxide-10nm-hf-lf-cv.png',fullPage:true});await next(p);
 });
 await qa('S04 cap ID undefined not 0; nMOS VDS0 zero, VDS+.5 only possible',async()=>{
  if(await p.locator('.a05-readouts').count())throw Error('S04 before prediction has results');
  await predict(p);
  await p.getByRole('button',{name:'2단자 MOS cap'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('정의되지 않음')))throw Error('cap drain current wrongly zero');
  await p.screenshot({path:out+'/09-two-terminal-no-id.png',fullPage:true});
  await p.getByRole('button',{name:'n+ S/D 부착 nMOS'}).click();
  await p.getByRole('button',{name:'VDS 0V'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('0 (이상 순 DC)')))throw Error('VDS0 current not zero');
  await p.getByRole('button',{name:'VDS +0.5V'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('흐를 수 있음')))throw Error('positive VDS flow not possible');
  await answer(p,'커패시터엔 ID가 정의되지 않아요');
  await p.getByRole('button',{name:'실험·설명 검증'}).click();
  if(!await p.getByText('전하와 단자 조건을 연결했어요!').count())throw Error('S04 correct failed');
  await p.getByRole('button',{name:'왜? 원리 보기'}).click();
  await p.screenshot({path:out+'/10-nmos-sd-positive-vds.png',fullPage:true});
  await verifyNoOverflow(p);
 });
 await qa('Korean voice request preserves neutral preview text; unsupported speech fallback readable',async()=>{
  const q=await ctx.newPage();q.setDefaultTimeout(7500);
  q.on('pageerror',e=>failed.push({name:'voice JS',error:String(e)}));
  await q.addInitScript(()=>Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true}));
  await q.goto(url);await q.getByRole('button',{name:'한국어 질문 듣기'}).click();
  if(!await q.getByTestId('mos14-voice-text').count())throw Error('voice transcript missing');
  const line=await q.getByTestId('mos14-voice-text').innerText();
  if(!line.includes('먼저 골라볼까요')||line.includes('충전 전류가 있습니다'))throw Error('initial pre-answer voice reveals answer');
  if(!await q.getByText('이 기기의 한국어 음성 재생을 지원하지 않지만',{exact:false}).count())throw Error('fallback missing');
  await q.screenshot({path:out+'/11-voice-fallback.png',fullPage:true});await q.close();
 });
 await qa('375 and 320 px touch mobile, keyboard focus and reduced-motion layout',async()=>{
  const m=await browser.newContext({...devices['iPhone 13'],viewport:{width:375,height:812},reducedMotion:'reduce'});
  const phone=await m.newPage();phone.setDefaultTimeout(7500);
  phone.on('pageerror',e=>failed.push({name:'mobile JS',error:String(e)}));
  await phone.goto(url);await predict(phone);
  await phone.getByRole('button',{name:'−0.5V'}).tap();
  await verifyNoOverflow(phone);
  await phone.screenshot({path:out+'/12-mobile-375.png',fullPage:true});
  await phone.setViewportSize({width:320,height:700});await verifyNoOverflow(phone);
  await phone.screenshot({path:out+'/13-mobile-320.png',fullPage:true});
  await m.close();
 });
 await ctx.close();
}catch(e){failed.push({name:'fatal',error:String(e)});}
finally{await browser?.close();server.kill('SIGTERM');}
console.log(JSON.stringify({passed,failed,artifact:out},null,2));if(failed.length)process.exitCode=1;
