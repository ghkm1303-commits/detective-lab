import React, { useState, useMemo } from 'react';
import BackButton from './BackButton';

// Builds a pool of guessable targets from the new lesson-based schema.
// targetType: 'group' -> guess the structural group ; 'molecule' -> guess the molecule (DCI)
// scope: 'all' -> every lesson ; <lesson_id> -> only that lesson (Targeted Search)
function buildPool(data, targetType, scope) {
  if (targetType === 'group') {
    return data.groups
      .filter((g) => scope === 'all' || g.lesson_id === scope)
      .map((g) => ({
        id: g.id,
        answerFr: g.name_fr,
        answerEn: g.name_en,
        clues: g.guess_clues || { fr: [], en: [] },
      }));
  }
  return data.molecules
    .filter((m) => scope === 'all' || m.lesson_id === scope)
    .map((m) => ({
      id: m.id,
      answerFr: m.dci_fr,
      answerEn: m.dci_en,
      clues: m.guess_clues || { fr: [], en: [] },
    }));
}

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function checkGuess(guess, target) {
  return (
    normalize(guess) === normalize(target.answerFr) ||
    normalize(guess) === normalize(target.answerEn)
  );
}

const GameGuessing = ({ data, targetType, scope, onBack, onGameEnd, currentLang }) => {
  const pool = useMemo(() => buildPool(data, targetType, scope), [data, targetType, scope]);

  if (!pool.length) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <BackButton onClick={onBack} />
        </div>
        <div style={styles.content}>
          <p style={styles.title}>
            {currentLang === 'en' ? 'No targets available for this selection yet.' : 'Aucune cible disponible pour cette sélection pour le moment.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <GameGuessingRound
      pool={pool}
      targetType={targetType}
      onBack={onBack}
      onGameEnd={onGameEnd}
      currentLang={currentLang}
    />
  );
};

