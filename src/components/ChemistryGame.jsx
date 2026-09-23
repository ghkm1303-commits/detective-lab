import React, { useState, useEffect } from 'react';
import { checkGuess } from '../utils/gameLogic';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

// gameMode: 'therapeuticClass' | 'medication' | 'combined'
const ChemistryGame = ({ classes, drugs, gameMode, selectedClassIds, onGameEnd, onBack, currentLang }) => {
  const [questionType, setQuestionType] = useState(null); // 'class' | 'drug'
  const [hiddenItem, setHiddenItem] = useState(null);
  const [choicePool, setChoicePool] = useState([]);
  const [allClues, setAllClues] = useState([]);
  const [revealedCluesCount, setRevealedCluesCount] = useState(1);
  const [guess, setGuess] = useState('');
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [choices, setChoices] = useState(null);

  const relevantClasses = selectedClassIds && selectedClassIds.length > 0
    ? classes.filter(c => selectedClassIds.includes(c.id))
    : classes;

  const startRound = () => {
    let type;
    if (gameMode === 'therapeuticClass') type = 'class';
    else if (gameMode === 'medication') type = 'drug';
    else type = Math.random() < 0.5 ? 'class' : 'drug';

    setChoices(null);
    setWrongGuesses(0);
    setQuestionType(type);

    if (type === 'class') {
      const pool = relevantClasses;
      if (pool.length === 0) { setHiddenItem(null); return; }
      const item = pickRandom(pool);
      setHiddenItem(item);
      setChoicePool(pool);
      setAllClues(item.clues || []);
    } else {
      const relevantDrugs = drugs.filter(d => relevantClasses.some(c => c.id === d.classId));
      if (relevantDrugs.length === 0) { setHiddenItem(null); return; }
      const item = pickRandom(relevantDrugs);
      const sameClassDrugs = drugs.filter(d => d.classId === item.classId);
      setHiddenItem(item);
      setChoicePool(sameClassDrugs);
      setAllClues(item.clues || []);
    }
    setRevealedCluesCount(1);
  };

  useEffect(() => {
    startRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes, drugs, gameMode, selectedClassIds]);

  const buildChoices = () => {
    const others = choicePool.filter(x => x !== hiddenItem);
    const wrongOptions = shuffle(others).slice(0, 3).map(x =>
      currentLang === 'en' ? x.names.en : x.names.fr
    );
    const correctOption = currentLang === 'en' ? hiddenItem.names.en : hiddenItem.names.fr;
    setChoices(shuffle([correctOption, ...wrongOptions]));
  };

  const finishGame = (correct, cluesUsed) => {
    const score = correct ? Math.max(100, 1000 - (cluesUsed * 100)) : 0;
    const xpEarned = correct ? Math.max(score - 300, 0) : 0;
    onGameEnd({
      correct,
      drugName: hiddenItem.names.en,
      drugClass: questionType === 'class' ? hiddenItem.names.en : hiddenItem.classId,
      score,
      xpEarned,
      cluesUsed
    });
  };

  const handleGuess = () => {
    if (!guess.trim() || !hiddenItem) return;
    const isCorrect = checkGuess(guess, hiddenItem);

    if (isCorrect) {
      finishGame(true, revealedCluesCount);
      return;
    }

    setWrongGuesses(w => w + 1);
    setGuess('');

    if (revealedCluesCount < allClues.length) {
      setRevealedCluesCount(revealedCluesCount + 1);
    } else {
      buildChoices();
    }
  };

  const handleChoiceClick = (choice) => {
    const isCorrect = checkGuess(choice, hiddenItem);
    finishGame(isCorrect, allClues.length);
  };

  const handleGiveUp = () => {
    finishGame(false, revealedCluesCount);
  };

  if (!hiddenItem) {
    return (
      <div style={styles.loading}>
        <button style={styles.backButton} onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <p style={{ marginTop: '20px' }}>
          {currentLang === 'en'
            ? 'No data added yet for this selection.'
            : "Aucune donnée n'a encore été ajoutée pour cette sélection."}
        </p>
      </div>
    );
  }

  const revealedClues = allClues.slice(0, revealedCluesCount);
  const questionLabel = questionType === 'class'
    ? (currentLang === 'en' ? 'What therapeutic class is it?' : 'Quelle classe thérapeutique est-ce?')
    : (currentLang === 'en' ? 'What drug is it?' : 'Quel médicament est-ce?');
  const chooseLabel = questionType === 'class'
    ? (currentLang === 'en' ? 'Choose the correct class:' : 'Choisissez la bonne classe:')
    : (currentLang === 'en' ? 'Choose the correct drug:' : 'Choisissez le bon médicament:');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <h2 style={styles.gameTitle}>💊 Chimie Thérapeutique Lab</h2>
        <div style={styles.modeIndicator}>
          {questionType === 'class' ? '🧬 Classe' : '💊 Médicament'}
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.guessSection}>
          {choices ? (
            <>
              <h3 style={styles.guessTitle}>{chooseLabel}</h3>
              <div style={styles.choicesGrid}>
                {choices.map((choice, idx) => (
                  <button key={idx} style={styles.choiceButton} onClick={() => handleChoiceClick(choice)}>
                    {choice}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 style={styles.guessTitle}>{questionLabel}</h3>
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                placeholder={currentLang === 'en' ? 'Type your answer...' : 'Tapez votre réponse...'}
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
            </>
          )}
        </div>

        <div style={styles.cluesSection}>
          <h3 style={styles.cluesTitle}>
            {currentLang === 'en' ? 'Available Clues' : 'Indices Disponibles'} ({revealedCluesCount}/{allClues.length})
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
  container: { minHeight: '100vh', padding: '15px', position: 'relative', zIndex: 10 },
  loading: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '16px', padding: '20px', textAlign: 'center' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid rgba(22, 124, 128, 0.2)',
    flexWrap: 'wrap', gap: '10px'
  },
  backButton: {
    padding: '8px 16px', background: 'transparent', border: '2px solid var(--accent-gold)',
    color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: '12px', fontWeight: '600'
  },
  gameTitle: { color: '#B89A5A', fontSize: '24px', margin: '0', fontFamily: "'Playfair Display', serif" },
  modeIndicator: {
    background: 'rgba(47, 125, 91, 0.1)', border: '1px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700'
  },
  content: { maxWidth: '900px', margin: '0 auto' },
  guessSection: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid #B89A5A', borderRadius: '10px', padding: '25px', marginBottom: '30px'
  },
  guessTitle: { color: '#B89A5A', fontSize: '18px', margin: '0 0 15px 0', fontFamily: "'Playfair Display', serif" },
  guessInput: {
    width: '100%', padding: '12px', background: 'rgba(47, 125, 91, 0.05)',
    border: '2px solid var(--accent-emerald)', color: 'var(--text-primary)', borderRadius: '6px',
    fontFamily: 'inherit', fontSize: '14px', marginBottom: '15px'
  },
  submitButton: {
    width: '100%', padding: '12px', background: 'linear-gradient(135deg, #167C80, #2F7D5B)',
    color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: '14px', fontWeight: '700'
  },
  errorMessage: { color: '#E63946', fontSize: '13px', marginTop: '10px' },
  choicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' },
  choiceButton: {
    padding: '14px', background: 'rgba(47, 125, 91, 0.08)', border: '2px solid var(--accent-emerald)',
    color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s ease'
  },
  cluesSection: { marginBottom: '30px' },
  cluesTitle: { color: '#B89A5A', fontSize: '18px', margin: '0 0 15px 0', fontFamily: "'Playfair Display', serif" },
  cluesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' },
  clueCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid rgba(47, 125, 91, 0.2)', borderRadius: '8px', padding: '15px',
    borderLeft: '3px solid var(--accent-emerald)'
  },
  clueNumber: { color: '#B89A5A', fontSize: '14px', fontWeight: '700', margin: '0 0 8px 0' },
  clueText: { color: 'var(--text-secondary)', fontSize: '13px', margin: '0' },
  clueButtonsSection: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  giveUpButton: {
    flex: 1, minWidth: '150px', padding: '12px', background: 'rgba(230, 57, 70, 0.1)',
    border: '2px solid #E63946', color: '#FF6B7A', borderRadius: '6px', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: '13px', fontWeight: '700'
  }
};

export default ChemistryGame;