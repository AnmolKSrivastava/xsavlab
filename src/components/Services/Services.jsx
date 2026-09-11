import React, { useEffect, useRef } from "react";
import { BriefcaseBusiness } from "lucide-react";

const SERVICES = [
//   {
//     label: "Trusted security partner",
//     title: <>Innovate with AI.<br /><span className="tint">Secure with confidence.</span></>,
//     description: "Comprehensive security solutions, cloud infrastructure management, and expert consulting to safeguard your digital assets and ensure business continuity.",
//     meta: [
//       "24/7 Security Operations Center",
//       "ISO 27001 & SOC 2 Certified",
//       "Zero Trust Architecture Specialists",
//     ],
//     overview: true,
//   },
  {
    label: "Service 01 — Cybersecurity",
    title: <>Cybersecurity<br /><span className="tint">services</span></>,
    description: "Comprehensive security solutions to protect your business from evolving cyber threats with 24/7 monitoring and expert response.",
    meta: [
      "Security assessment & penetration testing",
      "Managed security operations (SOC)",
      "Incident response & forensics",
      "Compliance management (ISO, GDPR, SOC 2)",
      "Security awareness training",
      "Vulnerability management",
    ],
  },
  {
    label: "Service 02 — Cloud",
    title: <>Cloud<br /><span className="tint">infrastructure</span></>,
    description: "Scalable and secure cloud solutions with DevOps automation, cost optimization, and enterprise-grade reliability.",
    meta: [
      "Cloud migration & strategy (AWS, Azure, GCP)",
      "DevOps & CI/CD implementation",
      "Infrastructure as Code (IaC)",
      "Cloud security & governance",
      "Disaster recovery & business continuity",
      "Performance optimization",
    ],
  },
  {
    label: "Service 03 — AI",
    amber: true,
    title: <>AI integration<br /><span className="tint-a">services</span></>,
    description: "Strategic AI implementation and custom automation solutions to enhance efficiency and drive business innovation.",
    meta: [
      "AI strategy & consulting",
      "Custom AI agent development",
      "Intelligent process automation",
      "Machine learning implementation",
      "AI security & risk management",
      "Natural language processing",
    ],
  },
  {
    label: "Service 04 — Web",
    title: <>Custom website<br /><span className="tint">development</span></>,
    description: "Professional web solutions tailored to your business needs, from corporate websites to complex web applications.",
    meta: [
      "Custom website design & development",
      "E-commerce & booking systems",
      "Progressive web apps (PWA)",
      "Responsive & mobile-first design",
      "SEO optimization & performance",
      "Content management systems (CMS)",
    ],
  },
  {
    label: "Service 05 — Software",
    amber: true,
    title: <>Enterprise software<br /><span className="tint-a">solutions</span></>,
    description: "Scalable, secure custom software solutions built to streamline operations and drive business growth.",
    meta: [
      "Custom business applications",
      "ERP & CRM system integration",
      "Workflow automation tools",
      "Database design & management",
      "API development & integration",
      "Legacy system modernization",
    ],
  },
  {
    label: "Reach",
    title: <>Serving multiple<br /><span className="tint">industries</span></>,
    description: "Specialised expertise across diverse sectors, delivered on enterprise-grade infrastructure from Microsoft Azure, Amazon Web Services, and Google Cloud Platform.",
    meta: [
      "Financial services",
      "Healthcare",
      "Retail & e-commerce",
      "Manufacturing",
      "Technology",
      "Government",
    ],
    reach: true,
  },
];

const LABELS = ["Cybersecurity", "Cloud", "AI", "Web", "Software", "Reach"];
// const TONES = [
//   // [[0.22, 0.74, 0.97], [1.0, 0.69, 0.13]],
//   [[0.22, 0.74, 0.97], [0.42, 0.86, 1.0]],
//   [[0.22, 0.74, 0.97], [0.55, 0.9, 1.0]],
//   [[1.0, 0.69, 0.13], [1.0, 0.85, 0.45]],
//   [[0.22, 0.74, 0.97], [0.6, 0.88, 1.0]],
//   [[1.0, 0.69, 0.13], [0.98, 0.55, 0.2]],
//   [[0.22, 0.74, 0.97], [1.0, 0.69, 0.13]],
// ];

