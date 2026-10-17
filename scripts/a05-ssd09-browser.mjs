import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';
const url='http://127.0.0.1:4189/a05-ssd09-preview.html',out='browser-evidence/ssd09';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4189','--strictPort'],{stdio:['ignore','inherit','inherit']});
let browser;const passed=[],failed=[];
async function qa(name,fn){try{await fn();passed.push(name);console.log('PASS '+name);}catch(e){failed.push({name,error:String(e)});console.error('FAIL '+name,e);}}
async function ready(){for(let i=0;i<80;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}throw Error('Vite unavailable');}
async function overflow(p){const [w,s]=await p.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);if(s>w+2)throw Error('root overflow '+w+'/'+s);}
async function before(p,id){
 const title=await p.locator('.a05-copy .a05-eyebrow').innerText();
 if(!title.includes(id))throw Error('wrong lesson stage '+title);
 if(await p.locator('.a05-readouts').count())throw Error('number/readout exposed before prediction');
 if(!await p.locator('.a05-veiled').count())throw Error('SVG/aria key unhidden before prediction');
 const bounds=await p.locator('.a05-model-limit').innerText();
 for(const secret of ['1/15','0.6J','3650TB','1.6GiB'])if(bounds.includes(secret))throw Error('pre-before teacher secret '+secret);
 await p.getByRole('button',{name:'한국어 질문 듣기'}).click();
 const txt=await p.getByTestId('ssd09-voice-text').innerText();
 for(const secret of ['1/15볼트','3.65PB','usable0.6J','1.6기가바이트'])if(txt.includes(secret))throw Error('Before Korean speech exposes teacher answer '+secret);
 await p.locator('.a05-box').first().locator('.a05-choice-set button').first().click();
 if(await p.locator('.a05-readouts').count())throw Error('readouts exposed before physical action');
 if(await p.getByRole('button',{name:'관찰과 설명 검증'}).count())throw Error('WHY/options revealed before physical action');
}
async function wrongAndCorrect(p,stem){
 const answers=p.locator('.a05-box').last().locator('.a05-choice-set button');
 for(let i=1;i<=3;i++){
  await answers.nth(i).click();await p.getByRole('button',{name:'관찰과 설명 검증'}).click();
  const feedback=await p.getByTestId('ssd09-keyed-feedback').innerText();
  if(!feedback||feedback.includes('먼저'))throw Error(stem+' missing tailored wrong m'+i);
  if(!await p.getByText('아직 확인하지 않은 조건이 있어요').count())throw Error(stem+' m'+i+' unexpectedly passed');
  await p.getByRole('button',{name:'피드백 듣기'}).click();
  if(!((await p.getByTestId('ssd09-voice-text').innerText()).includes(feedback)))throw Error(stem+' spoken response wrong m'+i);
  await p.screenshot({path:out+'/'+stem+'-wrong-'+i+'.png',fullPage:true});
 }
 await answers.first().click();await p.getByRole('button',{name:'관찰과 설명 검증'}).click();
 if(!await p.getByText('eSSD의 서로 다른 신뢰성 경계를 확인했어요!').count())throw Error(stem+' correct physical-first user could not pass');
 await p.getByRole('button',{name:'왜? 자세히 보기'}).click();
 await p.screenshot({path:out+'/'+stem+'-correct.png',fullPage:true});
}
try{
 await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const p=await ctx.newPage();p.setDefaultTimeout(8500);p.on('pageerror',e=>failed.push({name:'desktop JS',error:String(e)}));
 await qa('S01 16 centers/15 gaps, no 1/16 voltage bins, SLC/TLC/QLC ±0.08 noise and three wrong Voice paths',async()=>{
  await p.goto(url);await p.screenshot({path:out+'/01-before-prediction.png',fullPage:true});
  await before(p,'nand-cell-voltage-windows');
  await p.getByRole('button',{name:'SLC · 1bit'}).click();
  let x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('상태\n2')||!x.includes('간격\n1'))throw Error('SLC 2 centers/1 gap wrong '+x);
  await p.getByRole('button',{name:'TLC · 3bit'}).click();
  x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('0.142857'))throw Error('TLC 7 gaps missing');
  await p.getByRole('button',{name:'QLC · 4bit'}).click();x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('0.066667')||!x.includes('간격\n15'))throw Error('QLC 16 centers / 15 gaps missing '+x);
  await p.screenshot({path:out+'/02-qlc-16-centers-15-gaps.png',fullPage:true});
  await p.getByRole('button',{name:'noise ±0V'}).click();
  await p.getByRole('button',{name:'noise ±0.08V'}).click();
  await wrongAndCorrect(p,'03-threshold');await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S02 host1GiB vs NAND1/1.6GiB WAF, no OP-double magic and three keyed wrong feedback',async()=>{
  await before(p,'ssd-write-amplification');
  await p.getByRole('button',{name:'GC OFF · 추가 이동0'}).click();
  let x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('1 GiB')||!x.includes('WAF\n1'))throw Error('WAF baseline wrong '+x);
  await p.getByRole('button',{name:'GC ON · 유효 0.6GiB 이동'}).click();
  x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('1.6 GiB')||!x.includes('WAF\n1.6'))throw Error('GC relocation extra writes absent '+x);
  await p.getByRole('button',{name:'OP 10%'}).click();
  await p.getByRole('button',{name:'OP 20%'}).click();
  x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('WAF\n1.6'))throw Error('OP should not magically halve WAF '+x);
  await wrongAndCorrect(p,'04-waf');await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S03 PLP ordered write ACK→power loss AT_RISK, no premature FLUSH completion, 0.4/1.2J vs 0.6J, correct post-commit',async()=>{
  await before(p,'ssd-plp-power-loss');
  await p.getByRole('button',{name:'4 Flush COMPLETED'}).click();
  if(!((await p.getByTestId('ssd09-transaction').innerText()).includes('NO_PENDING_WRITE')))throw Error('flush complete prior to WRITE falsely accepted');
  await p.getByRole('button',{name:'1 호스트 WRITE'}).click();
  await p.getByRole('button',{name:'2 컨트롤러 ACK'}).click();
  await p.getByRole('button',{name:'POWER LOSS'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('at-risk')))throw Error('volatile ACK power lost before commit not at risk');
  await p.getByRole('button',{name:'사건 결과 한국어로 듣기'}).click();
  if(!((await p.getByTestId('ssd09-voice-text').innerText()).includes('OK_POWER_LOSS')))throw Error('ACK then power off status not voiced');
  await p.screenshot({path:out+'/05-volatile-ACK-then-powerloss-risk.png',fullPage:true});
  await p.getByRole('button',{name:'RESET · 새 실험'}).click();
  await p.getByRole('button',{name:'1 호스트 WRITE'}).click();
  await p.getByRole('button',{name:'2 컨트롤러 ACK'}).click();
  await p.getByRole('button',{name:'3 Flush ISSUED'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('pending-contract')))throw Error('FLUSH issued incorrectly durable');
  await p.screenshot({path:out+'/06-flush-issued-not-completed.png',fullPage:true});
  await p.getByRole('button',{name:'4 Flush COMPLETED'}).click();
  await p.getByRole('button',{name:'POWER LOSS'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('durable-under-declared-policy')))throw Error('completed flush under declared policy not preserved');
  await p.getByRole('button',{name:'RESET · 새 실험'}).click();
  await p.getByRole('button',{name:'PLP ON · 0.4J'}).click();
  let x=await p.locator('.a05-ssd09-visual').innerText();
  if(!x.includes('0.6J')||!x.includes('0.4J'))throw Error('PLP effective energy sufficient not visible');
  await p.getByRole('button',{name:'PLP ON · 1.2J'}).click();
  x=await p.locator('.a05-ssd09-visual').innerText();
  if(!x.includes('1.2J'))throw Error('PLP insufficient energy not visible');
  await wrongAndCorrect(p,'07-plp');await p.getByRole('button',{name:'다음 질문으로'}).click();
 });
 await qa('S04 two 100-card unsorted negative; sort rank99 vs max rank100 B, A/B mean + DWPD 3650TB; wrong Korean feedback',async()=>{
  await before(p,'essd-dwpd-tail-latency');
  await p.getByRole('button',{name:'분포 A'}).click();
  await p.getByRole('button',{name:'원본/정렬 #99 선택'}).click();
  if(!((await p.getByTestId('ssd09-rank-result').innerText()).includes('UNSORTED_CARD')))throw Error('unsorted #99 incorrectly passes p99');
  await p.screenshot({path:out+'/08-unsorted-rank-denied.png',fullPage:true});
  await p.getByRole('button',{name:'100개 정렬'}).click();
  await p.getByRole('button',{name:'최댓값 #100 오답 선택'}).click();
  if(!((await p.getByTestId('ssd09-rank-result').innerText()).includes('MAX_NOT_P99')))throw Error('max confused with nearest-rank #99');
  await p.getByRole('button',{name:'원본/정렬 #99 선택'}).click();
  await p.getByRole('button',{name:'선택한 분포 평균 계산'}).click();
  if(!((await p.getByTestId('ssd09-rank-result').innerText()).includes('1.95ms')))throw Error('A mean not1.95');
  await p.getByRole('button',{name:'분포 B'}).click();
  const x=await p.locator('.a05-readouts').innerText();
  if(x.includes('p99(선택 set)\n20ms'))throw Error('stale A rank carried into B');
  await p.getByRole('button',{name:'100개 정렬'}).click();
  await p.getByRole('button',{name:'최댓값 #100 오답 선택'}).click();
  await p.getByRole('button',{name:'원본/정렬 #99 선택'}).click();
  let y=await p.locator('.a05-readouts').innerText();
  if(!y.includes('1ms'))throw Error('B rank99 should be 1ms even though max=20');
  await p.getByRole('button',{name:'선택한 분포 평균 계산'}).click();
  if(!((await p.getByTestId('ssd09-rank-result').innerText()).includes('1.19ms')))throw Error('B mean not1.19');
  await p.getByRole('button',{name:'2TB ×1DWPD×365×5 계산'}).click();
  y=await p.locator('.a05-readouts').innerText();
  if(!y.includes('3650 decimal TB'))throw Error('5yr decimal DWPD 3650TB missing');
  await p.screenshot({path:out+'/09-B-sorted99-not-max.png',fullPage:true});
  await wrongAndCorrect(p,'10-tail-and-dwpd');await overflow(p);
 });
 await qa('unavailable WebSpeech text fallback preserves Korean questions',async()=>{
  const q=await ctx.newPage();q.setDefaultTimeout(8500);
  q.on('pageerror',e=>failed.push({name:'voice JS',error:String(e)}));
  await q.addInitScript(()=>Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true}));
  await q.goto(url);await q.getByRole('button',{name:'한국어 질문 듣기'}).click();
  if(!await q.getByTestId('ssd09-voice-text').count())throw Error('no text transcript');
  if(!await q.getByText('음성합성 미지원:',{exact:false}).count())throw Error('no Korean fallback');
  await q.screenshot({path:out+'/11-voice-fallback.png',fullPage:true});await q.close();
 });
 await qa('375/320px emulated iPhone reduced motion touch and root nonoverflow',async()=>{
  const mCtx=await browser.newContext({...devices['iPhone 13'],viewport:{width:375,height:812},reducedMotion:'reduce'});
  const m=await mCtx.newPage();m.setDefaultTimeout(8500);
  m.on('pageerror',e=>failed.push({name:'mobile JS',error:String(e)}));
  await m.goto(url);await before(m,'nand-cell-voltage-windows');
  await m.getByRole('button',{name:'QLC · 4bit'}).tap();await overflow(m);
  await m.screenshot({path:out+'/12-mobile-375.png',fullPage:true});
  await m.setViewportSize({width:320,height:700});await overflow(m);
  await m.screenshot({path:out+'/13-mobile-320.png',fullPage:true});
  await mCtx.close();
 });
 await ctx.close();
}catch(e){failed.push({name:'fatal',error:String(e)});}
finally{await browser?.close();server.kill('SIGTERM');}
console.log(JSON.stringify({passed,failed,artifact:out},null,2));if(failed.length)process.exitCode=1;
