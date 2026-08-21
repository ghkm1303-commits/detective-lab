import React from 'react';
import ThemeToggle from './ThemeToggle';

const GameTypeSelector = ({ onSelectMode, onBack, currentLang, userName, onStats, theme, onThemeChange }) => {
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

        <div style={styles.typeGrid}>
          <button
            style={styles.typeCard}
            onClick={() => onSelectMode('blind')}
          >
            <div style={styles.typeIcon}>🔍</div>
            <h3 style={styles.typeName}>
              {currentLang === 'en' ? 'Blind Mode' : 'Mode Aveugle'}
            </h3>
            <p style={styles.typeDesc}>
              {currentLang === 'en'
                ? 'Guess from any category'
                : 'Devinez de n\'importe quelle catégorie'}
            </p>
          </button>

          <button
            style={styles.typeCard}
            onClick={() => onSelectMode('focused')}
          >
            <div style={styles.typeIcon}>📚</div>
            <h3 style={styles.typeName}>
              {currentLang === 'en' ? 'Focused Mode' : 'Mode Ciblé'}
            </h3>
            <p style={styles.typeDesc}>
              {currentLang === 'en'
                ? 'Choose a category first'
                : 'Choisissez une catégorie d\'abord'}
            </p>
          </button>
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
    maxWidth: '800px',
    margin: '0 auto'
  },
  title: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px'
  },
  typeCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '40px 30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  },
  typeIcon: {
    fontSize: '60px',
    marginBottom: '20px'
  },
  typeName: {
    color: 'var(--accent-gold)',
    fontSize: '22px',
    margin: '0 0 15px 0',
    fontFamily: "'Playfair Display', serif"
  },
  typeDesc: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    margin: '0'
  }
};

export default GameTypeSelector;