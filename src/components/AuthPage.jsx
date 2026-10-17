import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase-config';
import Logo from './Logo';
import '../tailwind.css';

/* ------------------------------------------------------------------ */
/*  Detective Labs — Auth page (Sign up + Log in)                      */
/*  Palette: Obsidian #0B0D0D · Ink Blue #1D2A3A · Paper #F2EFE6       */
/*           Antique Gold #B89A5A · Teal #167C80 · Academic Blue #3F628C */
/* ------------------------------------------------------------------ */

const googleProvider = new GoogleAuthProvider();

const ACADEMIC_YEARS = ['2nd Year', '3rd Year', '4th Year', 'Post-grad / Other'];

/* Messages clairs à la place des erreurs brutes de Firebase */
const friendlyError = (err) => {
  switch (err && err.code) {
    case 'auth/email-already-in-use':
      return 'This email already has a dossier. Use "Log In" instead.';
    case 'auth/invalid-email':
      return 'That email address does not look right. Check it and try again.';
    case 'auth/weak-password':
      return 'Your password is too weak. Use at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-login-credentials':
      return 'Wrong email or password. Check your details and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a few minutes, then try again.';
    case 'auth/network-request-failed':
      return 'No connection. Check your internet and try again.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was closed before it finished. Try again.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google window. Allow pop-ups for this site and try again.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled yet. Use your email instead.';
    default:
      return (err && err.message) || 'Something went wrong. Please try again.';
  }
};

/* ---------- Icônes ---------- */

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const UserIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
  </svg>
);
const MailIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
const CapIcon = () => (
  <svg {...iconProps}>
    <path d="M2 9l10-5 10 5-10 5-10-5z" />
    <path d="M6 11.5V16c0 1.2 2.7 3 6 3s6-1.8 6-3v-4.5" />
  </svg>
);
const LockIcon = () => (
  <svg {...iconProps}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);
