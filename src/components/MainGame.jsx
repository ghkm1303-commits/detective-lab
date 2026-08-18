import React, { useState, useEffect } from 'react';
import { pickRandomDrug, checkGuess } from '../utils/gameLogic';

const MainGame = ({ drugs, selectedClass, gameMode, onGameEnd, onBack, currentLang, theme }) => {
  const [hiddenDrug, setHiddenDrug] = useState(null);
  const [allClues, setAllClues] = useState([]);
  const [revealedCluesCount, setRevealedCluesCount] = useState(1);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null);
  const [wrongGuesses, setWrongGuesses] = useState(0);

  useEffect(() => {
    const filteredDrugs = selectedClass
      ? drugs.filter(d => d.class === selectedClass)
      : drugs;
    
    if (filteredDrugs.length > 0) {
      const drug = pickRandomDrug(filteredDrugs);
      setHiddenDrug(drug);
      // Create 8 simple clues
      const clues = [
        drug.effects && drug.effects[0] ? `Effect: ${drug.effects[0]}` : `Class: ${drug.therapeuticClass}`,
        `Route: ${drug.route}`,
        `Indication: ${drug.indications.substring(0, 50)}...`,
        `Side effect: ${drug.sideEffects[0] || 'None listed'}`,
        `Metabolism: ${drug.metabolism}`,
        `Elimination: ${drug.elimination}`,
        `Half-life: ${drug.halfLife}`,
        `Contraindication: ${drug.contraindications[0] || 'None listed'}`
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
      
      setResult({
        correct: true,
        drugName: hiddenDrug.names.en,
        score,
        xpEarned,
        cluesUsed: revealedCluesCount
      });

      onGameEnd({
        correct: true,
        drugName: hiddenDrug.names.en,
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
    setResult({
      correct: false,
      drugName: hiddenDrug.names.en,
      message: currentLang === 'en' ? 'You gave up!' : 'Vous avez abandonné!'
    });

    onGameEnd({
      correct: false,
      drugName: hiddenDrug.names.en,
      score: 0,
      xpEarned: 0,
      cluesUsed: revealedCluesCount
    });
  };

  if (!hiddenDrug) {
    return <div style={styles.loading}>{currentLang === 'en' ? 'Loading game...' : 'Chargement du jeu...'}</div>;
  }

  if (result) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={onBack}>
            ← {currentLang === 'en' ? 'Back' : 'Retour'}
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.resultCard}>
            <h2 style={styles.resultTitle}>
              {result.correct ? '🎉 Correct!' : '❌ Game Over'}
            </h2>
            <p style={styles.resultDrug}>{result.drugName}</p>
            {result.correct && (
              <div style={styles.scoreBreakdown}>
                <p><strong>{currentLang === 'en' ? 'Score:' : 'Score:'}</strong> {result.score} pts</p>
                <p><strong>{currentLang === 'en' ? 'XP Earned:' : 'XP Gagné:'}</strong> {result.xpEarned}</p>
                <p><strong>{currentLang === 'en' ? 'Clues Used:' : 'Indices Utilisés:'}</strong> {result.cluesUsed}/8</p>
              </div>
            )}
            <button style={styles.continueButton} onClick={onBack}>
              {currentLang === 'en' ? 'Play Again' : 'Rejouer'}
            </button>
          </div>
        </div>
      </div>
    );
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
        {/* GUESS SECTION - TOP */}
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

        {/* CLUES SECTION */}
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
    background: 'rgba(22, 124, 128, 0.1)',
    border: '2px solid #B89A5A',
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
    background: 'rgba(22, 124, 128, 0.1)',
    border: '1px solid #167C80',
    color: '#167C80',
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
    background: 'rgba(22, 124, 128, 0.05)',
    border: '2px solid #167C80',
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
    border: '1px solid rgba(22, 124, 128, 0.2)',
    borderRadius: '8px',
    padding: '15px',
    borderLeft: '3px solid #167C80'
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
  },
  resultCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid #B89A5A',
    borderRadius: '10px',
    padding: '30px',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '50px auto'
  },
  resultTitle: {
    color: '#2F7D5B',
    fontSize: '32px',
    margin: '0 0 15px 0',
    fontFamily: "'Playfair Display', serif"
  },
  resultDrug: {
    color: '#B89A5A',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 20px 0'
  },
  scoreBreakdown: {
    background: 'rgba(22, 124, 128, 0.1)',
    border: '1px solid rgba(22, 124, 128, 0.2)',
    borderRadius: '6px',
    padding: '15px',
    marginBottom: '20px'
  },
  continueButton: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #B89A5A, #D4AE69)',
    color: '#0B0D0D',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: '700'
  }
};

export default MainGame;