const TONES = [
  [[0.22, 0.74, 0.97], [0.42, 0.86, 1.0]],
  [[0.22, 0.74, 0.97], [0.55, 0.9, 1.0]],
  [[0.22, 0.74, 0.97], [0.85, 0.94, 1.0]],
  [[0.22, 0.74, 0.97], [0.85, 0.94, 1.0]],
  [[0.22, 0.74, 0.97], [0.6, 0.88, 1.0]],
  [[0.22, 0.74, 0.97], [0.75, 0.9, 1.0]],
  [[0.22, 0.74, 0.97], [0.42, 0.86, 1.0]],
];

export default function Services() {
  const reelRef = useRef(null);
  const stageRef = useRef(null);
  const slidesRef = useRef(null);
  const navRef = useRef(null);
  const cueRef = useRef(null);

  useEffect(() => {
    const reel = reelRef.current;
    const stage = stageRef.current;
    const slides = Array.from(slidesRef.current?.querySelectorAll(".slide") || []);
    const nav = navRef.current;
    const cue = cueRef.current;
    if (!reel || !stage || !slides.length) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const COUNT = SERVICES.length;

    // Section is tall enough for one full viewport per service so normal page scroll drives progress
    reel.style.height = `${COUNT * 100}svh`;

    const M = {
      ident: () => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]),
      persp: (fov, a, n, f) => {
        const t = 1 / Math.tan(fov / 2), nf = 1 / (n - f);
        return new Float32Array([t/a,0,0,0, 0,t,0,0, 0,0,(f+n)*nf,-1, 0,0,2*f*n*nf,0]);
      },
      mul: (a, b) => {
        const o = new Float32Array(16);
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
          let s = 0;
          for (let k = 0; k < 4; k++) s += a[k*4+j] * b[i*4+k];
          o[i*4+j] = s;
        }
        return o;
      },
      trans: (x, y, z) => { const m = M.ident(); m[12]=x; m[13]=y; m[14]=z; return m; },
      rotX: (r) => { const c=Math.cos(r), s=Math.sin(r), m=M.ident(); m[5]=c; m[6]=s; m[9]=-s; m[10]=c; return m; },
      rotY: (r) => { const c=Math.cos(r), s=Math.sin(r), m=M.ident(); m[0]=c; m[2]=-s; m[8]=s; m[10]=c; return m; },
    };

    function rnd() { return Math.random(); }

    function shapeMark(N, out) {
      const quads = [
        [[-1, 1], [0, 1], [0, 0]], [[0, 1], [1, 1], [1, 0]],
        [[-1, 0], [0, 0], [0, -1]], [[0, 0], [1, 0], [1, -1]],
      ];
      for (let i = 0; i < N; i++) {
        const triangle = quads[i & 3];
        let r1 = rnd(); let r2 = rnd();
        if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2; }
        const x = triangle[0][0] + r1 * (triangle[1][0] - triangle[0][0]) + r2 * (triangle[2][0] - triangle[0][0]);
        const y = triangle[0][1] + r1 * (triangle[1][1] - triangle[0][1]) + r2 * (triangle[2][1] - triangle[0][1]);
        const depth = 0.17;
        out[i * 3] = x * 1.08;
        out[i * 3 + 1] = y * 1.08;
        out[i * 3 + 2] = rnd() < 0.72 ? (rnd() < 0.5 ? depth : -depth) : (rnd() * 2 - 1) * depth;
      }
    }

    function shapeShield(N, out) {
      for (let i = 0; i < N; i++) {
        const v = rnd();
        const y = 1.15 - v * 2.5;
        let w;
        if (y > 0.15) w = 0.95;
        else {
          const f = (0.15 - y) / 1.5;
          w = 0.95 * Math.sqrt(Math.max(0, 1 - f*f));
        }
        const x = (rnd()*2 - 1) * w;
        const edge = Math.sqrt(Math.max(0, 1 - (w ? (x/w)*(x/w) : 1)));
        const z = 0.42 * edge * (rnd() < 0.5 ? 1 : -1);
        out[i*3] = x; out[i*3+1] = y; out[i*3+2] = z;
      }
    }

    function shapeCloud(N, out) {
      const lobes = [
        [0.00,0.10,0.00,0.78],[-0.85,-0.05,0.10,0.55],[0.85,-0.02,-0.10,0.58],
        [-0.40,0.48,0.14,0.46],[0.42,0.44,-0.14,0.44],[1.35,-0.18,0.06,0.36],
        [-1.35,-0.20,-0.06,0.34],[0.05,-0.32,0.30,0.44],[0.00,0.62,0.00,0.34]
      ];
      for (let i = 0; i < N; i++) {
        const L = lobes[(Math.random()*lobes.length)|0];
        const u = rnd()*2 - 1, ph = rnd()*Math.PI*2, s = Math.sqrt(Math.max(0,1-u*u));
        out[i*3] = L[0] + Math.cos(ph)*s*L[3];
        out[i*3+1] = L[1] + u*L[3]*0.85;
        out[i*3+2] = L[2] + Math.sin(ph)*s*L[3];
      }
    }

    function shapeNeural(N, out) {
      const layers = 4, per = 7, nodes = [];
      for (let L = 0; L < layers; L++) for (let j = 0; j < per; j++) {
        const a = (j/per)*Math.PI*2 + L*0.4;
        nodes.push([(L/(layers-1)-0.5)*2.5, Math.cos(a)*(0.85+(L%2)*0.2), Math.sin(a)*(0.85+(L%2)*0.2)]);
      }
      for (let i = 0; i < N; i++) {
        if (i % 5 === 0) {
          const n = nodes[(Math.random()*nodes.length)|0];
          out[i*3]=n[0]+(rnd()-0.5)*0.14; out[i*3+1]=n[1]+(rnd()-0.5)*0.14; out[i*3+2]=n[2]+(rnd()-0.5)*0.14;
        } else {
          const Li=(Math.random()*(layers-1))|0;
          const a1=nodes[Li*per+((Math.random()*per)|0)], b1=nodes[(Li+1)*per+((Math.random()*per)|0)], t=rnd();
          out[i*3]=a1[0]+(b1[0]-a1[0])*t+(rnd()-0.5)*0.03;
          out[i*3+1]=a1[1]+(b1[1]-a1[1])*t+(rnd()-0.5)*0.03;
          out[i*3+2]=a1[2]+(b1[2]-a1[2])*t+(rnd()-0.5)*0.03;
        }
      }
    }

    function shapeScreen(N, out) {
      const W=1.55,H=1.02;
      for (let i=0;i<N;i++) {
        const r=rnd(); let x,y;
        if (r<0.26) {
          const e=(Math.random()*4)|0,t=rnd();
          if(e===0){x=-W+2*W*t;y=H;} else if(e===1){x=-W+2*W*t;y=-H;} else if(e===2){x=-W;y=-H+2*H*t;} else {x=W;y=-H+2*H*t;}
        } else if(r<0.40) {
          x=(rnd()*2-1)*W*0.94; y=H*0.74+(rnd()-0.5)*0.07;
        } else if(r<0.78) {
          const k=(Math.random()*3)|0; x=(-W*0.60+k*W*0.60)+(rnd()*2-1)*W*0.24; y=H*0.16+(rnd()*2-1)*H*0.30;
        } else {
          const L=(Math.random()*3)|0; x=-W*0.86+rnd()*W*(1.25-L*0.28); y=-H*0.46-L*0.19;
        }
        out[i*3]=x; out[i*3+1]=y; out[i*3+2]=(rnd()-0.5)*0.06;
      }
    }

    function shapeStack(N, out) {
      const slabs=[[-0.55,-0.30],[0.0,0.0],[0.55,0.30]], w=1.25,d=0.85,th=0.06;
      for(let i=0;i<N;i++){
        const S=slabs[i%slabs.length]; let x=(rnd()*2-1)*w+S[1]*0.5, z=(rnd()*2-1)*d;
        let y=S[0]+(rnd()<0.86?(rnd()<0.5?th:-th):(rnd()*2-1)*th);
        if(rnd()<0.22){ if(rnd()<0.5)x=(rnd()<0.5?-w:w)+S[1]*0.5; else z=(rnd()<0.5?-d:d); y=S[0]+(rnd()*2-1)*th; }
        out[i*3]=x; out[i*3+1]=y*1.5; out[i*3+2]=z;
      }
    }

    function shapeGlobe(N, out) {
      for(let i=0;i<N;i++){
        if(i%9===0){
          const a=rnd()*Math.PI*2, tilt=((i/9)|0)%3, rr=1.32+tilt*0.1;
          const cx=Math.cos(a)*rr,cy=Math.sin(a)*rr*0.25,cz=Math.sin(a)*rr,ta=tilt*0.7;
          out[i*3]=cx*Math.cos(ta)-cz*Math.sin(ta); out[i*3+1]=cy; out[i*3+2]=cx*Math.sin(ta)+cz*Math.cos(ta);
        }else{
          const u=rnd()*2-1,ph=rnd()*Math.PI*2,s=Math.sqrt(Math.max(0,1-u*u));
          out[i*3]=Math.cos(ph)*s*1.15; out[i*3+1]=u*1.15; out[i*3+2]=Math.sin(ph)*s*1.15;
        }
      }
    }

    const SHAPES=[shapeShield,shapeCloud,shapeNeural,shapeScreen,shapeStack,shapeGlobe];

    const V_MORPH =
      "attribute vec3 aA; attribute vec3 aB; attribute float aSeed;"+
      "uniform mat4 uProj,uView,uModel; uniform float uMix,uTime,uSize,uBurst;"+
      "varying float vSeed; varying float vDepth;"+
      "void main(){"+
      " vec3 p=mix(aA,aB,uMix);"+
      " vec3 dir=normalize(p+vec3(0.0001));"+
      " p+=dir*uBurst*(0.30+aSeed*0.55);"+
      " p+=0.009*vec3(sin(uTime*0.8+aSeed*31.0),cos(uTime*0.7+aSeed*27.0),sin(uTime*0.6+aSeed*19.0));"+
      " vec4 e=uView*uModel*vec4(p,1.0);"+
      " vDepth=-e.z; vSeed=aSeed; gl_Position=uProj*e;"+
      " gl_PointSize=uSize*(0.70+aSeed*0.55)*(5.2/max(vDepth,0.7));"+
      "}";

    const F_MORPH =
      "precision mediump float;"+
      "varying float vSeed; varying float vDepth;"+
      "uniform vec3 uC1,uC2; uniform float uOp;"+
      "void main(){"+
      " vec2 d=gl_PointCoord-vec2(0.5); float r2=dot(d,d);"+
      " if(r2>0.25) discard;"+
      " float a=smoothstep(0.25,0.15,r2);"+
      " vec3 c=mix(uC1,uC2,vSeed*vSeed);"+
      " float fog=clamp((11.0-vDepth)/8.5,0.0,1.0);"+
      " gl_FragColor=vec4(c,a*uOp*fog);"+
      "}";

    function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null;}
    function program(gl,v,f){const vs=shader(gl,gl.VERTEX_SHADER,v),fs=shader(gl,gl.FRAGMENT_SHADER,f);if(!vs||!fs)return null;const p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);return gl.getProgramParameter(p,gl.LINK_STATUS)?p:null;}
    function buffer(gl,data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return b;}
    function attrib(gl,p,name,b,size){const l=gl.getAttribLocation(p,name);if(l<0)return;gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,size,gl.FLOAT,false,0,0);}

    const gl=stage.getContext("webgl",{antialias:true,alpha:true,premultipliedAlpha:false})||stage.getContext("experimental-webgl",{antialias:true,alpha:true});
    if(!gl) return undefined;
    const pm=program(gl,V_MORPH,F_MORPH);
    if(!pm) return undefined;

    const wide=window.innerWidth;
    const N=wide>=1200?110000:wide>=800?60000:34000;
    const bufs=[];
    const tmp=new Float32Array(N*3);
    SHAPES.forEach(shape=>{shape(N,tmp);bufs.push(buffer(gl,tmp));});
    const seeds=new Float32Array(N);for(let i=0;i<N;i++)seeds[i]=Math.random();
    const bSeed=buffer(gl,seeds);
    const U={};["uProj","uView","uModel","uMix","uTime","uSize","uBurst","uC1","uC2","uOp"].forEach(k=>U[k]=gl.getUniformLocation(pm,k));
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.disable(gl.DEPTH_TEST);

    let dpr=1,mx=0,my=0,tx=0,ty=0,clock=0,current=-1,progress=0,shownIdx=0,mixT=0,burst=0,raf=0,ticking=false;

    function sizeStage(){
      const r=stage.getBoundingClientRect();if(!r.width||!r.height)return false;
      dpr=Math.min(window.devicePixelRatio||1,2);const w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);
      if(stage.width===w&&stage.height===h)return true;stage.width=w;stage.height=h;gl.viewport(0,0,w,h);return true;
    }

    function readProgress(){
      // Drive progress from real page scroll through the tall sticky section
      const rect = reel.getBoundingClientRect();
      const totalScrollable = reel.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) {
        progress = 0;
      } else {
        // When the top of the reel reaches the top of the viewport, progress = 0
        // When the bottom of the reel reaches the bottom of the viewport, progress = 1
        const scrolled = -rect.top;
        progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      }

      const f = progress * (COUNT - 1);
      const i = Math.min(COUNT - 2, Math.floor(f));
      const t = Math.max(0, Math.min(1, f - i));
      let e = t < 0.30 ? 0 : t > 0.80 ? 1 : (t - 0.30) / 0.50;
      e = e * e * (3 - 2 * e);
      shownIdx = i;
      mixT = e;
      burst = Math.sin(Math.PI * e) * 0.5;
      const active = e < 0.5 ? i : i + 1;
      if (active !== current) {
        current = active;
        slides.forEach((el, k) => el.classList.toggle("on", k === active));
        Array.from(nav?.querySelectorAll(".reel-dot") || []).forEach((d, k) =>
          d.setAttribute("aria-current", k === active ? "true" : "false")
        );
      }
      if (cue) cue.style.opacity = progress > 0.02 ? "0" : "1";
    }

    function drawStage(){
      const r=stage.getBoundingClientRect();if(r.bottom<0||r.top>window.innerHeight||!sizeStage())return;
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(pm);
      const aspect=stage.width/stage.height,wideLayout=r.width>=1024;
      gl.uniformMatrix4fv(U.uProj,false,M.persp(0.9,aspect,0.1,60));
      gl.uniformMatrix4fv(U.uView,false,wideLayout?M.trans(1.3,0,-4.5):M.trans(0,0.85,-5.9));
      const yaw=Math.sin(clock*0.22)*0.42+mx*0.5+progress*0.55;
      gl.uniformMatrix4fv(U.uModel,false,M.mul(M.rotY(yaw),M.rotX(-0.10+my*0.26)));
      attrib(gl,pm,"aA",bufs[shownIdx],3);attrib(gl,pm,"aB",bufs[Math.min(shownIdx+1,COUNT-1)],3);attrib(gl,pm,"aSeed",bSeed,1);
      const t1=TONES[shownIdx],t2=TONES[Math.min(shownIdx+1,COUNT-1)];
      const lerp=(a,b,k,i)=>a[i]+(b[i]-a[i])*k;
      gl.uniform3f(U.uC1,lerp(t1[0],t2[0],mixT,0),lerp(t1[0],t2[0],mixT,1),lerp(t1[0],t2[0],mixT,2));
      gl.uniform3f(U.uC2,lerp(t1[1],t2[1],mixT,0),lerp(t1[1],t2[1],mixT,1),lerp(t1[1],t2[1],mixT,2));
      gl.uniform1f(U.uMix,mixT);gl.uniform1f(U.uBurst,burst);gl.uniform1f(U.uTime,clock);gl.uniform1f(U.uSize,(r.width<800?2.6:1.95)*dpr);gl.uniform1f(U.uOp,r.width<800?0.9:0.95);
      gl.drawArrays(gl.POINTS,0,N);
    }

    // Nav dots jump the page scroll to the matching service
    nav?.replaceChildren();
    LABELS.forEach((name, i) => {
      const b = document.createElement("button");
      b.className = "reel-dot";
      b.setAttribute("aria-label", `Go to ${name}`);
      b.innerHTML = `<em>${String(i + 1).padStart(2, "0")}</em><i></i><u>${name}</u>`;
      b.addEventListener("click", () => {
        const totalScrollable = reel.offsetHeight - window.innerHeight;
        const targetY = reel.offsetTop + (i / (COUNT - 1)) * totalScrollable;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      });
      nav?.appendChild(b);
    });

    const onPointerMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        readProgress();
        ticking = false;
      });
    };

    const onResize = () => {
      reel.style.height = `${COUNT * 100}svh`;
      sizeStage();
      readProgress();
      if (reduce) drawStage();
    };

    if (window.matchMedia("(pointer: fine)").matches && !reduce) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    readProgress();
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      clock += dt;
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      readProgress();
      drawStage();
      raf = requestAnimationFrame(loop);
    };
    if (reduce) drawStage();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      bufs.forEach((b) => gl.deleteBuffer(b));
      gl.deleteBuffer(bSeed);
      gl.deleteProgram(pm);
    };
  }, []);

  return (
    <section
      className="reel"
      id="services"
      ref={reelRef}
      style={{ minHeight: '100svh' }}
    >
      <div className="reel-stage">
        <canvas ref={stageRef} aria-hidden="true" />
        <div className="reel-grade" aria-hidden="true" />
        <div className="reel-in">
          <div className="shell">
            <div className="services-page-label">
              <BriefcaseBusiness aria-hidden="true" />
              <span>Services</span>
            </div>
            <div className="slides" ref={slidesRef}>
              {SERVICES.map((service, index) => (
                <article className={`slide ${index === 0 ? "on" : ""}`} key={service.label}>
                  <p className={`eyebrow ${service.amber ? "amber" : ""}`}>{service.label}</p>
                  <h2 className="dsp">{service.title}</h2>
                  <p>{service.description}</p>
                  <div className="slide-meta">
                    {service.meta.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  {(service.overview || service.reach) && (
                    <div className="slide-actions">
                      <a
                        className="btn"
                        href={service.overview ? "mailto:contact@xsavlab.com?subject=Security%20assessment%20request" : "mailto:contact@xsavlab.com?subject=Consultation%20request"}
                      >
                        {service.overview ? "Request security assessment" : "Schedule consultation"}
                        <svg
                          className="arw"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          aria-hidden="true"
                        >
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </a>
                      {service.overview && <a className="btn ghost" href="#services">View services</a>}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
        <nav className="reel-nav" ref={navRef} aria-label="Showcase sections" />
        <div className="reel-cue" ref={cueRef} aria-hidden="true">
          <i />
          Scroll
        </div>
      </div>

      <style>{`
        :root {
          --void:#0B0F19; --void-2:#070B14; --panel:#0C1322; --panel-2:#101929;
          --line:#1B2740; --line-hot:#2B3E63; --signal:#38BDF8; --amber:#38bdf8;
          --ice:#F2F5FA; --slate:#93A6C4; --slate-dim:#5B6C89;
          --ui:"Playfair Display",Georgia,serif;
          --display:var(--ui); --sans:var(--ui); --mono:ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,monospace;
          --fs-label:.6875rem; --shell:1440px; --gut:clamp(18px,4vw,60px); --head:68px;
        }
        .reel,.reel *{box-sizing:border-box}
        .reel{position:relative;background:transparent;color:var(--ice);font-family:var(--sans);font-size:clamp(1rem,.5vw + .88rem,1.0625rem);line-height:1.62}
        .reel p{margin:0}
        .dsp{font-family:var(--display);font-weight:800;text-transform:uppercase;line-height:.9;letter-spacing:-.028em;margin:0;text-wrap:balance}
        .tint{color:var(--signal)}.tint-a{color:var(--amber)}
        .shell{width:100%;max-width:var(--shell);margin-inline:auto;padding-inline:var(--gut)}
        .services-page-label{display:inline-flex;align-items:center;gap:8px;margin-bottom:20px;padding:8px 14px;border:1px solid rgba(56,189,248,.3);border-radius:999px;background:rgba(56,189,248,.1);color:var(--signal);font-family:var(--sans);font-size:.875rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase}.services-page-label svg{width:16px;height:16px;flex:none}
        .eyebrow{font-family:var(--mono);font-size:var(--fs-label);letter-spacing:.22em;text-transform:uppercase;color:var(--signal);display:flex;align-items:flex-start;gap:12px;margin:0}
        .eyebrow::before{content:"";width:26px;height:2px;background:currentColor;flex:none;margin-top:.62em}
        .eyebrow.amber{color:var(--amber)}
        .reel-stage{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;align-items:center}
        .reel-stage>canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
        .reel-grade{position:absolute;inset:0;pointer-events:none;background:transparent}
        .reel-in{position:relative;z-index:3;width:100%;padding-top:var(--head)}
        .slides{position:relative}@media(min-width:1024px){.slides{max-width:46%}}
        .slide{position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-start;gap:20px;opacity:0;visibility:hidden;transform:translateY(26px);will-change:opacity,transform;transition:opacity .45s ease,transform .45s ease,visibility .45s}
        .slide.on{position:relative;opacity:1;visibility:visible;transform:none}
        .slide h2{font-size:clamp(2.1rem,4.6vw,4.2rem);max-width:100%;overflow-wrap:anywhere}
        .slide p{color:var(--slate);max-width:46ch}
        .slide-meta{display:flex;flex-wrap:wrap;gap:8px;width:100%}
        .slide-meta span{flex:0 1 auto;min-width:0;max-width:100%;border:1px solid var(--line-hot);border-radius:999px;background:rgba(7,11,20,.78);backdrop-filter:blur(6px);padding:8px 14px;font-family:var(--mono);font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ice);white-space:normal;overflow-wrap:anywhere;line-height:1.35;text-align:left}
        .slide-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:6px}
        .btn{--bg:var(--amber);--fg:#12100A;display:inline-flex;align-items:center;gap:10px;padding:13px 22px;background:var(--bg);color:var(--fg);border:2px solid var(--bg);border-radius:999px;font-family:var(--mono);font-size:.6875rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;text-decoration:none;cursor:pointer;white-space:nowrap;transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s ease,border-color .3s ease,color .3s ease}
        .btn:hover{transform:translateY(-2px);box-shadow:0 12px 34px -12px rgba(255,176,32,.8)}
        .btn .arw{transition:transform .35s cubic-bezier(.22,1,.36,1)}
        .btn:hover .arw{transform:translate(3px,-3px)}
        .reel-nav{position:absolute;right:clamp(22px,3.2vw,62px);top:50%;transform:translateY(-50%);z-index:4;display:none;flex-direction:column;gap:14px;align-items:flex-start}
        .reel-dot{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:44px;background:transparent;border:0;padding:0;cursor:pointer;color:var(--slate-dim);transition:color .25s ease}
        .reel-dot:hover{color:var(--ice)}
        .reel-dot em{display:none}
        .reel-dot i{width:16px;height:1px;background:currentColor;transition:width .3s cubic-bezier(.22,1,.36,1),height .3s ease,background .3s ease,box-shadow .3s ease}
        .reel-dot u{order:-1;width:0;overflow:hidden;text-decoration:none;white-space:nowrap;font-family:var(--mono);font-size:.56rem;letter-spacing:.12em;text-transform:uppercase;opacity:0;transition:width .3s cubic-bezier(.22,1,.36,1),opacity .2s ease}
        .reel-dot[aria-current="true"]{color:var(--amber)}
        .reel-dot[aria-current="true"] i{width:44px;height:2px;background:var(--amber);box-shadow:0 0 10px rgba(255,176,32,.55)}
        .reel-dot[aria-current="true"] u{width:88px;opacity:1}
        .reel-cue{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);z-index:4;display:flex;flex-direction:column;align-items:center;gap:8px;font-family:var(--mono);font-size:.5rem;letter-spacing:.24em;text-transform:uppercase;color:var(--slate-dim);transition:opacity .5s ease}
        .reel-cue i{width:2px;height:34px;background:linear-gradient(180deg,var(--amber),transparent);animation:drop 2.4s ease-in-out infinite}
        @keyframes drop{0%,100%{transform:scaleY(.3);transform-origin:top;opacity:.35}50%{transform:scaleY(1);transform-origin:top;opacity:1}}
        @media(min-width:720px){.reel-nav{display:flex}}
        @media(max-width:1023px){
          .reel-stage{align-items:flex-end}
          .reel-in{padding-top:calc(var(--head) + 12px);padding-bottom:clamp(26px,5vh,64px)}
          .reel-grade{background:transparent}
          .reel-cue{display:none}
          .slide{gap:11px}
          .slide h2{font-size:clamp(1.45rem,7vw,2.6rem)}
          .slide p{font-size:.875rem;line-height:1.5}
          .slide-actions{width:100%;gap:9px}
          .slide-actions .btn{flex:1 1 auto;justify-content:center;padding:12px 14px}
        }
        @media(max-width:700px){
          .slide-meta{gap:6px}
          .slide-meta span{padding:6px 10px;font-size:.65rem;letter-spacing:.07em;white-space:normal}
        }
        @media(max-width:400px){
          .slide h2{font-size:1.45rem}
          .slide p{font-size:.8125rem}
          .slide-actions{flex-direction:column}
        }
        @media(max-width:1023px) and (max-height:620px){
          .reel-in{padding-top:12px;padding-bottom:18px}.slide{gap:7px}.slide h2{font-size:clamp(1.3rem,5vw,2rem)}.slide p{font-size:.78rem;line-height:1.35}.slide-meta span{padding:4px 8px;font-size:.5rem}.slide-actions .btn{padding:9px 12px;font-size:.53rem}
        }
        @media(min-width:1900px){
          .reel{--shell:1720px;--gut:clamp(64px,6vw,132px)}.slides{max-width:48%}.slide{gap:26px}.slide h2{font-size:clamp(4.4rem,4.7vw,6rem)}.slide p{max-width:52ch;font-size:1.14rem}.slide-meta{gap:10px}.slide-meta span{padding:9px 16px;font-size:.7rem}.reel-nav{right:clamp(36px,4vw,84px)}
        }
        @media(prefers-reduced-motion:reduce){
          .reel-cue i{animation:none}
          .slide{transition:none}
        }
      `}</style>
    </section>
  );
}