const ChevronIcon = () => (
  <svg {...iconProps} width={16} height={16}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const EyeIcon = ({ off }) => (
  <svg {...iconProps}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);
const StarIcon = ({ className = 'h-3.5 w-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.9 5.9 20.4l1.5-6.8L2.2 9l6.9-.7L12 2z" />
  </svg>
);

/* Champ de formulaire : étiquette + icône + contrôle dans une seule boîte */
const Field = ({ id, label, icon, children }) => (
  <div className="text-left">
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#F2EFE6]">
      {label}
    </label>
    <div className="dl-field">
      <span className="shrink-0 text-[#F2EFE6]/55">{icon}</span>
      {children}
    </div>
  </div>
);

/* ---------- Page ---------- */

const AuthPage = ({ onAuthSuccess, initialMode = 'login', onBack }) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const busy = loading || googleLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError('');

    const cleanEmail = email.trim();
    const cleanName = displayName.trim();

    if (isSignUp && !cleanName) {
      setError('Enter your full name or an agent alias.');
      return;
    }
    if (!cleanEmail) {
      setError('Enter your email address.');
      return;
    }
    if (isSignUp && !academicYear) {
      setError('Select your academic year.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }
    if (isSignUp && password.length < 6) {
      setError('Your password needs at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        // Le compte est créé : une erreur de profil ne doit pas bloquer l'inscription
        try {
          await updateProfile(userCredential.user, { displayName: cleanName });
        } catch (profileErr) {
          console.error('Profile update error:', profileErr);
        }
        try {
          localStorage.setItem(`academic_year_${userCredential.user.uid}`, academicYear);
        } catch (storageErr) {
          console.error('Academic year save error:', storageErr);
        }
        onAuthSuccess(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        onAuthSuccess(userCredential.user);
      }
    } catch (err) {
      setError(friendlyError(err));
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    if (busy) return;
    setError('');
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onAuthSuccess(result.user);
    } catch (err) {
      setError(friendlyError(err));
    }
    setGoogleLoading(false);
  };

  const switchMode = () => {
    setIsSignUp((v) => !v);
    setError('');
  };

  const logoContent = <Logo variant="horizontal" theme="dark" />;

  return (
    <div className="dl-auth relative isolate min-h-screen overflow-x-clip bg-[#0B0D0D] text-[#F2EFE6] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

        .dl-auth { font-family: 'IBM Plex Sans', system-ui, sans-serif; min-height: 100vh; }
        .dl-auth, .dl-auth *, .dl-auth *::before, .dl-auth *::after { box-sizing: border-box; }
        .dl-auth .dl-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        :where(.dl-auth) :where(h1, h2, p) { margin: 0; }
        @supports (min-height: 100dvh) { .dl-auth { min-height: 100dvh; } }

        /* ---- Fond : halo teal discret + lignes de grille de détective ---- */
        .dl-auth-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .dl-auth-glow { position: absolute; border-radius: 9999px; filter: blur(100px); will-change: transform; }
        .dl-auth-glow-1 { width: 38rem; height: 38rem; background: #167C80; opacity: .20; top: -12rem; left: 50%; margin-left: -19rem; animation: dl-auth-drift 22s ease-in-out infinite alternate; }
        .dl-auth-glow-2 { width: 26rem; height: 26rem; background: #B89A5A; opacity: .08; bottom: -10rem; right: -8rem; animation: dl-auth-drift-b 28s ease-in-out infinite alternate; }
        .dl-auth-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(242,239,230,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(242,239,230,.05) 1px, transparent 1px);
          background-size: 52px 52px;
          -webkit-mask-image: radial-gradient(ellipse at 50% 35%, #000 20%, transparent 72%);
          mask-image: radial-gradient(ellipse at 50% 35%, #000 20%, transparent 72%);
        }
        @keyframes dl-auth-drift { from { transform: translate3d(-4rem,0,0) scale(1); } to { transform: translate3d(4rem,3rem,0) scale(1.12); } }
        @keyframes dl-auth-drift-b { from { transform: translate3d(0,0,0); } to { transform: translate3d(-5rem,-4rem,0) scale(1.15); } }

        /* ---- Carte : bordure intérieure façon registre officiel ---- */
        .dl-register { position: relative; }
        .dl-register::before {
          content: ''; position: absolute; inset: 7px; border: 1px solid rgba(184,154,90,.28);
          border-radius: .6rem; pointer-events: none;
        }
        @keyframes dl-auth-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .dl-auth-card-in { animation: dl-auth-in .6s cubic-bezier(.2,.7,.2,1) both; }

        /* ---- Champs (!important pour résister aux styles globaux de l'app) ---- */
        .dl-auth .dl-field {
          display: flex; align-items: center; gap: .65rem; width: 100%;
          padding: 0 .9rem; background: rgba(11,13,13,.55);
          border: 1.5px solid rgba(242,239,230,.18); border-radius: .6rem;
          transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .dl-auth .dl-field:hover { border-color: rgba(242,239,230,.32); }
        .dl-auth .dl-field:focus-within {
          border-color: #B89A5A; background: rgba(11,13,13,.75);
          box-shadow: 0 0 0 3px rgba(184,154,90,.18);
        }
        .dl-auth .dl-field input,
        .dl-auth .dl-field select {
          flex: 1; min-width: 0; width: 100%;
          padding: .8rem 0 !important; margin: 0 !important;
          background: transparent !important; border: none !important;
          box-shadow: none !important; border-radius: 0 !important;
          color: #F2EFE6 !important; font: inherit; font-size: 1rem; line-height: 1.4;
          outline: none !important;
        }
        .dl-auth .dl-field input::placeholder { color: rgba(242,239,230,.42); opacity: 1; }
        .dl-auth .dl-field select { -webkit-appearance: none; appearance: none; cursor: pointer; }
        .dl-auth .dl-field select.dl-empty { color: rgba(242,239,230,.42) !important; }
        .dl-auth .dl-field select option { background: #1D2A3A; color: #F2EFE6; }
        .dl-auth .dl-field input:-webkit-autofill,
        .dl-auth .dl-field input:-webkit-autofill:hover,
        .dl-auth .dl-field input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #121a24 inset !important;
          -webkit-text-fill-color: #F2EFE6 !important;
          caret-color: #F2EFE6;
          transition: background-color 9999s ease-in-out 0s;
        }
        .dl-auth .dl-eye {
          background: transparent !important; border: none !important; box-shadow: none !important;
          padding: .35rem !important; margin: 0 -.35rem 0 0 !important; border-radius: .4rem;
          color: rgba(242,239,230,.6); cursor: pointer; line-height: 0;
        }
        .dl-auth .dl-eye:hover { color: #B89A5A; }

        @media (prefers-reduced-motion: reduce) {
          .dl-auth-glow, .dl-auth-card-in { animation: none !important; }
        }
        @media (max-width: 640px) {
          .dl-auth-glow { filter: blur(70px); }
          .dl-auth-glow-1 { width: 24rem; height: 24rem; margin-left: -12rem; top: -9rem; }
          .dl-auth-glow-2 { display: none; }
          .dl-auth-grid { background-size: 40px 40px; }
        }
      `}</style>

      {/* Fond ambiant */}
      <div className="dl-auth-bg" aria-hidden="true">
        <div className="dl-auth-glow dl-auth-glow-1" />
        <div className="dl-auth-glow dl-auth-glow-2" />
        <div className="dl-auth-grid" />
      </div>

      {/* En-tête minimal */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to home"
            style={{ background: 'transparent', border: 'none', padding: 0, outline: 'none' }}
            className="flex cursor-pointer items-center"
          >
            {logoContent}
          </button>
        ) : (
          <div className="flex items-center">{logoContent}</div>
        )}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{ background: 'transparent' }}
            className="rounded-lg border border-[#F2EFE6]/20 px-3.5 py-2 text-sm font-medium text-[#F2EFE6]/80 transition-colors hover:border-[#B89A5A] hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
          >
            Back to home
          </button>
        )}
      </header>

      {/* Dossier */}
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-4 pb-12 pt-4 sm:pt-8">
        <section
          aria-labelledby="auth-title"
          className="dl-register dl-auth-card-in w-full rounded-2xl border border-[#B89A5A]/60 bg-[#1D2A3A] px-5 py-8 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9),0_0_80px_-30px_rgba(22,124,128,0.5)] sm:px-8 sm:py-10"
        >
          <div className="flex flex-col items-center text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#B89A5A] bg-[#B89A5A]/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
              <StarIcon />
              {isSignUp ? 'AGENT REGISTRATION' : 'AGENT LOGIN'}
            </p>
            <h1 id="auth-title" className="dl-display mt-5 text-[1.65rem] font-bold leading-tight text-[#F2EFE6] sm:text-3xl">
              {isSignUp ? 'Create Your Detective Dossier' : 'Welcome Back, Detective'}
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#F2EFE6]/70">
              {isSignUp
                ? 'Start solving cases, tracking study streaks, and mastering your syllabus.'
                : 'Log in to pick up your investigations and keep your study streak alive.'}
            </p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={busy}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-lg border border-[#F2EFE6]/25 bg-[#F2EFE6] px-4 py-3 text-sm font-semibold text-[#0B0D0D] transition-all hover:-translate-y-0.5 hover:bg-white disabled:cursor-wait disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D2A3A]"
          >
            <GoogleIcon />
            {googleLoading ? 'Opening Google...' : 'Continue with Google'}
          </button>

          {/* Séparateur */}
          <div className="my-6 flex items-center gap-3 text-[11px] font-semibold tracking-[0.14em] text-[#F2EFE6]/50" role="separator">
            <span className="h-px flex-1 bg-[#B89A5A]/30" />
            <span>{isSignUp ? 'OR REGISTER WITH EMAIL' : 'OR LOG IN WITH EMAIL'}</span>
            <span className="h-px flex-1 bg-[#B89A5A]/30" />
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {isSignUp && (
              <Field id="auth-name" label="Full name / Agent alias" icon={<UserIcon />}>
                <input
                  id="auth-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Agent Fleming"
                  autoComplete="name"
                />
              </Field>
            )}

            <Field id="auth-email" label={isSignUp ? 'Student email address' : 'Email address'} icon={<MailIcon />}>
              <input
                id="auth-email"
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                autoComplete="email"
              />
            </Field>

            {isSignUp && (
              <Field id="auth-year" label="Academic year" icon={<CapIcon />}>
                <select
                  id="auth-year"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className={academicYear ? '' : 'dl-empty'}
                >
                  <option value="" disabled>
                    Select your year
                  </option>
                  {ACADEMIC_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none shrink-0 text-[#F2EFE6]/55">
                  <ChevronIcon />
                </span>
              </Field>
            )}

            <Field id="auth-password" label="Password" icon={<LockIcon />}>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? 'At least 6 characters' : 'Enter your password'}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className="dl-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                <EyeIcon off={showPassword} />
              </button>
            </Field>

            <p
              role="alert"
              aria-live="polite"
              className={`rounded-lg border border-[#e8a08f]/40 bg-[#e8a08f]/10 px-3 py-2 text-sm text-[#f0b5a6] ${error ? '' : 'hidden'}`}
            >
              {error}
            </p>

            <button
              type="submit"
              disabled={busy}
              className="mt-1 w-full rounded-lg border-0 bg-[#167C80] px-4 py-3.5 text-base font-semibold text-[#F2EFE6] shadow-lg shadow-[#167C80]/30 transition-all hover:-translate-y-0.5 hover:bg-[#1a9096] disabled:cursor-wait disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D2A3A]"
            >
              {loading
                ? isSignUp
                  ? 'Creating your ID...'
                  : 'Logging in...'
                : isSignUp
                ? 'Create Detective ID'
                : 'Log In'}
            </button>
          </form>

          {/* Conditions (inscription uniquement) */}
          {isSignUp && (
            <p className="mt-5 text-center text-xs leading-relaxed text-[#F2EFE6]/55">
              By creating a Detective ID you agree to our{' '}
              <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="text-[#F2EFE6]/80 underline underline-offset-2 hover:text-[#B89A5A]">
                Terms &amp; Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-[#F2EFE6]/80 underline underline-offset-2 hover:text-[#B89A5A]">
                Privacy Policy
              </a>
              .
            </p>
          )}

          {/* Changement de mode */}
          <p className="mt-5 text-center text-sm text-[#F2EFE6]/70">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={switchMode}
              style={{ background: 'transparent', border: 'none', padding: 0 }}
              className="cursor-pointer font-semibold text-[#7ea4d3] underline decoration-[#3F628C] decoration-2 underline-offset-4 transition-colors hover:text-[#F2EFE6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </section>
      </main>
    </div>
  );
};

export default AuthPage;