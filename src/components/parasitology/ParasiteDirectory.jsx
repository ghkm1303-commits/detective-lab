import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../tailwind.css';
import '../../detective.css';

// --- Outil : nom de la classe d'un organisme (objet {en, fr} ou simple texte) ---
const getClassLabel = (organism, lang = 'en') => {
  const c = organism && organism.class;
  if (!c) return '';
  if (typeof c === 'string') return c;
  return c[lang] || c.en || '';
};

const CATEGORIES = [
  { id: 'protozoa', enName: 'Protozoa', frName: 'Protozoaires' },
  { id: 'helminth', enName: 'Helminths', frName: 'Helminthes' },
  { id: 'fungal', enName: 'Mycology', frName: 'Mycologie' },
  { id: 'entomology', enName: 'Entomology', frName: 'Entomologie' },
  { id: 'overview', enName: 'Overview', frName: "Vue d'ensemble" },
];

const STATUS_FILTERS = [
  { id: 'all', en: 'All', fr: 'Tous' },
  { id: 'solved', en: 'Solved', fr: 'Résolus' },
  { id: 'unsolved', en: 'Unsolved', fr: 'Non résolus' },
];

const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

// Lit l'historique de jeu enregistré dans le navigateur, organisme par organisme
const readProgress = (userId) => {
  const map = {};
  if (!userId) return map;
  try {
    const raw = JSON.parse(localStorage.getItem(`stats_${userId}`));
    ((raw && raw.gameHistory) || []).forEach((g) => {
      const key = g.drugName;
      if (!key) return;
      if (!map[key]) map[key] = { attempts: 0, solved: 0, cluesSum: 0 };
      map[key].attempts += 1;
      if ((g.score || 0) > 0) {
        map[key].solved += 1;
        map[key].cluesSum += g.cluesUsed || 0;
      }
    });
  } catch (err) {
    // pas de stats : on affiche simplement tout comme "non résolu"
  }
  return map;
};

// Maîtrise : jamais résolu = 0 étoile ; sinon selon le nombre moyen d'indices nécessaires
const starsFor = (p) => {
  if (!p || !p.solved) return 0;
  const avg = p.cluesSum / p.solved;
  if (avg <= 2) return 3;
  if (avg <= 5) return 2;
  return 1;
};

const Stars = ({ count, label }) => (
  <span className="inline-flex gap-0.5 text-base leading-none" role="img" aria-label={label}>
    {[1, 2, 3].map((n) => (
      <span key={n} className={n <= count ? 'text-[#B89A5A]' : 'text-[#F2EFE6]/25'} aria-hidden="true">
        {n <= count ? '★' : '☆'}
      </span>
    ))}
  </span>
);

// Petite valeur bilingue ou texte simple
const pick = (value, lang) => (value && typeof value === 'object' && !Array.isArray(value) ? value[lang] || value.en : value);

const truncate = (text, max) => {
  const s = String(text || '');
  return s.length > max ? `${s.slice(0, max).trimEnd()}…` : s;
};

