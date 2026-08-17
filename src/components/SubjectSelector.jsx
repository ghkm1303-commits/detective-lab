import React from 'react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

const SubjectSelector = ({ onSelectSubject, onLogout, onBack, currentLang, onLanguageChange, userName, onStats, theme, onThemeChange }) => {
  const subjects = [
    {
      id: 'pharmacology',
      icon: '💊',
      enTitle: 'Pharmacology',
      frTitle: 'Pharmacologie',
      available: true,
      enDesc: 'Drug classification and mechanisms',
      frDesc: 'Classification et mécanismes des médicaments'
    },
    {
      id: 'pharmacognosy',
      icon: '🌿',
      enTitle: 'Pharmacognosy',
      frTitle: 'Pharmacognosie',
      available: false,
      enDesc: 'Natural compounds and plants',
      frDesc: 'Composés naturels et plantes'
    },
    {
      id: 'parasitology',
      icon: '🦠',
      enTitle: 'Parasitology',
      frTitle: 'Parasitologie',
      available: false,
      enDesc: 'Parasitic infections',
      frDesc: 'Infections parasitaires'
    },
    {
      id: 'biochemistry',
      icon: '⚗️',
      enTitle: 'Biochemistry',
      frTitle: 'Biochimie',
      available: false,
      enDesc: 'Metabolic pathways',
      frDesc: 'Voies métaboliques'
    }
  ];

  return (
    <div style={styles.container}>
      {/* HEADER WITH BACK, LANGUAGE, THEME, USERNAME */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <div style={styles.rightGroup}>
          <LanguageToggle currentLang={currentLang} onLanguageChange={onLanguageChange} />
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          <button onClick={onStats} className="user-button">
            👤 {userName}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>🔬 Detective Lab</h1>
        <h2 style={styles.subtitle}>
          {currentLang === 'en' ? 'Select Subject' : 'Sélectionnez le Sujet'}
        </h2>

        <div style={styles.subjectsGrid}>
          {subjects.map(subject => (
            <button
              key={subject.id}
              style={{
                ...styles.subjectCard,
                opacity: !subject.available ? 0.5 : 1,
                cursor: !subject.available ? 'not-allowed' : 'pointer'
              }}
              onClick={() => subject.available && onSelectSubject(subject.id)}
              disabled={!subject.available}
            >
              <div style={styles.subjectIcon}>{subject.icon}</div>
              <h3 style={styles.subjectName}>
                {currentLang === 'en' ? subject.enTitle : subject.frTitle}
              </h3>
              {!subject.available && (
                <div style={styles.comingSoon}>
                  {currentLang === 'en' ? 'Coming Soon' : 'Bientôt Disponible'}
                </div>
              )}
              <p style={styles.subjectDesc}>
                {currentLang === 'en' ? subject.enDesc : subject.frDesc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '15px',
    position: 'relative',
    zIndex: 10
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid var(--border-teal)'
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(22, 124, 128, 0.1)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: '600'
  },
  rightGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '48px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: '0 0 40px 0'
  },
  subjectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  subjectCard: {
    padding: '30px 20px',
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    position: 'relative'
  },
  subjectIcon: {
    fontSize: '56px',
    marginBottom: '15px'
  },
  subjectName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 10px 0'
  },
  comingSoon: {
    display: 'inline-block',
    background: 'var(--accent-teal)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '10px',
    fontWeight: '700',
    marginBottom: '10px'
  },
  subjectDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    margin: '0'
  }
};

export default SubjectSelector;