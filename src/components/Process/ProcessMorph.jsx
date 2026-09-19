import React, { useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    label: 'Discovery',
    number: '01',
    title: (
      <>
        Discovery &amp;
        <br />
        <span className="tint">Assessment</span>
      </>
    ),
    description:
      'We analyze your security posture, infrastructure, and business objectives to surface risks and opportunities.',
    meta: [
      'Security audit & risk assessment',
      'Infrastructure review',
      'Requirements gathering',
      'Compliance analysis',
      'Gap analysis & recommendations',
    ],
  },
  {
    label: 'Strategy',
    number: '02',
    title: (
      <>
        Strategy &amp;
        <br />
        <span className="tint">Planning</span>
      </>
    ),
    description:
      'Our experts design a tailored roadmap with clear milestones, timelines, and success metrics.',
    meta: [
      'Solution architecture',
      'Timeline & milestones',
      'Resource allocation',
      'Budget planning',
      'Risk mitigation strategy',
    ],
  },
  {
    label: 'Deploy',
    number: '03',
    title: (
      <>
        Deployment &amp;
        <br />
        <span className="tint">Execution</span>
      </>
    ),
    description:
      'Rapid implementation with minimal disruption — from setup and integration through testing and go-live.',
    meta: [
      'Agile implementation',
      'Continuous integration & testing',
      'User training & docs',
      'Performance optimization',
      'Quality assurance',
    ],
  },
  {
    label: 'Secure',
    number: '04',
    title: (
      <>
        Monitoring &amp;
        <br />
        <span className="tint">Support</span>
      </>
    ),
    description:
      '24/7 monitoring, continuous optimization, and dedicated support to keep security and performance peaking.',
    meta: [
      '24/7 monitoring & alerts',
      'Security updates & patches',
      'Performance tuning',
      'Dedicated support',
      'Continuous improvement',
    ],
  },
];

const LABELS = STEPS.map((s) => s.label);
const LOGO_CYAN = [0.22, 0.741, 0.973];
const LOGO_CYAN_LIGHT = [0.55, 0.88, 1.0];
const TONES = STEPS.map(() => [LOGO_CYAN, LOGO_CYAN_LIGHT]);

