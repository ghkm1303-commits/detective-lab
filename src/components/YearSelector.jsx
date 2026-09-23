import React from 'react';
import Logo from './Logo';
import BackButton from './BackButton';

const YEAR_LABELS = {
  year1: { en: '1st Year', fr: '1ère Année' },
  year2: { en: '2nd Year', fr: '2ème Année' },
  year3: { en: '3rd Year', fr: '3ème Année' },
  year4: { en: '4th Year', fr: '4ème Année' },
  year5: { en: '5th Year', fr: '5ème Année' }
};

const YearSelector = ({ onSelectYear, onBack, currentLang, userName, onStats, theme }) => {
  const years = [
    {
      id: 'year1',
      icon: '🎓',
      enTitle: '1st Year',
      frTitle: '1ère Année',
      available: true,
      enDesc: 'Foundational sciences',
      frDesc: 'Sciences fondamentales'
    },
    {
      id: 'year2',
      icon: '🎓',
      enTitle: '2nd Year',
      frTitle: '2ème Année',
      available: true,
      enDesc: 'Chemistry, biophysics & biochemistry',
      frDesc: 'Chimie, biophysique et biochimie'
    },
    {
      id: 'year3',
      icon: '🎓',
      enTitle: '3rd Year',
      frTitle: '3ème Année',
      available: true,
      enDesc: 'Pharmacology, Pharmacognosy & Therapeutic Chemistry',
      frDesc: 'Pharmacologie, Pharmacognosie et Chimie Thérapeutique'
    },
    {
      id: 'year4',
      icon: '🎓',
      enTitle: '4th Year',
      frTitle: '4ème Année',
      available: true,
      enDesc: 'Parasitology and medical sciences',
      frDesc: 'Parasitologie et sciences médicales'
    },
    {
      id: 'year5',
      icon: '🎓',
      enTitle: '5th Year',
      frTitle: '5ème Année',
      available: true,
      enDesc: 'Clinical & hospital pharmacy',
      frDesc: 'Pharmacie clinique et hospitalière'
    }
  ];

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
        <h2 style={styles.subtitle}>
          {currentLang === 'en' ? 'Select Your Study Year' : 'Sélectionnez Votre Année d\'Étude'}
        </h2>
        <div style={styles.yearsGrid}>
          {years.map(year => (
            <button
              key={year.id}
              className={!year.available ? 'mode-card-disabled' : ''}
              style={styles.yearCard}
              onClick={() => year.available && onSelectYear(year.id)}
              disabled={!year.available}
            >
              <div style={styles.yearIcon}>{year.icon}</div>
              <h3 style={styles.yearName}>
                {currentLang === 'en' ? year.enTitle : year.frTitle}
              </h3>
              {!year.available && (
                <div style={styles.comingSoon}>
                  {currentLang === 'en' ? 'Coming Soon' : 'Bientôt Disponible'}
                </div>
              )}
              <p style={styles.yearDesc}>
                {currentLang === 'en' ? year.enDesc : year.frDesc}
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
  content: { maxWidth: '1000px', margin: '0 auto', textAlign: 'center' },
  subtitle: {
    fontSize: '28px', color: '#FFFFFF', margin: '0 0 40px 0',
    fontFamily: "'Ubuntu', sans-serif", fontWeight: '700'
  },
  yearsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
  yearCard: {
    padding: '30px 20px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-gold)', borderRadius: '10px', cursor: 'pointer',
    fontFamily: 'inherit', transition: 'all 0.3s ease', textAlign: 'center', position: 'relative'
  },
  yearIcon: { fontSize: '56px', marginBottom: '15px' },
  yearName: { fontSize: '18px', fontWeight: '700', color: 'var(--accent-gold)', margin: '0 0 10px 0' },
  comingSoon: {
    display: 'inline-block', background: 'var(--accent-teal)', color: 'white', padding: '4px 12px',
    borderRadius: '20px', fontSize: '10px', fontWeight: '700', marginBottom: '10px'
  },
  yearDesc: { fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0' }
};

export default YearSelector;