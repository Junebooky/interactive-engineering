import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';

const host='http://127.0.0.1:4181/a05-dram-preview.html', out='browser-evidence/d02';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4181','--strictPort'],{stdio:['ignore','inherit','inherit']});
let browser; const failed=[],passed=[];
async function check(name,fn){try{await fn();passed.push(name);console.log('PASS '+name);}catch(e){failed.push({name,error:String(e)});console.error('FAIL '+name,e);}}
async function waitReady(){for(let i=0;i<80;i++){try{if((await fetch(host)).ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}throw Error('Vite not available');}
async function prediction(p){await p.locator('.a05-box').first().locator('.a05-choice-set button').first().click();}
async function answer(p,name){await p.locator('.a05-box').last().locator('.a05-choice-set button').filter({hasText:name}).first().click();}
async function verifyNoOverflow(p){const x=await p.evaluate(()=>({client:document.documentElement.clientWidth,actual:document.documentElement.scrollWidth}));if(x.actual>x.client+2)throw Error(JSON.stringify(x));}
try{
  await waitReady(); browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage();
  page.on('pageerror',e=>failed.push({name:'desktop JS',error:String(e)}));
  await check('prediction hides circuit/readouts before reveal',async()=>{
    await page.goto(host);
    if(await page.locator('.a05-readouts').count())throw Error('early readouts visible');
    await page.screenshot({path:out+'/01-dram-predict-desktop.png',fullPage:true});
    await prediction(page);
  });
  await check('D02 S01 write WL gating, wrong answer, hints, Why',async()=>{
    await page.getByRole('button',{name:'BL = 1'}).click();
    await page.getByRole('button',{name:'WL ON'}).click();
    await page.getByRole('button',{name:'WL OFF'}).click();
    await page.getByRole('button',{name:'BL = 0'}).click();
    await answer(page,'WL을 닫아도');
    await page.getByRole('button',{name:'조건별로 확인하기'}).click();
    if(!await page.getByText('빠진 조건이 있는지').count())throw Error('no error feedback');
    for(let i=0;i<3;i++)await page.getByRole('button',{name:/힌트 [0-2]\/3/}).click();
    if(!await page.getByText('3. 실제 소자의 저장 전압').count())throw Error('hint3 not visible');
    await answer(page,'WL OFF일 땐');
    await page.getByRole('button',{name:'조건별로 확인하기'}).click();
    if(!await page.getByText('원리를 발견했어요!').count())throw Error('write not passed');
    await page.getByRole('button',{name:'왜? 원리 확인하기'}).click();
    await page.screenshot({path:out+'/02-dram-write-desktop.png',fullPage:true});
    await page.getByRole('button',{name:'다음 질문으로'}).click();
  });
  await check('D02 S02 cell0 0.45 UI+Voice, cell1 0.55 UI+Voice',async()=>{
    await prediction(page);
    await page.getByRole('button',{name:'셀 0'}).click();
    const explanation=page.getByTestId('charge-sharing-explanation');
    if(!((await explanation.innerText()).includes('0.45')))throw Error('cell0 0.45 missing');
    await page.getByRole('button',{name:'선택한 비트 0의 관찰 설명 듣기'}).click();
    if(!((await page.getByTestId('a05-dram-voice-transcript').innerText()).includes('0.45')))throw Error('cell0 Voice wrong');
    await page.screenshot({path:out+'/03-dram-sense-cell0-precharge.png',fullPage:true});
    await page.getByRole('button',{name:'셀 1'}).click();
    if(!((await explanation.innerText()).includes('0.55')))throw Error('cell1 0.55 missing');
    await page.getByRole('button',{name:'선택한 비트 1의 관찰 설명 듣기'}).click();
    if(!((await page.getByTestId('a05-dram-voice-transcript').innerText()).includes('0.55')))throw Error('cell1 Voice wrong');
    await page.screenshot({path:out+'/04-dram-sense-cell1-precharge.png',fullPage:true});
    await page.getByRole('button',{name:'셀 0'}).click();
    await page.getByRole('button',{name:'1. 전하 공유'}).click();
    if(!((await page.locator('.a05-readouts').innerText()).includes('0.45')))throw Error('share readout wrong');
    await page.getByRole('button',{name:'2. 증폭 시작 순간 보기'}).click();
    if(!((await page.locator('.a05-readouts').innerText()).includes('증폭 중')))throw Error('snapshot transient disclaimer missing');
    await page.screenshot({path:out+'/05-dram-sense-shared-amplify.png',fullPage:true});
    await page.getByRole('button',{name:'3. 복원 완료 순간 보기'}).click();
    await answer(page,'센스앰프가 증폭한 뒤');
    await page.getByRole('button',{name:'조건별로 확인하기'}).click();
    if(!await page.getByText('원리를 발견했어요!').count())throw Error('restore not passed');
    await page.screenshot({path:out+'/06-dram-restored-cell0.png',fullPage:true});
    await page.getByRole('button',{name:'다음 질문으로'}).click();
  });
  await check('D02 S03 toy leak and refresh controls, keyboard slider',async()=>{
    await prediction(page);
    const slider=page.locator('#a05-dram-time');
    await slider.focus();await page.keyboard.press('ArrowRight');
    if(await slider.inputValue()!=='0.1')throw Error('keyboard slider failed');
    await slider.fill('1');
    if(!((await page.locator('.a05-readouts').innerText()).includes('0.80')))throw Error('leak value wrong');
    await page.screenshot({path:out+'/07-dram-leak-before.png',fullPage:true});
    await page.getByRole('button',{name:'셀 리프레시'}).click();
    if(!((await page.locator('.a05-readouts').innerText()).includes('1.00')))throw Error('refresh not restored');
    await answer(page,'주기적으로 재충전해야');
    await page.getByRole('button',{name:'조건별로 확인하기'}).click();
    if(!await page.getByText('원리를 발견했어요!').count())throw Error('refresh not passed');
    await page.screenshot({path:out+'/08-dram-refresh-after.png',fullPage:true});
    await page.getByRole('button',{name:'다음 질문으로'}).click();
  });
  await check('D02 S04 internal bank overlap and 2x caveat',async()=>{
    await prediction(page);
    await page.getByRole('button',{name:'1 뱅크 · 직렬'}).click();
    await page.getByRole('button',{name:'2 뱅크 · 부분 겹침'}).click();
    await answer(page,'공용 버스 제약은 남아요');
    await page.getByRole('button',{name:'조건별로 확인하기'}).click();
    if(!await page.getByText('원리를 발견했어요!').count())throw Error('bank not passed');
    await verifyNoOverflow(page);
    await page.screenshot({path:out+'/09-dram-bank-desktop.png',fullPage:true});
  });
  await check('reduced motion and speech fallback',async()=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    const duration=await page.evaluate(()=>{const e=document.querySelector('.a05-dram-lab button');return e?getComputedStyle(e).animationDuration:'missing';});
    if(duration==='missing')throw Error('reduced-motion target missing');
    const mute=await context.newPage();
    mute.on('pageerror',e=>failed.push({name:'voice fallback JS',error:String(e)}));
    await mute.addInitScript(()=>{Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true});});
    await mute.goto(host);
    await mute.getByRole('button',{name:'한국어 질문 듣기'}).click();
    if(!await mute.getByText('이 브라우저에서는 음성을 지원하지 않아요.',{exact:false}).count())throw Error('no fallback');
    await mute.screenshot({path:out+'/10-dram-voice-fallback.png',fullPage:true});
    await mute.close();
  });
  await check('mobile touch + 375/320px no overflow',async()=>{
    const mobile=await browser.newContext({...devices['iPhone 13'],viewport:{width:375,height:812}});
    const phone=await mobile.newPage();
    phone.on('pageerror',e=>failed.push({name:'phone JS',error:String(e)}));
    await phone.goto(host);await prediction(phone);
    await phone.getByRole('button',{name:'BL = 1'}).tap();
    await phone.getByRole('button',{name:'WL ON'}).tap();
    await phone.getByRole('button',{name:'WL OFF'}).tap();
    await phone.getByRole('button',{name:'BL = 0'}).tap();
    await verifyNoOverflow(phone);
    await phone.screenshot({path:out+'/11-dram-mobile-375.png',fullPage:true});
    await phone.setViewportSize({width:320,height:720});
    await verifyNoOverflow(phone);
    await phone.screenshot({path:out+'/12-dram-mobile-320.png',fullPage:true});
    await mobile.close();
  });
  await context.close();
}catch(e){failed.push({name:'fatal',error:String(e)});}
finally{await browser?.close();server.kill('SIGTERM');}
console.log(JSON.stringify({passed,failed,artifact:out},null,2));
if(failed.length)process.exitCode=1;
