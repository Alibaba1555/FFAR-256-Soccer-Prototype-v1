/* A projected 2D pitch, drawn in the browser without WebGL or a dependency.
   The same world coordinates drive the turf, nets, button hit targets and ball. */
(() => {
  'use strict';

  const roles = [
    { code: 'GK', name: 'Goalkeeper', u: .075, v: .50 },
    { code: 'LD', name: 'Left defender', u: .24, v: .22 },
    { code: 'RD', name: 'Right defender', u: .24, v: .78 },
    { code: 'LF', name: 'Left forward', u: .407, v: .24 },
    { code: 'RF', name: 'Right forward', u: .407, v: .76 }
  ];
  const teams = ['Green', 'Cream'];
  const spots = teams.flatMap((team, side) => roles.map(role => ({
    ...role, team, u: side ? 1 - role.u : role.u, v: side ? 1 - role.v : role.v
  })));
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function projection(w, h, vertical, miniature) {
    const corners = vertical ? [[.15,.14],[.048,.91],[.95,.885],[.85,.105]]
      : miniature ? [[.16,.29],[.79,.105],[.96,.68],[.24,.89]]
      : [[.14,.285],[.895,.18],[.975,.785],[.04,.895]];
    const [a,b,c,d] = corners;
    return (u, v, z = 0) => {
      const x = (a[0]*(1-u) + b[0]*u)*(1-v) + (d[0]*(1-u) + c[0]*u)*v;
      const y = (a[1]*(1-u) + b[1]*u)*(1-v) + (d[1]*(1-u) + c[1]*u)*v;
      return [x*w, (y - z*(.84 + .2*(vertical ? u : v)))*h];
    };
  }

  function renderTurf(canvas, options = {}) {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w*dpr);
    canvas.height = Math.round(h*dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.scale(dpr, dpr);
    const mini = !!options.mini;
    const project = projection(w,h,!!options.vertical,mini);
    const color = options.rental ? '#ffae71' : '#d9e8ba';

    function path(vertices, stroke, width = 1, fill = null, close = false) {
      ctx.beginPath();
      vertices.forEach((p,i) => {
        const point = project(...p);
        if (i === 0) ctx.moveTo(...point);
        else ctx.lineTo(...point);
      });
      if (close) ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.stroke(); }
    }
    function rect(u,v,U,V,z = 0) {
      return [[u,v,z],[U,v,z],[U,V,z],[u,V,z]];
    }
    function arc(cx,cy,rx,ry,a,b,stroke,width) {
      const pts = Array.from({length:45},(_,i) => {
        const angle = a+(b-a)*i/44;
        return [cx+Math.cos(angle)*rx,cy+Math.sin(angle)*ry];
      });
      path(pts,stroke,width);
    }

    if (!mini) {
      const glow = ctx.createRadialGradient(w*.5,h*.48,h*.08,w*.52,h*.53,w*.76);
      glow.addColorStop(0,'#254b36');
      glow.addColorStop(1,'#0b251b');
      ctx.fillStyle = glow;
      ctx.fillRect(0,0,w,h);
      ctx.save();
      ctx.shadowColor = '#08170f';
      ctx.shadowBlur = Math.min(18,h*.04);
      ctx.shadowOffsetY = 9;
      path(rect(-.018,-.026,1.018,1.026,-.019),null,0,'#163127',true);
      ctx.restore();
    }
    path(rect(-.032,-.046,1.032,1.046,-.02),null,0,'#0b241a',true);
    path(rect(-.032,-.046,1.032,1.046),'#52725a',mini ? .65 : 1,'#2b4d38',true);
    path(rect(-.012,-.017,1.012,1.017),null,0,'#366246',true);
    for (let i=0;i<12;i++) {
      const shades = options.rental ? ['#42764a','#497f50'] : ['#3a744a','#418052'];
      path(rect(i/12,0,(i+1)/12,1),null,0,shades[i%2],true);
    }
    if (!mini) {
      // Fixed stipple: the turf stays still as the viewport changes.
      let seed=437;
      const random=() => {seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296;};
      ctx.fillStyle='#d2eaaf26';
      for (let k=0;k<1650;k++) {
        const [x,y]=project(random(),random());
        ctx.fillRect(x,y,.9,.7);
      }
    }
    const line = mini ? .9 : 1.65;
    path(rect(.012,.019,.988,.981),color,line,null,true);
    path([[.5,.019],[.5,.981]],color,line);
    arc(.5,.5,.091,.148,0,Math.PI*2,color,line);
    for (const side of [0,1]) {
      const outer = side ? .988 : .012;
      const inner = side ? .858 : .142;
      const small = side ? .935 : .065;
      path([[outer,.25],[inner,.25],[inner,.75],[outer,.75]],color,line);
      path([[outer,.36],[small,.36],[small,.64],[outer,.64]],color,line);
    }
    const [cx,cy]=project(.5,.5);
    ctx.beginPath(); ctx.arc(cx,cy,mini?1:2.3,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();

    if (!mini) {
      // The far-side rebound board and mesh give scale to the shallow camera.
      const edge = options.vertical ? (t,z) => [-.027,t,z] : (t,z) => [t,-.04,z];
      path([edge(0,0),edge(1,0),edge(1,.027),edge(0,.027)],'#536b55',.7,'#36533e',true);
      path([edge(0,.094),edge(1,.094)],'#829680a6',1.3);
      for (let k=0;k<=60;k++) path([edge(k/60,.026),edge(k/60,.094)],k%10===0?'#a8b69a':'#84977d60',k%10===0?1.5:.55);
      for (const z of [.047,.068]) path([edge(0,z),edge(1,z)],'#84977d75',.7);
    }

    function goal(side) {
      const u=side ? .988 : .012, back=side ? 1.027 : -.027;
      const left=.39,right=.61,z=mini ? .07 : .08;
      path([[back,left,0],[back,right,0],[back,right,z*.77],[back,left,z*.77]],'#d4dec388',.8,'#bdc9aa23',true);
      if (!mini) {
        for (let k=0;k<=8;k++) {
          const v=left+(right-left)*k/8;
          path([[back,v,0],[back,v,z*.77],[u,v,z]],'#d0dbc099',.65);
        }
        for (let k=1;k<=3;k++) path([[back,left,z*.77*k/4],[back,right,z*.77*k/4]],'#d0dbc088',.7);
      }
      path([[back,left,z*.77],[u,left,z],[u,right,z],[back,right,z*.77]],'#e8eed3',mini ? .75 : 1.2);
      path([[u,left,0],[u,left,z],[u,right,z],[u,right,0]],'#fff8dd',mini?1:2);
    }
    goal(0); goal(1);
    if (mini && options.players) {
      spots.forEach((s,i) => {
        const [x,y]=project(s.u,s.v);
        const r=Math.max(1.4,Math.min(2.8,w*.012));
        ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fillStyle=options.players[i] ? (i<5?'#123a2d':'#f8efd4') : '#f19562';
        ctx.fill();ctx.strokeStyle='#e3ebc7';ctx.lineWidth=.65;ctx.stroke();
      });
    }
    return project;
  }

  class Lineup {
    constructor(scene, onSelect) {
      this.scene=scene;
      this.canvas=scene.querySelector('canvas');
      this.layer=scene.querySelector('#players');
      this.ball=scene.querySelector('#rolling-ball');
      this.onSelect=onSelect;
      this.observer=new ResizeObserver(() => this.draw());
      this.observer.observe(scene);
    }

    load(session, ticket) {
      this.session=session;
      this.ticket=ticket;
      this.selection=ticket?.spot ?? null;
      this.layer.replaceChildren();
      this.buttons=[];
      const rental=session.mode==='field';
      this.ball.hidden=rental;
      if (!rental) {
        spots.forEach((spot,i) => {
          const button=document.createElement('button');
          const kit=document.createElement('span');
          kit.className='kit';
          kit.setAttribute('aria-hidden','true');
          kit.append(document.createElement('b'));
          const label=document.createElement('span');
          label.className='player-name';
          button.append(kit,label);
          button.addEventListener('click',() => this.onSelect(i));
          this.buttons.push(button);
          this.layer.append(button);
        });
        this.paintPlayers();
      }
      this.draw();
    }

    paintPlayers() {
      this.buttons.forEach((button,i) => {
        const spot=spots[i], name=this.session.players[i];
        const owned=this.ticket?.spot===i;
        const selected=this.selection===i && !owned;
        const open=!name && !owned;
        let caption=name || (spot.code+' · Open');
        if (selected) caption=spot.code+' · YOU';
        if (owned) caption=spot.code+' · '+(this.ticket.name==='You' ? 'YOU' : this.ticket.name);
        button.className=['player',spot.team.toLowerCase(),open?'open':'occupied',selected?'selected':'',owned?'owned':''].join(' ');
        button.querySelector('b').textContent=selected || owned ? spot.code : (open ? '+' : spot.code);
        button.querySelector('.player-name').textContent=caption;
        const status=owned?this.ticket.name+', your booked spot':selected?'selected':open?'open spot':name+', spot taken';
        button.setAttribute('aria-label',spot.team+' team, '+spot.name+', '+status);
        button.setAttribute('aria-pressed',String(selected || owned));
        button.title=spot.team+' · '+spot.name+' · '+status;
      });
    }

    draw() {
      if (!this.session || !this.scene.clientWidth) return;
      this.project=renderTurf(this.canvas,{vertical:matchMedia('(max-width:570px)').matches,rental:this.session.mode==='field'});
      if (!this.project) return;
      this.buttons.forEach((btn,i) => {
        const [x,y]=this.project(spots[i].u,spots[i].v);
        btn.style.left=x+'px';btn.style.top=y+'px';
      });
      this.moveBall(false);
    }

    update(selection,ticket,animate=true) {
      this.selection=selection;
      this.ticket=ticket;
      this.paintPlayers();
      this.moveBall(animate);
    }

    moveBall(animate) {
      if (!this.project || this.ball.hidden) return;
      const spot=spots[this.selection];
      const [x,y]=spot ? this.project(spot.u,spot.v) : this.project(.5,.5);
      const moving=animate&&!reducedMotion();
      this.ball.style.transition=moving?'left .47s cubic-bezier(.23,.76,.28,1), top .47s cubic-bezier(.23,.76,.28,1)':'none';
      this.ball.style.left=(x+(spot?19:0))+'px';
      this.ball.style.top=(y+(spot?5:0))+'px';
      const face=this.ball.firstElementChild;
      face.getAnimations().forEach(a=>a.cancel());
      if (moving) face.animate([
        {transform:'translateY(0) rotate(0)'},{transform:'translateY(-8px) rotate(145deg)',offset:.46},{transform:'translateY(0) rotate(280deg)'}
      ],{duration:470,easing:'ease-out'});
    }
  }
  window.ClubPitch={spots,Lineup,renderTurf,reducedMotion};
})();
