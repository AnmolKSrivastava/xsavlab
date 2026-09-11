import React, { useEffect, useRef } from 'react';

const REEL_CSS = `
:root {
  color-scheme: dark;

  --void:      #04060C;
  --void-2:    #070B14;
  --panel:     #0C1322;
  --panel-2:   #101929;
  --line:      #1B2740;
  --line-hot:  #2B3E63;

  --signal:    #38BDF8;
  --amber:     #38bdf8;

  --ice:       #F2F5FA;
  --slate:     #93A6C4;
  --slate-dim: #5B6C89;
  --ok:        #34D399;

  --ui: "Playfair Display", Georgia, serif;
  --display: var(--ui);
  --sans: var(--ui);
  --mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace;

  --fs-label: 0.6875rem;
  --shell: 1440px;
  --gut: clamp(18px, 4vw, 60px);
  --head: 0px;
}

.reel-root * { box-sizing: border-box; }

.reel-root {
  background: var(--void);
  color: var(--ice);
  font-family: var(--sans);
  font-size: clamp(1rem, .5vw + .88rem, 1.0625rem);
  line-height: 1.62;
  -webkit-font-smoothing: antialiased;
}

.reel-root ::selection { background: var(--amber); color: #12100A; }
.reel-root a { color: inherit; }
.reel-root :focus-visible { outline: 2px solid var(--amber); outline-offset: 3px; }
.reel-root p { margin: 0; }

.reel-root .dsp { font-family: var(--display); font-weight: 800; text-transform: uppercase; line-height: .9; letter-spacing: -0.028em; margin: 0; text-wrap: balance; }
.reel-root .tint { color: var(--signal); }
.reel-root .tint-a { color: var(--amber); }

.reel-root .shell { width: 100%; max-width: var(--shell); margin-inline: auto; padding-inline: var(--gut); }

.reel-root .eyebrow { font-family: var(--mono); font-size: var(--fs-label); letter-spacing: .22em; text-transform: uppercase; color: var(--signal); display: flex; align-items: flex-start; gap: 12px; margin: 0; }
.reel-root .eyebrow::before { content: ""; width: 26px; height: 2px; background: currentColor; flex: none; margin-top: .62em; }
.reel-root .eyebrow.amber { color: var(--amber); }

.reel-root .btn {
  --bg: var(--amber); --fg: #12100A;
  display: inline-flex; align-items: center; gap: 10px;
  padding: 13px 22px; background: var(--bg); color: var(--fg);
  border: 2px solid var(--bg); border-radius: 999px;
  font-family: var(--mono); font-size: .6875rem; font-weight: 700;
  letter-spacing: .16em; text-transform: uppercase; text-decoration: none;
  cursor: pointer; white-space: nowrap;
  transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease, border-color .3s ease, color .3s ease;
}
.reel-root .btn:hover { transform: translateY(-2px); box-shadow: 0 12px 34px -12px rgba(255,176,32,.8); }
.reel-root .btn .arw { transition: transform .35s cubic-bezier(.22,1,.36,1); }
.reel-root .btn:hover .arw { transform: translate(3px,-3px); }
.reel-root .btn.ghost { --bg: transparent; --fg: var(--ice); border-color: var(--line-hot); }
.reel-root .btn.ghost:hover { border-color: var(--ice); box-shadow: none; }

.reel-root .reel { position: relative; }

.reel-root .reel-stage {
  position: sticky; top: 0;
  height: 100svh;
  overflow: hidden;
  display: flex; align-items: center;
}

.reel-root #stage3d { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

.reel-root .reel-grade {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(58% 58% at 68% 50%, rgba(56,189,248,.07), transparent 68%),
    linear-gradient(90deg, var(--void) 0%, rgba(4,6,12,.86) 34%, rgba(4,6,12,.3) 62%, transparent 84%);
}
@media (max-width: 1023px) {
  .reel-root .reel-stage { align-items: flex-end; }
  .reel-root .reel-in { padding-top: 0; padding-bottom: clamp(40px, 8vh, 96px); }
  .reel-root .reel-grade {
    background: linear-gradient(180deg,
      rgba(4,6,12,.10) 0%, rgba(4,6,12,.22) 26%, rgba(4,6,12,.72) 46%,
      rgba(4,6,12,.94) 62%, var(--void) 84%);
  }
}

.reel-root .reel-in { position: relative; z-index: 3; width: 100%; padding-top: var(--head); }

.reel-root .slides { position: relative; }
@media (min-width: 1024px) { .reel-root .slides { max-width: 46%; } }

.reel-root .slide {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(26px);
  will-change: opacity, transform;
}
.reel-root .slide.on { position: relative; opacity: 1; visibility: visible; transform: none; }

.reel-root .slide h2 {
  font-size: clamp(1.8rem, 3.5vw, 3.2rem);
  line-height: 0.95;
  max-width: 100%;
  overflow-wrap: anywhere;
}
.reel-root .slide p {
  color: var(--slate);
  max-width: 42ch;
  font-size: 0.9rem;
  line-height: 1.45;
}

.reel-root .slide-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
}
.reel-root .slide-meta span {
  flex: 0 1 auto;
  min-width: 0;
  border: 1px solid var(--line-hot); border-radius: 999px;
  background: rgba(7,11,20,.78); backdrop-filter: blur(6px);
  padding: 8px 14px;
  font-family: var(--mono); font-size: .625rem; letter-spacing: .12em;
  text-transform: uppercase; color: var(--ice); white-space: normal;
  max-width: 100%; overflow-wrap: anywhere; line-height: 1.35; text-align: left;
}

.reel-root .slide-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 3px;
}

.reel-root .btn {
  padding: 10px 17px;
  font-size: 0.6rem;
}

.reel-root .eyebrow {
  font-size: 0.6rem;
  letter-spacing: 0.16em;
}

.reel-root .reel-nav {
  position: absolute; right: clamp(14px, 2.4vw, 34px); top: 50%;
  transform: translateY(-50%); z-index: 4;
  display: none; flex-direction: column; gap: 14px;
}
@media (min-width: 720px) { .reel-root .reel-nav { display: flex; } }

.reel-root .reel-dot {
  display: flex; align-items: center; gap: 10px;
  background: none; border: 0; padding: 0; cursor: pointer;
  font-family: var(--mono); font-size: .5625rem; letter-spacing: .16em; text-transform: uppercase;
  color: var(--slate-dim); transition: color .35s ease;
}
.reel-root .reel-dot u { text-decoration: none; opacity: 0; transition: opacity .35s ease; white-space: nowrap; }
.reel-root .reel-dot i { width: 26px; height: 2px; background: currentColor; flex: none; transition: width .4s cubic-bezier(.22,1,.36,1), background .35s ease; }
.reel-root .reel-nav:hover .reel-dot u { opacity: 1; }
.reel-root .reel-dot[aria-current="true"] { color: var(--amber); }
.reel-root .reel-dot[aria-current="true"] i { width: 46px; }

.reel-root .reel-cue {
  position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%); z-index: 4;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: .5rem; letter-spacing: .24em; text-transform: uppercase; color: var(--slate-dim);
  transition: opacity .5s ease;
}
.reel-root .reel-cue i { width: 2px; height: 34px; background: linear-gradient(180deg, var(--amber), transparent); animation: reel-drop 2.4s ease-in-out infinite; }
@keyframes reel-drop { 0%,100% { transform: scaleY(.3); transform-origin: top; opacity: .35; } 50% { transform: scaleY(1); transform-origin: top; opacity: 1; } }

@media (max-width: 1023px) {
  .reel-root .reel-stage { align-items: flex-end; }
  .reel-root .reel-in { padding-top: calc(var(--head) + 12px); padding-bottom: clamp(26px, 5vh, 64px); }
  .reel-root .reel-cue { display: none; }
  .reel-root .slide { gap: 11px; }
  .reel-root .slide h2 { font-size: clamp(1.45rem, 7vw, 2.6rem); }
  .reel-root .slide p { font-size: .875rem; line-height: 1.5; }
  .reel-root .slide-actions { width: 100%; gap: 9px; }
  .reel-root .slide-actions .btn { flex: 1 1 auto; justify-content: center; padding: 12px 14px; }
}

@media (max-width: 700px) {
  .reel-root .slide-meta { gap: 6px; }
  .reel-root .slide-meta span { padding: 6px 10px; font-size: .5625rem; letter-spacing: .08em; }
}

@media (max-width: 400px) {
  .reel-root .slide h2 { font-size: 1.45rem; }
  .reel-root .slide p { font-size: .8125rem; }
  .reel-root .slide-actions { flex-direction: column; }
}

/* Keep all hero copy inside short mobile and landscape viewports. */
@media (max-width: 1023px) and (max-height: 620px) {
  .reel-root .reel-in { padding-top: 12px; padding-bottom: 18px; }
  .reel-root .slide { gap: 7px; }
  .reel-root .slide h2 { font-size: clamp(1.3rem, 5vw, 2rem); }
  .reel-root .slide p { font-size: .78rem; line-height: 1.35; }
  .reel-root .slide-meta span { padding: 4px 8px; font-size: .5rem; }
  .reel-root .slide-actions .btn { padding: 9px 12px; font-size: .53rem; }
}

/* Large desktop and ultra-wide displays */
@media (min-width: 1900px) {
  .reel-root { --shell: 1720px; --gut: clamp(64px, 6vw, 132px); }
  .reel-root .slides { max-width: 48%; }
  .reel-root .slide { gap: 22px; }
  .reel-root .slide h2 { font-size: clamp(3.6rem, 3.7vw, 5rem); }
  .reel-root .slide p { max-width: 52ch; font-size: 1.08rem; }
  .reel-root .slide-meta { gap: 10px; }
  .reel-root .slide-meta span { padding: 9px 16px; font-size: .7rem; }
  .reel-root .reel-nav { right: clamp(36px, 4vw, 84px); }
}
`;

