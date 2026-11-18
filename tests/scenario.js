(async()=>{
  const out={};const q=s=>document.querySelector(s);const qa=s=>[...document.querySelectorAll(s)];
  const tick=async(n=5)=>{for(let i=0;i<n;i++)await new Promise(r=>setTimeout(r,0));};
  const ls=()=>{const o={};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=localStorage.getItem(k);}}catch{}return o;};
  /* Görünüm kontrolü: bu senaryolarda her öğenin (ve ::before/::after) hesaplanmış stili ile kutusu da kaydedilir */
  const STYLE_AT=new Set(["00-initial","01-tab-applied-all","03-tag","03-ftoggle","04-csel-open","05-noteopen","06-kopt-other","06-del-arm","06-closed","07-skip11","07-fb-toggle","08-go","10-stats","12-viz-outcome-pie","12-viz-timeline-line","12-viz-timeline-cum","12-viz-breakdown-pie","12-pdfhost","12-viz-breakdown-table","13-empty","14-toggle","14-pdfbtn","20-track-other","20-save"]);
  const PROPS=["display","position","top","right","bottom","left","z-index","width","height","min-width","min-height","max-width","max-height","margin-top","margin-right","margin-bottom","margin-left","padding-top","padding-right","padding-bottom","padding-left","border-top-width","border-right-width","border-bottom-width","border-left-width","border-top-style","border-right-style","border-bottom-style","border-left-style","border-top-color","border-right-color","border-bottom-color","border-left-color","border-top-left-radius","border-top-right-radius","border-bottom-left-radius","border-bottom-right-radius","box-sizing","flex-direction","flex-wrap","flex-grow","flex-shrink","flex-basis","order","grid-template-columns","grid-template-rows","grid-template-areas","grid-auto-flow","grid-auto-columns","grid-row-start","grid-row-end","grid-column-start","grid-column-end","grid-area","row-gap","column-gap","align-items","align-self","justify-content","justify-items","overflow-x","overflow-y","color","background-color","background-image","opacity","visibility","font-family","font-size","font-weight","font-style","line-height","letter-spacing","font-variant-numeric","text-align","text-decoration-line","text-overflow","white-space","overflow-wrap","text-shadow","text-wrap","box-shadow","transform","transition-property","transition-duration","transition-timing-function","animation-name","animation-duration","animation-timing-function","cursor","outline-style","outline-width","outline-color","outline-offset","filter","backdrop-filter","list-style-type","vertical-align","content","fill","fill-opacity","stroke","stroke-width","stroke-linecap","stroke-linejoin","scrollbar-width","scrollbar-gutter","scroll-margin-top","scroll-snap-type","scroll-snap-align","user-select","pointer-events","resize","table-layout","border-collapse","overscroll-behavior-x","color-scheme","inset"];
  const styles=()=>{const res=[];const r1=v=>Math.round(v*10)/10;
    /* Geçiş ve animasyonlar yarıda yakalanmasın: hepsi son karelerine atlatılır */
    for(const a of document.getAnimations()){try{a.finish();}catch{}}
    for(const el of document.querySelectorAll("html,body,body *")){
      /* Görüntülenmeyen öğeler (gizli kapların içi) atlanır: görünüme etkileri yok, göründükleri senaryolarda zaten kaydedilirler */
      if(el.id==="__out"||el.closest("script,style,link,meta,title")||!el.getClientRects().length)continue;
      const cls=typeof el.className==="string"?el.className.trim().split(/\s+/).filter(c=>c&&!/^__[hfa]$/.test(c)):[];
      const key=el.tagName.toLowerCase()+(el.id?"#"+el.id:"")+(cls.length?"."+cls.join("."):"");
      const cs=getComputedStyle(el),b=el.getBoundingClientRect();
      res.push(key+" @"+[b.x,b.y,b.width,b.height].map(r1).join(",")+" | "+PROPS.map(p=>cs.getPropertyValue(p)).join("|"));
      for(const ps of ["::before","::after"]){const c=getComputedStyle(el,ps);if(c.content&&c.content!=="none"&&c.content!=="normal")res.push(key+ps+" | "+PROPS.map(p=>c.getPropertyValue(p)).join("|"));}
    }
    return res;};
  /* :hover, :focus-visible ve :active kuralları da karşılaştırılsın: her birinin yanına sözde sınıfı bir sınıfla
     (.__h, .__f, .__a; özgüllük aynı) değiştirilmiş ikizi eklenir. Seçili senaryolarda sınıf her öğeye takılıp stiller
     ayrıca kaydedilir ("her şey üzerinde" durumu gerçekçi değil ama iki sürümde aynı kuralları aynı sırayla sınar). */
  const PSEUDO=[[":hover","__h"],[":focus-visible","__f"],[":active","__a"]];
  const twin=list=>{for(let i=list.cssRules.length-1;i>=0;i--){const r=list.cssRules[i];
    if(r.selectorText==null){if(r.cssRules)twin(r);continue;}
    for(const [p,c] of PSEUDO) if(r.selectorText.includes(p)){const s=r.selectorText.split(p).join("."+c);list.insertRule(s+r.cssText.slice(r.selectorText.length),i+1);}}};
  const twinAll=()=>{for(const sh of document.styleSheets){try{twin(sh);}catch{}}};
  const STATE_AT=new Set(["00-initial","03-ftoggle","04-csel-open","06-kopt-other","07-fb-toggle","08-go","10-stats","12-viz-outcome-pie","14-toggle","20-track-other"]);
  /* select ve içindekiler hariç: sınıf değişimi açılır listenin MutationObserver'ını tetikleyip açık listeyi kapatırdı */
  const stateStyles=c=>{const els=[...document.querySelectorAll("html,body,body *")].filter(e=>!e.closest("select")&&e.id!=="__out");
    const bare=new Set(els.filter(e=>!e.hasAttribute("class")));
    els.forEach(e=>e.classList.add(c));const s=styles();
    els.forEach(e=>{e.classList.remove(c);if(bare.has(e))e.removeAttribute("class");});return s;};
  const cap=name=>{void document.body.offsetHeight;out[name]={wrap:q(".wrap").outerHTML,hash:location.hash,active:document.activeElement&&(document.activeElement.id||document.activeElement.outerHTML.slice(0,120)),ls:ls(),log:JSON.parse(JSON.stringify(__log))};
    if(STYLE_AT.has(name)) out[name].styles=styles();
    if(STATE_AT.has(name)) for(const [,c] of PSEUDO) out[name]["styles"+c]=stateStyles(c);};
  const click=s=>{const e=typeof s==="string"?q(s):s;if(!e)throw new Error("missing "+s);e.click();};
  const setSel=(id,v)=>{const e=document.getElementById(id);e.value=v;e.dispatchEvent(new Event("change",{bubbles:true}));};
  const run=async(name,fn)=>{try{await fn();await tick();cap(name);}catch(e){out[name]={err:String(e&&e.message||e)};}};
  try{
  await tick(10);twinAll();
  cap("00-initial");
  for(const s of ["applied","skip","all","new"]){
    for(const sc of ["week","all","run"]){await run(`01-tab-${s}-${sc}`,async()=>{click(`#seg-status button[data-v="${s}"]`);click(`#seg-scope button[data-v="${sc}"]`);});}
  }
  click(`#seg-scope button[data-v="all"]`);click(`#seg-status button[data-v="all"]`);
  for(const so of ["date-asc","score-desc","score-asc","date"]) await run(`02-sort-${so}`,()=>setSel("f-sort",so));
  await run("03-tag",()=>click(`#list button[data-fk="track"][data-fv="QA"]`));
  await run("03-tag-off",()=>click(`#list button[data-fk="track"][data-fv="QA"]`));
  await run("03-fav",()=>click(`#seg-fav button[data-v="yes"]`));
  await run("03-note",()=>{click(`#seg-fav button[data-v=""]`);click(`#seg-note button[data-v="yes"]`);});
  await run("03-nonote",()=>click(`#seg-note button[data-v="no"]`));
  await run("03-q",()=>{click(`#seg-note button[data-v=""]`);const i=q("#f-q");i.value="  java   ";i.dispatchEvent(new Event("input",{bubbles:true}));});
  await run("03-sel",()=>{const i=q("#f-q");i.value="";i.dispatchEvent(new Event("input",{bubbles:true}));setSel("f-mode","Hybrid");setSel("f-tier","near");});
  await run("03-unspec",()=>{click("#f-clear");click(`#list button[data-fk="mode"][data-fv="Belirtilmemiş"]`);});
  await run("03-prog",()=>{click("#f-clear");click(`#seg-status button[data-v="applied"]`);click(`#seg-prog button[data-v="yes"]`);});
  await run("03-clear",()=>click("#f-clear"));
  await run("03-ftoggle",()=>click("#f-toggle"));
  // custom select popup
  await run("04-csel-open",()=>click("#f-track-btn"));
  await run("04-csel-key",()=>{const p=q(".cpop");p.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowDown",bubbles:true}));p.dispatchEvent(new KeyboardEvent("keydown",{key:"q",bubbles:true}));});
  await run("04-csel-pick",()=>{q(".cpop").dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}));});
  await run("04-csel-esc",()=>{click("#f-sort-btn");q(".cpop").dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}));click("#f-clear");});
  // card actions
  click(`#seg-status button[data-v="all"]`);
  await run("05-noteopen",()=>click(`#list button[data-open="j1"]`));
  await run("05-notesave",async()=>{q(`textarea[data-note="j1"]`).value="  yeni not ";click(`#list button[data-save="j1"]`);await tick(10);});
  await run("05-noteclose",async()=>{click(`#list button[data-close="j1"]`);await tick(10);});
  await run("05-fav",async()=>{click(`#list button[data-fav="j1"]`);await tick(10);});
  await run("05-unfav",async()=>{click(`#list button[data-fav="j9"]`);await tick(10);});
  await run("05-status",async()=>{click(`#list button[data-id="j11"][data-s="applied"]`);await tick(10);});
  await run("05-status-back",async()=>{click(`#list button[data-id="j11"][data-s="applied"]`);await tick(10);});
  await run("05-skip",async()=>{click(`#list button[data-id="j2"][data-s="skip"]`);await tick(10);});
  await run("06-stepopen",()=>click(`#list button[data-stepopen="j3"]`));
  await run("06-kopt",()=>click(`#list button[data-kopt="tech_interview"][data-jid="j3"]`));
  await run("06-kopt-other",()=>{q("#st-note-j3").value="nott";q("#st-note-j3").dispatchEvent(new Event("input",{bubbles:true}));click(`#list button[data-kopt="other"][data-jid="j3"]`);});
  await run("06-add-empty",()=>click(`#list button[data-stepadd="j3"]`));
  await run("06-add",async()=>{q("#st-custom-j3").value="Vaka sunumu";q("#st-date-j3").value=__d(0);click(`#list button[data-stepadd="j3"]`);await tick(10);});
  await run("06-open-cancel",()=>{click(`#list button[data-stepopen="j12"]`);click(`#list button[data-stepcancel="j12"]`);});
  await run("06-del-arm",()=>click(`#list button[data-stepdel="j3"][data-sid="s1"]`));
  await run("06-del",async()=>{click(`#list button[data-stepdel="j3"][data-sid="s1"]`);await tick(10);});
  await run("06-closed",()=>{});
  // fallback
  await run("07-fallback",()=>{click(`#seg-status button[data-v="new"]`);click(`#seg-scope button[data-v="run"]`);click(`#list button[data-id="j1"][data-s="skip"]`);});
  await tick(10);await run("07-skip11",async()=>{click(`#list button[data-id="j11"][data-s="skip"]`);await tick(10);});
  await tick(10);cap("07-fallback-b");
  await run("07-fb-toggle",()=>click(`#list .fb-tg`));
  await run("07-fb-toggle2",()=>click(`#list .fb-tx`));
  await run("07-fb-prog",async()=>{for(const id of ["j2","j9"]){const b=q(`#list button[data-fav="${id}"]`);if(b){b.click();await tick(10);}}});
  await run("07-fb-prog-toggle",()=>{const b=q(`#list .fb-tg`);b&&b.click();});
  await run("07-widen",()=>{const b=q(`#list button[data-scope]`);b&&b.click();});
  // slides
  await run("08-slnext",()=>click("#sl-next"));
  await run("08-sldot",()=>click(`#sl-dots button[data-i="0"]`));
  await run("08-go",()=>{const b=q("#sl-track button[data-go]");b.click();});
  // stats
  await run("10-stats",()=>click("#pv"));
  for(const p of ["applied","reject","custom","full"]) await run(`11-preset-${p}`,()=>click(`#r-preset button[data-v="${p}"]`));
  await run("11-sec",()=>click(`#r-secs button[data-sec="funnel"]`));
  await run("11-sec2",()=>click(`#r-secs button[data-sec="funnel"]`));
  await run("11-steps0",()=>click(`#r-steps button[data-v="0"]`));
  await run("11-steps1",()=>click(`#r-steps button[data-v="1"]`));
  for(const [k,v] of [["outcome","pie"],["timeline","line"],["timeline","cum"],["breakdown","pie"],["outcome","bar"],["timeline","bar"]]) await run(`12-viz-${k}-${v}`,()=>click(`#report button[data-viz="${k}"][data-v="${v}"]`));
  await run("12-pdfhtml",()=>{out.pdf1=reportHtml(true);});
  /* PDF kopyasının açık tema stilleri: exportPdf'in kurduğu .pdfhost kabı elle kurulur, stiller kaydedilir, kap kaldırılır */
  try{const h=document.createElement("div");h.className="pdfhost";h.innerHTML=reportHtml(true);document.body.appendChild(h);await tick();cap("12-pdfhost");h.remove();}
  catch(e){out["12-pdfhost"]={err:String(e&&e.message||e)};}
  await run("12-viz-breakdown-table",()=>click(`#report button[data-viz="breakdown"][data-v="table"]`));
  await run("12-pdfhtml2",()=>{out.pdf2=reportHtml(true);});
  for(const p of ["30","90","custom","all"]) await run(`13-period-${p}`,()=>click(`#r-period button[data-v="${p}"]`));
  await run("13-custom-range",()=>{click(`#r-period button[data-v="custom"]`);const f=q("#r-from");f.value=__d(50);f.dispatchEvent(new Event("change",{bubbles:true}));const t=q("#r-to");t.value=__d(5);t.dispatchEvent(new Event("change",{bubbles:true}));});
  await run("13-origin",()=>{click(`#r-period button[data-v="all"]`);click(`#r-origin button[data-v="manual"]`);});
  await run("13-origin-auto",()=>click(`#r-origin button[data-v="auto"]`));
  await run("13-track",()=>{click(`#r-origin button[data-v=""]`);setSel("r-track","QA");});
  await run("13-source",()=>{setSel("r-track","");setSel("r-source","LinkedIn");});
  await run("13-empty",()=>{setSel("r-source","Referans");setSel("r-track","QA");});
  await run("13-nosecs",()=>{setSel("r-source","");setSel("r-track","");click(`#r-preset button[data-v="reject"]`);click(`#r-secs button[data-sec="outcome"]`);});
  await run("14-toggle",()=>{click(`#r-preset button[data-v="full"]`);click("#r-toggle");});
  await run("14-pdfbtn",()=>click("#r-pdf"));
  await run("14-title",()=>{const t=q("#r-title");t.value="Başlık <x>";t.dispatchEvent(new Event("input",{bubbles:true}));});
  await run("14-go",async()=>{click("#r-go");await tick(10);});
  await run("14-cancel",()=>click("#r-cancel"));
  await run("14-toc",()=>{const b=q(`#r-toc button[data-go="rs-outcome"]`);b&&b.click();});
  await run("15-back",()=>click("#st-back"));
  // manual add
  await run("20-open",()=>click("#add-open"));
  await run("20-empty",()=>click("#m-save"));
  await run("20-badurl",()=>{q("#m-company").value="Acme";q("#m-title").value="Backend Developer";q("#m-url").value="ftp://x";click("#m-save");});
  await run("20-dup",()=>{q("#m-url").value="https://ok.com/a";click("#m-save");});
  await run("20-track-other",()=>{click(`#m-track button[data-v="Diğer"]`);});
  await run("20-track-recent",()=>{const b=q(`#m-track-recent button[data-tv]`);b&&b.click();});
  await run("20-mode",()=>click(`#m-mode button[data-v="Remote"]`));
  await run("20-source",()=>setSel("m-source","__other"));
  await run("20-save",async()=>{q("#m-source-other").value="Discord";q("#m-note").value="not";click("#m-save");await tick(10);});
  await run("20-reopen",()=>click("#add-open"));
  await run("20-cancel",()=>click("#add-open"));
  await run("21-hash",async()=>{location.hash="istatistik";await tick(10);});
  await run("21-hash-add",()=>click("#add-open"));
  }catch(e){out.__fatal=String(e&&e.stack||e);}
  out.__errs=__errs;
  const s=JSON.stringify(out);
  const pre=document.createElement("pre");pre.id="__out";pre.setAttribute("data-b64",btoa(unescape(encodeURIComponent(s))));document.body.appendChild(pre);
})();
