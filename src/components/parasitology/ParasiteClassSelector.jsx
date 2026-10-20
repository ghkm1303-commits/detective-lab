import React, { useMemo, useState } from 'react';
import '../../tailwind.css';
import '../../detective.css';

// --- Outil : nom de la classe d'un organisme (objet {en, fr} ou simple texte) ---
const getClassLabel = (organism, lang = 'en') => {
  const c = organism && organism.class;
  if (!c) return '';
  if (typeof c === 'string') return c;
  return c[lang] || c.en || '';
};

// --- Outil : filtres de la Recherche Ciblée (plusieurs choix d'un groupe = OU, plusieurs groupes = ET) ---
const applyParasiteFilters = (list, filters) => {
  if (!filters) return list;
  const categories = filters.categories || [];
  const classes = filters.classes || [];
  const eosinophilia = filters.eosinophilia || 'any';
  return list.filter((o) => {
    if (categories.length > 0 && !categories.includes(o.category)) return false;
    if (classes.length > 0 && !classes.includes(getClassLabel(o, 'en'))) return false;
    if (eosinophilia === 'yes' && o.eosinophilia !== true) return false;
    if (eosinophilia === 'no' && o.eosinophilia !== false) return false;
    return true;
  });
};

// Mêmes catégories exclues du jeu qu'avant
const GAME_EXCLUDED_CATEGORIES = ['entomology', 'overview'];

const TYPES = [
  { id: 'protozoa', enName: 'Protozoa', frName: 'Protozoaires', icon: '🦠' },
  { id: 'helminth', enName: 'Helminths', frName: 'Helminthes', icon: '🪱' },
  { id: 'fungal', enName: 'Mycology', frName: 'Mycologie', icon: '🍄' },
];

const EOSINO_OPTIONS = [
  { id: 'any', en: 'Any', fr: 'Indifférent' },
  { id: 'yes', en: 'With eosinophilia', fr: 'Avec hyperéosinophilie' },
  { id: 'no', en: 'Without', fr: 'Sans' },
];

const FilterCard = ({ step, title, hint, children }) => (
  <section className="rounded-2xl border border-[#B89A5A]/45 bg-gradient-to-b from-[#24364b] to-[#1D2A3A] p-5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)] sm:p-6">
    <p className="text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">FILTER {step}</p>
    <h2 className="dl-display mt-1 text-lg font-bold text-[#F2EFE6] sm:text-xl">{title}</h2>
    {hint && <p className="mt-1 text-sm text-[#F2EFE6]/60">{hint}</p>}
    <div className="mt-4">{children}</div>
  </section>
);

