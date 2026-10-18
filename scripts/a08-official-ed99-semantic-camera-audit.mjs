import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const OUT='browser-evidence/a08-camera-a02-ed99', SHA='ed99df7f66a80e8676f2b29b8f4e40a47788eaf3 (OFFICIAL A02 PR#73 native A05 groups integrated)';
const sizes=[['1440',1440,900],['390',390,844],['320',320,640]];
const scenes=[
 ['MOS','semiconductor-mosfet-fundamentals',1],
 ['CIRCUIT','electricity-rc-foundations',1],
 ['PN','pn-doping-foundations',1],
 ['MOS14','mos-capacitor-foundations',1],
 ['DRAM','lesson-dram',1],
 ['SRAM','lesson-sram',1],
 ['NAND','nand-essd-storage-pipeline',1],
 ['GPU','lesson-gpu',1],
 ['CONCEPT-ELEC','electricity-rc-foundations',0],
 ['CONCEPT-PN','pn-doping-foundations',0],
 ['CONCEPT-MOS14','mos-capacitor-foundations',0],
 ['CONCEPT-MOS','semiconductor-mosfet-fundamentals',0],
 ['CONCEPT-DRAM','lesson-dram',0],
 ['CONCEPT-SRAM','lesson-sram',0],
 ['CONCEPT-NAND','nand-essd-storage-pipeline',0],
 ['CONCEPT-GPU','lesson-gpu',0],
 ['CONCEPT-OHMS','circuits-ohms-law',0,'course-circuits'],
 ['CONCEPT-GEARS','mechanics-gears-transmission',0,'course-mechanics']
];
await mkdir(OUT,{recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4286','--strictPort'],{stdio:['ignore','inherit','inherit']});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
async function ready(){for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:4286/')).ok)return}catch{}await new Promise(r=>setTimeout(r,250))}throw Error('Vite unreachable')}
async function measure(page){
 return page.evaluate(()=>{
  const slot=document.querySelector('[data-scene-slot="true"]'),camera=document.querySelector('[data-scene-camera="true"]');
  if(!slot||!camera)throw Error('Official app SceneViewport absent');
  const rect=el=>{if(!el)return null;const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};
  const svg=[...slot.querySelectorAll('svg')].filter(x=>{const b=rect(x);return b.w>20&&b.h>20}).sort((a,b)=>{const x=rect(a),y=rect(b);return y.w*y.h-x.w*x.h})[0];
  const shapes=[],labels=[];
  if(svg){
   const world=svg.viewBox.baseVal;
   for(const el of svg.querySelectorAll('path,rect,polygon,polyline,line,circle,ellipse,text,use,image')){
    if(el.closest('defs,clipPath,mask,marker,pattern,symbol'))continue;
    const css=getComputedStyle(el);
    if(css.display==='none'||css.visibility==='hidden'||Number(css.opacity)===0)continue;
    try{
      const b=el.getBBox(),m=el.getScreenCTM();
      if(!m||b.w<0||b.width<=0||b.height<=0)continue;
      if(el.tagName.toLowerCase()==='rect'&&b.width>world.width*.94&&b.height>world.height*.94)continue;
      const pts=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>({x:x*m.a+y*m.c+m.e,y:x*m.b+y*m.d+m.f}));
      const x=Math.min(...pts.map(p=>p.x)),y=Math.min(...pts.map(p=>p.y));
      const maxX=Math.max(...pts.map(p=>p.x)),maxY=Math.max(...pts.map(p=>p.y));
      (el.tagName.toLowerCase()==='text'?labels:shapes).push({x,y,w:maxX-x,h:maxY-y});
    }catch{}
   }
  }
  const union=a=>a.length?{x:Math.min(...a.map(x=>x.x)),y:Math.min(...a.map(x=>x.y)),
    w:Math.max(...a.map(x=>x.x+x.w))-Math.min(...a.map(x=>x.x)),
    h:Math.max(...a.map(x=>x.y+x.h))-Math.min(...a.map(x=>x.y))}:null;
  const subject=union(shapes),label=union(labels),bounds=rect(slot),svgRect=rect(svg);
  const native=svg?.querySelector('g[data-scene-subject][data-scene-id]');
  const projected=(el)=>{
    try{
      const b=el.getBBox(),m=el.getScreenCTM();
      if(!m||!b.width||!b.height)return null;
      const pts=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>({x:x*m.a+y*m.c+m.e,y:x*m.b+y*m.d+m.f}));
      const x=Math.min(...pts.map(p=>p.x)),y=Math.min(...pts.map(p=>p.y));
      return {x,y,w:Math.max(...pts.map(p=>p.x))-x,h:Math.max(...pts.map(p=>p.y))-y};
    }catch{return null}
  };
  const nativeSubject=native?projected(native):null;
  const essentialLabels=native?union([...native.querySelectorAll('text')].map(projected).filter(Boolean)) : null;
  const nativeFill=nativeSubject?Math.min(nativeSubject.w/bounds.w,nativeSubject.h/bounds.h):null;
  const tools=rect(document.querySelector('.a03-lab-tools')),head=rect(document.querySelector('.a03-lab-top'));
  const phase=rect(document.querySelector('#scene-label'));
  const inCamera=[...slot.querySelectorAll('.a05-readouts,.a03-readouts,.a05-mobile-extra')].filter(el=>el.closest('[data-scene-camera="true"]')).length;
  const tinySvgText=svg?[...svg.querySelectorAll('text')].filter(el=>el.getClientRects().length)
    .map(el=>Math.min(el.getBoundingClientRect().height,parseFloat(getComputedStyle(el).fontSize)||999))
    .filter(Number.isFinite).sort((a,b)=>a-b)[0]??null:null;
  return {slot:bounds,svg:svgRect,subject,label,actualMinFit:subject?Math.min(subject.w/bounds.w,subject.h/bounds.h):null,
    metadataFill:slot.getAttribute('data-dominant-fill-ratio'),fitScale:camera.getAttribute('data-fit-scale'),
    inCamera,tools,head,phase,svgTextPx:tinySvgText,svgPaintedShapes:shapes.length,svgTextNodes:labels.length,
    nativeSubject,essentialLabels,nativeId:native?.getAttribute('data-scene-id')||null,nativeFill};
 });
}
function overlap(a,b){if(!a||!b)return 0;return Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y))}
async function contactSheet(viewport,rows){
 const ctx=await browser.newContext({viewport:{width:1860,height:1050}}),p=await ctx.newPage();
 const cards=[];
 for(const row of rows){
  const data=(await readFile(row.capture)).toString('base64');
  cards.push('<article><header>'+row.key+' · '+row.phase+'</header><img src="data:image/png;base64,'+data+'"><footer>Painted ratio: '+(row.actualMinFit===null?'N/A':(row.actualMinFit*100).toFixed(1)+'%')+' | A05 native: '+(row.nativeFill===null?'N/A':(row.nativeFill*100).toFixed(1)+'%')+' | metadata: '+row.metadataFill+' | '+row.flags.join(' / ')+'</footer></article>');
 }
 const css='*{box-sizing:border-box}body{margin:0;padding:14px;background:#eaf0ee;font:14px system-ui;color:#18303b}h1{font-size:20px}.grid{display:grid;grid-template-columns:repeat(3,600px);gap:10px}article{padding:8px;background:white;border-radius:9px}header{font-weight:bold;margin-bottom:6px}img{width:100%;height:235px;object-fit:contain;background:#102333}footer{font-size:11px;min-height:40px;overflow-wrap:anywhere}';
 await p.setContent('<html><head><style>'+css+'</style></head><body><h1>A08 real A02 app camera contact sheet '+viewport+' | HEAD '+SHA+'</h1><p>Same-sized SceneViewport slot for every scene at this viewport; SVG painted geometry measured via getBBox + getScreenCTM. A05 scientific grouping not yet approved.</p><div class="grid">'+cards.join('')+'</div></body></html>');
 await p.screenshot({path:path.join(OUT,'contact-sheet-'+viewport+'.png'),fullPage:true});
 await ctx.close();
}
try{
 await ready();
 for(const [name,w,h] of sizes){
  const selected=[];
  for(const [key,lesson,step,courseOverride] of scenes){
   const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,reducedMotion:'reduce'});
   const page=await ctx.newPage();page.setDefaultTimeout(7500);
   try{
    const courseId=courseOverride||'course-semiconductor';
    await page.addInitScript(({courseId,lesson,step})=>{
     localStorage.clear();
     localStorage.setItem('ie_last_active_lesson',JSON.stringify({courseId,lessonId:lesson}));
     localStorage.setItem('ie_progress_'+courseId+'_'+lesson,JSON.stringify({courseId,lessonId:lesson,
      currentStepIndex:step,completedStepIds:[],simulatorInputs:{},lastUpdated:Date.now()}));
    },{courseId,lesson,step});
    await page.goto('http://127.0.0.1:4286/?lesson='+lesson+'&step='+step,{waitUntil:'networkidle'});
    await page.locator('[data-scene-slot="true"]').waitFor();
    let phase='concept';
    if(step){
     phase='predict-only';
     if(await page.locator('.a03-phase-predict').count()&&await page.locator('.a03-choice').count()){
      await page.locator('.a03-choice').first().click();
      await page.locator('.a03-main-action').first().click();
      await page.locator('.a03-phase-observe').waitFor({timeout:5500});
      phase='observe';
     }
    }
    await page.waitForTimeout(130);
    const m=await measure(page),flags=[];
    if(!m.svg)flags.push('NO_SVG');
    // On the tested official A02 app, Ohm and Gear courses do not have a CONCEPT step;
    // their step index 0 is MANIPULATE and is NOT A05#78's published Concept screen.
    if(['CONCEPT-OHMS','CONCEPT-GEARS'].includes(key))flags.push('NO_PUBLISHED_CONCEPT_STEP_ON_A02_BASE');
    if(!m.nativeSubject)flags.push('A05_NATIVE_GROUP_MISSING');
    if(m.nativeFill!==null&&m.nativeFill<.60)flags.push('A05_NATIVE_FIT_BELOW_60');
    if(m.nativeSubject&&overlap(m.nativeSubject,m.slot)<m.nativeSubject.w*m.nativeSubject.h*.98)flags.push('A05_NATIVE_SUBJECT_CLIPPED');
    if(m.essentialLabels&&overlap(m.essentialLabels,m.slot)<m.essentialLabels.w*m.essentialLabels.h*.98)flags.push('A05_NATIVE_ESSENTIAL_LABEL_CLIPPED');
    if(m.actualMinFit!==null&&m.actualMinFit<.60)flags.push('SMALL_UNDER_60');
    if(m.inCamera)flags.push('READOUTS_SCALED_'+m.inCamera);
    if(overlap(m.tools,m.head)>0)flags.push('TOOL_HEADER_OVERLAP');
    if(overlap(m.tools,m.phase)>0)flags.push('TOOL_PHASE_OVERLAP');
    if(m.subject&&overlap(m.subject,m.slot)<m.subject.w*m.subject.h*.98)flags.push('SUBJECT_CLIP_RISK');
    if(m.label&&overlap(m.label,m.slot)<m.label.w*m.label.h*.98)flags.push('LABEL_CLIP_RISK');
    if(m.svgTextPx!==null&&m.svgTextPx<9)flags.push('TINY_SVG_FONT');
    if(step&&phase!=='observe')flags.push('OBSERVE_PHASE_MISSING');
    const capture=path.join(OUT,name+'-'+key.toLowerCase()+'-equal-stage.png');
    await page.locator('[data-scene-slot="true"]').screenshot({path:capture});
    if(['MOS','CIRCUIT','PN','MOS14','DRAM','SRAM','NAND','GPU','CONCEPT-MOS','CONCEPT-ELEC'].includes(key))
     await page.screenshot({path:path.join(OUT,name+'-'+key.toLowerCase()+'-app-viewport.png')});
    const row={viewport:name,key,lesson,phase,capture,flags,...m};
    selected.push(row);results.push(row);
    console.log('A08_SCENE_MEASURED '+JSON.stringify({viewport:name,key,phase,nativeFit:m.nativeFill,worldScene:m.nativeId,ratio:m.actualMinFit,proxy:m.metadataFill,flags}));
   }catch(e){
    const row={viewport:name,key,lesson,phase:'CAPTURE_ERROR',capture:null,flags:['CAPTURE_ERROR'],error:String(e).slice(0,420)};
    results.push(row);console.log('A08_SCENE_EXCEPTION '+JSON.stringify(row));
   }finally{await ctx.close()}
  }
  await contactSheet(name,selected);
 }
 await writeFile(path.join(OUT,'measurements.json'),JSON.stringify({officialAppSHA:SHA,
  method:'DOM-measured SVG painted geometry via getBBox+getScreenCTM, excluding full SVG background rect; optical proxy, NOT A05 approved semantic subject bounds',results},null,2));
 const report='# A08 camera contact sheet — official A02 PR #73 snapshot\n\n'+
  '- Exact A02 source HEAD: '+SHA+'. Independent A08 evidence branch; no official app code changed.\n'+
  '- 3 sheets from **official A02 PR#73 HEAD ed99df7f**: 8 interactive Observe families + 8 actual published CONCEPT routes + 2 Ohm/Gears Step 0 MANIPULATE legacy cases. The A05 pack defines 10 concepts, but only 8 are published as CONCEPT steps in the tested official app.\n'+
  '- Actual ratio = SVG painted shape union projected to browser pixels / measured true slot, fitting axis min(width ratio, height ratio). Full-canvas rect excluded. Still a geometry proxy, not a science-approved subject annotation.\n'+
  '- metadataFill is A02 authored theoretical value, not a measured number. Flag threshold 60% is A03 review alert, not automatic failure.\n'+
  '- A05 latest PR #78 10-concept pack has NOT been integrated into this official app SHA; contact sheet measures only rendered A02 snapshot.\n'+
  '- Native semantic group is projected real g[data-scene-subject][data-scene-id], plus its text/essential label bounds. Current A02 camera correctness still requires A03 visual approval and science label review; this test is A08 independent geometry evidence.\n'+
  '- Official HEAD is currently the tested exact `ed99df7f66a80e8676f2b29b8f4e40a47788eaf3`, not the earlier independent A08 overlay PR #84. No app source changes in this branch.\n'+
  '- No A03 UI_DESIGN_PASS claimed from an audit workflow success.\n\n'+
  '| Viewport | Scene | Phase | Painted graphic ratio | A05 native projected ratio | A02 proxy | Flags |\n|---|---|---|---:|---:|---:|---|\n'+
  results.map(x=>'| '+x.viewport+' | '+x.key+' | '+x.phase+' | '+(x.actualMinFit===undefined||x.actualMinFit===null?'N/A':(100*x.actualMinFit).toFixed(1)+'%')+
   ' | '+(x.nativeFill===null||x.nativeFill===undefined?'N/A':(100*x.nativeFill).toFixed(1)+'%')+' | '+(x.metadataFill??'N/A')+' | '+x.flags.join(', ')+' |').join('\n')+'\n';
 await writeFile(path.join(OUT,'REPORT.md'),report);
 const captured=results.filter(x=>x.capture).length,exceptions=results.filter(x=>x.flags.length).length;
 console.log('A08_REAL_CHROMIUM_CONTACT_SHEET_GENERATED '+JSON.stringify({testedHEAD:SHA,attempted:results.length,captured,exceptions,contactSheets:3}));
 if(captured<36)throw Error('Insufficient actual Chromium scenes captured: '+captured);
}finally{await browser.close();server.kill('SIGTERM')}
