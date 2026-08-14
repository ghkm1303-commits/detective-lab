import React, { useState } from 'react';

const PracticeMode = ({ drugs, onBack }) => {
  const [screen, setScreen] = useState('start');
  const [conversation, setConversation] = useState([]);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [aiGuesses, setAiGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(null);

  const questions = [
    'Is it a cardiac drug?',
    'Is it an antibiotic?',
    'Is it for pain relief?',
    'Is it taken orally?',
    'Does it start with a vowel?',
    'Is it a controlled substance?',
    'Is it for diabetes?',
    'Does it affect blood pressure?',
    'Is it a hormone?',
    'Is it for emergencies?',
    'Is it from the 20th century?',
    'Has more than 10 letters?',
    'Is it for respiratory?',
    'Is it a vitamin?',
    'Contains letter "a"?'
  ];

  const handleStart = () => {
    setConversation([{
      role: 'ai',
      text: '🔮 Think of a drug. I will ask yes/no questions to guess it!'
    }]);
    askNextQuestion();
    setScreen('playing');
  };

  const askNextQuestion = () => {
    if (questionsAsked >= questions.length) {
      setConversation(prev => [...prev, {
        role: 'ai',
        text: 'I ran out of questions! What was it?'
      }]);
      return;
    }
    const question = questions[questionsAsked];
    setConversation(prev => [...prev, { role: 'ai', text: question }]);
  };

  const handleAnswer = (answer) => {
    const text = answer === 'yes' ? 'Yes ✓' : 'No ✗';
    setConversation(prev => [...prev, { role: 'user', text }]);
    setQuestionsAsked(questionsAsked + 1);

    if ((questionsAsked + 1) % 3 === 0 && aiGuesses.length < 5) {
      setTimeout(() => makeAGuess(), 800);
    } else {
      setTimeout(() => askNextQuestion(), 400);
    }
  };

  const makeAGuess = () => {
    const available = drugs.filter(d => !aiGuesses.includes(d.names.en));
    if (available.length === 0) {
      setConversation(prev => [...prev, { role: 'ai', text: 'I give up! What was it?' }]);
      return;
    }
    const guess = available[Math.floor(Math.random() * available.length)];
    setCurrentGuess(guess);
    setAiGuesses([...aiGuesses, guess.names.en]);
    setScreen('guessing');
  };

  const handleGuessResponse = (isCorrect) => {
    if (isCorrect) {
      setConversation(prev => [...prev, {
        role: 'ai',
        text: `🎉 Got it! ${currentGuess.names.en} in ${questionsAsked} questions!`
      }]);
      setScreen('result');
    } else {
      setConversation(prev => [...prev, { role: 'ai', text: 'Wrong! More questions...' }]);
      setScreen('playing');
      setTimeout(() => askNextQuestion(), 400);
    }
  };

  if (screen === 'start') {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>
        <div style={styles.startBox}>
          <div style={styles.icon}>🔮</div>
          <h1 style={styles.title}>AKINATOR MODE</h1>
          <p style={styles.desc}>Think of a drug. Answer yes/no questions!</p>
          <button style={styles.startButton} onClick={handleStart}>🎮 START</button>
        </div>
      </div>
    );
  }

  if (screen === 'playing' || screen === 'guessing') {
    return (
      <div style={styles.playingContainer}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>

        <div style={styles.gameWrapper}>
          {/* LEFT - CONVERSATION */}
          <div style={styles.conversationBox}>
            <h2 style={styles.heading}>💬 Questions</h2>
            <div style={styles.conversationLog}>
              {conversation.map((msg, idx) => (
                <div key={idx} style={{
                  ...styles.message,
                  background: msg.role === 'ai' ? 'rgba(0, 217, 255, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                  borderColor: msg.role === 'ai' ? 'var(--border-glow)' : 'var(--accent-gold)'
                }}>
                  <span style={{ fontWeight: '700', marginRight: '6px', fontSize: '14px' }}>
                    {msg.role === 'ai' ? '🤖' : '👤'}
                  </span>
                  <span style={{ fontSize: '11px', lineHeight: '1.3' }}>{msg.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - ANSWER */}
          <div style={styles.answerBox}>
            {screen === 'playing' && (
              <>
                <h2 style={styles.heading}>Answer</h2>
                <div style={styles.statsContainer}>
                  <div style={styles.statItem}>Q: <strong>{questionsAsked}</strong></div>
                  <div style={styles.statItem}>Guesses: <strong>{aiGuesses.length}</strong></div>
                </div>

                {aiGuesses.length > 0 && (
                  <div style={styles.guessesBox}>
                    <p style={styles.guessesTxt}>🎯 AI Guesses:</p>
                    <div style={styles.guessesList}>
                      {aiGuesses.map((g, i) => (
                        <div key={i} style={styles.guessTag}>{g}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={styles.buttonContainer}>
                  <button 
                    style={styles.yesBtn} 
                    onClick={() => handleAnswer('yes')}
                  >
                    ✅ YES
                  </button>
                  <button 
                    style={styles.noBtn} 
                    onClick={() => handleAnswer('no')}
                  >
                    ❌ NO
                  </button>
                </div>
              </>
            )}

            {screen === 'guessing' && currentGuess && (
              <>
                <h2 style={styles.heading}>Is it...?</h2>
                <div style={styles.guessCard}>
                  <div style={styles.gName}>{currentGuess.names.en}</div>
                  <div style={styles.gNameFr}>{currentGuess.names.fr}</div>
                  <div style={styles.gClass}>{currentGuess.class}</div>
                </div>

                <div style={styles.buttonContainer}>
                  <button 
                    style={styles.yesBtn}
                    onClick={() => handleGuessResponse(true)}
                  >
                    ✅ YES!
                  </button>
                  <button 
                    style={styles.noBtn}
                    onClick={() => handleGuessResponse(false)}
                  >
                    ❌ NO
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div style={styles.container}>
        <div style={styles.resultBox}>
          <div style={styles.resultIcon}>🎉</div>
          <h1 style={styles.resultTitle}>GOT IT!</h1>
          <p style={styles.resultText}>
            {currentGuess.names.en}<br/>
            in {questionsAsked} questions
          </p>
          <div style={styles.resultDetails}>
            <p><strong>{currentGuess.class}</strong></p>
          </div>
          <button 
            style={styles.playAgainBtn} 
            onClick={() => {
              setScreen('start');
              setConversation([]);
              setQuestionsAsked(0);
              setAiGuesses([]);
              setCurrentGuess(null);
            }}
          >
            🔄 Play Again
          </button>
          <button style={styles.homeBtn} onClick={onBack}>🏠 Back</button>
        </div>
      </div>
    );
  }
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '15px',
    position: 'relative',
    zIndex: 10,
    overflow: 'hidden'
  },
  playingContainer: {
    minHeight: '100vh',
    padding: '15px',
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid var(--border-glow)',
    color: 'var(--text-primary)',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '12px',
    fontFamily: 'inherit',
    fontSize: '12px',
    alignSelf: 'flex-start'
  },
  startBox: {
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '30px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '12px'
  },
  icon: {
    fontSize: '60px',
    marginBottom: '15px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 10px 0'
  },
  desc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '20px'
  },
  startButton: {
    padding: '12px 30px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    width: '100%'
  },
  gameWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    flex: 1,
    minHeight: 0,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  conversationBox: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '1px solid var(--border-glow)',
    borderRadius: '10px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0
  },
  heading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '16px',
    color: 'var(--accent-gold)',
    margin: '0 0 10px 0',
    flexShrink: 0
  },
  conversationLog: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    overflowY: 'auto',
    flex: 1,
    minHeight: 0
  },
  message: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid',
    fontSize: '11px',
    lineHeight: '1.3',
    display: 'flex',
    gap: '4px',
    flexShrink: 0
  },
  answerBox: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '10px',
    flexShrink: 0
  },
  statItem: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    padding: '6px',
    background: 'rgba(0, 217, 255, 0.05)',
    borderRadius: '4px',
    textAlign: 'center'
  },
  guessesBox: {
    padding: '8px',
    background: 'rgba(212, 175, 55, 0.05)',
    borderRadius: '6px',
    marginBottom: '10px',
    flexShrink: 0,
    maxHeight: '120px',
    overflowY: 'auto'
  },
  guessesTxt: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    margin: '0 0 4px 0',
    fontWeight: '600'
  },
  guessesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  guessTag: {
    fontSize: '10px',
    padding: '3px 6px',
    background: 'rgba(212, 175, 55, 0.2)',
    color: 'var(--accent-gold)',
    borderRadius: '3px'
  },
  guessCard: {
    padding: '12px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid var(--border-glow)',
    borderRadius: '6px',
    marginBottom: '10px',
    textAlign: 'center',
    flexShrink: 0
  },
  gName: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    marginBottom: '2px'
  },
  gNameFr: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    marginBottom: '4px'
  },
  gClass: {
    fontSize: '10px',
    color: 'var(--accent-emerald)',
    fontWeight: '600'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flexShrink: 0
  },
  yesBtn: {
    padding: '12px',
    background: 'rgba(0, 208, 132, 0.15)',
    border: '2px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit',
    minHeight: '44px'
  },
  noBtn: {
    padding: '12px',
    background: 'rgba(255, 71, 87, 0.15)',
    border: '2px solid var(--danger)',
    color: 'var(--danger)',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit',
    minHeight: '44px'
  },
  resultBox: {
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '40px 20px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '12px'
  },
  resultIcon: {
    fontSize: '60px',
    marginBottom: '15px'
  },
  resultTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 10px 0'
  },
  resultText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '15px',
    lineHeight: '1.5'
  },
  resultDetails: {
    padding: '10px',
    background: 'rgba(0, 217, 255, 0.05)',
    borderRadius: '6px',
    marginBottom: '15px'
  },
  playAgainBtn: {
    width: '100%',
    padding: '12px',
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
  homeBtn: {
    width: '100%',
    padding: '12px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid var(--border-glow)',
    color: 'var(--border-glow)',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit'
  }
};

export default PracticeMode;