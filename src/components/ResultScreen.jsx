import React from 'react';

const ResultScreen = ({ result, drugs, onPlayAgain, onBackToMode, currentLang }) => {
  const drug = drugs.find(d => d.names.en === result.drugName);
  const isWin = result.score > 500;

  return (
    <div style={styles.container}>
      <div style={styles.resultBox}>
        <div style={styles.resultIcon}>
          {isWin ? '🎉' : '🎮'}
        </div>

        <h1 style={styles.resultTitle}>
          {isWin 
            ? (currentLang === 'en' ? 'Excellent!' : 'Excellent!')
            : (currentLang === 'en' ? 'Game Over!' : 'Fin du Jeu!')}
        </h1>

        <div style={styles.scoreBox}>
          <div style={styles.scoreLabel}>
            {currentLang === 'en' ? 'Score' : 'Score'}
          </div>
          <div style={styles.scoreValue}>{result.score}</div>
        </div>

        <div style={styles.details}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>
              {currentLang === 'en' ? 'Drug:' : 'Médicament:'}
            </span>
            <span style={styles.detailValue}>{result.drugName}</span>
          </div>
          {drug && (
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>
                {currentLang === 'en' ? 'Class:' : 'Classe:'}
              </span>
              <span style={styles.detailValue}>{drug.class}</span>
            </div>
          )}
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>
              {currentLang === 'en' ? 'Clues Used:' : 'Indices Utilisés:'}
            </span>
            <span style={styles.detailValue}>{result.cluesUsed}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>
              {currentLang === 'en' ? 'XP Earned:' : 'XP Gagnés:'}
            </span>
            <span style={styles.detailValue}>+{Math.max(result.score - 300, 0)}</span>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.playAgainButton} onClick={onPlayAgain}>
            {currentLang === 'en' ? '🔄 Play Again' : '🔄 Rejouer'}
          </button>
          <button style={styles.menuButton} onClick={onBackToMode}>
            {currentLang === 'en' ? '📖 Back to Menu' : '📖 Retour au Menu'}
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
    padding: '15px',
    position: 'relative',
    zIndex: 10
  },
  resultBox: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '40px',
    maxWidth: '500px',
    textAlign: 'center'
  },
  resultIcon: {
    fontSize: '80px',
    marginBottom: '15px'
  },
  resultTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px',
    color: 'var(--accent-gold)',
    margin: '0 0 20px 0'
  },
  scoreBox: {
    background: 'linear-gradient(135deg, rgba(0, 208, 132, 0.15) 0%, rgba(0, 217, 255, 0.15) 100%)',
    border: '2px solid var(--accent-emerald)',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px'
  },
  scoreLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    marginBottom: '5px'
  },
  scoreValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '48px',
    fontWeight: '700',
    color: 'var(--accent-emerald)'
  },
  details: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '25px'
  },
  detailItem: {
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '6px',
    padding: '10px',
    fontSize: '11px'
  },
  detailLabel: {
    color: 'var(--text-secondary)',
    display: 'block',
    marginBottom: '4px',
    fontWeight: '600'
  },
  detailValue: {
    color: 'var(--accent-gold)',
    fontWeight: '700',
    fontSize: '12px'
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  playAgainButton: {
    padding: '12px',
    background: 'rgba(0, 208, 132, 0.15)',
    border: '2px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit'
  },
  menuButton: {
    padding: '12px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit'
  }
};

export default ResultScreen;