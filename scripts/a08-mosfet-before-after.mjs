import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const oldDirectory=process.argv[2];
if(!oldDirectory)throw Error('Pass original A05 PR8 worktree path');
const out='browser-evidence/m01/a08-comparison';
await mkdir(out,{recursive:true});
const widths=[{w:1440,h:900},{w:390,h:844},{w:320,h:640}];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const reports=[];
async function awaitServer(url){
 for(let i=0;i<80;i++){
  try{if((await fetch(url)).ok)return;}catch{}
  await new Promise(resolve=>setTimeout(resolve,300));
 }
 throw Error('Vite preview not ready '+url);
}
async function run(label,cwd,port){
 const url='http://127.0.0.1:'+port+'/a05-preview.html';
 const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd,stdio:['ignore','inherit','inherit']});
 try{
  await awaitServer(url);
  for(const {w,h} of widths){
   const context=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});
   const page=await context.newPage();page.setDefaultTimeout(10000);
   await page.goto(url);
   if(await page.locator('.a05-readouts').count())throw Error(label+' exposed numerical result before prediction');
   if(label==='after' && await page.getByTestId('a08-mosfet-experiment-dock').count())
    throw Error('Experiment dock leaked before prediction');
   await page.screenshot({path:out+'/'+label+'-'+w+'-predict.png',fullPage:true});
   await page.locator('.a05-copy .a05-choice-set button').filter({hasText:'1.2 V'}).first().click();
   if(label==='before'){
    const problem=await page.locator('.a05-copy').innerText();
    if(!problem.includes('직접 조작하기')||!problem.includes('관찰한 원리 확인하기'))
      throw Error('Original A05 simultaneous experiment+explain state no longer reproducible');
    await page.screenshot({path:out+'/before-'+w+'-experiment-and-explanation-at-once.png',fullPage:true});
   }else{
    const dock=page.getByTestId('a08-mosfet-experiment-dock');
    if(!await dock.count()||!await dock.isVisible())throw Error('Scene-attached Experiment Dock missing '+w);
    if(await page.locator('.a05-copy').getByText('관찰한 원리 확인하기').count())
      throw Error('Concept quiz leaked before a real voltage experiment '+w);
    if(await page.locator('.a05-copy .a05-choice-set').count())
      throw Error('Prediction or explanation choices simultaneously visible during experiment');
    await page.screenshot({path:out+'/after-'+w+'-experiment-only.png',fullPage:true});
    const slider=dock.locator('#a05-voltage');
    await slider.fill('0.8');
    if(!await page.locator('.a05-copy').getByText('관찰한 원리 확인하기').count())
      throw Error('Explanation did not unlock after physical low/high observation '+w);
    if(await page.locator('.a05-copy').getByText('먼저 예상하기').count())
      throw Error('Old prediction question persisted after observation '+w);
    await page.screenshot({path:out+'/after-'+w+'-one-why-after-observation.png',fullPage:true});
    await page.locator('.a05-copy .a05-choice-set button').filter({hasText:'전자들이 산화막을 뚫고'}).click();
    await page.getByRole('button',{name:'관찰 결과 확인하기'}).click();
    if(!await page.getByText('어느 조건이 다른지').count())throw Error('Wrong answer feedback missing');
    if(await page.getByRole('button',{name:'왜 그럴까요? 원리 보기'}).count())
      throw Error('Teacher full WHY unlocked after wrong answer');
    if(await page.locator('.a05-why').count())throw Error('Teacher explanation exposed after wrong answer');
    await page.locator('.a05-copy .a05-choice-set button').filter({hasText:'실리콘 표면에'}).click();
    await page.getByRole('button',{name:'관찰 결과 확인하기'}).click();
    if(!await page.getByText('원리를 연결했어요!').count())throw Error('Correct outcome missing');
    if(await page.locator('.a05-copy .a05-choice-set').count())
      throw Error('Answer choices remain as parallel task after completion');
    await page.screenshot({path:out+'/after-'+w+'-feedback-complete.png',fullPage:true});
    if(await dock.locator('input').count()){
     const height=await slider.evaluate(el=>el.getBoundingClientRect().height);
     if(height<44)throw Error('Slider touch target <44px on '+w);
    }
    const ctr=await dock.locator('button').evaluateAll(items=>items.filter(btn=>btn.getBoundingClientRect().height<44||btn.getBoundingClientRect().width<44).length);
    if(ctr)throw Error('Dock button touch target too small on '+w);
   }
   const width=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
   if(width[1]>width[0]+2)throw Error(label+' viewport horizontal overflow '+w+' '+width);
   reports.push({phase:label,viewport:w,overflow:width[1]-width[0]});
   await context.close();
  }
 }finally{server.kill('SIGTERM')}
}
try{
 await run('before',oldDirectory,4193);
 await run('after',process.cwd(),4194);
 console.log('A08_MOSFET_CHROMIUM_PASS '+JSON.stringify(reports));
}finally{await browser.close()}