export default function ProcessMorph() {
  const navigate = useNavigate();
  const reelRef = useRef(null);
  const stageRef = useRef(null);
  const slidesRef = useRef(null);
  const navRef = useRef(null);
  const cueRef = useRef(null);

  useEffect(() => {
    const reel = reelRef.current;
    const stage = stageRef.current;
    const slides = Array.from(slidesRef.current?.querySelectorAll('.slide') || []);
    const nav = navRef.current;
    const cue = cueRef.current;
    if (!reel || !stage || !slides.length) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const COUNT = STEPS.length;
    // One sticky viewport per step — not a second homepage-length reel
    reel.style.height = `${COUNT * 100}svh`;

    const M = {
      ident: () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
      persp: (fov, a, n, f) => {
        const t = 1 / Math.tan(fov / 2);
        const nf = 1 / (n - f);
        return new Float32Array([
          t / a, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) * nf, -1, 0, 0, 2 * f * n * nf, 0,
        ]);
      },
      mul: (a, b) => {
        const o = new Float32Array(16);
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            let s = 0;
            for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k];
            o[i * 4 + j] = s;
          }
        }
        return o;
      },
      trans: (x, y, z) => {
        const m = M.ident();
        m[12] = x;
        m[13] = y;
        m[14] = z;
        return m;
      },
      scale: (s) => {
        const m = M.ident();
        m[0] = s;
        m[5] = s;
        m[10] = s;
        return m;
      },
      rotX: (r) => {
        const c = Math.cos(r);
        const s = Math.sin(r);
        const m = M.ident();
        m[5] = c;
        m[6] = s;
        m[9] = -s;
        m[10] = c;
        return m;
      },
      rotY: (r) => {
        const c = Math.cos(r);
        const s = Math.sin(r);
        const m = M.ident();
        m[0] = c;
        m[2] = -s;
        m[8] = s;
        m[10] = c;
        return m;
      },
    };

    function rnd() {
      return Math.random();
    }

    // 01 Discovery — search / scan ring
    function shapeDiscover(N, out) {
      for (let i = 0; i < N; i++) {
        const r = rnd();
        if (r < 0.55) {
          const a = rnd() * Math.PI * 2;
          const rad = 0.85 + rnd() * 0.35;
          out[i * 3] = Math.cos(a) * rad;
          out[i * 3 + 1] = Math.sin(a) * rad;
          out[i * 3 + 2] = (rnd() - 0.5) * 0.12;
        } else if (r < 0.78) {
          const t = rnd();
          out[i * 3] = 0.55 + t * 0.95;
          out[i * 3 + 1] = -0.55 - t * 0.95;
          out[i * 3 + 2] = (rnd() - 0.5) * 0.08;
        } else {
          out[i * 3] = (rnd() - 0.5) * 0.7;
          out[i * 3 + 1] = (rnd() - 0.5) * 0.7;
          out[i * 3 + 2] = (rnd() - 0.5) * 0.2;
        }
      }
    }

    // 02 Strategy — blueprint / architecture plan grid
    function shapeBuild(N, out) {
      const W = 1.45;
      const H = 1.05;
      // Highlighted “rooms” on the plan
      const rooms = [
        [-0.75, 0.35, 0.55, 0.45],
        [0.15, 0.4, 0.7, 0.4],
        [-0.55, -0.45, 0.85, 0.4],
        [0.55, -0.35, 0.5, 0.5],
      ];
      for (let i = 0; i < N; i++) {
        const r = rnd();
        if (r < 0.42) {
          // Outer frame
          const e = (Math.random() * 4) | 0;
          const t = rnd();
          let x;
          let y;
          if (e === 0) {
            x = -W + 2 * W * t;
            y = H;
          } else if (e === 1) {
            x = -W + 2 * W * t;
            y = -H;
          } else if (e === 2) {
            x = -W;
            y = -H + 2 * H * t;
          } else {
            x = W;
            y = -H + 2 * H * t;
          }
          out[i * 3] = x;
          out[i * 3 + 1] = y;
          out[i * 3 + 2] = (rnd() - 0.5) * 0.05;
        } else if (r < 0.72) {
          // Grid lines (blueprint)
          if (rnd() < 0.5) {
            const gx = ((Math.random() * 7) | 0) / 3 - 1;
            out[i * 3] = gx * W * 0.92;
            out[i * 3 + 1] = (rnd() * 2 - 1) * H * 0.92;
          } else {
            const gy = ((Math.random() * 5) | 0) / 2 - 1;
            out[i * 3] = (rnd() * 2 - 1) * W * 0.92;
            out[i * 3 + 1] = gy * H * 0.92;
          }
          out[i * 3 + 2] = (rnd() - 0.5) * 0.04;
        } else if (r < 0.92) {
          // Filled room plates
          const room = rooms[(Math.random() * rooms.length) | 0];
          out[i * 3] = room[0] + (rnd() - 0.5) * room[2];
          out[i * 3 + 1] = room[1] + (rnd() - 0.5) * room[3];
          out[i * 3 + 2] = (rnd() - 0.5) * 0.08;
        } else {
          // Soft depth / title-block corner
          out[i * 3] = W * 0.55 + rnd() * W * 0.4;
          out[i * 3 + 1] = -H * 0.55 - rnd() * H * 0.4;
          out[i * 3 + 2] = (rnd() - 0.5) * 0.06;
        }
      }
    }

    // 03 Deploy — ascending tower / launch
    function shapeLaunch(N, out) {
      for (let i = 0; i < N; i++) {
        const r = rnd();
        if (r < 0.62) {
          const y = rnd() * 2.2 - 1.0;
          const rad = 0.22 + (1.1 - y) * 0.18;
          const a = rnd() * Math.PI * 2;
          out[i * 3] = Math.cos(a) * rad;
          out[i * 3 + 1] = y;
          out[i * 3 + 2] = Math.sin(a) * rad;
        } else if (r < 0.82) {
          out[i * 3] = (rnd() - 0.5) * 0.35;
          out[i * 3 + 1] = 1.05 + rnd() * 0.35;
          out[i * 3 + 2] = (rnd() - 0.5) * 0.35;
        } else {
          const a = rnd() * Math.PI * 2;
          const rad = 0.4 + rnd() * 0.9;
          out[i * 3] = Math.cos(a) * rad;
          out[i * 3 + 1] = -1.15 + rnd() * 0.25;
          out[i * 3 + 2] = Math.sin(a) * rad;
        }
      }
    }

// 04 Secure — W-shaped crown shield + padlock
// =========================================
// 04 Secure — Shield + Padlock
// Logo-style shield crown
// =========================================