const ParasiteDirectory = ({ organisms, onBack, currentLang, userId, initialSearch = '', initialOpenId = null }) => {
  const lang = currentLang === 'fr' ? 'fr' : 'en';
  const t = (en, fr) => (currentLang === 'en' ? en : fr);

  const [query, setQuery] = useState(initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [status, setStatus] = useState('all');
  // initialOpenId : ouvre directement la fiche complète (bouton "View Full Archive Entry" de l'écran de résultat)
  const [selectedOrganism, setSelectedOrganism] = useState(() =>
    initialOpenId ? organisms.find((o) => o.id === initialOpenId) || null : null
  );
  const closeRef = useRef(null);

  const progress = useMemo(() => readProgress(userId), [userId]);
  const hasStats = Boolean(userId);

  const enriched = useMemo(
    () =>
      organisms.map((o) => {
        const p = progress[o.names.en];
        return { organism: o, solved: Boolean(p && p.solved), stars: starsFor(p) };
      }),
    [organisms, progress]
  );

  const solvedTotal = enriched.filter((e) => e.solved).length;

  const visible = useMemo(() => {
    const q = normalize(query);
    return enriched.filter(({ organism: o, solved }) => {
      if (selectedCategory && o.category !== selectedCategory) return false;
      if (status === 'solved' && !solved) return false;
      if (status === 'unsolved' && solved) return false;
      if (!q) return true;
      return (
        normalize(o.names.en).includes(q) ||
        normalize(o.names.fr).includes(q) ||
        normalize(getClassLabel(o, 'en')).includes(q) ||
        normalize(getClassLabel(o, 'fr')).includes(q)
      );
    });
  }, [enriched, query, selectedCategory, status]);

  // Fenêtre de détail : Échap pour fermer, focus sur le bouton Fermer
  useEffect(() => {
    if (!selectedOrganism) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedOrganism(null);
    };
    document.addEventListener('keydown', onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedOrganism]);

  const sel = selectedOrganism;
  const manifestations = sel
    ? Array.isArray(sel.clinicalManifestations)
      ? sel.clinicalManifestations
      : (sel.clinicalManifestations && sel.clinicalManifestations[lang]) || []
    : [];

  const detailSections = sel
    ? [
        { icon: '🏷️', label: t('CLASS', 'CLASSE'), text: getClassLabel(sel, lang), color: 'text-[#B89A5A]' },
        { icon: '🔬', label: t('MORPHOLOGY', 'MORPHOLOGIE'), text: pick(sel.morphology, lang), color: 'text-[#5fc3c7]' },
        { icon: '🦟', label: 'TRANSMISSION', text: pick(sel.transmission, lang), color: 'text-[#7fd1a6]' },
        { icon: '🔄', label: t('LIFE CYCLE', 'CYCLE DE VIE'), text: pick(sel.lifecycle, lang), color: 'text-[#8fb0d6]' },
      ]
    : [];
  const detailSectionsAfter = sel
    ? [
        { icon: '🧪', label: t('DIAGNOSIS', 'DIAGNOSTIC'), text: pick(sel.diagnosis, lang), color: 'text-[#B89A5A]' },
        { icon: '💊', label: t('TREATMENT', 'TRAITEMENT'), text: pick(sel.treatment, lang), color: 'text-[#5fc3c7]' },
        {
          icon: '🌍',
          label: t('GEOGRAPHIC DISTRIBUTION', 'RÉPARTITION GÉOGRAPHIQUE'),
          text: pick(sel.geographicDistribution, lang),
          color: 'text-[#7fd1a6]',
        },
      ]
    : [];

  const chipCls = (on) =>
    `rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] ${
      on
        ? 'border-[#B89A5A] bg-[#B89A5A] text-[#0B0D0D]'
        : 'border-[#F2EFE6]/25 bg-transparent text-[#F2EFE6]/80 hover:border-[#B89A5A]/60'
    }`;

  return (
    <div className="dl-app relative isolate overflow-x-clip">
      <div className="dl-app-bg" aria-hidden="true" />

      <header className="sticky top-0 z-30 border-b border-[#B89A5A]/25 bg-[#1D2A3A]/95 shadow-lg shadow-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-[#F2EFE6]/25 bg-transparent px-3.5 py-2 text-sm font-medium text-[#F2EFE6] transition-colors hover:border-[#B89A5A] hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
          >
            <span aria-hidden="true">←</span> {t('Back to Game Modes', 'Retour aux modes de jeu')}
          </button>
          <span className="hidden text-sm font-semibold text-[#B89A5A] sm:block">
            🦠 {t('Parasitology - Mycology', 'Parasitologie - Mycologie')}
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        <div className="dl-fade-in">
          <p className="inline-block rounded-full border border-[#B89A5A] bg-[#B89A5A]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
            📖 {t('MODULE ARCHIVE', 'LES ARCHIVES')}
          </p>
          <h1 className="dl-display mt-4 text-[1.65rem] font-bold leading-tight text-[#F2EFE6] sm:text-4xl">
            {t('Parasitology Study Mode', 'Mode Étude - Parasitologie')}
          </h1>

          {hasStats && organisms.length > 0 && (
            <div className="mt-4 max-w-md">
              <p className="text-sm text-[#F2EFE6]/70">
                {t(
                  `${solvedTotal} of ${organisms.length} organisms solved`,
                  `${solvedTotal} organismes sur ${organisms.length} résolus`
                )}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F2EFE6]/10">
                <div
                  className="h-full rounded-full bg-[#2F7D5B] transition-all duration-700"
                  style={{ width: `${Math.round((solvedTotal / organisms.length) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ============ RECHERCHE ET FILTRES ============ */}
        <div className="mt-6 flex flex-col gap-4">
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 rounded-lg border border-[#F2EFE6]/20 bg-[#0B0D0D]/60 px-3 transition-colors focus-within:border-[#B89A5A]"
          >
            <span className="shrink-0 text-[#F2EFE6]/55" aria-hidden="true">
              🔍
            </span>
            <label htmlFor="archive-search" className="sr-only">
              {t('Search organisms', 'Rechercher un organisme')}
            </label>
            <input
              id="archive-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('Search by name or class...', 'Rechercher par nom ou classe...')}
              autoComplete="off"
              className="dl-input-bare"
            />
          </form>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label={t('Category', 'Catégorie')}>
              <button type="button" aria-pressed={!selectedCategory} onClick={() => setSelectedCategory(null)} className={chipCls(!selectedCategory)}>
                {t('All', 'Tous')} ({organisms.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = organisms.filter((o) => o.category === cat.id).length;
                if (count === 0) return null;
                const on = selectedCategory === cat.id;
                return (
                  <button key={cat.id} type="button" aria-pressed={on} onClick={() => setSelectedCategory(cat.id)} className={chipCls(on)}>
                    {t(cat.enName, cat.frName)} ({count})
                  </button>
                );
              })}
            </div>

            {hasStats && (
              <div
                role="radiogroup"
                aria-label={t('Status', 'Statut')}
                className="inline-flex self-start overflow-hidden rounded-lg border border-[#3F628C]"
              >
                {STATUS_FILTERS.map((s) => {
                  const on = status === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setStatus(s.id)}
                      className={`border-0 px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F2EFE6] ${
                        on ? 'bg-[#3F628C] text-[#F2EFE6]' : 'bg-transparent text-[#F2EFE6]/75 hover:bg-[#3F628C]/30'
                      }`}
                    >
                      {t(s.en, s.fr)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-sm text-[#F2EFE6]/55" role="status" aria-live="polite">
            {visible.length} {visible.length === 1 ? t('organism', 'organisme') : t('organisms', 'organismes')}
          </p>
        </div>

        {/* ============ CARTES ============ */}
        {visible.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-[#F2EFE6]/20 px-4 py-12 text-center text-sm text-[#F2EFE6]/60">
            {t('No organism matches your search.', 'Aucun organisme ne correspond à votre recherche.')}
          </p>
        ) : (
          <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {visible.map(({ organism, solved, stars }) => (
              <li key={organism.id}>
                <article
                  className={`dl-lift flex h-full flex-col rounded-xl border p-5 ${
                    solved
                      ? 'border-[#2F7D5B]/70 bg-gradient-to-b from-[#24364b] to-[#1D2A3A]'
                      : 'border-[#B89A5A]/40 bg-gradient-to-b from-[#24364b] to-[#1D2A3A]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="dl-display text-lg font-bold leading-snug text-[#F2EFE6]">{organism.names.en}</h2>
                    {hasStats &&
                      (solved ? (
                        <span className="shrink-0 rounded-full bg-[#2F7D5B] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#F2EFE6]">
                          ✓ {t('SOLVED', 'RÉSOLU')}
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full border border-[#F2EFE6]/25 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#F2EFE6]/55">
                          {t('NEW', 'NOUVEAU')}
                        </span>
                      ))}
                  </div>
                  <p className="mt-0.5 text-xs italic text-[#F2EFE6]/50">{organism.names.fr}</p>
                  <p className="mt-2 text-sm text-[#B89A5A]">{getClassLabel(organism, lang)}</p>

                  <div className="mt-3 flex-1 rounded-lg border-l-4 border-[#167C80] bg-[#0B0D0D]/35 px-3 py-2.5">
                    <p className="text-[10px] font-semibold tracking-[0.14em] text-[#5fc3c7]">
                      🧪 {t('KEY DIAGNOSTIC CLUE', 'INDICE DIAGNOSTIQUE CLÉ')}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#F2EFE6]/80">
                      {truncate(pick(organism.diagnosis, lang), 110) || '—'}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    {hasStats ? (
                      <div className="flex items-center gap-2">
                        <Stars
                          count={stars}
                          label={t(`Mastery: ${stars} of 3 stars`, `Maîtrise : ${stars} étoile(s) sur 3`)}
                        />
                        <span className="text-xs text-[#F2EFE6]/45">{t('mastery', 'maîtrise')}</span>
                      </div>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedOrganism(organism)}
                      className="rounded-lg border-0 bg-[#167C80] px-4 py-2.5 text-sm font-semibold text-[#F2EFE6] transition-colors hover:bg-[#1a9096] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6]"
                    >
                      {t('See More', 'Voir Plus')} →
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* ============ FICHE DÉTAILLÉE ============ */}
      {sel && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 sm:items-center sm:p-6"
          onClick={() => setSelectedOrganism(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-detail-title"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border-2 border-[#B89A5A] bg-[#1D2A3A] p-5 shadow-2xl shadow-black sm:rounded-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="archive-detail-title" className="dl-display text-2xl font-bold text-[#F2EFE6]">
                  {sel.names.en}
                </h2>
                <p className="mt-1 text-sm italic text-[#F2EFE6]/55">{sel.names.fr}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setSelectedOrganism(null)}
                aria-label={t('Close', 'Fermer')}
                className="rounded-lg border border-[#F2EFE6]/25 bg-transparent px-3 py-1.5 text-base text-[#B89A5A] hover:bg-[#B89A5A]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
              >
                ✕
              </button>
            </div>
            <div className="my-5 h-px bg-[#B89A5A]/40" />

            <div className="flex flex-col gap-5">
              {detailSections.map((s) => (
                <section key={s.label}>
                  <h3 className={`text-[11px] font-bold tracking-[0.14em] ${s.color}`}>
                    {s.icon} {s.label}:
                  </h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-[#F2EFE6]/90">{s.text || '—'}</p>
                </section>
              ))}

              <section>
                <h3 className="text-[11px] font-bold tracking-[0.14em] text-[#8fb0d6]">
                  ⚠️ {t('CLINICAL MANIFESTATIONS', 'MANIFESTATIONS CLINIQUES')}:
                </h3>
                <ul className="m-0 mt-1.5 list-disc space-y-1 pl-5 text-[0.95rem] leading-relaxed text-[#F2EFE6]/90">
                  {manifestations.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </section>

              {detailSectionsAfter.map((s) => (
                <section key={s.label}>
                  <h3 className={`text-[11px] font-bold tracking-[0.14em] ${s.color}`}>
                    {s.icon} {s.label}:
                  </h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-[#F2EFE6]/90">{s.text || '—'}</p>
                </section>
              ))}

              {typeof sel.eosinophilia === 'boolean' && (
                <section>
                  <h3 className="text-[11px] font-bold tracking-[0.14em] text-[#B89A5A]">
                    🩸 {t('EOSINOPHILIA', 'HYPERÉOSINOPHILIE')}:
                  </h3>
                  <p className="mt-1.5 text-[0.95rem] text-[#F2EFE6]/90">
                    {sel.eosinophilia ? t('Yes', 'Oui') : t('No', 'Non')}
                  </p>
                </section>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrganism(null)}
              className="mt-7 w-full rounded-lg border-0 bg-[#167C80] px-4 py-3 text-base font-semibold text-[#F2EFE6] transition-colors hover:bg-[#1a9096] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6]"
            >
              {t('Close', 'Fermer')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParasiteDirectory;