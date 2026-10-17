import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';

const url='http://127.0.0.1:4185/a05-gpu-preview.html',out='browser-evidence/g03';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4185','--strictPort'],{stdio:['ignore','inherit','inherit']});
const passed=[],failed=[];let browser;
async function test(name,fn){try{await fn();passed.push(name);console.log('PASS '+name);}catch(e){failed.push({name,error:String(e)});console.error('FAIL '+name,e);}}
async function ready(){for(let i=0;i<60;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}throw Error('No Vite');}
async function predict(p){await p.locator('.a05-box').first().locator('.a05-choice-set button').first().click();}
async function answer(p,text){await p.locator('.a05-box').last().locator('.a05-choice-set button').filter({hasText:text}).first().click();}
async function noOverflow(p){const x=await p.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);if(x[1]>x[0]+2)throw Error('horizontal overflow '+x);}
try{
 await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await ctx.newPage();page.setDefaultTimeout(7000);
 page.on('pageerror',e=>failed.push({name:'desktop JS',error:String(e)}));
 await test('prediction hides GPU live scene',async()=>{
   await page.goto(url);
   if(await page.locator('.a05-readouts').count())throw Error('pre-prediction values visible');
   await page.screenshot({path:out+'/01-gpu-predict-hidden.png',fullPage:true});
   await predict(page);
 });
 await test('S01 compute16/32 and feed8/32 show correct overlapping pipeline',async()=>{
   await page.getByRole('button',{name:'compute 16'}).click();
   await page.getByRole('button',{name:'compute 32'}).click();
   if(!((await page.locator('.a05-readouts').innerText()).includes('8 toy s')))throw Error('feed8 should take 8 toy s');
   await page.screenshot({path:out+'/02-feed8-compute32.png',fullPage:true});
   await page.getByRole('button',{name:'feed 32'}).click();
   if(!((await page.locator('.a05-readouts').innerText()).includes('2 toy s')))throw Error('compute32 feed32 should take 2 toy s');
   await answer(page,'min(compute,feed)');
   await page.getByRole('button',{name:'조건별로 확인하기'}).click();
   if(!await page.getByText('원리와 관찰을 연결했어요!').count())throw Error('G03-S01 failed');
   await page.getByRole('button',{name:'왜? 원리 보기'}).click();
   await page.screenshot({path:out+'/03-feed32-compute32.png',fullPage:true});
   await page.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await test('S02 DDR/GDDR/HBM are DRAM with distinct installation',async()=>{
   await predict(page);
   // Wrong matching is now possible: old pre-matched controls hid this misconception.
   await page.getByRole('button',{name:'HBM',exact:true}).click();
   await page.getByRole('button',{name:'선택한 짝 검사하기'}).click();
   if(!await page.getByText('오답: HBM은',{exact:false}).count())throw Error('S02 independent wrong pairing not visible');
   await page.screenshot({path:out+'/04a-wrong-hbm-at-cpu-dimm.png',fullPage:true});
   await page.getByRole('button',{name:'DDR/RDIMM',exact:true}).click();
   await page.getByRole('button',{name:'CPU DIMM',exact:true}).click();
   await page.getByRole('button',{name:'선택한 짝 검사하기'}).click();
   await page.getByRole('button',{name:'GDDR6',exact:true}).click();
   await page.getByRole('button',{name:'GPU 보드',exact:true}).click();
   await page.getByRole('button',{name:'선택한 짝 검사하기'}).click();
   await page.getByRole('button',{name:'GDDR7',exact:true}).click();
   await page.getByRole('button',{name:'선택한 짝 검사하기'}).click();
   await page.getByRole('button',{name:'HBM',exact:true}).click();
   await page.getByRole('button',{name:'GPU 패키지',exact:true}).click();
   await page.getByRole('button',{name:'선택한 짝 검사하기'}).click();
   const panel=await page.locator('.a05-readouts').innerText();
   if(!panel.includes('HBM')||!panel.includes('모두 DRAM'))throw Error('HBM not DRAM');
   await answer(page,'셋 모두 DRAM');
   await page.getByRole('button',{name:'조건별로 확인하기'}).click();
   if(!await page.getByText('원리와 관찰을 연결했어요!').count())throw Error('G03-S02 failed');
   await page.screenshot({path:out+'/04-memory-families.png',fullPage:true});
   await page.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await test('S03 theoretical 384/512 GB/s; PAM3 3 levels not 3 bits',async()=>{
   await predict(page);
   await page.getByRole('button',{name:'24 Gb/s/pin'}).click();
   if(await page.locator('.a05-readouts').count())throw Error('numeric answers revealed before quiz');
   const quiz24=page.locator('.a05-gpu-controls .a05-control-buttons').nth(2);
   const quiz32=page.locator('.a05-gpu-controls .a05-control-buttons').nth(3);
   await quiz24.getByRole('button',{name:'192 GB/s'}).click();
   if(await page.locator('.a05-readouts').count())throw Error('numeric answer revealed after only first try');
   await quiz24.getByRole('button',{name:'384 GB/s'}).click();
   await page.getByRole('button',{name:'32 Gb/s/pin'}).click();
   await quiz32.getByRole('button',{name:'384 GB/s'}).click();
   await answer(page,'이론 GB/s=bit폭');
   await page.getByRole('button',{name:'조건별로 확인하기'}).click();
   if(!await page.getByText('빠진 조건이 있는지').count())throw Error('wrong 32Gb/s selection wrongly passed');
   await page.screenshot({path:out+'/05a-wrong-32Gbps-quiz.png',fullPage:true});
   await quiz32.getByRole('button',{name:'512 GB/s'}).click();
   await page.getByRole('button',{name:'PAM3 3레벨'}).click();
   const show=await page.locator('.a05-readouts').innerText();
   if(!show.includes('512 GB/s')||!show.includes('3 levels'))throw Error('32GBps/pam3 missing '+show);
   await page.getByRole('button',{name:'24 Gb/s/pin'}).click();
   if(!((await page.locator('.a05-readouts').innerText()).includes('384 GB/s')))throw Error('24 GBps missing');
   await page.screenshot({path:out+'/05-gddr-384.png',fullPage:true});
   await page.getByRole('button',{name:'32 Gb/s/pin'}).click();
   await page.getByRole('button',{name:'조건별로 확인하기'}).click();
   if(!await page.getByText('원리와 관찰을 연결했어요!').count())throw Error('G03-S03 failed');
   await page.screenshot({path:out+'/06-gddr-512-pam3.png',fullPage:true});
   await page.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await test('S04 GDDR board versus HBM stacked TSV and thermal/cost constraints',async()=>{
   await predict(page);
   await page.getByRole('button',{name:'GDDR GPU 보드'}).click();
   await page.getByRole('button',{name:'HBM TSV 적층'}).click();
   await page.getByRole('button',{name:'열·제조·비용 제약 보기'}).click();
   const panel=await page.locator('.a05-readouts').innerText();
   if(!panel.includes('TSV+패키지')||!panel.includes('비용·열 고려'))throw Error('packaging labels missing');
   await answer(page,'적층 DRAM·넓은 I/O');
   await page.getByRole('button',{name:'조건별로 확인하기'}).click();
   if(!await page.getByText('원리와 관찰을 연결했어요!').count())throw Error('G03-S04 failed');
   await noOverflow(page);
   await page.screenshot({path:out+'/07-hbm-stack-tradeoffs.png',fullPage:true});
 });
 await test('Korean unsupported voice fallback',async()=>{
   const mute=await ctx.newPage();mute.setDefaultTimeout(7000);
   mute.on('pageerror',e=>failed.push({name:'voice JS',error:String(e)}));
   await mute.addInitScript(()=>Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true}));
   await mute.goto(url);
   await mute.getByRole('button',{name:'한국어 질문 듣기'}).click();
   if(!await mute.getByText('이 브라우저에서 음성을 사용할 수 없어도',{exact:false}).count())throw Error('no fallback');
   if(!await mute.getByTestId('gpu-voice-text').count())throw Error('voice transcript absent');
   await mute.screenshot({path:out+'/08-voice-fallback.png',fullPage:true});
   await mute.close();
 });
 await test('emulated iPhone touch, reduced motion, 375/320px overflow',async()=>{
   const mobile=await browser.newContext({...devices['iPhone 13'],viewport:{width:375,height:812},reducedMotion:'reduce'});
   const p=await mobile.newPage();p.setDefaultTimeout(7000);
   p.on('pageerror',e=>failed.push({name:'mobile JS',error:String(e)}));
   await p.goto(url);await predict(p);
   await p.getByRole('button',{name:'compute 32'}).tap();
   await noOverflow(p);
   await p.screenshot({path:out+'/09-gpu-mobile-375.png',fullPage:true});
   await p.setViewportSize({width:320,height:700});
   await noOverflow(p);
   await p.screenshot({path:out+'/10-gpu-mobile-320.png',fullPage:true});
   await mobile.close();
 });
 await ctx.close();
}catch(e){failed.push({name:'fatal',error:String(e)});}
finally{await browser?.close();server.kill('SIGTERM');}
console.log(JSON.stringify({passed,failed,artifacts:out},null,2));
if(failed.length)process.exitCode=1;
