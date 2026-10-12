// Página: botones de poses, cambio de sección al hacer scroll, copiar correo y arranque.
const chips=document.getElementById('chips');
for(const n of ORDER){const b=document.createElement('button');b.textContent=POSES[n].label;b.dataset.n=n;b.setAttribute('aria-pressed',n===cur);b.onclick=e=>{e.stopPropagation();go(n);};chips.appendChild(b);}
const st=document.getElementById('stage');st.addEventListener('click',next);
st.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();next();}if(e.key==='ArrowRight')next();});
tag.textContent=POSES[cur].label;
window.render=render;window.go=go;window.say=say;window.setMouth=m=>{mouth=m;};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
window.ready=(async()=>{await Promise.all(ORDER.map(prep));resize();
  // Poses que no cargaron: su botón queda deshabilitado; si falló la inicial, arranca con otra.
  for(const b of chips.children)b.disabled=!OK.has(b.dataset.n);
  if(!OK.has(cur)&&firstOk()){cur=firstOk();tag.textContent=POSES[cur].label;}
  if(!window.__manual){const t0=performance.now();const loop=n=>{render(reduce?9:(n-t0)/1000);requestAnimationFrame(loop);};requestAnimationFrame(loop);
    setTimeout(()=>say(POSES[cur].phrase),700);}})();

const secs=[...document.querySelectorAll('main section')];
let ready_=false;
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting&&ready_){document.body.dataset.s=e.target.dataset.s;go(e.target.dataset.pose);}});},{rootMargin:'-42% 0px -42% 0px'});
window.ready.then(()=>{ready_=true;secs.forEach(s=>io.observe(s));});
document.getElementById('otra').onclick=()=>next();
document.querySelectorAll('.row').forEach(r=>{const t=()=>go(r.dataset.pose,r.dataset.say);r.addEventListener('click',t);r.addEventListener('focus',t);
  r.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')t();});});
document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent='Copiado';}catch(_){const r=document.createRange();r.selectNodeContents(document.getElementById('mail'));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selecciona y copia';}setTimeout(()=>b.textContent='Copiar',1800);});
