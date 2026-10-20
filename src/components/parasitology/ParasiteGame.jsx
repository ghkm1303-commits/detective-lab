import React, { useState, useEffect, useMemo, useRef } from 'react';
import { checkGuess } from '../../utils/gameLogic';
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

const pickRandomOrganism = (list) => list[Math.floor(Math.random() * list.length)];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Numéro de dossier à 4 chiffres, stable pour un organisme donné (ne révèle pas son nom)
const caseNumberFor = (organism) => {
  if (!organism) return '0000';
  const source = String(organism.id !== undefined ? organism.id : (organism.names && organism.names.en) || '');
  let hash = 7;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) % 9000;
  }
  return String(hash + 1).padStart(4, '0');
};

const CATEGORY_LABELS = {
  protozoa: { en: 'Protozoa', fr: 'Protozoaires' },
  helminth: { en: 'Helminths', fr: 'Helminthes' },
  fungal: { en: 'Fungi', fr: 'Champignons' },
  entomology: { en: 'Medical entomology', fr: 'Entomologie médicale' },
  overview: { en: 'Overview', fr: "Vue d'ensemble" },
};

// ---------------------------------------------------------------------------
// Micro-Clue Engine : chaque indice de jeu = UNE info diagnostique courte (25 mots maximum).
// Format : "🔬 Indicateur: fait bref." — les longs textes restent réservés aux Archives.
// ---------------------------------------------------------------------------
const MAX_CLUE_WORDS = 22; // objectif 15 à 25 mots ; plafond dur à 25 (voir microFact)

const countWords = (text) => String(text || '').trim().split(/\s+/).filter(Boolean).length;

// Valeur bilingue {en, fr} ou simple texte
const pickText = (value, lang) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value[lang] || value.en || '';
  return value || '';
};

// Liste bilingue ({en: [...], fr: [...]}) ou simple tableau
const pickList = (value, lang) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return value[lang] || value.en || [];
  return value ? [value] : [];
};

// Garde la première phrase (ou deux si elle est très courte), coupe proprement aux virgules si trop long
const microFact = (text, maxWords = MAX_CLUE_WORDS) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '—';

  // phrases : on coupe sur . ! ? ; suivis d'une espace (les décimaux comme 3.5 ne sont pas coupés)
  const sentences = clean.match(/.+?[.!?;](?=\s|$)|.+$/g) || [clean];
  let out = sentences[0].trim();
  for (let i = 1; i < sentences.length && countWords(out) < 8; i += 1) {
    const next = `${out.replace(/[;]$/, '.')} ${sentences[i].trim()}`;
    if (countWords(next) > maxWords) break;
    out = next;
  }

  let ellipsis = false;
  if (countWords(out) > maxWords) {
    const head = out.split(' ').slice(0, maxWords).join(' ');
    const cut = Math.max(head.lastIndexOf(', '), head.lastIndexOf(' ('), head.lastIndexOf(' - '), head.lastIndexOf(' – '));
    if (cut > head.length * 0.45) {
      out = head.slice(0, cut);
    } else {
      out = head;
      ellipsis = true;
    }
  }

  out = out.replace(/[\s,;:.\-–]+$/, '');
  return ellipsis ? `${out}…` : `${out}.`;
};

const buildMicroClues = (organism, lang) => {
  const en = lang === 'en';
  const clinical = pickList(organism.clinicalManifestations, lang)
    .slice(0, 2)
    .filter(Boolean)
    .join('; ');
  const eosinophiliaFact = organism.eosinophilia
    ? (en ? 'Blood eosinophilia is typically present.' : "L'hyperéosinophilie sanguine est habituelle.")
    : (en ? 'Blood eosinophilia is not a typical feature.' : "L'hyperéosinophilie sanguine n'est pas un signe habituel.");

  const rows = [
    [en ? 'Clinical' : 'Clinique', microFact(clinical)],
    ['Transmission', microFact(pickText(organism.transmission, lang))],
    [en ? 'Life cycle' : 'Cycle de vie', microFact(pickText(organism.lifecycle, lang))],
    [en ? 'Class' : 'Classe', microFact(getClassLabel(organism, lang))],
    [en ? 'Diagnosis' : 'Diagnostic', microFact(pickText(organism.diagnosis, lang))],
    [en ? 'Treatment' : 'Traitement', microFact(pickText(organism.treatment, lang))],
    [en ? 'Geography' : 'Répartition', microFact(pickText(organism.geographicDistribution, lang))],
    [en ? 'Eosinophilia' : 'Hyperéosinophilie', eosinophiliaFact],
  ];
  return rows.map(([indicator, fact]) => `🔬 ${indicator}: ${fact}`);
};

