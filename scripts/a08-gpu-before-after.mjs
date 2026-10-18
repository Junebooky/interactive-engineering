import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const beforeDir=process.argv[2];
if(!beforeDir)throw Error('Pass exact original A05 GPU source checkout path');
const out='browser-evidence/g03/a08-comparison';
await mkdir(out,{recursive:true});
const sizes=[{w:1440,h:900},{w:390,h:844},{w:320,h:640}];
const reports=[];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
async function waitFor(url){
 for(let i=0;i<90;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,250));}
 throw Error('Vite server unreachable '+url);
}
async function visit(label,cwd,port){
 const url='http://127.0.0.1:'+port+'/a05-gpu-preview.html';
 const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port',String(port),'--strictPort'],
   {cwd,stdio:['ignore','inherit','inherit']});
 try{
  await waitFor(url);
  for(const {w,h} of sizes){
   const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});
   const page=await ctx.newPage();page.setDefaultTimeout(10000);
   page.on('pageerror',e=>{throw Error('JS error '+String(e))});
   await page.goto(url);
   if(await page.locator('.a05-readouts').count())throw Error(label+' leaked pre-prediction results');
   if(label==='after'&&await page.getByTestId('a08-gpu-experiment-dock').count())throw Error('Experiment dock leaked before prediction');
   await page.screenshot({path:out+'/'+label+'-'+w+'-prediction.png',fullPage:true});
   await page.locator('.a05-copy .a05-choice-set button').first().click();
   if(label==='before'){
    const headings=await page.locator('.a05-copy h3').allInnerTexts();
    if(!headings.includes('먼저 예상해 보세요')||!headings.includes('직접 움직여 보기')||!headings.includes('관찰한 핵심은 무엇일까요?'))
      throw Error('Old simultaneous 3-task baseline not reproduced '+w+' '+headings);
    await page.screenshot({path:out+'/before-'+w+'-three-tasks-at-once.png',fullPage:true});
   }else{
    const dock=page.getByTestId('a08-gpu-experiment-dock');
    if(!await dock.isVisible())throw Error('Scene-attached dock missing '+w);
    if(await page.locator('.a05-copy .a05-choice-set').count())throw Error('Explanation exposed before physical observations '+w);
    if(await page.locator('.a05-copy').getByText('먼저 예상해 보세요').count())throw Error('Prediction remains visible after acceptance '+w);
    await page.screenshot({path:out+'/after-'+w+'-experiment-only.png',fullPage:true});
    await dock.getByRole('button',{name:'compute 16'}).click();
    await dock.getByRole('button',{name:'compute 32'}).click();
    if(await page.locator('.a05-copy .a05-choice-set').count())throw Error('Final concept opened without feed comparison '+w);
    await dock.getByRole('button',{name:'feed 32'}).click();
    const sceneReadouts=await page.locator('.a05-readouts').innerText();
    if(!sceneReadouts.includes('2 toy s'))throw Error('Original A05 physical model changed '+sceneReadouts);
    if(!await page.locator('.a05-copy .a05-choice-set').count())throw Error('Explanation not unlocked after physical evidence '+w);
    await page.screenshot({path:out+'/after-'+w+'-one-why-after-observation.png',fullPage:true});
    const small=await dock.locator('button').evaluateAll(buttons=>buttons.filter(b=>{
      const r=b.getBoundingClientRect();return r.height<44||r.width<44;
    }).length);
    if(small)throw Error('Dock buttons under 44px '+w);
    await page.locator('.a05-copy .a05-choice-set button').filter({hasText:'GPU 코어가 두 배'}).click();
    await page.getByRole('button',{name:'조건별로 확인하기'}).click();
    if(!await page.getByText('빠진 조건이 있는지').count())throw Error('Wrong concept not rejected '+w);
    const teacherWhy=await page.getByTestId('g03-why-panel').count();
    if(teacherWhy)throw Error('Full teacher WHY opened without explicit request '+w);
    await page.locator('.a05-copy .a05-choice-set button').filter({hasText:'min(compute,feed)'}).click();
    await page.getByRole('button',{name:'조건별로 확인하기'}).click();
    if(!await page.getByText('원리와 관찰을 연결했어요!').count())throw Error('Correct concept did not pass '+w);
    if(await page.locator('.a05-copy .a05-choice-set').count())throw Error('Second concept task persisted after success '+w);
    await page.screenshot({path:out+'/after-'+w+'-completed.png',fullPage:true});
   }
   const width=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
   if(width[1]>width[0]+2)throw Error('Horizontal overflow '+label+' '+w+' '+width);
   reports.push({phase:label,viewport:w,overflow:width[1]-width[0]});
   await ctx.close();
  }
 }finally{server.kill('SIGTERM');}
}
try{
 await visit('before',beforeDir,4195);
 await visit('after',process.cwd(),4196);
 console.log('A08_GPU_CHROMIUM_BEFORE_AFTER_PASS '+JSON.stringify(reports));
}finally{await browser.close();}
