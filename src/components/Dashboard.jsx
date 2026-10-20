import React, { useEffect, useMemo, useRef, useState } from 'react';
import Logo from './Logo';
import { isAdmin } from '../utils/admin';
import { getReference } from '../utils/subscription';
import '../tailwind.css';
import '../detective.css';

/* ------------------------------------------------------------------ */
/*  Detective Labs — Dashboard & Game Hub                              */
/*  Étape 1 : choix du module  →  Étape 2 : choix du mode de jeu       */
/*  (l'étape 3 = l'écran de jeu, voir parasitology/ParasiteGame.jsx)   */
/* ------------------------------------------------------------------ */

const YEAR_LABELS = {
  2: { en: '2nd Year', fr: '2ème Année' },
  3: { en: '3rd Year', fr: '3ème Année' },
  4: { en: '4th Year', fr: '4ème Année' },
};

// Seule Parasitologie est jouable pour l'instant ; les autres sont "Bientôt Disponible"
const MODULES = [
  { id: 'parasitology', year: 4, icon: '🦠', available: true,
    en: 'Parasitology', fr: 'Parasitologie',
    enFull: 'Parasitology - Mycology', frFull: 'Parasitologie - Mycologie',
    enDesc: 'Parasitic and fungal infections', frDesc: 'Infections parasitaires et fongiques' },
  { id: 'microbiologie_medicale', year: 4, icon: '🧫', available: false,
    en: 'Microbiology', fr: 'Microbiologie',
    enFull: 'Medical Microbiology', frFull: 'Microbiologie médicale',
    enDesc: 'Coming soon', frDesc: 'Bientôt disponible' },
  { id: 'pharmacology_new', year: 3, icon: '🧪', available: false,
    en: 'Pharmacology', fr: 'Pharmacologie',
    enFull: 'Pharmacology', frFull: 'Pharmacologie',
    enDesc: 'Coming soon', frDesc: 'Bientôt disponible' },
  { id: 'chimie_therapeutique', year: 3, icon: '💊', available: false,
    en: 'Therapeutic Chem', fr: 'Chimie Thérapeutique',
    enFull: 'Therapeutic Chemistry', frFull: 'Chimie Thérapeutique',
    enDesc: 'Coming soon', frDesc: 'Bientôt disponible' },
  { id: 'pharmacognosy', year: 3, icon: '🌾', available: false,
    en: 'Pharmacognosy', fr: 'Pharmacognosie',
    enFull: 'Pharmacognosy', frFull: 'Pharmacognosie',
    enDesc: 'Coming soon', frDesc: 'Bientôt disponible' },
  { id: 'botanique_pharmaceutique', year: 2, icon: '🌿', available: false,
    en: 'Botany', fr: 'Botanique',
    enFull: 'Pharmaceutical Botany', frFull: 'Botanique pharmaceutique',
    enDesc: 'Coming soon', frDesc: 'Bientôt disponible' },
];

// Les 4 modes de jeu (les ids correspondent à ceux utilisés par App.jsx)
const MODES = [
  { id: 'blind', icon: '🔍',
    en: 'Open Investigation', fr: 'Enquête Ouverte',
    enDesc: 'Random cases from this module. Guess the organism from any category.',
    frDesc: "Des cas aléatoires de ce module. Devinez l'organisme, toutes catégories confondues.",
    enCta: 'Launch Game', frCta: 'Lancer le jeu' },
  { id: 'byLesson', icon: '🗂️',
    en: 'Lesson Files', fr: 'Dossiers par Leçon',
    enDesc: 'Pick specific lectures from your syllabus and test yourself on them.',
    frDesc: 'Choisissez des leçons précises de votre programme et testez-vous.',
    enCta: 'Launch Game', frCta: 'Lancer le jeu' },
  { id: 'focused', icon: '📚',
    en: 'Targeted Search', fr: 'Recherche Ciblée',
    enDesc: 'Filter by category first, then solve cases from that group only.',
    frDesc: "Filtrez d'abord par catégorie, puis résolvez les cas de ce groupe.",
    enCta: 'Launch Game', frCta: 'Lancer le jeu' },
  { id: 'studyMode', icon: '📖',
    en: 'Module Archive', fr: 'Les Archives',
    enDesc: 'Browse and study the full organism database, no clues, no score.',
    frDesc: "Parcourez et étudiez toute la base d'organismes, sans indices ni score.",
    enCta: 'Browse Archive', frCta: 'Ouvrir les archives' },
];