const ParasiteClassSelector = ({ onSelectClass, onBack, currentLang, organisms = [] }) => {
  const lang = currentLang === 'fr' ? 'fr' : 'en';
  const t = (en, fr) => (currentLang === 'en' ? en : fr);

  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const [eosinophilia, setEosinophilia] = useState('any');

  // Les mêmes organismes que le jeu (entomologie et vue d'ensemble exclus)
  const pool = useMemo(
    () => organisms.filter((o) => !GAME_EXCLUDED_CATEGORIES.includes(o.category)),
    [organisms]
  );

  // Classes proposées : celles qui existent dans les types choisis
  const classOptions = useMemo(() => {
    const base = categories.length > 0 ? pool.filter((o) => categories.includes(o.category)) : pool;
    const map = new Map();
    base.forEach((o) => {
      const key = getClassLabel(o, 'en');
      if (!key) return;
      if (!map.has(key)) map.set(key, { key, label: getClassLabel(o, lang), count: 0 });
      map.get(key).count += 1;
    });
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [pool, categories, lang]);

  // Une classe cochée qui n'existe plus après un changement de type est ignorée
  const activeClasses = classes.filter((c) => classOptions.some((o) => o.key === c));
  const filters = { categories, classes: activeClasses, eosinophilia };
  const matches = applyParasiteFilters(pool, filters).length;
  const hasFilters = categories.length > 0 || activeClasses.length > 0 || eosinophilia !== 'any';

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const reset = () => {
    setCategories([]);
    setClasses([]);
    setEosinophilia('any');
  };

  const launch = () => {
    if (matches === 0) return;
    onSelectClass(filters);
  };

  return (
    <div className="dl-app relative isolate overflow-x-clip">
      <div className="dl-app-bg" aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-[#B89A5A]/25 bg-[#1D2A3A]/95 shadow-lg shadow-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
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

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-40 pt-6 sm:px-6 sm:pt-10">
        <div className="dl-fade-in">
          <p className="inline-block rounded-full border border-[#B89A5A] bg-[#B89A5A]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
            📚 {t('TARGETED SEARCH', 'RECHERCHE CIBLÉE')}
          </p>
          <h1 className="dl-display mt-4 text-[1.65rem] font-bold leading-tight text-[#F2EFE6] sm:text-4xl">
            {t('Filter your cases', 'Filtrez vos cas')}
          </h1>
          <p className="mt-2 max-w-xl text-base text-[#F2EFE6]/70">
            {t(
              'Narrow the case pool, then launch. Leave a filter empty to include everything.',
              'Réduisez le choix de cas, puis lancez. Laissez un filtre vide pour tout inclure.'
            )}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:gap-5 lg:grid-cols-2">
          {/* ---- Filtre 1 : type d'organisme ---- */}
          <FilterCard
            step={1}
            title={t('Organism Type', "Type d'organisme")}
            hint={t('Pick one or more.', 'Choisissez-en un ou plusieurs.')}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {TYPES.map((type) => {
                const on = categories.includes(type.id);
                const count = pool.filter((o) => o.category === type.id).length;
                return (
                  <button
                    key={type.id}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggle(categories, setCategories, type.id)}
                    className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] sm:flex-col sm:items-start sm:gap-1 ${
                      on
                        ? 'border-[#B89A5A] bg-[#B89A5A]/15'
                        : 'border-[#F2EFE6]/20 bg-[#0B0D0D]/35 hover:border-[#B89A5A]/60'
                    }`}
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {type.icon}
                    </span>
                    <span className="text-sm font-semibold text-[#F2EFE6]">{t(type.enName, type.frName)}</span>
                    <span className="ml-auto text-xs text-[#F2EFE6]/55 sm:ml-0">
                      {count} {t('cases', 'cas')}
                    </span>
                  </button>
                );
              })}
            </div>
          </FilterCard>

          {/* ---- Filtre 2 : caractéristique diagnostique ---- */}
          <FilterCard
            step={2}
            title={t('Diagnostic Features', 'Caractéristiques diagnostiques')}
            hint={t('Blood eosinophilia (raised eosinophils).', 'Hyperéosinophilie sanguine.')}
          >
            <div role="radiogroup" aria-label={t('Eosinophilia', 'Hyperéosinophilie')} className="flex flex-col gap-2 sm:flex-row">
              {EOSINO_OPTIONS.map((opt) => {
                const on = eosinophilia === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setEosinophilia(opt.id)}
                    className={`flex-1 rounded-lg border-2 px-3 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] ${
                      on
                        ? 'border-[#3F628C] bg-[#3F628C] text-[#F2EFE6]'
                        : 'border-[#F2EFE6]/20 bg-[#0B0D0D]/35 text-[#F2EFE6]/80 hover:border-[#3F628C]'
                    }`}
                  >
                    {t(opt.en, opt.fr)}
                  </button>
                );
              })}
            </div>
          </FilterCard>

          {/* ---- Filtre 3 : classe ---- */}
          <div className="lg:col-span-2">
            <FilterCard
              step={3}
              title={t('Class', 'Classe')}
              hint={t('Shows the classes that exist in the selected type(s).', 'Affiche les classes présentes dans le ou les types choisis.')}
            >
              <div className="flex max-h-60 flex-wrap gap-2 overflow-y-auto pr-1">
                {classOptions.length === 0 && (
                  <p className="text-sm text-[#F2EFE6]/55">{t('No class available.', 'Aucune classe disponible.')}</p>
                )}
                {classOptions.map((c) => {
                  const on = activeClasses.includes(c.key);
                  return (
                    <button
                      key={c.key}
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      onClick={() => toggle(classes, setClasses, c.key)}
                      className={`rounded-full border px-3.5 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] ${
                        on
                          ? 'border-[#B89A5A] bg-[#B89A5A]/20 font-semibold text-[#B89A5A]'
                          : 'border-[#F2EFE6]/25 bg-transparent text-[#F2EFE6]/80 hover:border-[#B89A5A]/60'
                      }`}
                    >
                      {c.label} <span className="text-xs opacity-60">({c.count})</span>
                    </button>
                  );
                })}
              </div>
            </FilterCard>
          </div>
        </div>
      </main>

      {/* ============ BARRE FLOTTANTE ============ */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#B89A5A]/40 bg-[#1D2A3A]/95 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur">
        <div
          className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex items-center justify-between gap-4 sm:justify-start">
            <p className="text-sm text-[#F2EFE6]/75" role="status" aria-live="polite">
              <span className="dl-display text-xl font-bold text-[#B89A5A]">{matches}</span>{' '}
              {matches === 1 ? t('case matches', 'cas correspond') : t('cases match', 'cas correspondent')}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={reset}
                className="rounded border-0 bg-transparent p-0 text-sm text-[#F2EFE6]/70 underline underline-offset-4 hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
              >
                {t('Reset filters', 'Réinitialiser')}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={launch}
            disabled={matches === 0}
            className="w-full rounded-lg border-0 bg-[#167C80] px-6 py-3 text-base font-semibold text-[#F2EFE6] shadow-lg shadow-[#167C80]/25 transition-colors hover:bg-[#1a9096] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] sm:w-auto"
          >
            ▶ {t('Launch Filtered Case', 'Lancer le cas filtré')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParasiteClassSelector;