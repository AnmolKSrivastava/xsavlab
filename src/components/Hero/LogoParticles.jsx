import React, { useEffect, useRef, useState } from 'react';

/**
 * Shared cyan logo particle field used by Hero (full) and Contact (idle/small).
 * Same WebGL mark as the hero hologram — scaled down for quieter surfaces.
 */
export default function LogoParticles({
  variant = 'hero',
  className = '',
  height = 220,
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [useFallback, setUseFallback] = useState(false);
  const idle = variant === 'idle';

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current || canvas;
    if (!canvas || !wrap) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce && idle) {
      setUseFallback(true);
      return undefined;
    }

    const gl =
      canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false }) ||
      canvas.getContext('experimental-webgl', { antialias: true, alpha: true });

    if (!gl || gl.isContextLost()) {
      if (idle) setUseFallback(true);
      return undefined;
    }

    const M = {
      ident() {
        return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      },
      persp(fov, a, n, f) {
        const t = 1 / Math.tan(fov / 2);
        const nf = 1 / (n - f);
        return new Float32Array([
          t / a, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) * nf, -1, 0, 0, 2 * f * n * nf, 0,
        ]);
      },
      mul(a, b) {
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
      trans(x, y, z) {
        const m = M.ident();
        m[12] = x;
        m[13] = y;
        m[14] = z;
        return m;
      },
      rotX(r) {
        const c = Math.cos(r);
        const s = Math.sin(r);
        const m = M.ident();
        m[5] = c;
        m[6] = s;
        m[9] = -s;
        m[10] = c;
        return m;
      },
      rotY(r) {
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

    function shader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    function program(vSrc, fSrc) {
      const vs = shader(gl.VERTEX_SHADER, vSrc);
      const fs = shader(gl.FRAGMENT_SHADER, fSrc);
      if (!vs || !fs) return null;
      const p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.warn(gl.getProgramInfoLog(p));
        return null;
      }
      return p;
    }

    function buffer(data) {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return b;
    }

    function attrib(p, name, b, size) {
      const l = gl.getAttribLocation(p, name);
      if (l < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.enableVertexAttribArray(l);
      gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
    }

    const drift = idle ? 0.012 : 0.009;
    const V =
      'attribute vec3 aA; attribute vec3 aB; attribute float aSeed;' +
      'uniform mat4 uProj,uView,uModel; uniform float uMix,uTime,uSize,uBurst;' +
      'varying float vSeed; varying float vDepth;' +
      'void main(){' +
      ' vec3 p = mix(aA,aB,uMix);' +
      ' vec3 dir = normalize(p + vec3(0.0001));' +
      ' p += dir * uBurst * (0.30 + aSeed*0.55);' +
      ` p += ${drift.toFixed(4)}*vec3(sin(uTime*0.8+aSeed*31.0), cos(uTime*0.7+aSeed*27.0), sin(uTime*0.6+aSeed*19.0));` +
      ' vec4 e = uView * uModel * vec4(p,1.0);' +
      ' vDepth = -e.z; vSeed = aSeed;' +
      ' gl_Position = uProj * e;' +
      ' gl_PointSize = uSize * (0.70 + aSeed*0.55) * (5.2 / max(vDepth, 0.7));' +
      '}';

    const F =
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

    const pm = program(V, F);
    if (!pm) {
      if (idle) setUseFallback(true);
      return undefined;
    }

    function rnd() {
      return Math.random();
    }

    function shapeMark(N, out) {
      const quads = [
        [[-1, 1], [0, 1], [0, 0]],
        [[0, 1], [1, 1], [1, 0]],
        [[-1, 0], [0, 0], [0, -1]],
        [[0, 0], [1, 0], [1, -1]],
      ];
      for (let i = 0; i < N; i++) {
        const t = quads[i & 3];
        const d = 0.17;
        let r1 = rnd();
        let r2 = rnd();
        if (r1 + r2 > 1) {
          r1 = 1 - r1;
          r2 = 1 - r2;
        }
        const x = t[0][0] + r1 * (t[1][0] - t[0][0]) + r2 * (t[2][0] - t[0][0]);
        const y = t[0][1] + r1 * (t[1][1] - t[0][1]) + r2 * (t[2][1] - t[0][1]);
        const z = rnd() < 0.72 ? (rnd() < 0.5 ? d : -d) : (rnd() * 2 - 1) * d;
        out[i * 3] = x * 1.08;
        out[i * 3 + 1] = y * 1.08;
        out[i * 3 + 2] = z;
      }
    }

    // const wide = window.innerWidth;
    // let N;
    // if (idle) {
    //   N = wide < 768 ? 12000 : 18000;
    // } else {
    //   N = wide >= 1200 ? 110000 : wide >= 800 ? 60000 : 34000;
    // }

    const wide = window.innerWidth;
    let N;

    if (idle) {
      N = wide < 768 ? 8000 : 18000;
    } else {
      N = wide >= 1200 ? 110000 : wide >= 800 ? 60000 : 10000;
    }

    const positions = new Float32Array(N * 3);
    shapeMark(N, positions);
    const bPos = buffer(positions);
    const seeds = new Float32Array(N);
    for (let i = 0; i < N; i++) seeds[i] = Math.random();
    const bSeed = buffer(seeds);

    const U = {};
    ['uProj', 'uView', 'uModel', 'uMix', 'uTime', 'uSize', 'uBurst', 'uC1', 'uC2', 'uOp'].forEach((k) => {
      U[k] = gl.getUniformLocation(pm, k);
    });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.disable(gl.DEPTH_TEST);

    const C1 = [0.22, 0.741, 0.973]; // #38BDF8
    const C2 = [0.55, 0.88, 1.0];

    let dpr = 1;
    let clock = 0;
    let raf = 0;
    let visible = true;
    let pageVisible = !document.hidden;
    let last = performance.now();
    let alive = true;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;

    function sizeCanvas() {
      if (gl.isContextLost()) return false;
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(r.width * dpr);
      const h = Math.round(r.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      return true;
    }

    function drawFrame() {
      if (gl.isContextLost() || !sizeCanvas()) return;

      const r = canvas.getBoundingClientRect();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(pm);

      const aspect = canvas.width / canvas.height;
      if (idle) {
        gl.uniformMatrix4fv(U.uProj, false, M.persp(0.85, aspect, 0.1, 40));
        gl.uniformMatrix4fv(U.uView, false, M.trans(0, 0, -4.2));
        // Match hero: gentle sway, not a full spin
        const yaw = Math.sin(clock * 0.22) * 0.42;
        const pitch = -0.1 + Math.sin(clock * 0.18) * 0.06;
        gl.uniformMatrix4fv(U.uModel, false, M.mul(M.rotY(yaw), M.rotX(pitch)));
        gl.uniform1f(U.uSize, 2.4 * dpr);
        gl.uniform1f(U.uOp, 0.95);
      } else {
        const wideLayout = r.width >= 1024;
        gl.uniformMatrix4fv(U.uProj, false, M.persp(0.9, aspect, 0.1, 60));
        gl.uniformMatrix4fv(
          U.uView,
          false,
          wideLayout
            ? M.trans(1.7, 0, -4.5)
            : r.width < 480
              ? M.trans(0, 1.65, -7.0)
              : M.trans(0, 1.0, -6.7)
        );
        const yaw = Math.sin(clock * 0.22) * 0.42 + mx * 0.5;
        const model = M.mul(M.rotY(yaw), M.rotX(-0.1 + my * 0.26));
        gl.uniformMatrix4fv(U.uModel, false, model);
        gl.uniform1f(U.uSize, (r.width < 800 ? 2.6 : 1.95) * dpr);
        gl.uniform1f(U.uOp, r.width < 800 ? 0.9 : 0.95);
      }

      attrib(pm, 'aA', bPos, 3);
      attrib(pm, 'aB', bPos, 3);
      attrib(pm, 'aSeed', bSeed, 1);

      gl.uniform3f(U.uC1, C1[0], C1[1], C1[2]);
      gl.uniform3f(U.uC2, C2[0], C2[1], C2[2]);
      gl.uniform1f(U.uMix, 0);
      gl.uniform1f(U.uBurst, 0);
      gl.uniform1f(U.uTime, clock);
      gl.drawArrays(gl.POINTS, 0, N);
    }

    function loop(now) {
      raf = 0;
      if (!alive || !visible || !pageVisible || gl.isContextLost()) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      if (!idle) {
        mx += (tx - mx) * 0.06;
        my += (ty - my) * 0.06;
      }
      drawFrame();
      if (!reduce) raf = requestAnimationFrame(loop);
    }

    function start() {
      if (!alive || raf || !visible || !pageVisible || gl.isContextLost()) return;
      last = performance.now();
      if (reduce) {
        drawFrame();
        return;
      }
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function onContextLost(e) {
      e.preventDefault();
      stop();
      if (idle) setUseFallback(true);
    }
    canvas.addEventListener('webglcontextlost', onContextLost, false);

    let io;
    if (idle) {
      io = new IntersectionObserver(
        (entries) => {
          visible = entries.some((e) => e.isIntersecting);
          if (visible) start();
          else stop();
        },
        { threshold: 0.05 }
      );
      io.observe(wrap);
    }

    function onVisibility() {
      pageVisible = !document.hidden;
      if (pageVisible) start();
      else stop();
    }
    document.addEventListener('visibilitychange', onVisibility);

    const finePointer = !idle && window.matchMedia('(pointer: fine)').matches;
    function onPointerMove(e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    if (finePointer && !reduce) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    let rz;
    function onResize() {
      clearTimeout(rz);
      rz = setTimeout(() => {
        sizeCanvas();
        if (reduce || !raf) drawFrame();
      }, idle ? 0 : 160);
    }
    window.addEventListener('resize', onResize, { passive: true });

    sizeCanvas();
    start();

    return () => {
      alive = false;
      stop();
      clearTimeout(rz);
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      // Never loseContext() — Strict Mode remount needs the same canvas context.
    };
  }, [idle]);

  if (idle && useFallback) {
    return (
      <div
        className={`relative w-full overflow-hidden pointer-events-none ${className}`}
        style={{ height, background: 'transparent' }}
        aria-hidden="true"
      >
        <img
          src="/xsavlab_logo.png"
          alt=""
          className="absolute inset-0 m-auto object-contain opacity-90"
          style={{ width: Math.min(height * 0.72, 140), height: Math.min(height * 0.72, 140) }}
        />
      </div>
    );
  }

  if (idle) {
    return (
      <div
        ref={wrapRef}
        className={`relative w-full overflow-hidden pointer-events-none ${className}`}
        style={{ height, background: 'transparent' }}
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
          style={{ background: 'transparent', display: 'block' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(55% 55% at 50% 50%, rgba(56,189,248,0.08), transparent 70%)',
          }}
        />
      </div>
    );
  }

  return (
    <canvas
      id="stage3d"
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ background: 'transparent' }}
    />
  );
}
