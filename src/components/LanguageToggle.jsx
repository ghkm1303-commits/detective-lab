import React from 'react';

const LanguageToggle = ({ currentLang, onLanguageChange }) => {
  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.button,
          background: currentLang === 'en' 
            ? 'linear-gradient(135deg, #B89A5A, #D4AE69)' 
            : 'transparent',
          color: currentLang === 'en' ? 'var(--bg-obsidian)' : 'var(--accent-gold)',
          border: currentLang === 'en' ? 'none' : '2px solid var(--accent-gold)',
          fontWeight: currentLang === 'en' ? '700' : '600'
        }}
        onClick={() => onLanguageChange('en')}
      >
        🇬🇧 EN
      </button>
      <button
        style={{
          ...styles.button,
          background: currentLang === 'fr' 
            ? 'linear-gradient(135deg, #167C80, #1E9CA0)' 
            : 'transparent',
          color: currentLang === 'fr' ? 'white' : 'var(--accent-teal)',
          border: currentLang === 'fr' ? 'none' : '2px solid var(--accent-teal)',
          fontWeight: currentLang === 'fr' ? '700' : '600'
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
    alignItems: 'center',
    background: 'rgba(22, 124, 128, 0.05)',
    padding: '6px 8px',
    borderRadius: '20px',
    border: '1px solid rgba(184, 154, 90, 0.2)'
  },
  button: {
    padding: '8px 16px',
    borderRadius: '16px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    transition: 'all 0.3s ease',
    outline: 'none'
  }
};

export default LanguageToggle;