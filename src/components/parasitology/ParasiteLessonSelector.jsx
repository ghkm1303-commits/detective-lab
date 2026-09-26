import React, { useState, useMemo } from 'react';

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

const ParasiteLessonSelector = ({ organisms, onStart, onBack, currentLang, userName, onStats }) => {
  const lang = currentLang === 'fr' ? 'fr' : 'en';

  const lessons = useMemo(() => {
    const byLesson = {};
    organisms.forEach(o => {
      if (!byLesson[o.lessonId]) byLesson[o.lessonId] = [];
      byLesson[o.lessonId].push(o);
    });

    const getFallbackName = (lessonOrganisms) => {
      const counts = {};
      lessonOrganisms.forEach(o => {
        const label = o.class ? o.class[lang] : null;
        if (label) counts[label] = (counts[label] || 0) + 1;
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      return sorted.length > 0 ? sorted[0][0] : null;
    };

    return Object.keys(byLesson)
      .map(Number)
      .sort((a, b) => a - b)
      .map(id => {
        const lessonOrganisms = byLesson[id];
        const known = LESSON_NAMES[id];
        const name = known
          ? (currentLang === 'en' ? known.en : known.fr)
          : (getFallbackName(lessonOrganisms) || (currentLang === 'en' ? `Lesson ${id}` : `Leçon ${id}`));
        return { id, name, count: lessonOrganisms.length };
      });
  }, [organisms, currentLang, lang]);

  const [selected, setSelected] = useState([]);

  const allSelected = selected.length === lessons.length && lessons.length > 0;

  const toggleLesson = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(allSelected ? [] : lessons.map(l => l.id));
  };

  const totalOrganisms = lessons
    .filter(l => selected.includes(l.id))
    .reduce((sum, l) => sum + l.count, 0);

  const handleStart = () => {
    if (selected.length === 0) return;
    onStart(selected);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button className="back-button" onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <div style={styles.rightGroup}>
          <button onClick={onStats} className="user-button">
            👤 {userName}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>
          {currentLang === 'en' ? 'Select Lessons' : 'Sélectionnez les Leçons'}
        </h1>
        <p style={styles.subtitle}>
          {currentLang === 'en'
            ? 'Pick one, several, or all lessons to be tested on.'
            : 'Choisissez une, plusieurs, ou toutes les leçons sur lesquelles être testée.'}
        </p>

        <button style={styles.selectAllButton} onClick={toggleAll}>
          {allSelected
            ? (currentLang === 'en' ? 'Deselect all' : 'Tout désélectionner')
            : (currentLang === 'en' ? 'Select all' : 'Tout sélectionner')}
        </button>

        <div style={styles.lessonGrid}>
          {lessons.map(lesson => {
            const isSelected = selected.includes(lesson.id);
            return (
              <button
                key={lesson.id}
                style={{
                  ...styles.lessonCard,
                  ...(isSelected ? styles.lessonCardSelected : {})
                }}
                onClick={() => toggleLesson(lesson.id)}
              >
                <p style={styles.lessonTag}>
                  {currentLang === 'en' ? 'Lesson' : 'Leçon'} {lesson.id}
                </p>
                <h3 style={styles.lessonName}>{lesson.name}</h3>
                <p style={styles.lessonCount}>
                  {lesson.count} {currentLang === 'en' ? 'organisms' : 'organismes'}
                </p>
              </button>
            );
          })}
        </div>

        <div style={styles.footer}>
          <p style={styles.summary}>
            {selected.length > 0
              ? (currentLang === 'en'
                  ? `${selected.length} lesson(s) selected — ${totalOrganisms} organisms`
                  : `${selected.length} leçon(s) sélectionnée(s) — ${totalOrganisms} organismes`)
              : (currentLang === 'en' ? 'No lesson selected yet' : 'Aucune leçon sélectionnée')}
          </p>
          <button
            style={{
              ...styles.startButton,
              ...(selected.length === 0 ? styles.startButtonDisabled : {})
            }}
            onClick={handleStart}
            disabled={selected.length === 0}
          >
            ▶ {currentLang === 'en' ? 'Start' : 'Commencer'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', padding: '15px', position: 'relative', zIndex: 10 },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid var(--border-teal)',
    flexWrap: 'wrap', gap: '10px'
  },
  rightGroup: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  content: { maxWidth: '1000px', margin: '0 auto' },
  title: { textAlign: 'center', marginBottom: '8px', color: 'var(--accent-gold)', fontFamily: "'Playfair Display', serif" },
  subtitle: { textAlign: 'center', marginBottom: '25px', color: 'var(--text-secondary)', fontSize: '14px' },
  selectAllButton: {
    display: 'block', margin: '0 auto 20px auto', padding: '8px 18px',
    background: 'transparent', border: '2px solid var(--accent-gold)',
    color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: '12px', fontWeight: '600'
  },
  lessonGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px', marginBottom: '30px'
  },
  lessonCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid rgba(184, 154, 90, 0.3)', borderRadius: '10px',
    padding: '16px 12px', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'center'
  },
  lessonCardSelected: {
    border: '2px solid var(--accent-gold)', background: 'rgba(184, 154, 90, 0.15)'
  },
  lessonTag: { color: 'var(--text-secondary)', fontSize: '10px', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' },
  lessonName: { color: 'var(--accent-gold)', fontSize: '14px', margin: '0 0 6px 0', fontFamily: "'Playfair Display', serif", lineHeight: '1.3' },
  lessonCount: { color: 'var(--text-secondary)', fontSize: '12px', margin: '0' },
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: '15px', borderTop: '1px solid rgba(184, 154, 90, 0.2)', paddingTop: '20px'
  },
  summary: { color: 'var(--text-secondary)', fontSize: '13px', margin: '0' },
  startButton: {
    padding: '12px 30px', background: 'linear-gradient(135deg, #167C80, #2F7D5B)',
    color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: '14px', fontWeight: '700'
  },
  startButtonDisabled: { opacity: 0.4, cursor: 'not-allowed' }
};

export default ParasiteLessonSelector;