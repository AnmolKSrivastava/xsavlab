import React from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoParticles from './LogoParticles';

const REEL_CSS = `
.reel-root {
  color-scheme: dark;

  --void:      #0B0F19;
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

  --ui: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
  --display: var(--ui);
  --sans: var(--ui);
  --mono: var(--ui);

  --fs-label: 0.75rem;
  --shell: 1440px;
  --gut: clamp(18px, 4vw, 60px);
  --head: 0px;

  background: transparent;
  width: 100%;
  min-width: 100%;
  margin: 0;
  padding: 0;
  color: var(--ice);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  font-size: clamp(1rem, .5vw + .88rem, 1.0625rem);
  line-height: 1.62;
  -webkit-font-smoothing: antialiased;
}

.reel-root * { box-sizing: border-box; }

.reel-root ::selection { background: var(--amber); color: #12100A; }
.reel-root a { color: inherit; }
.reel-root :focus-visible { outline: 2px solid var(--amber); outline-offset: 3px; }
.reel-root p { margin: 0; }

.reel-root .dsp {
  font-family: inherit;
  font-weight: 700;
  text-transform: none;
  line-height: 1.15;
  letter-spacing: normal;
  margin: 0;
  text-wrap: balance;
}
.reel-root .tint { color: var(--signal); }
.reel-root .tint-a { color: var(--amber); }

.reel-root .shell { width: 100%; max-width: var(--shell); margin-inline: auto; padding-inline: var(--gut); }

.reel-root .slide p.eyebrow,
.reel-root .eyebrow {
  font-family: inherit !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  color: var(--signal) !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  margin: 0 !important;
  max-width: none !important;
  padding: 6px 12px !important;
  border-radius: 999px !important;
  background: rgba(56, 189, 248, 0.1) !important;
  border: 1px solid rgba(56, 189, 248, 0.3) !important;
  line-height: 1.2 !important;
}
.reel-root .eyebrow svg {
  width: 14px;
  height: 14px;
  flex: none;
  color: var(--signal);
}
.reel-root .eyebrow::before { display: none !important; content: none !important; }
.reel-root .eyebrow.amber { color: var(--amber); }

.reel-root .btn {
  --bg: var(--amber); --fg: #0B0F19;
  display: inline-flex; align-items: center; gap: 10px;
  padding: 12px 24px; background: var(--bg); color: var(--fg);
  border: 1px solid var(--bg); border-radius: 0.5rem;
  font-family: inherit; font-size: 0.875rem; font-weight: 600;
  letter-spacing: normal; text-transform: none; text-decoration: none;
  cursor: pointer; white-space: nowrap;
  transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease, border-color .3s ease, color .3s ease, background .3s ease;
}
.reel-root .btn:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--bg);
  color: var(--fg);
}
.reel-root .btn .arw { transition: transform .35s cubic-bezier(.22,1,.36,1); }
.reel-root .btn:hover .arw { transform: none; }
.reel-root .btn.ghost { --bg: transparent; --fg: var(--ice); border-color: var(--line-hot); }
.reel-root .btn.ghost:hover { border-color: var(--ice); box-shadow: none; }

.reel-root .hero-reel {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
}

.reel-root .reel-stage {
  position: sticky; top: 0;
  height: calc(100svh - 5rem);
  min-height: 0;
  overflow: hidden;
  display: flex;
  align-items: flex-start !important;
}

.reel-root #stage3d {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  z-index: 0;
}

.reel-root .reel-grade {
  position: absolute; inset: 0; pointer-events: none; z-index: 1;
  background:
    radial-gradient(58% 58% at 68% 50%, rgba(56,189,248,.07), transparent 68%),
    linear-gradient(90deg, var(--void) 0%, rgba(11,15,25,.86) 34%, rgba(11,15,25,.3) 62%, transparent 84%);
}
@media (max-width: 1023px) {
  .reel-root .reel-stage { align-items: flex-end !important; height: calc(100svh - 5rem); }
  .reel-root .reel-in {
    /* Leave room for the hologram without pushing copy below the viewport. */
    padding-top: clamp(3.5rem, 12svh, 6rem);
    padding-bottom: max(22px, env(safe-area-inset-bottom));
  }
  .reel-root #stage3d {
    opacity: 1;
  }
  .reel-root .reel-grade {
    background: linear-gradient(180deg,
      rgba(11,15,25,.10) 0%, rgba(11,15,25,.22) 26%, rgba(11,15,25,.72) 46%,
      rgba(11,15,25,.94) 62%, var(--void) 84%);
  }
}

.reel-root .reel-in {
  position: relative;
  z-index: 3;
  width: 100%;
  padding-top: 72px;
  padding-bottom: 0;
  margin-top: 0;
  pointer-events: auto;
}

.reel-root .slide-actions,
.reel-root .slide-actions .btn {
  position: relative;
  z-index: 5;
  pointer-events: auto;
  cursor: pointer;
}

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
  font-size: clamp(2.25rem, 4vw, 3rem);
  line-height: 1.15;
  max-width: 100%;
  overflow-wrap: anywhere;
}
.reel-root .slide > p:not(.eyebrow) {
  color: #d1d5db;
  max-width: 48ch;
  font-size: 1.25rem;
  line-height: 1.625;
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
  padding: 8px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(16, 25, 41, 0.72);
  color: var(--slate);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.reel-root .slide-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
}

@media (max-width: 1023px) {
  .reel-root .slides { max-width: 100%; }
  .reel-root .slide h2 { font-size: clamp(1.85rem, 7vw, 2.5rem); }
  .reel-root .slide > p:not(.eyebrow) { font-size: 1.05rem; max-width: 40ch; }
  .reel-root .slide { gap: clamp(8px, 1.8vh, 14px); }
  .reel-root .slide-meta span { max-width: 100%; white-space: normal; overflow-wrap: anywhere; }
}

@media (max-width: 400px) {
  .reel-root .slide h2 { font-size: 1.75rem; }
  .reel-root .slide > p:not(.eyebrow) { font-size: 1rem; }
  .reel-root .slide-actions { flex-direction: column; }
}

@media (max-width: 480px) and (min-height: 621px) {
  .reel-root .reel-in { padding-top: clamp(2.75rem, 9svh, 4.5rem); }
  .reel-root .slide { gap: 8px; }
}

@media (max-width: 480px) {
  .reel-root { --gut: 18px; }
  .reel-root .eyebrow { font-size: 0.6875rem !important; padding: 5px 9px !important; }
  .reel-root .slide-meta { gap: 5px; }
  .reel-root .slide-meta span { width: 100%; padding: 7px 10px; font-size: 0.75rem; }
  .reel-root .slide-actions { width: 100%; }
  .reel-root .slide-actions .btn { flex: 1 1 100%; justify-content: center; }
}

@media (max-width: 1023px) and (max-height: 620px) {
  .reel-root .reel-in { padding-top: 56px; padding-bottom: 18px; }
  .reel-root .slide { gap: 7px; }
  .reel-root .slide h2 { font-size: clamp(1.5rem, 5vw, 2rem); }
  .reel-root .slide > p:not(.eyebrow) { font-size: 1rem; line-height: 1.5; }
  .reel-root .slide-meta span { padding: 6px 10px; font-size: 0.75rem; }
  .reel-root .slide-actions .btn { padding: 10px 16px; font-size: 0.8125rem; }
}

@media (min-width: 1900px) {
  .reel-root { --shell: 1720px; --gut: clamp(64px, 6vw, 132px); }
  .reel-root .slides { max-width: 48%; }
  .reel-root .slide { gap: 22px; }
  .reel-root .slide h2 { font-size: clamp(3.6rem, 3.7vw, 5rem); }
  .reel-root .slide > p:not(.eyebrow) { max-width: 52ch; font-size: 1.08rem; }
  .reel-root .slide-meta { gap: 10px; }
  .reel-root .slide-meta span {
    padding: 12px 20px;
    font-size: 1rem;
    letter-spacing: 0.08em;
    font-weight: 600;
  }
}
`;

