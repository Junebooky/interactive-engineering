import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';

const url='http://127.0.0.1:4183/a05-sram-preview.html',out='browser-evidence/sram05';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4183','--strictPort'],{stdio:['ignore','inherit','inherit']});
let browser;const failures=[],passed=[];
async function run(label,fn){try{await fn();passed.push(label);console.log('PASS '+label);}catch(e){failures.push({label,error:String(e)});console.error('FAIL '+label,e);}}
async function ready(){for(let i=0;i<60;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,350));}throw Error('Vite not ready');}
async function predict(page){await page.locator('.a05-box').first().locator('.a05-choice-set button').first().click();}
async function answer(page,part){await page.locator('.a05-box').last().locator('.a05-choice-set button').filter({hasText:part}).first().click();}
async function overflow(page){const x=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);if(x[1]>x[0]+2)throw Error('overflow '+x);}
try{
  await ready();
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage();page.setDefaultTimeout(7000);
  page.on('pageerror',e=>failures.push({label:'desktop JS',error:String(e)}));
  await run('Sram 05 prediction gate hides SVG/readouts',async()=>{
    await page.goto(url);
    if(await page.locator('.a05-readouts').count())throw Error('answers exposed before prediction');
    await page.screenshot({path:out+'/01-prediction-veil-desktop.png',fullPage:true});
    await predict(page);
  });
  await run('S01 crossed feedback two states, supply-off volatility, incorrect and hints/Why',async()=>{
    await page.getByRole('button',{name:'Q = 0',exact:true}).click();
    await page.getByRole('button',{name:'Q = 1',exact:true}).click();
    await page.getByRole('button',{name:'전원 OFF',exact:true}).click();
    await answer(page,'SRAM은 전원을 꺼도');
    await page.getByRole('button',{name:'조건별로 결과 확인'}).click();
    if(!await page.getByText('어느 조건을 놓쳤는지').count())throw Error('wrong choice accepted');
    for(let i=0;i<3;i++)await page.getByRole('button',{name:/힌트 [0-2]\/3/}).click();
    if(!await page.getByText('3. 전원 공급 없이').count())throw Error('hint3 hidden');
    await answer(page,'양방향 피드백이 있어야');
    await page.getByRole('button',{name:'조건별로 결과 확인'}).click();
    if(!await page.getByText('현상과 이유를 연결했어요!').count())throw Error('correct latch answer failed');
    await page.getByRole('button',{name:'왜? 원리 보기'}).click();
    await page.screenshot({path:out+'/02-cross-coupled-volatility.png',fullPage:true});
    await page.getByRole('button',{name:'다음 질문으로'}).click();
  });
  await run('S02 6T wordline isolation, read/write and read disturb warning',async()=>{
    await predict(page);
    await page.getByRole('button',{name:'BL 1 / BLB 0'}).click();
    await page.getByRole('button',{name:'WL ON',exact:true}).click();
    await page.getByRole('button',{name:'READ',exact:true}).click();
    const view=await page.locator('.a05-readouts').innerText();
    if(!view.includes('1 / 0')||!view.includes('있음'))throw Error('6T readout incorrect '+view);
    await answer(page,'4T 교차 인버터');
    await page.getByRole('button',{name:'조건별로 결과 확인'}).click();
    if(!await page.getByText('현상과 이유를 연결했어요!').count())throw Error('6T failed');
    await page.screenshot({path:out+'/03-sram-6t-access.png',fullPage:true});
    await page.getByRole('button',{name:'다음 질문으로'}).click();
  });
  await run('S03 LRU 1/2 lines produces 41/32 toy units',async()=>{
    await predict(page);
    await page.getByRole('button',{name:'A,A,B,A,C LRU 실행'}).click();
    if(!((await page.locator('.a05-readouts').innerText()).includes('41 toy')))throw Error('one line not 41');
    await page.screenshot({path:out+'/04-cache-one-line-41.png',fullPage:true});
    await page.getByRole('button',{name:'2라인 SRAM'}).click();
    await page.getByRole('button',{name:'A,A,B,A,C LRU 실행'}).click();
    if(!((await page.locator('.a05-readouts').innerText()).includes('32 toy')))throw Error('two lines not 32');
    await page.screenshot({path:out+'/05-cache-two-lines-32.png',fullPage:true});
    await answer(page,'41→32');
    await page.getByRole('button',{name:'조건별로 결과 확인'}).click();
    if(!await page.getByText('현상과 이유를 연결했어요!').count())throw Error('cache failed');
    await page.getByRole('button',{name:'다음 질문으로'}).click();
  });
  await run('S04 model residency changes weights but not new input',async()=>{
    await predict(page);
    await page.getByRole('button',{name:'미상주 · 모델 로드'}).click();
    await page.getByRole('button',{name:'상주 · 가중치 재사용'}).click();
    await page.getByRole('button',{name:/새 입력 전달하기/}).click();
    const v=await page.locator('.a05-readouts').innerText();
    if(!v.includes('재사용')||!v.includes('항상 존재'))throw Error('input locality wrong '+v);
    await answer(page,'새 입력/활성값 이동은 남아요');
    await page.getByRole('button',{name:'조건별로 결과 확인'}).click();
    if(!await page.getByText('현상과 이유를 연결했어요!').count())throw Error('locality failed');
    await overflow(page);
    await page.screenshot({path:out+'/06-gpu-locality.png',fullPage:true});
  });
  await run('unsupported Korean WebSpeech fallback',async()=>{
    const muted=await context.newPage();muted.setDefaultTimeout(7000);
    muted.on('pageerror',e=>failures.push({label:'voice fallback JS',error:String(e)}));
    await muted.addInitScript(()=>{Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true});});
    await muted.goto(url);
    await muted.getByRole('button',{name:'한국어 질문 듣기'}).click();
    if(!await muted.getByText('이 브라우저에서 한국어 음성을 지원하지 않아도',{exact:false}).count())throw Error('missing voice fallback');
    if(!await muted.getByTestId('sram-transcript').count())throw Error('no voice text transcript');
    await muted.screenshot({path:out+'/07-voice-fallback.png',fullPage:true});
    await muted.close();
  });
  await run('mobile touch, responsive 375/320 and reduced motion CSS',async()=>{
    const mobile=await browser.newContext({...devices['iPhone 13'],viewport:{width:375,height:812},reducedMotion:'reduce'});
    const phone=await mobile.newPage();phone.setDefaultTimeout(7000);
    phone.on('pageerror',e=>failures.push({label:'mobile JS',error:String(e)}));
    await phone.goto(url);await predict(phone);
    await phone.getByRole('button',{name:'Q = 1',exact:true}).tap();
    await overflow(phone);
    await phone.screenshot({path:out+'/08-sram-mobile-375.png',fullPage:true});
    await phone.setViewportSize({width:320,height:700});
    await overflow(phone);
    await phone.screenshot({path:out+'/09-sram-mobile-320.png',fullPage:true});
    await mobile.close();
  });
  await context.close();
}catch(e){failures.push({label:'fatal',error:String(e)});}
finally{await browser?.close();server.kill('SIGTERM');}
console.log(JSON.stringify({passed,failures,artifacts:out},null,2));
if(failures.length)process.exitCode=1;
