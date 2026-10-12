// Avatar: canvas, carga de poses, transiciones y globo de diálogo.
const S=900, cv=document.getElementById('cv'), ctx=cv.getContext('2d'), bubble=document.getElementById('bubble'), tag=document.getElementById('tag');
let k=1;
function resize(){const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);cv.width=Math.round(r.width*d);cv.height=Math.round(r.height*d);k=cv.width/S;}
new ResizeObserver(resize).observe(cv);

const IMG={};
// Carga una pose. Si la imagen no llega (mala conexión, archivo faltante) no rompe nada:
// devuelve false y la pose queda fuera de OK, así que los botones y el scroll la saltan.
async function prep(n){
  const im=new Image();im.src=DATA[n].src;
  try{await im.decode();}catch(_){console.warn('No se pudo cargar la pose',n,DATA[n].src);return false;}
  const c=document.createElement('canvas');c.width=DATA[n].w;c.height=DATA[n].h;const g=c.getContext('2d');g.drawImage(im,0,0);
  if(BUST.has(n)){const h=c.height;g.globalCompositeOperation='destination-out';const gr=g.createLinearGradient(0,h*.82,0,h);
    gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,1)');g.fillStyle=gr;g.fillRect(0,h*.8,c.width,h*.2);}
  IMG[n]=c;
  const F=DATA[n].face;if(F&&F.imgs)for(const k in F.imgs){const q=F.imgs[k];if(q.el)continue;const e=new Image();e.src=q.src;try{await e.decode();q.el=e;}catch(_){}}
  OK.add(n);return true;
}
const firstOk=()=>ORDER.find(n=>OK.has(n));

// ---- estado y animación
let cur=ORDER[0],prev=null,tChange=-9,now=0,talking=false,mouth=null,pulse=0,pulseT=-9;
const spring=x=>x>=1?1:1-Math.exp(-6.5*x)*Math.cos(x*11);       // pop con rebote
function place(n){const d=DATA[n];const s=Math.min(S*.9/d.h,S*.46/d.w);return {s,x:S*.37,y:S*.965};}
function drawPose(n,t,a){            // a: {sc,sx,sy,alpha}
  const d=DATA[n],p=place(n),g=ctx;
  g.save();g.globalAlpha=a.alpha;
  if(!BUST.has(n)){g.fillStyle="rgba(40,30,20,.16)";g.beginPath();g.ellipse(p.x,p.y+4,d.w*p.s*.46*a.sc,10*a.sc,0,0,7);g.fill();}
  g.translate(p.x,p.y);
  const breath=Math.sin(t*2*Math.PI/3.4);
  g.rotate((Math.sin(t*2*Math.PI/6.8)*.5)*Math.PI/180+a.rot);
  g.scale(a.sc*a.sx*(1-.006*breath),a.sc*a.sy*(1+.012*breath));
  g.scale(p.s,p.s);g.translate(-d.w/2,-d.h);
  g.drawImage(IMG[n],0,0);
  if(n===cur&&a.alpha>.99){drawFace(n,t,mouth,lidAt(t));}
  g.restore();
}
function render(t){
  now=t;if(!IMG[cur])return;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.setTransform(k,0,0,k,0,0);
  const dt=t-tChange;
  
  const bounce=talking?Math.sin(Math.min(1,(t-pulseT)/.16)*Math.PI)*(t-pulseT<.16?1:0):0;
  if(prev&&dt<.16){const u=dt/.16;drawPose(prev,t,{sc:1-.12*u,sx:1+.08*u,sy:1-.1*u,alpha:1-u,rot:-.05*u});}
  else{prev=null;
    const u=Math.max(0,(dt-.16)/.5),e=spring(u);
    const sc=.82+.18*e;
    drawPose(cur,t,{sc:u<1?sc:1,sx:1+(u<1?(1-e)*-.06:0)+bounce*.012,sy:1+(u<1?(1-e)*.1:0)-bounce*.03,alpha:1,rot:0});}
}
// ---- habla
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let runId=0;
function shapeFor(c){c=c.toLowerCase();if('aá'.includes(c))return'abierta';if('oóuú'.includes(c))return'o';if('eéií'.includes(c))return'media';if(/[a-zñ]/.test(c))return Math.random()<.5?'media':null;return null;}
async function say(text){
  const id=++runId;talking=true;bubble.textContent='';bubble.classList.add('on');
  const hasFace=!!DATA[cur].face;
  for(const ch of text){if(id!==runId)return;bubble.textContent+=ch;
    if(hasFace)mouth=shapeFor(ch);
    if('aeiouáéíóú'.includes(ch.toLowerCase())||/[.!?]/.test(ch))pulseT=now;
    await sleep(/[.,!?…]/.test(ch)?240:58);}
  mouth=null;await sleep(1700);
  if(id===runId){bubble.classList.remove('on');talking=false;}
}
function go(n,text){
  if(!OK.has(n)){if(text)say(text);return;}   // pose sin imagen: solo habla, no cambia
  if(n===cur&&!prev){if(text)say(text);return;}
  runId++;mouth=null;talking=false;bubble.classList.remove('on');
  prev=cur;cur=n;tChange=now;
  setTimeout(()=>say(text||POSES[n].phrase),480);
}
function next(){                       // siguiente pose que sí cargó
  const i=ORDER.indexOf(cur);
  for(let j=1;j<=ORDER.length;j++){const n=ORDER[(i+j)%ORDER.length];if(OK.has(n))return go(n);}
}
