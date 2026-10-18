import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';
const url='http://127.0.0.1:4186/a05-electricity-preview.html',out='browser-evidence/electricity12';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4186','--strictPort'],{stdio:['ignore','inherit','inherit']});
let browser;const passed=[],failed=[];
async function qa(name,fn){try{await fn();passed.push(name);console.log('PASS '+name);}catch(e){failed.push({name,error:String(e)});console.error('FAIL '+name,e);}}
async function ready(){for(let i=0;i<80;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}throw Error('dev server unreachable');}
const learnerPrompts={"charge-voltage-current-arrows":"전원단자 전압","resistors-series-parallel-kcl":"저항 2개를","capacitor-rc-charge-discharge":"충전 10ms/30ms","power-energy-joules-heat":"5V·10mA"};
async function verifyNeutralBeforePredict(p){
  const id=await p.locator('.a05-copy .a05-eyebrow').innerText();
  const scene=Object.keys(learnerPrompts).find(k=>id.includes(k));
  if(!scene)throw Error('unidentified pre-prediction step '+id);
  if(await p.locator('.a05-readouts').count())throw Error(scene+' exposed numeric before prediction');
  if(!await p.locator('.a05-veiled').count())throw Error(scene+' exposed SVG before prediction');
  const question=await p.locator('.a05-box').first().innerText();
  if(!question.includes(learnerPrompts[scene]))throw Error(scene+' canonical A06 learner prediction copy missing');
  await p.getByRole('button',{name:'한국어 질문 듣기'}).click();
  const speech=await p.getByTestId('electricity-voice-text').innerText();
  if(/teacherExpectedAnswer|correctIncorrectCriteria|3\\.16V|4\\.75V|2\\.289nA|0\\.330nA/.test(speech))throw Error(scene+' teacher numeric answer leaked through Korean voice');
}
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
  await p.screenshot({path:out+'/01-prediction-hidden.png',fullPage:true});await verifyNeutralBeforePredict(p);await predict(p);
 });
 await qa('S01 5V open0 and closed5mA; electron direction; misconception and hints',async()=>{
  await p.getByRole('button',{name:'열림 (OPEN)'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('0.00 mA')))throw Error('OPEN should be 0');
  await p.getByRole('button',{name:'닫힘 (CLOSED)'}).click();
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
  await verifyNeutralBeforePredict(p);await predict(p);
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
  await verifyNeutralBeforePredict(p);await predict(p);
  const slider=p.locator('#elec-rc-time');await slider.focus();await p.keyboard.press('ArrowRight');
  if(await slider.inputValue()!=='10')throw Error('keyboard slider failed');
  if(!((await p.locator('.a05-readouts').innerText()).includes('3.16 V')))throw Error('charge tau 3.16 missing');
  await p.screenshot({path:out+'/05-rc-charge-10ms.png',fullPage:true});
  await p.getByRole('button',{name:'현재 전압에서 방전'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('3.16 V')))throw Error('mid-charge discharge must retain instant voltage');
  await p.screenshot({path:out+'/06-rc-midpoint-continuity.png',fullPage:true});
  await p.getByRole('button',{name:'5V 완충 후 새 방전 실험'}).click();
  await slider.fill('10');
  if(!((await p.locator('.a05-readouts').innerText()).includes('1.84 V')))throw Error('from 5V discharge tau 1.84 missing');
  await p.screenshot({path:out+'/06b-rc-full-charge-discharge-10ms.png',fullPage:true});
  await p.getByRole('button',{name:'R=2kΩ'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('20 ms')))throw Error('tau 20 missing');
  await answer(p,'τ=RC이며 충전');
  await p.getByRole('button',{name:'관찰 조건으로 확인하기'}).click();
  if(!await p.getByText('이유까지 발견했어요!').count())throw Error('S03 failed');
  await p.screenshot({path:out+'/07-rc-double-r.png',fullPage:true});
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S04 50mW 0.5J capacitor125uJ, doubled V four times energy',async()=>{
  await verifyNeutralBeforePredict(p);await predict(p);
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
 await qa('A03 P0 design 1440/390/320: one question, scene-docked switch, true OPEN/CLOSED SVG & palette',async()=>{
  const n=await ctx.newPage();n.setDefaultTimeout(8000);n.on('pageerror',e=>failed.push({name:'A03 P0 desktop JS',error:String(e)}));
  await n.goto(url);
  const count=async(sel)=>n.locator(sel).count();
  if(await count('[data-testid="electricity-experiment-dock"]'))throw Error('experiment controls leaked before prediction');
  if(await count('.a05-readouts'))throw Error('physical readouts leaked before prediction');
  if(await count('.a05-copy .a05-box')!==1)throw Error('prediction must be only current learner question');
  const beforeText=await n.locator('.a05-copy').innerText();
  if(/MOSFET|드레인|VGS|VDS|0\\.8V/.test(beforeText))throw Error('cross-lesson MOSFET terms in A05 electricity scene');
  await n.screenshot({path:out+'/13-a03-p0-desktop-prediction-only.png',fullPage:true});
  await predict(n);
  const dock=n.getByTestId('electricity-experiment-dock');
  if(!await dock.count())throw Error('A03 scene-anchored experiment dock missing');
  if(await n.locator('.a05-copy button').filter({hasText:'열림 (OPEN)'}).count())throw Error('physical switch lives in problem panel');
  if(await count('.a05-copy .a05-choice-set'))throw Error('quiz visible before physical exploration');
  const pal=await n.evaluate(()=>{
   const sheet=getComputedStyle(document.querySelector('.a05-electricity-lab'));
   const canvas=getComputedStyle(document.querySelector('.a05-canvas-col'));
   return {outer:sheet.backgroundColor,lab:canvas.backgroundColor,primary:getComputedStyle(document.documentElement).getPropertyValue('--ie-primary').trim()};
  });
  if(pal.outer!=='rgb(245, 247, 247)'||pal.lab!=='rgb(16, 35, 51)'||pal.primary!=='#087C6D')throw Error('A03 design token mismatch '+JSON.stringify(pal));
  const geom=n.getByTestId('electricity-switch-geometry');
  await dock.getByRole('button',{name:'열림 (OPEN)'}).click();
  if(await geom.getAttribute('data-switch-state')!=='open')throw Error('switch OPEN SVG missing');
  if(!(await geom.locator('path').getAttribute('d')).includes('L313 141'))throw Error('switch OPEN conductor visually closed');
  let rd=await n.locator('.a05-readouts').innerText();
  if(!rd.includes('5 V')||!rd.includes('0.00 mA'))throw Error('OPEN source5V/current0 false '+rd);
  await n.screenshot({path:out+'/14-a03-p0-open-5V-0mA.png',fullPage:true});
  await dock.getByRole('button',{name:'닫힘 (CLOSED)'}).click();
  if(await geom.getAttribute('data-switch-state')!=='closed')throw Error('switch CLOSED SVG missing');
  if(!(await geom.locator('path').getAttribute('d')).includes('H328'))throw Error('switch CLOSED conductor visually open');
  rd=await n.locator('.a05-readouts').innerText();
  if(!rd.includes('5 V')||!rd.includes('5.00 mA'))throw Error('CLOSED source5V/current5mA false '+rd);
  await n.screenshot({path:out+'/15-a03-p0-closed-5V-5mA.png',fullPage:true});
  if(await count('.a05-copy .a05-choice-set'))throw Error('quiz visible before two direction observations');
  await dock.getByRole('button',{name:'전자 이동'}).click();
  await dock.getByRole('button',{name:'관습전류',exact:true}).click();
  if(!await count('.a05-copy .a05-choice-set'))throw Error('physical observation evidence did not unlock WHY');
  await n.screenshot({path:out+'/16-a03-p0-after-evidence-one-WHY.png',fullPage:true});
  for(const width of [390,320]){
   await n.setViewportSize({width,height:760});
   await noOverflow(n);
   const tooSmall=await n.locator('.a05-experiment-dock button').evaluateAll(bs=>bs.filter(b=>b.getBoundingClientRect().height<44).length);
   if(tooSmall)throw Error('A03 dock controls touch targets <44px '+width);
   if(!await dock.isVisible())throw Error('mobile switch dock invisible at '+width);
   await n.screenshot({path:out+'/17-a03-p0-mobile-'+width+'.png',fullPage:true});
  }
  await n.close();
 });
 await qa('A05 accepts A08 #71: 0V switch stays 0V and cannot mint 5V CLOSED mastery evidence',async()=>{
  const test=await ctx.newPage();test.setDefaultTimeout(10000);
  await test.goto(url);await predict(test);
  const dock=test.getByTestId('electricity-experiment-dock');
  await dock.getByRole('button',{name:'0 V'}).click();
  await dock.getByRole('button',{name:'닫힘 (CLOSED)'}).click();
  const readings=await test.locator('.a05-readouts').innerText();
  if(!readings.includes('0 V')||!readings.includes('0.00 mA'))throw Error('zero-voltage switch physically changed source/current '+readings);
  if(await test.getByTestId('electricity-current-flow-arrows').count())throw Error('zero-current SVG drew physical flow arrows');
  const svg=await test.locator('.a05-electricity-visual svg').getAttribute('aria-label');
  if(!svg.includes('0V')||!svg.includes('0.00밀리암페어'))throw Error('0mA missing accessible truth '+svg);
  if(await test.locator('.a05-copy .a05-choice-set').count())throw Error('0V CLOSED magically granted 5V/5mA observation');
  await test.screenshot({path:out+'/18-a08-0V-closed-no-flow.png',fullPage:true});
  await dock.getByRole('button',{name:'5 V'}).click();
  if(!((await test.locator('.a05-readouts').innerText()).includes('5.00 mA')))throw Error('5V closed must really compute 5mA');
  if(!await test.getByTestId('electricity-current-flow-arrows').count())throw Error('5V closed must show real flow arrows');
  if(await test.locator('.a05-copy .a05-choice-set').count())throw Error('just changing V cannot mint missing actual switch event');
  await dock.getByRole('button',{name:'열림 (OPEN)'}).click();
  await dock.getByRole('button',{name:'닫힘 (CLOSED)'}).click();
  await dock.getByRole('button',{name:'전자 이동'}).click();
  await dock.getByRole('button',{name:'관습전류',exact:true}).click();
  if(!await test.locator('.a05-copy .a05-choice-set').count())throw Error('actual 5V physical switch and two direction observations should unlock answer');
  await test.screenshot({path:out+'/19-a08-5V-recovered-after-direct-action.png',fullPage:true});
  await test.close();
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
  await phone.getByRole('button',{name:'닫힘 (CLOSED)'}).tap();
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
