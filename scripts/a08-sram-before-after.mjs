import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const beforeDir=process.argv[2];
if(!beforeDir)throw Error('Pass original A05 SRAM exact checkout path');
const out='browser-evidence/sram05/a08-comparison';
await mkdir(out,{recursive:true});
const widths=[{w:1440,h:900},{w:390,h:844},{w:320,h:640}];
const reports=[];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
async function waitFor(url){
 for(let i=0;i<80;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(resolve=>setTimeout(resolve,300));}
 throw Error('Vite preview unreachable '+url);
}
async function test(label,cwd,port){
 const url='http://127.0.0.1:'+port+'/a05-sram-preview.html';
 const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port',String(port),'--strictPort'],
  {cwd,stdio:['ignore','inherit','inherit']});
 try{
  await waitFor(url);
  for(const {w,h} of widths){
   const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});
   const page=await ctx.newPage();page.setDefaultTimeout(10000);
   await page.goto(url);
   if(await page.locator('.a05-readouts').count())throw Error(label+' measurement leaked before prediction at '+w);
   if(label==='after'&&await page.getByTestId('a08-sram-experiment-dock').count())throw Error('Dock pre-prediction leak');
   await page.screenshot({path:out+'/'+label+'-'+w+'-prediction.png',fullPage:true});
   await page.locator('.a05-copy .a05-choice-set button').first().click();
   if(label==='before'){
    const headings=await page.locator('.a05-copy h3').allInnerTexts();
    if(!headings.includes('결과를 보기 전에 예상하기')||!headings.includes('직접 조작하기')||!headings.includes('관찰한 원리 설명하기'))
      throw Error('Original simultaneous three-task baseline not reproduced at '+w+': '+headings);
    await page.screenshot({path:out+'/before-'+w+'-three-active-questions.png',fullPage:true});
   }else{
    const dock=page.getByTestId('a08-sram-experiment-dock');
    if(!await dock.isVisible())throw Error('Scene attached SRAM controls missing at '+w);
    if(await page.locator('.a05-copy .a05-choice-set').count())throw Error('Premature concept choices while experimenting '+w);
    await page.screenshot({path:out+'/after-'+w+'-experiment-only.png',fullPage:true});
    await dock.getByRole('button',{name:'Q = 0',exact:true}).click();
    await dock.getByRole('button',{name:'Q = 1',exact:true}).click();
    if(await page.locator('.a05-copy .a05-choice-set').count())throw Error('Volatility experiment bypassed '+w);
    await dock.getByRole('button',{name:'전원 OFF',exact:true}).click();
    if(!await page.locator('.a05-copy .a05-choice-set').count())throw Error('Concept not unlocked after Q0 Q1 and supply OFF '+w);
    const rd=await page.locator('.a05-readouts').innerText();
    if(!rd.includes('? / ?'))throw Error('Original SRAM power-loss science changed '+rd);
    await page.screenshot({path:out+'/after-'+w+'-one-why-after-observation.png',fullPage:true});
    await page.locator('.a05-copy .a05-choice-set button').filter({hasText:'SRAM은 전원을 꺼도'}).click();
    await page.getByRole('button',{name:'조건별로 결과 확인'}).click();
    if(!await page.getByText('어느 조건을 놓쳤는지').count())throw Error('Wrong concept was accepted '+w);
    if(await page.getByRole('button',{name:'왜? 원리 보기'}).count())throw Error('Teacher WHY exposed after wrong answer '+w);
    if(await page.locator('.a05-why').count())throw Error('Premature full teacher WHY '+w);
    await page.locator('.a05-copy .a05-choice-set button').filter({hasText:'양방향 피드백이 있어야'}).click();
    await page.getByRole('button',{name:'조건별로 결과 확인'}).click();
    if(!await page.getByText('현상과 이유를 연결했어요!').count())throw Error('Correct SRAM explanation not accepted '+w);
    if(await page.locator('.a05-copy .a05-choice-set').count())throw Error('Explanation choices persist after successful completion '+w);
    const small=await dock.locator('button').evaluateAll(buttons=>buttons.filter(b=>{const rect=b.getBoundingClientRect();return rect.height<44||rect.width<44;}).length);
    if(small)throw Error('SRAM dock undersized button at '+w);
    await page.screenshot({path:out+'/after-'+w+'-feedback-success.png',fullPage:true});
   }
   const x=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
   if(x[1]>x[0]+2)throw Error('Horizontal overflow '+label+' '+w+': '+x);
   reports.push({phase:label,viewport:w,horizontalOverflow:x[1]-x[0]});
   await ctx.close();
  }
 }finally{server.kill('SIGTERM');}
}
try{
 await test('before',beforeDir,4197);
 await test('after',process.cwd(),4198);
 console.log('A08_SRAM_CHROMIUM_BEFORE_AFTER_PASS '+JSON.stringify(reports));
}finally{await browser.close();}
