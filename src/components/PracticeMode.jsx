import React from 'react';
import LanguageToggle from './LanguageToggle';

const PracticeMode = ({ onBack, currentLang, onLanguageChange }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <LanguageToggle currentLang={currentLang} onLanguageChange={onLanguageChange} />
      </div>

      <div style={styles.content}>
        <div style={styles.comingSoonBox}>
          <div style={styles.icon}>🚀</div>
          <h1 style={styles.title}>
            {currentLang === 'en' ? 'Coming Soon' : 'Bientôt Disponible'}
          </h1>
          <p style={styles.subtitle}>
            {currentLang === 'en' ? 'Practice Mode - Akinator Style' : 'Mode Pratique - Style Akinator'}
          </p>
          <p style={styles.description}>
            {currentLang === 'en' 
              ? 'Challenge the AI! Think of a drug and let the AI ask yes/no questions to guess what you\'re thinking about.' 
              : 'Défiez l\'IA! Pensez à un médicament et laissez l\'IA poser des questions oui/non pour deviner.'}
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🧠</span>
              <span>{currentLang === 'en' ? 'AI learns your thoughts' : 'L\'IA apprend vos pensées'}</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>❓</span>
              <span>{currentLang === 'en' ? 'Answer yes/no questions' : 'Répondez oui/non'}</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🎯</span>
              <span>{currentLang === 'en' ? 'See if AI can guess correctly' : 'Voyez si l\'IA peut deviner'}</span>
            </div>
          </div>
          <button style={styles.notifyButton} onClick={onBack}>
            ⏰ {currentLang === 'en' ? 'Notify Me When Available' : 'Me Notifier Quand Disponible'}
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
    borderBottom: '1px solid rgba(0, 217, 255, 0.1)'
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid var(--border-glow)',
    color: 'var(--text-primary)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px'
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 100px)'
  },
  comingSoonBox: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '40px',
    maxWidth: '500px',
    textAlign: 'center'
  },
  icon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '36px',
    color: 'var(--accent-gold)',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    margin: '0 0 20px 0'
  },
  description: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    margin: '0 0 25px 0'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px',
    textAlign: 'left'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    background: 'rgba(0, 217, 255, 0.05)',
    borderRadius: '6px',
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  featureIcon: {
    fontSize: '18px'
  },
  notifyButton: {
    width: '100%',
    padding: '12px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit'
  }
};

export default PracticeMode;