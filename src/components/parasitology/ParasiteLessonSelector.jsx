import React, { useState, useMemo } from 'react';
import '../../tailwind.css';
import '../../detective.css';

// --- Outil : nom de la classe d'un organisme (objet {en, fr} ou simple texte) ---
const getClassLabel = (organism, lang = 'en') => {
  const c = organism && organism.class;
  if (!c) return '';
  if (typeof c === 'string') return c;
  return c[lang] || c.en || '';
};

// Noms connus des leçons (confirmés par Ghada). Les leçons absentes de cette liste
// (actuellement 16 à 26, Mycologie) auront un nom déduit automatiquement des données
// en attendant un détail par leçon comme pour les autres modules.
const LESSON_NAMES = {
  2: { en: 'Amoebae', fr: 'Amibes' },
  3: { en: 'Flagellates & Ciliates', fr: 'Flagellés et Ciliés' },
  4: { en: 'Intestinal Opportunists (Coccidia)', fr: 'Opportunistes Intestinaux (Coccidies)' },
  5: { en: 'Trypanosomiases', fr: 'Trypanosomoses' },
  6: { en: 'Leishmaniases', fr: 'Leishmanioses' },
  7: { en: 'Toxoplasmosis', fr: 'Toxoplasmose' },
  8: { en: 'Adult Cestodes', fr: 'Cestodes Adultes' },
  9: { en: 'Larval Cestodes', fr: 'Cestodes Larvaires' },
  10: { en: 'Blood Trematodes', fr: 'Trématodes Sanguins' },
  11: { en: 'Liver & Lung Trematodes', fr: 'Trématodes Hépato-Pulmonaires' },
  12: { en: 'Peroral Nematodes', fr: 'Nématodes Péroraux' },
  13: { en: 'Transcutaneous Nematodes', fr: 'Nématodes Transcutanés' },
  14: { en: 'Filariae', fr: 'Filaires' },
  15: { en: 'Medical Entomology', fr: 'Entomologie Médicale' }
};

const CATEGORY_LABELS = {
  protozoa: { en: 'Protozoa', fr: 'Protozoaires', dot: 'bg-[#167C80]' },
  helminth: { en: 'Helminths', fr: 'Helminthes', dot: 'bg-[#B89A5A]' },
  fungal: { en: 'Mycology', fr: 'Mycologie', dot: 'bg-[#2F7D5B]' },
  entomology: { en: 'Entomology', fr: 'Entomologie', dot: 'bg-[#3F628C]' },
  overview: { en: 'Overview', fr: "Vue d'ensemble", dot: 'bg-[#F2EFE6]' },
};

