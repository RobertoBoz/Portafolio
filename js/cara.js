// Cara del personaje: boca al hablar y parpadeo, dibujados sobre el recorte.
// ---- cara: boca y parpadeo dibujados a mano sobre el recorte
function mouthPaths(m,hw){const w=hw;
  const P={
   media:[["f","#4a2228",`M ${-w} 0 Q 0 ${-w*.35} ${w} 0 Q ${w*.7} ${w*.55} 0 ${w*.65} Q ${-w*.7} ${w*.55} ${-w} 0 Z`],["s","#3b2a26",.2,`M ${-w*1.05} 0 Q ${-w*.5} ${-w*.4} 0 ${-w*.25} Q ${w*.5} ${-w*.4} ${w*1.05} 0`]],
   abierta:[["f","#4a2228",`M ${-w} 0 Q 0 ${-w*.4} ${w} 0 Q ${w*.85} ${w*1.1} 0 ${w*1.25} Q ${-w*.85} ${w*1.1} ${-w} 0 Z`],["f","#b5636a",`M ${-w*.5} ${w*.85} Q 0 ${w*.45} ${w*.5} ${w*.85} Q 0 ${w*1.25} ${-w*.5} ${w*.85} Z`],["s","#3b2a26",.2,`M ${-w*1.05} 0 Q ${-w*.5} ${-w*.45} 0 ${-w*.25} Q ${w*.5} ${-w*.45} ${w*1.05} 0`]],
   o:[["f","#4a2228",`M ${-w*.5} ${w*.45} A ${w*.5} ${w*.62} 0 1 0 ${w*.5} ${w*.45} A ${w*.5} ${w*.62} 0 1 0 ${-w*.5} ${w*.45} Z`],["s","#3b2a26",.16,`M ${-w*.56} ${w*.45} A ${w*.56} ${w*.68} 0 1 0 ${w*.56} ${w*.45} A ${w*.56} ${w*.68} 0 1 0 ${-w*.56} ${w*.45} Z`]]};
  return P[m].map(a=>a[0]=="f"?{f:a[1],p:new Path2D(a[2])}:{s:a[1],lw:a[2]*hw,p:new Path2D(a[3])});}
const MP={};
function drawFace(n,t,mouth,blink){
  const F=DATA[n].face;if(!F)return;const [cx,cy,hw]=F.m;
  if(mouth&&F.imgs){const q=F.imgs[mouth]||F.imgs.abierta;if(q.el)ctx.drawImage(q.el,q.x,q.y,q.w,q.h);}
  else if(mouth){ctx.save();ctx.translate(cx,cy);
    ctx.fillStyle=F.skin;ctx.beginPath();ctx.ellipse(0,hw*.3,hw*1.5,hw*.85,0,0,7);ctx.fill();
    const key=n+mouth;MP[key]=MP[key]||mouthPaths(mouth,hw);ctx.lineCap="round";
    for(const p of MP[key]){if(p.f){ctx.fillStyle=p.f;ctx.fill(p.p);}else{ctx.strokeStyle=p.s;ctx.lineWidth=p.lw;ctx.stroke(p.p);}}ctx.restore();}
  if(blink>.02){for(const [ex,ey,rx,ry] of F.e){ctx.save();ctx.translate(ex,ey);
    ctx.beginPath();ctx.ellipse(0,0,rx*1.04,ry*1.08,0,0,7);ctx.clip();
    const gr=ctx.createLinearGradient(0,-ry,0,ry);gr.addColorStop(0,"#b39a93");gr.addColorStop(1,"#8f7873");
    ctx.fillStyle=gr;ctx.fillRect(-rx*1.1,-ry*1.2,rx*2.2,ry*2.4*blink); // baja el párpado
    ctx.restore();ctx.save();ctx.translate(ex,ey);ctx.strokeStyle="#2a1d1a";ctx.lineWidth=Math.max(1.6,rx*.12);ctx.lineCap="round";
    const yy=-ry*1.2+ry*2.4*blink;ctx.beginPath();ctx.moveTo(-rx,yy-ry*.15);ctx.quadraticCurveTo(0,yy+ry*.35,rx,yy-ry*.15);ctx.stroke();ctx.restore();}}
}
const blinks=[1.1,4.4,4.65,8.2];
const lidAt=t=>{t%=10;let v=0;for(const b of blinks){const d=t-b;if(d>=0&&d<.26)v=Math.max(v,Math.sin(Math.PI*d/.26));}return v;};
