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

const SUBJECT_LABELS = {
  pharmacology_new: { en: 'Pharmacology', fr: 'Pharmacologie' },
  parasitology: { en: 'Parasitology - Mycology', fr: 'Parasitologie - Mycologie' },
  chimie_therapeutique: { en: 'Therapeutic Chemistry', fr: 'Chimie Thérapeutique' }
};

// Mot-clé de l'entité à deviner, selon la matière
const ENTITY_LABELS = {
  pharmacology_new: { en: 'drug', fr: 'médicament', enPlural: 'drugs', frPlural: 'médicaments' },
  parasitology: { en: 'organism', fr: 'organisme', enPlural: 'organisms', frPlural: 'organismes' },
  chimie_therapeutique: { en: 'compound', fr: 'composé', enPlural: 'compounds', frPlural: 'composés' }
};

// Matières qui ont un ClassSelector + Directory dédiés (donc Focused/Étude disponibles)
const SUBJECTS_WITH_FOCUSED_AND_STUDY = ['pharmacology_new', 'parasitology'];

const ModeSelector = ({ onSelectMode, onBack, onGoHome, onGoYear, currentLang, userName, onStats, theme, selectedYear, selectedSubject }) => {
  const entity = ENTITY_LABELS[selectedSubject] || ENTITY_LABELS.pharmacology_new;
  const entityWord = currentLang === 'en' ? entity.en : entity.fr;
  const entityPlural = currentLang === 'en' ? entity.enPlural : entity.frPlural;
  const hasFocusedAndStudy = SUBJECTS_WITH_FOCUSED_AND_STUDY.includes(selectedSubject);

  const modes = [
    {
      id: 'blind',
      icon: '🔍',
      enName: 'Open Investigation',
      frName: 'Enquête Ouverte',
      enDesc: `Guess the ${entityWord} from any category`,
      frDesc: `Devinez le ${entityWord} de n'importe quelle catégorie`,
      available: true
    },
    {
      id: 'focused',
      icon: '📚',
      enName: 'Targeted Search',
      frName: 'Recherche Ciblée',
      enDesc: hasFocusedAndStudy ? 'Choose a category first, then guess' : 'Coming soon for this subject',
      frDesc: hasFocusedAndStudy ? 'Choisissez une catégorie d\'abord, puis devinez' : 'Bientôt disponible pour cette matière',
      available: hasFocusedAndStudy
    },
    {
      id: 'studyMode',
      icon: '📖',
      enName: 'The Archive',
      frName: 'Les Archives',
      enDesc: hasFocusedAndStudy ? `Browse and study all ${entityPlural}` : 'Coming soon for this subject',
      frDesc: hasFocusedAndStudy ? `Parcourir et étudier tous les ${entityPlural}` : 'Bientôt disponible pour cette matière',
      available: hasFocusedAndStudy
    },
    {
      id: 'practiceMode',
      icon: '🎯',
      enName: 'Practice Mode',
      frName: 'Mode Pratique',
      enDesc: `Learn ${entityPlural} at your own pace`,
      frDesc: `Apprenez les ${entityPlural} à votre rythme`,
      available: false
    }
  ];

  const yearLabel = YEAR_LABELS[selectedYear]
    ? (currentLang === 'en' ? YEAR_LABELS[selectedYear].en : YEAR_LABELS[selectedYear].fr)
    : '';
  const subjectLabel = SUBJECT_LABELS[selectedSubject]
    ? (currentLang === 'en' ? SUBJECT_LABELS[selectedSubject].en : SUBJECT_LABELS[selectedSubject].fr)
    : '';

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
          trail={[
            { label: yearLabel, onClick: onGoYear },
            { label: subjectLabel }
          ]}
        />

        <h1 style={styles.title}>
          {currentLang === 'en' ? 'Select Game Mode' : 'Sélectionner le Mode de Jeu'}
        </h1>

        <div style={styles.modeGrid}>
          {modes.map(mode => (
            <button
              key={mode.id}
              className={!mode.available ? 'mode-card-disabled' : ''}
              style={styles.modeCard}
              onClick={() => mode.available && onSelectMode(mode.id)}
              disabled={!mode.available}
            >
              <div style={styles.modeIcon}>{mode.icon}</div>
              <h3 style={styles.modeName}>
                {currentLang === 'en' ? mode.enName : mode.frName}
              </h3>
              {!mode.available && (
                <div style={styles.comingSoon}>
                  {currentLang === 'en' ? 'Coming Soon' : 'Bientôt Disponible'}
                </div>
              )}
              <p style={styles.modeDesc}>
                {currentLang === 'en' ? mode.enDesc : mode.frDesc}
              </p>
            </button>
          ))}
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
  content: { maxWidth: '1000px', margin: '0 auto' },
  title: {
    textAlign: 'center', marginBottom: '40px', color: '#FFFFFF',
    fontFamily: "'Ubuntu', sans-serif", fontWeight: '700'
  },
  modeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' },
  modeCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid var(--border-gold)', borderRadius: '10px', padding: '25px',
    cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center', position: 'relative'
  },
  modeIcon: { fontSize: '40px', marginBottom: '15px' },
  modeName: { color: 'var(--accent-gold)', fontSize: '18px', margin: '0 0 10px 0', fontFamily: "'Playfair Display', serif" },
  comingSoon: {
    display: 'inline-block', background: 'var(--accent-teal)', color: 'white', padding: '4px 12px',
    borderRadius: '20px', fontSize: '10px', fontWeight: '700', marginBottom: '10px'
  },
  modeDesc: { color: 'var(--text-secondary)', fontSize: '13px', margin: '0' }
};

export default ModeSelector;