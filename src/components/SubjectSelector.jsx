import React from 'react';
import Logo from './Logo';
import BackButton from './BackButton';
import Breadcrumb from './Breadcrumb';

const YEAR_LABELS = {
  year1: { en: '1st Year', fr: '1ère Année' },
  year2: { en: '2nd Year', fr: '2ème Année' },
  year3: { en: '3rd Year', fr: '3ème Année' },
  year4: { en: '4th Year', fr: '4ème Année' },
  year5: { en: '5th Year', fr: '5ème Année' }
};

// Liste unique de tous les modules affichés sur une seule page (toutes années confondues)
// Seule Parasitologie est jouable pour l'instant ; les autres sont "Bientôt Disponible"
const ALL_SUBJECTS = [
  { id: 'parasitology', year: 'year4', icon: '🦠', enTitle: 'Parasitology - Mycology', frTitle: 'Parasitologie - Mycologie', available: true, enDesc: 'Parasitic and fungal infections', frDesc: 'Infections parasitaires et fongiques' },
  { id: 'microbiologie_medicale', year: 'year4', icon: '🧫', enTitle: 'Medical Microbiology', frTitle: 'Microbiologie médicale', available: false, enDesc: 'Coming soon', frDesc: 'Bientôt disponible' },
  { id: 'botanique_pharmaceutique', year: 'year2', icon: '🌿', enTitle: 'Pharmaceutical Botany', frTitle: 'Botanique pharmaceutique', available: false, enDesc: 'Coming soon', frDesc: 'Bientôt disponible' },
  { id: 'pharmacognosy', year: 'year3', icon: '🌾', enTitle: 'Pharmacognosy', frTitle: 'Pharmacognosie', available: false, enDesc: 'Coming soon', frDesc: 'Bientôt disponible' },
  { id: 'chimie_therapeutique', year: 'year3', icon: '💊', enTitle: 'Therapeutic Chemistry', frTitle: 'Chimie Thérapeutique', available: false, enDesc: 'Coming soon', frDesc: 'Bientôt disponible' },
  { id: 'pharmacology_new', year: 'year3', icon: '🧪', enTitle: 'Pharmacology', frTitle: 'Pharmacologie', available: false, enDesc: 'Coming soon', frDesc: 'Bientôt disponible' }
];

const SubjectSelector = ({ onSelectSubject, onBack, onGoHome, currentLang, userName, onStats, theme }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.leftGroup}>
          <BackButton onClick={onBack} />
          <Logo variant="horizontal" theme={theme} />
        </div>
        <div style={styles.rightGroup}>
          <button onClick={onStats} className="user-button">
            👤 {userName}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <Breadcrumb
          currentLang={currentLang}
          onHomeClick={onGoHome}
          trail={[{ label: currentLang === 'en' ? 'Modules' : 'Modules' }]}
        />

        <h2 style={styles.subtitle}>
          {currentLang === 'en' ? 'Select a Module' : 'Sélectionnez un Module'}
        </h2>
        <div style={styles.subjectsGrid}>
          {ALL_SUBJECTS.map(subject => {
            const yearLabel = YEAR_LABELS[subject.year]
              ? (currentLang === 'en' ? YEAR_LABELS[subject.year].en : YEAR_LABELS[subject.year].fr)
              : '';
            return (
              <button
                key={subject.id}
                className={!subject.available ? 'mode-card-disabled' : ''}
                style={styles.subjectCard}
                onClick={() => subject.available && onSelectSubject(subject.id)}
                disabled={!subject.available}
              >
                <div style={styles.subjectIcon}>{subject.icon}</div>
                <h3 style={styles.subjectName}>
                  {currentLang === 'en' ? subject.enTitle : subject.frTitle}
                </h3>
                <p style={styles.yearLabel}>{yearLabel}</p>
                {!subject.available && (
                  <div style={styles.comingSoon}>
                    {currentLang === 'en' ? 'Coming Soon' : 'Bientôt Disponible'}
                  </div>
                )}
                <p style={styles.subjectDesc}>
                  {currentLang === 'en' ? subject.enDesc : subject.frDesc}
                </p>
              </button>
            );
          })}
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
  leftGroup: { display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' },
  rightGroup: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  content: { maxWidth: '1000px', margin: '0 auto', textAlign: 'center' },
  subtitle: {
    fontSize: '28px', color: '#FFFFFF', margin: '0 0 40px 0',
    fontFamily: "'Ubuntu', sans-serif", fontWeight: '700'
  },
  subjectsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
  subjectCard: {
    padding: '30px 20px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-gold)', borderRadius: '10px', cursor: 'pointer',
    fontFamily: 'inherit', transition: 'all 0.3s ease', textAlign: 'center', position: 'relative'
  },
  subjectIcon: { fontSize: '56px', marginBottom: '15px' },
  subjectName: { fontSize: '18px', fontWeight: '700', color: 'var(--accent-gold)', margin: '0 0 4px 0' },
  yearLabel: { fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 10px 0', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' },
  comingSoon: {
    display: 'inline-block', background: 'var(--accent-teal)', color: 'white', padding: '4px 12px',
    borderRadius: '20px', fontSize: '10px', fontWeight: '700', marginBottom: '10px'
  },
  subjectDesc: { fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0' }
};

export default SubjectSelector;