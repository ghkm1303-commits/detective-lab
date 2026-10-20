import React, { useMemo, useState } from 'react';
import Logo from './Logo';
import '../tailwind.css';
import '../detective.css';

/* ------------------------------------------------------------------ */
/*  Detective Labs — Student Stats & Progress                          */
/*  Toutes les données viennent des stats déjà enregistrées dans le    */
/*  navigateur (localStorage, clé stats_<uid>) : rien à migrer.        */
/* ------------------------------------------------------------------ */

const DAY_MS = 24 * 60 * 60 * 1000;

// Même formule de niveau qu'avant : 1 niveau tous les 100 XP
const RANKS = [
  { min: 1, en: 'ROOKIE DETECTIVE', fr: 'DÉTECTIVE NOVICE' },
  { min: 2, en: 'JUNIOR DETECTIVE', fr: 'DÉTECTIVE JUNIOR' },
  { min: 3, en: 'DETECTIVE', fr: 'DÉTECTIVE' },
  { min: 4, en: 'SENIOR DETECTIVE', fr: 'DÉTECTIVE SENIOR' },
  { min: 6, en: 'CHIEF INSPECTOR', fr: 'INSPECTEUR EN CHEF' },
  { min: 9, en: 'MASTER DETECTIVE', fr: 'DÉTECTIVE MAÎTRE' },
];

const CATEGORY_LABELS = {
  protozoa: { en: 'Protozoa', fr: 'Protozoaires' },
  helminth: { en: 'Helminths', fr: 'Helminthes' },
  fungal: { en: 'Fungi', fr: 'Champignons' },
};

const EMPTY_STATS = { totalGamesPlayed: 0, totalXP: 0, gameHistory: [], modeStats: {} };

// Numéro de jour (calendrier local) pour comparer les dates sans souci d'heure d'été
const dayIndex = (date) => Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);

const analyze = (stats, organisms) => {
  const history = Array.isArray(stats.gameHistory) ? stats.gameHistory : [];
  // Une partie gagnée a toujours un score >= 100 ; perdue ou abandonnée = 0
  const solved = history.filter((g) => (g.score || 0) > 0);
  const accuracy = history.length ? Math.round((solved.length / history.length) * 100) : 0;
  const avgClues = solved.length
    ? solved.reduce((sum, g) => sum + (g.cluesUsed || 0), 0) / solved.length
    : 0;

  // Par organisme
  const perOrganism = {};
  history.forEach((g) => {
    const key = g.drugName || 'Unknown';
    if (!perOrganism[key]) perOrganism[key] = { name: key, attempts: 0, solved: 0, cluesSum: 0 };
    perOrganism[key].attempts += 1;
    if ((g.score || 0) > 0) {
      perOrganism[key].solved += 1;
      perOrganism[key].cluesSum += g.cluesUsed || 0;
    }
  });

  const byName = new Map(organisms.map((o) => [o.names && o.names.en, o]));
  const pool = organisms.filter((o) => o.category !== 'entomology' && o.category !== 'overview');

  // Maîtrise du module : organismes différents identifiés / organismes jouables
  const solvedNames = new Set(Object.values(perOrganism).filter((p) => p.solved > 0).map((p) => p.name));
  const masteredCount = pool.filter((o) => solvedNames.has(o.names.en)).length;

  // Précision par catégorie
  const categories = Object.keys(CATEGORY_LABELS)
    .map((cat) => {
      const total = pool.filter((o) => o.category === cat).length;
      let attempts = 0;
      let wins = 0;
      history.forEach((g) => {
        const o = byName.get(g.drugName);
        if (o && o.category === cat) {
          attempts += 1;
          if ((g.score || 0) > 0) wins += 1;
        }
      });
      return { cat, total, attempts, wins, accuracy: attempts ? Math.round((wins / attempts) * 100) : null };
    })
    .filter((c) => c.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy);

  // Organismes à revoir : ratés au moins une fois, ou qui demandent beaucoup d'indices
  const weak = Object.values(perOrganism)
    .map((p) => {
      const failures = p.attempts - p.solved;
      const avg = p.solved ? p.cluesSum / p.solved : 0;
      return { ...p, failures, avg };
    })
    .filter((p) => p.failures > 0 || p.avg >= 5)
    .sort((a, b) => b.failures * 10 + b.avg - (a.failures * 10 + a.avg))
    .slice(0, 5);

  // Activité : 14 derniers jours + séries
  const dayCounts = new Map();
  history.forEach((g) => {
    const d = new Date(g.timestamp);
    if (Number.isNaN(d.getTime())) return;
    const idx = dayIndex(d);
    dayCounts.set(idx, (dayCounts.get(idx) || 0) + 1);
  });
  const today = dayIndex(new Date());
  const last14 = [];
  for (let i = 13; i >= 0; i -= 1) {
    const idx = today - i;
    last14.push({ idx, count: dayCounts.get(idx) || 0, date: new Date(idx * DAY_MS) });
  }

  let current = 0;
  let cursor = dayCounts.has(today) ? today : today - 1;
  while (dayCounts.has(cursor)) {
    current += 1;
    cursor -= 1;
  }
  const sortedDays = [...dayCounts.keys()].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  sortedDays.forEach((d, i) => {
    run = i > 0 && d === sortedDays[i - 1] + 1 ? run + 1 : 1;
    if (run > best) best = run;
  });

  return {
    history,
    solvedCount: solved.length,
    accuracy,
    avgClues,
    poolSize: pool.length,
    masteredCount,
    categories,
    weak,
    last14,
    streak: { current, best, activeDays: sortedDays.length },
  };
};

