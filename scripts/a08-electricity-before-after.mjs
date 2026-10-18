import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const baselineDir=process.argv[2];
if(!baselineDir)throw new Error('Pass the checkout path of the original A05 exact HEAD');
const out='browser-evidence/electricity12/a08-comparison';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const sizes=[
  {label:'1440x900',width:1440,height:900},
  {label:'390x844',width:390,height:844},
  {label:'320x640',width:320,height:640}
];
const reports=[];
async function waitFor(url){
  for(let n=0;n<80;n++){
    try{if((await fetch(url)).ok)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,300));
  }
  throw Error('Could not reach local Vite server at '+url);
}
async function scan(phase,cwd,port){
  const baseUrl='http://127.0.0.1:'+port+'/a05-electricity-preview.html';
  const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port',String(port),'--strictPort'],{
    cwd,stdio:['ignore','inherit','inherit']
  });
  try{
    await waitFor(baseUrl);
    for(const size of sizes){
      const context=await browser.newContext({viewport:{width:size.width,height:size.height},reducedMotion:'reduce'});
      const page=await context.newPage();
      page.setDefaultTimeout(12000);
      await page.goto(baseUrl);
      if(await page.locator('.a05-readouts').count())throw Error(phase+' leaked measurements before predicting');
      await page.locator('.a05-box .a05-choice-set button').first().click();
      const source=page.getByRole('button',{name:'0 V',exact:true});
      await source.focus();
      await page.keyboard.press('Enter');
      await page.getByRole('button',{name:'닫힘 (CLOSED)'}).click();
      const readout=await page.locator('.a05-readouts').innerText();
      const arrowCount=await page.getByTestId('electricity-current-flow-arrows').count();
      const svgLabel=await page.locator('svg[role="img"]').getAttribute('aria-label');
      const width=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
      if(width.scroll>width.viewport+2)throw Error(phase+' horizontal overflow '+size.label+' '+JSON.stringify(width));
      const small=await page.locator('.a05-experiment-dock button').evaluateAll(buttons=>buttons.filter(b=>{
        const rect=b.getBoundingClientRect();
        return rect.height<44 || rect.width<44;
      }).length);
      if(small)throw Error(phase+' undersize interactive target at '+size.label+': '+small);
      if(phase==='before'){
        if(!readout.includes('5 V') || !readout.includes('5.00 mA')){
          throw Error('Baseline unexpectedly no longer reproduces 0V-to-5V switch reset: '+readout);
        }
      }else{
        if(!readout.includes('0 V') || !readout.includes('0.00 mA')){
          throw Error('0V source was mutated by switch at '+size.label+': '+readout);
        }
        if(arrowCount!==0)throw Error('0mA still shows motion arrows at '+size.label);
        if(!svgLabel?.includes('방향 화살표는 표시하지 않습니다')){
          throw Error('Screen reader state does not reflect 0mA no-arrow state');
        }
        if(await page.getByRole('button',{name:'0 V',exact:true}).getAttribute('aria-pressed')!=='true'){
          throw Error('0V control selection lost');
        }
        if(await page.getByRole('button',{name:'닫힘 (CLOSED)'}).getAttribute('aria-pressed')!=='true'){
          throw Error('CLOSED control selection lost');
        }
      }
      await page.screenshot({path:out+'/'+phase+'-0V-closed-'+size.label+'.png',fullPage:true});
      if(phase==='after'){
        await page.getByRole('button',{name:'5 V',exact:true}).click();
        const five=await page.locator('.a05-readouts').innerText();
        if(!five.includes('5.00 mA') || await page.getByTestId('electricity-current-flow-arrows').count()!==1)
          throw Error('5V CLOSED must restore 5mA and arrows: '+five);
        await page.screenshot({path:out+'/after-5V-closed-'+size.label+'.png',fullPage:true});
        await page.getByRole('button',{name:'열림 (OPEN)'}).click();
        if(await page.getByTestId('electricity-current-flow-arrows').count())
          throw Error('OPEN must never show flow arrows');
      }
      reports.push({phase,viewport:size.label,readout,flowArrowElements:arrowCount,ariaLabel:svgLabel});
      await context.close();
    }
  } finally {
    server.kill('SIGTERM');
  }
}
try{
  await scan('before',baselineDir,4187);
  await scan('after',process.cwd(),4188);
  console.log('A08_CHROMIUM_REGRESSION_PASS '+JSON.stringify(reports,null,2));
}finally{
  await browser.close();
}
