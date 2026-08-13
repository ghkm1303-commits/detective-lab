import React from 'react';

const ResultScreen = ({ result, drugs, onPlayAgain, onBackToMode }) => {
  // Handle undefined result
  const gameResult = result || {
    won: false,
    drugName: 'Unknown',
    cluesUsed: 0,
    score: 0,
    gavUp: false
  };

  const getMotivation = () => {
    if (!gameResult.won) {
      return "Don't give up! Try again to master pharmacology!";
    }

    if (gameResult.score >= 800) return "🏆 LEGENDARY! Perfect knowledge!";
    if (gameResult.score >= 600) return "⭐ EXCELLENT! You're a drug expert!";
    if (gameResult.score >= 400) return "👍 GOOD! Keep practicing!";
    return "💪 Not bad! Play more to improve!";
  };

  return (
    <div style={styles.container}>
      <div style={styles.resultBox}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={{
            ...styles.icon,
            fontSize: gameResult.won ? '80px' : '80px'
          }}>
            {gameResult.won ? '🎉' : '😢'}
          </div>

          <h1 style={{
            ...styles.title,
            color: gameResult.won ? 'var(--accent-emerald)' : 'var(--danger)'
          }}>
            {gameResult.won ? 'VICTORY!' : 'GAME OVER'}
          </h1>

          <p style={styles.subtitle}>
            {gameResult.gavUp ? 'You gave up...' : gameResult.won ? 'Excellent deduction!' : 'Better luck next time!'}
          </p>
        </div>

        {/* RESULT DETAILS */}
        <div style={styles.detailsBox}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Drug Name:</span>
            <span style={styles.detailValue}>{gameResult.drugName}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Clues Used:</span>
            <span style={styles.detailValue}>{gameResult.cluesUsed}</span>
          </div>

          <div style={{...styles.detailRow, borderBottom: 'none'}}>
            <span style={styles.detailLabel}>Score:</span>
            <span style={{
              ...styles.detailValue,
              fontSize: '28px',
              fontWeight: '700',
              color: gameResult.won ? 'var(--accent-gold)' : 'var(--text-secondary)'
            }}>
              {gameResult.score}
            </span>
          </div>
        </div>

        {/* MOTIVATION */}
        <div style={{
          ...styles.motivationBox,
          backgroundColor: gameResult.won 
            ? 'rgba(0, 208, 132, 0.1)' 
            : 'rgba(255, 71, 87, 0.1)',
          borderColor: gameResult.won 
            ? 'var(--accent-emerald)' 
            : 'var(--danger)'
        }}>
          <p style={{
            ...styles.motivationText,
            color: gameResult.won ? 'var(--accent-emerald)' : 'var(--danger)'
          }}>
            {getMotivation()}
          </p>
        </div>

        {/* BUTTONS */}
        <div style={styles.buttonsSection}>
          <button style={styles.playAgainButton} onClick={onPlayAgain}>
            🔄 Play Again
          </button>

          <button style={styles.homeButton} onClick={onBackToMode}>
            🏠 Back to Menu
          </button>
        </div>

        {/* STATS */}
        <div style={styles.statsFooter}>
          <p style={styles.statsText}>
            {gameResult.won 
              ? `Great job! You identified the drug using ${gameResult.cluesUsed} clues.`
              : `The drug was: ${gameResult.drugName}. Study more to improve!`
            }
          </p>
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
    padding: '20px',
    position: 'relative',
    zIndex: 10
  },
  resultBox: {
    maxWidth: '500px',
    width: '100%',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '16px',
    padding: '50px 30px 30px 30px',
    boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
    textAlign: 'center'
  },
  header: {
    marginBottom: '40px'
  },
  icon: {
    display: 'block',
    marginBottom: '20px',
    animation: 'bounce 0.6s ease-in-out'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '48px',
    fontWeight: '700',
    margin: '0 0 10px 0',
    textShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    margin: 0
  },
  detailsBox: {
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid rgba(0, 217, 255, 0.1)',
    fontSize: '14px'
  },
  detailLabel: {
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  detailValue: {
    color: 'var(--accent-gold)',
    fontWeight: '700',
    fontSize: '18px'
  },
  motivationBox: {
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid',
    marginBottom: '30px'
  },
  motivationText: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    lineHeight: '1.5'
  },
  buttonsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  playAgainButton: {
    padding: '14px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit'
  },
  homeButton: {
    padding: '14px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '2px solid var(--border-glow)',
    color: 'var(--border-glow)',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit'
  },
  statsFooter: {
    paddingTop: '20px',
    borderTop: '1px solid rgba(0, 217, 255, 0.1)'
  },
  statsText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: 0,
    lineHeight: '1.6'
  }
};

export default ResultScreen;