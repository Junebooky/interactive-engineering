import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';
const url='http://127.0.0.1:4186/a05-electricity-preview.html',out='browser-evidence/electricity12';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4186','--strictPort'],{stdio:['ignore','inherit','inherit']});
let browser;const passed=[],failed=[];
async function qa(name,fn){try{await fn();passed.push(name);console.log('PASS '+name);}catch(e){failed.push({name,error:String(e)});console.error('FAIL '+name,e);}}
async function ready(){for(let i=0;i<80;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}throw Error('dev server unreachable');}
async function predict(p){await p.locator('.a05-box').first().locator('.a05-choice-set button').first().click();}
async function answer(p,words){await p.locator('.a05-box').last().locator('.a05-choice-set button').filter({hasText:words}).first().click();}
async function noOverflow(p){const x=await p.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);if(x[1]>x[0]+2)throw Error('overflow:'+x);}
try{
 await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const p=await ctx.newPage();p.setDefaultTimeout(8000);p.on('pageerror',e=>failed.push({name:'desktop JS',error:String(e)}));
 await qa('before prediction numeric readouts hidden',async()=>{
  await p.goto(url);
  if(await p.locator('.a05-readouts').count())throw Error('readouts revealed before prediction');
  await p.screenshot({path:out+'/01-prediction-hidden.png',fullPage:true});await predict(p);
 });
 await qa('S01 5V open0 and closed5mA; electron direction; misconception and hints',async()=>{
  await p.getByRole('button',{name:'OPEN · OFF'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('0.00 mA')))throw Error('OPEN should be 0');
  await p.getByRole('button',{name:'CLOSED · ON'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('5.00 mA')))throw Error('CLOSED should be 5mA');
  await p.getByRole('button',{name:'전자 이동'}).click();
  await p.getByRole('button',{name:'관습전류',exact:true}).click();
  await answer(p,'5V면 언제나 5A'); // verify wrong answer yields feedback
  await p.getByRole('button',{name:'관찰 조건으로 확인하기'}).click();
  if(!await p.getByText('아직 확인할 실험 조건이').count())throw Error('wrong answer was accepted');
  for(let i=0;i<3;i++)await p.getByRole('button',{name:/힌트 [0-2]\/3/}).click();
  await answer(p,'열린 5V 회로');
  await p.getByRole('button',{name:'관찰 조건으로 확인하기'}).click();
  if(!await p.getByText('이유까지 발견했어요!').count())throw Error('correct S01 answer failed');
  await p.getByRole('button',{name:'왜? 원리 보기'}).click();
  await p.screenshot({path:out+'/02-voltage-current-arrows.png',fullPage:true});
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S02 series 2.5mA, parallel 10mA & KCL',async()=>{
  await predict(p);
  await p.getByRole('button',{name:'직렬 2kΩ'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('2.50 mA')))throw Error('series 2.5mA missing');
  await p.screenshot({path:out+'/03-resistors-series.png',fullPage:true});
  await p.getByRole('button',{name:'병렬 500Ω'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('10.00 mA')))throw Error('parallel 10mA missing');
  await answer(p,'직렬은 같은 2.5mA');
  await p.getByRole('button',{name:'관찰 조건으로 확인하기'}).click();
  if(!await p.getByText('이유까지 발견했어요!').count())throw Error('S02 failed');
  await p.screenshot({path:out+'/04-resistors-parallel.png',fullPage:true});
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S03 keyboard RC slider tau10, charge3.16, discharge1.84, changed RC tau20',async()=>{
  await predict(p);
  const slider=p.locator('#elec-rc-time');await slider.focus();await p.keyboard.press('ArrowRight');
  if(await slider.inputValue()!=='10')throw Error('keyboard slider failed');
  if(!((await p.locator('.a05-readouts').innerText()).includes('3.16 V')))throw Error('charge tau 3.16 missing');
  await p.screenshot({path:out+'/05-rc-charge-10ms.png',fullPage:true});
  await p.getByRole('button',{name:'방전',exact:true}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('1.84 V')))throw Error('discharge tau 1.84 missing');
  await p.screenshot({path:out+'/06-rc-discharge-10ms.png',fullPage:true});
  await p.getByRole('button',{name:'R=2kΩ'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('20 ms')))throw Error('tau 20 missing');
  await answer(p,'τ=RC이며 충전');
  await p.getByRole('button',{name:'관찰 조건으로 확인하기'}).click();
  if(!await p.getByText('이유까지 발견했어요!').count())throw Error('S03 failed');
  await p.screenshot({path:out+'/07-rc-double-r.png',fullPage:true});
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S04 50mW 0.5J capacitor125uJ, doubled V four times energy',async()=>{
  await predict(p);
  await p.getByRole('button',{name:'10mA',exact:true}).click();
  await p.getByRole('button',{name:'10초',exact:true}).click();
  const base=await p.locator('.a05-readouts').innerText();
  if(!base.includes('50 mW')||!base.includes('0.50 J')||!base.includes('125 µJ'))throw Error('base power/energy inconsistent '+base);
  await p.screenshot({path:out+'/08-power-base.png',fullPage:true});
  await p.getByRole('button',{name:'10V',exact:true}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('500 µJ')))throw Error('capacitor energy quadruple missing');
  await answer(p,'P=VI는 W=J/s');
  await p.getByRole('button',{name:'관찰 조건으로 확인하기'}).click();
  if(!await p.getByText('이유까지 발견했어요!').count())throw Error('S04 failed');
  await noOverflow(p);
  await p.screenshot({path:out+'/09-capacitor-energy.png',fullPage:true});
 });
 await qa('voice unavailable gives Korean readable fallback',async()=>{
  const v=await ctx.newPage();v.setDefaultTimeout(8000);v.on('pageerror',e=>failed.push({name:'voice JS',error:String(e)}));
  await v.addInitScript(()=>Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true}));
  await v.goto(url);await v.getByRole('button',{name:'한국어 질문 듣기'}).click();
  if(!await v.getByText('이 브라우저에서 음성을 지원하지 않지만',{exact:false}).count())throw Error('no voice fallback');
  if(!await v.getByTestId('electricity-voice-text').count())throw Error('voice text missing');
  await v.screenshot({path:out+'/10-voice-text-fallback.png',fullPage:true});await v.close();
 });
 await qa('emulated iPhone touch 375/320, no horizontal overflow, reduced-motion',async()=>{
  const m=await browser.newContext({...devices['iPhone 13'],viewport:{width:375,height:812},reducedMotion:'reduce'});
  const phone=await m.newPage();phone.setDefaultTimeout(8000);phone.on('pageerror',e=>failed.push({name:'mobile JS',error:String(e)}));
  await phone.goto(url);await predict(phone);
  await phone.getByRole('button',{name:'CLOSED · ON'}).tap();
  await noOverflow(phone);
  await phone.screenshot({path:out+'/11-mobile-375.png',fullPage:true});
  await phone.setViewportSize({width:320,height:710});await noOverflow(phone);
  await phone.screenshot({path:out+'/12-mobile-320.png',fullPage:true});await m.close();
 });
 await ctx.close();
}catch(e){failed.push({name:'fatal',error:String(e)});}
finally{await browser?.close();server.kill('SIGTERM');}
console.log(JSON.stringify({passed,failed,artifact:out},null,2));
if(failed.length)process.exitCode=1;
