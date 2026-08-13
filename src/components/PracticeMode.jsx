import React, { useState, useEffect } from 'react';
import { getAllClasses } from '../utils/gameLogic.js';

const PracticeMode = ({ drugs, onBack }) => {
  const [screen, setScreen] = useState('start'); // start, playing, guessed, result
  const [conversation, setConversation] = useState([]);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [aiGuesses, setAiGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [message, setMessage] = useState('');
  const [guessedCorrect, setGuessedCorrect] = useState(false);

  const questions = [
    'Is it a cardiac drug?',
    'Is it an antibiotic?',
    'Is it used for pain relief?',
    'Is it taken orally?',
    'Does it start with a vowel?',
    'Is it a controlled substance?',
    'Is it used for diabetes?',
    'Does it affect blood pressure?',
    'Is it a hormone?',
    'Is it used in emergency situations?',
    'Is it from the 20th century?',
    'Does it have more than 10 letters in its English name?',
    'Is it used for respiratory conditions?',
    'Is it a vitamin or mineral?',
    'Does it contain the letter "a" in its English name?'
  ];

  // Start the game
  const handleStart = () => {
    setConversation([
      {
        role: 'ai',
        text: '🔮 Think of a drug and keep it in your mind. I will ask you yes/no questions to try and guess it! Ready? Let\'s begin!'
      }
    ]);
    askNextQuestion();
    setScreen('playing');
  };

  // Ask next question
  const askNextQuestion = () => {
    if (questionsAsked >= questions.length) {
      setConversation(prev => [...prev, {
        role: 'ai',
        text: 'I\'ve run out of questions! 😅 Want to tell me what drug it was?'
      }]);
      return;
    }

    const question = questions[questionsAsked];
    setConversation(prev => [...prev, {
      role: 'ai',
      text: question
    }]);
  };

  // Handle yes/no answer
  const handleAnswer = () => {
    if (!userResponse.trim()) {
      setMessage('Please answer yes or no');
      return;
    }

    const answer = userResponse.toLowerCase().trim();
    if (!['yes', 'no', 'y', 'n'].includes(answer)) {
      setMessage('Please answer with "yes" or "no"');
      return;
    }

    // Add answer to conversation
    const displayAnswer = answer === 'yes' || answer === 'y' ? 'Yes' : 'No';
    setConversation(prev => [...prev, {
      role: 'user',
      text: displayAnswer
    }]);

    setUserResponse('');
    setQuestionsAsked(questionsAsked + 1);
    setMessage('');

    // Every 3 questions, make a guess
    if ((questionsAsked + 1) % 3 === 0 && aiGuesses.length < 5) {
      setTimeout(() => {
        makeAGuess();
      }, 1000);
    } else {
      // Ask next question
      setTimeout(() => {
        askNextQuestion();
      }, 500);
    }
  };

  // Make a guess
  const makeAGuess = () => {
    const availableDrugs = drugs.filter(d => !aiGuesses.includes(d.names.en));
    if (availableDrugs.length === 0) {
      setConversation(prev => [...prev, {
        role: 'ai',
        text: 'I\'ve guessed all the drugs! 😅 I give up! What was it?'
      }]);
      return;
    }

    const randomGuess = availableDrugs[Math.floor(Math.random() * availableDrugs.length)];
    setCurrentGuess(randomGuess);
    setAiGuesses([...aiGuesses, randomGuess.names.en]);
    setScreen('guessing');
  };

  // Handle guess response
  const handleGuessResponse = (isCorrect) => {
    if (isCorrect) {
      setGuessedCorrect(true);
      setConversation(prev => [...prev, {
        role: 'ai',
        text: `🎉 YES! I knew it was ${currentGuess.names.en} (${currentGuess.names.fr})! I got it in ${questionsAsked} questions!`
      }]);
      setScreen('result');
    } else {
      setConversation(prev => [...prev, {
        role: 'ai',
        text: 'Ah, not that one! Let me ask more questions...'
      }]);
      setScreen('playing');
      setTimeout(() => {
        askNextQuestion();
      }, 500);
    }
  };

  // START SCREEN
  if (screen === 'start') {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>

        <div style={styles.startBox}>
          <div style={styles.icon}>🔮</div>
          <h1 style={styles.title}>PRACTICE MODE - AKINATOR</h1>
          <p style={styles.description}>
            Think of a drug. I will ask you yes/no questions and try to guess what you're thinking!
          </p>

          <div style={styles.rulesBox}>
            <h3 style={styles.rulesTitle}>How it works:</h3>
            <ul style={styles.rulesList}>
              <li>Think of any drug from the database</li>
              <li>Answer my yes/no questions honestly</li>
              <li>After a few questions, I'll try to guess</li>
              <li>If I'm wrong, I'll ask more questions</li>
              <li>See if I can guess correctly!</li>
            </ul>
          </div>

          <button style={styles.startButton} onClick={handleStart}>
            🎮 START GAME
          </button>
        </div>
      </div>
    );
  }

  // PLAYING SCREEN
  if (screen === 'playing' || screen === 'guessing') {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>

        <div style={styles.playingContent}>
          {/* LEFT - CONVERSATION */}
          <div style={styles.conversationBox}>
            <h2 style={styles.conversationTitle}>💬 Questions</h2>
            <div style={styles.conversationLog}>
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.conversationMessage,
                    backgroundColor: msg.role === 'ai' 
                      ? 'rgba(0, 217, 255, 0.1)' 
                      : 'rgba(212, 175, 55, 0.1)',
                    borderColor: msg.role === 'ai'
                      ? 'var(--border-glow)'
                      : 'var(--accent-gold)'
                  }}
                >
                  <span style={{ fontWeight: '700', marginRight: '10px' }}>
                    {msg.role === 'ai' ? '🤖' : '👤'}
                  </span>
                  {msg.text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - ANSWER/GUESS */}
          <div style={styles.inputBox}>
            {screen === 'playing' && (
              <>
                <h2 style={styles.inputTitle}>Your Answer</h2>
                <p style={styles.statsText}>Questions: <strong>{questionsAsked}</strong></p>
                <p style={styles.statsText}>AI Guesses: <strong>{aiGuesses.length}</strong></p>

                {aiGuesses.length > 0 && (
                  <div style={styles.guessesBox}>
                    <p style={styles.guessesTitle}>🎯 AI's Guesses:</p>
                    {aiGuesses.map((guess, idx) => (
                      <div key={idx} style={styles.guessTag}>{guess}</div>
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Type: yes or no"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnswer()}
                  style={styles.input}
                  autoFocus
                />

                <button style={styles.submitButton} onClick={handleAnswer}>
                  ✓ Answer
                </button>

                {message && <div style={styles.messageBox}>{message}</div>}
              </>
            )}

            {screen === 'guessing' && currentGuess && (
              <>
                <h2 style={styles.inputTitle}>Is it...?</h2>
                <div style={styles.guessCard}>
                  <div style={styles.guessDrugName}>{currentGuess.names.en}</div>
                  <div style={styles.guessDrugNameFr}>{currentGuess.names.fr}</div>
                  <div style={styles.guessDrugClass}>{currentGuess.class}</div>
                </div>

                <div style={styles.yesNoButtons}>
                  <button 
                    style={{...styles.yesButton}} 
                    onClick={() => handleGuessResponse(true)}
                  >
                    ✅ YES! That's it!
                  </button>
                  <button 
                    style={{...styles.noButton}} 
                    onClick={() => handleGuessResponse(false)}
                  >
                    ❌ NO, keep guessing
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RESULT SCREEN
  if (screen === 'result') {
    return (
      <div style={styles.container}>
        <div style={styles.resultBox}>
          <div style={styles.resultIcon}>🎉</div>
          <h1 style={styles.resultTitle}>I GOT IT!</h1>
          <p style={styles.resultText}>
            I guessed {currentGuess.names.en} in {questionsAsked} questions!
          </p>
          
          <div style={styles.resultDetails}>
            <p><strong>Drug:</strong> {currentGuess.names.en} ({currentGuess.names.fr})</p>
            <p><strong>Class:</strong> {currentGuess.class}</p>
            <p><strong>Questions Asked:</strong> {questionsAsked}</p>
            <p><strong>Guesses Made:</strong> {aiGuesses.length}</p>
          </div>

          <button style={styles.playAgainButton} onClick={() => {
            setScreen('start');
            setConversation([]);
            setQuestionsAsked(0);
            setAiGuesses([]);
            setCurrentGuess(null);
            setUserResponse('');
            setGuessedCorrect(false);
          }}>
            🔄 Play Again
          </button>

          <button style={styles.homeButton} onClick={onBack}>
            🏠 Back to Menu
          </button>
        </div>
      </div>
    );
  }
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
  startBox: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '40px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '16px',
    boxShadow: '0 0 40px rgba(212, 175, 55, 0.2)'
  },
  icon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '44px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 20px 0'
  },
  description: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    marginBottom: '30px',
    lineHeight: '1.6'
  },
  rulesBox: {
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
    textAlign: 'left'
  },
  rulesTitle: {
    fontSize: '14px',
    color: 'var(--accent-gold)',
    fontWeight: '700',
    margin: '0 0 10px 0'
  },
  rulesList: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: 0,
    paddingLeft: '20px',
    lineHeight: '1.8'
  },
  startButton: {
    padding: '14px 40px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  playingContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  conversationBox: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '1px solid var(--border-glow)',
    borderRadius: '12px',
    padding: '30px',
    height: 'fit-content',
    maxHeight: '600px'
  },
  conversationTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    color: 'var(--accent-gold)',
    margin: '0 0 20px 0'
  },
  conversationLog: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '500px',
    overflowY: 'auto'
  },
  conversationMessage: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '13px',
    lineHeight: '1.4'
  },
  inputBox: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '12px',
    padding: '30px',
    height: 'fit-content'
  },
  inputTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    color: 'var(--accent-gold)',
    margin: '0 0 20px 0'
  },
  statsText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: '5px 0'
  },
  guessesBox: {
    padding: '12px',
    background: 'rgba(212, 175, 55, 0.05)',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  guessesTitle: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '0 0 8px 0',
    fontWeight: '600'
  },
  guessTag: {
    fontSize: '12px',
    padding: '6px 10px',
    background: 'rgba(212, 175, 55, 0.2)',
    color: 'var(--accent-gold)',
    borderRadius: '4px',
    marginBottom: '4px'
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
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  guessCard: {
    padding: '20px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '2px solid var(--border-glow)',
    borderRadius: '12px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  guessDrugName: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    marginBottom: '5px'
  },
  guessDrugNameFr: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '10px'
  },
  guessDrugClass: {
    fontSize: '12px',
    color: 'var(--accent-emerald)',
    fontWeight: '600'
  },
  yesNoButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  yesButton: {
    padding: '12px',
    background: 'rgba(0, 208, 132, 0.15)',
    border: '2px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  noButton: {
    padding: '12px',
    background: 'rgba(255, 71, 87, 0.15)',
    border: '2px solid var(--danger)',
    color: 'var(--danger)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  messageBox: {
    marginTop: '12px',
    padding: '12px',
    background: 'rgba(255, 71, 87, 0.1)',
    border: '1px solid var(--danger)',
    borderRadius: '8px',
    color: 'var(--danger)',
    fontSize: '12px'
  },
  resultBox: {
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '50px 30px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '16px',
    boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)'
  },
  resultIcon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  resultTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '44px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 15px 0'
  },
  resultText: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    marginBottom: '30px'
  },
  resultDetails: {
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
    fontSize: '13px',
    textAlign: 'left'
  },
  playAgainButton: {
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
  homeButton: {
    width: '100%',
    padding: '12px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '2px solid var(--border-glow)',
    color: 'var(--border-glow)',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit'
  }
};

export default PracticeMode;