export default function Hero() {
  const navigate = useNavigate();

  const goToServices = (event) => {
    event.preventDefault();
    navigate('/services');
  };

  const requestAssessment = (event) => {
    event.preventDefault();
    navigate('/contact');
  };

  return (
    <div className="reel-root">
      <style>{REEL_CSS}</style>

      <section className="hero-reel" id="hero-reel">
        <div className="reel-stage">
          <LogoParticles variant="hero" />
          <div className="reel-grade" aria-hidden="true" />

          <div className="reel-in">
            <div className="shell">
              <div className="slides" id="slides">
                <article className="slide on">
                  <div className="eyebrow">
                    <Shield aria-hidden="true" />
                    <span>Your Trusted security partner</span>
                  </div>
                  <h2 className="dsp">
                    Innovate with AI.
                    <br />
                    <span className="tint">Secure with confidence.</span>
                  </h2>
                  <p>
                    Comprehensive security solutions, cloud infrastructure management, and expert
                    consulting to safeguard your digital assets and ensure business continuity.
                  </p>
                  <div className="slide-meta">
                    <span>24/7 Security Operations Center</span>
                    <span>ISO 27001 &amp; SOC 2 Certified</span>
                    <span>Zero Trust Architecture Specialists</span>
                  </div>
                  <div className="slide-actions">
                    <a className="btn" href="/contact" onClick={requestAssessment}>
                      Request security assessment
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
                    <a className="btn ghost" href="/services" onClick={goToServices}>
                      View services
                    </a>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
