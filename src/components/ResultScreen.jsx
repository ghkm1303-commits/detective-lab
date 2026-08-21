import React from 'react';

const ResultScreen = ({ result, onPlayAgain, onBackToMode, currentLang }) => {
  if (!result) return null;

  const isWin = result.correct;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>{isWin ? '🎉' : '🎮'}</div>

        <h1 style={styles.title}>
          {isWin
            ? (currentLang === 'en' ? 'Victory!' : 'Victoire!')
            : (currentLang === 'en' ? 'Game Over!' : 'Jeu Terminé!')}
        </h1>

        <div style={styles.scoreBox}>
          <p style={styles.scoreLabel}>{currentLang === 'en' ? 'Score' : 'Score'}</p>
          <p style={styles.scoreValue}>{result.score}</p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>{currentLang === 'en' ? 'Drug:' : 'Médicament:'}</p>
            <p style={styles.statValue}>{result.drugName}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>{currentLang === 'en' ? 'Class:' : 'Classe:'}</p>
            <p style={styles.statValue}>{result.drugClass}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>{currentLang === 'en' ? 'Clues Used:' : 'Indices Utilisés:'}</p>
            <p style={styles.statValueNeutral}>{result.cluesUsed}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>{currentLang === 'en' ? 'XP Earned:' : 'XP Gagné:'}</p>
            <p style={styles.statValueNeutral}>+{result.xpEarned}</p>
          </div>
        </div>

        <div style={styles.buttons}>
          <button style={styles.playAgainBtn} onClick={onPlayAgain}>
            🔄 {currentLang === 'en' ? 'Play Again' : 'Rejouer'}
          </button>
          <button style={styles.backBtn} onClick={onBackToMode}>
            📖 {currentLang === 'en' ? 'Back to Menu' : 'Retour au Menu'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '14px',
    padding: '35px 30px',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center'
  },
  icon: {
    fontSize: '56px',
    marginBottom: '10px'
  },
  title: {
    color: 'var(--accent-gold)',
    fontSize: '32px',
    margin: '0 0 25px 0',
    fontFamily: "'Playfair Display', serif"
  },
  scoreBox: {
    background: 'linear-gradient(135deg, rgba(22, 124, 128, 0.15) 0%, rgba(47, 125, 91, 0.15) 100%)',
    border: '2px solid var(--accent-teal)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px'
  },
  scoreLabel: {
    color: 'var(--text-primary)',
    fontSize: '14px',
    margin: '0 0 10px 0'
  },
  scoreValue: {
    color: 'var(--accent-emerald)',
    fontSize: '40px',
    fontWeight: '700',
    margin: '0',
    fontFamily: "'Playfair Display', serif"
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '25px'
  },
  statCard: {
    background: 'rgba(22, 124, 128, 0.08)',
    border: '1px solid var(--border-teal)',
    borderRadius: '8px',
    padding: '14px 10px'
  },
  statLabel: {
    color: 'var(--text-secondary)',
    fontSize: '12px',
    margin: '0 0 8px 0'
  },
  statValue: {
    color: 'var(--accent-gold)',
    fontSize: '15px',
    fontWeight: '700',
    margin: '0'
  },
  statValueNeutral: {
    color: 'var(--text-primary)',
    fontSize: '15px',
    fontWeight: '700',
    margin: '0'
  },
  buttons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  playAgainBtn: {
    padding: '12px',
    background: 'rgba(47, 125, 91, 0.1)',
    border: '2px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px'
  },
  backBtn: {
    padding: '12px',
    background: 'rgba(184, 154, 90, 0.1)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px'
  }
};

export default ResultScreen;