const ParasiteLessonSelector = ({ organisms, onStart, onBack, currentLang }) => {
  const lang = currentLang === 'fr' ? 'fr' : 'en';
  const t = (en, fr) => (currentLang === 'en' ? en : fr);

  const lessons = useMemo(() => {
    const byLesson = {};
    organisms.forEach((o) => {
      if (!byLesson[o.lessonId]) byLesson[o.lessonId] = [];
      byLesson[o.lessonId].push(o);
    });

    const getFallbackName = (lessonOrganisms) => {
      const counts = {};
      lessonOrganisms.forEach((o) => {
        const label = getClassLabel(o, lang);
        if (label) counts[label] = (counts[label] || 0) + 1;
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      return sorted.length > 0 ? sorted[0][0] : null;
    };

    const dominantCategory = (lessonOrganisms) => {
      const counts = {};
      lessonOrganisms.forEach((o) => {
        counts[o.category] = (counts[o.category] || 0) + 1;
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      return sorted.length > 0 ? sorted[0][0] : null;
    };

    return Object.keys(byLesson)
      .map(Number)
      .sort((a, b) => a - b)
      .map((id) => {
        const lessonOrganisms = byLesson[id];
        const known = LESSON_NAMES[id];
        const name = known
          ? (currentLang === 'en' ? known.en : known.fr)
          : (getFallbackName(lessonOrganisms) || (currentLang === 'en' ? `Lesson ${id}` : `Leçon ${id}`));
        return { id, name, count: lessonOrganisms.length, category: dominantCategory(lessonOrganisms) };
      });
  }, [organisms, currentLang, lang]);

  const [selected, setSelected] = useState([]);

  const allSelected = selected.length === lessons.length && lessons.length > 0;

  const toggleLesson = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelected(allSelected ? [] : lessons.map((l) => l.id));
  };

  const totalOrganisms = lessons
    .filter((l) => selected.includes(l.id))
    .reduce((sum, l) => sum + l.count, 0);

  const handleStart = () => {
    if (selected.length === 0) return;
    onStart(selected);
  };

  return (
    <div className="dl-app relative isolate overflow-x-clip">
      <div className="dl-app-bg" aria-hidden="true" />

      {/* ============ EN-TÊTE ============ */}
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
            🗂️ {t('LESSON FILES', 'DOSSIERS PAR LEÇON')}
          </p>
          <h1 className="dl-display mt-4 text-[1.65rem] font-bold leading-tight text-[#F2EFE6] sm:text-4xl">
            {t('Select Lessons', 'Sélectionnez les Leçons')}
          </h1>
          <p className="mt-2 max-w-xl text-base text-[#F2EFE6]/70">
            {t(
              'Pick one, several, or all lessons to be tested on.',
              'Choisissez une, plusieurs, ou toutes les leçons sur lesquelles être testée.'
            )}
          </p>

          <button
            type="button"
            onClick={toggleAll}
            className="mt-5 rounded-lg border border-[#B89A5A] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#B89A5A] transition-colors hover:bg-[#B89A5A]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
          >
            {allSelected ? t('Deselect all', 'Tout désélectionner') : t('Select all', 'Tout sélectionner')}
          </button>
        </div>

        <ul
          className="m-0 mt-6 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
          aria-label={t('Lessons', 'Leçons')}
        >
          {lessons.map((lesson) => {
            const isSelected = selected.includes(lesson.id);
            const cat = CATEGORY_LABELS[lesson.category];
            return (
              <li key={lesson.id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggleLesson(lesson.id)}
                  className={`dl-lift flex h-full w-full cursor-pointer items-start gap-4 rounded-xl border-2 p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] ${
                    isSelected
                      ? 'border-[#B89A5A] bg-gradient-to-b from-[#3a4a45] to-[#1D2A3A]'
                      : 'border-[#B89A5A]/30 bg-gradient-to-b from-[#24364b] to-[#1D2A3A]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-sm font-bold ${
                      isSelected
                        ? 'border-[#2F7D5B] bg-[#2F7D5B] text-[#F2EFE6]'
                        : 'border-[#F2EFE6]/35 bg-transparent text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
                      {t('LESSON', 'LEÇON')} {lesson.id}
                    </span>
                    <span className="dl-display mt-1 block text-base font-bold leading-snug text-[#F2EFE6] sm:text-lg">
                      {lesson.name}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#F2EFE6]/60">
                      <span>
                        {lesson.count} {t('organisms', 'organismes')}
                      </span>
                      {cat && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${cat.dot}`} aria-hidden="true" />
                          {cat[lang]}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </main>

      {/* ============ BARRE FLOTTANTE ============ */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#B89A5A]/40 bg-[#1D2A3A]/95 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur">
        <div
          className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <p className="text-sm text-[#F2EFE6]/75" role="status" aria-live="polite">
            {selected.length > 0 ? (
              <>
                <span className="dl-display text-xl font-bold text-[#B89A5A]">{selected.length}</span>{' '}
                {selected.length === 1 ? t('Lesson Selected', 'leçon sélectionnée') : t('Lessons Selected', 'leçons sélectionnées')}
                <span className="text-[#F2EFE6]/55"> · {totalOrganisms} {t('organisms', 'organismes')}</span>
              </>
            ) : (
              t('No lesson selected yet', 'Aucune leçon sélectionnée')
            )}
          </p>
          <button
            type="button"
            onClick={handleStart}
            disabled={selected.length === 0}
            className="w-full rounded-lg border-0 bg-[#167C80] px-6 py-3 text-base font-semibold text-[#F2EFE6] shadow-lg shadow-[#167C80]/25 transition-colors hover:bg-[#1a9096] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] sm:w-auto"
          >
            ▶ {t('Start Lesson Case Deck', 'Lancer le paquet de cas')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParasiteLessonSelector;