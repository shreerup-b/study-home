import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Phone, Lock, Unlock, Calendar as CalendarIcon, Upload, Check, ChevronRight,
  ChevronLeft, Star, Shield, Globe, MapPin, GraduationCap, Users, Sparkles,
  X, Menu, ArrowRight, BookOpen, Brain, Target, Award, Clock, CreditCard,
  FileCheck, Search, Filter, Zap, Heart, TrendingUp, PlayCircle
} from "lucide-react";
import Globe3D from "react-globe.gl";

/* ============================================================================
   STUDY HOME — "Leader's Choice"
   Single-file React front-end prototype.
   Brand palette taken from the logo: Deep Navy, Amber/Gold, Slate Grey, White.
   All data here is realistic placeholder copy — swap for real data later.
============================================================================ */

/* ----------------------------- Design tokens ----------------------------- */
const GlobalStyle = () => (
  <style>{`
    :root{
      --navy-900:#0A1B33; --navy-800:#0E2445; --navy-700:#143160;
      --amber:#F6A21E; --amber-600:#E4820A; --gold:#FFC64D;
      --slate:#3E4A5E; --slate-2:#55627A; --lime:#FFD84D;
      --paper:#F3F6FC; --card:#FFFFFF; --ink:#111C2E; --muted:#5A6577;
      --line:#E4E9F2;
      --shadow:0 18px 44px -22px rgba(10,27,51,.45);
      --shadow-lg:0 34px 70px -30px rgba(10,27,51,.55);
    }
    *{box-sizing:border-box}
    .sh-root{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);background:var(--paper);-webkit-font-smoothing:antialiased}
    .display{font-family:Sora,Inter,system-ui,sans-serif;letter-spacing:-.02em}
    .num{font-family:Sora,Inter,sans-serif;font-variant-numeric:tabular-nums}
    a{color:inherit;text-decoration:none}
    .wrap{max-width:1180px;margin:0 auto;padding:0 22px}
    .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;
      letter-spacing:.16em;text-transform:uppercase;color:var(--amber-600)}
    .eyebrow-dark{color:var(--gold)}
    .glass{background:rgba(255,255,255,.08);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.14)}
    .card{background:var(--card);border:1px solid var(--line);border-radius:20px;box-shadow:var(--shadow)}
    .btn{display:inline-flex;align-items:center;gap:8px;border:0;cursor:pointer;font-weight:700;
      font-family:inherit;border-radius:12px;padding:13px 20px;font-size:15px;transition:transform .15s ease,box-shadow .2s ease,background .2s}
    .btn:active{transform:translateY(1px)}
    .btn-amber{background:linear-gradient(135deg,var(--amber),var(--amber-600));color:#231400;
      box-shadow:0 12px 26px -12px rgba(228,130,10,.8)}
    .btn-amber:hover{box-shadow:0 18px 34px -12px rgba(228,130,10,.95);transform:translateY(-2px)}
    .btn-navy{background:var(--navy-800);color:#fff}
    .btn-navy:hover{background:var(--navy-700);transform:translateY(-2px)}
    .btn-ghost{background:transparent;border:1.5px solid var(--line);color:var(--ink)}
    .btn-ghost:hover{border-color:var(--amber);color:var(--amber-600)}
    .chip{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;
      font-size:12.5px;font-weight:600;border:1px solid var(--line);background:#fff;cursor:pointer;transition:all .15s}
    .chip.on{background:var(--navy-800);color:#fff;border-color:var(--navy-800)}
    .reveal{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1)}
    .reveal.in{opacity:1;transform:none}
    input,select,textarea{font-family:inherit}
    @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
    @keyframes spinSlow{to{transform:rotate(360deg)}}
    @keyframes pulseRing{0%{transform:scale(.85);opacity:.55}70%{transform:scale(1.5);opacity:0}100%{opacity:0}}
    @keyframes shimmer{100%{background-position:200% 0}}
    @keyframes pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
    .section{padding:96px 0}
    .section-tight{padding:70px 0}
    .h2{font-size:clamp(30px,4.4vw,46px);font-weight:800;line-height:1.05;margin:14px 0 0}
    .lead{color:var(--muted);font-size:17px;line-height:1.6;max-width:640px;margin-top:14px}
    .grid{display:grid;gap:22px}
    @media(max-width:820px){.section{padding:64px 0}.hide-sm{display:none!important}}
    @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}
      .reveal{opacity:1;transform:none}}
    ::-webkit-scrollbar{width:10px;height:10px}
    ::-webkit-scrollbar-thumb{background:#cfd8ea;border-radius:8px}
  `}</style>
);

/* ------------------------------- Utilities ------------------------------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal") || [];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.14 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

function useCountUp(target, run, dur = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, target, dur]);
  return v;
}

/* The interlocking S-tiles from the logo — reused as brand signature */
function TileMark({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id="amberG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC64D" />
          <stop offset="1" stopColor="#E4820A" />
        </linearGradient>
      </defs>
      <rect x="16" y="10" width="34" height="80" rx="7" fill="url(#amberG)" />
      <rect x="50" y="10" width="34" height="80" rx="7" fill="#3E4A5E" />
      <path d="M64 30 H40 a8 8 0 0 0 0 16 h20 a8 8 0 0 1 0 16 H36"
        fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ================================ NAV BAR ================================ */
function Nav({ onBook }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const s = () => setSolid(window.scrollY > 30);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);
  const links = [
    ["Demo Suite", "#demo"], ["Har Ghar Shiksha", "#harghar"],
    ["Our Reach", "#reach"], ["Courses", "#courses"],
  ];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 60, transition: "all .3s",
      background: solid ? "rgba(10,27,51,.92)" : "var(--navy-900)",
      backdropFilter: solid ? "blur(12px)" : "none",
      borderBottom: solid ? "1px solid rgba(255,255,255,.08)" : "1px solid transparent"
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <TileMark size={38} />
          <div style={{ lineHeight: 1 }}>
            <div className="display" style={{ color: "#fff", fontWeight: 800, fontSize: 19 }}>STUDY HOME</div>
            <div style={{ color: "var(--gold)", fontSize: 11, fontWeight: 600, letterSpacing: ".05em" }}>Leader's Choice</div>
          </div>
        </a>
        <nav className="hide-sm" style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {links.map(([l, h]) => (
            <a key={h} href={h} style={{ color: "rgba(255,255,255,.85)", fontWeight: 600, fontSize: 14.5 }}>{l}</a>
          ))}
          <button className="btn btn-amber" onClick={onBook}><Sparkles size={16} /> Book Free Demo</button>
        </nav>
        <button className="btn btn-ghost hide-lg" style={{ padding: 10, color: "#fff", borderColor: "rgba(255,255,255,.3)" }}
          onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="wrap" style={{ paddingBottom: 18 }}>
          <div className="glass" style={{ borderRadius: 16, padding: 14, display: "grid", gap: 8 }}>
            {links.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)}
                style={{ color: "#fff", padding: "10px 12px", borderRadius: 10, fontWeight: 600 }}>{l}</a>
            ))}
            <button className="btn btn-amber" onClick={() => { setOpen(false); onBook(); }}>Book Free Demo</button>
          </div>
        </div>
      )}
      <style>{`@media(max-width:820px){.hide-lg{display:inline-flex!important}}
        @media(min-width:821px){.hide-lg{display:none!important}}`}</style>
    </header>
  );
}