export default function Hero() {
    const rootRef = useRef(null);
    const stageRef = useRef(null);
    const reelRef = useRef(null);
    const navRef = useRef(null);
    const cueRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        const stage = stageRef.current;
        const reel = reelRef.current;
        const nav = navRef.current;
        const cue = cueRef.current;
        if (!root || !stage || !reel) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const slideEls = Array.from(root.querySelectorAll('.slide'));

        // ---------- matrix helpers ----------
        const M = {
            ident: function () { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); },
            persp: function (fov, a, n, f) {
                var t = 1 / Math.tan(fov / 2), nf = 1 / (n - f);
                return new Float32Array([t / a, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) * nf, -1, 0, 0, 2 * f * n * nf, 0]);
            },
            mul: function (a, b) {
                var o = new Float32Array(16), i, j, k, s;
                for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) {
                    s = 0; for (k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k];
                    o[i * 4 + j] = s;
                }
                return o;
            },
            trans: function (x, y, z) { var m = M.ident(); m[12] = x; m[13] = y; m[14] = z; return m; },
            rotX: function (r) { var c = Math.cos(r), s = Math.sin(r), m = M.ident(); m[5] = c; m[6] = s; m[9] = -s; m[10] = c; return m; },
            rotY: function (r) { var c = Math.cos(r), s = Math.sin(r), m = M.ident(); m[0] = c; m[2] = -s; m[8] = s; m[10] = c; return m; }
        };

        function sh(gl, type, src) {
            var s = gl.createShader(type);
            gl.shaderSource(s, src); gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
            return s;
        }
        function prog(gl, v, f) {
            var vs = sh(gl, gl.VERTEX_SHADER, v), fs = sh(gl, gl.FRAGMENT_SHADER, f);
            if (!vs || !fs) return null;
            var p = gl.createProgram();
            gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
            if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(p)); return null; }
            return p;
        }
        function buf(gl, data) {
            var b = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, b);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            return b;
        }
        function attrib(gl, p, name, b, size) {
            var l = gl.getAttribLocation(p, name);
            if (l < 0) return;
            gl.bindBuffer(gl.ARRAY_BUFFER, b);
            gl.enableVertexAttribArray(l);
            gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
        }

        var V_MORPH =
            'attribute vec3 aA; attribute vec3 aB; attribute float aSeed;' +
            'uniform mat4 uProj,uView,uModel; uniform float uMix,uTime,uSize,uBurst;' +
            'varying float vSeed; varying float vDepth;' +
            'void main(){' +
            ' vec3 p = mix(aA,aB,uMix);' +
            ' vec3 dir = normalize(p + vec3(0.0001));' +
            ' p += dir * uBurst * (0.30 + aSeed*0.55);' +
            ' p += 0.009*vec3(sin(uTime*0.8+aSeed*31.0), cos(uTime*0.7+aSeed*27.0), sin(uTime*0.6+aSeed*19.0));' +
            ' vec4 e = uView * uModel * vec4(p,1.0);' +
            ' vDepth = -e.z; vSeed = aSeed;' +
            ' gl_Position = uProj * e;' +
            ' gl_PointSize = uSize * (0.70 + aSeed*0.55) * (5.2 / max(vDepth, 0.7));' +
            '}';

        var F_MORPH =
            'precision mediump float;' +
            'varying float vSeed; varying float vDepth;' +
            'uniform vec3 uC1,uC2; uniform float uOp;' +
            'void main(){' +
            ' vec2 d = gl_PointCoord - vec2(0.5);' +
            ' float r2 = dot(d,d);' +
            ' if (r2 > 0.25) discard;' +
            ' float a = smoothstep(0.25, 0.15, r2);' +
            ' vec3 c = mix(uC1, uC2, vSeed * vSeed);' +
            ' float fog = clamp((11.0 - vDepth) / 8.5, 0.0, 1.0);' +
            ' gl_FragColor = vec4(c, a * uOp * fog);' +
            '}';

        function rnd() { return Math.random(); }

        function shapeMark(N, out) {
            var quads = [
                [[-1, 1], [0, 1], [0, 0]],
                [[0, 1], [1, 1], [1, 0]],
                [[-1, 0], [0, 0], [0, -1]],
                [[0, 0], [1, 0], [1, -1]]
            ];
            for (var i = 0; i < N; i++) {
                var t = quads[i & 3], d = 0.17;
                var r1 = rnd(), r2 = rnd();
                if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2; }
                var x = t[0][0] + r1 * (t[1][0] - t[0][0]) + r2 * (t[2][0] - t[0][0]);
                var y = t[0][1] + r1 * (t[1][1] - t[0][1]) + r2 * (t[2][1] - t[0][1]);
                var z = (rnd() < 0.72) ? (rnd() < 0.5 ? d : -d) : (rnd() * 2 - 1) * d;
                out[i * 3] = x * 1.08; out[i * 3 + 1] = y * 1.08; out[i * 3 + 2] = z;
            }
        }

        var SHAPES = [shapeMark];
        var LABELS = ['Overview'];
        var TONES = [
            [[0.22, 0.74, 0.97], [1.00, 0.69, 0.13]]
        ];

        var COUNT = SHAPES.length;
        // if (reel) reel.style.height = (COUNT * 100) + 'svh';

        var dotEls = [];
        var onDotClick = [];
        if (nav) {
            LABELS.forEach(function (name, i) {
                var b = document.createElement('button');
                b.className = 'reel-dot';
                b.setAttribute('aria-label', 'Go to ' + name);
                b.innerHTML = '<u>' + name + '</u><i></i>';
                var handler = function () {
                    var total = reel.offsetHeight - window.innerHeight;
                    var y = reel.offsetTop + (i / (COUNT - 1)) * total;
                    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
                };
                b.addEventListener('click', handler);
                onDotClick.push({ el: b, handler: handler });
                nav.appendChild(b);
                dotEls.push(b);
            });
        }

        var current = -1, progress = 0, shownIdx = 0, mixT = 0, burst = 0;

        // function readProgress() {
        //   if (!reel) return;
        //   var total = Math.max(1, reel.offsetHeight - window.innerHeight);
        //   var p = (-reel.getBoundingClientRect().top) / total;
        //   progress = Math.max(0, Math.min(1, p));

        //   var f = progress * (COUNT - 1);
        //   var i = Math.min(COUNT - 2, Math.floor(f));
        //   var t = f - i;

        //   var e = t < 0.30 ? 0 : t > 0.80 ? 1 : (t - 0.30) / 0.50;
        //   e = e * e * (3 - 2 * e);

        //   shownIdx = i; mixT = e;
        //   burst = Math.sin(Math.PI * e) * 0.5;

        //   var active = e < 0.5 ? i : i + 1;
        //   if (active !== current) {
        //     current = active;
        //     slideEls.forEach(function (el, k) { el.classList.toggle('on', k === active); });
        //     dotEls.forEach(function (d, k) { d.setAttribute('aria-current', k === active ? 'true' : 'false'); });
        //   }
        //   if (cue) cue.style.opacity = progress > 0.02 ? '0' : '1';
        // }

        function readProgress() {
            if (!reel) return;

            progress = 0;

            shownIdx = 0;
            mixT = 0;
            burst = 0;

            if (current !== 0) {
                current = 0;
                slideEls.forEach(function (el) {
                    el.classList.toggle('on', true);
                });
                dotEls.forEach(function (d) {
                    d.setAttribute('aria-current', 'true');
                });
            }

            if (cue) cue.style.opacity = '1';
        }

        var gl = null, pm = null, bufs = [], bSeed = null, N = 0, U = {};

        function initStage() {
            if (!stage) return;
            gl = stage.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false })
                || stage.getContext('experimental-webgl', { antialias: true, alpha: true });
            if (!gl) return;

            pm = prog(gl, V_MORPH, F_MORPH);
            if (!pm) { gl = null; return; }

            var wide = window.innerWidth;
            N = wide >= 1200 ? 110000 : wide >= 800 ? 60000 : 34000;

            var tmp = new Float32Array(N * 3);
            for (var i = 0; i < SHAPES.length; i++) {
                SHAPES[i](N, tmp);
                bufs.push(buf(gl, tmp));
            }
            var seeds = new Float32Array(N);
            for (var j = 0; j < N; j++) seeds[j] = Math.random();
            bSeed = buf(gl, seeds);

            ['uProj', 'uView', 'uModel', 'uMix', 'uTime', 'uSize', 'uBurst', 'uC1', 'uC2', 'uOp'].forEach(function (k) {
                U[k] = gl.getUniformLocation(pm, k);
            });

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.disable(gl.DEPTH_TEST);
            sizeStage();
        }

        var dpr = 1;
        function sizeStage(r) {
            if (!gl || !stage) return false;
            r = r || stage.getBoundingClientRect();
            if (!r.width || !r.height) return false;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            var w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
            if (stage.width === w && stage.height === h) return true;
            stage.width = w; stage.height = h;
            gl.viewport(0, 0, w, h);
            return true;
        }

        var mx = 0, my = 0, tx = 0, ty = 0, clock = 0;

        function drawStage() {
            if (!gl || !pm) return;
            var r = stage.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) return;
            if (!sizeStage(r)) return;

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(pm);

            var aspect = stage.width / stage.height;
            var wideLayout = r.width >= 1024;
            gl.uniformMatrix4fv(U.uProj, false, M.persp(0.9, aspect, 0.1, 60));
            gl.uniformMatrix4fv(U.uView, false, wideLayout
                ? M.trans(1.3, 0, -4.5)
                : M.trans(0, 0.85, -5.9));

            var yaw = Math.sin(clock * 0.22) * 0.42 + mx * 0.5 + progress * 0.55;
            var model = M.mul(M.rotY(yaw), M.rotX(-0.10 + my * 0.26));
            gl.uniformMatrix4fv(U.uModel, false, model);

            var a = bufs[shownIdx], b = bufs[Math.min(shownIdx + 1, COUNT - 1)];
            attrib(gl, pm, 'aA', a, 3);
            attrib(gl, pm, 'aB', b, 3);
            attrib(gl, pm, 'aSeed', bSeed, 1);

            var t1 = TONES[shownIdx], t2 = TONES[Math.min(shownIdx + 1, COUNT - 1)];
            function lerp3(p, q, k, i) { return p[i] + (q[i] - p[i]) * k; }
            gl.uniform3f(U.uC1, lerp3(t1[0], t2[0], mixT, 0), lerp3(t1[0], t2[0], mixT, 1), lerp3(t1[0], t2[0], mixT, 2));
            gl.uniform3f(U.uC2, lerp3(t1[1], t2[1], mixT, 0), lerp3(t1[1], t2[1], mixT, 1), lerp3(t1[1], t2[1], mixT, 2));

            gl.uniform1f(U.uMix, mixT);
            gl.uniform1f(U.uBurst, burst);
            gl.uniform1f(U.uTime, clock);
            gl.uniform1f(U.uSize, (r.width < 800 ? 2.6 : 1.95) * dpr);
            gl.uniform1f(U.uOp, r.width < 800 ? 0.9 : 0.95);

            gl.drawArrays(gl.POINTS, 0, N);
        }

        initStage();
        readProgress();

        var finePointer = window.matchMedia('(pointer: fine)').matches;
        function onPointerMove(e) {
            tx = (e.clientX / window.innerWidth - 0.5) * 2;
            ty = (e.clientY / window.innerHeight - 0.5) * 2;
        }
        if (finePointer && !reduce) {
            window.addEventListener('pointermove', onPointerMove, { passive: true });
        }

        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () { readProgress(); ticking = false; });
        }
        window.addEventListener('scroll', onScroll, { passive: true });

        var rz;
        function onResize() {
            clearTimeout(rz);
            rz = setTimeout(function () {
                // if (reel) reel.style.height = (COUNT * 100) + 'svh';
                sizeStage(); readProgress();
                if (reduce) drawStage();
            }, 160);
        }
        window.addEventListener('resize', onResize, { passive: true });

        var last = performance.now();
        var rafId = null;
        var stopped = false;
        function loop(now) {
            if (stopped) return;
            var dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            clock += dt;
            mx += (tx - mx) * 0.06;
            my += (ty - my) * 0.06;
            readProgress();
            drawStage();
            rafId = requestAnimationFrame(loop);
        }

        if (reduce) {
            drawStage();
        } else {
            rafId = requestAnimationFrame(loop);
        }

        return function cleanup() {
            stopped = true;
            if (rafId) cancelAnimationFrame(rafId);
            clearTimeout(rz);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            onDotClick.forEach(function (d) { d.el.removeEventListener('click', d.handler); });
            dotEls.forEach(function (d) { d.remove(); });
        };
    }, []);

    return (
        <div className="reel-root" ref={rootRef}>
            <style>{REEL_CSS}</style>

            <section className="reel" id="reel" ref={reelRef}>
                <div className="reel-stage">
                    <canvas id="stage3d" ref={stageRef} aria-hidden="true"></canvas>
                    <div className="reel-grade" aria-hidden="true"></div>

                    <div className="reel-in">
                        <div className="shell">
                            <div className="slides" id="slides">

                                <article className="slide on">
                                    <p className="eyebrow">Trusted security partner</p>
                                    <h2 className="dsp">Innovate with AI.<br /><span className="tint">Secure with confidence.</span></h2>
                                    <p>Comprehensive security solutions, cloud infrastructure management, and expert consulting to safeguard your digital assets and ensure business continuity.</p>
                                    <div className="slide-meta">
                                        <span>24/7 Security Operations Center</span><span>ISO 27001 &amp; SOC 2 Certified</span><span>Zero Trust Architecture Specialists</span>
                                    </div>
                                    <div className="slide-actions">
                                        <a className="btn" href="mailto:contact@xsavlab.com?subject=Security%20assessment%20request">
                                            Request security assessment
                                            <svg className="arw" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
                                        </a>
                                        <a className="btn ghost" href="#detail">View services</a>
                                    </div>
                                </article>

                            </div>
                        </div>
                    </div>

                    <nav className="reel-nav" id="reelNav" ref={navRef} aria-label="Showcase sections"></nav>
                    <div className="reel-cue" id="reelCue" ref={cueRef} aria-hidden="true"><i></i>Scroll</div>
                </div>
            </section>
        </div>
    );
}
