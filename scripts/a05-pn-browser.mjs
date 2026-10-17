import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';
const url='http://127.0.0.1:4187/a05-pn-preview.html',out='browser-evidence/pn11';
await mkdir(out,{recursive:true});
const dev=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4187','--strictPort'],{stdio:['ignore','inherit','inherit']});
let browser;const passed=[],failed=[];
async function qa(name,fn){try{await fn();passed.push(name);console.log('PASS '+name);}catch(e){failed.push({name,error:String(e)});console.error('FAIL '+name,e);}}
async function ready(){for(let i=0;i<80;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}throw Error('Vite unreachable');}
const learnerPrompts={"semiconductor-band-gap":"금속처럼 에너지","silicon-donor-acceptor-doping":"5가 원자","pn-diffusion-drift-equilibrium":"접합 직후","pn-bias-depletion-calculator":"V_A=−1/0/+0.2","pn-diode-current-to-mos":"V_A=−1/0/+0.3/+0.4"};
async function verifyNeutralBeforePredict(p){
  const id=await p.locator('.a05-copy .a05-eyebrow').innerText();
  const scene=Object.keys(learnerPrompts).find(k=>id.includes(k));
  if(!scene)throw Error('unidentified pre-prediction step '+id);
  if(await p.locator('.a05-readouts').count())throw Error(scene+' exposed numeric before prediction');
  if(!await p.locator('.a05-veiled').count())throw Error(scene+' exposed SVG before prediction');
  const question=await p.locator('.a05-box').first().innerText();
  if(!question.includes(learnerPrompts[scene]))throw Error(scene+' canonical A06 learner prediction copy missing');
  await p.getByRole('button',{name:'한국어 질문 듣기'}).click();
  const speech=await p.getByTestId('pn-voice-transcript').innerText();
  if(/teacherExpectedAnswer|correctIncorrectCriteria|3\\.16V|4\\.75V|2\\.289nA|0\\.330nA/.test(speech))throw Error(scene+' teacher numeric answer leaked through Korean voice');
}
async function predict(p){await p.locator('.a05-box').first().locator('.a05-choice-set button').first().click();}
async function answer(p,contains){await p.locator('.a05-box').last().locator('.a05-choice-set button').filter({hasText:contains}).first().click();}
async function noOverflow(p){const w=await p.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);if(w[1]>w[0]+2)throw Error('horizontal overflow '+w);}
try{
 await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const c=await browser.newContext({viewport:{width:1440,height:900}});
 const p=await c.newPage();p.setDefaultTimeout(7000);
 p.on('pageerror',e=>failed.push({name:'desktop JS',error:String(e)}));
 await qa('prediction hides semiconductor numeric result',async()=>{
  await p.goto(url);
  if(await p.locator('.a05-readouts').count())throw Error('results leaked before prediction');
  await p.screenshot({path:out+'/01-pn-prediction-veil.png',fullPage:true});
  await verifyNeutralBeforePredict(p);await predict(p);
 });
 await qa('S01 metal/Si/large gap, light, misconception and hints',async()=>{
  await p.getByRole('button',{name:'금속 겹침'}).click();
  await p.getByRole('button',{name:'실리콘 1.1eV'}).click();
  await p.getByRole('button',{name:'큰 갭 5eV'}).click();
  await p.getByRole('button',{name:'실리콘 1.1eV'}).click();
  await p.getByRole('button',{name:'빛 켜기/끄기'}).click();
  await answer(p,'밴드갭은 결정에 뚫린');
  await p.getByRole('button',{name:'관찰·설명 조건 확인'}).click();
  if(!await p.getByText('빠진 조건을 먼저 찾아볼까요?').count())throw Error('wrong answer accepted');
  for(let i=0;i<3;i++)await p.getByRole('button',{name:/힌트 [0-2]\/3/}).click();
  await answer(p,'밴드갭은 허용된 전자 에너지');
  await p.getByRole('button',{name:'관찰·설명 조건 확인'}).click();
  if(!await p.getByText('밴드·전하 흐름의 이유를 발견했어요!').count())throw Error('S01 fail');
  await p.getByRole('button',{name:'왜? 원리 보기'}).click();
  await p.screenshot({path:out+'/02-pn-band-gap.png',fullPage:true});
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S02 donor electrons/p holes, neutrality and minority',async()=>{
  await verifyNeutralBeforePredict(p);await predict(p);
  await p.getByRole('button',{name:'Donor P → n형'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('electron')))throw Error('donor majority electron absent');
  await p.screenshot({path:out+'/03-pn-donor.png',fullPage:true});
  await p.getByRole('button',{name:'Acceptor B → p형'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('hole')))throw Error('acceptor majority hole absent');
  await answer(p,'Donor n형 다수는 전자');
  await p.getByRole('button',{name:'관찰·설명 조건 확인'}).click();
  if(!await p.getByText('밴드·전하 흐름의 이유를 발견했어요!').count())throw Error('S02 fail');
  await p.screenshot({path:out+'/04-pn-acceptor.png',fullPage:true});
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S03 junction diffusion→equilibrium E n+→p- net0',async()=>{
  await verifyNeutralBeforePredict(p);await predict(p);
  await p.getByRole('button',{name:'접촉·확산'}).click();
  await p.getByRole('button',{name:'평형·순전류 0'}).click();
  const txt=await p.locator('.a05-readouts').innerText();
  if(!txt.includes('n(+) → p(−)')||!txt.includes('0 (toy)'))throw Error('PN field/equilibrium not shown: '+txt);
  await answer(p,'p쪽 고정 acceptor');
  await p.getByRole('button',{name:'관찰·설명 조건 확인'}).click();
  if(!await p.getByText('밴드·전하 흐름의 이유를 발견했어요!').count())throw Error('S03 fail');
  await p.screenshot({path:out+'/05-pn-drift-diffusion.png',fullPage:true});
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S04 reverse/zero/forward W≈0.666/0.430/0.365 microns, Vbi≠battery',async()=>{
  await verifyNeutralBeforePredict(p);await predict(p);
  await p.getByRole('button',{name:'역 −1V'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('0.665')))throw Error('reverse W wrong');
  await p.screenshot({path:out+'/06-pn-reverse-w.png',fullPage:true});
  await p.getByRole('button',{name:'0V 평형'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('0.429')))throw Error('zero W wrong');
  await p.getByRole('button',{name:'순 +0.2V'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('0.364')))throw Error('forward W wrong');
  await answer(p,'역방향은 장벽을 높여');
  await p.getByRole('button',{name:'관찰·설명 조건 확인'}).click();
  if(!await p.getByText('밴드·전하 흐름의 이유를 발견했어요!').count())throw Error('S04 fail');
  await p.screenshot({path:out+'/07-pn-forward-w.png',fullPage:true});
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S05 diode continuous +0.3/+0.4 nA and -1pA vs MOS oxide',async()=>{
  await verifyNeutralBeforePredict(p);await predict(p);
  await p.getByRole('button',{name:'+0.3V'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('0.330 nA')))throw Error('0.3 current wrong');
  await p.screenshot({path:out+'/08-diode-0p3.png',fullPage:true});
  await p.getByRole('button',{name:'+0.4V'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('2.289 nA')))throw Error('0.4 current wrong');
  await p.getByRole('button',{name:'−1V',exact:true}).click();
  await p.getByRole('button',{name:'MOS oxide gate'}).click();
  await answer(p,'다이오드는 지수 I-V');
  await p.getByRole('button',{name:'관찰·설명 조건 확인'}).click();
  if(!await p.getByText('밴드·전하 흐름의 이유를 발견했어요!').count())throw Error('S05 fail');
  await noOverflow(p);
  await p.screenshot({path:out+'/09-diode-mos-oxide.png',fullPage:true});
 });
 await qa('unsupported Korean speech API creates readable text fallback',async()=>{
  const speech=await c.newPage();speech.setDefaultTimeout(7000);
  speech.on('pageerror',e=>failed.push({name:'voice JS',error:String(e)}));
  await speech.addInitScript(()=>Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true}));
  await speech.goto(url);await speech.getByRole('button',{name:'한국어 질문 듣기'}).click();
  if(!await speech.getByText('이 브라우저는 음성을 지원하지 않지만',{exact:false}).count())throw Error('voice text fallback missing');
  if(!await speech.getByTestId('pn-voice-transcript').count())throw Error('speech text missing');
  await speech.screenshot({path:out+'/10-pn-voice-fallback.png',fullPage:true});await speech.close();
 });
 await qa('375/320 iPhone Chromium touch, no horizontal overflow, reduced motion',async()=>{
  const m=await browser.newContext({...devices['iPhone 13'],viewport:{width:375,height:812},reducedMotion:'reduce'});
  const phone=await m.newPage();phone.setDefaultTimeout(7000);
  phone.on('pageerror',e=>failed.push({name:'phone JS',error:String(e)}));
  await phone.goto(url);await predict(phone);
  await phone.getByRole('button',{name:'금속 겹침'}).tap();
  await noOverflow(phone);
  await phone.screenshot({path:out+'/11-pn-mobile-375.png',fullPage:true});
  await phone.setViewportSize({width:320,height:700});await noOverflow(phone);
  await phone.screenshot({path:out+'/12-pn-mobile-320.png',fullPage:true});await m.close();
 });
 await c.close();
}catch(e){failed.push({name:'fatal',error:String(e)});}
finally{await browser?.close();dev.kill('SIGTERM');}
console.log(JSON.stringify({passed,failed,artifact:out},null,2));
if(failed.length)process.exitCode=1;