const ParasiteGame = ({ organisms, selectedClass, selectedFilters, selectedLessons, retryOrganismId, gameMode, onGameEnd, onBack, currentLang }) => {
  const [hiddenOrganism, setHiddenOrganism] = useState(null);
  const [pool, setPool] = useState([]);
  const [allClues, setAllClues] = useState([]);
  const [revealedCluesCount, setRevealedCluesCount] = useState(1);
  const [guess, setGuess] = useState('');
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [choices, setChoices] = useState(null);
  const startedAtRef = useRef(Date.now());

  const lang = currentLang === 'fr' ? 'fr' : 'en';
  const t = (en, fr) => (currentLang === 'en' ? en : fr);

  useEffect(() => {
    let filteredPool;

    if (selectedLessons && selectedLessons.length > 0) {
      filteredPool = organisms.filter(o => selectedLessons.includes(o.lessonId));
    } else {
      filteredPool = organisms.filter(o => o.category !== 'entomology' && o.category !== 'overview');
      if (selectedClass) {
        filteredPool = filteredPool.filter(o => o.category === selectedClass);
      }
      // Recherche ciblée avancée : type, classe, hyperéosinophilie
      if (selectedFilters) {
        filteredPool = applyParasiteFilters(filteredPool, selectedFilters);
      }
    }

    if (filteredPool.length > 0) {
      // "Retry Case" : on rejoue exactement le même organisme ; sinon un cas au hasard
      const retryTarget = retryOrganismId ? organisms.find((o) => o.id === retryOrganismId) : null;
      const organism = retryTarget || pickRandomOrganism(filteredPool);
      startedAtRef.current = Date.now();
      setHiddenOrganism(organism);
      setPool(filteredPool);
      setChoices(null);
      setWrongGuesses(0);

      setAllClues(buildMicroClues(organism, lang));
      setRevealedCluesCount(1);
    }
  }, [organisms, selectedClass, selectedFilters, selectedLessons, retryOrganismId, gameMode, currentLang]);

  const caseNumber = useMemo(() => caseNumberFor(hiddenOrganism), [hiddenOrganism]);

  const buildChoices = () => {
    const others = pool.filter(o => o !== hiddenOrganism);
    const wrongOptions = shuffle(others).slice(0, 3).map(o =>
      currentLang === 'en' ? o.names.en : o.names.fr
    );
    const correctOption = currentLang === 'en' ? hiddenOrganism.names.en : hiddenOrganism.names.fr;
    setChoices(shuffle([correctOption, ...wrongOptions]));
  };

  const finishGame = (correct, cluesUsed) => {
    const score = correct ? Math.max(100, 1000 - (cluesUsed * 100)) : 0;
    const xpEarned = correct ? Math.max(score - 300, 0) : 0;
    onGameEnd({
      correct,
      drugName: hiddenOrganism.names.en,
      drugClass: getClassLabel(hiddenOrganism, lang),
      score,
      xpEarned,
      cluesUsed,
      // Infos pour l'écran de résultat
      organism: hiddenOrganism,
      organismId: hiddenOrganism.id,
      totalClues: allClues.length,
      timeSeconds: Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)),
      recap: microFact(pickText(hiddenOrganism.diagnosis, lang), 25),
      markers: [allClues[4], allClues[0], allClues[1]].filter(Boolean)
    });
  };

  const handleGuess = () => {
    if (!guess.trim() || !hiddenOrganism) return;

    const isCorrect = checkGuess(guess, hiddenOrganism);

    if (isCorrect) {
      finishGame(true, revealedCluesCount);
      return;
    }

    const newWrongCount = wrongGuesses + 1;
    setWrongGuesses(newWrongCount);
    setGuess('');

    if (revealedCluesCount < allClues.length) {
      setRevealedCluesCount(revealedCluesCount + 1);
    } else {
      buildChoices();
    }
  };

  // Révèle l'indice suivant sans avoir besoin de répondre (coûte autant qu'une mauvaise réponse)
  const handleNextClue = () => {
    if (revealedCluesCount < allClues.length) {
      setRevealedCluesCount(revealedCluesCount + 1);
    }
  };

  const handleChoiceClick = (choice) => {
    const isCorrect = checkGuess(choice, hiddenOrganism);
    finishGame(isCorrect, allClues.length);
  };

  const handleGiveUp = () => {
    finishGame(false, revealedCluesCount);
  };

  if (!hiddenOrganism) {
    return (
      <div className="dl-app flex items-center justify-center text-base text-[#F2EFE6]/70">
        {t('Loading game...', 'Chargement du jeu...')}
      </div>
    );
  }

  const revealedClues = allClues.slice(0, revealedCluesCount);
  const canRevealNextClue = !choices && revealedCluesCount < allClues.length;

  // Points gagnés si on trouve maintenant (même calcul que finishGame)
  const potentialScore = Math.max(100, 1000 - (choices ? allClues.length : revealedCluesCount) * 100);

  const modeLabel = gameMode === 'blind'
    ? `🔍 ${t('Open Investigation', 'Enquête Ouverte')}`
    : gameMode === 'byLesson'
      ? `🗂️ ${t('Lesson Files', 'Dossiers par Leçon')}`
      : `📚 ${t('Targeted Search', 'Recherche Ciblée')}`;

  // En recherche ciblée la catégorie est déjà connue ; sinon elle reste confidentielle (sinon c'est un indice gratuit)
  const knownCategory = selectedClass
    || (selectedFilters && selectedFilters.categories && selectedFilters.categories.length === 1
      ? selectedFilters.categories[0]
      : null);
  const categoryKnown = gameMode === 'focused' && knownCategory;
  const categoryText = categoryKnown
    ? (CATEGORY_LABELS[knownCategory] ? CATEGORY_LABELS[knownCategory][lang] : knownCategory)
    : null;

  return (
    <div className="dl-app relative isolate overflow-x-clip">
      <div className="dl-app-bg" aria-hidden="true" />

      {/* ============ EN-TÊTE ============ */}
      <header className="sticky top-0 z-40 border-b border-[#B89A5A]/25 bg-[#1D2A3A]/95 shadow-lg shadow-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-[#F2EFE6]/25 bg-transparent px-3.5 py-2 text-sm font-medium text-[#F2EFE6] transition-colors hover:border-[#B89A5A] hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
          >
            <span aria-hidden="true">←</span> {t('Back', 'Retour')}
          </button>
          <h2 className="dl-display hidden text-lg font-bold text-[#B89A5A] sm:block sm:text-xl">
            🦠 Parasitology Lab
          </h2>
          <span className="rounded-full border border-[#2F7D5B] bg-[#2F7D5B]/15 px-3 py-1.5 text-xs font-semibold text-[#7fd1a6]">
            {modeLabel}
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl gap-5 px-4 pb-14 pt-5 sm:px-6 sm:pt-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-8">
        {/* ============ PANNEAU DE RÉPONSE ============ */}
        <section
          aria-label={t('Your answer', 'Votre réponse')}
          className="order-1 self-start rounded-2xl border border-[#B89A5A]/60 bg-[#1D2A3A] p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] sm:p-6 lg:sticky lg:top-24 lg:order-2"
        >
          {choices ? (
            <>
              <h3 className="dl-display text-xl font-bold text-[#B89A5A]">
                {t('Choose the correct organism:', 'Choisissez le bon organisme:')}
              </h3>
              <p className="mt-1 text-sm text-[#F2EFE6]/65">
                {t('All clues are on the table. Pick one.', 'Tous les indices sont révélés. Faites votre choix.')}
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {choices.map((choice, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChoiceClick(choice)}
                    className="rounded-lg border-2 border-[#F2EFE6]/25 bg-[#0B0D0D]/40 px-4 py-3.5 text-left text-base font-semibold text-[#F2EFE6] transition-colors hover:border-[#B89A5A] hover:bg-[#B89A5A]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="dl-display text-xl font-bold text-[#B89A5A]">
                {t('What organism is it?', 'Quel organisme est-ce?')}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGuess();
                }}
                className="mt-4 flex flex-col gap-3"
              >
                <label htmlFor="game-guess" className="sr-only">
                  {t('Organism name', "Nom de l'organisme")}
                </label>
                <input
                  id="game-guess"
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder={t('Enter organism name...', "Entrez le nom de l'organisme...")}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  className="dl-input"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg border-0 bg-[#2F7D5B] px-4 py-3.5 text-base font-semibold text-[#F2EFE6] shadow-lg shadow-[#2F7D5B]/25 transition-colors hover:bg-[#379168] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D2A3A]"
                >
                  ✓ {t('Submit Guess', 'Soumettre')}
                </button>
              </form>

              {canRevealNextClue && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleNextClue}
                    className="w-full rounded-lg border-0 bg-[#3F628C] px-4 py-3.5 text-base font-semibold text-[#F2EFE6] transition-colors hover:bg-[#4a73a3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D2A3A]"
                  >
                    💡 {t('Request Next Clue', 'Indice suivant')}
                  </button>
                  <p className="mt-1.5 text-center text-xs text-[#F2EFE6]/55">
                    {t('Reveals a new clue without answering (-100 points).', 'Révèle un nouvel indice sans répondre (-100 points).')}
                  </p>
                </div>
              )}
            </>
          )}

          {wrongGuesses > 0 && (
            <p
              key={wrongGuesses}
              role="alert"
              className="dl-shake mt-4 rounded-lg border border-[#e8a08f]/40 bg-[#e8a08f]/10 px-3 py-2 text-sm text-[#f0b5a6]"
            >
              {t(`Wrong! (${wrongGuesses} incorrect)`, `Mauvaise réponse! (${wrongGuesses})`)}
            </p>
          )}

          <button
            type="button"
            onClick={handleGiveUp}
            className="mt-5 w-full rounded-lg border border-[#E63946]/60 bg-transparent px-4 py-3 text-sm font-semibold text-[#ff8f9a] transition-colors hover:bg-[#E63946]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8f9a]"
          >
            🚪 {t('Give Up', 'Abandonner')}
          </button>
        </section>

        {/* ============ DOSSIER DU CAS ============ */}
        <section aria-label={t('Case file', 'Dossier du cas')} className="order-2 lg:order-1">
          <div className="ml-5 inline-flex items-center gap-2 rounded-t-lg border border-b-0 border-[#B89A5A]/60 bg-[#1D2A3A] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-[#B89A5A]">
            <span aria-hidden="true">★</span> CASE FILE #{caseNumber}
          </div>

          <div className="rounded-xl rounded-tl-none border border-[#B89A5A]/60 bg-[#1D2A3A] p-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85),0_0_60px_-20px_rgba(22,124,128,0.4)] sm:p-4">
            <div className="rounded-lg bg-[#F2EFE6] p-4 text-[#1D2A3A] sm:p-6">
              {/* Infos du dossier */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#B89A5A]/50 pb-4">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-[#7a6330]">
                    {t('CATEGORY', 'CATÉGORIE')}
                  </p>
                  {categoryText ? (
                    <p className="dl-display text-lg font-bold text-[#1D2A3A]">{categoryText}</p>
                  ) : (
                    <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#1D2A3A]/70">
                      <span className="inline-block h-4 w-20 rounded-sm bg-[#1D2A3A]" aria-hidden="true" />
                      {t('classified', 'confidentiel')}
                    </p>
                  )}
                </div>
                <span className="rounded-full border border-[#B89A5A] bg-[#B89A5A]/15 px-3 py-1.5 text-sm font-semibold text-[#7a6330]">
                  {potentialScore} {t('pts if solved now', 'pts si résolu maintenant')}
                </span>
              </div>

              {/* Progression */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#1D2A3A]">
                  {t('Available Clues', 'Indices Disponibles')} ({revealedCluesCount}/{allClues.length})
                </p>
                <div className="flex gap-1.5" aria-hidden="true">
                  {allClues.map((_, i) => (
                    <span
                      key={i}
                      className={`h-2 w-2 rounded-full ${i < revealedCluesCount ? 'bg-[#167C80]' : 'bg-[#1D2A3A]/20'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Indices : les plus récents en haut sur téléphone, ordre normal sur grand écran */}
              <ol className="mt-4 flex list-none flex-col-reverse gap-3 p-0 lg:flex-col">
                {revealedClues.map((clue, idx) => {
                  const sep = clue.indexOf(': ');
                  const label = sep > -1 ? clue.slice(0, sep) : '';
                  const body = sep > -1 ? clue.slice(sep + 2) : clue;
                  const newest = idx === revealedCluesCount - 1;
                  return (
                    <li
                      key={idx}
                      className={`dl-clue-in rounded-md border-l-4 bg-white/70 px-4 py-3 ${
                        newest ? 'border-[#B89A5A] shadow-md shadow-[#B89A5A]/20' : 'border-[#167C80]'
                      }`}
                    >
                      <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#167C80]">
                        <span className="text-[#7a6330]">#{idx + 1}</span>
                        {label && <span>{label.toUpperCase()}</span>}
                        {newest && idx > 0 && (
                          <span className="rounded-full bg-[#B89A5A]/25 px-2 py-0.5 text-[10px] text-[#7a6330]">
                            {t('NEW', 'NOUVEAU')}
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-[0.95rem] leading-relaxed text-[#1D2A3A]">{body}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ParasiteGame;