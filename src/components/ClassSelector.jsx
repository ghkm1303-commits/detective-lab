import React from 'react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

const ClassSelector = ({ onSelectClass, onBack, currentLang, onLanguageChange, userName, onStats, theme, onThemeChange }) => {
  const classes = [
    { id: 'cardiovascular', frName: 'Médicaments du Système Cardiaque', enName: 'Cardiovascular System Drugs', icon: '❤️' },
    { id: 'nervous', frName: 'Médicaments du Système Nerveux', enName: 'Nervous System Drugs', icon: '🧠' },
    { id: 'endocrine', frName: 'Médicaments du Système Endocrinien', enName: 'Endocrine System Drugs', icon: '⚗️' },
    { id: 'respiratory', frName: 'Médicaments du Système Respiratoire', enName: 'Respiratory System Drugs', icon: '💨' },
    { id: 'digestive', frName: 'Médicaments du Système Digestif', enName: 'Digestive System Drugs', icon: '🍽️' },
    { id: 'immune', frName: 'Médicaments du Système Immunitaire', enName: 'Immune System Drugs', icon: '🛡️' },
    { id: 'musculoskeletal', frName: 'Médicaments Musculo-Squelettiques', enName: 'Musculoskeletal Drugs', icon: '🦴' },
    { id: 'renal', frName: 'Médicaments du Système Rénal', enName: 'Renal System Drugs', icon: '💧' }
  ];

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <div style={styles.rightGroup}>
          <LanguageToggle currentLang={currentLang} onLanguageChange={onLanguageChange} />
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          <button onClick={onStats} className="user-button">
            👤 {userName}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>
          {currentLang === 'en' ? 'Select Drug Class' : 'Sélectionnez la Classe de Médicaments'}
        </h1>

        <div style={styles.classesGrid}>
          {classes.map(cls => (
            <button
              key={cls.id}
              style={styles.classCard}
              onClick={() => onSelectClass(cls.id)}
            >
              <div style={styles.classIcon}>{cls.icon}</div>
              <h3 style={styles.className}>
                {currentLang === 'en' ? cls.enName : cls.frName}
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
    fontSize: '36px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 40px 0'
  },
  classesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  classCard: {
    padding: '25px 15px',
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-teal)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease'
  },
  classIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  className: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--accent-teal)',
    margin: '0'
  }
};

export default ClassSelector;