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

  useEffect(() => {
    initializeGame();
  }, [drugs, selectedClass, gameMode]);

  const initializeGame = () => {
    if (!drugs || drugs.length === 0) {
      console.log('Drugs not loaded yet');
      return;
    }

    if (gameMode !== 'blind' && !selectedClass) {
      console.log('No drug class selected');
      return;
    }

    const filteredDrugs = gameMode === 'blind' 
      ? drugs 
      : drugs.filter(d => d.class === selectedClass);

    if (filteredDrugs.length === 0) {
      console.log('No drugs in filtered array');
      setMessage('No drugs available in this class');
      return;
    }

    const drug = filteredDrugs[Math.floor(Math.random() * filteredDrugs.length)];
    
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

  useEffect(() => {
    if (cluesRevealed >= allClues.length && selectedDrug && drugs.length > 0) {
      generateMultipleChoice();
    }
  }, [cluesRevealed, allClues, selectedDrug, drugs]);

  const generateMultipleChoice = () => {
    if (!selectedDrug || drugs.length < 5) return;

    const wrongDrugs = drugs
      .filter(d => d.id !== selectedDrug.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

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
      setWrongGuesses(wrongGuesses + 1);
      setMessage('❌ Wrong! Try again...');
      setUserGuess('');

      setTimeout(() => {
        if (cluesRevealed < allClues.length) {
          setCluesRevealed(cluesRevealed + 1);
          setMessage('');
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
      setMessage('❌ Wrong! Try again.');
      generateMultipleChoice();
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
          <h2 style={styles.title}>
            {gameMode === 'blind' ? '🔍 BLIND MODE' : '📚 ' + selectedClass}
          </h2>
          
          <div style={styles.statsBox}>
            <div style={styles.stat}>Clues: {cluesRevealed}/{allClues.length}</div>
            <div style={styles.stat}>Wrong: {wrongGuesses}</div>
          </div>

          <div style={styles.cluesList}>
            {visibleClues.map((clue, idx) => (
              <div key={idx} style={styles.clueItem}>
                <span style={styles.clueNum}>{idx + 1}.</span>
                <span style={styles.clueText}>{clue}</span>
              </div>
            ))}
            
            {cluesRevealed < allClues.length && (
              <div style={styles.hiddenClue}>
                🔒 {allClues.length - cluesRevealed} more clues
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - GUESS */}
        <div style={styles.guessBox}>
          <h2 style={styles.title}>🎯 Guess</h2>

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
                ✓ Submit
              </button>

              {allClues.length > cluesRevealed && (
                <button 
                  style={styles.revealButton}
                  onClick={() => setCluesRevealed(cluesRevealed + 1)}
                >
                  💡 Reveal Clue
                </button>
              )}
            </>
          ) : (
            <>
              <p style={styles.mcText}>Choose the drug:</p>
              <div style={styles.mcGrid}>
                {multipleChoiceOptions.map((option) => (
                  <button
                    key={option.id}
                    style={styles.mcButton}
                    onClick={() => handleMultipleChoiceGuess(option)}
                  >
                    <div style={styles.mcName}>{option.names.en}</div>
                    <div style={styles.mcClass}>{option.class}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          <button style={styles.giveUpButton} onClick={handleGiveUp}>
            🏳️ Give Up
          </button>

          {message && <div style={styles.messageBox}>{message}</div>}
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
    zIndex: 10,
    overflow: 'hidden'
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid var(--border-glow)',
    color: 'var(--text-primary)',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '15px',
    fontFamily: 'inherit',
    fontSize: '12px'
  },
  loadingBox: {
    textAlign: 'center',
    padding: '50px',
    color: 'var(--text-secondary)'
  },
  loadingText: {
    fontSize: '16px'
  },
  gameContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  cluesBox: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--border-glow)',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 0 20px rgba(0, 217, 255, 0.1)'
  },
  guessBox: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 0 20px rgba(212, 175, 55, 0.15)'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    color: 'var(--accent-gold)',
    margin: '0 0 12px 0'
  },
  statsBox: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '12px'
  },
  stat: {
    padding: '8px',
    background: 'rgba(212, 175, 55, 0.1)',
    borderRadius: '6px',
    fontSize: '12px',
    textAlign: 'center'
  },
  cluesList: {
    maxHeight: '400px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  clueItem: {
    padding: '8px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '6px',
    fontSize: '12px',
    display: 'flex',
    gap: '6px'
  },
  clueNum: {
    color: 'var(--accent-gold)',
    fontWeight: '700',
    minWidth: '16px'
  },
  clueText: {
    color: 'var(--text-primary)',
    lineHeight: '1.3'
  },
  hiddenClue: {
    padding: '8px',
    background: 'rgba(255, 71, 87, 0.05)',
    border: '1px solid rgba(255, 71, 87, 0.2)',
    borderRadius: '6px',
    color: 'var(--danger)',
    fontSize: '11px',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '8px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  submitButton: {
    width: '100%',
    padding: '10px',
    marginBottom: '8px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit'
  },
  revealButton: {
    width: '100%',
    padding: '8px',
    marginBottom: '8px',
    background: 'rgba(0, 208, 132, 0.1)',
    border: '1px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'inherit'
  },
  mcText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '10px',
    textAlign: 'center'
  },
  mcGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '8px',
    marginBottom: '8px'
  },
  mcButton: {
    padding: '10px',
    background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(0, 217, 255, 0.05) 100%)',
    border: '1px solid var(--border-glow)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left'
  },
  mcName: {
    fontWeight: '700',
    color: 'var(--accent-gold)',
    fontSize: '12px'
  },
  mcClass: {
    fontSize: '10px',
    color: 'var(--text-secondary)'
  },
  giveUpButton: {
    width: '100%',
    padding: '8px',
    background: 'rgba(255, 71, 87, 0.1)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'inherit'
  },
  messageBox: {
    marginTop: '8px',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid var(--danger)',
    fontSize: '11px',
    textAlign: 'center',
    color: 'var(--danger)',
    background: 'rgba(255, 71, 87, 0.1)'
  }
};

export default MainGame;