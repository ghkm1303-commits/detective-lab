import React from 'react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

const ModeSelector = ({ onSelectMode, onBack, currentLang, onLanguageChange, userName, onStats, theme, onThemeChange }) => {
  const modes = [
    {
      id: 'mainGame',
      icon: '🎮',
      enTitle: 'Main Game',
      frTitle: 'Jeu Principal',
      enDesc: 'Test your pharmaceutical knowledge',
      frDesc: 'Testez vos connaissances pharmaceutiques'
    },
    {
      id: 'drugDirectory',
      icon: '📖',
      enTitle: 'Drug Dictionary',
      frTitle: 'Dictionnaire des Médicaments',
      enDesc: 'Browse and study all drugs',
      frDesc: 'Parcourez et étudiez tous les médicaments'
    },
    {
      id: 'drugManagement',
      icon: '⚙️',
      enTitle: 'Manage Drugs',
      frTitle: 'Gérer les Médicaments',
      enDesc: 'Add or remove custom drugs',
      frDesc: 'Ajouter ou supprimer des médicaments personnalisés'
    },
    {
      id: 'practiceMode',
      icon: '🧠',
      enTitle: 'Practice Mode',
      frTitle: 'Mode Pratique',
      enDesc: 'Challenge the AI (Coming Soon)',
      frDesc: 'Défiez l\'IA (Bientôt disponible)'
    }
  ];

  return (
    <div style={styles.container}>
      {/* HEADER WITH BACK, LANGUAGE TOGGLE, THEME TOGGLE, USERNAME */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <div style={styles.rightGroup}>
          <LanguageToggle currentLang={currentLang} onLanguageChange={onLanguageChange} />
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          <button
            onClick={onStats}
            className="user-button"
          >
            👤 {userName}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>🔬 Detective Lab</h1>
        <h2 style={styles.subtitle}>
          {currentLang === 'en' ? 'Select Game Mode' : 'Sélectionnez le Mode de Jeu'}
        </h2>

        <div style={styles.modesGrid}>
          {modes.map(mode => (
            <button
              key={mode.id}
              style={{
                ...styles.modeCard,
                opacity: mode.id === 'practiceMode' ? 0.6 : 1,
                cursor: mode.id === 'practiceMode' ? 'not-allowed' : 'pointer'
              }}
              onClick={() => {
                if (mode.id !== 'practiceMode') {
                  onSelectMode(mode.id);
                }
              }}
              disabled={mode.id === 'practiceMode'}
            >
              <div style={styles.modeIcon}>{mode.icon}</div>
              <h3 style={styles.modeName}>
                {currentLang === 'en' ? mode.enTitle : mode.frTitle}
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
  modesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  modeCard: {
    padding: '30px 20px',
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  },
  modeIcon: {
    fontSize: '56px',
    marginBottom: '15px'
  },
  modeName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 10px 0'
  },
  modeDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    margin: '0'
  }
};

export default ModeSelector;