/* ---------- Données locales : statistiques et série de jours ---------- */

// Langues du menu (l'arabe demande des traductions et l'affichage de droite à gauche : bientôt)
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية (Arabic)', soon: true },
];

const pad = (n) => String(n).padStart(2, '0');
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Lit les stats déjà enregistrées par le jeu dans le navigateur (clé stats_<uid>)
const readStats = (uid) => {
  const empty = { games: 0, xp: 0, streak: 0 };
  try {
    const raw = JSON.parse(localStorage.getItem(`stats_${uid}`));
    if (!raw) return empty;
    const days = new Set(
      (raw.gameHistory || [])
        .map((g) => {
          const d = new Date(g.timestamp);
          return Number.isNaN(d.getTime()) ? null : dayKey(d);
        })
        .filter(Boolean)
    );
    // Série = jours consécutifs avec au moins une partie, jusqu'à aujourd'hui
    // (si on n'a pas encore joué aujourd'hui, la série d'hier reste valable)
    const cursor = new Date();
    if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (days.has(dayKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return { games: raw.totalGamesPlayed || 0, xp: raw.totalXP || 0, streak };
  } catch (err) {
    return empty;
  }
};

const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

/* ---------- Petites icônes ---------- */

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.12em] ${className}`}>
    {children}
  </span>
);

/* ---------- Page ---------- */

const Dashboard = ({
  user,
  userName,
  organisms = [],
  isPro = false,
  selectedSubject,
  onSelectModule,
  onSwitchModule,
  onSelectMode,
  onStats,
  onGoAdmin,
  onLogout,
  onLanguageChange,
  theme,
  currentLang,
}) => {
  const t = (en, fr) => (currentLang === 'fr' ? fr : en);
  const lang = currentLang === 'fr' ? 'fr' : 'en';

  const stats = useMemo(() => readStats(user.uid), [user.uid]);

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  // Ferme la recherche / le menu quand on clique ailleurs ou qu'on appuie sur Échap
  useEffect(() => {
    const onDown = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const results = useMemo(() => {
    const q = normalize(query);
    if (q.length < 2) return [];
    return organisms
      .filter((o) => normalize(o.names && o.names.en).includes(q) || normalize(o.names && o.names.fr).includes(q))
      .slice(0, 6);
  }, [query, organisms]);

  const openArchive = (term) => {
    setQuery('');
    setSearchOpen(false);
    onSelectModule('parasitology');
    onSelectMode('studyMode', term);
  };

  const activeModule = MODULES.find((m) => m.id === selectedSubject && m.available) || null;
  const step = activeModule ? 2 : 1;

  const firstName = String(userName || '').trim().split(/\s+/)[0] || t('Detective', 'Détective');
  const initial = String(userName || user.email || 'A').trim().charAt(0).toUpperCase();
  const showPhoto = user.photoURL && !photoFailed;

  return (
    <div className="dl-app relative isolate overflow-x-clip">
      <div className="dl-app-bg" aria-hidden="true" />

      {/* ============ NAVBAR ============ */}
      <header className="sticky top-0 z-40 border-b border-[#B89A5A]/25 bg-[#1D2A3A]/95 shadow-lg shadow-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
          <div className="flex items-center">
            <Logo variant="horizontal" theme={theme} />
          </div>

          {/* Recherche : sous le logo sur téléphone, au centre sur grand écran */}
          <div ref={searchRef} className="relative order-3 w-full md:order-none md:w-auto md:max-w-md md:flex-1">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim().length >= 2) openArchive(query.trim());
              }}
              className="flex items-center gap-2 rounded-lg border border-[#F2EFE6]/20 bg-[#0B0D0D]/60 px-3 transition-colors focus-within:border-[#B89A5A]"
            >
              <span className="shrink-0 text-[#F2EFE6]/55">
                <SearchIcon />
              </span>
              <label htmlFor="hub-search" className="sr-only">
                {t('Search organisms', 'Rechercher un organisme')}
              </label>
              <input
                id="hub-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder={t('Search organisms...', 'Rechercher un organisme...')}
                autoComplete="off"
                className="dl-input-bare"
              />
            </form>

            {searchOpen && query.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-[#B89A5A]/50 bg-[#1D2A3A] shadow-2xl shadow-black/70">
                {results.length > 0 ? (
                  <ul className="m-0 list-none p-0">
                    {results.map((o, i) => (
                      <li key={o.id || i}>
                        <button
                          type="button"
                          onClick={() => openArchive(o.names[lang] || o.names.en)}
                          className="flex w-full items-center justify-between gap-3 border-0 bg-transparent px-4 py-3 text-left text-sm text-[#F2EFE6] hover:bg-[#B89A5A]/15 focus:bg-[#B89A5A]/15 focus:outline-none"
                        >
                          <span className="font-medium">{o.names[lang] || o.names.en}</span>
                          <span className="shrink-0 text-xs text-[#F2EFE6]/55">{o.class && o.class[lang]}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-3 text-sm text-[#F2EFE6]/65">
                    {t('No organism found.', 'Aucun organisme trouvé.')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Série, badge PRO, avatar */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-[#B89A5A]/60 bg-[#B89A5A]/10 px-3 py-1.5 text-sm font-semibold text-[#B89A5A]"
              title={t('Study streak', "Série d'étude")}
            >
              <span aria-hidden="true">🔥</span>
              {stats.streak} {stats.streak === 1 ? t('Day', 'Jour') : t('Days', 'Jours')}
            </span>

            {isPro && (
              <Badge className="border border-[#2F7D5B] bg-[#2F7D5B]/20 text-[#7fd1a6]">
                <span className="sm:hidden">PRO</span>
                <span className="hidden sm:inline">PRO AGENT</span>
              </Badge>
            )}

            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label={t('Account menu', 'Menu du compte')}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#B89A5A] bg-[#0B0D0D] p-0 text-base font-bold text-[#B89A5A] transition-colors hover:bg-[#B89A5A]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6]"
              >
                {showPhoto ? (
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
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 max-h-[80vh] w-64 overflow-y-auto rounded-lg border border-[#B89A5A]/50 bg-[#1D2A3A] shadow-2xl shadow-black/70"
                >
                  <div className="border-b border-[#B89A5A]/25 px-4 py-3">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
                      AGENT ID #{getReference(user.uid)}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-[#F2EFE6]">{userName}</p>
                    {user.email && <p className="truncate text-xs text-[#F2EFE6]/55">{user.email}</p>}
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onStats();
                    }}
                    className="flex w-full items-center gap-2 border-0 bg-transparent px-4 py-3 text-left text-sm text-[#F2EFE6] hover:bg-[#B89A5A]/15 focus:bg-[#B89A5A]/15 focus:outline-none"
                  >
                    📊 {t('My Stats & Progress', 'Mes stats et progression')}
                  </button>

                  <div role="group" aria-label={t('Language', 'Langue')} className="border-t border-[#B89A5A]/25 px-4 py-3">
                    <p className="text-xs font-semibold text-[#F2EFE6]/70">🌐 {t('Language Switcher', 'Changer de langue')}</p>
                    <div className="mt-2 flex flex-col gap-1">
                      {LANGUAGES.map((l) => {
                        const selected = lang === l.code;
                        return (
                          <button
                            key={l.code}
                            type="button"
                            role="menuitemradio"
                            aria-checked={selected}
                            disabled={l.soon}
                            onClick={() => {
                              setMenuOpen(false);
                              if (onLanguageChange) onLanguageChange(l.code);
                            }}
                            className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A] ${
                              selected
                                ? 'border-[#B89A5A] bg-[#B89A5A]/15 font-semibold text-[#B89A5A]'
                                : 'border-[#F2EFE6]/15 bg-transparent text-[#F2EFE6] hover:border-[#B89A5A]/60 disabled:cursor-not-allowed disabled:text-[#F2EFE6]/40 disabled:hover:border-[#F2EFE6]/15'
                            }`}
                          >
                            <span>{l.label}</span>
                            {selected && <span aria-hidden="true">✓</span>}
                            {l.soon && (
                              <span className="text-[10px] font-semibold tracking-wide text-[#F2EFE6]/45">
                                {t('SOON', 'BIENTÔT')}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {isAdmin(user) && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onGoAdmin();
                      }}
                      className="flex w-full items-center gap-2 border-0 bg-transparent px-4 py-3 text-left text-sm text-[#B89A5A] hover:bg-[#B89A5A]/15 focus:bg-[#B89A5A]/15 focus:outline-none"
                    >
                      🛠️ Admin
                    </button>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-2 border-0 border-t border-[#B89A5A]/25 bg-transparent px-4 py-3 text-left text-sm text-[#ff8f9a] hover:bg-[#E63946]/15 focus:bg-[#E63946]/15 focus:outline-none"
                  >
                    🚪 {t('Log out', 'Déconnexion')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        {/* ============ ÉTAPE 1 : CHOIX DU MODULE ============ */}
        {step === 1 && (
          <section key="step-1" className="dl-fade-in" aria-labelledby="hub-welcome">
            <div className="flex flex-col gap-5 rounded-2xl border border-[#B89A5A]/50 bg-gradient-to-br from-[#24364b] to-[#1D2A3A] p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_70px_-30px_rgba(22,124,128,0.5)] sm:p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge className="border border-[#B89A5A] bg-[#B89A5A]/10 text-[#B89A5A]">
                  ★ {t('AGENT BRIEFING', "BRIEFING DE L'AGENT")}
                </Badge>
                <h1 id="hub-welcome" className="dl-display mt-4 text-[1.65rem] font-bold leading-tight text-[#F2EFE6] sm:text-4xl">
                  {t(`Welcome back, Agent ${firstName}!`, `Bon retour, Agent ${firstName} !`)}
                </h1>
                <p className="mt-2 text-base text-[#F2EFE6]/75">
                  {t('Select a module to start.', 'Sélectionnez un module pour commencer.')}
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-3 md:w-72">
                <div className="rounded-xl border border-[#F2EFE6]/15 bg-[#0B0D0D]/40 px-4 py-3">
                  <dt className="text-xs text-[#F2EFE6]/60">{t('Cases played', 'Parties jouées')}</dt>
                  <dd className="dl-display m-0 mt-1 text-2xl font-bold text-[#B89A5A]">{stats.games}</dd>
                </div>
                <div className="rounded-xl border border-[#F2EFE6]/15 bg-[#0B0D0D]/40 px-4 py-3">
                  <dt className="text-xs text-[#F2EFE6]/60">XP</dt>
                  <dd className="dl-display m-0 mt-1 text-2xl font-bold text-[#B89A5A]">{stats.xp}</dd>
                </div>
              </dl>
            </div>

            <h2 className="dl-display mt-10 text-xl font-bold text-[#F2EFE6] sm:text-2xl">
              {t('Modules', 'Modules')}
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {MODULES.map((m, i) => (
                <article
                  key={m.id}
                  className={`dl-lift flex flex-col rounded-xl border p-5 ${
                    m.available
                      ? 'border-[#B89A5A]/60 bg-gradient-to-b from-[#24364b] to-[#1D2A3A]'
                      : 'border-[#F2EFE6]/15 bg-[#1D2A3A]/55'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`text-4xl ${m.available ? '' : 'opacity-55'}`} aria-hidden="true">
                      {m.icon}
                    </span>
                    {m.available ? (
                      <Badge className="bg-[#2F7D5B] text-[#F2EFE6]">{t('ACTIVE', 'ACTIF')}</Badge>
                    ) : (
                      <Badge className="border border-[#F2EFE6]/25 text-[#F2EFE6]/65">
                        {t('COMING SOON', 'BIENTÔT')}
                      </Badge>
                    )}
                  </div>

                  <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
                    MODULE {pad(i + 1)} · {t(YEAR_LABELS[m.year].en, YEAR_LABELS[m.year].fr).toUpperCase()}
                  </p>
                  <h3 className={`dl-display mt-1 text-xl font-bold ${m.available ? 'text-[#F2EFE6]' : 'text-[#F2EFE6]/75'}`}>
                    {t(m.enFull, m.frFull)}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[#F2EFE6]/65">
                    {m.id === 'parasitology' && organisms.length > 0
                      ? t(`${organisms.length} organisms to investigate`, `${organisms.length} organismes à investiguer`)
                      : t(m.enDesc, m.frDesc)}
                  </p>

                  {m.available ? (
                    <button
                      type="button"
                      onClick={() => onSelectModule(m.id)}
                      className="mt-5 w-full rounded-lg border-0 bg-[#167C80] px-4 py-3 text-sm font-semibold text-[#F2EFE6] shadow-lg shadow-[#167C80]/25 transition-colors hover:bg-[#1a9096] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D2A3A]"
                    >
                      {t('Select Module', 'Choisir ce module')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-5 w-full cursor-not-allowed rounded-lg border border-[#F2EFE6]/15 bg-transparent px-4 py-3 text-sm font-semibold text-[#F2EFE6]/40"
                    >
                      {t('Coming Soon', 'Bientôt disponible')}
                    </button>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ============ ÉTAPE 2 : CHOIX DU MODE DE JEU ============ */}
        {step === 2 && activeModule && (
          <section key="step-2" className="dl-fade-in" aria-labelledby="hub-module-title">
            <button
              type="button"
              onClick={onSwitchModule}
              className="inline-flex items-center gap-2 rounded-lg border-0 bg-[#3F628C] px-4 py-2.5 text-sm font-semibold text-[#F2EFE6] transition-colors hover:bg-[#4a73a3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0D]"
            >
              <span aria-hidden="true">←</span> {t('Switch Module', 'Changer de module')}
            </button>

            <div className="mt-6 rounded-2xl border border-[#B89A5A]/50 bg-gradient-to-br from-[#24364b] to-[#1D2A3A] p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_70px_-30px_rgba(22,124,128,0.5)] sm:p-8">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
                {t('ACTIVE MODULE', 'MODULE ACTIF')}
              </p>
              <h1 id="hub-module-title" className="dl-display mt-2 text-[1.65rem] font-bold leading-tight text-[#F2EFE6] sm:text-4xl">
                <span aria-hidden="true">{activeModule.icon}</span> {t(activeModule.en, activeModule.fr)}
              </h1>
              <p className="mt-2 text-base text-[#F2EFE6]/75">
                {t('Choose how you want to investigate.', 'Choisissez votre façon de mener l’enquête.')}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onSelectMode(mode.id)}
                  className="dl-lift group flex h-full cursor-pointer flex-col rounded-xl border border-[#B89A5A]/45 bg-gradient-to-b from-[#24364b] to-[#1D2A3A] p-5 text-left text-[#F2EFE6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6]"
                >
                  <span className="text-4xl" aria-hidden="true">
                    {mode.icon}
                  </span>
                  <span className="dl-display mt-4 block text-lg font-bold text-[#F2EFE6]">
                    {t(mode.en, mode.fr)}
                  </span>
                  <span className="mt-2 block flex-1 text-sm leading-relaxed text-[#F2EFE6]/70">
                    {t(mode.enDesc, mode.frDesc)}
                  </span>
                  <span className="mt-5 block w-full rounded-lg bg-[#167C80] px-4 py-3 text-center text-sm font-semibold text-[#F2EFE6] shadow-lg shadow-[#167C80]/25 transition-colors group-hover:bg-[#1a9096]">
                    {t(mode.enCta, mode.frCta)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;