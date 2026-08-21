import React, { useState, useEffect } from 'react';
import { pickRandomDrug, checkGuess } from '../utils/gameLogic';

const MainGame = ({ drugs, selectedClass, gameMode, onGameEnd, onBack, currentLang, theme }) => {
  const [hiddenDrug, setHiddenDrug] = useState(null);
  const [allClues, setAllClues] = useState([]);
  const [revealedCluesCount, setRevealedCluesCount] = useState(1);
  const [guess, setGuess] = useState('');
  const [wrongGuesses, setWrongGuesses] = useState(0);

  useEffect(() => {
    const filteredDrugs = selectedClass
      ? drugs.filter(d => d.class === selectedClass)
      : drugs;

    if (filteredDrugs.length > 0) {
      const drug = pickRandomDrug(filteredDrugs);
      setHiddenDrug(drug);

      const clues = [
        `Indication: ${drug.indications.substring(0, 60)}`,
        `Route: ${drug.route} administration`,
        `Mechanism: ${drug.mechanism.substring(0, 70)}`,
        `Therapeutic Class: ${drug.therapeuticClass}`,
        `Side Effect: ${drug.sideEffects[0] || 'Headache'}`,
        `Metabolism: ${drug.metabolism}`,
        `Elimination: ${drug.elimination}`,
        `Half-life: ${drug.halfLife}`
      ];
      setAllClues(clues);
      setRevealedCluesCount(1);
    }
  }, [drugs, selectedClass, gameMode]);

  const handleGuess = () => {
    if (!guess.trim() || !hiddenDrug) return;

    const isCorrect = checkGuess(guess, hiddenDrug);

    if (isCorrect) {
      const score = Math.max(100, 1000 - (revealedCluesCount * 100));
      const xpEarned = Math.max(score - 300, 0);

      onGameEnd({
        correct: true,
        drugName: hiddenDrug.names.en,
        drugClass: hiddenDrug.therapeuticClass,
        score,
        xpEarned,
        cluesUsed: revealedCluesCount
      });
    } else {
      setWrongGuesses(wrongGuesses + 1);
      setGuess('');
    }
  };

  const handleRevealClue = () => {
    if (revealedCluesCount < allClues.length) {
      setRevealedCluesCount(revealedCluesCount + 1);
    }
  };

  const handleGiveUp = () => {
    onGameEnd({
      correct: false,
      drugName: hiddenDrug.names.en,
      drugClass: hiddenDrug.therapeuticClass,
      score: 0,
      xpEarned: 0,
      cluesUsed: revealedCluesCount
    });
  };

  if (!hiddenDrug) {
    return <div style={styles.loading}>{currentLang === 'en' ? 'Loading game...' : 'Chargement du jeu...'}</div>;
  }

  const revealedClues = allClues.slice(0, revealedCluesCount);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <h2 style={styles.gameTitle}>🔬 Detective Lab</h2>
        <div style={styles.modeIndicator}>
          {gameMode === 'blind' ? '🔍 Blind' : '📚 Focused'}
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.guessSection}>
          <h3 style={styles.guessTitle}>
            {currentLang === 'en' ? 'What drug is it?' : 'Quel médicament est-ce?'}
          </h3>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
            placeholder={currentLang === 'en' ? 'Enter drug name...' : 'Entrez le nom du médicament...'}
            style={styles.guessInput}
          />
          <button style={styles.submitButton} onClick={handleGuess}>
            ✓ {currentLang === 'en' ? 'Submit' : 'Soumettre'}
          </button>

          {wrongGuesses > 0 && (
            <p style={styles.errorMessage}>
              {currentLang === 'en' ? `Wrong! (${wrongGuesses} incorrect)` : `Mauvaise réponse! (${wrongGuesses})`}
            </p>
          )}
        </div>

        <div style={styles.cluesSection}>
          <h3 style={styles.cluesTitle}>
            {currentLang === 'en' ? 'Available Clues' : 'Indices Disponibles'} ({revealedCluesCount}/8)
          </h3>
          <div style={styles.cluesGrid}>
            {revealedClues.map((clue, idx) => (
              <div key={idx} style={styles.clueCard}>
                <p style={styles.clueNumber}>{idx + 1}</p>
                <p style={styles.clueText}>{clue}</p>
              </div>
            ))}
          </div>

          <div style={styles.clueButtonsSection}>
            {revealedCluesCount < allClues.length && (
              <button style={styles.revealButton} onClick={handleRevealClue}>
                💡 {currentLang === 'en' ? 'Reveal Next Clue' : 'Révéler le Prochain Indice'}
              </button>
            )}
            <button style={styles.giveUpButton} onClick={handleGiveUp}>
              🚪 {currentLang === 'en' ? 'Give Up' : 'Abandonner'}
            </button>
          </div>
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
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    fontSize: '16px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(22, 124, 128, 0.2)',
    flexWrap: 'wrap',
    gap: '10px'
  },
  backButton: {
    padding: '8px 16px',
    background: 'transparent',
    border: '2px solid var(--accent-gold)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: '600'
  },
  gameTitle: {
    color: '#B89A5A',
    fontSize: '24px',
    margin: '0',
    fontFamily: "'Playfair Display', serif"
  },
  modeIndicator: {
    background: 'rgba(47, 125, 91, 0.1)',
    border: '1px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700'
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  guessSection: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid #B89A5A',
    borderRadius: '10px',
    padding: '25px',
    marginBottom: '30px'
  },
  guessTitle: {
    color: '#B89A5A',
    fontSize: '18px',
    margin: '0 0 15px 0',
    fontFamily: "'Playfair Display', serif"
  },
  guessInput: {
    width: '100%',
    padding: '12px',
    background: 'rgba(47, 125, 91, 0.05)',
    border: '2px solid var(--accent-emerald)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    fontFamily: 'inherit',
    fontSize: '14px',
    marginBottom: '15px'
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #167C80, #2F7D5B)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: '700'
  },
  errorMessage: {
    color: '#E63946',
    fontSize: '13px',
    marginTop: '10px'
  },
  cluesSection: {
    marginBottom: '30px'
  },
  cluesTitle: {
    color: '#B89A5A',
    fontSize: '18px',
    margin: '0 0 15px 0',
    fontFamily: "'Playfair Display', serif"
  },
  cluesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  clueCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid rgba(47, 125, 91, 0.2)',
    borderRadius: '8px',
    padding: '15px',
    borderLeft: '3px solid var(--accent-emerald)'
  },
  clueNumber: {
    color: '#B89A5A',
    fontSize: '14px',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  clueText: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    margin: '0'
  },
  clueButtonsSection: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  revealButton: {
    flex: 1,
    minWidth: '150px',
    padding: '12px',
    background: 'linear-gradient(135deg, #167C80, #2F7D5B)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: '700'
  },
  giveUpButton: {
    flex: 1,
    minWidth: '150px',
    padding: '12px',
    background: 'rgba(230, 57, 70, 0.1)',
    border: '2px solid #E63946',
    color: '#FF6B7A',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: '700'
  }
};

export default MainGame;