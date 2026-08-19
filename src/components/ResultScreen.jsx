import React from 'react';
import ThemeToggle from './ThemeToggle';

const ResultScreen = ({ result, drugs, onPlayAgain, onBackToMode, currentLang, theme, onThemeChange, userName }) => {
  const handleThemeChange = (newTheme) => {
    onThemeChange(newTheme);
  };

  const resultDrug = drugs.find(d => d.names.en === result.drugName);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBackToMode}>
          ← {currentLang === 'en' ? 'Back to Menu' : 'Retour au Menu'}
        </button>
        <div style={styles.rightGroup}>
          <ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
          <span style={styles.userName}>👤 {userName}</span>
        </div>
      </div>

      <div style={styles.content}>
        {result.correct ? (
          <div style={styles.resultCard}>
            <h1 style={styles.successTitle}>🎉 {currentLang === 'en' ? 'Correct!' : 'Correct!'}</h1>
            <p style={styles.drugName}>{result.drugName}</p>

            {resultDrug && (
              <div style={styles.drugInfo}>
                <p style={styles.drugDetail}>
                  <strong>{currentLang === 'en' ? 'Class:' : 'Classe:'}</strong> {resultDrug.therapeuticClass}
                </p>
                <p style={styles.drugDetail}>
                  <strong>{currentLang === 'en' ? 'Indications:' : 'Indications:'}</strong> {resultDrug.indications}
                </p>
              </div>
            )}

            <div style={styles.scoreCard}>
              <div style={styles.scoreItem}>
                <p style={styles.scoreLabel}>{currentLang === 'en' ? 'Score' : 'Score'}</p>
                <p style={styles.scoreValue}>{result.score}</p>
              </div>
              <div style={styles.scoreItem}>
                <p style={styles.scoreLabel}>{currentLang === 'en' ? 'XP Earned' : 'XP Gagné'}</p>
                <p style={styles.scoreValue}>{result.xpEarned}</p>
              </div>
              <div style={styles.scoreItem}>
                <p style={styles.scoreLabel}>{currentLang === 'en' ? 'Clues Used' : 'Indices Utilisés'}</p>
                <p style={styles.scoreValue}>{result.cluesUsed}/8</p>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.resultCard}>
            <h1 style={styles.failureTitle}>❌ {currentLang === 'en' ? 'Game Over' : 'Fin du Jeu'}</h1>
            <p style={styles.drugName}>{currentLang === 'en' ? 'The drug was:' : 'Le médicament était:'} {result.drugName}</p>

            {resultDrug && (
              <div style={styles.drugInfo}>
                <p style={styles.drugDetail}>
                  <strong>{currentLang === 'en' ? 'Class:' : 'Classe:'}</strong> {resultDrug.therapeuticClass}
                </p>
                <p style={styles.drugDetail}>
                  <strong>{currentLang === 'en' ? 'Mechanism:' : 'Mécanisme:'}</strong> {resultDrug.mechanism}
                </p>
              </div>
            )}

            <p style={styles.tryAgainMessage}>
              {currentLang === 'en' ? 'Better luck next time!' : 'Meilleure chance la prochaine fois!'}
            </p>
          </div>
        )}

        <div style={styles.buttonsGroup}>
          <button style={styles.playAgainButton} onClick={onPlayAgain}>
            🎮 {currentLang === 'en' ? 'Play Again' : 'Rejouer'}
          </button>
          <button style={styles.menuButton} onClick={onBackToMode}>
            📊 {currentLang === 'en' ? 'Back to Menu' : 'Retour au Menu'}
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
  backButton: {
    padding: '8px 16px',
    background: 'rgba(47, 125, 91, 0.1)',
    border: '2px solid var(--accent-emerald)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: '600'
  },
  rightGroup: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  userName: {
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontWeight: '600'
  },
  content: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center'
  },
  resultCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '30px'
  },
  successTitle: {
    color: 'var(--accent-emerald)',
    fontSize: '36px',
    margin: '0 0 15px 0',
    fontFamily: "'Playfair Display', serif"
  },
  failureTitle: {
    color: '#E63946',
    fontSize: '36px',
    margin: '0 0 15px 0',
    fontFamily: "'Playfair Display', serif"
  },
  drugName: {
    color: 'var(--accent-gold)',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 20px 0'
  },
  drugInfo: {
    background: 'rgba(47, 125, 91, 0.1)',
    border: '1px solid rgba(47, 125, 91, 0.2)',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px'
  },
  drugDetail: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    margin: '8px 0'
  },
  scoreCard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '20px'
  },
  scoreItem: {
    background: 'rgba(47, 125, 91, 0.1)',
    borderRadius: '8px',
    padding: '12px'
  },
  scoreLabel: {
    color: 'var(--text-secondary)',
    fontSize: '11px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    textTransform: 'uppercase'
  },
  scoreValue: {
    color: 'var(--accent-gold)',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0'
  },
  tryAgainMessage: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontStyle: 'italic',
    marginTop: '20px'
  },
  buttonsGroup: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  playAgainButton: {
    flex: 1,
    minWidth: '150px',
    padding: '12px',
    background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%)',
    color: 'var(--bg-obsidian)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: '700'
  },
  menuButton: {
    flex: 1,
    minWidth: '150px',
    padding: '12px',
    background: 'rgba(47, 125, 91, 0.2)',
    border: '2px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: '700'
  }
};

export default ResultScreen;