const Card = ({ title, children, className = '' }) => (
  <section className={`rounded-2xl border border-[#B89A5A]/45 bg-[#1D2A3A] p-5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)] sm:p-6 ${className}`}>
    {title && <h2 className="dl-display mb-4 text-lg font-bold text-[#B89A5A] sm:text-xl">{title}</h2>}
    {children}
  </section>
);

const StatCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-[#F2EFE6]/15 bg-[#1D2A3A] px-4 py-4">
    <p className="text-xs font-semibold tracking-wide text-[#F2EFE6]/60">{label}</p>
    <p className="dl-display mt-1 text-3xl font-bold text-[#B89A5A]">{value}</p>
    {hint && <p className="mt-0.5 text-xs text-[#F2EFE6]/50">{hint}</p>}
  </div>
);

const StatsPanel = ({
  user,
  userName,
  organisms = [],
  onBack,
  onLogout,
  theme,
  currentLang = 'en',
}) => {
  const lang = currentLang === 'fr' ? 'fr' : 'en';
  const t = (en, fr) => (lang === 'fr' ? fr : en);

  const [stats] = useState(() => {
    try {
      const saved = localStorage.getItem(`stats_${user.uid}`);
      return saved ? { ...EMPTY_STATS, ...JSON.parse(saved) } : EMPTY_STATS;
    } catch (err) {
      return EMPTY_STATS;
    }
  });
  const [photoFailed, setPhotoFailed] = useState(false);

  const data = useMemo(() => analyze(stats, organisms), [stats, organisms]);

  const level = Math.floor((stats.totalXP || 0) / 100) + 1;
  const xpIntoLevel = (stats.totalXP || 0) % 100;
  const rank = [...RANKS].reverse().find((r) => level >= r.min) || RANKS[0];
  const initial = String(userName || user.email || 'A').trim().charAt(0).toUpperCase();
  const memberSince =
    user.metadata && user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : '—';
  const masteryPct = data.poolSize ? Math.round((data.masteredCount / data.poolSize) * 100) : 0;
  const maxDay = Math.max(1, ...data.last14.map((d) => d.count));

  const modeLabel = (mode) =>
    mode === 'blind'
      ? `🔍 ${t('Open Investigation', 'Enquête Ouverte')}`
      : `📚 ${t('Targeted / Lesson', 'Ciblée / Leçon')}`;

  return (
    <div className="dl-app relative isolate overflow-x-clip">
      <div className="dl-app-bg" aria-hidden="true" />

      {/* ============ EN-TÊTE ============ */}
      <header className="sticky top-0 z-40 border-b border-[#B89A5A]/25 bg-[#1D2A3A]/95 shadow-lg shadow-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-lg border border-[#F2EFE6]/25 bg-transparent px-3.5 py-2 text-sm font-medium text-[#F2EFE6] transition-colors hover:border-[#B89A5A] hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
            >
              <span aria-hidden="true">←</span> {t('Back', 'Retour')}
            </button>
            <div className="hidden sm:block">
              <Logo variant="horizontal" theme={theme} />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-[#E63946]/60 bg-transparent px-3.5 py-2 text-sm font-semibold text-[#ff8f9a] transition-colors hover:bg-[#E63946]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8f9a]"
            >
              🚪 {t('Logout', 'Déconnexion')}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col gap-5 px-4 pb-16 pt-6 sm:gap-6 sm:px-6 sm:pt-10">
        {/* ============ CARTE AGENT + RANG ============ */}
        <section className="dl-fade-in rounded-2xl border border-[#B89A5A]/60 bg-gradient-to-br from-[#24364b] to-[#1D2A3A] p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_70px_-30px_rgba(22,124,128,0.5)] sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#B89A5A] bg-[#0B0D0D] text-2xl font-bold text-[#B89A5A] sm:h-20 sm:w-20">
                {user.photoURL && !photoFailed ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={() => setPhotoFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
              <div className="min-w-0">
                <p className="inline-block rounded-full border border-[#B89A5A] bg-[#B89A5A]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#B89A5A]">
                  LEVEL {level} {rank[lang]}
                </p>
                <h1 className="dl-display mt-2 truncate text-2xl font-bold text-[#F2EFE6] sm:text-3xl">{userName}</h1>
                <p className="truncate text-sm text-[#F2EFE6]/60">{user.email}</p>
              </div>
            </div>

            <div className="md:w-72">
              <div className="flex items-center justify-between text-xs text-[#F2EFE6]/65">
                <span>
                  {t('Level', 'Niveau')} {level}
                </span>
                <span>
                  {xpIntoLevel} / 100 {t('XP to next level', "XP jusqu'au prochain niveau")}
                </span>
              </div>
              <div
                className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#0B0D0D]/60"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={xpIntoLevel}
                aria-label={t('Progress to next level', 'Progression vers le niveau suivant')}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#167C80] to-[#2F7D5B] transition-all duration-700"
                  style={{ width: `${xpIntoLevel}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-[#2F7D5B] bg-[#2F7D5B]/20 px-3 py-1 font-semibold tracking-wide text-[#7fd1a6]">
                  PRO AGENT
                </span>
                <span className="text-[#F2EFE6]/55">
                  {t('Member since', 'Membre depuis')} {memberSince}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ CHIFFRES CLÉS ============ */}
        <section aria-label={t('Key numbers', 'Chiffres clés')} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label={t('Cases solved', 'Cas résolus')} value={data.solvedCount} hint={`${data.history.length} ${t('played', 'joués')}`} />
          <StatCard label={t('Accuracy rate', 'Taux de réussite')} value={`${data.accuracy}%`} />
          <StatCard
            label={t('Avg clues used', 'Indices moyens')}
            value={data.solvedCount ? data.avgClues.toFixed(1) : '—'}
            hint={t('on solved cases', 'sur les cas résolus')}
          />
          <StatCard label={t('Total XP', 'XP total')} value={stats.totalXP || 0} />
        </section>

        {data.history.length === 0 && (
          <Card>
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <span className="text-4xl" aria-hidden="true">
                🕵️
              </span>
              <p className="dl-display text-xl font-bold text-[#F2EFE6]">
                {t('Your case history is empty.', "Votre historique d'enquêtes est vide.")}
              </p>
              <p className="max-w-md text-sm text-[#F2EFE6]/65">
                {t(
                  'Solve your first case and your progress, weak spots and streak will appear here.',
                  'Résolvez votre premier cas et votre progression, vos points faibles et votre série apparaîtront ici.'
                )}
              </p>
              <button
                type="button"
                onClick={onBack}
                className="rounded-lg border-0 bg-[#167C80] px-6 py-3 text-sm font-semibold text-[#F2EFE6] shadow-lg shadow-[#167C80]/25 transition-colors hover:bg-[#1a9096] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6]"
              >
                {t('Start Game', 'Commencer le jeu')}
              </button>
            </div>
          </Card>
        )}

        {/* ============ MAÎTRISE DES MODULES ============ */}
        <Card title={t('Module Mastery', 'Maîtrise des modules')}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#B89A5A]/45 bg-[#0B0D0D]/35 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
                    {t('4TH YEAR', '4ÈME ANNÉE')}
                  </p>
                  <h3 className="dl-display mt-1 text-lg font-bold text-[#F2EFE6]">
                    🦠 {t('Parasitology - Mycology', 'Parasitologie - Mycologie')}
                  </h3>
                </div>
                <span className="dl-display text-2xl font-bold text-[#7fd1a6]">{masteryPct}%</span>
              </div>
              <div
                className="mt-3 h-3 overflow-hidden rounded-full bg-[#F2EFE6]/10"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={masteryPct}
                aria-label={t('Parasitology mastery', 'Maîtrise de la parasitologie')}
              >
                <div className="h-full rounded-full bg-[#2F7D5B] transition-all duration-700" style={{ width: `${masteryPct}%` }} />
              </div>
              <p className="mt-2 text-sm text-[#F2EFE6]/65">
                {organisms.length > 0
                  ? t(
                      `${data.masteredCount} of ${data.poolSize} organisms identified`,
                      `${data.masteredCount} organismes sur ${data.poolSize} identifiés`
                    )
                  : t('Organism list unavailable.', "Liste d'organismes indisponible.")}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#F2EFE6]/20 p-4 text-center">
              <span className="text-3xl opacity-60" aria-hidden="true">
                🧫
              </span>
              <p className="mt-2 text-sm font-semibold text-[#F2EFE6]/70">
                {t('More modules coming soon', 'D’autres modules arrivent bientôt')}
              </p>
              <p className="mt-1 text-xs text-[#F2EFE6]/50">
                {t('Your progress will appear here as they open.', 'Votre progression apparaîtra ici à leur ouverture.')}
              </p>
            </div>
          </div>
        </Card>

        {/* ============ ZONES À REVOIR ============ */}
        <Card title={t('Focus Areas', 'Zones à revoir')}>
          {data.history.length === 0 ? (
            <p className="text-sm text-[#F2EFE6]/60">
              {t('Weak topics will show up after a few cases.', 'Vos points faibles apparaîtront après quelques cas.')}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-[#F2EFE6]">{t('Organisms to review', 'Organismes à revoir')}</h3>
                {data.weak.length === 0 ? (
                  <p className="mt-3 rounded-lg border border-[#2F7D5B]/50 bg-[#2F7D5B]/10 px-3 py-3 text-sm text-[#7fd1a6]">
                    {t('Nothing to flag. Keep going!', 'Rien à signaler. Continuez !')}
                  </p>
                ) : (
                  <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
                    {data.weak.map((w) => (
                      <li
                        key={w.name}
                        className="flex items-center justify-between gap-3 rounded-lg border-l-4 border-[#B89A5A] bg-[#0B0D0D]/35 px-3 py-2.5"
                      >
                        <span className="min-w-0 truncate text-sm font-semibold text-[#F2EFE6]">{w.name}</span>
                        <span className="shrink-0 text-xs text-[#B89A5A]">
                          {w.failures > 0
                            ? t(`Missed ${w.failures}×`, `Raté ${w.failures}×`)
                            : t(`~${w.avg.toFixed(1)} clues needed`, `~${w.avg.toFixed(1)} indices`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#F2EFE6]">{t('Accuracy by category', 'Réussite par catégorie')}</h3>
                {data.categories.length === 0 ? (
                  <p className="mt-3 text-sm text-[#F2EFE6]/60">
                    {t('Not enough data yet.', 'Pas encore assez de données.')}
                  </p>
                ) : (
                  <ul className="m-0 mt-3 flex list-none flex-col gap-3 p-0">
                    {data.categories.map((c) => (
                      <li key={c.cat}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#F2EFE6]">{CATEGORY_LABELS[c.cat][lang]}</span>
                          <span className={c.accuracy < 50 ? 'text-[#f0b5a6]' : 'text-[#7fd1a6]'}>
                            {c.accuracy}% · {c.wins}/{c.attempts}
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#F2EFE6]/10">
                          <div
                            className={`h-full rounded-full ${c.accuracy < 50 ? 'bg-[#B89A5A]' : 'bg-[#2F7D5B]'}`}
                            style={{ width: `${c.accuracy}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* ============ ACTIVITÉ & SÉRIE ============ */}
        <Card title={t('Study Activity', "Activité d'étude")}>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#B89A5A]/45 bg-[#0B0D0D]/35 px-3 py-3 text-center">
              <p className="dl-display text-2xl font-bold text-[#B89A5A]">🔥 {data.streak.current}</p>
              <p className="mt-0.5 text-xs text-[#F2EFE6]/60">{t('Current streak', 'Série actuelle')}</p>
            </div>
            <div className="rounded-xl border border-[#F2EFE6]/15 bg-[#0B0D0D]/35 px-3 py-3 text-center">
              <p className="dl-display text-2xl font-bold text-[#F2EFE6]">{data.streak.best}</p>
              <p className="mt-0.5 text-xs text-[#F2EFE6]/60">{t('Best streak', 'Meilleure série')}</p>
            </div>
            <div className="rounded-xl border border-[#F2EFE6]/15 bg-[#0B0D0D]/35 px-3 py-3 text-center">
              <p className="dl-display text-2xl font-bold text-[#F2EFE6]">{data.streak.activeDays}</p>
              <p className="mt-0.5 text-xs text-[#F2EFE6]/60">{t('Active days', 'Jours actifs')}</p>
            </div>
          </div>

          <p className="mt-5 text-sm font-semibold text-[#F2EFE6]">{t('Last 14 days', '14 derniers jours')}</p>
          <ul
            className="m-0 mt-3 grid list-none grid-cols-[repeat(14,minmax(0,1fr))] items-end gap-1 p-0 sm:gap-2"
            aria-label={t('Cases played per day, last 14 days', 'Cas joués par jour, 14 derniers jours')}
          >
            {data.last14.map((d) => (
              <li
                key={d.idx}
                className="flex flex-col items-center gap-1"
                title={`${d.date.toLocaleDateString(undefined, { timeZone: 'UTC' })}: ${d.count}`}
              >
                <div className="flex h-24 w-full items-end">
                  <div
                    className={`w-full rounded-t ${d.count > 0 ? 'bg-[#167C80]' : 'bg-[#F2EFE6]/10'}`}
                    style={{ height: d.count > 0 ? `${Math.max(12, (d.count / maxDay) * 100)}%` : '4px' }}
                  />
                </div>
                <span className="text-[10px] text-[#F2EFE6]/45">{d.date.getUTCDate()}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* ============ MODES DE JEU ============ */}
        <Card title={t('Mode Statistics', 'Statistiques par mode')}>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { key: 'blind', label: `🔍 ${t('Open Investigation', 'Enquête Ouverte')}` },
              { key: 'known', label: `📚 ${t('Targeted / Lesson', 'Ciblée / Leçon')}` },
            ].map((m) => {
              const s = (stats.modeStats && stats.modeStats[m.key]) || {};
              return (
                <div key={m.key} className="rounded-xl border border-[#F2EFE6]/15 bg-[#0B0D0D]/35 px-4 py-4">
                  <p className="text-sm font-semibold text-[#F2EFE6]">{m.label}</p>
                  <p className="dl-display mt-1 text-2xl font-bold text-[#167C80] [text-shadow:0_0_20px_rgba(22,124,128,0.35)]">
                    {s.played || 0} {t('games', 'jeux')}
                  </p>
                  <p className="text-xs text-[#F2EFE6]/55">{s.totalXP || 0} XP</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ============ PARTIES RÉCENTES ============ */}
        {data.history.length > 0 && (
          <Card title={t('Recent Cases', 'Cas récents')}>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {data.history
                .slice(-6)
                .reverse()
                .map((game, idx) => {
                  const won = (game.score || 0) > 0;
                  return (
                    <li
                      key={idx}
                      className={`flex items-center justify-between gap-3 rounded-lg border-l-4 bg-[#0B0D0D]/35 px-4 py-3 ${
                        won ? 'border-[#2F7D5B]' : 'border-[#E63946]/70'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#F2EFE6]">{game.drugName}</p>
                        <p className="text-xs text-[#F2EFE6]/55">
                          {modeLabel(game.mode)} · {game.cluesUsed} {t('clues', 'indices')}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className={`text-base font-bold ${won ? 'text-[#7fd1a6]' : 'text-[#f0b5a6]'}`}>
                          {game.score} pts
                        </p>
                        <p className="text-[10px] font-semibold tracking-wide text-[#F2EFE6]/45">
                          {won ? t('SOLVED', 'RÉSOLU') : t('MISSED', 'RATÉ')}
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </Card>
        )}
      </main>
    </div>
  );
};

export default StatsPanel;