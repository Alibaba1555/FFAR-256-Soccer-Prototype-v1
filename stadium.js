// Solid stadium geometry in metres. Canvas projects and depth-sorts the faces,
// so the same model also runs offline on devices without WebGL.
(() => {
  const faces=[];
  function face(points, fill, stroke=null, width=1) {faces.push({points,fill,stroke,width});}
  function box(x,y,z,w,h,d,top,front,side) {
    const a=[x,y,z],b=[x+w,y,z],c=[x+w,y,z+d],e=[x,y,z+d];
    const lift=p=>[p[0],p[1]+h,p[2]];
    const A=lift(a),B=lift(b),C=lift(c),E=lift(e);
    face([a,b,B,A],front);face([e,c,C,E],front);
    face([a,e,E,A],side);face([b,c,C,B],side);face([A,B,C,E],top);
  }
  function line(points,color='#e1e8c5',width=1.4){face(points,null,color,width);}
  function boundary(x,z,X,Z){line([[x,.035,z],[X,.035,z],[X,.035,Z],[x,.035,Z],[x,.035,z]]);}
  box(-19,-1.8,-12,38,1.3,24,'#39574a','#263f34','#162e27');
  box(-18.8,-.5,-11.8,37.6,.48,23.6,'#5a705d','#81957c','#516a57');
  for(let i=0;i<12;i++){
    const x=-17+i*34/12;
    face([[x,0,-10],[x+34/12,0,-10],[x+34/12,0,10],[x,0,10]],i%2?'#518958':'#477d50');
  }
  boundary(-16.5,-9.5,16.5,9.5);
  line([[0,.035,-9.5],[0,.035,9.5]]);
  const circle=Array.from({length:81},(_,i)=>[2.6*Math.cos(i*Math.PI/40),.04,2.6*Math.sin(i*Math.PI/40)]);
  line(circle);
  for(const s of [-1,1]){
    boundary(s*16.5,-4.8,s*12,4.8);boundary(s*16.5,-2.6,s*14.7,2.6);
    const x=s*16.55,back=s*17.95;
    for(const z of [-2,2]){
      box(x-.07,0,z-.07,.14,2.25,.14,'#fcffeb','#e7e8ce','#b3bea4');
      line([[x,2.25,z],[back,1.68,z],[back,.05,z],[x,.05,z]],'#d1d9c5',1.1);
    }
    box(x-.07,2.16,-2.07,.14,.14,4.14,'#fffde6','#e7e8ce','#bcc6b4');
    for(let k=0;k<=12;k++){
      const z=-2+k/3;
      line([[back,.05,z],[back,1.68,z],[x,2.22,z]],'#c1cfb29c',.7);
    }
    for(let k=1;k<=5;k++)line([[back,k*1.68/5,-2],[back,k*1.68/5,2]],'#c1cfb29c',.7);
  }
  // Concrete terrace with two banks of individual seats and a centre aisle.
  for(let tier=0;tier<3;tier++){
    const z=-12.5-tier*.88,h=.55+tier*.56;
    for(let row=0;row<24;row++)
      box(-13.4+row*26.8/24,-.7,z,26.8/24,h+.7,.94,'#849083','#505f55','#405349');
    for(let n=-11;n<=11;n++)if(Math.abs(n)>1){
      const x=n*1.12;
      const color=(Math.abs(n)+tier)%5===0?'#ccb68b':'#699181';
      box(x-.39,h,z+.13,.78,.17,.56,color,'#476659','#345747');
      box(x-.39,h+.15,z+.09,.78,.44,.12,color,'#5e7c69','#40594b');
    }
  }
  for(const x of [-16,16]){
    box(x-.12,-.6,-11.4,.24,6.1,.24,'#bfcbc0','#81958b','#526b5d');
    box(x-1.1,5.5,-11.5,2.2,.65,.52,'#61786c','#40584e','#263c35');
    for(let n=0;n<4;n++)box(x-.98+n*.5,5.6,-10.98,.41,.4,.07,'#fff6cd','#fff2c5','#c8bd91');
  }
  // The turf and paint form
  // one surface layer, drawn before objects standing on it.
  const base=faces.splice(0,10),turf=faces.splice(0,12);
  const marks=faces.filter(f=>f.points.every(p=>p[1]===.035||p[1]===.04));
  const objects=faces.filter(f=>!marks.includes(f));
  window.drawStadium=function(canvas,tiltX,tiltZ) {
    const w=canvas.clientWidth,h=canvas.clientHeight;
    if(!w||!h)return null;
    const ratio=Math.min(devicePixelRatio||1,2);
    if(canvas.width!==Math.round(w*ratio)||canvas.height!==Math.round(h*ratio)){
      canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);
    }
    const ctx=canvas.getContext('2d');
    ctx.setTransform(ratio,0,0,ratio,0,0);
    const portrait=matchMedia('(max-width:570px)').matches;
    const yaw=portrait?1.49:-.13,elev=.74;
    const roll=tiltX*.125,pitch=tiltZ*.14;
    const scale=Math.min(w/(portrait?33:42),h/(portrait?38:26));
    function camera([x,y,z]){
      const a=x*Math.cos(roll)+y*Math.sin(roll),b=y*Math.cos(roll)-x*Math.sin(roll);
      const c=b*Math.cos(pitch)-z*Math.sin(pitch),d=b*Math.sin(pitch)+z*Math.cos(pitch);
      const horizontal=a*Math.cos(yaw)+d*Math.sin(yaw),depth=d*Math.cos(yaw)-a*Math.sin(yaw);
      const height=c*Math.cos(elev)-depth*Math.sin(elev),distance=depth*Math.cos(elev)+c*Math.sin(elev);
      const k=scale*88/(88-distance);
      return [w*.5+horizontal*k,h*.52-height*k,distance];
    }
    const bg=ctx.createRadialGradient(w*.5,h*.54,1,w*.5,h*.55,Math.max(w,h)*.64);
    bg.addColorStop(0,'#375345');bg.addColorStop(1,'#10291f');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    function draw(group){
      const projected=group.map(f=>{const pts=f.points.map(camera);return {f,pts,depth:pts.reduce((n,p)=>n+p[2],0)/pts.length};});
      projected.sort((a,b)=>a.depth-b.depth);
      for(const {f,pts} of projected){
        ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
        if(f.fill){ctx.closePath();ctx.fillStyle=f.fill;ctx.fill();}
        if(f.stroke){ctx.strokeStyle=f.stroke;ctx.lineWidth=f.width;ctx.stroke();}
      }
    }
    draw(base);draw(turf);draw(marks);draw(objects);
    return (u,v,y=0)=>camera([(u-.5)*34,y,(v-.5)*20]);
  };
})();
