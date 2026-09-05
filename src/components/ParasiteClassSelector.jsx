import React from 'react';
import ThemeToggle from './ThemeToggle';

const ParasiteClassSelector = ({ onSelectClass, onBack, currentLang, userName, onStats, theme, onThemeChange }) => {
  const categories = [
    { id: 'protozoa', enName: 'Protozoa', frName: 'Protozoaires', icon: '🦠' },
    { id: 'helminth', enName: 'Helminths', frName: 'Helminthes', icon: '🪱' },
    { id: 'fungal', enName: 'Mycology', frName: 'Mycologie', icon: '🍄' }
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
          {currentLang === 'en' ? 'Select Category' : 'Sélectionnez la Catégorie'}
        </h1>

        <div style={styles.classGrid}>
          {categories.map(cat => (
            <button
              key={cat.id}
              style={styles.classCard}
              onClick={() => onSelectClass(cat.id)}
            >
              <div style={styles.classIcon}>{cat.icon}</div>
              <h3 style={styles.className}>
                {currentLang === 'en' ? cat.enName : cat.frName}
              </h3>
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
  classGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  classCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '30px 20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  },
  classIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  className: {
    color: 'var(--accent-gold)',
    fontSize: '16px',
    margin: '0',
    fontFamily: "'Playfair Display', serif"
  }
};

export default ParasiteClassSelector;