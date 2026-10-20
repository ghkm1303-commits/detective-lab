import React, { useEffect, useMemo, useRef } from 'react';
import '../tailwind.css';
import '../detective.css';

/* ------------------------------------------------------------------ */
/*  Detective Labs — Game resolution modal                             */
/*  Victoire : "CASE SOLVED"   |   Défaite : "COLD CASE / UNRESOLVED"  */
/*  Reçoit le résultat construit par ParasiteGame (voir finishGame).   */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(2, '0');
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Série de jours consécutifs avec au moins une partie (la partie qui vient de finir est déjà enregistrée)
const readStreak = (userId) => {
  if (!userId) return null;
  try {
    const raw = JSON.parse(localStorage.getItem(`stats_${userId}`));
    if (!raw) return 0;
    const days = new Set(
      (raw.gameHistory || [])
        .map((g) => {
          const d = new Date(g.timestamp);
          return Number.isNaN(d.getTime()) ? null : dayKey(d);
        })
        .filter(Boolean)
    );
    const cursor = new Date();
    if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (days.has(dayKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  } catch (err) {
    return null;
  }
};

const formatTime = (seconds) => {
  if (typeof seconds !== 'number' || Number.isNaN(seconds)) return '—';
  const m = Math.floor(seconds / 60);
  return `${m}:${pad(seconds % 60)}`;
};

const Stat = ({ icon, label, value }) => (
  <div className="rounded-xl border border-[#F2EFE6]/15 bg-[#0B0D0D]/40 px-3 py-3 text-center">
    <p className="text-lg" aria-hidden="true">
      {icon}
    </p>
    <p className="dl-display mt-0.5 text-xl font-bold text-[#B89A5A] sm:text-2xl">{value}</p>
    <p className="mt-0.5 text-[11px] text-[#F2EFE6]/60">{label}</p>
  </div>
);

const ResultScreen = ({
  result,
  userId,
  currentLang,
  onNextCase,
  onPlayAgain,
  onRetryCase,
  onViewArchive,
  onBackToMode,
}) => {
  const t = (en, fr) => (currentLang === 'fr' ? fr : en);
  const lang = currentLang === 'fr' ? 'fr' : 'en';
  const primaryRef = useRef(null);

  const won = Boolean(result && result.correct);
  const organism = result && result.organism;
  const streak = useMemo(() => readStreak(userId), [userId]);
  const nextCase = onNextCase || onPlayAgain;

  // Focus sur le bouton principal, Échap = retour aux modes de jeu
  useEffect(() => {
    if (primaryRef.current) primaryRef.current.focus();
    const onKey = (e) => {
      if (e.key === 'Escape' && onBackToMode) onBackToMode();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onBackToMode]);

  if (!result) return null;

  const name = (organism && organism.names && organism.names.en) || result.drugName || '—';
  const frName = organism && organism.names && organism.names.fr && organism.names.fr !== name ? organism.names.fr : null;
  const markers = Array.isArray(result.markers) ? result.markers : [];
  const hasArchive = Boolean(organism && onViewArchive);
  const totalClues = result.totalClues || null;

  const btnBase =
    'w-full rounded-lg border-0 px-5 py-3.5 text-base font-semibold text-[#F2EFE6] transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D2A3A]';

  return (
    <div className="dl-app relative isolate overflow-x-clip">
      <style>{`
        @keyframes dl-stamp {
          0% { opacity: 0; transform: rotate(-11deg) scale(2.4); }
          55% { opacity: 1; transform: rotate(-11deg) scale(.92); }
          100% { opacity: .95; transform: rotate(-11deg) scale(1); }
        }
        @keyframes dl-glow-emerald {
          0%, 100% { box-shadow: 0 0 12px rgba(47,125,91,.45), 0 0 0 1px rgba(47,125,91,.8); }
          50% { box-shadow: 0 0 30px rgba(47,125,91,.9), 0 0 0 1px rgba(47,125,91,1); }
        }
        .dl-stamp { animation: dl-stamp .7s cubic-bezier(.2,.8,.2,1) .25s both; }
        .dl-glow-emerald { animation: dl-glow-emerald 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .dl-stamp { animation: none; opacity: .95; transform: rotate(-11deg); }
          .dl-glow-emerald { animation: none; }
        }
      `}</style>
      <div className="dl-app-bg" aria-hidden="true" />

      {/* Fond assombri façon fenêtre modale */}
      <div className="fixed inset-0 z-0 bg-black/55" aria-hidden="true" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-8 sm:py-12">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-title"
          className={`dl-fade-in relative w-full overflow-hidden rounded-2xl border-2 bg-[#1D2A3A] p-5 shadow-[0_40px_90px_-25px_rgba(0,0,0,0.95)] sm:p-8 ${
            won ? 'border-[#B89A5A]' : 'border-[#B89A5A]/50'
          }`}
        >
          {/* ---------- Bandeau de statut ---------- */}
          {won ? (
            <p className="dl-glow-emerald inline-block rounded-full bg-[#2F7D5B]/25 px-4 py-1.5 text-[11px] font-bold tracking-[0.14em] text-[#7fd1a6]">
              ✓ {t('CASE STATUS: CLOSED & SOLVED', 'STATUT DU DOSSIER : CLOS ET RÉSOLU')}
            </p>
          ) : (
            <p className="inline-block rounded-full border border-[#B89A5A] bg-[#B89A5A]/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.14em] text-[#B89A5A]">
              ⚠ {t('CASE STATUS: COLD CASE / UNRESOLVED', 'STATUT DU DOSSIER : AFFAIRE CLASSÉE / NON RÉSOLUE')}
            </p>
          )}

          {/* ---------- Tampon CASE SOLVED ---------- */}
          {won && (
            <div
              className="dl-stamp pointer-events-none absolute right-3 top-14 select-none rounded-md border-[3px] border-[#B89A5A] px-3 py-1 text-center sm:right-6 sm:top-12"
              aria-hidden="true"
              style={{ boxShadow: 'inset 0 0 0 2px rgba(184,154,90,.35)' }}
            >
              <span className="dl-display block text-lg font-bold leading-none tracking-[0.12em] text-[#B89A5A] sm:text-2xl">
                CASE SOLVED
              </span>
            </div>
          )}

          <h1 id="result-title" className="dl-display mt-6 text-[1.6rem] font-bold leading-tight text-[#F2EFE6] sm:text-3xl">
            {won ? t('CASE SOLVED', 'CAS RÉSOLU') : t('CASE UNSOLVED', 'CAS NON RÉSOLU')}
          </h1>

          {/* ---------- Organisme ---------- */}
          <div className="mt-4 rounded-xl border border-[#B89A5A]/40 bg-[#0B0D0D]/35 px-4 py-4">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
              {won ? t('TARGET IDENTIFIED', 'CIBLE IDENTIFIÉE') : t('THE TRUE TARGET WAS', 'LA VRAIE CIBLE ÉTAIT')}
            </p>
            <p className="dl-display mt-1 text-2xl font-bold text-[#F2EFE6] sm:text-3xl">{name}</p>
            {(frName || result.drugClass) && (
              <p className="mt-1 text-sm text-[#F2EFE6]/60">
                {frName && <span className="italic">{frName}</span>}
                {frName && result.drugClass && ' · '}
                {result.drugClass}
              </p>
            )}
          </div>

          {won ? (
            <>
              {/* ---------- Statistiques ---------- */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat icon="⏱️" label={t('Time Taken', 'Temps écoulé')} value={formatTime(result.timeSeconds)} />
                <Stat
                  icon="🔍"
                  label={t('Clues Used', 'Indices utilisés')}
                  value={totalClues ? `${result.cluesUsed}/${totalClues}` : result.cluesUsed}
                />
                <Stat icon="⭐" label="XP" value={`+${result.xpEarned || 0}`} />
                <Stat
                  icon="🔥"
                  label={t('Streak', 'Série')}
                  value={streak === null ? '—' : `${streak} ${streak === 1 ? t('day', 'jour') : t('days', 'jours')}`}
                />
              </div>
              <p className="mt-3 text-center text-sm text-[#F2EFE6]/60">
                {t('Score', 'Score')}: <span className="font-semibold text-[#B89A5A]">{result.score} pts</span>
              </p>

              {/* ---------- Récap diagnostique ---------- */}
              {result.recap && (
                <div className="mt-4 rounded-lg border-l-4 border-[#2F7D5B] bg-[#0B0D0D]/35 px-4 py-3">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-[#7fd1a6]">
                    🔬 {t('DIAGNOSTIC RECAP', 'RÉCAP DIAGNOSTIQUE')}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#F2EFE6]/85">{result.recap}</p>
                </div>
              )}

              {/* ---------- Boutons ---------- */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  ref={primaryRef}
                  type="button"
                  onClick={nextCase}
                  className={`${btnBase} bg-[#167C80] shadow-lg shadow-[#167C80]/30 hover:bg-[#1a9096]`}
                >
                  ▶ {t('Next Case File', 'Dossier suivant')}
                </button>
                {hasArchive && (
                  <button
                    type="button"
                    onClick={() => onViewArchive(organism)}
                    className={`${btnBase} bg-[#3F628C] hover:bg-[#4a73a3]`}
                  >
                    📖 {t('View Full Archive Entry', "Voir la fiche complète des archives")}
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* ---------- 3 marqueurs diagnostiques ---------- */}
              {markers.length > 0 && (
                <div className="mt-4">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
                    {t('KEY DIAGNOSTIC MARKERS', 'MARQUEURS DIAGNOSTIQUES CLÉS')}
                  </p>
                  <ul className="m-0 mt-2 flex list-none flex-col gap-2 p-0">
                    {markers.map((m, i) => (
                      <li key={i} className="flex gap-3 rounded-lg border-l-4 border-[#B89A5A] bg-[#0B0D0D]/35 px-4 py-3 text-sm leading-relaxed text-[#F2EFE6]/90">
                        <span className="text-[#B89A5A]" aria-hidden="true">
                          •
                        </span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-4 text-center text-sm text-[#F2EFE6]/60">
                {t('Clues used', 'Indices utilisés')}:{' '}
                <span className="font-semibold text-[#F2EFE6]/85">
                  {totalClues ? `${result.cluesUsed}/${totalClues}` : result.cluesUsed}
                </span>
                {typeof result.timeSeconds === 'number' && (
                  <>
                    {' · '}
                    {t('Time', 'Temps')}: <span className="font-semibold text-[#F2EFE6]/85">{formatTime(result.timeSeconds)}</span>
                  </>
                )}
              </p>

              {/* ---------- Boutons ---------- */}
              <div className="mt-6 flex flex-col gap-3">
                {onRetryCase && organism && (
                  <button
                    ref={primaryRef}
                    type="button"
                    onClick={onRetryCase}
                    className={`${btnBase} bg-[#3F628C] hover:bg-[#4a73a3]`}
                  >
                    🔄 {t('Retry Case', 'Réessayer ce cas')}
                  </button>
                )}
                <button
                  ref={onRetryCase && organism ? undefined : primaryRef}
                  type="button"
                  onClick={nextCase}
                  className={`${btnBase} bg-[#167C80] shadow-lg shadow-[#167C80]/30 hover:bg-[#1a9096]`}
                >
                  ▶ {t('Next Case File', 'Dossier suivant')}
                </button>
              </div>
              {hasArchive && (
                <button
                  type="button"
                  onClick={() => onViewArchive(organism)}
                  className="mx-auto mt-4 block rounded border-0 bg-transparent p-0 text-sm text-[#8fb0d6] underline underline-offset-4 hover:text-[#F2EFE6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8fb0d6]"
                >
                  📖 {t('View Full Archive Entry', 'Voir la fiche complète des archives')}
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={onBackToMode}
            className="mx-auto mt-5 block rounded border-0 bg-transparent p-0 text-sm text-[#F2EFE6]/60 underline underline-offset-4 hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
          >
            ← {t('Back to Game Modes', 'Retour aux modes de jeu')}
          </button>
        </section>
      </main>
    </div>
  );
};

export default ResultScreen;