// Separated so `target` (a random pick) is only chosen once per mount/pool.
const GameGuessingRound = ({ pool, targetType, onBack, onGameEnd, currentLang }) => {
  const [target] = useState(() => pool[Math.floor(Math.random() * pool.length)]);
  const [clueIndex, setClueIndex] = useState(0); // how many clues revealed - 1
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState(null); // 'wrong' | null
  const [solved, setSolved] = useState(false);
  const [showMCQ, setShowMCQ] = useState(false);
  const [mcqOptions, setMcqOptions] = useState([]);

  const clues = target.clues[currentLang]?.length ? target.clues[currentLang] : (target.clues.fr || []);
  const totalClues = clues.length;
  const revealed = clues.slice(0, clueIndex + 1);

  const answer = currentLang === 'en' ? (target.answerEn || target.answerFr) : target.answerFr;

  const buildMCQ = () => {
    const distractors = pool
      .filter((p) => p.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((p) => (currentLang === 'en' ? (p.answerEn || p.answerFr) : p.answerFr));
    const options = [...distractors, answer].sort(() => Math.random() - 0.5);
    setMcqOptions(options);
    setShowMCQ(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkGuess(guess, target)) {
      setSolved(true);
      const xp = Math.max(10, 50 - clueIndex * 10);
      onGameEnd && onGameEnd({ score: xp, xpEarned: xp, drugName: answer, cluesUsed: clueIndex + 1 });
      return;
    }
    setFeedback('wrong');
    setGuess('');
    if (clueIndex + 1 < totalClues) {
      setClueIndex(clueIndex + 1);
    } else {
      buildMCQ();
    }
  };

  const handleMCQPick = (option) => {
    if (normalize(option) === normalize(answer)) {
      setSolved(true);
      onGameEnd && onGameEnd({ score: 10, xpEarned: 10, drugName: answer, cluesUsed: totalClues });
    } else {
      setSolved(true);
      onGameEnd && onGameEnd({ score: 0, xpEarned: 0, drugName: answer, cluesUsed: totalClues, missed: true });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <BackButton onClick={onBack} />
        {totalClues > 0 && (
          <div style={styles.progress}>
            {currentLang === 'en' ? 'Clue' : 'Indice'} {clueIndex + 1}/{totalClues}
          </div>
        )}
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>
          {targetType === 'group'
            ? currentLang === 'en' ? 'Guess the structural group' : 'Devinez le groupe structural'
            : currentLang === 'en' ? 'Guess the molecule (DCI)' : 'Devinez le médicament (DCI)'}
        </h2>

        {totalClues > 0 ? (
          <div style={styles.cluesBox}>
            {revealed.map((c, i) => (
              <div key={i} style={styles.clueLine}>
                <span style={styles.clueNum}>{i + 1}</span> {c}
              </div>
            ))}
          </div>
        ) : (
          !showMCQ && !solved && (
            <p style={styles.noCluesMsg}>
              {currentLang === 'en'
                ? 'No clues written yet for this target — try a direct guess or skip to multiple choice.'
                : "Aucun indice n'est encore rédigé pour cette cible — tente une réponse directe ou passe au QCM."}
            </p>
          )
        )}

        {!showMCQ && !solved && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder={currentLang === 'en' ? 'Your answer...' : 'Votre réponse...'}
              style={styles.input}
              autoFocus
            />
            <button type="submit" style={styles.submitBtn}>
              {currentLang === 'en' ? 'Submit' : 'Valider'}
            </button>
          </form>
        )}

        {totalClues === 0 && !showMCQ && !solved && (
          <button style={styles.skipBtn} onClick={buildMCQ}>
            {currentLang === 'en' ? 'Skip to multiple choice' : 'Passer au QCM'}
          </button>
        )}

        {feedback === 'wrong' && !showMCQ && (
          <p style={styles.wrongMsg}>{currentLang === 'en' ? 'Not quite — next clue unlocked.' : 'Pas tout à fait — indice suivant débloqué.'}</p>
        )}

        {showMCQ && !solved && (
          <div style={styles.mcqGrid}>
            {mcqOptions.map((opt) => (
              <button key={opt} style={styles.mcqBtn} onClick={() => handleMCQPick(opt)}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {solved && (
          <div style={styles.solvedBox}>
            <p style={styles.solvedText}>{currentLang === 'en' ? 'Answer' : 'Réponse'}: <strong>{answer}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', padding: '15px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  progress: { fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700' },
  content: { maxWidth: '600px', margin: '0 auto' },
  title: { fontSize: '22px', color: '#FFFFFF', textAlign: 'center', marginBottom: '20px', fontFamily: "'Ubuntu', sans-serif" },
  cluesBox: { background: 'var(--bg-card)', border: '1px solid var(--border-teal)', borderRadius: '10px', padding: '16px', marginBottom: '20px' },
  clueLine: { fontSize: '14px', color: '#FFFFFF', lineHeight: '1.6', marginBottom: '10px' },
  clueNum: { display: 'inline-block', width: '20px', height: '20px', lineHeight: '20px', textAlign: 'center', background: 'var(--accent-gold)', color: '#000', borderRadius: '50%', fontSize: '11px', fontWeight: '700', marginRight: '8px' },
  noCluesMsg: { fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '16px', fontStyle: 'italic' },
  form: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-teal)', background: 'var(--bg-hover)', color: '#FFFFFF', fontSize: '14px' },
  submitBtn: { padding: '12px 20px', borderRadius: '8px', border: 'none', background: 'var(--accent-gold)', color: '#000', fontWeight: '700', cursor: 'pointer' },
  skipBtn: { marginTop: '10px', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--accent-teal)', background: 'transparent', color: 'var(--accent-teal)', cursor: 'pointer', fontSize: '13px' },
  wrongMsg: { color: 'var(--accent-teal)', fontSize: '13px', marginTop: '10px', textAlign: 'center' },
  mcqGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  mcqBtn: { padding: '14px', borderRadius: '8px', border: '1px solid var(--accent-gold)', background: 'var(--bg-card)', color: '#FFFFFF', cursor: 'pointer', fontSize: '14px' },
  solvedBox: { textAlign: 'center', marginTop: '10px' },
  solvedText: { fontSize: '16px', color: 'var(--accent-gold)' },
};

export default GameGuessing;