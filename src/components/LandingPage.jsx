import React, { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import { submitFeatureRequest } from '../utils/feedback';
import '../tailwind.css';

/* ------------------------------------------------------------------ */
/*  Detective Labs — Landing page (React + Tailwind CSS)               */
/*  Palette: Obsidian #0B0D0D · Ink Blue #1D2A3A · Paper #F2EFE6       */
/*           Antique Gold #B89A5A · Teal #167C80 · Emerald #2F7D5B     */
/*           Academic Blue #3F628C                                     */
/* ------------------------------------------------------------------ */

const TELEGRAM_URL = 'https://t.me/detectivelabs_pharmacy';
const INSTAGRAM_URL = 'https://www.instagram.com/detective_labs/';

/* ---------- Content ---------- */

const NAV_LINKS = [
  { label: 'Game Modes', href: '#modes' },
  { label: 'Curriculum', href: '#curriculum' },
  { label: 'FAQ', href: '#faq' },
];

const GAME_MODES = [
  {
    icon: '🔍',
    title: 'Open Investigation',
    text: 'Guess the organism from any category. No hints about where to look, just the clues.',
  },
  {
    icon: '📚',
    title: 'Targeted Search',
    text: 'Pick a category first, then solve cases from that group only.',
  },
  {
    icon: '🗂️',
    title: 'Lesson Files',
    text: 'Test specific lessons from your syllabus, one lesson or several at a time.',
  },
  {
    icon: '📖',
    title: 'The Archive',
    text: 'Browse and study every organism in the database, with full details.',
  },
];

const SUBJECTS = [
  { icon: '🦠', name: 'Parasitology - Mycology', year: '4th Year', active: true },
  { icon: '🧫', name: 'Medical Microbiology', year: '4th Year', active: false },
  { icon: '🧪', name: 'Pharmacology', year: '3rd Year', active: false },
  { icon: '💊', name: 'Therapeutic Chemistry', year: '3rd Year', active: false },
  { icon: '🌾', name: 'Pharmacognosy', year: '3rd Year', active: false },
  { icon: '🌿', name: 'Pharmaceutical Botany', year: '2nd Year', active: false },
];

const LOOP_STEPS = [
  {
    title: 'Select a case',
    text: 'Choose a game mode and open a case file from your lessons.',
  },
  {
    title: 'Analyze the clues',
    text: 'Read the first clues: morphology, transmission, symptoms. Name the organism.',
  },
  {
    title: 'Unlock the next clue',
    text: 'A wrong guess, or a tap on “Next Clue”, reveals another clue. Each one costs points.',
  },
  {
    title: 'Lock in retention',
    text: 'Solve the case and the answer sticks, because you had to retrieve it yourself.',
  },
];

const FAQS = [
  {
    q: 'What is Detective Labs?',
    a: 'Detective Labs is a web game for pharmacy students. Instead of re-reading lessons, you solve cases: each one gives you progressive clues and you identify the organism or drug behind them.',
  },
  {
    q: 'Is the content aligned with my syllabus?',
    a: 'Yes. The content is built from real course material and follows the order of the lessons taught at our faculty. Lesson Files mode lets you practice exactly the lessons you are studying.',
  },
  {
    q: 'Which subjects are available right now?',
    a: 'Parasitology and Mycology (4th year) is playable now. Medical Microbiology, Pharmacology, Therapeutic Chemistry, Pharmacognosy and Pharmaceutical Botany are coming soon.',
  },
  {
    q: 'How does the scoring work?',
    a: 'Every case starts at 1000 points. Each extra clue you reveal, by guessing wrong or by asking for the next clue, costs 100 points. The lowest score for a solved case is 100.',
  },
  {
    q: 'Does it work on my phone?',
    a: 'Yes. Detective Labs runs in your browser on phones, tablets and computers. Nothing to install.',
  },
  {
    q: 'How do I get access and stay updated?',
    a: 'Create your account to request access, or join the early access list with your email. Follow us on Telegram or Instagram for new subjects, updates and announcements.',
  },
];

/* Demo case shown in the hero dossier */
const DEMO_CASE = {
  clues: [
    'Morphology: a flatworm (trematode) with separate sexes. The adult lives in the veins around the bladder.',
    'Transmission: skin contact with fresh water containing cercariae released by Bulinus snails.',
    'Clinical: terminal hematuria and burning urination, especially in children living near rivers or ponds.',
    'Diagnosis: oval eggs with a terminal spine found in urine collected around midday.',
    'Complication: chronic infection raises the risk of squamous cell carcinoma of the bladder.',
    'Treatment: a single-day course of praziquantel.',
  ],
  answers: ['haematobium', 'hematobium', 'schistosoma', 'bilharzia', 'bilharziose', 'schistosomiasis'],
  reveal: 'Schistosoma haematobium',
};

/* Petites particules dorées qui montent doucement en arrière-plan */
const PARTICLES = [
  { left: '6%', size: 4, dur: 26, delay: 0 },
  { left: '14%', size: 3, dur: 32, delay: 6 },
  { left: '23%', size: 5, dur: 28, delay: 12 },
  { left: '33%', size: 3, dur: 36, delay: 3 },
  { left: '42%', size: 4, dur: 30, delay: 15 },
  { left: '51%', size: 3, dur: 34, delay: 9 },
  { left: '60%', size: 5, dur: 27, delay: 18 },
  { left: '69%', size: 3, dur: 33, delay: 4 },
  { left: '77%', size: 4, dur: 29, delay: 11 },
  { left: '86%', size: 3, dur: 35, delay: 20 },
  { left: '93%', size: 4, dur: 31, delay: 7 },
];

/* ---------- Small shared pieces ---------- */

/* Polices, animations et mini-reset limités à la landing */
const LandingStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

    .dl-root { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
    .dl-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
    .dl-root, .dl-root *, .dl-root *::before, .dl-root *::after { box-sizing: border-box; }
    :where(.dl-root) :where(h1, h2, h3, p, ul, ol) { margin: 0; }

    /* ---- Fond animé ---- */
    .dl-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
    .dl-orb { position: absolute; border-radius: 9999px; filter: blur(90px); will-change: transform; }
    .dl-orb-1 { width: 42rem; height: 42rem; background: #167C80; opacity: .30; top: -12rem; left: -10rem; animation: dl-drift-a 24s ease-in-out infinite alternate; }
    .dl-orb-2 { width: 36rem; height: 36rem; background: #B89A5A; opacity: .16; bottom: -12rem; right: -8rem; animation: dl-drift-b 30s ease-in-out infinite alternate; }
    .dl-orb-3 { width: 30rem; height: 30rem; background: #3F628C; opacity: .24; top: 38%; left: 48%; animation: dl-drift-c 36s ease-in-out infinite alternate; }
    .dl-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(242,239,230,.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(242,239,230,.045) 1px, transparent 1px);
      background-size: 56px 56px;
      -webkit-mask-image: radial-gradient(ellipse at center, #000 25%, transparent 75%);
      mask-image: radial-gradient(ellipse at center, #000 25%, transparent 75%);
      animation: dl-grid 45s linear infinite;
    }
    .dl-dot { position: absolute; bottom: -10px; border-radius: 9999px; background: #B89A5A; opacity: 0; animation-name: dl-rise; animation-timing-function: linear; animation-iteration-count: infinite; }

    @keyframes dl-drift-a { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(14rem,10rem,0) scale(1.15); } }
    @keyframes dl-drift-b { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(-16rem,-9rem,0) scale(1.2); } }
    @keyframes dl-drift-c { from { transform: translate3d(0,0,0) scale(.95); } to { transform: translate3d(-12rem,8rem,0) scale(1.1); } }
    @keyframes dl-grid { from { background-position: 0 0, 0 0; } to { background-position: 56px 112px, 56px 112px; } }
    @keyframes dl-rise {
      0% { transform: translateY(0); opacity: 0; }
      10% { opacity: .55; }
      90% { opacity: .35; }
      100% { transform: translateY(-110vh); opacity: 0; }
    }

    /* ---- Dossier qui flotte doucement ---- */
    @keyframes dl-float { 0%,100% { transform: translateY(0) rotate(-.4deg); } 50% { transform: translateY(-10px) rotate(.4deg); } }
    .dl-float { animation: dl-float 7s ease-in-out infinite; }

    /* ---- Apparition au scroll ---- */
    .dl-reveal { opacity: 0; transform: translateY(32px) scale(.98); transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); will-change: opacity, transform; }
    .dl-reveal.is-visible { opacity: 1; transform: none; }

    /* ---- Cartes avec relief ---- */
    .dl-card { transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; box-shadow: 0 10px 30px -12px rgba(0,0,0,.7), inset 0 1px 0 rgba(242,239,230,.05); }
    @media (hover: hover) {
      .dl-card:hover { transform: translateY(-6px); box-shadow: 0 22px 40px -14px rgba(0,0,0,.8), 0 0 0 1px rgba(184,154,90,.35); }
    }

    html { -webkit-text-size-adjust: 100%; }
    @keyframes dl-float-sm { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

    /* ---- Téléphone : fond plus léger, animations plus douces ---- */
    @media (max-width: 640px) {
      .dl-orb { filter: blur(60px); }
      .dl-orb-1 { width: 24rem; height: 24rem; opacity: .26; top: -8rem; left: -10rem; }
      .dl-orb-2 { width: 22rem; height: 22rem; opacity: .13; bottom: -8rem; right: -10rem; }
      .dl-orb-3 { width: 18rem; height: 18rem; opacity: .18; }
      .dl-grid { animation: none; background-size: 40px 40px; }
      .dl-reveal { transform: translateY(20px); }
      .dl-float { animation-name: dl-float-sm; }
    }

    @media (prefers-reduced-motion: reduce) {
      .dl-orb, .dl-grid, .dl-dot, .dl-float { animation: none !important; }
      .dl-dot { display: none; }
      .dl-reveal { opacity: 1; transform: none; transition: none; }
      .dl-card, .dl-card:hover { transition: none; transform: none; }
    }
    @media (prefers-reduced-motion: no-preference) {
      html { scroll-behavior: smooth; }
    }
  `}</style>
);

/* Fond animé fixe : halos qui dérivent, grille qui glisse, particules dorées */
const AnimatedBackground = () => (
  <div className="dl-bg" aria-hidden="true">
    <div className="dl-orb dl-orb-1" />
    <div className="dl-orb dl-orb-2" />
    <div className="dl-orb dl-orb-3" />
    <div className="dl-grid" />
    {PARTICLES.map((p, i) => (
      <span
        key={i}
        className="dl-dot"
        style={{
          left: p.left,
          width: p.size,
          height: p.size,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
        }}
      />
    ))}
  </div>
);

/* Fait apparaître son contenu quand il entre à l'écran (une seule fois) */
const Reveal = ({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`dl-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

const TelegramIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9.78 15.17l-.4 5.6c.58 0 .83-.25 1.13-.55l2.7-2.58 5.6 4.1c1.03.57 1.76.27 2.04-.95l3.7-17.3c.33-1.52-.55-2.12-1.55-1.75L1.2 10.1c-1.48.58-1.46 1.4-.26 1.77l5.6 1.74L19.5 5.4c.62-.4 1.18-.18.72.22" />
  </svg>
);

const InstagramIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const StarIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.9 5.9 20.4l1.5-6.8L2.2 9l6.9-.7L12 2z" />
  </svg>
);

const SocialButtons = ({ className = '' }) => (
  <div className={`grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center ${className}`}>
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#B89A5A]/50 px-4 py-2.5 text-sm font-medium text-[#F2EFE6] no-underline transition-colors hover:border-[#B89A5A] hover:bg-[#1D2A3A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0D]"
    >
      <TelegramIcon /> Telegram
    </a>
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#B89A5A]/50 px-4 py-2.5 text-sm font-medium text-[#F2EFE6] no-underline transition-colors hover:border-[#B89A5A] hover:bg-[#1D2A3A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0D]"
    >
      <InstagramIcon /> Instagram
    </a>
  </div>
);

/* Email capture used in the hero and in the final banner */
const EmailForm = ({ onJoinWaitlist, idPrefix }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setStatus('error');
      setMessage('Enter a valid email address, like name@example.com.');
      return;
    }
    setStatus('loading');
    try {
      if (typeof onJoinWaitlist === 'function') {
        await onJoinWaitlist(value);
      }
      setStatus('success');
      setMessage('You are on the list. We will email you when access opens.');
      setEmail('');
    } catch (err) {
      console.error('Waitlist error:', err);
      setStatus('error');
      setMessage('Something went wrong. Try again in a moment.');
    }
  };

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`${idPrefix}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== 'idle') setStatus('idle');
          }}
          placeholder="your.email@example.com"
          aria-invalid={status === 'error'}
          aria-describedby={`${idPrefix}-msg`}
          className="min-w-0 flex-1 rounded-lg border border-[#B89A5A]/40 bg-[#1D2A3A] px-4 py-3 text-[#F2EFE6] placeholder-[#F2EFE6]/45 focus:border-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]/60"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg border-0 bg-[#167C80] px-6 py-3 font-semibold text-[#F2EFE6] shadow-lg shadow-[#167C80]/25 transition-all hover:-translate-y-0.5 hover:bg-[#1a9096] disabled:cursor-wait disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0D]"
        >
          {status === 'loading' ? 'Sending...' : 'Get Early Access'}
        </button>
      </form>
      <p
        id={`${idPrefix}-msg`}
        role="status"
        aria-live="polite"
        className={`mt-2 min-h-[1.25rem] text-sm ${
          status === 'success' ? 'text-[#5fbf92]' : status === 'error' ? 'text-[#e8a08f]' : 'text-transparent'
        }`}
      >
        {message || '.'}
      </p>
    </div>
  );
};

/* ---------- Interactive dossier (hero) ---------- */

const DossierPreview = () => {
  const total = DEMO_CASE.clues.length;
  const [revealed, setRevealed] = useState(2);
  const [guess, setGuess] = useState('');
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState('');

  const score = Math.max(100, 1000 - 100 * (revealed - 1));

  const normalize = (s) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const handleGuess = (e) => {
    e.preventDefault();
    const g = normalize(guess);
    if (!g || solved) return;
    if (DEMO_CASE.answers.some((a) => g.includes(a))) {
      setSolved(true);
      setFeedback('');
      return;
    }
    if (revealed < total) {
      setRevealed((r) => r + 1);
      setFeedback('Not quite. A new clue has been added to the file (-100 points).');
    } else {
      setFeedback('Not quite. All clues are on the table, think again.');
    }
    setGuess('');
  };

  const handleNextClue = () => {
    if (solved || revealed >= total) return;
    setRevealed((r) => r + 1);
    setFeedback('');
  };

  const reset = () => {
    setRevealed(2);
    setGuess('');
    setSolved(false);
    setFeedback('');
  };

  return (
    <div className="dl-float relative mx-auto w-full max-w-md">
      {/* folder tab */}
      <div className="ml-6 inline-flex items-center gap-2 rounded-t-lg border border-b-0 border-[#B89A5A]/60 bg-[#1D2A3A] px-4 py-2 text-xs font-semibold tracking-wide text-[#B89A5A]">
        <StarIcon className="h-3.5 w-3.5" />
        CASE FILE #0482
      </div>

      <div className="rounded-xl rounded-tl-none border border-[#B89A5A]/60 bg-[#1D2A3A] p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85),0_0_60px_-10px_rgba(22,124,128,0.35)] sm:p-4">
        {/* paper page */}
        <div className="rounded-lg bg-[#F2EFE6] p-4 text-[#1D2A3A] sm:p-5">
          <div className="flex items-start justify-between gap-3 border-b border-[#B89A5A]/50 pb-3">
            <div>
              <p className="dl-display text-lg font-bold leading-tight text-[#1D2A3A]">Parasitology, 4th Year</p>
              <p className="text-sm text-[#1D2A3A]/70">Identify the organism</p>
            </div>
            <span className="shrink-0 rounded-full border border-[#B89A5A] bg-[#B89A5A]/15 px-3 py-1 text-xs font-semibold text-[#7a6330]">
              {score} pts
            </span>
          </div>

          {/* clues */}
          <ol className="mt-4 list-none space-y-2.5 p-0" aria-label="Clues">
            {DEMO_CASE.clues.slice(0, revealed).map((clue, i) => (
              <li
                key={i}
                className="flex flex-col gap-0.5 rounded-md border-l-4 border-[#167C80] sm:flex-row sm:gap-3 bg-white/60 py-2 pl-3 pr-3 text-sm leading-relaxed"
              >
                <span className="shrink-0 font-semibold text-[#167C80]">Clue {i + 1}</span>
                <span>{clue}</span>
              </li>
            ))}
            {!solved && revealed < total && (
              <li className="rounded-md border border-dashed border-[#1D2A3A]/30 px-3 py-2 text-sm text-[#1D2A3A]/55">
                {total - revealed} more {total - revealed === 1 ? 'clue' : 'clues'} sealed in the file
              </li>
            )}
          </ol>

          {/* result or input */}
          {solved ? (
            <div className="mt-4 rounded-lg bg-[#2F7D5B] p-4 text-[#F2EFE6]" role="status">
              <p className="dl-display text-lg font-bold text-[#F2EFE6]">Case solved: {DEMO_CASE.reveal}</p>
              <p className="mt-1 text-sm text-[#F2EFE6]/90">
                You scored {score} points using {revealed} {revealed === 1 ? 'clue' : 'clues'}.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-3 rounded-md border border-[#F2EFE6]/60 bg-transparent px-3 py-1.5 text-sm font-medium text-[#F2EFE6] hover:bg-[#F2EFE6]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6]"
              >
                Replay this case
              </button>
            </div>
          ) : (
            <form onSubmit={handleGuess} className="mt-4 space-y-3">
              <label htmlFor="dossier-guess" className="sr-only">
                Your guess
              </label>
              <div className="flex gap-2">
                <input
                  id="dossier-guess"
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Type the organism's name"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-md border border-[#1D2A3A]/30 bg-white px-3 py-2.5 text-sm text-[#1D2A3A] placeholder-[#1D2A3A]/45 focus:border-[#167C80] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#167C80]/50"
                />
                <button
                  type="submit"
                  className="rounded-md border-0 bg-[#167C80] px-4 py-2.5 text-sm font-semibold text-[#F2EFE6] transition-colors hover:bg-[#1a9096] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#167C80] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2EFE6]"
                >
                  Guess
                </button>
              </div>
              <button
                type="button"
                onClick={handleNextClue}
                disabled={revealed >= total}
                className="w-full rounded-md border-0 bg-[#3F628C] px-4 py-2.5 text-sm font-semibold text-[#F2EFE6] transition-colors hover:bg-[#4a73a3] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F628C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2EFE6]"
              >
                💡 Request Next Clue (-100 pts)
              </button>
              <p role="status" aria-live="polite" className="min-h-[1.25rem] text-sm text-[#8a3b2a]">
                {feedback}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Page ---------- */

const LandingPage = ({ currentLang, theme, onLogin, onSignup, onViewPricing }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  /* Feature-request form (conservé de l'ancienne page) */
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('idle'); // idle | sending | sent | error

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    setFeedbackStatus('sending');
    try {
      await submitFeatureRequest({ name: feedbackName, message: feedbackMessage });
      setFeedbackStatus('sent');
      setFeedbackName('');
      setFeedbackMessage('');
    } catch (err) {
      console.error('Feedback submit error:', err);
      setFeedbackStatus('error');
    }
  };

  /* Liste d'attente : réutilise la collection existante `featureRequests` (autorisée par tes règles Firestore) */
  const handleJoinWaitlist = async (email) => {
    await submitFeatureRequest({
      name: 'Early access request',
      message: `Early access request: ${email}`,
    });
  };

  return (
    <div className="dl-root relative isolate min-h-screen overflow-x-clip bg-[#0B0D0D] text-[#F2EFE6] antialiased">
      <LandingStyles />
      <AnimatedBackground />

      {/* ============ 1. NAVBAR ============ */}
      <header className="sticky top-0 z-50 border-b border-[#B89A5A]/25 bg-[#1D2A3A]/90 shadow-lg shadow-black/30 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6" aria-label="Main">
          {/* Logo : aucune ligne, aucun soulignement, aucun contour */}
          <a
            href="#top"
            aria-label="Detective Labs, back to top"
            style={{ outline: 'none', textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}
            className="flex items-center border-0 no-underline outline-none focus:outline-none focus-visible:outline-none"
          >
            <Logo variant="horizontal" theme={theme} />
          </a>

          <ul className="hidden list-none items-center gap-8 p-0 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded text-sm font-medium text-[#F2EFE6]/80 no-underline transition-colors hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onLogin}
              className="hidden rounded-lg border-0 bg-transparent px-3 py-2 text-sm font-semibold text-[#F2EFE6] hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A] sm:inline-block"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={onSignup}
              className="hidden rounded-lg border border-[#B89A5A] bg-transparent px-4 py-2 text-sm font-semibold text-[#B89A5A] transition-colors hover:bg-[#B89A5A]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A] sm:inline-block"
            >
              Sign up
            </button>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-lg bg-[#167C80] px-4 py-2 text-sm font-semibold text-[#F2EFE6] no-underline transition-colors hover:bg-[#1a9096] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] lg:inline-flex"
            >
              <TelegramIcon className="h-4 w-4" /> Join Telegram
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="rounded-lg border border-[#B89A5A]/40 bg-transparent p-2.5 text-[#F2EFE6] md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </nav>

        {/* Menu mobile / tablette */}
        {menuOpen && (
          <div id="mobile-menu" className="border-t border-[#B89A5A]/25 bg-[#1D2A3A] px-4 pb-4 pt-2 md:hidden">
            <ul className="flex list-none flex-col p-0">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded px-2 py-3 text-base font-medium text-[#F2EFE6]/90 no-underline hover:text-[#B89A5A]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onLogin();
                }}
                className="rounded-lg border border-[#F2EFE6]/30 bg-transparent px-4 py-3 font-semibold text-[#F2EFE6]"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onSignup();
                }}
                className="rounded-lg border border-[#B89A5A] bg-transparent px-4 py-3 font-semibold text-[#B89A5A]"
              >
                Sign up
              </button>
            </div>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#167C80] px-4 py-3 font-semibold text-[#F2EFE6] no-underline"
            >
              <TelegramIcon className="h-4 w-4" /> Join Telegram
            </a>
          </div>
        )}
      </header>

      <main id="top" className="relative z-10">
        {/* ============ 2. HERO ============ */}
        <section className="relative">
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:gap-12 sm:px-6 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24">
            <Reveal>
              <p className="inline-block rounded-full border border-[#B89A5A]/60 bg-[#B89A5A]/10 px-3.5 py-1.5 text-[11px] font-semibold leading-snug tracking-wide text-[#B89A5A] sm:px-4 sm:text-xs">
                🧪 THE ACTIVE RECALL REVOLUTION FOR PHARMACY STUDENTS
              </p>
              <h1 className="dl-display mt-5 text-[2rem] font-bold leading-[1.1] text-[#F2EFE6] sm:mt-6 sm:text-5xl lg:text-6xl">
                Study Pharmacy Like a Detective.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#F2EFE6]/80 sm:text-lg">
                Solve cases, follow progressive clues, and master your lessons. Detective Labs replaces tedious
                textbook re-reading with clue-based investigation games.
              </p>

              <div className="mt-8">
                <EmailForm onJoinWaitlist={handleJoinWaitlist} idPrefix="hero" />
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <button
                  type="button"
                  onClick={onSignup}
                  className="w-full rounded-lg border border-[#B89A5A] bg-transparent px-5 py-3 text-center text-sm font-semibold text-[#B89A5A] transition-colors hover:bg-[#B89A5A]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A] sm:w-auto sm:py-2.5"
                >
                  Create your account
                </button>
                <button
                  type="button"
                  onClick={onLogin}
                  className="w-full rounded border-0 bg-transparent px-0 py-1.5 text-center text-sm text-[#F2EFE6]/80 underline underline-offset-4 hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A] sm:w-auto sm:py-1"
                >
                  I already have an account
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
                <span className="text-sm text-[#F2EFE6]/60">Follow the investigation:</span>
                <SocialButtons />
              </div>
            </Reveal>

            <Reveal delay={150}>
              <DossierPreview />
            </Reveal>
          </div>
        </section>

        {/* ============ 3. COMMUNITY STRIP ============ */}
        <section aria-label="Highlights" className="border-y border-[#B89A5A]/25 bg-[#1D2A3A]/90 shadow-[0_0_40px_-10px_rgba(0,0,0,0.8)]">
          <div className="mx-auto grid max-w-6xl gap-px bg-[#B89A5A]/20 sm:grid-cols-3">
            <Reveal className="flex items-center gap-4 bg-[#1D2A3A] px-5 py-5 sm:px-6 sm:py-6">
              <span className="dl-display text-3xl font-bold text-[#B89A5A]">100%</span>
              <p className="text-sm leading-snug text-[#F2EFE6]/85">
                Curriculum aligned, built from real course material
              </p>
            </Reveal>
            <Reveal delay={100} className="flex items-center gap-4 bg-[#1D2A3A] px-5 py-5 sm:px-6 sm:py-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#B89A5A] text-[#B89A5A]">
                <StarIcon className="h-5 w-5" />
              </span>
              <p className="text-sm leading-snug text-[#F2EFE6]/85">
                <span className="block font-semibold text-[#F2EFE6]">Active recall clues</span>
                Progressive hints that make you retrieve, not reread
              </p>
            </Reveal>
            <Reveal delay={200} className="flex flex-col justify-center gap-3 bg-[#1D2A3A] px-5 py-5 sm:px-6 sm:py-6">
              <p className="text-sm font-semibold text-[#F2EFE6]">Join the community</p>
              <div className="flex gap-4">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Detective Labs on Telegram"
                  className="inline-flex items-center gap-2 rounded text-sm text-[#F2EFE6]/85 no-underline hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
                >
                  <TelegramIcon className="h-5 w-5" /> Telegram
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Detective Labs on Instagram"
                  className="inline-flex items-center gap-2 rounded text-sm text-[#F2EFE6]/85 no-underline hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
                >
                  <InstagramIcon className="h-5 w-5" /> Instagram
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ 4. PROBLEM vs SOLUTION ============ */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="dl-display text-[1.75rem] font-bold leading-tight text-[#F2EFE6] sm:text-4xl">Rereading feels productive. It isn’t.</h2>
            <p className="mt-4 text-[#F2EFE6]/75">
              Most students study in a way that feels good on the day and fails on exam day. Here is the difference.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-2">
            {/* Problem */}
            <Reveal className="dl-card rounded-xl border border-[#F2EFE6]/15 bg-[#1D2A3A]/70 p-5 backdrop-blur-sm sm:p-8">
              <h3 className="dl-display text-xl font-bold text-[#F2EFE6]">The usual way: passive reading</h3>
              <ol className="mt-6 list-none space-y-5 p-0">
                {[
                  ['3 hours of reading', 'You go through the same pages again and again, highlighter in hand.'],
                  ['The illusion of knowing', 'Everything looks familiar, so you feel ready. Familiar is not the same as remembered.'],
                  ['Exam day blanking', 'The question is phrased differently and the page you “knew” is gone.'],
                ].map(([title, text], i) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#F2EFE6]/30 text-sm font-semibold text-[#F2EFE6]/70">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-[#F2EFE6]">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#F2EFE6]/70">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            {/* Solution */}
            <Reveal delay={150} className="dl-card rounded-xl border border-[#B89A5A]/60 bg-[#F2EFE6] p-5 text-[#1D2A3A] sm:p-8">
              <h3 className="dl-display text-xl font-bold text-[#1D2A3A]">The Detective Labs way: active retrieval</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#1D2A3A]/80">
                You get the clues, not the answer. Pulling the name out of your own memory is what makes it stay.
              </p>
              <ul className="mt-6 list-none space-y-4 p-0">
                {[
                  'Every case starts with a few clues, and you must name the organism yourself.',
                  'Wrong guesses are useful: each one reveals a new clue and shows what you were missing.',
                  'Short rounds you can play between classes, on your phone.',
                  'The same facts come back in different cases, so they move into long-term memory.',
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-sm leading-relaxed text-[#1D2A3A]">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2F7D5B] text-xs text-[#F2EFE6]"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ============ 5. GAME MODES ============ */}
        <section id="modes" className="scroll-mt-20 border-t border-[#B89A5A]/20">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal className="max-w-2xl">
              <h2 className="dl-display text-[1.75rem] font-bold leading-tight text-[#F2EFE6] sm:text-4xl">Four ways to work a case</h2>
              <p className="mt-4 text-[#F2EFE6]/75">
                Explore freely, focus on a category, drill your syllabus, or study the full archive.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {GAME_MODES.map((m, i) => (
                <Reveal key={m.title} delay={i * 110} className="h-full">
                  <article className="dl-card flex h-full flex-row items-start gap-4 rounded-xl border border-[#B89A5A]/40 bg-gradient-to-b from-[#24364b] to-[#1D2A3A] p-5 sm:flex-col sm:gap-0 sm:p-6">
                    <span className="text-3xl" aria-hidden="true">
                      {m.icon}
                    </span>
                    <div>
                      <h3 className="dl-display text-lg font-bold text-[#F2EFE6] sm:mt-4">{m.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#F2EFE6]/75 sm:mt-2">{m.text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 6. SUBJECT COVERAGE ============ */}
        <section id="curriculum" className="scroll-mt-20 border-t border-[#B89A5A]/20">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal className="max-w-2xl">
              <h2 className="dl-display text-[1.75rem] font-bold leading-tight text-[#F2EFE6] sm:text-4xl">Built around your curriculum</h2>
              <p className="mt-4 text-[#F2EFE6]/75">
                Parasitology and Mycology is open now. The other modules are being prepared, year by year.
              </p>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3">
              {SUBJECTS.map((s, i) => (
                <Reveal key={s.name} delay={(i % 3) * 110} className="h-full">
                  <article
                    className={`dl-card relative h-full rounded-xl border p-4 sm:p-6 ${
                      s.active
                        ? 'border-[#B89A5A] bg-gradient-to-b from-[#24364b] to-[#1D2A3A]'
                        : 'border-[#F2EFE6]/15 bg-[#1D2A3A]/55'
                    }`}
                  >
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-3">
                      <span className={`text-3xl ${s.active ? '' : 'opacity-60'}`} aria-hidden="true">
                        {s.icon}
                      </span>
                      {s.active ? (
                        <span className="rounded-full bg-[#2F7D5B] px-3 py-1 text-xs font-semibold text-[#F2EFE6]">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full border border-[#F2EFE6]/25 px-3 py-1 text-xs font-medium text-[#F2EFE6]/65">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <h3
                      className={`dl-display mt-3 text-base font-bold leading-snug sm:mt-4 sm:text-lg ${
                        s.active ? 'text-[#F2EFE6]' : 'text-[#F2EFE6]/75'
                      }`}
                    >
                      {s.name}
                    </h3>
                    <p className={`mt-1 text-sm ${s.active ? 'text-[#B89A5A]' : 'text-[#F2EFE6]/55'}`}>{s.year}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 7. GAMEPLAY LOOP ============ */}
        <section className="border-t border-[#B89A5A]/20 bg-[#1D2A3A]/40">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal className="max-w-2xl">
              <h2 className="dl-display text-[1.75rem] font-bold leading-tight text-[#F2EFE6] sm:text-4xl">How a case plays out</h2>
              <p className="mt-4 text-[#F2EFE6]/75">The same four steps, every time. Each round takes a few minutes.</p>
            </Reveal>
            <ol className="mt-10 grid list-none gap-7 p-0 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
              {LOOP_STEPS.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 130} className="relative flex gap-4 sm:block">
                  {i < LOOP_STEPS.length - 1 && (
                    <span
                      className="absolute left-12 top-6 hidden h-px w-[calc(100%-1rem)] bg-[#B89A5A]/40 lg:block"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#B89A5A] bg-[#0B0D0D] text-lg font-bold text-[#B89A5A] shadow-[0_0_24px_-4px_rgba(184,154,90,0.45)]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="dl-display text-lg font-bold text-[#F2EFE6] sm:mt-5">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#F2EFE6]/75 sm:mt-2">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ 8. FAQ ============ */}
        <section id="faq" className="scroll-mt-20 border-t border-[#B89A5A]/20">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal>
              <h2 className="dl-display text-[1.75rem] font-bold leading-tight text-[#F2EFE6] sm:text-4xl">Questions, answered</h2>
            </Reveal>
            <Reveal delay={120} className="mt-10 divide-y divide-[#B89A5A]/25 rounded-xl border border-[#B89A5A]/40 bg-[#1D2A3A]/95 shadow-[0_20px_40px_-18px_rgba(0,0,0,0.8)]">
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q}>
                    <h3 className="m-0 text-base">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? -1 : i)}
                        aria-expanded={open}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-btn-${i}`}
                        className="flex w-full items-center justify-between gap-4 border-0 bg-transparent px-5 py-4 text-left text-base font-semibold text-[#F2EFE6] hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B89A5A]"
                      >
                        <span>{f.q}</span>
                        <svg
                          className={`h-5 w-5 shrink-0 text-[#B89A5A] transition-transform ${open ? 'rotate-180' : ''}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                    </h3>
                    {open && (
                      <div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        className="px-5 pb-5 text-sm leading-relaxed text-[#F2EFE6]/80"
                      >
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </Reveal>
          </div>
        </section>

        {/* ============ FEATURE REQUEST (conservé) ============ */}
        <section className="border-t border-[#B89A5A]/20">
          <Reveal className="mx-auto max-w-xl px-4 py-12 text-center sm:px-6 sm:py-16">
            <h2 className="dl-display text-2xl font-bold text-[#F2EFE6]">Suggest a Feature</h2>
            <p className="mt-3 text-sm text-[#F2EFE6]/75">
              Missing something you'd love to see in Detective Labs? Tell us!
            </p>

            {feedbackStatus === 'sent' ? (
              <p className="mt-6 font-semibold text-[#5fbf92]" role="status">
                Thank you! Your suggestion has been sent.
              </p>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="mx-auto mt-6 flex max-w-sm flex-col gap-3 text-left">
                <label htmlFor="feedback-name" className="sr-only">
                  Your name (optional)
                </label>
                <input
                  id="feedback-name"
                  type="text"
                  placeholder="Your name (optional)"
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  className="w-full rounded-lg border border-[#B89A5A]/40 bg-[#1D2A3A] px-4 py-2.5 text-sm text-[#F2EFE6] placeholder-[#F2EFE6]/45 focus:border-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]/60"
                />
                <label htmlFor="feedback-message" className="sr-only">
                  Describe the feature you want
                </label>
                <textarea
                  id="feedback-message"
                  placeholder="Describe the feature you want..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  rows={4}
                  required
                  className="w-full resize-none rounded-lg border border-[#B89A5A]/40 bg-[#1D2A3A] px-4 py-2.5 text-sm text-[#F2EFE6] placeholder-[#F2EFE6]/45 focus:border-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]/60"
                />
                {feedbackStatus === 'error' && (
                  <p className="text-sm text-[#e8a08f]" role="alert">
                    Something went wrong. Please try again.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={feedbackStatus === 'sending'}
                  className="self-center rounded-lg border-0 bg-[#167C80] px-6 py-2.5 text-sm font-semibold text-[#F2EFE6] transition-colors hover:bg-[#1a9096] disabled:cursor-wait disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0D]"
                >
                  {feedbackStatus === 'sending' ? 'Sending...' : 'Send Suggestion'}
                </button>
              </form>
            )}
          </Reveal>
        </section>

        {/* ============ 9. FINAL CTA ============ */}
        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <Reveal className="mx-auto max-w-4xl rounded-2xl border border-[#B89A5A] bg-[#1D2A3A]/95 px-5 py-10 text-center sm:py-12 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9),0_0_80px_-20px_rgba(184,154,90,0.3)] sm:px-12">
            <p className="text-sm font-semibold text-[#B89A5A]">
              <span className="inline-flex items-center gap-2">
                <StarIcon className="h-3.5 w-3.5" /> Case file #0482 is waiting <StarIcon className="h-3.5 w-3.5" />
              </span>
            </p>
            <h2 className="dl-display mt-4 text-[1.75rem] font-bold leading-tight text-[#F2EFE6] sm:text-4xl">Ready to open your first case?</h2>
            <p className="mx-auto mt-4 max-w-xl text-[#F2EFE6]/80">
              Join the early access list and be the first to know when new subjects and features go live.
            </p>
            <div className="mt-8 flex justify-center">
              <EmailForm onJoinWaitlist={handleJoinWaitlist} idPrefix="footer" />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={onSignup}
                className="w-full rounded-lg border border-[#B89A5A] bg-transparent px-5 py-3 text-center text-sm font-semibold text-[#B89A5A] transition-colors hover:bg-[#B89A5A]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A] sm:w-auto sm:py-2.5"
              >
                Create your account
              </button>
              <button
                type="button"
                onClick={onViewPricing}
                className="w-full rounded border-0 bg-transparent px-0 py-1.5 text-center text-sm text-[#F2EFE6]/80 underline underline-offset-4 hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A] sm:w-auto sm:py-1"
              >
                See plans &amp; pricing
              </button>
            </div>
            <SocialButtons className="mt-6 justify-center" />
          </Reveal>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="relative z-10 border-t border-[#B89A5A]/25 bg-[#1D2A3A]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-8 text-sm text-[#F2EFE6]/70 sm:flex-row sm:px-6">
          <div className="flex items-center justify-center" style={{ textDecoration: 'none' }}>
            <Logo variant="horizontal" theme={theme} />
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <p>© {new Date().getFullYear()} Detective Labs. All rights reserved.</p>
            <div className="flex items-center gap-3 text-xs">
              <a href="/privacy.html" className="text-[#F2EFE6]/70 underline underline-offset-4 hover:text-[#B89A5A]">
                Privacy Policy
              </a>
              <span aria-hidden="true">·</span>
              <a href="/terms.html" className="text-[#F2EFE6]/70 underline underline-offset-4 hover:text-[#B89A5A]">
                Terms &amp; Conditions
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="rounded text-[#F2EFE6]/70 hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
            >
              <TelegramIcon />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded text-[#F2EFE6]/70 hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;