function shapeSecure(N, out) {

  // =========================================
  // SHIELD DIMENSIONS
  // =========================================

  // Center top peak
  const top = 1.38;

  // Height of the two outer top corners
  const outerTop = 0.92;

  // Width of shield
  const maxW = 1.18;

  // Where the straight/curved side begins
  const shoulder = 0.30;

  // Bottom point
  const tip = -1.20;

  // Final vertical lift
  const lift = 0.10;

  // Overall scale
  const S = 0.90;


  // =========================================
  // SHIELD SIDE WIDTH
  // =========================================

  function halfW(y) {

    /*
      Upper part:
      Keep the shield wide.

             |       |
             |       |
             |       |
    */

    if (y >= shoulder) {
      return maxW;
    }


    /*
      Lower shield:

          \           /
           \         /
            \       /
             \     /
              \   /
               \ /
                V
    */

    const t = Math.min(
      1,
      Math.max(
        0,
        (shoulder - y) /
        (shoulder - tip)
      )
    );

    return maxW * Math.sqrt(
      Math.max(
        0,
        1 - t * t
      )
    );
  }


  // =========================================
  // LOGO-STYLE TOP
  // =========================================
  //
  //              /\
  //             /  \
  //           /      \
  //         /          \
  //       /              \
  //      |                |
  //
  //       ONE CENTER PEAK
  //
  // No W
  // No second peak
  // No valley
  //
  // =========================================

  function topCurve(x) {

    const ax = Math.min(
      1,
      Math.abs(x)
    );


    /*
      x = 0
        → center peak

      x = 1
        → outer top corner
    */

    /*
      Smooth curved transition.

      Using a power curve instead of
      cosine prevents the W shape.
    */

    const t = ax;

    const curve =
      Math.pow(t, 0.72);


    return (
      top -
      (top - outerTop) *
      curve
    );
  }


  // =========================================
  // PARTICLE GENERATION
  // =========================================

  for (let i = 0; i < N; i++) {

    const r = rnd();

    let x = 0;
    let y = 0;
    let z = 0;


    // =======================================
    // OUTER SHIELD
    // =======================================

    if (r < 0.48) {

      const edgePick = rnd();


      // =====================================
      // TOP CROWN
      // =====================================

      if (edgePick < 0.22) {

        /*
          Generate position from
          left → center → right.
        */

        const xNorm =
          rnd() * 2 - 1;


        /*
          Horizontal position
        */

        x =
          xNorm * maxW;


        /*
          Follow single-peaked shield crown
        */

        y =
          topCurve(xNorm);


        /*
          Very small random variation
          so particles don't form a
          mathematically perfect line.
        */

        x +=
          (rnd() - 0.5) *
          0.035;

        y +=
          (rnd() - 0.5) *
          0.035;


        /*
          Slight 3D depth
        */

        z =
          rnd() < 0.5
            ? 0.14
            : -0.14;
      }


      // =====================================
      // OUTER CURVED SIDES
      // =====================================

      else if (edgePick < 0.88) {

        /*
          IMPORTANT:

          Start from outerTop,
          NOT from center top.

          This prevents the side from
          becoming a long vertical line
          all the way to the center peak.
        */

        y =
          tip +
          rnd() *
          (outerTop - tip);


        const side =
          rnd() < 0.5
            ? -1
            : 1;


        /*
          Follow the shield curve.
        */

        x =
          side *
          (
            halfW(y) -
            rnd() * 0.045
          );


        /*
          3D depth
        */

        z =
          rnd() < 0.5
            ? 0.15
            : -0.15;
      }


      // =====================================
      // BOTTOM TIP
      // =====================================

      else {

        /*
          Concentrate particles around
          the bottom point.
        */

        x =
          (rnd() - 0.5) *
          0.10;

        y =
          tip +
          rnd() * 0.10;

        z =
          rnd() < 0.5
            ? 0.12
            : -0.12;
      }
    }


    // =======================================
    // INNER SHIELD RIM
    // =======================================

    else if (r < 0.58) {

      const xNorm =
        rnd() * 2 - 1;


      /*
        Inner rim is slightly narrower.
      */

      x =
        xNorm *
        maxW *
        0.88;


      /*
        Same exact top shape,
        slightly below the outer crown.
      */

      y =
        topCurve(xNorm) -
        0.10;


      // =====================================
      // LOWER INNER RIM
      // =====================================

      if (y < shoulder) {

        const side =
          xNorm < 0
            ? -1
            : 1;


        const t =
          Math.min(
            1,
            Math.max(
              0,
              (shoulder - y) /
              (shoulder - tip)
            )
          );


        x =
          side *
          maxW *
          0.88 *
          Math.sqrt(
            Math.max(
              0,
              1 - t * t
            )
          );
      }


      z =
        rnd() < 0.5
          ? 0.09
          : -0.09;
    }


    // =======================================
    // PADLOCK BODY
    // =======================================

    else if (r < 0.80) {

      const bw = 0.40;
      const bh = 0.36;

      const bx = 0;
      const by = -0.02;

      const pick = rnd();


      // =====================================
      // PADLOCK BODY FILL
      // =====================================

      if (pick < 0.72) {

        x =
          bx +
          (rnd() * 2 - 1) *
          bw *
          0.92;

        y =
          by +
          (rnd() * 2 - 1) *
          bh *
          0.92;

        z =
          0.10 +
          (rnd() - 0.5) *
          0.03;
      }


      // =====================================
      // PADLOCK BODY EDGES
      // =====================================

      else {

        const e =
          (Math.random() * 4) | 0;

        const t =
          rnd();


        if (e === 0) {

          // Top edge
          x =
            bx -
            bw +
            2 * bw * t;

          y =
            by + bh;

        } else if (e === 1) {

          // Bottom edge
          x =
            bx -
            bw +
            2 * bw * t;

          y =
            by - bh;

        } else if (e === 2) {

          // Left edge
          x =
            bx - bw;

          y =
            by -
            bh +
            2 * bh * t;

        } else {

          // Right edge
          x =
            bx + bw;

          y =
            by -
            bh +
            2 * bh * t;
        }

        z = 0.12;
      }
    }


    // =======================================
    // PADLOCK SHACKLE
    // =======================================

    else if (r < 0.94) {

      const a0 = 0.15;

      const a1 =
        Math.PI - 0.15;


      const a =
        a0 +
        rnd() *
        (a1 - a0);


      const rad =
        0.32 +
        (rnd() - 0.5) *
        0.05;


      const thick =
        (rnd() - 0.5) *
        0.07;


      x =
        Math.cos(a) *
        (rad + thick);


      y =
        0.36 +
        Math.sin(a) *
        (
          rad * 0.95 +
          thick * 0.5
        );


      z =
        0.11 +
        (rnd() - 0.5) *
        0.02;


      // =====================================
      // SHACKLE CONNECTIONS
      // =====================================

      if (rnd() < 0.22) {

        const side =
          rnd() < 0.5
            ? -1
            : 1;


        x =
          side * 0.32 +
          (rnd() - 0.5) *
          0.05;


        y =
          0.18 -
          rnd() * 0.26;


        z = 0.11;
      }
    }


    // =======================================
    // KEYHOLE
    // =======================================

    else {

      if (rnd() < 0.55) {

        /*
          Circular keyhole head
        */

        const a =
          rnd() *
          Math.PI *
          2;


        const rad =
          rnd() *
          0.09;


        x =
          Math.cos(a) *
          rad;


        y =
          0.06 +
          Math.sin(a) *
          rad;


        z = 0.14;
      }

      else {

        /*
          Keyhole stem
        */

        x =
          (rnd() - 0.5) *
          0.08;


        y =
          -0.08 -
          rnd() * 0.18;


        z = 0.14;
      }
    }


    // =======================================
    // FINAL SCALE
    // =======================================

    out[i * 3] =
      x * S;

    out[i * 3 + 1] =
      (y + lift) * S;

    out[i * 3 + 2] =
      z * S;
  }
}

    const SHAPES = [shapeDiscover, shapeBuild, shapeLaunch, shapeSecure];

    const V_MORPH =
      'attribute vec3 aA; attribute vec3 aB; attribute float aSeed;' +
      'uniform mat4 uProj,uView,uModel; uniform float uMix,uTime,uSize,uBurst;' +
      'varying float vSeed; varying float vDepth;' +
      'void main(){' +
      ' vec3 p=mix(aA,aB,uMix);' +
      ' vec3 dir=normalize(p+vec3(0.0001));' +
      ' p+=dir*uBurst*(0.30+aSeed*0.55);' +
      ' p+=0.009*vec3(sin(uTime*0.8+aSeed*31.0),cos(uTime*0.7+aSeed*27.0),sin(uTime*0.6+aSeed*19.0));' +
      ' vec4 e=uView*uModel*vec4(p,1.0);' +
      ' vDepth=-e.z; vSeed=aSeed; gl_Position=uProj*e;' +
      ' gl_PointSize=uSize*(0.70+aSeed*0.55)*(5.2/max(vDepth,0.7));' +
      '}';

    const F_MORPH =
      'precision mediump float;' +
      'varying float vSeed; varying float vDepth;' +
      'uniform vec3 uC1,uC2; uniform float uOp;' +
      'void main(){' +
      ' vec2 d=gl_PointCoord-vec2(0.5); float r2=dot(d,d);' +
      ' if(r2>0.25) discard;' +
      ' float a=smoothstep(0.25,0.15,r2);' +
      ' vec3 c=mix(uC1,uC2,vSeed*vSeed);' +
      ' float fog=clamp((11.0-vDepth)/8.5,0.0,1.0);' +
      ' gl_FragColor=vec4(c,a*uOp*fog);' +
      '}';

    function shader(gl, type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    function program(gl, v, f) {
      const vs = shader(gl, gl.VERTEX_SHADER, v);
      const fs = shader(gl, gl.FRAGMENT_SHADER, f);
      if (!vs || !fs) return null;
      const p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
    }
    function buffer(gl, data) {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return b;
    }
    function attrib(gl, p, name, b, size) {
      const l = gl.getAttribLocation(p, name);
      if (l < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.enableVertexAttribArray(l);
      gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
    }

    const gl =
      stage.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false }) ||
      stage.getContext('experimental-webgl', { antialias: true, alpha: true });
    if (!gl) return undefined;
    const pm = program(gl, V_MORPH, F_MORPH);
    if (!pm) return undefined;

    const wide = window.innerWidth;
    // Slightly lighter than Services — Process is one page sticky stage
    // const N = wide >= 1200 ? 80000 : wide >= 800 ? 48000 : 28000;
    const N = wide >= 1200
  ? 80000
  : wide >= 800
    ? 48000
    : 12000;
    const bufs = [];
    const tmp = new Float32Array(N * 3);
    SHAPES.forEach((shape) => {
      shape(N, tmp);
      bufs.push(buffer(gl, tmp));
    });
    const seeds = new Float32Array(N);
    for (let i = 0; i < N; i++) seeds[i] = Math.random();
    const bSeed = buffer(gl, seeds);
    const U = {};
    ['uProj', 'uView', 'uModel', 'uMix', 'uTime', 'uSize', 'uBurst', 'uC1', 'uC2', 'uOp'].forEach(
      (k) => {
        U[k] = gl.getUniformLocation(pm, k);
      }
    );
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.disable(gl.DEPTH_TEST);

    let dpr = 1;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    let clock = 0;
    let current = -1;
    let progress = 0;
    let shownIdx = 0;
    let mixT = 0;
    let burst = 0;
    let raf = 0;
    let ticking = false;
    let settleT = 0; // time since current section became active

    function sizeStage() {
      const r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(r.width * dpr);
      const h = Math.round(r.height * dpr);
      if (stage.width === w && stage.height === h) return true;
      stage.width = w;
      stage.height = h;
      gl.viewport(0, 0, w, h);
      return true;
    }

    function readProgress() {
      const rect = reel.getBoundingClientRect();
      const totalScrollable = reel.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) progress = 0;
      else progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));

      const f = progress * (COUNT - 1);
      const i = Math.min(COUNT - 2, Math.floor(f));
      const t = Math.max(0, Math.min(1, f - i));
      let e = t < 0.3 ? 0 : t > 0.8 ? 1 : (t - 0.3) / 0.5;
      e = e * e * (3 - 2 * e);
      shownIdx = i;
      mixT = e;
      burst = Math.sin(Math.PI * e) * 0.5;
      const active = e < 0.5 ? i : i + 1;
      if (active !== current) {
        current = active;
        settleT = 0; // face front on each new section, then sway
        slides.forEach((el, k) => el.classList.toggle('on', k === active));
        Array.from(nav?.querySelectorAll('.reel-dot') || []).forEach((d, k) =>
          d.setAttribute('aria-current', k === active ? 'true' : 'false')
        );
      }
      if (cue) cue.style.opacity = progress > 0.02 ? '0' : '1';
    }

    function drawStage() {
      const r = stage.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight || !sizeStage()) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(pm);
      const aspect = stage.width / stage.height;
      const wideLayout = r.width >= 1024;
      gl.uniformMatrix4fv(U.uProj, false, M.persp(0.9, aspect, 0.1, 60));
      gl.uniformMatrix4fv(
        U.uView,
        false,
        // Keep the hologram to the right of copy; mobile lifts it above the text block
        wideLayout
          ? M.trans(1.35, 0, -4.6)
          : r.width < 480
            ? M.trans(0, 1.55, -6.65)
            : M.trans(0.3, 1.25, -6.35)
      );
      // Front-facing on section entry, then ease into sway (dampen during morph)
      const settle = Math.min(1, settleT / 1.35);
      const settleEase = settle * settle * (3 - 2 * settle);
      const morphDamp = 1 - Math.sin(Math.PI * mixT) * 0.9;
      const amp = settleEase * morphDamp;
      const yaw = Math.sin(clock * 0.22) * 0.42 * amp + mx * 0.45 * amp;
      const pitch = (-0.08 + my * 0.22) * amp;
      const model = M.mul(M.rotY(yaw), M.rotX(pitch));
      gl.uniformMatrix4fv(U.uModel, false, M.mul(model, M.scale(wideLayout ? 1 : 0.55)));
      attrib(gl, pm, 'aA', bufs[shownIdx], 3);
      attrib(gl, pm, 'aB', bufs[Math.min(shownIdx + 1, COUNT - 1)], 3);
      attrib(gl, pm, 'aSeed', bSeed, 1);
      const t1 = TONES[shownIdx];
      const t2 = TONES[Math.min(shownIdx + 1, COUNT - 1)];
      const lerp = (a, b, k, i) => a[i] + (b[i] - a[i]) * k;
      gl.uniform3f(
        U.uC1,
        lerp(t1[0], t2[0], mixT, 0),
        lerp(t1[0], t2[0], mixT, 1),
        lerp(t1[0], t2[0], mixT, 2)
      );
      gl.uniform3f(
        U.uC2,
        lerp(t1[1], t2[1], mixT, 0),
        lerp(t1[1], t2[1], mixT, 1),
        lerp(t1[1], t2[1], mixT, 2)
      );
      gl.uniform1f(U.uMix, mixT);
      gl.uniform1f(U.uBurst, burst);
      gl.uniform1f(U.uTime, clock);
      // gl.uniform1f(U.uSize, (r.width < 800 ? 2.6 : 1.95) * dpr);
      // gl.uniform1f(U.uOp, r.width < 800 ? 0.9 : 0.95);
      gl.uniform1f(U.uOp, r.width < 800 ? 0.45 : 0.95);
      gl.uniform1f(U.uSize, (r.width < 800 ? 2.0 : 1.95) * dpr);
      gl.drawArrays(gl.POINTS, 0, N);
    }

    nav?.replaceChildren();
    LABELS.forEach((name, i) => {
      const b = document.createElement('button');
      b.className = 'reel-dot';
      b.setAttribute('aria-label', `Go to ${name}`);
      b.innerHTML = `<em>${String(i + 1).padStart(2, '0')}</em><i></i><u>${name}</u>`;
      b.addEventListener('click', () => {
        const totalScrollable = reel.offsetHeight - window.innerHeight;
        const targetY = reel.offsetTop + (i / (COUNT - 1)) * totalScrollable;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
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

    if (window.matchMedia('(pointer: fine)').matches && !reduce) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

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
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      bufs.forEach((b) => gl.deleteBuffer(b));
      gl.deleteBuffer(bSeed);
      gl.deleteProgram(pm);
    };
  }, []);

  return (
    <section className="process-reel" id="process-morph" ref={reelRef} style={{ minHeight: '100svh' }}>
      <div className="shell process-section-header">
        <div className="process-page-label">
          <Shield aria-hidden="true" className="w-4 h-4" />
          <span>Our Methodology</span>
        </div>
        <h2 className="process-section-title">
          Proven Process For
          <span className="tint"> Project Success</span>
        </h2>
        <p className="process-section-lede">
          A structured, transparent approach — scroll through each phase from discovery to ongoing
          protection.
        </p>
      </div>

      <div className="reel-stage">
        <canvas ref={stageRef} aria-hidden="true" />
        <div className="reel-grade" aria-hidden="true" />
        <div className="reel-in">
          <div className="shell">
            <div className="slides" ref={slidesRef}>
              {STEPS.map((step, index) => (
                <article className={`slide ${index === 0 ? 'on' : ''}`} key={step.label}>
                  <p className="eyebrow">
                    Phase {step.number} — {step.label}
                  </p>
                  <h2 className="dsp">{step.title}</h2>
                  <p>{step.description}</p>
                  <div className="slide-meta">
                    {step.meta.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  {index === STEPS.length - 1 && (
                    <div className="slide-actions">
                      <a
                        className="btn"
                        href="/contact"
                        onClick={(event) => {
                          event.preventDefault();
                          navigate('/contact');
                        }}
                      >
                        Schedule consultation
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
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
        <nav className="reel-nav" ref={navRef} aria-label="Process phases" />
        <div className="reel-cue" ref={cueRef} aria-hidden="true">
          <i />
          Scroll
        </div>
      </div>

      <style>{`
        .process-reel {
          --void:#0B0F19; --void-2:#070B14; --panel:#0C1322; --panel-2:#101929;
          --line:#1B2740; --line-hot:#2B3E63; --signal:#38BDF8; --amber:#38bdf8;
          --ice:#F2F5FA; --slate:#93A6C4; --slate-dim:#5B6C89;
          --ui:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;
          --fs-label:.875rem; --shell:1440px; --gut:clamp(18px,4vw,60px); --head:68px;
        }
        .process-reel,.process-reel *{box-sizing:border-box}
        .process-reel{position:relative;background:transparent;color:var(--ice);font-family:var(--ui);font-size:clamp(1rem,.5vw + .88rem,1.0625rem);line-height:1.62}
        .process-reel p{margin:0}
        .process-reel .dsp{font-family:inherit;font-weight:700;line-height:1.15;margin:0;text-wrap:balance}
        .process-reel .tint{color:var(--signal)}
        .process-reel .shell{width:100%;max-width:var(--shell);margin-inline:auto;padding-inline:var(--gut)}
        .process-reel .process-section-header{display:flex;flex-direction:column;align-items:center;text-align:center;padding-block:clamp(88px,10vw,120px) clamp(28px,4vw,44px)}
        .process-reel .process-page-label{display:inline-flex;align-items:center;gap:8px;margin:0 0 1.5rem;padding:8px 16px;border:1px solid rgba(56,189,248,.3);border-radius:999px;background:rgba(56,189,248,.1);color:#38BDF8;font-size:.875rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase}
        .process-reel .process-page-label svg{width:16px;height:16px;flex:none;color:#38BDF8}
        .process-reel .process-section-title{margin:0 0 1.25rem;font-size:clamp(2.25rem,5vw,3rem);font-weight:700;line-height:1.2;color:#fff;text-wrap:balance}
        .process-reel .process-section-lede{margin:0 auto;max-width:42rem;color:#d1d5db;font-size:1.2rem;line-height:1.625}
        .process-reel .eyebrow{font-size:.75rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--signal);display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.3)}
        .process-reel .reel-stage{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;align-items:center}
        .process-reel .reel-stage>canvas{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}
        .process-reel .reel-grade{position:absolute;inset:0;pointer-events:none;background:transparent}
        .process-reel .reel-in{position:relative;z-index:3;width:100%;display:flex;align-items:center;min-height:100%}
        .process-reel .slides{position:relative;width:100%}
        @media(min-width:1024px){
          .process-reel .reel-in{min-height:calc(100svh - 5rem)}
          .process-reel .slides{max-width:46%;display:flex;align-items:center}
          .process-reel .slide.on{width:100%}
        }
        .process-reel .slide{position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:18px;opacity:0;visibility:hidden;transform:translateY(26px);transition:opacity .45s ease,transform .45s ease,visibility .45s}
        .process-reel .slide.on{position:relative;opacity:1;visibility:visible;transform:none}
        .process-reel .slide h2{font-size:clamp(2.1rem,4vw,3rem);line-height:1.15;max-width:100%}
        .process-reel .slide>p:not(.eyebrow){color:#d1d5db;max-width:48ch;font-size:1.2rem;line-height:1.625}
        .process-reel .slide-meta{display:flex;flex-wrap:wrap;gap:8px;width:100%}
        .process-reel .slide-meta span{border:1px solid rgba(55,65,81,.5);border-radius:.5rem;background:rgba(31,41,55,.4);backdrop-filter:blur(6px);padding:10px 16px;font-size:.875rem;font-weight:500;color:#9ca3af;line-height:1.4}
        .process-reel .slide-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:4px}
        .process-reel .btn{display:inline-flex;align-items:center;gap:10px;padding:12px 24px;background:var(--amber);color:#0B0F19;border:1px solid var(--amber);border-radius:.5rem;font-size:.875rem;font-weight:600;text-decoration:none;cursor:pointer}
        .process-reel .reel-nav{position:absolute;right:clamp(22px,3.2vw,62px);top:50%;transform:translateY(-50%);z-index:4;display:none;flex-direction:column;gap:14px}
        .process-reel .reel-dot{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:44px;background:transparent;border:0;padding:0;cursor:pointer;color:var(--slate-dim)}
        .process-reel .reel-dot:hover{color:var(--ice)}
        .process-reel .reel-dot em{display:none}
        .process-reel .reel-dot i{width:16px;height:1px;background:currentColor;transition:width .3s ease,height .3s ease,background .3s ease,box-shadow .3s ease}
        .process-reel .reel-dot u{order:-1;width:0;overflow:hidden;text-decoration:none;white-space:nowrap;font-size:.56rem;letter-spacing:.12em;text-transform:uppercase;opacity:0;transition:width .3s ease,opacity .2s ease}
        .process-reel .reel-dot[aria-current="true"]{color:var(--amber)}
        .process-reel .reel-dot[aria-current="true"] i{width:44px;height:2px;background:var(--amber);box-shadow:0 0 10px rgba(56,189,248,.55)}
        .process-reel .reel-dot[aria-current="true"] u{width:88px;opacity:1}
        .process-reel .reel-cue{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);z-index:4;display:flex;flex-direction:column;align-items:center;gap:8px;font-size:.5rem;letter-spacing:.24em;text-transform:uppercase;color:var(--slate-dim);transition:opacity .5s ease}
        .process-reel .reel-cue i{width:2px;height:34px;background:linear-gradient(180deg,var(--amber),transparent);animation:process-drop 2.4s ease-in-out infinite}
        @keyframes process-drop{0%,100%{transform:scaleY(.3);transform-origin:top;opacity:.35}50%{transform:scaleY(1);transform-origin:top;opacity:1}}
        @media(min-width:720px){.process-reel .reel-nav{display:flex}}
        @media(max-width:1023px){
          .process-reel .reel-stage{align-items:flex-end}
          .process-reel .reel-in{padding-top:clamp(5.5rem,18svh,8.5rem);padding-bottom:max(20px,env(safe-area-inset-bottom));align-items:flex-end;min-height:0}
          .process-reel .slide{justify-content:flex-start;gap:12px}
          .process-reel .slide h2{font-size:clamp(1.85rem,6vw,2.4rem)}
          .process-reel .slide>p:not(.eyebrow){font-size:1.05rem}
          .process-reel .reel-grade{background:linear-gradient(180deg,transparent 0%,rgba(11,15,25,.16) 32%,rgba(11,15,25,.86) 55%,var(--void) 84%)}
          .process-reel .reel-cue{display:none}
        }
        @media(max-width:700px){
          .process-reel .slide-meta{gap:6px}
          .process-reel .slide-meta span{padding:8px 12px;font-size:.8125rem}
        }
        @media(max-width:480px){
          .process-reel{--gut:18px}
          .process-reel .process-section-header{padding-block:64px 30px}
          .process-reel .process-page-label{margin-bottom:1rem;padding:6px 11px;font-size:.75rem}
          .process-reel .process-section-title{margin-bottom:1rem;font-size:2rem}
          .process-reel .process-section-lede{font-size:1rem;line-height:1.55}
          .process-reel .slide-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
          .process-reel .slide-meta span{width:100%;padding:7px 9px;font-size:.75rem}
          .process-reel .slide-actions{width:100%}
          .process-reel .slide-actions .btn{width:100%;justify-content:center}
        }
        @media(max-width:1023px) and (max-height:620px){
          .process-reel .reel-in{padding-top:52px;padding-bottom:18px}
          .process-reel .slide{gap:7px}
          .process-reel .slide h2{font-size:clamp(1.5rem,5vw,2rem)}
          .process-reel .slide>p:not(.eyebrow){font-size:1rem;line-height:1.5}
          .process-reel .slide-meta span{padding:6px 10px;font-size:.75rem}
        }
        @media(prefers-reduced-motion:reduce){
          .process-reel .reel-cue i{animation:none}
          .process-reel .slide{transition:none}
        }
      `}</style>
    </section>
  );
}
