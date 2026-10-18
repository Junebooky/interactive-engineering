// A03 V3 standalone DESIGN references; NOT official A02 React app.
import { chromium } from 'playwright';
import { resolve, join } from 'node:path';
import { mkdir } from 'node:fs/promises';
const output=resolve(process.cwd(),'design/reference-captures/a03-v3');
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 for(const item of [
  {file:'a03-v3-catalog.html',name:'catalog-desktop-1440.png',width:1440,height:1000},
  {file:'a03-v3-catalog.html',name:'catalog-mobile-390.png',width:390,height:844},
  {file:'a03-v3-mosfet-lesson.html',name:'lesson-desktop-1440.png',width:1440,height:900},
  {file:'a03-v3-mosfet-lesson.html',name:'lesson-mobile-390.png',width:390,height:844},
  {file:'a03-v3-mosfet-lesson.html',name:'lesson-mobile-320.png',width:320,height:640}
 ]){
  const ctx=await browser.newContext({viewport:{width:item.width,height:item.height},reducedMotion:'reduce',deviceScaleFactor:1});
  const page=await ctx.newPage();
  await page.goto(new URL('./'+item.file,import.meta.url).href);
  await page.evaluate(()=>document.fonts?.ready);
  const dims=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:window.innerWidth}));
  if(dims.width>dims.viewport+1)throw new Error('Horizontal overflow: '+item.name+' '+JSON.stringify(dims));
  if(item.file.includes('lesson')){
    const r=await page.evaluate(()=>{
      const lab=document.querySelector('.lab')?.getBoundingClientRect(), sheet=document.querySelector('.sheet')?.getBoundingClientRect();
      return {lab:lab?{bottom:lab.bottom}:null,sheet:sheet?{top:sheet.top}:null};
    });
    if(item.width<=390 && (!r.lab||!r.sheet||r.sheet.top<r.lab.bottom-1))throw new Error('Lab/sheet overlap: '+JSON.stringify(r));
  }
  await page.screenshot({path:join(output,item.name),fullPage:false});
  console.log('A03 standalone V3 DESIGN reference: '+item.name);
  await ctx.close();
 }
}finally{await browser.close()}
