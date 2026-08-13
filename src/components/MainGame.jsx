import React, { useState, useEffect } from 'react';
import { pickRandomDrug, getClues, checkGuess, calculateScore, getDrugsByClass } from '../utils/gameLogic.js';

const MainGame = ({ drugs, selectedClass, gameMode, onGameEnd, onBack }) => {
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [allClues, setAllClues] = useState([]);
  const [cluesRevealed, setCluesRevealed] = useState(3);
  const [userGuess, setUserGuess] = useState('');
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [message, setMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [drugs, selectedClass, gameMode]);

  const initializeGame = () => {
    // Guard: make sure drugs are loaded
    if (!drugs || drugs.length === 0) {
      console.log('Drugs not loaded yet');
      return;
    }

    // Guard: in KNOWN mode, make sure we have a selected class
    if (gameMode !== 'blind' && !selectedClass) {
      console.log('No drug class selected');
      return;
    }

    // Determine which drugs to pick from
    const filteredDrugs = gameMode === 'blind' 
      ? drugs 
      : getDrugsByClass(drugs, selectedClass);

    // Guard: make sure we have drugs to pick from
    if (filteredDrugs.length === 0) {
      console.log('No drugs in filtered array');
      setMessage('No drugs available in this class');
      return;
    }

    // Pick random drug
    const drug = pickRandomDrug(filteredDrugs);
    
    if (drug && drug.names && drug.names.en) {
      setSelectedDrug(drug);
      setAllClues(getClues(drug, gameMode));
      setCluesRevealed(3);
      setMultipleChoiceOptions([]);
      setWrongGuesses(0);
      setUserGuess('');
      setMessage('');
      setGameStarted(true);
    }
  };

  // Generate multiple choice options when all clues are revealed
  useEffect(() => {
    if (cluesRevealed >= allClues.length && selectedDrug && drugs.length > 0) {
      generateMultipleChoice();
    }
  }, [cluesRevealed, allClues, selectedDrug, drugs]);

  const generateMultipleChoice = () => {
    if (!selectedDrug || drugs.length < 5) return;

    // Get 4 random wrong drugs
    const wrongDrugs = drugs
      .filter(d => d.id !== selectedDrug.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    // Combine with correct drug and shuffle
    const options = [...wrongDrugs, selectedDrug].sort(() => Math.random() - 0.5);
    setMultipleChoiceOptions(options);
  };

  const handleSubmitGuess = () => {
    if (!userGuess.trim()) {
      setMessage('Please enter a drug name');
      return;
    }

    if (!selectedDrug) {
      setMessage('Error: Drug not loaded');
      return;
    }

    // Check if guess is correct
    if (checkGuess(userGuess, selectedDrug)) {
      const score = calculateScore(cluesRevealed);
      onGameEnd({
        won: true,
        drugName: selectedDrug.names.en,
        cluesUsed: cluesRevealed,
        score: score,
        gavUp: false
      });
    } else {
      // Wrong guess - reveal next clue
      setWrongGuesses(wrongGuesses + 1);
      setMessage('❌ Wrong! Here\'s another clue...');
      setUserGuess('');

      setTimeout(() => {
        if (cluesRevealed < allClues.length) {
          setCluesRevealed(cluesRevealed + 1);
          setMessage('');
        } else {
          setMessage('No more clues! Use multiple choice or give up.');
        }
      }, 500);
    }
  };

  const handleMultipleChoiceGuess = (drug) => {
    if (!selectedDrug) return;

    if (drug.id === selectedDrug.id) {
      const score = calculateScore(cluesRevealed);
      onGameEnd({
        won: true,
        drugName: selectedDrug.names.en,
        cluesUsed: cluesRevealed,
        score: score,
        gavUp: false
      });
    } else {
      setMessage('❌ Wrong choice! Try again.');
      generateMultipleChoice(); // Generate new options
    }
  };

  const handleGiveUp = () => {
    onGameEnd({
      won: false,
      drugName: selectedDrug?.names.en || 'Unknown',
      cluesUsed: cluesRevealed,
      score: 0,
      gavUp: true
    });
  };

  if (!gameStarted || !selectedDrug) {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>
        <div style={styles.loadingBox}>
          <p style={styles.loadingText}>Loading game...</p>
        </div>
      </div>
    );
  }

  const showMultipleChoice = cluesRevealed >= allClues.length && multipleChoiceOptions.length > 0;
  const visibleClues = allClues.slice(0, cluesRevealed);

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={onBack}>← Back</button>

      <div style={styles.gameContainer}>
        {/* LEFT SIDE - CLUES */}
        <div style={styles.cluesBox}>
          <h2 style={styles.cluesTitle}>
            {gameMode === 'blind' ? '🔍 BLIND MODE' : '📚 KNOWN CLASS MODE'}
          </h2>
          
          <div style={styles.gameMode}>
            <span style={styles.modeLabel}>Game Mode:</span>
            <span style={styles.modeValue}>
              {gameMode === 'blind' ? 'No Class Hints' : selectedClass}
            </span>
          </div>

          <div style={styles.statsBox}>
            <div style={styles.stat}>
              <span>Clues Used:</span>
              <strong>{cluesRevealed}/{allClues.length}</strong>
            </div>
            <div style={styles.stat}>
              <span>Wrong Guesses:</span>
              <strong>{wrongGuesses}</strong>
            </div>
          </div>

          <div style={styles.cluesList}>
            <h3 style={styles.cluesListTitle}>📋 Clues</h3>
            {visibleClues.map((clue, idx) => (
              <div key={idx} style={styles.clueItem}>
                <span style={styles.clueNumber}>{idx + 1}.</span>
                <span style={styles.clueText}>{clue}</span>
              </div>
            ))}
            
            {cluesRevealed < allClues.length && (
              <div style={styles.hiddenClue}>
                🔒 {allClues.length - cluesRevealed} more clues available
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - GUESS */}
        <div style={styles.guessBox}>
          <h2 style={styles.guessTitle}>🎯 Your Guess</h2>

          {!showMultipleChoice ? (
            <>
              <input
                type="text"
                placeholder="Enter drug name..."
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitGuess()}
                style={styles.input}
                autoFocus
              />

              <button style={styles.submitButton} onClick={handleSubmitGuess}>
                ✓ Submit Guess
              </button>

              {allClues.length > cluesRevealed && (
                <button 
                  style={styles.revealButton}
                  onClick={() => setCluesRevealed(cluesRevealed + 1)}
                >
                  💡 Reveal Next Clue
                </button>
              )}
            </>
          ) : (
            <>
              <p style={styles.multipleChoiceText}>Choose the drug:</p>
              <div style={styles.multipleChoiceGrid}>
                {multipleChoiceOptions.map((option) => (
                  <button
                    key={option.id}
                    style={styles.multipleChoiceButton}
                    onClick={() => handleMultipleChoiceGuess(option)}
                  >
                    <div style={styles.mcDrugName}>{option.names.en}</div>
                    <div style={styles.mcDrugNameFr}>{option.names.fr}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          <button style={styles.giveUpButton} onClick={handleGiveUp}>
            🏳️ Give Up
          </button>

          {message && (
            <div style={{
              ...styles.messageBox,
              backgroundColor: message.includes('❌') 
                ? 'rgba(255, 71, 87, 0.1)' 
                : 'rgba(0, 208, 132, 0.1)',
              borderColor: message.includes('❌') 
                ? 'var(--danger)' 
                : 'var(--accent-emerald)',
              color: message.includes('❌') 
                ? 'var(--danger)' 
                : 'var(--accent-emerald)'
            }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '30px',
    position: 'relative',
    zIndex: 10
  },
  backButton: {
    padding: '10px 20px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid var(--border-glow)',
    color: 'var(--text-primary)',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontFamily: 'inherit',
    fontSize: '14px'
  },
  loadingBox: {
    textAlign: 'center',
    padding: '50px',
    color: 'var(--text-secondary)'
  },
  loadingText: {
    fontSize: '18px'
  },
  gameContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  cluesBox: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--border-glow)',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 0 30px rgba(0, 217, 255, 0.15)'
  },
  cluesTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    color: 'var(--accent-gold)',
    margin: '0 0 20px 0'
  },
  gameMode: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    background: 'rgba(0, 217, 255, 0.05)',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '13px'
  },
  modeLabel: {
    color: 'var(--text-secondary)'
  },
  modeValue: {
    color: 'var(--accent-gold)',
    fontWeight: '700'
  },
  statsBox: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '20px'
  },
  stat: {
    padding: '12px',
    background: 'rgba(212, 175, 55, 0.1)',
    borderRadius: '8px',
    fontSize: '13px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cluesList: {
    maxHeight: '500px',
    overflowY: 'auto'
  },
  cluesListTitle: {
    fontSize: '14px',
    color: 'var(--accent-gold)',
    margin: '0 0 15px 0'
  },
  clueItem: {
    padding: '12px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '8px',
    marginBottom: '10px',
    fontSize: '13px',
    display: 'flex',
    gap: '10px'
  },
  clueNumber: {
    color: 'var(--accent-gold)',
    fontWeight: '700',
    minWidth: '20px'
  },
  clueText: {
    color: 'var(--text-primary)',
    lineHeight: '1.4'
  },
  hiddenClue: {
    padding: '12px',
    background: 'rgba(255, 71, 87, 0.05)',
    border: '1px solid rgba(255, 71, 87, 0.2)',
    borderRadius: '8px',
    color: 'var(--danger)',
    fontSize: '12px',
    textAlign: 'center'
  },
  guessBox: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 0 30px rgba(212, 175, 55, 0.15)'
  },
  guessTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    color: 'var(--accent-gold)',
    margin: '0 0 20px 0'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '16px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  revealButton: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    background: 'rgba(0, 208, 132, 0.1)',
    border: '1px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit'
  },
  multipleChoiceText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '15px',
    textAlign: 'center'
  },
  multipleChoiceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '15px'
  },
  multipleChoiceButton: {
    padding: '15px',
    background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(0, 217, 255, 0.05) 100%)',
    border: '2px solid var(--border-glow)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  },
  mcDrugName: {
    fontWeight: '700',
    color: 'var(--accent-gold)',
    marginBottom: '4px',
    fontSize: '14px'
  },
  mcDrugNameFr: {
    fontSize: '11px',
    color: 'var(--text-secondary)'
  },
  giveUpButton: {
    width: '100%',
    padding: '10px',
    background: 'rgba(255, 71, 87, 0.1)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit'
  },
  messageBox: {
    marginTop: '15px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '13px',
    textAlign: 'center',
    fontWeight: '600'
  }
};

export default MainGame;