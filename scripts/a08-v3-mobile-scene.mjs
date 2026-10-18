import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const mode=process.argv[2], beforeDir=process.argv[3];
if(!['electricity','mosfet'].includes(mode)||!beforeDir)
 throw Error('Usage: node a08-v3-mobile-scene.mjs electricity|mosfet <old-A08-worktree>');
const isE=mode==='electricity';
const out='browser-evidence/'+(isE?'electricity12':'m01')+'/a08-v3-review';
await mkdir(out,{recursive:true});
const name=isE?'a05-electricity-preview.html':'a05-preview.html';
const sizes=[{w:390,h:844},{w:320,h:640},{w:1440,h:900}];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results={};
async function ready(url){
 for(let i=0;i<80;i++){try{if((await fetch(url)).ok)return;}catch{}
 await new Promise(resolve=>setTimeout(resolve,250));}
 throw Error('Vite unavailable '+url);
}
function checkRects(a,b,code){
 if(!a||!b)throw Error('Missing bounding boxes '+code);
 const xIntersects=a.x<b.x+b.width&&a.x+a.width>b.x;
 const yIntersects=a.y<b.y+b.height&&a.y+a.height>b.y;
 if(xIntersects&&yIntersects)throw Error('Overlapping '+code+': '+JSON.stringify({a,b}));
}
async function visit(stage,cwd,port){
 const url='http://127.0.0.1:'+port+'/'+name;
 const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd,stdio:['ignore','inherit','inherit']});
 try{
  await ready(url);
  for(const {w,h} of sizes){
   const context=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});
   const page=await context.newPage();page.setDefaultTimeout(12000);
   await page.goto(url);await page.evaluate(()=>document.fonts.ready);
   const pre=await page.locator('.a05-readouts').count();
   if(pre!==0)throw Error(mode+' result shown before prediction');
   if(isE){
    await page.locator('.a05-copy .a05-choice-set button').first().click();
    await page.getByRole('button',{name:'닫힘 (CLOSED)'}).click();
   }else{
    await page.locator('.a05-copy .a05-choice-set button').filter({hasText:'1.2 V'}).click();
    await page.locator('#a05-voltage').fill('0.8');
   }
   await page.screenshot({path:out+'/'+stage+'-'+w+'x'+h+'-viewport.png'});
   await page.screenshot({path:out+'/'+stage+'-'+w+'x'+h+'-full.png',fullPage:true});
   const heights=await page.evaluate(()=>({page:document.documentElement.scrollHeight,viewport:document.documentElement.clientHeight,scrollWidth:document.documentElement.scrollWidth,viewportWidth:document.documentElement.clientWidth}));
   if(heights.scrollWidth>heights.viewportWidth+2)throw Error(mode+' horizontal overflow '+stage+' '+w+' '+JSON.stringify(heights));
   if(stage==='after'){
    const slot=page.getByTestId(isE?'a08-electricity-scene-slot':'a08-mosfet-scene-slot');
    const visual=slot.locator('svg');
    const dock=page.getByTestId(isE?'electricity-experiment-dock':'a08-mosfet-experiment-dock');
    const sv=await visual.boundingBox(),sb=await slot.boundingBox(),db=await dock.boundingBox();
    if(!sv||!sb||!db)throw Error('Scene SVG/slot/dock missing '+w);
    if(sv.x<sb.x-2||sv.x+sv.width>sb.x+sb.width+2||sv.y<sb.y-2||sv.y+sv.height>sb.y+sb.height+2)
      throw Error('SVG escaped scene slot '+w+' '+JSON.stringify({sv,sb}));
    if(w<=390&&sb.height>(w===390?350:255))throw Error('V3 mobile SVG slot exceeds budget '+w+' '+sb.height);
    checkRects(sb,db,'scene/dock '+w);
    const metrics=await page.locator('.a05-visual>.a05-readouts>span').evaluateAll(nodes=>
     nodes.map(x=>({txt:x.textContent,display:getComputedStyle(x).display,rect:x.getBoundingClientRect().toJSON()})));
    if(metrics.length!==4)throw Error('Scientific readout DOM unexpectedly dropped '+w);
    if(w<=390){
      if(metrics.filter(v=>v.display!=='none').length!==2)throw Error('Not exactly 2 primary mobile readouts '+w);
      if(!await page.locator('.a05-mobile-extra summary').first().isVisible())
        throw Error('Accessible extra measurement disclosure missing '+w);
    }
    const candidate=await page.evaluate(()=>{
      const parts=[...document.querySelectorAll('.a05-canvas-col button,.a05-canvas-col summary,.a05-visual .a05-readouts span,.a05-copy h2')];
      return parts.filter(el=>{
        const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
        return cs.display!=='none'&&r.width>0&&r.height>0&&(el.scrollWidth>el.clientWidth+3||r.left<0||r.right>innerWidth+2)
      }).map(x=>({text:(x.textContent||'').slice(0,45),width:x.clientWidth,scroll:x.scrollWidth}));
    });
    if(candidate.length)throw Error('Visible control or text clipped '+w+' '+JSON.stringify(candidate));
    const minTargets=await page.locator('.a05-canvas-col button,.a05-canvas-col summary').evaluateAll(els=>
      els.filter(el=>{const cs=getComputedStyle(el);if(cs.display==='none'||!el.getClientRects().length)return false;const r=el.getBoundingClientRect();return r.height<44||(el.tagName==='BUTTON'&&r.width<44)}).map(x=>({text:x.textContent?.slice(0,40),height:x.getBoundingClientRect().height,width:x.getBoundingClientRect().width})));
    if(minTargets.length)throw Error('Undersize touch targets '+w+' '+JSON.stringify(minTargets));
    if(isE){
      const readouts=await page.locator('.a05-visual>.a05-readouts').innerText();
      if(!readouts.includes('5.00 mA'))throw Error('5V CLOSED current regression '+readouts);
      await page.getByRole('button',{name:'0 V',exact:true}).click();
      if(!((await page.locator('.a05-visual>.a05-readouts').innerText()).includes('0.00 mA')))
        throw Error('Switch incorrectly reset source voltage');
      if(await page.getByTestId('electricity-current-flow-arrows').count())throw Error('0mA arrows shown');
      await dock.locator('.a05-dock-options summary').click();
      await dock.getByRole('button',{name:'전자 이동'}).click();
      await dock.getByRole('button',{name:'관습전류',exact:true}).click();
    }else{
      if(!await page.locator('.a05-copy').getByText('관찰한 원리 확인하기').count())
        throw Error('MOSFET observation gate lost');
      if(await page.locator('.a05-copy').getByText('먼저 예상하기').count())
        throw Error('MOSFET prediction remains concurrent');
    }
    const disclosure=page.locator('.a05-mobile-extra').first();
    if(w<=390){
      await disclosure.locator('summary').click();
      if(!await disclosure.isVisible()||!(await disclosure.locator('.a05-extra-grid span').count()))
        throw Error('Additional scientific measurements missing from disclosure');
    }
    await page.screenshot({path:out+'/after-'+w+'x'+h+'-expanded-science.png'});
    results[w]={...(results[w]||{}),after:heights,svgHeight:sb.height,dockTop:db.y,dockBottom:db.y+db.height,readoutCount:metrics.filter(x=>x.display!=='none').length};
   }else{
    const metrics=await page.locator('.a05-visual>.a05-readouts>span').count();
    if(metrics!==4)throw Error('Baseline scene already changed unexpectedly');
    results[w]={...(results[w]||{}),before:heights};
   }
   await context.close();
  }
 }finally{server.kill('SIGTERM');}
}
try{
 await visit('before',beforeDir,isE?4207:4209);
 await visit('after',process.cwd(),isE?4208:4210);
 for(const {w} of sizes){
  if(w>390)continue;
  const old=results[w].before.page,now=results[w].after.page;
  if(now>=old-80)throw Error('Not enough mobile vertical reduction '+mode+' '+w+': '+old+'→'+now);
 }
 console.log('A08_V3_MOBILE_SCENE_CHROMIUM_PASS '+JSON.stringify({mode,results},null,2));
}finally{await browser.close();}
