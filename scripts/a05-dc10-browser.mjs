import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';
const url='http://127.0.0.1:4189/a05-dc10-preview.html',out='browser-evidence/dc10';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4189','--strictPort'],{stdio:['ignore','inherit','inherit']});
const passed=[],failed=[];let browser;
async function qa(name,fn){try{await fn();passed.push(name);console.log('PASS '+name);}catch(e){failed.push({name,error:String(e)});console.error('FAIL '+name,e);}}
async function ready(){let last='';for(let i=0;i<90;i++){try{const r=await fetch(url);if(r.ok)return;last='HTTP '+r.status+' '+(await r.text()).slice(0,350);}catch(e){last=String(e)+' cause='+String(e?.cause)+' code='+String(e?.cause?.code)+' address='+String(e?.cause?.address)+' port='+String(e?.cause?.port);}if(i%20===0)console.error('Vite preview readiness: '+last);await new Promise(r=>setTimeout(r,350));}throw Error('vite unavailable: '+last);}
async function overflow(p){const [client,scroll]=await p.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);if(scroll>client+2)throw Error('root horizontal scroll '+client+' / '+scroll);}
async function first(p,id){
 const text=await p.locator('.a05-copy .a05-eyebrow').innerText();
 if(!text.includes(id))throw Error('expected '+id+' not '+text);
 if(await p.locator('.a05-readouts').count())throw Error(id+' result before prediction');
 if(!await p.locator('.a05-veiled').count())throw Error(id+' preview not veiled');
 if(await p.getByRole('button',{name:'현재 조건 관찰'}).count())throw Error('controls before prediction');
 await p.getByRole('button',{name:'한국어 질문 듣기'}).click();
 const speech=await p.getByTestId('dc10-voice-text').innerText();
 if(['16384','40 FLOP/B','1.4MW','1.2MW','STATE_NOT_RECOVERABLE'].some(k=>speech.includes(k)))throw Error('pre-predict voice leaked teacher result '+speech);
 await p.locator('.a05-box').first().locator('.a05-choice-set button').first().click();
 if(await p.locator('.a05-readouts').count())throw Error('results before probe');
 if(await p.getByRole('button',{name:'관찰·물리 WHY 평가'}).count())throw Error('answer without physical probe');
}
async function probe(p){await p.getByRole('button',{name:'현재 조건 관찰'}).click();return await p.getByTestId('dc10-stage-status').innerText();}
async function wrongCorrect(p,id){
 const opts=p.locator('.a05-box').last().locator('.a05-choice-set button');
 if((await opts.count())!==4)throw Error('expected four WHY choices for '+id);
 for(let i=1;i<=3;i++){
  await opts.nth(i).click();await p.getByRole('button',{name:'관찰·물리 WHY 평가'}).click();
  if(!await p.getByText('빠진 실험 조건이나 이유를 확인하세요').count())throw Error(id+' wrong concept passed');
  const c=await p.getByTestId('dc10-keyed-feedback').innerText();
  if(!c||c.length<16)throw Error(id+' missing specific corrective text '+i);
  await p.getByRole('button',{name:'피드백 듣기'}).click();
  if(!((await p.getByTestId('dc10-voice-text').innerText()).includes(c)))throw Error(id+' Korean voice mismatched '+i);
  await p.screenshot({path:out+'/'+id+'-wrong-m'+i+'.png',fullPage:true});
 }
 await opts.first().click();await p.getByRole('button',{name:'관찰·물리 WHY 평가'}).click();
 if(!await p.getByText('네 가지 관찰을 연결해 이해했어요!').count())throw Error(id+' complete evidence+correct first does not pass');
 await p.getByRole('button',{name:'왜? 자세한 원리 보기'}).click();
 await p.screenshot({path:out+'/'+id+'-correct.png',fullPage:true});
}
try{
 await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const p=await ctx.newPage();p.setDefaultTimeout(12000);p.on('pageerror',e=>failed.push({name:'desktop JS',error:String(e)}));
 await qa('10-S01 four roofline cells, ridge40/20 and failed WHY cannot reveal untaken answers',async()=>{
  await p.goto(url);await p.screenshot({path:out+'/01-before.png',fullPage:true});
  await first(p,'ai-roofline-bottleneck');
  if(!(await probe(p)).includes('1 TFLOP/s'))throw Error('10 FLOP/B BW100 should 1 TFLOP/s');
  await p.locator('.a05-box').last().locator('.a05-choice-set button').first().click();
  await p.getByRole('button',{name:'관찰·물리 WHY 평가'}).click();
  if(!await p.getByText('빠진 실험 조건이나 이유를 확인하세요').count())throw Error('partial roofline wrongly accepted');
  await p.getByRole('button',{name:'왜? 자세한 원리 보기'}).click();
  if((await p.locator('.a05-why').innerText()).includes('ridge는40'))throw Error('teacher ridge before all physical experiments');
  await p.getByRole('button',{name:'I = 80 FLOP/B'}).click();
  if(await p.locator('.a05-readouts').count())throw Error('stale physical SVG after choosing new option without probe');
  if(!(await probe(p)).includes('4 TFLOP/s'))throw Error('80x100 compute cap4 missing');
  await p.getByRole('button',{name:'BW = 200 GB/s'}).click();
  await probe(p);await p.getByRole('button',{name:'I = 10 FLOP/B'}).click();
  if(!(await probe(p)).includes('2 TFLOP/s'))throw Error('10x200 should2');
  const e=await p.getByTestId('dc10-evidence').innerText();
  for(const t of ['roof-10-100','roof-80-100','roof-80-200','roof-10-200'])if(!e.includes(t))throw Error('missing '+t);
  await wrongCorrect(p,'02-roofline');
  await p.getByRole('button',{name:'다음 장면으로'}).click();
 });
 await qa('10-S02 Q/KV head distinction, resident model, 1024/4096/16384 B, unsupported then supported offload',async()=>{
  await first(p,'llm-prefill-decode-kv');
  if(!(await probe(p)).includes('1024 B'))throw Error('KV4/1 512 B');
  await p.getByRole('button',{name:'Context 16'}).click();
  if(!(await probe(p)).includes('4096 B'))throw Error('KV16/1 2048 B');
  await p.getByRole('button',{name:'Batch 4'}).click();
  if(!(await probe(p)).includes('16384 B'))throw Error('KV16/4 8192 B');
  const e1=await p.getByTestId('dc10-evidence').innerText();
  if(e1.includes('kv-offload'))throw Error('offload evidence without supported action');
  await p.getByRole('button',{name:'KV LPDDR offload'}).click();
  if(!(await probe(p)).includes('OFFLOAD_PATH_UNSUPPORTED'))throw Error('unsupported LPDDR allowed');
  if(await p.locator('.a05-readouts').count())throw Error('unsupported offload rendered fictitious accepted KV visual');
  if(await p.locator('.a05-box').last().innerText().then(s=>s.includes('kv-offload')))throw Error('failed path created evidence');
  await p.getByRole('button',{name:'LPDDR 경로 ON'}).click();
  await probe(p);
  if(!((await p.getByTestId('dc10-evidence').innerText()).includes('kv-offload')))throw Error('valid offload not recorded');
  await wrongCorrect(p,'03-kv');
  await p.getByRole('button',{name:'다음 장면으로'}).click();
 });
 await qa('10-S03 PUE1.4/1.2 facility MW independent of throughput1000/1500',async()=>{
  await first(p,'rack-power-pue-thermal');
  if(!(await probe(p)).includes('1.4 MW'))throw Error('PUE1.4 facility1.4');
  await p.getByRole('button',{name:'PUE 1.2'}).click();
  if(!(await probe(p)).includes('1.2 MW'))throw Error('PUE1.2 facility1.2');
  await p.getByRole('button',{name:'1500 tasks/s'}).click();
  const status=await probe(p);
  if(!status.includes('1500 tasks/s')||!status.includes('1.2 MW'))throw Error('PUE mistakenly tied to throughput');
  await wrongCorrect(p,'04-pue');
  await p.getByRole('button',{name:'다음 장면으로'}).click();
 });
 await qa('10-S04 two servers no shared-switch route, installation not cable, session local fail, replica conditional possible',async()=>{
  await first(p,'ai-dc-end-to-end-resilience');
  await p.getByRole('button',{name:'Switch A 장애'}).click();
  if(!(await probe(p)).includes('NO_ROUTE'))throw Error('two servers single shared switch falsely recovered');
  await p.getByRole('button',{name:'Switch B 설치'}).click();
  if(!(await probe(p)).includes('NO_ROUTE'))throw Error('standby switch not connected falsely recovered');
  await p.getByRole('button',{name:'B 회선 연결'}).click();
  if(!(await probe(p)).includes('ROUTE_NOT_CONFIGURED'))throw Error('physical wire alone auto route');
  await p.getByRole('button',{name:'B 경로 구성 ON'}).click();
  await p.getByRole('button',{name:'Failover 자동'}).click();
  if(!(await probe(p)).includes('STATE_NOT_RECOVERABLE'))throw Error('local session falsely restored');
  await p.getByRole('button',{name:'Replicated state'}).click();
  if(!(await probe(p)).includes('RECOVERY_POSSIBLE'))throw Error('healthy physical configured route with session and policy did not recover');
  await p.getByRole('button',{name:'공통 전원 장애'}).click();
  if(!(await probe(p)).includes('NO_SHARED_POWER'))throw Error('correlated PSU outage wrongly okay');
  await p.getByRole('button',{name:'공통 전원 정상'}).click();await probe(p);
  await p.getByRole('button',{name:'복제 저장 장애'}).click();
  if(!(await probe(p)).includes('REPLICA_UNAVAILABLE'))throw Error('replica unhealthy not blocked');
  await p.getByRole('button',{name:'복제 저장 정상'}).click();await probe(p);
  await p.getByRole('button',{name:'학습 (train)'}).click();
  if(!(await probe(p)).includes('CHECKPOINT_REQUIRED'))throw Error('train failover without checkpoint');
  await p.getByRole('button',{name:'Checkpoint 확보'}).click();await probe(p);
  const e=await p.getByTestId('dc10-evidence').innerText();
  for(const k of ['shared-switch-no-route','backup-disconnected','configured-but-local-state','back-route-recoverable'])if(!e.includes(k))throw Error('resilience proof missing '+k);
  await wrongCorrect(p,'05-resilience');await overflow(p);
 });
 await qa('Voice unavailable displays Korean text fallback with no exception',async()=>{
  const q=await ctx.newPage();q.on('pageerror',e=>failed.push({name:'voice JS',error:String(e)}));
  await q.addInitScript(()=>Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true}));
  await q.goto(url);await q.getByRole('button',{name:'한국어 질문 듣기'}).click();
  if(!await q.getByText('한국어 음성합성 기능이 없어',{exact:false}).count())throw Error('speech fallback missing');
  if(!await q.getByTestId('dc10-voice-text').count())throw Error('transcript missing');
  await q.screenshot({path:out+'/06-speech-fallback.png',fullPage:true});await q.close();
 });
 await qa('emulated 375/320px mobile touch, keyboard navigation, reduced motion and no overflow',async()=>{
  const cm=await browser.newContext({...devices['iPhone 13'],viewport:{width:375,height:812},reducedMotion:'reduce'});
  const m=await cm.newPage();m.setDefaultTimeout(12000);m.on('pageerror',e=>failed.push({name:'mobile JS',error:String(e)}));
  await m.goto(url);await first(m,'ai-roofline-bottleneck');await m.getByRole('button',{name:'현재 조건 관찰'}).tap();
  await overflow(m);await m.screenshot({path:out+'/07-mobile-375.png',fullPage:true});
  await m.setViewportSize({width:320,height:720});await overflow(m);await m.screenshot({path:out+'/08-mobile-320.png',fullPage:true});
  await cm.close();
  const k=await ctx.newPage();await k.goto(url);await k.keyboard.press('Tab');
  if(!(await k.locator(':focus').count()))throw Error('keyboard focus missing');await k.close();
 });
 await ctx.close();
}catch(e){failed.push({name:'fatal',error:String(e)});}
finally{await browser?.close();server.kill('SIGTERM');}
console.log(JSON.stringify({passed,failed,artifact:out},null,2));
if(failed.length)process.exitCode=1;