/* =========================== FLOATING QUICK HUB =========================== */
function FloatingHub({ onBook, onJoin }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", right: 20, bottom: 22, zIndex: 70, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
      {open && (
        <div className="card" style={{ padding: 12, width: 232, animation: "pop .25s ease" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", padding: "2px 6px 8px" }}>QUICK ACCESS</div>
          <button className="btn btn-amber" style={{ width: "100%", marginBottom: 8, justifyContent: "flex-start" }} onClick={onBook}>
            <CalendarIcon size={16} /> Parent — Book Demo
          </button>
          <button className="btn btn-navy" style={{ width: "100%", marginBottom: 8, justifyContent: "flex-start" }} onClick={onJoin}>
            <GraduationCap size={16} /> Teacher — Register
          </button>
          <a className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }} href="tel:7980466379">
            <Phone size={16} /> Call 79804 66379
          </a>
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label="Quick access"
        style={{
          width: 60, height: 60, borderRadius: 20, border: 0, cursor: "pointer",
          background: "linear-gradient(135deg,var(--amber),var(--amber-600))",
          boxShadow: "var(--shadow-lg)", display: "grid", placeItems: "center",
          transition: "transform .2s", transform: open ? "rotate(45deg)" : "none"
        }}>
        {open ? <X size={26} color="#231400" /> : <Zap size={26} color="#231400" />}
      </button>
    </div>
  );
}

/* ================================= HERO ================================= */
function Hero({ onBook, onJoin }) {
  const [seen, setSeen] = useState(false);
  useEffect(() => { const t = setTimeout(() => setSeen(true), 200); return () => clearTimeout(t); }, []);
  const stats = [
    { n: 1200, s: "+", l: "Verified Tutors" },
    { n: 32000, s: "+", l: "Hours Taught" },
    { n: 96, s: "%", l: "Parent Rating" },
  ];
  return (
    <section id="top" style={{ position: "relative", overflow: "hidden",
      background: "radial-gradient(1100px 620px at 78% -8%, #1a3f78 0%, var(--navy-800) 42%, var(--navy-900) 100%)" }}>
      {/* ambient shapes */}
      <div style={{ position: "absolute", inset: 0, opacity: .5, background:
        "radial-gradient(400px 400px at 12% 88%, rgba(246,162,30,.16), transparent 60%)" }} />
      <div className="hide-sm" style={{ position: "absolute", right: "6%", top: "50%", transform: "translateY(-50%)", opacity: .92 }}>
        <div style={{ animation: "floaty 7s ease-in-out infinite" }}>
          <TileMark size={300} />
        </div>
      </div>
      <div className="wrap" style={{ position: "relative", paddingTop: 70, paddingBottom: 96, minHeight: 620, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <span className="eyebrow eyebrow-dark" style={{ opacity: seen ? 1 : 0, transition: "opacity .6s" }}>
          <Star size={13} /> Home Tutors · Online Classes · School Teacher Jobs
        </span>
        <h1 className="display" style={{
          color: "#fff", fontSize: "clamp(40px,6.6vw,74px)", fontWeight: 800, lineHeight: 1.02, margin: "16px 0 0", maxWidth: 760,
          transform: seen ? "none" : "translateY(24px)", opacity: seen ? 1 : 0, transition: "all .7s cubic-bezier(.2,.7,.2,1)"
        }}>
          Learning that comes<br /><span style={{ color: "var(--gold)" }}>home</span> to you.
        </h1>
        <p style={{ color: "rgba(255,255,255,.82)", fontSize: 19, lineHeight: 1.6, maxWidth: 560, marginTop: 20,
          opacity: seen ? 1 : 0, transition: "opacity .9s .15s" }}>
          Elite home tutoring across Kolkata, Newtown, Rajarhat & Howrah — plus online classes reaching
          learners Pan-India and abroad. Verified teachers, real results, a leader's choice.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 30 }}>
          <button className="btn btn-amber" onClick={onBook}><Sparkles size={17} /> Book Your Child's Free Demo</button>
          <button className="btn glass" style={{ color: "#fff" }} onClick={onJoin}>
            <GraduationCap size={17} /> Join as a Tutor <ArrowRight size={16} />
          </button>
        </div>
        {/* stat strip */}
        <div style={{ display: "flex", gap: 34, flexWrap: "wrap", marginTop: 52 }}>
          {stats.map((st, i) => <HeroStat key={i} {...st} run={seen} />)}
        </div>
      </div>
    </section>
  );
}
function HeroStat({ n, s, l, run }) {
  const v = useCountUp(n, run);
  return (
    <div>
      <div className="num" style={{ color: "#fff", fontSize: 34, fontWeight: 800 }}>
        {v.toLocaleString("en-IN")}<span style={{ color: "var(--amber)" }}>{s}</span>
      </div>
      <div style={{ color: "rgba(255,255,255,.6)", fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{l}</div>
    </div>
  );
}

/* ============================ SECTION HEADER ============================ */
function Head({ tag, title, lead, dark }) {
  return (
    <div className="reveal" style={{ maxWidth: 700 }}>
      <span className={"eyebrow" + (dark ? " eyebrow-dark" : "")}>{tag}</span>
      <h2 className="display h2" style={{ color: dark ? "#fff" : "var(--ink)" }}>{title}</h2>
      {lead && <p className="lead" style={{ color: dark ? "rgba(255,255,255,.75)" : "var(--muted)" }}>{lead}</p>}
    </div>
  );
}

/* ============================ 1. DEMO SUITE ============================ */
const ISC_CASES = [
  {
    level: "Easy", color: "#22A06B",
    subject: "ISC Chemistry",
    front: "A student mislabels an exothermic reaction as endothermic on their board sheet. Where does the reasoning break?",
    q: "Which sign convention did the student most likely reverse?",
    a: "They treated ΔH as positive for heat released. In an exothermic reaction the system loses heat, so ΔH is negative. The confusion usually comes from mixing the system's view with the surroundings' view.",
  },
  {
    level: "Medium", color: "#E4820A",
    subject: "ISC Physics",
    front: "A projectile's range is measured 8% short of the textbook value on a windy field. Diagnose the modelling gap.",
    q: "Name the assumption that fails outdoors — and one fix.",
    a: "The ideal model ignores air drag, which scales with v². Reintroducing a drag term (or measuring on a still day / indoors) closes most of the 8% gap. This is a classic 'model vs. reality' ISC discussion point.",
  },
  {
    level: "Hard", color: "#C4314B",
    subject: "ISC Mathematics",
    front: "A definite integral evaluates to a negative area for a curve that sits above the x-axis. Something is wrong.",
    q: "What single mistake produces a negative result here?",
    a: "The limits were swapped. ∫ from a to b of f(x)dx = −∫ from b to a. When bounds are reversed the sign flips, which silently turns a genuine positive area negative. Always order the limits before integrating.",
  },
];

function DemoSuite() {
  const ref = useReveal();
  return (
    <section id="demo" className="section" ref={ref} style={{ background: "linear-gradient(180deg,#fff, var(--paper))" }}>
      <div className="wrap">
        <Head tag="Prove it — right here" title="The Interactive Demo Suite"
          lead="No brochures. Try our actual academic rigour before you ever book. Real ISC case studies, a JEE Main quiz, a matching drill, and a full JEE Advanced multi-step challenge." />

        {/* ISC flip cards */}
        <div style={{ marginTop: 40 }}>
          <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <BookOpen size={18} color="var(--amber-600)" />
            <strong className="display" style={{ fontSize: 18 }}>ISC Case Studies</strong>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>Easy → Medium → Hard · tap to flip</span>
          </div>
          <div className="grid reveal" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))" }}>
            {ISC_CASES.map((c, i) => <FlipCard key={i} c={c} idx={i} />)}
          </div>
        </div>

        {/* JEE Main quiz + match */}
        <div className="grid reveal" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", marginTop: 40 }}>
          <JEEQuiz />
          <JEEMatch />
        </div>

        {/* JEE Advanced */}
        <div className="reveal" style={{ marginTop: 40 }}>
          <JEEAdvanced />
        </div>
      </div>
    </section>
  );
}

function FlipCard({ c, idx }) {
  const [flip, setFlip] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <div style={{ perspective: 1400 }}>
      <div onClick={() => setFlip(!flip)}
        style={{ position: "relative", height: 320, cursor: "pointer", transformStyle: "preserve-3d",
          transition: "transform .6s cubic-bezier(.2,.7,.2,1)", transform: flip ? "rotateY(180deg)" : "none" }}>
        {/* front */}
        <div className="card" style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", padding: 22, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".1em", color: c.color }}>{c.level.toUpperCase()}</span>
            <span className="num" style={{ fontSize: 30, fontWeight: 800, color: "var(--line)" }}>0{idx + 1}</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginTop: 14 }}>{c.subject}</div>
          <p style={{ fontSize: 16.5, lineHeight: 1.5, marginTop: 8, flex: 1 }}>{c.front}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: c.color, fontWeight: 700, fontSize: 14 }}>
            Open the case <ChevronRight size={16} />
          </div>
          <div style={{ height: 4, borderRadius: 4, marginTop: 12, background: c.color, opacity: .9 }} />
        </div>
        {/* back */}
        <div className="card" style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)",
          padding: 22, display: "flex", flexDirection: "column", background: "var(--navy-800)", color: "#fff", borderColor: "transparent" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--gold)", letterSpacing: ".08em" }}>{c.subject.toUpperCase()}</div>
          <p style={{ fontSize: 15, lineHeight: 1.5, marginTop: 10, fontWeight: 600 }}>{c.q}</p>
          <div style={{ flex: 1, marginTop: 10 }}>
            {show ? (
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,.85)", animation: "pop .3s" }}>{c.a}</p>
            ) : (
              <button className="btn btn-amber" style={{ padding: "9px 14px", fontSize: 13.5 }}
                onClick={(e) => { e.stopPropagation(); setShow(true); }}>Reveal the reasoning</button>
            )}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>Tap card to flip back</div>
        </div>
      </div>
    </div>
  );
}

