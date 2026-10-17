import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';
const url='http://127.0.0.1:4189/a05-nand04-preview.html',out='browser-evidence/nand04';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4189','--strictPort'],{stdio:['ignore','inherit','inherit']});
const passed=[],failed=[];let browser;
async function qa(name,fn){try{await fn();passed.push(name);console.log('PASS '+name);}catch(e){failed.push({name,error:String(e)});console.error('FAIL '+name,e);}}
async function ready(){for(let i=0;i<80;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}throw Error('No Vite dev server');}
async function noOverflow(page){const w=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);if(w[1]>w[0]+2)throw Error('horizontal overflow '+w);}
async function before(page,scene){
 const id=await page.locator('.a05-copy .a05-eyebrow').innerText();
 if(!id.includes(scene))throw Error('wrong scene '+id+' expected '+scene);
 if(await page.locator('.a05-readouts').count())throw Error('pre-prediction readouts visible');
 if(!await page.locator('.a05-veiled').count())throw Error('pre-prediction SVG unhidden');
 const limits=await page.locator('.a05-model-limit').innerText();
 for(const secret of ['0.5V/high','LBA7 A→B','eSSD 단어','host DDR staging','ECC/PLP/DRAM'])if(limits.includes(secret))throw Error('teacher physical assumptions leaked before predicted');
 await page.getByRole('button',{name:'한국어 질문 듣기'}).click();
 const said=await page.getByTestId('nand04-voice-text').innerText();
 if(/teacherExpectedAnswer|선택한 오답|TLC.Qlc|항상 정답입니다/.test(said))throw Error('teacher answer leaked in voice');
 await page.locator('.a05-box').first().locator('.a05-choice-set button').first().click();
}
async function keyedWrongThenPass(page,step){
 const answers=page.locator('.a05-box').last().locator('.a05-choice-set button');
 for(let i=1;i<=3;i++){
  await answers.nth(i).click();
  await page.getByRole('button',{name:'실험/이유 조건 검증'}).click();
  const response=await page.getByTestId('nand04-keyed-feedback').innerText();
  if(!response||response.includes('먼저 서로 다른 실험'))throw Error(step+' m'+i+' feedback not gated or blank '+response);
  if(!await page.getByText('아직 놓친 조건이 있어요').count())throw Error(step+' wrong option unexpectedly passed');
  await page.getByRole('button',{name:'피드백 듣기'}).click();
  const speech=await page.getByTestId('nand04-voice-text').innerText();
  if(!speech.includes(response))throw Error(step+' wrong voice not equal to selected correction');
  await page.screenshot({path:out+'/'+step+'-wrong'+i+'.png',fullPage:true});
 }
 await answers.first().click();
 await page.getByRole('button',{name:'실험/이유 조건 검증'}).click();
 if(!await page.getByText('NAND부터 AI까지 원리를 발견했어요!').count())throw Error(step+' correct after experiments failed');
 await page.getByRole('button',{name:'왜? 원리 보기'}).click();
 await page.screenshot({path:out+'/'+step+'-correct.png',fullPage:true});
}
try{
 await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const p=await ctx.newPage();p.setDefaultTimeout(7000);
 p.on('pageerror',e=>failed.push({name:'desktop JS',error:String(e)}));
 await qa('S01 threshold and retention power OFF→ON; all 3 keyed wrong branches + right',async()=>{
  await p.goto(url);await p.screenshot({path:out+'/01-before-prediction-hidden.png',fullPage:true});
  await before(p,'nand-threshold');
  await p.getByRole('button',{name:'Low state'}).click();
  await p.getByRole('button',{name:'High state'}).click();
  await p.getByRole('button',{name:'Power OFF'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('not-readable')))throw Error('power OFF read not blocked');
  await p.getByRole('button',{name:'Power ON'}).click();
  const read=await p.locator('.a05-readouts').innerText();
  if(!read.includes('high')||!read.includes('off'))throw Error('threshold retention lost after power cycle');
  await keyedWrongThenPass(p,'02-threshold');
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S02 page program vs erase, same LBA revision moved, GC valid survives + 3 misconceptions',async()=>{
  await before(p,'nand-page-block');
  await p.getByRole('button',{name:'초기 A 저장'}).click();
  await p.getByRole('button',{name:'같은 LBA 수정 B'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('B1:P0 / B')))throw Error('in place overwrite error');
  await p.screenshot({path:out+'/03-page-update-old-invalid.png',fullPage:true});
  await p.getByRole('button',{name:'GC · 무효 블록 지우기'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('1')))throw Error('GC valid data lost');
  await keyedWrongThenPass(p,'04-page-gc');
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S03 FTL/eSSD ECC, optional PLP & optional DRAM separated + 3 distinct feedback/voice',async()=>{
  await before(p,'ssd-ftl-reliability');
  await p.getByRole('button',{name:'Hot writes'}).click();
  await p.getByRole('button',{name:'Cold writes'}).click();
  await p.getByRole('button',{name:/ECC OFF/}).click();
  await p.getByRole('button',{name:/PLP OFF/}).click();
  await p.getByRole('button',{name:/DRAM 없음/}).click();
  const x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('선택')||!x.includes('PLP')||!x.includes('DRAM'))throw Error('SSD options missing');
  await keyedWrongThenPass(p,'05-ssd-ftl');
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S04 NVMe request host→controller, READ device DMA→DDR, later GPU separate + 3 wrong',async()=>{
  await before(p,'nvme-transfer');
  await p.getByRole('button',{name:'NVMe READ 명령'}).click();
  let x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('command')||!x.includes('Host software'))throw Error('NVMe request should originate at Host');
  await p.getByRole('button',{name:'PCIe DMA payload'}).click();
  x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('NAND')||!x.includes('host DDR'))throw Error('NVMe DMA reverse payload missing');
  await p.getByRole('button',{name:'DDR → GPU 별도 이동'}).click();
  x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('separate')||!x.includes('when supported'))throw Error('direct GPU universal claim');
  await keyedWrongThenPass(p,'06-nvme-dma');
  await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S05 model cold load vs resident infer vs checkpoint with two servers + all 3 wrong',async()=>{
  await before(p,'ai-datacenter-pipeline');
  await p.getByRole('button',{name:'처음 모델 로딩'}).click();
  let x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('SSD persistent'))throw Error('cold model load missing storage');
  await p.getByRole('button',{name:'상주 추론'}).click();
  x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('resident GPU model'))throw Error('resident memory missing');
  await p.getByRole('button',{name:'학습 체크포인트'}).click();
  await p.getByRole('button',{name:'서버 2대'}).click();
  x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('checkpoint')||!x.includes('2대'))throw Error('checkpoint/multi server absent');
  await keyedWrongThenPass(p,'07-ai-pipeline');
  await noOverflow(p);
 });
 await qa('Korean voice unavailable safe fallback text',async()=>{
  const q=await ctx.newPage();q.setDefaultTimeout(7000);
  q.on('pageerror',e=>failed.push({name:'voice JS',error:String(e)}));
  await q.addInitScript(()=>Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true}));
  await q.goto(url);await q.getByRole('button',{name:'한국어 질문 듣기'}).click();
  if(!await q.getByTestId('nand04-voice-text').count())throw Error('no Korean transcript');
  if(!await q.getByText('이 브라우저는 음성 재생을 지원하지 않지만',{exact:false}).count())throw Error('no audio fallback');
  await q.screenshot({path:out+'/08-voice-fallback.png',fullPage:true});await q.close();
 });
 await qa('iPhone emulation touch, reduced motion, 375/320px and no overflow',async()=>{
  const mobile=await browser.newContext({...devices['iPhone 13'],viewport:{width:375,height:812},reducedMotion:'reduce'});
  const m=await mobile.newPage();m.setDefaultTimeout(7000);
  m.on('pageerror',e=>failed.push({name:'mobile JS',error:String(e)}));
  await m.goto(url);await before(m,'nand-threshold');
  await m.getByRole('button',{name:'High state'}).tap();await noOverflow(m);
  await m.screenshot({path:out+'/09-mobile-375.png',fullPage:true});
  await m.setViewportSize({width:320,height:700});await noOverflow(m);
  await m.screenshot({path:out+'/10-mobile-320.png',fullPage:true});
  await mobile.close();
 });
 await ctx.close();
}catch(e){failed.push({name:'fatal',error:String(e)});}
finally{await browser?.close();server.kill('SIGTERM');}
console.log(JSON.stringify({passed,failed,artifact:out},null,2));if(failed.length)process.exitCode=1;
