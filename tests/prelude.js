// Deterministic environment + mock claude.db
(function(){
  const FIXED=Date.parse("2026-11-19T10:30:00Z");
  const RD=Date;
  function FD(...a){ if(!(this instanceof FD)) return new RD(FIXED).toString(); return a.length?new RD(...a):new RD(FIXED); }
  FD.prototype=RD.prototype; FD.now=()=>FIXED; FD.parse=RD.parse; FD.UTC=RD.UTC;
  window.Date=FD;
  let seed=12345; Math.random=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648;};
  window.setInterval=()=>0; // slide autoplay off
  const fixOpt=o=>o&&typeof o==="object"?Object.assign({},o,{behavior:"auto"}):o;
  const siv=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(o){return siv.call(this,fixOpt(o));};
  const sto=Element.prototype.scrollTo;Element.prototype.scrollTo=function(o,...r){return sto.call(this,fixOpt(o),...r);};
  const gc=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(t,...r){return /webgl/.test(t)?null:gc.call(this,t,...r);};
  window.__log=[]; window.__errs=[];
  window.addEventListener("error",e=>__errs.push(String(e.message)));
  window.addEventListener("unhandledrejection",e=>__errs.push("rej:"+String(e.reason&&e.reason.message||e.reason)));
  try{localStorage.clear();}catch{}
  const d=n=>{const x=new RD(FIXED);x.setDate(x.getDate()-n);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`;};
  window.__d=d;
  const jobs={
    j1:{company:"Acme",title:"Backend Developer",score:8.2,tier:"main",track:"Yazılım",mode:"Hybrid",location:"İstanbul",source:"LinkedIn",found:d(0),matched:"Java/Spring",experience:"0-2 yıl",url:"https://ex.com/1"},
    j2:{company:"Beta",title:"QA Engineer",score:5.4,tier:"near",track:"QA",mode:"Belirtilmemiş",location:"Ankara",source:"Kariyer.net",found:d(0),experience:"Belirtilmemiş",fav:true,favDate:d(1),note:"404 verdi"},
    j3:{company:"Gamma",title:"Business Analyst",score:7.1,track:"Analiz",mode:"Remote",location:"Türkiye",source:"LinkedIn",found:d(3),status:"applied",statusDate:d(3),steps:[{id:"s1",kind:"hr_screen",label:"İK ön görüşme",date:d(1),note:"iyi geçti"}]},
    j4:{company:"Delta",title:"Java Dev",score:6.5,track:"Yazılım",mode:"Onsite",location:"İstanbul",source:"Youthall",found:d(20),status:"applied",statusDate:d(19),steps:[{id:"s2",kind:"online_test",date:d(15)},{id:"s3",kind:"rejected",date:d(10)}]},
    j5:{company:"Eps",title:"Test Automation",score:6.0,track:"QA",mode:"Hybrid",location:"İzmir",source:"Indeed",found:d(40),status:"applied",statusDate:d(40),fav:true,favDate:d(30),steps:[{id:"s4",kind:"tech_interview",date:d(30)},{id:"s5",kind:"offer",date:d(25)}]},
    j6:{company:"Zeta",title:"RPA Analyst",score:6.8,track:"Analiz",mode:"Hybrid",location:"İstanbul",source:"LinkedIn",found:d(5),status:"skip",statusDate:d(4)},
    j7:{company:"Eta",title:"Data Person",track:"Veri",mode:"Remote",location:"İstanbul",source:"Referans",found:d(60),status:"applied",statusDate:d(60),manual:true,posted:"bilinmiyor"},
    j8:{company:"Theta",title:"Process Analyst",score:7.7,track:"Analiz",mode:"Hybrid",location:"İstanbul",source:"Şirket kariyer sitesi",found:d(10),status:"applied",statusDate:d(9),steps:[{id:"s6",kind:"other",label:"Telefon",date:d(7)},{id:"s7",kind:"withdrawn",date:d(6)}]},
    j9:{company:"Iota",title:"Junior Dev",score:9.1,track:"Yazılım",mode:"Remote",location:"Türkiye",source:"LinkedIn",found:d(2),fav:true,favDate:d(2)},
    j10:{company:"Kappa",title:"Integration Dev",score:6.3,track:"Yazılım",mode:"-",location:"İstanbul",source:"Kariyer.net",found:d(100),status:"applied",statusDate:d(100),steps:[{id:"s8",kind:"case",date:d(90)},{id:"s9",kind:"manager_interview",date:d(80)},{id:"s10",kind:"final_interview",date:d(70)}]},
    j11:{company:"Lambda",title:"QA Analyst",score:5.8,tier:"near",track:"QA",mode:"Hybrid",location:"İstanbul",source:"LinkedIn",found:d(0),note:"alakasız stack"},
    j12:{company:"Mu",title:"Backend Intern-ish",score:6.1,track:"Yazılım",mode:"Onsite",location:"Bursa",source:"Indeed",found:d(25),status:"applied",statusDate:d(24)},
  };
  const runs={[d(0)]:{date:d(0),newCount:3}};
  const listeners={jobs:[],runs:[]};
  const snap=(col)=>{const src=col==="jobs"?jobs:runs;let ids=Object.keys(src);if(col==="runs")ids=ids.sort().reverse().slice(0,1);
    return {metadata:{fromCache:false},docs:ids.map(id=>({id,data:()=>JSON.parse(JSON.stringify(src[id]))}))};};
  const fire=col=>setTimeout(()=>listeners[col].forEach(cb=>cb(snap(col))),0);
  const coll=name=>({onSnapshot(cb,err){listeners[name].push(cb);setTimeout(()=>cb(snap(name)),0);return ()=>{};},orderBy(){return this;},limit(){return this;}});
  const db={collection:coll,doc(p){const [c,id]=p.split("/");return {
    async update(data){__log.push(["update",id,JSON.parse(JSON.stringify(data))]);const t=(c==="jobs"?jobs:runs);t[id]=Object.assign({},t[id],data);fire(c);},
    async set(data){__log.push(["set",id.replace(/-[a-z0-9]+$/,"-TS"),JSON.parse(JSON.stringify(data))]);(c==="jobs"?jobs:runs)[id]=data;fire(c);}};}};
  window.claude={use:async k=>{if(k==="db")return db;throw Object.assign(new Error("no"),{code:"unavailable"});}};
})();
