import React from 'react';
import LanguageToggle from './LanguageToggle';

const GameTypeSelector = ({ onSelectMode, onBack, currentLang, onLanguageChange, userEmail, onStats }) => {
  const modes = [
    {
      id: 'blind',
      icon: '🔍',
      enTitle: 'Blind Investigation',
      frTitle: 'Investigation à l\'Aveugle',
      enSubtitle: 'HARD 🔥',
      frSubtitle: 'DIFFICILE 🔥',
      enDesc: 'No class hints given. Drug could be from ANY category. Maximum XP reward.',
      frDesc: 'Aucun indice de classe. Le médicament peut provenir de N\'IMPORTE QUELLE catégorie. Récompense XP maximale.'
    },
    {
      id: 'known',
      icon: '📚',
      enTitle: 'Focused Investigation',
      frTitle: 'Investigation Ciblée',
      enSubtitle: 'MEDIUM ⭐',
      frSubtitle: 'MOYEN ⭐',
      enDesc: 'Choose your drug class first. Focus on specific categories. Perfect for learning.',
      frDesc: 'Choisissez d\'abord votre classe. Concentrez-vous sur des catégories spécifiques. Parfait pour apprendre.'
    }
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
          <button
            onClick={onStats}
            style={{
              padding: '8px 16px',
              background: 'rgba(0, 217, 255, 0.1)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              color: 'var(--text-primary)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'inherit',
              fontWeight: '600'
            }}
          >
            👤 {userEmail}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>
          {currentLang === 'en' ? '⚔️ Choose Your Challenge' : '⚔️ Choisissez Votre Défi'}
        </h1>
        <p style={styles.subtitle}>
          {currentLang === 'en' ? 'Select difficulty and game mode' : 'Sélectionnez la difficulté et le mode de jeu'}
        </p>

        <div style={styles.modesGrid}>
          {modes.map(mode => (
            <button
              key={mode.id}
              style={styles.modeCard}
              onClick={() => onSelectMode(mode.id)}
            >
              <div style={styles.modeIcon}>{mode.icon}</div>
              <h2 style={styles.modeTitle}>
                {currentLang === 'en' ? mode.enTitle : mode.frTitle}
              </h2>
              <div style={styles.modeBadge}>
                {currentLang === 'en' ? mode.enSubtitle : mode.frSubtitle}
              </div>
              <p style={styles.modeDescription}>
                {currentLang === 'en' ? mode.enDesc : mode.frDesc}
              </p>
              <div style={styles.arrow}>→</div>
            </button>
          ))}
        </div>

        <div style={styles.tips}>
          <h3 style={styles.tipsTitle}>
            {currentLang === 'en' ? '💡 Pro Tips' : '💡 Conseils Pro'}
          </h3>
          <ul style={styles.tipsList}>
            <li>{currentLang === 'en' ? 'Ask for clues to narrow down possibilities' : 'Demandez des indices pour réduire les possibilités'}</li>
            <li>{currentLang === 'en' ? 'Pay attention to drug mechanisms and effects' : 'Faites attention aux mécanismes et effets des médicaments'}</li>
            <li>{currentLang === 'en' ? 'Use the Drug Dictionary to study between games' : 'Utilisez le Dictionnaire des Médicaments pour étudier'}</li>
          </ul>
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
    maxWidth: '900px',
    margin: '0 auto'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '36px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    textAlign: 'center',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    margin: '0 0 40px 0'
  },
  modesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  modeCard: {
    padding: '25px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    position: 'relative'
  },
  modeIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  modeTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 8px 0'
  },
  modeBadge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--bg-primary)',
    background: 'var(--accent-gold)',
    padding: '4px 12px',
    borderRadius: '20px',
    marginBottom: '12px'
  },
  modeDescription: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    margin: '0'
  },
  arrow: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    fontSize: '24px',
    color: 'var(--accent-gold)'
  },
  tips: {
    background: 'linear-gradient(135deg, rgba(0, 208, 132, 0.1) 0%, rgba(0, 217, 255, 0.1) 100%)',
    border: '2px solid var(--accent-emerald)',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  tipsTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '16px',
    color: 'var(--accent-emerald)',
    margin: '0 0 12px 0'
  },
  tipsList: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '0',
    paddingLeft: '20px'
  }
};

export default GameTypeSelector;