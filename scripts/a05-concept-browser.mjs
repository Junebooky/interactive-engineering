import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const base='http://127.0.0.1:4188',out='browser-evidence/a05-concepts-p0';
await mkdir(out,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4188','--strictPort'],{stdio:['ignore','inherit','inherit']});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const items=[
 ['circuit-intro','전원·스위치·저항의 관계'],['ohms-intro','직류 측정 회로 구조'],
 ['pn-intro','P형·N형 실리콘 접합'],['mos-cap-intro','MOS 커패시터의 층 구조'],
 ['mosfet-intro','nMOS 트랜지스터 단면'],['dram-intro','DRAM 1T1C 셀 연결'],
 ['sram-intro','SRAM 6T 셀 연결'],['nand-intro','3D NAND 수직 스트링'],
 ['gpu-intro','GPU 연산과 외부 메모리'],['gears-intro','외접 기어 두 개의 기계적 맞물림']
];
const viewports=[[1440,900],[390,844],[320,640]];
let pass=0;const errors=[];
async function ready(){
 for(let i=0;i<80;i++){try{if((await fetch(base+'/a05-concepts-preview.html')).ok)return;}catch{} await new Promise(r=>setTimeout(r,280));}
 throw Error('concept vite server unavailable');
}
async function check(label,fn){try{await fn();pass++;console.log('PASS '+label);}catch(e){errors.push({label,error:String(e)});console.error('FAIL '+label,e);}}
async function overflow(page,w){
 const x=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
 if(x.scroll>x.client+1)throw Error('document horizontal overflow '+w+': '+JSON.stringify(x));
}
try{
 await ready();
 for(const [width,height] of viewports){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(8000);
  page.on('pageerror',e=>errors.push({label:'JS '+width,error:String(e)}));
  await page.goto(base+'/a05-concepts-preview.html');
  for(const [id,title] of items){
   await check(id+' '+width+'x'+height+' visible SVG, caption, aria, no answers and no overflow',async()=>{
    await page.getByRole('button',{name:title,exact:true}).click();
    const fig=page.getByTestId('a05-concept-stage');
    if(await fig.getAttribute('data-visual-id')!==id)throw Error('wrong domain geometry');
    const diagram=fig.locator('svg');
    if(!await diagram.isVisible())throw Error('SVG hidden');
    const aria=await diagram.getAttribute('aria-label');
    if(!aria?.includes(title)||!aria.includes('미표시')&&!aria.includes('미계산')&&!aria.includes('미계량')&&!aria.includes('비계량')&&!aria.includes('미정')&&!aria.includes('미표시'))throw Error('not safely scoped descriptive ARIA '+aria);
    const text=await fig.innerText();
    if(/학습 완료 증거|1234 FLOPS|10년 이상|출력 Q=1|VGS ≥ Vth/.test(text))throw Error('teacher answer / unsupported physical claim leaked');
    await overflow(page,width);
    const rect=await diagram.boundingBox();
    if(!rect||rect.width<260&&width>320||rect.height<120)throw Error('SVG clipped '+JSON.stringify(rect));
    const zoom=page.getByRole('button',{name:'구조 확대'});
    const button=await zoom.boundingBox();
    if(!button||button.width<44||button.height<44)throw Error('zoom touch target too small');
    await page.screenshot({path:out+'/'+id+'-'+width+'.png',fullPage:true});
   });
  }
  await check('keyboard zoom scroll containment '+width,async()=>{
   await page.getByRole('button',{name:'구조 확대'}).focus();
   await page.keyboard.press('Enter');
   if(await page.getByTestId('a05-concept-stage').getAttribute('data-zoomed')!=='true')throw Error('zoom not keyboard accessible');
   if(width<=390){
    const data=await page.getByTestId('a05-concept-scroll').evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth}));
    if(data.scroll<=data.client)throw Error('zoom stage cannot pan');
   }
   await overflow(page,width);
   await page.screenshot({path:out+'/zoom-'+width+'.png',fullPage:true});
   await page.getByRole('button',{name:'구조 원래 크기'}).click();
  });
  await context.close();
 }
 // A02 PR#73's LessonPlayer is wired to this pack in THIS A05 stacked branch.
 // Check actual app CONCEPT stages, not just standalone previews.
 const lessons=[
 ['electricity-rc-foundations','circuit-intro','course-semiconductor'],
 ['pn-doping-foundations','pn-intro','course-semiconductor'],
 ['mos-capacitor-foundations','mos-cap-intro','course-semiconductor'],
 ['semiconductor-mosfet-fundamentals','mosfet-intro','course-semiconductor'],
 ['lesson-dram','dram-intro','course-semiconductor'],
 ['lesson-sram','sram-intro','course-semiconductor'],
 ['nand-essd-storage-pipeline','nand-intro','course-semiconductor'],
 ['lesson-gpu','gpu-intro','course-semiconductor'],
 ];
 for(const [lesson,id,course] of lessons){
  await check('A02 real LessonPlayer CONCEPT route '+lesson+' -> '+id,async()=>{
   const context=await browser.newContext({viewport:{width:390,height:844}});
   const p=await context.newPage();
   await p.addInitScript(({course,lesson})=>{
    localStorage.clear();
    localStorage.setItem('ie_last_active_lesson',JSON.stringify({courseId:course,lessonId:lesson}));
   },{course,lesson});
   try{
    await p.goto(base+'/?lesson='+encodeURIComponent(lesson)+'&step=0',{waitUntil:'networkidle'});
    await p.getByTestId('a05-concept-stage').waitFor({state:'visible',timeout:9000});
    const actual=await p.getByTestId('a05-concept-stage').getAttribute('data-visual-id');
    if(actual!==id)throw Error('A02 concept mapped wrong '+actual+' instead of '+id);
    await overflow(p,390);
    await p.screenshot({path:out+'/app-concept-'+id+'-390.png',fullPage:true});
   }finally{await context.close()}
  });
 }
}finally{await browser.close();server.kill('SIGTERM');}
console.log(JSON.stringify({passed:pass,failed:errors,total:pass+errors.length,artifact:out},null,2));
if(errors.length)process.exitCode=1;
