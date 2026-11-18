/* Davranış ve görünüm karşılaştırması: çalışma kopyasındaki sayfayı bir git sürümüyle (varsayılan HEAD) karşılaştırır.
   Kullanım: node tests/check.js [taban-sürüm]
   Her iki sürüm de sahte veritabanı ve sabit tarihle (tests/prelude.js) headless Chrome'da açılır, tests/scenario.js
   senaryoları çalışır; her senaryoda DOM, localStorage ve veritabanı yazımları, seçili senaryolarda her öğenin
   hesaplanmış stili ve kutusu kaydedilir. Üç pencere genişliğinde (375, 900, 1400) koşar; fark yoksa çıkış kodu 0. */
const fs=require("fs"),path=require("path"),cp=require("child_process"),os=require("os");
const ROOT=path.resolve(__dirname,".."),OUT=path.join(__dirname,".out"),ENTRY="ilan-radari.html";
const CHROME=process.env.CHROME||"C:/Program Files/Google/Chrome/Application/chrome.exe";
const WIDTHS=[[375,812],[900,1000],[1400,1000]];
/* claude.ai'nin sayfayı sardığı iskelet: [hidden] kuralı ve gövde varsayılanları canlıdaki gibi olsun */
const SKELETON=`<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style>`;

const reader=rev=>rev?f=>cp.execFileSync("git",["show",`${rev}:${f}`],{cwd:ROOT,encoding:"utf8",maxBuffer:1<<26}):f=>fs.readFileSync(path.join(ROOT,f),"utf8");
/* Sayfa ve başvurduğu yerel dosyalar (link href / script src) ayrı bir klasöre kopyalanır; sayfa onları gerçekten yükler */
function build(label,rev){
  const read=reader(rev),dir=path.join(OUT,label);fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
  const html=read(ENTRY);
  for(const m of html.matchAll(/<(?:link\b[^>]*\bhref|script\b[^>]*\bsrc)="(?![a-z]+:|\/\/)([^"]+)"/gi)){const f=m[1],dst=path.join(dir,f);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,read(f));}
  const page=`${SKELETON}<script>${fs.readFileSync(path.join(__dirname,"prelude.js"),"utf8")}</script></head><body>\n${html}\n<script>${fs.readFileSync(path.join(__dirname,"scenario.js"),"utf8")}</script></body></html>`;
  fs.writeFileSync(path.join(dir,"index.html"),page);
  return path.join(dir,"index.html");
}
function run(page,[w,h]){
  return new Promise((res,rej)=>{
    const ud=fs.mkdtempSync(path.join(os.tmpdir(),"irh-"));
    const p=cp.spawn(CHROME,["--headless=new","--disable-gpu","--no-first-run","--hide-scrollbars","--allow-file-access-from-files","--host-resolver-rules=MAP fonts.googleapis.com 0.0.0.0, MAP fonts.gstatic.com 0.0.0.0","--user-data-dir="+ud,`--window-size=${w},${h}`,"--virtual-time-budget=60000","--dump-dom","file:///"+page.replace(/\\/g,"/")]);
    let out="";p.stdout.on("data",d=>out+=d);
    const t=setTimeout(()=>p.kill(),240000);
    p.on("close",()=>{clearTimeout(t);fs.rmSync(ud,{recursive:true,force:true});
      const m=/id="__out" data-b64="([^"]+)"/.exec(out);
      if(!m) return rej(new Error(`çıktı yok: ${page} @${w}`));
      res(JSON.parse(Buffer.from(m[1],"base64").toString("utf8")));});
  });
}
/* Ortam zamanlamasına bağlı iki ayrıntı karşılaştırma dışı: gizlenen formdaki odak ve kaydırma izleyicisinin (rapor bölümleri listesi) seçtiği bölüm */
function norm(k,v){
  if(!v||typeof v!=="object") return v;
  v={...v};
  if(k==="20-cancel") v.active="X";
  if(v.wrap) v.wrap=v.wrap.replace(/(data-go="rs-[a-z]+") aria-current="(true|false)"/g,"$1");
  return v;
}
const PROPS_RE=/^[^|]*\| /;
function diff(a,b,tag){
  let bad=0;
  for(const k of new Set([...Object.keys(a),...Object.keys(b)])){
    const x=norm(k,a[k]),y=norm(k,b[k]);
    if(JSON.stringify(x)===JSON.stringify(y)) continue;
    bad++;
    /* Stil kayıtları (styles, styles__h, styles__f, styles__a) öğe ve özellik adıyla gösterilir */
    const sk=x&&y?Object.keys({...x,...y}).filter(s=>s.startsWith("styles")):[];
    const strip=o=>{const c={...o};sk.forEach(s=>delete c[s]);return JSON.stringify(c);};
    if(sk.length&&strip(x)===strip(y)){
      for(const s of sk){const xa=x[s]||[],ya=y[s]||[];let shown=0;
        for(let i=0;i<Math.max(xa.length,ya.length)&&shown<3;i++){if(xa[i]===ya[i])continue;shown++;
          const xs=(xa[i]||"").split(" | "),ys=(ya[i]||"").split(" | ");
          console.log(`  ${tag} ${k} ${s}: ${xs[0]}  ↔  ${ys[0]}`);
          const xv=(xs[1]||"").split("|"),yv=(ys[1]||"").split("|");
          xv.forEach((v,j)=>{if(v!==yv[j])console.log(`      ${PROP_NAMES[j]}: ${v}  →  ${yv[j]}`);});}}
      continue;
    }
    const xs=JSON.stringify(x)||"",ys=JSON.stringify(y)||"";let i=0;while(xs[i]===ys[i])i++;
    console.log(`  ${tag} ${k}\n    önce: …${xs.slice(Math.max(0,i-120),i+120)}\n    sonra: …${ys.slice(Math.max(0,i-120),i+120)}`);
  }
  return bad;
}
const PROP_NAMES=(()=>{const s=fs.readFileSync(path.join(__dirname,"scenario.js"),"utf8");return JSON.parse(/const PROPS=(\[[^\]]+\])/.exec(s)[1]);})();

(async()=>{
  const base=process.argv[2]||"HEAD";
  const pa=build("base",base),pb=build("work",null);
  const res=await Promise.all(WIDTHS.flatMap(w=>[run(pa,w),run(pb,w)]));
  let bad=0;
  WIDTHS.forEach((w,i)=>{
    const [a,b]=[res[2*i],res[2*i+1]],tag=`[${w[0]}px]`;
    for(const [o,l] of [[a,base],[b,"çalışma kopyası"]]){
      const errs=Object.entries(o).filter(([,v])=>v&&v.err).map(([k,v])=>k+": "+v.err);
      if(o.__errs?.length||o.__fatal||errs.length) console.log(`  ${tag} ${l} hataları:`,o.__errs,o.__fatal||"",errs);
    }
    bad+=diff(a,b,tag);
  });
  const n=Object.keys(res[0]).length;
  console.log(bad?`FARK VAR: ${bad} senaryo (${base} ↔ çalışma kopyası)`:`AYNI: ${n} senaryo × ${WIDTHS.length} genişlik (${base} ↔ çalışma kopyası)`);
  process.exit(bad?1:0);
})().catch(e=>{console.error(e);process.exit(2);});
