import React from 'react';

const LanguageToggle = ({ currentLang, onLanguageChange }) => {
  return (
    <div style={styles.container}>
      <button
        onClick={() => onLanguageChange('en')}
        style={{
          ...styles.button,
          background: currentLang === 'en' ? 'rgba(0, 217, 255, 0.2)' : 'rgba(0, 217, 255, 0.05)',
          borderColor: currentLang === 'en' ? 'var(--accent-gold)' : 'rgba(0, 217, 255, 0.2)'
        }}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => onLanguageChange('fr')}
        style={{
          ...styles.button,
          background: currentLang === 'fr' ? 'rgba(0, 217, 255, 0.2)' : 'rgba(0, 217, 255, 0.05)',
          borderColor: currentLang === 'fr' ? 'var(--accent-gold)' : 'rgba(0, 217, 255, 0.2)'
        }}
      >
        🇫🇷 FR
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '8px'
  },
  button: {
    padding: '6px 12px',
    border: '1px solid',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontFamily: 'inherit',
    fontWeight: '600',
    color: 'var(--text-primary)',
    transition: 'all 0.2s ease'
  }
};

export default LanguageToggle;