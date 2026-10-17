import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';
const url='http://127.0.0.1:4189/a05-package06-preview.html',out='browser-evidence/package06';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4189','--strictPort'],{stdio:['ignore','inherit','inherit']});
let browser;const passed=[],failed=[];
async function qa(name,fn){try{await fn();passed.push(name);console.log('PASS '+name);}catch(e){failed.push({name,error:String(e)});console.error('FAIL '+name,e);}}
async function ready(){for(let i=0;i<80;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}throw Error('Vite server unavailable');}
async function overflow(p){const [w,s]=await p.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);if(s>w+2)throw Error('root horizontal overflow '+w+'/'+s);}
async function first(p,id){
 if(!((await p.locator('.a05-copy .a05-eyebrow').innerText()).includes(id)))throw Error('wrong scene '+id);
 if(await p.locator('.a05-readouts').count())throw Error('answer readouts leaked before student predicts');
 if(!await p.locator('.a05-veiled').count())throw Error('numeric SVG not veiled before student action');
 const body=await p.locator('.a05-model-limit').innerText();
 if(['0.60653','0.5762','4.532','20W×0.2','16K'].some(x=>body.includes(x)))throw Error('toy science numeric key in before panel');
 await p.getByRole('button',{name:'한국어 질문 듣기'}).click();
 const speech=await p.getByTestId('package06-voice-text').innerText();
 if(['0.60653','0.5762','4.532','16K'].some(x=>speech.includes(x)))throw Error('teacher numerical key pre-spoken');
 await p.locator('.a05-box').first().locator('.a05-choice-set button').first().click();
 if(await p.locator('.a05-readouts').count())throw Error('numeric/aria result visible before physical manipulation');
 if(await p.getByRole('button',{name:'관찰·물리 WHY 평가'}).count())throw Error('student correct/misconception choices visible before independent action');
}
async function wrongCorrect(p,key){
 const opts=p.locator('.a05-box').last().locator('.a05-choice-set button');
 for(let i=1;i<=3;i++){
  await opts.nth(i).click();await p.getByRole('button',{name:'관찰·물리 WHY 평가'}).click();
  const msg=await p.getByTestId('package06-keyed-feedback').innerText();
  if(!msg||!await p.getByText('빠진 조건을 다시 관찰해 보세요').count())throw Error(key+' misconception m'+i+' false PASS');
  await p.getByRole('button',{name:'피드백 듣기'}).click();
  if(!((await p.getByTestId('package06-voice-text').innerText()).includes(msg)))throw Error(key+' m'+i+' Voice transcript mismatch');
  await p.screenshot({path:out+'/'+key+'-wrong-'+i+'.png',fullPage:true});
 }
 await opts.first().click();await p.getByRole('button',{name:'관찰·물리 WHY 평가'}).click();
 if(!await p.getByText('패키징의 원리와 수치를 확인했어요!').count())throw Error(key+' physically correct-first failed');
 await p.getByRole('button',{name:'왜? 자세한 원리 보기'}).click();
 await p.screenshot({path:out+'/'+key+'-passed.png',fullPage:true});
}
try{
 await ready();browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const p=await ctx.newPage();p.setDefaultTimeout(9500);p.on('pageerror',e=>failed.push({name:'desktop JS',error:String(e)}));
 await qa('S01 order-reversed dice/metal blocked; wafer photo process metal test dice exact then layers, defect and three wrong Korean Voice',async()=>{
  await p.goto(url);await p.screenshot({path:out+'/01-student-before.png',fullPage:true});await first(p,'fab-pattern-to-die');
  await p.getByRole('button',{name:'다이 절단'}).click();
  if(!((await p.getByTestId('package06-stage-status').innerText()).includes('INVALID_STAGE')))throw Error('S01 premature dice accepted');
  if(await p.locator('.a05-readouts').count())throw Error('invalid premature dice revealed a student measurement without physical work');
  await p.getByRole('button',{name:'현재 공정/배선 안내 듣기'}).click();
  if(!((await p.getByTestId('package06-voice-text').innerText()).includes('INVALID_STAGE')))throw Error('premature dice cause not in Korean voice');
  await p.screenshot({path:out+'/02-invalid-dice-preprocess.png',fullPage:true});
  for(const name of ['웨이퍼 준비','포토·마스크','식각·증착·주입','금속배선','전기 테스트','다이 절단'])await p.getByRole('button',{name}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('6/6')))throw Error('full wafer fab order not completed');
  await p.getByRole('button',{name:'Layer 1'}).click();await p.getByRole('button',{name:'Layer 2'}).click();
  await p.getByRole('button',{name:'결함 OFF'}).click();await p.getByRole('button',{name:'결함 ON'}).click();
  await wrongCorrect(p,'03-fab');await p.getByRole('button',{name:'다음 장면으로'}).click();
 });
 await qa('S02 Poisson unscreened four yield .60653 vs KGD after screening 0.95 independent assembly and candidates4.532',async()=>{
  await first(p,'chiplet-yield-model');
  await p.getByRole('button',{name:'D = 0/mm²'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('1')))throw Error('D0 unit probability wrong');
  await p.getByRole('button',{name:'D = 0.005/mm²'}).click();
  const initial=await p.locator('.a05-readouts').innerText();
  if(!initial.includes('0.606531')||!initial.includes('0.882497'))throw Error('mono/chip individual math wrong '+initial);
  if((await p.locator('.a05-readouts').innerText()).includes('KGD 후보 개수 기대치\n4.532'))throw Error('KGD full candidates revealed before choosing KGD');
  await p.getByRole('button',{name:'무선별 (none)'}).click();
  await p.getByRole('button',{name:'Assembly 100%'}).click();
  await p.screenshot({path:out+'/04-unscreened-4-steps.png',fullPage:true});
  await p.getByRole('button',{name:'이상적 KGD 선별'}).click();
  await p.getByRole('button',{name:'Assembly 95%'}).click();
  const y=await p.locator('.a05-readouts').innerText();
  if(!y.includes('0.95')||!y.includes('4.532'))throw Error('KGD must be CONDITIONAL assembly0.95 and candidates4.532 '+y);
  await p.screenshot({path:out+'/05-kgd-conditional-package-not-free.png',fullPage:true});
  await wrongCorrect(p,'06-kgd');await p.getByRole('button',{name:'다음 장면으로'}).click();
 });
 await qa('S03 board PCB vs stacked HBM TSV vs silicon & RDL sideways interposer, invalid TSV board blocked; three wrong feedback',async()=>{
  await first(p,'hbm-tsv-interposer');
  await p.getByRole('button',{name:'GDDR board PCB'}).click();
  await p.getByRole('button',{name:'TSV ON (stack 내부)'}).click();
  if(!((await p.getByTestId('package06-stage-status').innerText()).includes('생성할 수 없습니다')))throw Error('board GDDR manufactured HBM TSV');
  await p.getByRole('button',{name:'HBM DRAM stack'}).click();
  await p.getByRole('button',{name:'TSV ON (stack 내부)'}).click();
  if(!((await p.locator('.a05-readouts').innerText()).includes('vertical-tsv-plus-microbumps')))throw Error('HBM internal TSV not modeled');
  await p.getByRole('button',{name:'GPU+HBM interposer'}).click();
  await p.getByRole('button',{name:'실리콘 interposer'}).click();
  await p.getByRole('button',{name:'RDL interposer'}).click();
  const x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('interposer-dense-sideways')||!x.includes('RDL'))throw Error('sideways interposer/RDL wrong '+x);
  await wrongCorrect(p,'07-hbm');await p.getByRole('button',{name:'다음 장면으로'}).click();
 });
 await qa('S04 toy thermal 20W .2 ->4K,40W .4 ->16K and 12 misconception Korean Voice paths complete',async()=>{
  await first(p,'package-power-heat');
  await p.getByRole('button',{name:'Power 20W'}).click();
  await p.getByRole('button',{name:'Rθ 0.2K/W'}).click();
  let x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('4 K')||!x.includes('29 °C'))throw Error('thermal low 4K not shown '+x);
  await p.getByRole('button',{name:'Power 40W'}).click();
  await p.getByRole('button',{name:'Rθ 0.4K/W'}).click();
  x=await p.locator('.a05-readouts').innerText();
  if(!x.includes('16 K')||!x.includes('41 °C'))throw Error('thermal high16K not shown '+x);
  await wrongCorrect(p,'08-thermal');await overflow(p);
 });
 await qa('WebSpeech absent provides accessible Korean text fallback, no crash',async()=>{
  const q=await ctx.newPage();q.setDefaultTimeout(9500);q.on('pageerror',e=>failed.push({name:'voice JS',error:String(e)}));
  await q.addInitScript(()=>Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true}));
  await q.goto(url);await q.getByRole('button',{name:'한국어 질문 듣기'}).click();
  if(!await q.getByTestId('package06-voice-text').count())throw Error('no Korean text transcript');
  if(!await q.getByText('한국어 음성합성 기능이 없어',{exact:false}).count())throw Error('fallback missing');
  await q.screenshot({path:out+'/09-voice-text-fallback.png',fullPage:true});await q.close();
 });
 await qa('375/320px emulated iPhone touch/reduced motion, root fits',async()=>{
  const ctx2=await browser.newContext({...devices['iPhone 13'],viewport:{width:375,height:812},reducedMotion:'reduce'});
  const m=await ctx2.newPage();m.setDefaultTimeout(9500);m.on('pageerror',e=>failed.push({name:'mobile JS',error:String(e)}));
  await m.goto(url);await first(m,'fab-pattern-to-die');
  await m.getByRole('button',{name:'웨이퍼 준비'}).tap();await overflow(m);
  await m.screenshot({path:out+'/10-mobile-375.png',fullPage:true});
  await m.setViewportSize({width:320,height:700});await overflow(m);
  await m.screenshot({path:out+'/11-mobile-320.png',fullPage:true});await ctx2.close();
 });
 await ctx.close();
}catch(e){failed.push({name:'fatal',error:String(e)});}
finally{await browser?.close();server.kill('SIGTERM');}
console.log(JSON.stringify({passed,failed,artifact:out},null,2));if(failed.length)process.exitCode=1;
