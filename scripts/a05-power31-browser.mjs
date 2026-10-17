import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';
const url='http://127.0.0.1:4189/a05-power31-preview.html',out='browser-evidence/power31';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4189','--strictPort'],{stdio:['ignore','inherit','inherit']});
const passed=[],failed=[];let browser;
async function qa(name,fn){try{await fn();passed.push(name);console.log('PASS '+name);}catch(e){failed.push({name,error:String(e)});console.error('FAIL '+name,e);}}
async function ready(){for(let i=0;i<80;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}throw Error('Vite dev server unavailable');}
async function noOverflow(p){const [w,scroll]=await p.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);if(scroll>w+2)throw Error('mobile horizontal overflow '+w+'/'+scroll);}
async function begin(p,scene){
 const id=await p.locator('.a05-copy .a05-eyebrow').innerText();
 if(!id.includes(scene))throw Error('wrong step '+scene+': '+id);
 if(await p.locator('.a05-readouts').count())throw Error('teacher numbers leaked before prediction');
 if(!await p.locator('.a05-veiled').count())throw Error('answer SVG not veiled before prediction');
 const limit=await p.locator('.a05-model-limit').innerText();
 for(const secret of ['111.111','44.444','3.7037','4.7847','1.2/1.35','3.2W'])if(limit.includes(secret))throw Error('source-specific teacher assumption leaked '+secret);
 await p.getByRole('button',{name:'한국어 질문 듣기'}).click();
 const speech=await p.getByTestId('power31-voice-text').innerText();
 if(['111.111','44.444','3.7037','4.7847','33.6MWh'].some(x=>speech.includes(x)))throw Error('teacher numeric answer leaked in before voice');
 await p.locator('.a05-box').first().locator('.a05-choice-set button').first().click();
 if(await p.locator('.a05-readouts').count())throw Error('numeric SVG/readout leaked before physical action');
 if(await p.getByRole('button',{name:'관찰·WHY 조건 검증'}).count())throw Error('teacher final choice shown before physical action');
}
async function wrongThenCorrect(p,stage){
 const answers=p.locator('.a05-box').last().locator('.a05-choice-set button');
 for(let i=1;i<=3;i++){
  await answers.nth(i).click();await p.getByRole('button',{name:'관찰·WHY 조건 검증'}).click();
  const feedback=await p.getByTestId('power31-keyed-feedback').innerText();
  if(!feedback||!await p.getByText('더 비교할 관찰 조건이 있어요').count())throw Error(stage+' misconception m'+i+' incorrectly passed');
  await p.getByRole('button',{name:'피드백 듣기'}).click();
  if(!((await p.getByTestId('power31-voice-text').innerText()).includes(feedback)))throw Error(stage+' correction Korean Voice mismatch m'+i);
  await p.screenshot({path:out+'/'+stage+'-wrong-'+i+'.png',fullPage:true});
 }
 await answers.first().click();await p.getByRole('button',{name:'관찰·WHY 조건 검증'}).click();
 if(!await p.getByText('단위와 경계의 물리를 확인했어요!').count())throw Error(stage+' right-first valid completion failed');
 await p.getByRole('button',{name:'왜? 원리 보기'}).click();
 await p.screenshot({path:out+'/'+stage+'-correct.png',fullPage:true});
}
try{
 await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const p=await ctx.newPage();p.setDefaultTimeout(8500);p.on('pageerror',e=>failed.push({name:'desktop JS',error:String(e)}));
 await qa('S01 PSU η90/95 output100W input/loss denominator, 3 cause-specific Voice errors',async()=>{
  await p.goto(url);await p.screenshot({path:out+'/01-initial-questions-veiled.png',fullPage:true});
  await begin(p,'server-psu-loss-heat');
  await p.getByRole('button',{name:'PSU 90%'}).click();
  let x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('111.111111')||!x.includes('11.111111'))throw Error('PSU 90 efficiency denominator wrong');
  await p.getByRole('button',{name:'PSU 95%'}).click();
  x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('105.263158')||!x.includes('5.263158'))throw Error('PSU 95 wrong');
  await wrongThenCorrect(p,'02-psu');await p.getByRole('button',{name:'다음 장면으로'}).click();
 });
 await qa('S02 ideal CCM 12V duty 1/4 1/3 1/2 versus η90% Iin 3.703704 separate branch',async()=>{
  await begin(p,'gpu-buck-vrm-duty-ratio');
  for(const [button,expected] of [['D 25%','3'],['D 33.33%','4'],['D 50%','6']]){
   await p.getByRole('button',{name:button}).click();
   const observed=await p.locator('.a05-readouts').innerText();
   if(!observed.includes('이상 CCM Vout'+expected+' V'))throw Error('buck duty '+button+' failed '+observed);
  }
  await p.getByRole('button',{name:'D 33.33%'}).click();
  await p.getByRole('button',{name:'η 90% power example'}).click();
  const observed=await p.locator('.a05-readouts').innerText();
  if(!observed.includes('3.703704')||!observed.includes('4.444444'))throw Error('buck 90 current/efficiency incorrect');
  await p.screenshot({path:out+'/03-buck-ideal-and-separate-loss.png',fullPage:true});
  await wrongThenCorrect(p,'04-vrm');await p.getByRole('button',{name:'다음 장면으로'}).click();
 });
 await qa('S03 GPU PDN 40W constant rail2/1V current20/40A and loss0.8/3.2W vs wire resistance',async()=>{
  await begin(p,'gpu-pdn-current-heat');
  await p.getByRole('button',{name:'Wire 2mΩ'}).click();
  await p.getByRole('button',{name:'Rail 2V'}).click();
  let x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('20 A')||!x.includes('0.8 W'))throw Error('PDN rail2 wrong '+x);
  await p.getByRole('button',{name:'Rail 1V'}).click();x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('40 A')||!x.includes('3.2 W'))throw Error('PDN rail1 wrong '+x);
  await p.getByRole('button',{name:'Wire 1mΩ'}).click();x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('1.6 W'))throw Error('R half wrong '+x);
  await wrongThenCorrect(p,'05-pdn');await p.getByRole('button',{name:'다음 장면으로'}).click();
 });
 await qa('S04 CDU coolant kg/s inversely proportional ΔT, unlike unknown site makeup and WUE; wrong Voice',async()=>{
  await begin(p,'cdu-water-loop-heat-flow');
  await p.getByRole('button',{name:'Heat 100kW'}).click();
  await p.getByRole('button',{name:'ΔT 5K'}).click();
  let x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('4.784689')||!x.includes('미정 (별도)'))throw Error('coolant flow/site consumption confused '+x);
  await p.getByRole('button',{name:'ΔT 10K'}).click();x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('2.392344'))throw Error('coolant delta T inverse missing');
  await p.getByRole('button',{name:'Heat 50kW'}).click();
  await p.getByRole('button',{name:'Dry cooling'}).click();
  await p.getByRole('button',{name:'Cooling tower'}).click();
  await p.screenshot({path:out+'/06-cdu-flow-vs-makeup-water.png',fullPage:true});
  await wrongThenCorrect(p,'07-cdu');await p.getByRole('button',{name:'다음 장면으로'}).click();
 });
 await qa('S05 1MW PUE1.4→1.2 saves 4.8MWh/24h, site A PUE vs B WUE separate no tokens',async()=>{
  await begin(p,'data-center-pue-wue-tradeoff');
  await p.getByRole('button',{name:'PUE 1.4'}).click();
  let x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('1.4 MW')||!x.includes('33.6 MWh'))throw Error('facility PUE 1.4 wrong');
  await p.getByRole('button',{name:'PUE 1.2'}).click();x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('1.2 MW')||!x.includes('28.8 MWh'))throw Error('facility PUE1.2 wrong');
  await p.getByRole('button',{name:'Site A'}).click();x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('2 L/kWh'))throw Error('site A water wrong');
  await p.getByRole('button',{name:'Site B'}).click();x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('0.5 L/kWh')||!x.includes('1.35'))throw Error('site B metric wrong');
  await wrongThenCorrect(p,'08-pue-wue');await noOverflow(p);
 });
 await qa('Korean WebSpeech unavailable gracefully shows transcript/fallback',async()=>{
  const q=await ctx.newPage();q.setDefaultTimeout(8500);
  q.on('pageerror',e=>failed.push({name:'voice JS',error:String(e)}));
  await q.addInitScript(()=>Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true}));
  await q.goto(url);await q.getByRole('button',{name:'한국어 질문 듣기'}).click();
  if(!await q.getByTestId('power31-voice-text').count())throw Error('no fallback transcript');
  if(!await q.getByText('이 브라우저에는 한국어 음성합성 기능이 없어',{exact:false}).count())throw Error('no fallback caption');
  await q.screenshot({path:out+'/09-voice-fallback.png',fullPage:true});await q.close();
 });
 await qa('mobile iPhone emulated 375 and 320px touch/reduced motion no horizontal root overflow',async()=>{
  const mob=await browser.newContext({...devices['iPhone 13'],viewport:{width:375,height:812},reducedMotion:'reduce'});
  const m=await mob.newPage();m.setDefaultTimeout(8500);
  m.on('pageerror',e=>failed.push({name:'mobile JS',error:String(e)}));
  await m.goto(url);await begin(m,'server-psu-loss-heat');
  await m.getByRole('button',{name:'PSU 95%'}).tap();await noOverflow(m);
  await m.screenshot({path:out+'/10-mobile-375.png',fullPage:true});
  await m.setViewportSize({width:320,height:700});await noOverflow(m);
  await m.screenshot({path:out+'/11-mobile-320.png',fullPage:true});
  await mob.close();
 });
 await ctx.close();
}catch(e){failed.push({name:'fatal',error:String(e)});}
finally{await browser?.close();server.kill('SIGTERM');}
console.log(JSON.stringify({passed,failed,artifact:out},null,2));if(failed.length)process.exitCode=1;
