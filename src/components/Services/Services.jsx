import React, { useEffect, useRef } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const LOGO_CYAN = [0.220, 0.741, 0.973]; // #38BDF8
const LOGO_CYAN_LIGHT = [0.55, 0.88, 1.0];
const TONES = [
  [LOGO_CYAN, LOGO_CYAN_LIGHT],
  [LOGO_CYAN, LOGO_CYAN_LIGHT],
  [LOGO_CYAN, LOGO_CYAN_LIGHT],
  [LOGO_CYAN, LOGO_CYAN_LIGHT],
  [LOGO_CYAN, LOGO_CYAN_LIGHT],
  [LOGO_CYAN, LOGO_CYAN_LIGHT],
];

export default function Services() {
  const navigate = useNavigate();
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

    function shapeSecure(N, out) {
      const top = 1.12;
      const shoulder = 0.28;
      const tip = -1.2;
      const maxW = 1.05;
      const lift = 0.12;
      const S = 0.9;

      // Flat crown → gently curved flanks → pointed tip
      function halfW(y) {
        if (y >= shoulder) return maxW;
        const t = Math.min(1, Math.max(0, (shoulder - y) / (shoulder - tip)));
        return maxW * Math.sqrt(Math.max(0, 1 - t * t));
      }

      for (let i = 0; i < N; i++) {
        const r = rnd();
        let x = 0;
        let y = 0;
        let z = 0;

        if (r < 0.48) {
          // Outer rim only — no face fill behind the lock
          const edgePick = rnd();
          if (edgePick < 0.16) {
            // Flat top edge
            x = (rnd() * 2 - 1) * maxW;
            y = top + (rnd() - 0.5) * 0.04;
            z = rnd() < 0.5 ? 0.14 : -0.14;
          } else if (edgePick < 0.88) {
            y = tip + rnd() * (top - tip);
            const side = rnd() < 0.5 ? -1 : 1;
            x = side * (halfW(y) - rnd() * 0.045);
            z = rnd() < 0.5 ? 0.15 : -0.15;
          } else {
            x = (rnd() - 0.5) * 0.1;
            y = tip + rnd() * 0.1;
            z = rnd() < 0.5 ? 0.12 : -0.12;
          }
        } else if (r < 0.58) {
          // Inner rim (edge only)
          y = tip + 0.12 + rnd() * (top - tip - 0.22);
          const side = rnd() < 0.5 ? -1 : 1;
          x = side * halfW(y) * 0.88;
          z = rnd() < 0.5 ? 0.09 : -0.09;
        } else if (r < 0.8) {
          // Padlock body
          const bw = 0.4;
          const bh = 0.36;
          const bx = 0;
          const by = -0.02;
          const pick = rnd();
          if (pick < 0.72) {
            x = bx + (rnd() * 2 - 1) * bw * 0.92;
            y = by + (rnd() * 2 - 1) * bh * 0.92;
            z = 0.1 + (rnd() - 0.5) * 0.03;
          } else {
            const e = (Math.random() * 4) | 0;
            const t = rnd();
            if (e === 0) {
              x = bx - bw + 2 * bw * t;
              y = by + bh;
            } else if (e === 1) {
              x = bx - bw + 2 * bw * t;
              y = by - bh;
            } else if (e === 2) {
              x = bx - bw;
              y = by - bh + 2 * bh * t;
            } else {
              x = bx + bw;
              y = by - bh + 2 * bh * t;
            }
            z = 0.12;
          }
        } else if (r < 0.94) {
          // Padlock shackle
          const a0 = 0.15;
          const a1 = Math.PI - 0.15;
          const a = a0 + rnd() * (a1 - a0);
          const rad = 0.32 + (rnd() - 0.5) * 0.05;
          const thick = (rnd() - 0.5) * 0.07;
          x = Math.cos(a) * (rad + thick);
          y = 0.36 + Math.sin(a) * (rad * 0.95 + thick * 0.5);
          z = 0.11 + (rnd() - 0.5) * 0.02;
          if (rnd() < 0.22) {
            const side = rnd() < 0.5 ? -1 : 1;
            x = side * 0.32 + (rnd() - 0.5) * 0.05;
            y = 0.18 - rnd() * 0.26;
            z = 0.11;
          }
        } else {
          // Keyhole
          if (rnd() < 0.55) {
            const a = rnd() * Math.PI * 2;
            const rad = rnd() * 0.09;
            x = Math.cos(a) * rad;
            y = 0.06 + Math.sin(a) * rad;
            z = 0.14;
          } else {
            x = (rnd() - 0.5) * 0.08;
            y = -0.08 - rnd() * 0.18;
            z = 0.14;
          }
        }

        out[i * 3] = x * S;
        out[i * 3 + 1] = (y + lift) * S;
        out[i * 3 + 2] = z * S;
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

    const SHAPES=[shapeSecure,shapeCloud,shapeNeural,shapeScreen,shapeStack,shapeGlobe];

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

    let dpr=1,mx=0,my=0,tx=0,ty=0,clock=0,current=-1,progress=0,shownIdx=0,mixT=0,burst=0,raf=0,ticking=false,settleT=0;

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
        settleT = 0; // face front on each new section, then sway
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
      // Front-facing on section entry, then ease into sway (dampen during morph)
      const settle=Math.min(1,settleT/1.35);
      const settleEase=settle*settle*(3-2*settle);
      const morphDamp=1-Math.sin(Math.PI*mixT)*0.9;
      const amp=settleEase*morphDamp;
      const yaw=Math.sin(clock*0.22)*0.42*amp+mx*0.45*amp;
      const pitch=(-0.08+my*0.22)*amp;
      gl.uniformMatrix4fv(U.uModel,false,M.mul(M.rotY(yaw),M.rotX(pitch)));
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
      settleT += dt;
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
      className="services-reel"
      id="services"
      ref={reelRef}
      style={{ minHeight: '100svh' }}
    >
      <div className="shell services-section-header">
        <div className="services-page-label">
          <BriefcaseBusiness aria-hidden="true" className="w-4 h-4" />
          <span>Services</span>
        </div>
        <h2 className="services-section-title">
          Securing Growth And Innovation With
          <span className="tint"> Expert Services</span>
        </h2>
        <p className="services-section-lede">
          From cybersecurity and cloud to AI and custom software, we design and deliver
          solutions that protect your business and accelerate growth.
        </p>
      </div>
      <div className="reel-stage">
        <canvas ref={stageRef} aria-hidden="true" />
        <div className="reel-grade" aria-hidden="true" />
        <div className="reel-in">
          <div className="shell">
            <div className="slides" ref={slidesRef}>
              {SERVICES.map((service, index) => (
                <article className={`slide ${index === 0 ? "on" : ""}`} key={service.label}>
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
                        href="/contact"
                        onClick={(event) => {
                          event.preventDefault();
                          navigate("/contact");
                        }}
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
        .services-reel {
          --void:#0B0F19; --void-2:#070B14; --panel:#0C1322; --panel-2:#101929;
          --line:#1B2740; --line-hot:#2B3E63; --signal:#38BDF8; --amber:#38bdf8;
          --ice:#F2F5FA; --slate:#93A6C4; --slate-dim:#5B6C89;
          --ui:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;
          --display:var(--ui); --sans:var(--ui); --mono:var(--ui);
          --fs-label:.875rem; --shell:1440px; --gut:clamp(18px,4vw,60px); --head:68px;
        }
        .services-reel,.services-reel *{box-sizing:border-box}
        .services-reel{position:relative;background:transparent;color:var(--ice);font-family:var(--sans);font-size:clamp(1rem,.5vw + .88rem,1.0625rem);line-height:1.62}
        .services-reel p{margin:0}
        .services-reel .dsp{font-family:inherit;font-weight:700;text-transform:none;line-height:1.15;letter-spacing:normal;margin:0;text-wrap:balance}
        .services-reel .tint{color:var(--signal)}.services-reel .tint-a{color:var(--amber)}
        .services-reel .shell{width:100%;max-width:var(--shell);margin-inline:auto;padding-inline:var(--gut)}
        .services-reel .services-section-header{display:flex;flex-direction:column;align-items:center;text-align:center;padding-block:clamp(64px,8vw,96px) clamp(32px,4vw,48px);margin-bottom:0;max-width:var(--shell)}
        .services-reel .services-page-label{display:inline-flex;align-items:center;gap:8px;margin:0 0 1.5rem;padding:8px 16px;border:1px solid rgba(56,189,248,.3);border-radius:999px;background:rgba(56,189,248,.1);color:#38BDF8;font-family:inherit;font-size:.875rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase}
        .services-reel .services-page-label svg{width:16px;height:16px;flex:none;color:#38BDF8}
        .services-reel .services-section-title{margin:0 0 1.5rem;font-size:clamp(2.25rem,5vw,3rem);font-weight:700;line-height:1.2;letter-spacing:normal;text-transform:none;color:#fff;text-wrap:balance;max-width:none;white-space:normal}
        @media (min-width:1024px){.services-reel .services-section-title{white-space:nowrap;font-size:2.75rem}}
        .services-reel .services-section-lede{margin:0 auto;max-width:48rem;color:#d1d5db;font-size:1.25rem;line-height:1.625}
        .services-reel .eyebrow{font-family:inherit;font-size:.75rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--signal);display:inline-flex;align-items:center;gap:8px;margin:0;padding:6px 12px;border-radius:999px;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.3)}
        .services-reel .eyebrow::before{display:none}
        .services-reel .eyebrow.amber{color:var(--amber)}
        .services-reel .eyebrow-spacer{display:none}
        .services-reel .reel-stage{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;align-items:center}
        .services-reel .reel-stage>canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
        .services-reel .reel-grade{position:absolute;inset:0;pointer-events:none;background:transparent}
        .services-reel .reel-in{position:relative;z-index:3;width:100%;padding-top:0;padding-bottom:0;display:flex;align-items:center;min-height:100%}
        .services-reel .slides{position:relative;width:100%}
        @media(min-width:1024px){
          .services-reel .reel-in{min-height:calc(100svh - 5rem)}
          .services-reel .slides{max-width:46%;display:flex;align-items:center}
          .services-reel .slide.on{width:100%}
        }
        .services-reel .slide{position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:20px;opacity:0;visibility:hidden;transform:translateY(26px);will-change:opacity,transform;transition:opacity .45s ease,transform .45s ease,visibility .45s}
        .services-reel .slide.on{position:relative;opacity:1;visibility:visible;transform:none}
        .services-reel .slide h2{font-size:clamp(2.25rem,4vw,3rem);line-height:1.15;max-width:100%;overflow-wrap:anywhere}
        .services-reel .slide p{color:#d1d5db;max-width:48ch;font-size:1.25rem;line-height:1.625}
        .services-reel .slide-meta{display:flex;flex-wrap:wrap;gap:8px;width:100%}
        .services-reel .slide-meta span{flex:0 1 auto;min-width:0;max-width:100%;border:1px solid rgba(55,65,81,.5);border-radius:.5rem;background:rgba(31,41,55,.4);backdrop-filter:blur(6px);padding:10px 17px;font-family:inherit;font-size:.875rem;font-weight:500;letter-spacing:normal;text-transform:none;color:#9ca3af;white-space:normal;overflow-wrap:anywhere;line-height:1.4;text-align:left}
        .services-reel .slide-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:6px}
        .services-reel .btn{--bg:var(--amber);--fg:#0B0F19;display:inline-flex;align-items:center;gap:10px;padding:12px 24px;background:var(--bg);color:var(--fg);border:1px solid var(--bg);border-radius:.5rem;font-family:inherit;font-size:.875rem;font-weight:600;letter-spacing:normal;text-transform:none;text-decoration:none;cursor:pointer;white-space:nowrap;transition:border-color .3s ease,color .3s ease,background .3s ease}
        .services-reel .btn:hover{border-color:var(--bg)}
        .services-reel .btn .arw{transition:transform .35s cubic-bezier(.22,1,.36,1)}
        .services-reel .btn:hover .arw{transform:none}
        .services-reel .btn.ghost{--bg:transparent;--fg:var(--ice);border-color:var(--line-hot)}
        .services-reel .reel-nav{position:absolute;right:clamp(22px,3.2vw,62px);top:50%;transform:translateY(-50%);z-index:4;display:none;flex-direction:column;gap:14px;align-items:flex-start}
        .services-reel .reel-dot{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:44px;background:transparent;border:0;padding:0;cursor:pointer;color:var(--slate-dim);transition:color .25s ease}
        .services-reel .reel-dot:hover{color:var(--ice)}
        .services-reel .reel-dot em{display:none}
        .services-reel .reel-dot i{width:16px;height:1px;background:currentColor;transition:width .3s cubic-bezier(.22,1,.36,1),height .3s ease,background .3s ease,box-shadow .3s ease}
        .services-reel .reel-dot u{order:-1;width:0;overflow:hidden;text-decoration:none;white-space:nowrap;font-family:inherit;font-size:.56rem;letter-spacing:.12em;text-transform:uppercase;opacity:0;transition:width .3s cubic-bezier(.22,1,.36,1),opacity .2s ease}
        .services-reel .reel-dot[aria-current="true"]{color:var(--amber)}
        .services-reel .reel-dot[aria-current="true"] i{width:44px;height:2px;background:var(--amber);box-shadow:0 0 10px rgba(56,189,248,.55)}
        .services-reel .reel-dot[aria-current="true"] u{width:88px;opacity:1}
        .services-reel .reel-cue{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);z-index:4;display:flex;flex-direction:column;align-items:center;gap:8px;font-family:inherit;font-size:.5rem;letter-spacing:.24em;text-transform:uppercase;color:var(--slate-dim);transition:opacity .5s ease}
        .services-reel .reel-cue i{width:2px;height:34px;background:linear-gradient(180deg,var(--amber),transparent);animation:drop 2.4s ease-in-out infinite}
        @keyframes drop{0%,100%{transform:scaleY(.3);transform-origin:top;opacity:.35}50%{transform:scaleY(1);transform-origin:top;opacity:1}}
        @media(min-width:720px){.services-reel .reel-nav{display:flex}}
        @media(max-width:1023px){
          .services-reel .reel-stage{align-items:flex-end}
          .services-reel .reel-in{padding-top:calc(var(--head) + 12px);padding-bottom:clamp(26px,5vh,64px);align-items:flex-end;min-height:0}
          .services-reel .slides{display:block}
          .services-reel .slide{justify-content:flex-start}
          .services-reel .reel-grade{background:transparent}
          .services-reel .reel-cue{display:none}
          .services-reel .slide{gap:11px}
          .services-reel .slide h2{font-size:clamp(1.875rem,6vw,2.5rem)}
          .services-reel .slide p{font-size:1.125rem;line-height:1.625}
          .services-reel .slide-actions{width:100%;gap:9px}
          .services-reel .slide-actions .btn{flex:1 1 auto;justify-content:center;padding:12px 14px;font-family:inherit;font-size:.875rem;font-weight:600;letter-spacing:normal;text-transform:none}
        }
        @media(max-width:700px){
          .services-reel .slide-meta{gap:6px}
          .services-reel .slide-meta span{padding:8px 12px;font-size:.8125rem;letter-spacing:normal;text-transform:none;white-space:normal}
        }
        @media(max-width:400px){
          .services-reel .slide h2{font-size:1.75rem}
          .services-reel .slide p{font-size:1rem}
          .services-reel .slide-actions{flex-direction:column}
        }
        @media(max-width:1023px) and (max-height:620px){
          .services-reel .reel-in{padding-top:12px;padding-bottom:18px}.services-reel .slide{gap:7px}.services-reel .slide h2{font-size:clamp(1.5rem,5vw,2rem)}.services-reel .slide p{font-size:1rem;line-height:1.5}.services-reel .slide-meta span{padding:6px 10px;font-size:.75rem}.services-reel .slide-actions .btn{padding:10px 16px;font-size:.8125rem}
        }
        @media(min-width:1900px){
          .services-reel{--shell:1720px;--gut:clamp(64px,6vw,132px)}.services-reel .slides{max-width:48%}.services-reel .slide{gap:26px}.services-reel .slide h2{font-size:clamp(2.25rem,4vw,3rem)}.services-reel .slide p{max-width:52ch;font-size:1.25rem}.services-reel .slide-meta{gap:10px}.services-reel .slide-meta span{padding:10px 17px;font-size:.875rem}.services-reel .reel-nav{right:clamp(36px,4vw,84px)}
        }
        @media(prefers-reduced-motion:reduce){
          .services-reel .reel-cue i{animation:none}
          .services-reel .slide{transition:none}
        }
      `}</style>
    </section>
  );
}

