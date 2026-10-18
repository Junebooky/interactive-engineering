import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const out='browser-evidence/a05-world-bounds',base='http://127.0.0.1:4188';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4188','--strictPort'],{stdio:['ignore','inherit','inherit']});
let pass=0;const errors=[];
const widths=[[1440,900],[390,844],[320,640]];
const runner=async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(let i=0;i<80;i++){try{if((await fetch(base+'/a05-world-bounds-preview.html')).ok)break}catch{}
   if(i===79)throw Error('Vite geometry preview unavailable');
   await new Promise(r=>setTimeout(r,220))}
  for(const [width,height] of widths){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
   const page=await context.newPage();page.setDefaultTimeout(11000);
   const jsErrors=[];page.on('pageerror',x=>jsErrors.push(String(x)));
   await page.goto(base+'/a05-world-bounds-preview.html',{waitUntil:'networkidle'});
   const ids=await page.locator('#scene option').evaluateAll(opts=>opts.map(el=>el.value));
   if(ids.length!==34)throw Error('expected 34 typed published science scene keys, found '+ids.length);
   for(const id of ids){
    await page.locator('#scene').selectOption(id);
    for(const variant of [false,true]){
     const tag=id+' / '+width+'x'+height+' / '+(variant?'B':'A');
     try{
      const button=page.locator('.a05-world-controls button');
      if((await button.getAttribute('aria-pressed'))!==String(variant))await button.click();
      await page.getByTestId('a05-world-slot').locator('svg [data-scene-subject]').first().waitFor({state:'visible',timeout:5000});
      const slot=page.getByTestId('a05-world-slot');
      const box=JSON.parse(await slot.getAttribute('data-framing'));
      const measured=await slot.locator('svg [data-scene-subject]').first().evaluate(el=>{
       const rect=el.getBBox();const svg=el.ownerSVGElement;const v=svg.viewBox.baseVal;
       const texts=el.querySelectorAll('text').length;
       return {x:rect.x,y:rect.y,width:rect.width,height:rect.height,
        view:{x:v.x,y:v.y,width:v.width,height:v.height},texts}
      });
      if(box.sceneId!==id||measured.view.width!==Number(box.defaultViewBox.split(' ')[2]))
       throw Error('wrong scene ID/world viewBox '+JSON.stringify({id,box,measured}));
      if(measured.width<65||measured.height<65||measured.texts===0)
       throw Error('group is empty/not semantic scientific SVG geometry '+JSON.stringify(measured));
      const m=box.stableBounds;
      if(measured.x<m.x-1||measured.y<m.y-1||measured.x+measured.width>m.x+m.width+1||
        measured.y+measured.height>m.y+m.height+1)
        throw Error('A05_STABLE_BOUNDS_CLIP '+JSON.stringify({id,measured,m}));
      const doc=await page.evaluate(()=>({s:document.documentElement.scrollWidth,c:document.documentElement.clientWidth}));
      if(doc.s>doc.c+1)throw Error('document overflow '+JSON.stringify(doc));
      if(jsErrors.length)throw Error('page JS '+JSON.stringify(jsErrors));
      if(width===1440)console.log('A05_INTERACTIVE_WORLD_BBOX '+id+' '+(variant?'B':'A')+' '+JSON.stringify(measured));
      const thumb=await slot.locator('svg').first().boundingBox();
      if(!thumb||thumb.width<230||thumb.height<90)throw Error('SVG thumbnail/crop slot '+JSON.stringify(thumb));
      if(!variant&&width===390)await page.screenshot({path:out+'/'+id+'-390.png',fullPage:true});
      if(!variant&&width===320&&['mosfet-field','elec-charge-current','mos14-oxide-field','dram-write','sram-6t-access','pn-band-gap','nand-threshold','gpu-compute-feeding'].includes(id))
       await page.screenshot({path:out+'/'+id+'-320.png',fullPage:true});
      pass++;
     }catch(e){errors.push({tag,reason:String(e)});console.error('FAIL '+tag,e)}
    }
   }
   await context.close();
  }
 }finally{await browser.close();server.kill('SIGTERM')}
};
try{await runner()}catch(e){errors.push({tag:'runner',reason:String(e)})}
console.log(JSON.stringify({passed:pass,failed:errors.length,failures:errors.slice(0,35),artifact:out},null,2));
if(errors.length)process.exitCode=1;