function JEEQuiz() {
  const Qs = [
    { q: "A ball is thrown up at 20 m/s. Time to reach the top? (g=10)", opts: ["1 s", "2 s", "4 s", "0.5 s"], correct: 1 },
    { q: "Derivative of sin(x)·cos(x) is:", opts: ["cos(2x)", "sin(2x)", "−cos(2x)", "2sin x"], correct: 0 },
    { q: "pH of 10⁻³ M HCl is approximately:", opts: ["11", "7", "3", "1"], correct: 2 },
  ];
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  const done = i >= Qs.length;
  const choose = (o) => {
    if (pick !== null) return;
    setPick(o);
    if (o === Qs[i].correct) setScore((s) => s + 1);
    setTimeout(() => { setPick(null); setI((x) => x + 1); }, 950);
  };
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--navy-800)", display: "grid", placeItems: "center" }}>
          <Brain size={18} color="var(--gold)" />
        </div>
        <div><strong className="display" style={{ fontSize: 16 }}>JEE Main · Rapid Quiz</strong>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>3 questions · instant scoring</div></div>
      </div>
      {!done ? (
        <>
          <div style={{ height: 6, background: "var(--line)", borderRadius: 6, margin: "18px 0" }}>
            <div style={{ height: "100%", width: `${(i / Qs.length) * 100}%`, borderRadius: 6, background: "var(--amber)", transition: "width .4s" }} />
          </div>
          <p style={{ fontWeight: 700, fontSize: 16, minHeight: 46 }}>{Qs[i].q}</p>
          <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
            {Qs[i].opts.map((o, idx) => {
              const isC = idx === Qs[i].correct, sel = pick === idx;
              let bg = "#fff", bd = "var(--line)", col = "var(--ink)";
              if (pick !== null && isC) { bg = "#e9f9f0"; bd = "#22A06B"; col = "#177a4f"; }
              else if (sel && !isC) { bg = "#fdecec"; bd = "#C4314B"; col = "#a12639"; }
              return (
                <button key={idx} onClick={() => choose(idx)}
                  style={{ textAlign: "left", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${bd}`,
                    background: bg, color: col, fontWeight: 600, cursor: pick === null ? "pointer" : "default", transition: "all .2s" }}>
                  {o}{pick !== null && isC && <Check size={16} style={{ float: "right" }} />}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "26px 0", animation: "pop .35s" }}>
          <Award size={40} color="var(--amber)" />
          <div className="num" style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>{score}/{Qs.length}</div>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
            {score === 3 ? "Sharp! This is the pace our JEE track builds." : "Good start — our tutors close exactly these gaps."}</p>
          <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => { setI(0); setScore(0); }}>Try again</button>
        </div>
      )}
    </div>
  );
}

function JEEMatch() {
  const pairs = [
    { l: "Ohm's Law", r: "V = IR" },
    { l: "Kinetic Energy", r: "½mv²" },
    { l: "Ideal Gas", r: "PV = nRT" },
  ];
  const [rights] = useState(() => [...pairs].sort(() => Math.random() - 0.5));
  const [selL, setSelL] = useState(null);
  const [matched, setMatched] = useState({}); // l -> r
  const [wrong, setWrong] = useState(null);
  const connect = (rVal) => {
    if (selL == null) return;
    const correct = pairs.find((p) => p.l === selL)?.r === rVal;
    if (correct) setMatched((m) => ({ ...m, [selL]: rVal }));
    else { setWrong(rVal); setTimeout(() => setWrong(null), 500); }
    setSelL(null);
  };
  const allDone = Object.keys(matched).length === pairs.length;
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--navy-800)", display: "grid", placeItems: "center" }}>
          <Target size={18} color="var(--gold)" />
        </div>
        <div><strong className="display" style={{ fontSize: 16 }}>JEE Main · Match the Formula</strong>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Tap a concept, then its formula</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
        <div style={{ display: "grid", gap: 10 }}>
          {pairs.map((p) => {
            const done = matched[p.l];
            return (
              <button key={p.l} disabled={!!done} onClick={() => setSelL(p.l)}
                style={{ padding: "12px", borderRadius: 12, fontWeight: 700, cursor: done ? "default" : "pointer",
                  border: `1.5px solid ${selL === p.l ? "var(--amber)" : "var(--line)"}`,
                  background: done ? "#e9f9f0" : selL === p.l ? "#fff7e9" : "#fff",
                  color: done ? "#177a4f" : "var(--ink)", transition: "all .18s" }}>
                {p.l}{done && <Check size={15} style={{ float: "right" }} />}
              </button>
            );
          })}
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {rights.map((p) => {
            const usedBy = Object.entries(matched).find(([, r]) => r === p.r);
            return (
              <button key={p.r} disabled={!!usedBy} onClick={() => connect(p.r)}
                className="num"
                style={{ padding: "12px", borderRadius: 12, fontWeight: 700, cursor: usedBy ? "default" : "pointer",
                  border: `1.5px solid ${wrong === p.r ? "#C4314B" : usedBy ? "#22A06B" : "var(--line)"}`,
                  background: usedBy ? "#e9f9f0" : "#fff", color: usedBy ? "#177a4f" : "var(--ink)",
                  transition: "all .18s", transform: wrong === p.r ? "translateX(-4px)" : "none" }}>
                {p.r}
              </button>
            );
          })}
        </div>
      </div>
      {allDone && <div style={{ marginTop: 14, textAlign: "center", color: "#177a4f", fontWeight: 700, animation: "pop .3s" }}>
        <Check size={16} /> All matched — that's exam reflex.</div>}
    </div>
  );
}

function JEEAdvanced() {
  const steps = [
    { t: "Set up", q: "A block slides down a frictionless incline (θ=30°). First, what drives the motion?",
      opts: ["Full weight mg", "Component mg·sinθ", "Normal force", "mg·cosθ"], correct: 1 },
    { t: "Acceleration", q: "With g=10, the acceleration along the incline is:",
      opts: ["10 m/s²", "5 m/s²", "8.66 m/s²", "2.5 m/s²"], correct: 1 },
    { t: "Kinematics", q: "Starting from rest, speed after sliding 4 m along the incline (v²=2as):",
      opts: ["√40 ≈ 6.3 m/s", "20 m/s", "√20 ≈ 4.5 m/s", "8 m/s"], correct: 0 },
    { t: "Extend", q: "Now add friction μ=0.2. The new acceleration becomes:",
      opts: ["5 m/s²", "3.27 m/s²", "1.73 m/s²", "4.13 m/s²"], correct: 1 },
  ];
  const [s, setS] = useState(0);
  const [pick, setPick] = useState(null);
  const [ok, setOk] = useState([]);
  const finished = s >= steps.length;
  const submit = (o) => {
    setPick(o);
    const good = o === steps[s].correct;
    setTimeout(() => {
      setOk((a) => [...a, good]); setPick(null); setS((x) => x + 1);
    }, 850);
  };
  const correctCount = ok.filter(Boolean).length;
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ background: "var(--navy-800)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,var(--amber),var(--amber-600))", display: "grid", placeItems: "center" }}>
            <Zap size={20} color="#231400" />
          </div>
          <div>
            <strong className="display" style={{ color: "#fff", fontSize: 17 }}>JEE Advanced · Multi-Step Challenge</strong>
            <div style={{ color: "rgba(255,255,255,.6)", fontSize: 12.5 }}>Inclined-plane dynamics · one problem, four layers</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          {steps.map((st, i) => (
            <div key={i} title={st.t} style={{ width: 30, height: 6, borderRadius: 4,
              background: i < s ? (ok[i] ? "#22A06B" : "#C4314B") : i === s ? "var(--gold)" : "rgba(255,255,255,.2)" }} />
          ))}
        </div>
      </div>
      <div style={{ padding: 24 }}>
        {!finished ? (
          <>
            <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: ".08em", color: "var(--amber-600)" }}>
              STEP {s + 1} / {steps.length} · {steps[s].t.toUpperCase()}
            </div>
            <p style={{ fontWeight: 700, fontSize: 17, marginTop: 8 }}>{steps[s].q}</p>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 14 }}>
              {steps[s].opts.map((o, idx) => {
                const isC = idx === steps[s].correct, sel = pick === idx;
                let bd = "var(--line)", bg = "#fff", col = "var(--ink)";
                if (pick !== null && isC) { bd = "#22A06B"; bg = "#e9f9f0"; col = "#177a4f"; }
                else if (sel && !isC) { bd = "#C4314B"; bg = "#fdecec"; col = "#a12639"; }
                return (
                  <button key={idx} disabled={pick !== null} onClick={() => submit(idx)} className="num"
                    style={{ textAlign: "left", padding: "13px 14px", borderRadius: 12, border: `1.5px solid ${bd}`,
                      background: bg, color: col, fontWeight: 600, cursor: pick === null ? "pointer" : "default", transition: "all .2s" }}>
                    {o}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0", animation: "pop .35s" }}>
            <div className="num" style={{ fontSize: 40, fontWeight: 800, color: correctCount >= 3 ? "#22A06B" : "var(--amber-600)" }}>
              {correctCount}/{steps.length}
            </div>
            <p style={{ fontWeight: 700, fontSize: 18, marginTop: 4 }}>
              {correctCount === 4 ? "Elite. That's Advanced-level composure." : "Layered problems reward layered practice."}</p>
            <p style={{ color: "var(--muted)", maxWidth: 460, margin: "8px auto 0" }}>
              This is exactly how our JEE Advanced mentors teach — one physical scene, peeled apart step by step until every layer clicks.</p>
            <button className="btn btn-navy" style={{ marginTop: 16 }} onClick={() => { setS(0); setOk([]); }}>Restart challenge</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== 2. HAR GHAR SHIKSHA ==================== */
function HarGhar({ openParent }) {
  const ref = useReveal();
  const [tab, setTab] = useState("teacher");
  return (
    <section id="harghar" className="section" ref={ref} style={{ background: "#fff" }}>
      <div className="wrap">
        <Head tag="An initiative by Study Home" title="Har Ghar Shiksha"
          lead="Premium home tutoring across Kolkata, Newtown, Rajarhat and Howrah. Register as a tutor, or book a free demo for your child — verified, secure, and simple." />

        <div className="reveal" style={{ display: "inline-flex", gap: 6, background: "var(--paper)", padding: 6, borderRadius: 14, marginTop: 30 }}>
          <button className={"chip" + (tab === "teacher" ? " on" : "")} style={{ padding: "10px 18px" }} onClick={() => setTab("teacher")}>
            <GraduationCap size={15} /> Teacher Registration</button>
          <button className={"chip" + (tab === "parent" ? " on" : "")} style={{ padding: "10px 18px" }} onClick={() => setTab("parent")}>
            <CalendarIcon size={15} /> Parent — Book Demo</button>
        </div>

        <div className="reveal" style={{ marginTop: 22 }}>
          {tab === "teacher" ? <TeacherReg /> : <ParentBooking openParent={openParent} />}
        </div>

        {/* directory */}
        <div className="reveal" style={{ marginTop: 56 }}>
          <TeacherDirectory />
        </div>
      </div>
    </section>
  );
}

function TeacherReg() {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const steps = ["Basics", "Expertise", "Secure Upload", "Done"];
  const addFiles = (list) => {
    const arr = Array.from(list).map((f) => ({ name: f.name, size: (f.size / 1024).toFixed(0) + " KB" }));
    setFiles((p) => [...p, ...arr]);
  };
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", display: "grid", gridTemplateColumns: "minmax(0,1fr)" }}>
      <div style={{ padding: "22px 26px 0" }}>
        {/* progress */}
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{ height: 6, borderRadius: 4, background: i <= step ? "var(--amber)" : "var(--line)", transition: "background .3s" }} />
              <div style={{ fontSize: 11.5, fontWeight: 700, marginTop: 6, color: i <= step ? "var(--ink)" : "var(--muted)" }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 26px 26px" }}>
        {step === 0 && (
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Full name" ph="e.g. Ananya Sen" />
            <Field label="Phone" ph="98304 99675" />
            <Field label="Email" ph="you@email.com" />
            <Field label="Area you can teach in" ph="Newtown / Rajarhat" />
          </div>
        )}
        {step === 1 && (
          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label style={lbl}>Subjects & boards</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {["Physics", "Chemistry", "Maths", "Biology", "English", "ICSE", "ISC", "CBSE", "JEE", "NEET"].map((t) => <Toggle key={t} label={t} />)}
              </div>
            </div>
            <Field label="Years of experience" ph="e.g. 5" />
          </div>
        )}
        {step === 2 && (
          <div>
            <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
              style={{ border: `2px dashed ${drag ? "var(--amber)" : "var(--line)"}`, borderRadius: 16, padding: 30, textAlign: "center",
                background: drag ? "#fff7e9" : "var(--paper)", transition: "all .2s" }}>
              <Upload size={30} color="var(--amber-600)" />
              <p style={{ fontWeight: 700, marginTop: 10 }}>Drag & drop your Resume + ID proof</p>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>PDF, JPG or PNG · or</p>
              <label className="btn btn-ghost" style={{ marginTop: 10, cursor: "pointer" }}>
                Browse files
                <input type="file" multiple hidden onChange={(e) => addFiles(e.target.files)} />
              </label>
            </div>
            {files.length > 0 && (
              <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--paper)", borderRadius: 10 }}>
                    <FileCheck size={18} color="#22A06B" />
                    <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{f.name}</span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{f.size}</span>
                    <span style={{ fontSize: 11.5, color: "#177a4f", fontWeight: 700 }}>Scanned ✓</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16, padding: 14, borderRadius: 12, background: "#f0f5ff" }}>
              <Shield size={20} color="var(--navy-700)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.55 }}>
                Files are sent over encrypted HTTPS to a <strong>private cloud bucket (S3 / Supabase)</strong>, run through automated
                file-sanitation & malware scanning, and are only ever retrieved through short-lived, time-expiring secure links. Your documents are never public.
              </p>
            </div>
          </div>
        )}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "24px 0", animation: "pop .35s" }}>
            <div style={{ width: 62, height: 62, borderRadius: 20, background: "#e9f9f0", display: "grid", placeItems: "center", margin: "0 auto" }}>
              <Check size={30} color="#22A06B" />
            </div>
            <h3 className="display" style={{ fontSize: 22, marginTop: 14 }}>Application received</h3>
            <p style={{ color: "var(--muted)", maxWidth: 420, margin: "8px auto 0" }}>
              Our team verifies every tutor before they appear in the directory. We'll call you on the number you shared within 48 hours.</p>
          </div>
        )}

        {step < 3 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
            <button className="btn btn-ghost" disabled={step === 0} style={{ opacity: step === 0 ? .4 : 1 }} onClick={() => setStep((s) => s - 1)}>
              <ChevronLeft size={16} /> Back</button>
            <button className="btn btn-amber" onClick={() => setStep((s) => s + 1)}>
              {step === 2 ? "Submit application" : "Continue"} <ChevronRight size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
const lbl = { fontSize: 13, fontWeight: 700, color: "var(--slate)" };
function Field({ label, ph }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <input placeholder={ph} style={{ width: "100%", marginTop: 6, padding: "12px 14px", borderRadius: 12, border: "1.5px solid var(--line)", fontSize: 15, outline: "none" }}
        onFocus={(e) => (e.target.style.borderColor = "var(--amber)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--line)")} />
    </div>
  );
}
function Toggle({ label }) {
  const [on, setOn] = useState(false);
  return <button className={"chip" + (on ? " on" : "")} onClick={() => setOn(!on)}>{label}</button>;
}

function ParentBooking({ openParent }) {
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [sel, setSel] = useState(null);
  const [slot, setSlot] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const slots = ["4:00 PM", "5:30 PM", "7:00 PM"];
  const y = month.getFullYear(), m = month.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const monthName = month.toLocaleString("en-IN", { month: "long", year: "numeric" });
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  const isPast = (d) => new Date(y, m, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (confirmed) {
    return (
      <div className="card" style={{ padding: 34, textAlign: "center", animation: "pop .35s" }}>
        <div style={{ width: 62, height: 62, borderRadius: 20, background: "#fff7e9", display: "grid", placeItems: "center", margin: "0 auto" }}>
          <CalendarIcon size={28} color="var(--amber-600)" />
        </div>
        <h3 className="display" style={{ fontSize: 22, marginTop: 14 }}>Demo booked 🎉</h3>
        <p style={{ color: "var(--muted)", marginTop: 6 }}>
          {sel} {monthName.split(" ")[0]} · {slot}. A coordinator will confirm on WhatsApp shortly.</p>
        <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => { setConfirmed(false); setSel(null); setSlot(null); }}>Book another</button>
      </div>
    );
  }
  return (
    <div className="card" style={{ padding: 24, display: "grid", gap: 24, gridTemplateColumns: "minmax(0,1fr) minmax(0,260px)" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <strong className="display" style={{ fontSize: 17 }}>Book your child's free demo</strong>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button className="chip" style={{ padding: 8 }} onClick={() => setMonth(new Date(y, m - 1, 1))}><ChevronLeft size={15} /></button>
            <span style={{ fontWeight: 700, fontSize: 14, minWidth: 130, textAlign: "center" }}>{monthName}</span>
            <button className="chip" style={{ padding: 8 }} onClick={() => setMonth(new Date(y, m + 1, 1))}><ChevronRight size={15} /></button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "var(--muted)", padding: 4 }}>{d}</div>
          ))}
          {cells.map((d, i) => d === null ? <div key={i} /> : (
            <button key={i} disabled={isPast(d)} onClick={() => setSel(d)}
              style={{ aspectRatio: "1", borderRadius: 10, border: "1.5px solid " + (sel === d ? "var(--amber)" : "transparent"),
                background: sel === d ? "linear-gradient(135deg,var(--amber),var(--amber-600))" : isPast(d) ? "transparent" : "var(--paper)",
                color: sel === d ? "#231400" : isPast(d) ? "#c3cad6" : "var(--ink)", fontWeight: 700, fontSize: 14,
                cursor: isPast(d) ? "default" : "pointer", transition: "all .15s" }}>{d}</button>
          ))}
        </div>
      </div>
      <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--slate)" }}>Pick a time slot</div>
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          {slots.map((s) => (
            <button key={s} disabled={!sel} onClick={() => setSlot(s)}
              className={"chip" + (slot === s ? " on" : "")} style={{ justifyContent: "center", opacity: sel ? 1 : .5 }}>
              <Clock size={14} /> {s}</button>
          ))}
        </div>
        <button className="btn btn-amber" style={{ width: "100%", marginTop: 18, justifyContent: "center" }}
          disabled={!sel || !slot} onClick={() => setConfirmed(true)}>
          Confirm free demo</button>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
          No payment needed. A 30-minute trial with a subject-matched tutor.</p>
      </div>
    </div>
  );
}

const TEACHERS = [
  { n: "Ananya Sen", subj: "Physics", board: "ISC", tags: ["JEE"], area: "Newtown", exp: 8, rating: 4.9, ph: "7980466379" },
  { n: "Rohit Das", subj: "Mathematics", board: "CBSE", tags: ["JEE"], area: "Rajarhat", exp: 6, rating: 4.8, ph: "9830499675" },
  { n: "Meghna Roy", subj: "Biology", board: "ISC", tags: ["NEET"], area: "Kolkata", exp: 10, rating: 5.0, ph: "7980466379" },
  { n: "Arjun Iyer", subj: "Chemistry", board: "CBSE", tags: ["JEE", "NEET"], area: "Howrah", exp: 5, rating: 4.7, ph: "9830499675" },
  { n: "Priya Nair", subj: "English", board: "ICSE", tags: ["Hobby"], area: "Newtown", exp: 7, rating: 4.9, ph: "7980466379" },
  { n: "Sourav Ghosh", subj: "Mathematics", board: "ISC", tags: ["JEE"], area: "Kolkata", exp: 9, rating: 4.8, ph: "9830499675" },
];

function TeacherDirectory() {
  const [subj, setSubj] = useState("All");
  const [tag, setTag] = useState("All");
  const [q, setQ] = useState("");
  const subjects = ["All", ...new Set(TEACHERS.map((t) => t.subj))];
  const tags = ["All", "JEE", "NEET", "Hobby"];
  const list = TEACHERS.filter((t) =>
    (subj === "All" || t.subj === subj) &&
    (tag === "All" || t.tags.includes(tag)) &&
    (t.n.toLowerCase().includes(q.toLowerCase()) || t.area.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Users size={18} color="var(--amber-600)" />
        <strong className="display" style={{ fontSize: 20 }}>The Verified Teacher Directory</strong>
      </div>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>Every tutor below is background-checked. Contact numbers stay masked until a parent is verified.</p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid var(--line)", borderRadius: 12, padding: "9px 12px", flex: "1 1 220px" }}>
          <Search size={16} color="var(--muted)" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or area…"
            style={{ border: 0, outline: 0, fontSize: 14.5, width: "100%", background: "transparent" }} />
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Filter size={15} color="var(--muted)" />
          {subjects.map((s) => <button key={s} className={"chip" + (subj === s ? " on" : "")} onClick={() => setSubj(s)}>{s}</button>)}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {tags.map((t) => <button key={t} className={"chip" + (tag === t ? " on" : "")} onClick={() => setTag(t)}>{t}</button>)}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
        {list.map((t, i) => <TeacherCard key={i} t={t} />)}
        {list.length === 0 && <p style={{ color: "var(--muted)" }}>No tutors match those filters yet — try widening them.</p>}
      </div>
    </div>
  );
}

function TeacherCard({ t }) {
  const [unlocked, setUnlocked] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const masked = "+91 " + t.ph.slice(0, 3) + " ••• ••" + t.ph.slice(-2);
  const doUnlock = () => {
    setVerifying(true);
    setTimeout(() => { setVerifying(false); setUnlocked(true); }, 1100);
  };
  const initials = t.n.split(" ").map((x) => x[0]).join("");
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800,
          background: "linear-gradient(135deg,var(--navy-700),var(--slate))" }}>{initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{t.n}</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{t.subj} · {t.board}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3, fontWeight: 700, fontSize: 14 }}>
          <Star size={14} fill="var(--amber)" color="var(--amber)" /> {t.rating}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "14px 0" }}>
        <span className="chip" style={{ cursor: "default" }}><MapPin size={12} /> {t.area}</span>
        <span className="chip" style={{ cursor: "default" }}>{t.exp} yrs</span>
        {t.tags.map((x) => <span key={x} className="chip" style={{ cursor: "default", color: "var(--amber-600)", borderColor: "var(--amber)" }}>{x}</span>)}
      </div>
      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
        {unlocked ? (
          <a href={`tel:${t.ph}`} className="btn btn-navy" style={{ width: "100%", justifyContent: "center", animation: "pop .3s" }}>
            <Phone size={15} /> +91 {t.ph}</a>
        ) : (
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={doUnlock} disabled={verifying}>
            {verifying ? <><span style={{ width: 14, height: 14, border: "2px solid var(--amber)", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spinSlow .7s linear infinite" }} /> Verifying parent…</>
              : <><Lock size={14} /> {masked} — unlock</>}
          </button>
        )}
      </div>
    </div>
  );
}

/* ==================== 3. DIGITAL SHIKSHA / OUR REACH ==================== */
const LOCAL = [
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, tutors: 420, hours: 12800 },
  { name: "Newtown", lat: 22.5800, lng: 88.4600, tutors: 260, hours: 7400 },
  { name: "Rajarhat", lat: 22.6200, lng: 88.4500, tutors: 180, hours: 5100 },
  { name: "Howrah", lat: 22.5958, lng: 88.2636, tutors: 150, hours: 4200 },
];
const GLOBAL = [
  { name: "Pan India", lat: 22.0, lng: 79.0, tutors: 1200, hours: 32000 },
  { name: "Dubai / Middle East", lat: 25.2048, lng: 55.2708, tutors: 140, hours: 6100 },
  { name: "United States", lat: 38.0, lng: -97.0, tutors: 90, hours: 3800 },
  { name: "Southeast Asia", lat: 1.3521, lng: 103.8198, tutors: 110, hours: 4600 },
];
function GlobeStatCard({ node }) {
  // re-mounted on every marker click (via key) so the pop + count-up replay
  const t = useCountUp(node.tutors, true, 700);
  const h = useCountUp(node.hours, true, 900);
  return (
    <div className="card" style={{ position: "absolute", left: 16, bottom: 16, padding: 14, width: 200, animation: "pop .28s ease" }}>
      <div style={{ fontWeight: 800, fontSize: 15 }}>{node.name}</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13 }}>
        <span style={{ color: "var(--muted)" }}>Tutors</span>
        <span className="num" style={{ fontWeight: 800, color: "var(--amber-600)" }}>{t}+</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 13 }}>
        <span style={{ color: "var(--muted)" }}>Hours taught</span>
        <span className="num" style={{ fontWeight: 800 }}>{h.toLocaleString("en-IN")}+</span>
      </div>
    </div>
  );
}

function ReachGlobe({ scope }) {
  const globeRef = useRef();
  const wrapRef = useRef();
  const [size, setSize] = useState(460);
  const [sel, setSel] = useState(null);
  const points = scope === "local" ? LOCAL : GLOBAL;
  const altFor = (s) => (s === "local" ? 0.4 : 2.1); // local = zoomed right in on Kolkata

  // size the globe to its container
  useEffect(() => {
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width;
      setSize(Math.max(300, Math.min(w - 16, 560)));
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // keep the globe spinning (must be re-asserted; the ref isn't ready on first render)
  const spin = () => {
    const g = globeRef.current;
    if (!g) return;
    const c = g.controls();
    c.autoRotate = true;
    c.autoRotateSpeed = 0.5;
    c.enableZoom = false; // don't hijack page scroll
  };

  // fly to the region + keep spinning whenever the toggle changes
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    setSel(null);
    spin();
    const p = points[0];
    g.pointOfView({ lat: p.lat, lng: p.lng, altitude: altFor(scope) }, 1300);
  }, [scope]); // eslint-disable-line

  const H = Math.max(400, size);
  return (
    <div ref={wrapRef} className="glass"
      style={{ borderRadius: 22, padding: 8, position: "relative", minHeight: 420, display: "grid", placeItems: "center", overflow: "hidden" }}>
      <Globe3D
        ref={globeRef}
        width={size}
        height={H}
        onGlobeReady={() => {
          // this fires once the globe truly exists — the reliable place to start rotation
          spin();
          const p = points[0];
          globeRef.current.pointOfView({ lat: p.lat, lng: p.lng, altitude: altFor(scope) }, 0);
        }}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#F6A21E"
        atmosphereAltitude={0.2}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "#FFC64D"}
        pointAltitude={0.06}
        pointRadius={0.6}
        pointLabel={(d) =>
          `<div style="font-family:Sora,sans-serif;font-weight:700;background:#0A1B33;color:#fff;padding:6px 10px;border-radius:8px;font-size:12px">${d.name} — click for stats</div>`}
        onPointClick={(d) => setSel(d)}
        ringsData={points}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => (t) => `rgba(246,162,30,${1 - t})`}
        ringMaxRadius={4}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1000}
      />
      <div style={{ position: "absolute", left: 16, top: 14, color: "rgba(255,255,255,.6)", fontSize: 12.5, fontWeight: 600, pointerEvents: "none" }}>
        Drag to spin the globe · click any marker
      </div>
      {sel && <GlobeStatCard key={sel.name} node={sel} />}
    </div>
  );
}

function DigitalShiksha() {
  const ref = useReveal();
  const [scope, setScope] = useState("local");
  return (
    <section id="reach" className="section" ref={ref}
      style={{ background: "radial-gradient(900px 500px at 80% 0%, #14315C, var(--navy-800) 55%, var(--navy-900))" }}>
      <div className="wrap">
        <Head dark tag="Digital Shiksha · Our Reach" title="Online classes, everywhere"
          lead="From four Kolkata neighbourhoods to learners across India, Dubai, the US and Southeast Asia. Spin the globe and click any marker to see it live." />

        <div className="reveal" style={{ display: "inline-flex", gap: 6, background: "rgba(255,255,255,.08)", padding: 6, borderRadius: 14, marginTop: 26 }}>
          <button onClick={() => setScope("local")} className="chip"
            style={{ padding: "10px 18px", background: scope === "local" ? "var(--amber)" : "transparent", color: scope === "local" ? "#231400" : "#fff", border: 0 }}>
            <MapPin size={15} /> Local Reach</button>
          <button onClick={() => setScope("global")} className="chip"
            style={{ padding: "10px 18px", background: scope === "global" ? "var(--amber)" : "transparent", color: scope === "global" ? "#231400" : "#fff", border: 0 }}>
            <Globe size={15} /> Global Reach</button>
        </div>

        <div className="grid reveal" style={{ gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", marginTop: 24, alignItems: "stretch" }}>
          <ReachGlobe scope={scope} />
          {/* live stat panel */}
          <div style={{ display: "grid", gap: 16 }}>
            <SuccessRing scope={scope} />
            <GrowthBars scope={scope} />
          </div>
        </div>
      </div>
    </section>
  );
}
function SuccessRing({ scope }) {
  const pct = scope === "local" ? 94 : 89;
  const v = useCountUp(pct, true, 1200);
  const R = 42, C = 2 * Math.PI * R;
  return (
    <div className="glass" style={{ borderRadius: 22, padding: 20, display: "flex", gap: 18, alignItems: "center" }}>
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10" />
        <circle cx="55" cy="55" r={R} fill="none" stroke="var(--amber)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C - (C * v) / 100} transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dashoffset .3s" }} />
        <text x="55" y="60" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" style={{ fontFamily: "Sora" }}>{v}%</text>
      </svg>
      <div>
        <div style={{ color: "var(--gold)", fontWeight: 800, fontSize: 15 }}>Goal-completion rate</div>
        <p style={{ color: "rgba(255,255,255,.72)", fontSize: 13.5, lineHeight: 1.5, marginTop: 4 }}>
          Share of {scope === "local" ? "Kolkata-region" : "worldwide"} learners who hit their target grade band within one term.</p>
      </div>
    </div>
  );
}
function GrowthBars({ scope }) {
  const data = scope === "local"
    ? [{ l: "'22", v: 30 }, { l: "'23", v: 55 }, { l: "'24", v: 78 }, { l: "'25", v: 100 }]
    : [{ l: "'22", v: 18 }, { l: "'23", v: 40 }, { l: "'24", v: 70 }, { l: "'25", v: 100 }];
  const [run, setRun] = useState(false);
  useEffect(() => { setRun(false); const t = setTimeout(() => setRun(true), 60); return () => clearTimeout(t); }, [scope]);
  return (
    <div className="glass" style={{ borderRadius: 22, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <TrendingUp size={16} color="var(--gold)" />
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Enrolment growth</span>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 120, marginTop: 16 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 100, display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", borderRadius: "8px 8px 0 0", background: "linear-gradient(180deg,var(--gold),var(--amber-600))",
                height: run ? `${d.v}%` : 0, transition: `height .8s cubic-bezier(.2,.7,.2,1) ${i * .12}s` }} />
            </div>
            <div style={{ color: "rgba(255,255,255,.6)", fontSize: 12, fontWeight: 700, marginTop: 6 }}>{d.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== 4. STUDY HOME GROWN COURSES ==================== */
function Courses({ onBuy }) {
  const ref = useReveal();
  return (
    <section id="courses" className="section" ref={ref} style={{ background: "#fff" }}>
      <div className="wrap">
        <Head tag="Study Home grown courses" title="Built in-house. Priced for families."
          lead="Three flagship programmes designed by our own mentors — pick the track that fits your family." />
        <div className="grid reveal" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", marginTop: 36 }}>
          <SpokenEnglish onBuy={onBuy} />
          <ParentingCoach />
          <GuardianPrep />
        </div>
      </div>
    </section>
  );
}

function SpokenEnglish({ onBuy }) {
  const [under, setUnder] = useState(true);
  const data = under
    ? { title: "Below 18 Track", pts: ["School-stage confidence", "AI-assisted peer fluency drills", "Debate & presentation labs", "Zero fear of public speaking"], icon: <BookOpen size={16} /> }
    : { title: "Above 18 Track", pts: ["Corporate communication", "Interview & GD readiness", "Email & workplace English", "Accent-neutral clarity"], icon: <Users size={16} /> };
  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="eyebrow">6-month course</div>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>Spoken English Suite</h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="num" style={{ fontSize: 26, fontWeight: 800 }}>₹4,500</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>full course</div>
        </div>
      </div>
      {/* track toggle */}
      <div style={{ display: "flex", background: "var(--paper)", borderRadius: 12, padding: 5, marginTop: 18, position: "relative" }}>
        <div style={{ position: "absolute", top: 5, bottom: 5, width: "calc(50% - 5px)", borderRadius: 9,
          background: "linear-gradient(135deg,var(--amber),var(--amber-600))", transition: "left .3s cubic-bezier(.2,.7,.2,1)",
          left: under ? 5 : "calc(50%)" }} />
        <button onClick={() => setUnder(true)} style={{ flex: 1, zIndex: 1, border: 0, background: "transparent", padding: "9px", fontWeight: 700, cursor: "pointer", color: under ? "#231400" : "var(--muted)" }}>Below 18</button>
        <button onClick={() => setUnder(false)} style={{ flex: 1, zIndex: 1, border: 0, background: "transparent", padding: "9px", fontWeight: 700, cursor: "pointer", color: !under ? "#231400" : "var(--muted)" }}>Above 18</button>
      </div>
      <div style={{ marginTop: 18, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--slate)" }}>{data.icon} {data.title}</div>
        <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 10 }}>
          {data.pts.map((p) => (
            <li key={p} style={{ display: "flex", gap: 10, fontSize: 14.5, animation: "pop .3s" }}>
              <Check size={17} color="#22A06B" style={{ flexShrink: 0, marginTop: 1 }} /> {p}</li>
          ))}
        </ul>
      </div>
      <button className="btn btn-amber" style={{ width: "100%", justifyContent: "center", marginTop: 20 }} onClick={onBuy}>
        <CreditCard size={16} /> Buy Now · ₹4,500</button>
    </div>
  );
}

function ParentingCoach() {
  const Q = [
    { q: "How often do screen-time battles happen at home?", opts: ["Rarely", "Weekly", "Almost daily"] },
    { q: "Does your child struggle to focus on studies?", opts: ["Not really", "Sometimes", "Very often"] },
    { q: "How confident do you feel handling their emotions?", opts: ["Very confident", "Somewhat", "Often stuck"] },
  ];
  const [i, setI] = useState(-1);
  const [score, setScore] = useState(0);
  const answer = (idx) => { setScore((s) => s + idx); setI((x) => x + 1); };
  const done = i >= Q.length;
  const result = score <= 2
    ? { t: "Light-touch coaching", d: "You've got strong instincts. A few refinements around routine and rewards will take you far." }
    : score <= 4
    ? { t: "Focus & routine track", d: "You'd benefit most from our structure-building sessions on focus, screen-time and consistency." }
    : { t: "Full behaviour partnership", d: "Let's work closely — our intensive track supports emotions, focus and screen habits together." };
  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", background: "linear-gradient(180deg,#fbf7ff,#fff)" }}>
      <div className="eyebrow" style={{ color: "#8b5cf6" }}><Heart size={13} /> Calm, judgement-free</div>
      <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>Parenting Coach</h3>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginTop: 6 }}>Behaviour, focus & screen-time support for parents. Take the 30-second self-assessment.</p>
      <div style={{ marginTop: 16, flex: 1 }}>
        {i === -1 && (
          <button className="btn btn-navy" style={{ width: "100%", justifyContent: "center" }} onClick={() => setI(0)}>
            <Brain size={16} /> Start self-assessment</button>
        )}
        {i >= 0 && !done && (
          <div style={{ animation: "pop .3s" }}>
            <div style={{ height: 6, background: "var(--line)", borderRadius: 6, marginBottom: 14 }}>
              <div style={{ height: "100%", width: `${(i / Q.length) * 100}%`, background: "#8b5cf6", borderRadius: 6, transition: "width .3s" }} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 15.5 }}>{Q[i].q}</p>
            <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
              {Q[i].opts.map((o, idx) => (
                <button key={o} className="chip" style={{ justifyContent: "flex-start", padding: "11px 14px" }} onClick={() => answer(idx)}>{o}</button>
              ))}
            </div>
          </div>
        )}
        {done && (
          <div style={{ animation: "pop .35s" }}>
            <div style={{ padding: 16, borderRadius: 14, background: "#f3ecff", border: "1px solid #e2d3ff" }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#8b5cf6", letterSpacing: ".06em" }}>YOUR MATCH</div>
              <div style={{ fontWeight: 800, fontSize: 18, marginTop: 4 }}>{result.t}</div>
              <p style={{ fontSize: 14, color: "var(--slate)", marginTop: 6, lineHeight: 1.5 }}>{result.d}</p>
            </div>
            <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={() => { setI(-1); setScore(0); }}>Retake</button>
          </div>
        )}
      </div>
    </div>
  );
}

function GuardianPrep() {
  const [open, setOpen] = useState(0);
  const items = [
    { q: "What schools do you prepare us for?", a: "Top ICSE/CBSE and reputed private schools across Kolkata — we tailor to each school's known interview style." },
    { q: "What's actually covered?", a: "Common guardian questions, how to present your child's strengths, body language, and mock interview rounds with feedback." },
    { q: "Is it really 100% assistance?", a: "Yes — we stay with you from first mock to the actual interview day, refining answers until you feel completely ready." },
  ];
  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", background: "var(--navy-800)", color: "#fff", borderColor: "transparent" }}>
      <div className="eyebrow eyebrow-dark"><Award size={13} /> 100% assistance</div>
      <h3 className="display" style={{ fontSize: 22, marginTop: 6, color: "#fff" }}>Guardian Interview Prep</h3>
      <p style={{ color: "rgba(255,255,255,.72)", fontSize: 14.5, marginTop: 6 }}>
        Reputed-school admission interviews are intense. We prepare guardians to walk in calm and ready.</p>
      <div style={{ marginTop: 16, flex: 1, display: "grid", gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{ borderRadius: 12, overflow: "hidden", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)" }}>
            <button onClick={() => setOpen(open === i ? -1 : i)}
              style={{ width: "100%", textAlign: "left", padding: "13px 15px", border: 0, background: "transparent", color: "#fff", fontWeight: 700, fontSize: 14.5, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              {it.q}
              <ChevronRight size={16} style={{ transform: open === i ? "rotate(90deg)" : "none", transition: "transform .25s", flexShrink: 0 }} />
            </button>
            {open === i && <p style={{ padding: "0 15px 14px", fontSize: 13.5, color: "rgba(255,255,255,.75)", lineHeight: 1.55, animation: "pop .25s" }}>{it.a}</p>}
          </div>
        ))}
      </div>
      <a href="tel:7980466379" className="btn btn-amber" style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
        <Phone size={16} /> Talk to a mentor</a>
    </div>
  );
}

/* ==================== PAYMENT MODAL (mock Razorpay flow) ==================== */
function PaymentModal({ open, onClose }) {
  const [stage, setStage] = useState("summary"); // summary -> gateway -> success
  useEffect(() => { if (open) setStage("summary"); }, [open]);
  if (!open) return null;
  const pay = () => {
    setStage("gateway");
    // MOCK: in production this is where razorpay.open() runs after a server order is created
    setTimeout(() => setStage("success"), 1800);
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(10,27,51,.6)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 420, maxWidth: "100%", padding: 26, animation: "pop .3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><TileMark size={30} /><strong className="display">Secure Checkout</strong></div>
          <button onClick={onClose} className="chip" style={{ padding: 7 }}><X size={16} /></button>
        </div>

        {stage === "summary" && (
          <div style={{ marginTop: 18 }}>
            <div style={{ padding: 16, borderRadius: 14, background: "var(--paper)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <span>Spoken English Suite</span><span className="num">₹4,500</span></div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>6-month full course · GST included</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "16px 2px", fontWeight: 800, fontSize: 18 }}>
              <span>Total</span><span className="num">₹4,500</span></div>
            <button className="btn btn-amber" style={{ width: "100%", justifyContent: "center" }} onClick={pay}>
              <Lock size={15} /> Pay securely</button>
            <p style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontSize: 12, color: "var(--muted)", marginTop: 12 }}>
              <Shield size={13} /> Encrypted · powered by Razorpay / Stripe (mock)</p>
          </div>
        )}
        {stage === "gateway" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 46, height: 46, border: "4px solid var(--amber)", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto", animation: "spinSlow .8s linear infinite" }} />
            <p style={{ fontWeight: 700, marginTop: 16 }}>Opening secure gateway…</p>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Do not refresh or close this window.</p>
          </div>
        )}
        {stage === "success" && (
          <div style={{ textAlign: "center", padding: "26px 0", animation: "pop .35s" }}>
            <div style={{ width: 64, height: 64, borderRadius: 22, background: "#e9f9f0", display: "grid", placeItems: "center", margin: "0 auto" }}>
              <Check size={32} color="#22A06B" /></div>
            <h3 className="display" style={{ fontSize: 22, marginTop: 14 }}>Payment successful</h3>
            <p style={{ color: "var(--muted)", marginTop: 6 }}>Welcome to the Spoken English Suite! Your onboarding email is on its way.</p>
            <button className="btn btn-navy" style={{ marginTop: 18 }} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== FOOTER ============================== */
function Footer({ onBook }) {
  return (
    <footer style={{ background: "var(--navy-900)", color: "#fff", paddingTop: 60 }}>
      <div className="wrap">
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", paddingBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="/logo.png" alt="Study Home logo" onError={(e) => { e.currentTarget.style.display = "none"; }}
                style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,.15)" }} />
              <div><div className="display" style={{ fontWeight: 800, fontSize: 19 }}>STUDY HOME</div>
                <div style={{ color: "var(--gold)", fontSize: 12 }}>Leader's Choice</div></div>
            </div>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, marginTop: 14, maxWidth: 260, lineHeight: 1.6 }}>
              Home Tutor Provider · Online Classes · Private School Teacher Jobs · Tuitorial House.</p>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Explore</div>
            {[["Demo Suite", "#demo"], ["Har Ghar Shiksha", "#harghar"], ["Our Reach", "#reach"], ["Courses", "#courses"]].map(([l, h]) => (
              <a key={h} href={h} style={{ display: "block", color: "rgba(255,255,255,.65)", fontSize: 14, padding: "5px 0" }}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Teachers Registration</div>
            <a href="tel:7980466379" style={{ display: "flex", gap: 8, alignItems: "center", color: "rgba(255,255,255,.8)", fontSize: 15, padding: "4px 0" }}><Phone size={15} color="var(--amber)" /> 79804 66379</a>
            <a href="tel:9830499675" style={{ display: "flex", gap: 8, alignItems: "center", color: "rgba(255,255,255,.8)", fontSize: 15, padding: "4px 0" }}><Phone size={15} color="var(--amber)" /> 98304 99675</a>
            <a href="https://www.estudyhome.com" style={{ display: "flex", gap: 8, alignItems: "center", color: "rgba(255,255,255,.8)", fontSize: 15, padding: "4px 0" }}><Globe size={15} color="var(--amber)" /> www.estudyhome.com</a>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Ready to start?</div>
            <button className="btn btn-amber" onClick={onBook} style={{ width: "100%", justifyContent: "center" }}>Book a free demo</button>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", padding: "20px 0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, color: "rgba(255,255,255,.5)", fontSize: 13 }}>
          <span>© {new Date().getFullYear()} Study Home. All rights reserved.</span>
          <span>Kolkata · Newtown · Rajarhat · Howrah · Pan-India · Abroad</span>
        </div>
      </div>
    </footer>
  );
}

/* ================================ APP ================================ */
export default function App() {
  const [pay, setPay] = useState(false);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
    return () => { try { document.head.removeChild(l); } catch (e) {} };
  }, []);

  const goBook = () => { document.getElementById("harghar")?.scrollIntoView({ behavior: "smooth" }); };
  const goJoin = () => { document.getElementById("harghar")?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div className="sh-root">
      <GlobalStyle />
      <Nav onBook={goBook} />
      <FloatingHub onBook={goBook} onJoin={goJoin} />
      <Hero onBook={goBook} onJoin={goJoin} />
      <DemoSuite />
      <HarGhar openParent={goBook} />
      <DigitalShiksha />
      <Courses onBuy={() => setPay(true)} />
      <Footer onBook={goBook} />
      <PaymentModal open={pay} onClose={() => setPay(false)} />
    </div>
  );
}
