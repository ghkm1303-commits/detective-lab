import React from 'react';
import Logo from './Logo';
import BackButton from './BackButton';
import Breadcrumb from './Breadcrumb';

const ChemistryModeSelector = ({ onSelectMode, onBack, onGoHome, currentLang, userName, onStats, theme }) => {
  const modes = [
    {
      id: 'therapeuticClass',
      icon: '🧬',
      enName: 'Therapeutic Class Mode',
      frName: 'Mode Classe Thérapeutique',
      enDesc: 'Guess the class from its mechanism and structure-activity relationship',
      frDesc: 'Devinez la classe à partir du mécanisme et de la relation structure-activité'
    },
    {
      id: 'medication',
      icon: '💊',
      enName: 'Medication Mode',
      frName: 'Mode Médicament',
      enDesc: 'Choose a class, then guess the exact drug from its distinctive features',
      frDesc: 'Choisissez une classe, puis devinez le médicament précis grâce à ses points distinctifs'
    },
    {
      id: 'combined',
      icon: '🧪',
      enName: 'Combined Mode',
      frName: 'Mode Combiné',
      enDesc: 'Pick 2+ classes for a mix of class and drug questions',
      frDesc: 'Choisissez 2 classes ou plus pour un mélange de questions classe et médicament'
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
        <Breadcrumb
          currentLang={currentLang}
          onHomeClick={onGoHome}
          trail={[{ label: currentLang === 'en' ? 'Therapeutic Chemistry' : 'Chimie Thérapeutique' }]}
        />

        <h1 style={styles.title}>
          {currentLang === 'en' ? 'Select Game Mode' : 'Sélectionner le Mode de Jeu'}
        </h1>

        <div style={styles.modeGrid}>
          {modes.map(mode => (
            <button
              key={mode.id}
              style={styles.modeCard}
              onClick={() => onSelectMode(mode.id)}
            >
              <div style={styles.modeIcon}>{mode.icon}</div>
              <h3 style={styles.modeName}>
                {currentLang === 'en' ? mode.enName : mode.frName}
              </h3>
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
  modeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
  modeCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid var(--border-gold)', borderRadius: '10px', padding: '25px',
    cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center'
  },
  modeIcon: { fontSize: '40px', marginBottom: '15px' },
  modeName: { color: 'var(--accent-gold)', fontSize: '18px', margin: '0 0 10px 0', fontFamily: "'Playfair Display', serif" },
  modeDesc: { color: 'var(--text-secondary)', fontSize: '13px', margin: '0' }
};

export default ChemistryModeSelector;