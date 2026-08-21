import React from 'react';
import ThemeToggle from './ThemeToggle';

const ModeSelector = ({ onSelectMode, onBack, currentLang, userName, onStats, theme, onThemeChange }) => {
  const modes = [
    {
      id: 'blind',
      icon: '🔍',
      enName: 'Blind Mode',
      frName: 'Mode Aveugle',
      enDesc: 'Guess the drug from any category',
      frDesc: 'Devinez le médicament de n\'importe quelle catégorie',
      available: true
    },
    {
      id: 'focused',
      icon: '📚',
      enName: 'Focused Mode',
      frName: 'Mode Ciblé',
      enDesc: 'Choose a category first, then guess',
      frDesc: 'Choisissez une catégorie d\'abord, puis devinez',
      available: true
    },
    {
      id: 'studyMode',
      icon: '📖',
      enName: 'Study Mode',
      frName: 'Mode Étude',
      enDesc: 'Browse and study all drugs',
      frDesc: 'Parcourir et étudier tous les médicaments',
      available: true
    },
    {
      id: 'practiceMode',
      icon: '🎯',
      enName: 'Practice Mode',
      frName: 'Mode Pratique',
      enDesc: 'Learn drugs at your own pace',
      frDesc: 'Apprenez les médicaments à votre rythme',
      available: false
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
    borderBottom: '1px solid var(--border-teal)',
    flexWrap: 'wrap',
    gap: '10px'
  },
  rightGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  title: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  modeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
  },
  modeCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    position: 'relative'
  },
  modeIcon: {
    fontSize: '40px',
    marginBottom: '15px'
  },
  modeName: {
    color: 'var(--accent-gold)',
    fontSize: '18px',
    margin: '0 0 10px 0',
    fontFamily: "'Playfair Display', serif"
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
  modeDesc: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    margin: '0'
  }
};

export default ModeSelector;