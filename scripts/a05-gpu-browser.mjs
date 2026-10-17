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
   // A07 negative regression: after concept prediction but before any family/site grading,
   // no mapping in note, role=img SVG, readouts, ARIA labels or model assumptions.
   async function noFamilySolution(stage){
     const text=await page.locator('.a05-canvas-col,.a05-gpu-controls .a05-note').allInnerTexts();
     if(text.some(x=>['GDDR6 / GDDR7','DDR / RDIMM','HBM stack','GDDR6 → GPU 보드','GDDR7 → GPU 보드','HBM → gpu-package','GDDR6 → gpu-board'].some(sol=>x.includes(sol))))throw Error(stage+': family/site key leaked');
     const svg=page.locator('.a05-gpu-visual svg');
     const aria=await svg.getAttribute('aria-label');
     if(aria&&/DDR|GDDR6|GDDR7|HBM/.test(aria))throw Error(stage+': family/site solution in SVG aria');
     if(!((await page.locator('.a05-readouts').innerText()).includes('미검사')))throw Error(stage+': grade status revealed early');
   }
   await noFamilySolution('initial');
   await page.getByRole('button',{name:'GDDR6',exact:true}).click();
   await page.getByRole('button',{name:'GPU 보드',exact:true}).click();
   await noFamilySolution('selected-but-not-graded');
   await page.screenshot({path:out+'/04b-g03-s02-no-answer-before-grade.png',fullPage:true});
   // A07 R12 P1 scientific evaluation: first WRONG GDDR6 must never reveal GDDR7 placement.
   await page.getByRole('button',{name:'CPU DIMM',exact:true}).click();
   await page.getByRole('button',{name:'선택한 짝 검사하기'}).click();
   const wrongG6=await page.getByTestId('gpu-family-match-feedback').innerText();
   if(!wrongG6.includes('GDDR6')||wrongG6.includes('GDDR7')||!wrongG6.includes('GPU 보드'))throw Error('A07 P1 GDDR6 error must correct GDDR6 ONLY: '+wrongG6);
   const g6aria=await page.locator('.a05-canvas-col [aria-label]').evaluateAll(nodes=>nodes.map(x=>x.getAttribute('aria-label')).join(' '));
   if(/GDDR7.*GPU 보드|GDDR7.*gpu-board/.test(g6aria))throw Error('GDDR7 solution leaked via ARIA when only GDDR6 wrong');
   await page.getByRole('button',{name:'현재 가족 매칭 피드백 듣기'}).click();
   const g6voice=await page.getByTestId('gpu-voice-text').innerText();
   if(!g6voice.includes('GDDR6')||g6voice.includes('GDDR7'))throw Error('GDDR6 voice improperly leaked other independent GDDR7 answer');
   await page.screenshot({path:out+'/04c-wrong-gddr6-only-no-gddr7.png',fullPage:true});
   await page.getByRole('button',{name:'GDDR7',exact:true}).click();
   if(await page.getByTestId('gpu-family-match-feedback').count())throw Error('switch to GDDR7 did not clear old-family grade');
   await noFamilySolution('GDDR7-selected-not-graded');
   await page.getByRole('button',{name:'선택한 짝 검사하기'}).click();
   const wrongG7=await page.getByTestId('gpu-family-match-feedback').innerText();
   if(!wrongG7.includes('GDDR7')||wrongG7.includes('GDDR6')||!wrongG7.includes('GPU 보드'))throw Error('GDDR7 wrong answer must correct GDDR7 ONLY: '+wrongG7);
   await page.getByRole('button',{name:'현재 가족 매칭 피드백 듣기'}).click();
   const g7voice=await page.getByTestId('gpu-voice-text').innerText();
   if(!g7voice.includes('GDDR7')||g7voice.includes('GDDR6'))throw Error('GDDR7 voice improperly leaked previous GDDR6 answer');
   await page.screenshot({path:out+'/04d-wrong-gddr7-only.png',fullPage:true});
   // Wrong matching is now possible: old pre-matched controls hid this misconception.
   await page.getByRole('button',{name:'HBM',exact:true}).click();
   await page.getByRole('button',{name:'선택한 짝 검사하기'}).click();
   if(!await page.getByText('오답: HBM은',{exact:false}).count())throw Error('S02 independent wrong pairing not visible');
   const assumptionsAfterOne=await page.locator('.a05-model-limit').innerText();
   if(['GDDR6/7 board','DDR/RDIMM CPU','HBM package'].some(secret=>assumptionsAfterOne.includes(secret)))throw Error('S02 other-family answer leaked after first graded HBM match');
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
   if((await page.locator('.a05-canvas-header').innerText()).includes('관찰'))throw Error('UI claims observed answer before numeric quiz');
   await page.getByRole('button',{name:'24 Gb/s/pin'}).click();
   if(await page.locator('.a05-readouts').count())throw Error('numeric answers revealed before quiz');
   const quiz24=page.locator('.a05-gpu-controls .a05-control-buttons').nth(2);
   const quiz32=page.locator('.a05-gpu-controls .a05-control-buttons').nth(3);
   // A07 negative: no numeric result in SVG, readouts, explanatory copy, Voice/ARIA, even after wrong attempts.
   async function assertVeiled(stage){
     if(await page.locator('.a05-readouts').count())throw Error(stage+': numeric readouts leaked');
     if(!await page.locator('.a05-veiled').count())throw Error(stage+': numeric canvas not veiled');
     const canvas=await page.locator('.a05-canvas-col').innerText();
     if(['384 GB/s','512 GB/s'].some(v=>canvas.includes(v)))throw Error(stage+': results leaked in canvas');
     const aria=await page.locator('.a05-canvas-col').locator('[aria-label]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')).join(' '));
     if(['384 GB/s','512 GB/s'].some(v=>aria.includes(v)))throw Error(stage+': results leaked in ARIA');
     const body=await page.locator('.a05-result,.a05-model-limit,.a05-why').allInnerTexts();
     if(body.some(x=>['384 GB/s','512 GB/s'].some(v=>x.includes(v))))throw Error(stage+': numeric answer exposed in answer feedback/model assumption');
   }
   await assertVeiled('pre-numeric-attempt');
   await quiz24.getByRole('button',{name:'192 GB/s'}).click();
   await assertVeiled('wrong-24-only');
   await quiz24.getByRole('button',{name:'384 GB/s'}).click();
   await assertVeiled('correct-24-only');
   await page.getByRole('button',{name:'32 Gb/s/pin'}).click();
   await assertVeiled('before-32-answer');
   await quiz32.getByRole('button',{name:'384 GB/s'}).click();
   await assertVeiled('wrong-32-with-24-correct');
   await answer(page,'이론 GB/s=bit폭');
   await page.getByRole('button',{name:'조건별로 확인하기'}).click();
   if(!await page.getByText('빠진 조건이 있는지').count())throw Error('wrong 32Gb/s selection wrongly passed');
   await assertVeiled('wrong-32-after-feedback');
   await page.getByRole('button',{name:'피드백 듣기'}).click();
   const voice=await page.locator('[data-testid="gpu-voice-text"]').allInnerTexts();
   if(voice.some(x=>['384 GB/s','512 GB/s'].some(v=>x.includes(v))))throw Error('spoken feedback leaked correct numeric values');
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
