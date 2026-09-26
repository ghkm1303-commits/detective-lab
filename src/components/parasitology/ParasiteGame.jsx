import React, { useState, useEffect } from 'react';
import { checkGuess } from '../../utils/gameLogic';

const pickRandomOrganism = (list) => list[Math.floor(Math.random() * list.length)];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const ParasiteGame = ({ organisms, selectedClass, selectedLessons, gameMode, onGameEnd, onBack, currentLang }) => {
  const [hiddenOrganism, setHiddenOrganism] = useState(null);
  const [pool, setPool] = useState([]);
  const [allClues, setAllClues] = useState([]);
  const [revealedCluesCount, setRevealedCluesCount] = useState(1);
  const [guess, setGuess] = useState('');
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [choices, setChoices] = useState(null);

  const lang = currentLang === 'fr' ? 'fr' : 'en';

  useEffect(() => {
    let filteredPool;

    if (selectedLessons && selectedLessons.length > 0) {
      filteredPool = organisms.filter(o => selectedLessons.includes(o.lessonId));
    } else {
      filteredPool = organisms.filter(o => o.category !== 'entomology' && o.category !== 'overview');
      if (selectedClass) {
        filteredPool = filteredPool.filter(o => o.category === selectedClass);
      }
    }

    if (filteredPool.length > 0) {
      const organism = pickRandomOrganism(filteredPool);
      setHiddenOrganism(organism);
      setPool(filteredPool);
      setChoices(null);
      setWrongGuesses(0);

      const clinicalLabel = currentLang === 'en' ? 'Clinical' : 'Clinique';
      const transmissionLabel = currentLang === 'en' ? 'Transmission' : 'Transmission';
      const lifecycleLabel = currentLang === 'en' ? 'Life cycle' : 'Cycle de vie';
      const classLabel = currentLang === 'en' ? 'Class' : 'Classe';
      const diagnosisLabel = currentLang === 'en' ? 'Diagnosis' : 'Diagnostic';
      const treatmentLabel = currentLang === 'en' ? 'Treatment' : 'Traitement';
      const geoLabel = currentLang === 'en' ? 'Geographic distribution' : 'Répartition géographique';
      const eosinoLabel = currentLang === 'en' ? 'Eosinophilia' : 'Hyperéosinophilie';

      const clues = [
        `${clinicalLabel}: ${organism.clinicalManifestations[lang][0]}`,
        `${transmissionLabel}: ${organism.transmission[lang]}`,
        `${lifecycleLabel}: ${organism.lifecycle[lang].substring(0, 70)}...`,
        `${classLabel}: ${organism.class[lang]}`,
        `${diagnosisLabel}: ${organism.diagnosis[lang].substring(0, 60)}...`,
        `${treatmentLabel}: ${organism.treatment[lang].substring(0, 60)}...`,
        `${geoLabel}: ${organism.geographicDistribution[lang]}`,
        `${eosinoLabel}: ${organism.eosinophilia ? (currentLang === 'en' ? 'Yes' : 'Oui') : (currentLang === 'en' ? 'No' : 'Non')}`
      ];
      setAllClues(clues);
      setRevealedCluesCount(1);
    }
  }, [organisms, selectedClass, selectedLessons, gameMode, currentLang]);

  const buildChoices = () => {
    const others = pool.filter(o => o !== hiddenOrganism);
    const wrongOptions = shuffle(others).slice(0, 3).map(o =>
      currentLang === 'en' ? o.names.en : o.names.fr
    );
    const correctOption = currentLang === 'en' ? hiddenOrganism.names.en : hiddenOrganism.names.fr;
    setChoices(shuffle([correctOption, ...wrongOptions]));
  };

  const finishGame = (correct, cluesUsed) => {
    const score = correct ? Math.max(100, 1000 - (cluesUsed * 100)) : 0;
    const xpEarned = correct ? Math.max(score - 300, 0) : 0;
    onGameEnd({
      correct,
      drugName: hiddenOrganism.names.en,
      drugClass: hiddenOrganism.class[lang],
      score,
      xpEarned,
      cluesUsed
    });
  };

  const handleGuess = () => {
    if (!guess.trim() || !hiddenOrganism) return;

    const isCorrect = checkGuess(guess, hiddenOrganism);

    if (isCorrect) {
      finishGame(true, revealedCluesCount);
      return;
    }

    const newWrongCount = wrongGuesses + 1;
    setWrongGuesses(newWrongCount);
    setGuess('');

    if (revealedCluesCount < allClues.length) {
      setRevealedCluesCount(revealedCluesCount + 1);
    } else {
      buildChoices();
    }
  };

  const handleChoiceClick = (choice) => {
    const isCorrect = checkGuess(choice, hiddenOrganism);
    finishGame(isCorrect, allClues.length);
  };

  const handleGiveUp = () => {
    finishGame(false, revealedCluesCount);
  };

  if (!hiddenOrganism) {
    return <div style={styles.loading}>{currentLang === 'en' ? 'Loading game...' : 'Chargement du jeu...'}</div>;
  }

  const revealedClues = allClues.slice(0, revealedCluesCount);

  const modeLabel = gameMode === 'blind'
    ? '🔍 Blind'
    : gameMode === 'byLesson'
      ? (currentLang === 'en' ? '📖 By Lesson' : '📖 Par Leçon')
      : '📚 Focused';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <h2 style={styles.gameTitle}>🦠 Parasitology Lab</h2>
        <div style={styles.modeIndicator}>
          {modeLabel}
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.guessSection}>
          {choices ? (
            <>
              <h3 style={styles.guessTitle}>
                {currentLang === 'en' ? 'Choose the correct organism:' : 'Choisissez le bon organisme:'}
              </h3>
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
              <h3 style={styles.guessTitle}>
                {currentLang === 'en' ? 'What organism is it?' : 'Quel organisme est-ce?'}
              </h3>
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                placeholder={currentLang === 'en' ? 'Enter organism name...' : "Entrez le nom de l'organisme..."}
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
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '16px' },
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

export default ParasiteGame;