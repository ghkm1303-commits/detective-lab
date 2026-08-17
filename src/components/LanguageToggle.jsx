import React from 'react';

const LanguageToggle = ({ currentLang, onLanguageChange }) => {
  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.button,
          background: currentLang === 'en' ? 'var(--accent-gold)' : 'transparent',
          color: currentLang === 'en' ? 'var(--bg-obsidian)' : 'var(--accent-gold)',
          border: currentLang === 'en' ? 'none' : '2px solid var(--accent-gold)'
        }}
        onClick={() => onLanguageChange('en')}
      >
        🇬🇧 EN
      </button>
      <button
        style={{
          ...styles.button,
          background: currentLang === 'fr' ? 'var(--accent-teal)' : 'transparent',
          color: currentLang === 'fr' ? 'var(--bg-obsidian)' : 'var(--accent-teal)',
          border: currentLang === 'fr' ? 'none' : '2px solid var(--accent-teal)'
        }}
        onClick={() => onLanguageChange('fr')}
      >
        🇫🇷 FR
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  button: {
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: '700',
    transition: 'all 0.3s ease'
  }
};

export default LanguageToggle;