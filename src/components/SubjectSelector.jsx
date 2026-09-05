import React from 'react';
import ThemeToggle from './ThemeToggle';

const SubjectSelector = ({ onSelectSubject, onBack, currentLang, userName, onStats, theme, onThemeChange }) => {
  const subjects = [
    {
      id: 'pharmacology_old',
      icon: '💊',
      enTitle: 'Medications',
      frTitle: 'Médicaments',
      available: true,
      enDesc: 'Drug classification and mechanisms',
      frDesc: 'Classification et mécanismes des médicaments'
    },
    {
      id: 'pharmacology_new',
      icon: '🧪',
      enTitle: 'Pharmacology',
      frTitle: 'Pharmacologie',
      available: true,
      enDesc: 'Full pharmacology curriculum by domain',
      frDesc: 'Programme complet de pharmacologie par domaine'
    },
    {
      id: 'parasitology',
      icon: '🦠',
      enTitle: 'Parasitology',
      frTitle: 'Parasitologie',
      available: true,
      enDesc: 'Parasitic infections',
      frDesc: 'Infections parasitaires'
    },
    {
      id: 'pharmacognosy',
      icon: '🌿',
      enTitle: 'Pharmacognosy',
      frTitle: 'Pharmacognosie',
      available: false,
      enDesc: 'Natural compounds and plants',
      frDesc: 'Composés naturels et plantes'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button className="back-button" onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <div style={styles.rightGroup}>
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
              className={!subject.available ? 'mode-card-disabled' : ''}
              style={styles.subjectCard}
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
  container: { minHeight: '100vh', padding: '15px', position: 'relative', zIndex: 10 },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid var(--border-teal)',
    flexWrap: 'wrap', gap: '10px'
  },
  rightGroup: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  content: { maxWidth: '1000px', margin: '0 auto', textAlign: 'center' },
  title: { fontSize: '48px', margin: '0 0 10px 0' },
  subtitle: { fontSize: '28px', color: 'var(--text-primary)', margin: '0 0 40px 0' },
  subjectsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
  subjectCard: {
    padding: '30px 20px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-gold)', borderRadius: '10px', cursor: 'pointer',
    fontFamily: 'inherit', transition: 'all 0.3s ease', textAlign: 'center', position: 'relative'
  },
  subjectIcon: { fontSize: '56px', marginBottom: '15px' },
  subjectName: { fontSize: '18px', fontWeight: '700', color: 'var(--accent-gold)', margin: '0 0 10px 0' },
  comingSoon: {
    display: 'inline-block', background: 'var(--accent-teal)', color: 'white', padding: '4px 12px',
    borderRadius: '20px', fontSize: '10px', fontWeight: '700', marginBottom: '10px'
  },
  subjectDesc: { fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0' }
};

export default SubjectSelector;