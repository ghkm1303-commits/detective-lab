import React from 'react';
import Logo from './Logo';
import BackButton from './BackButton';
import Breadcrumb from './Breadcrumb';

// Second step: given a targetType ('group' | 'molecule') already chosen on the Hub,
// let the player pick Open Investigation (random, all lessons) or Targeted Search
// (pick a lesson first).
const ChemistryModeChoice = ({ targetType, onSelectMode, onBack, currentLang, userName, onStats, theme }) => {
  const targetLabel =
    targetType === 'group'
      ? (currentLang === 'en' ? 'Group' : 'Groupe')
      : (currentLang === 'en' ? 'Molecule' : 'Mol\u00e9cule');

  const trail = [
    { label: currentLang === 'en' ? 'Chemistry' : 'Chimie Th\u00e9rapeutique' },
    { label: targetLabel },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.leftGroup}>
          <BackButton onClick={onBack} />
          <Logo variant="horizontal" theme={theme} />
        </div>
        <div style={styles.rightGroup}>
          <button onClick={onStats} className="user-button">👤 {userName}</button>
        </div>
      </div>

      <Breadcrumb trail={trail} />

      <div style={styles.content}>
        <h2 style={styles.title}>
          {currentLang === 'en' ? 'Choose your mode' : 'Choisis ton mode'}
        </h2>

        <div style={styles.grid}>
          <button style={styles.card} onClick={() => onSelectMode('open')}>
            <h3 style={styles.cardTitle}>
              {currentLang === 'en' ? 'Open Investigation' : 'Open Investigation'}
            </h3>
            <p style={styles.cardSub}>
              {currentLang === 'en'
                ? 'Random target from all lessons'
                : 'Cible al\u00e9atoire parmi toutes les le\u00e7ons'}
            </p>
          </button>

          <button style={styles.card} onClick={() => onSelectMode('targeted')}>
            <h3 style={styles.cardTitle}>
              {currentLang === 'en' ? 'Targeted Search' : 'Targeted Search'}
            </h3>
            <p style={styles.cardSub}>
              {currentLang === 'en'
                ? 'Pick a lesson first, then guess within it'
                : 'Choisis d\u2019abord une le\u00e7on, puis devine \u00e0 l\u2019int\u00e9rieur'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', padding: '15px', position: 'relative', zIndex: 10 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--border-teal)', flexWrap: 'wrap', gap: '10px' },
  leftGroup: { display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' },
  rightGroup: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  content: { maxWidth: '700px', margin: '20px auto 0' },
  title: { fontSize: '22px', color: '#FFFFFF', textAlign: 'center', marginBottom: '20px', fontFamily: "'Ubuntu', sans-serif" },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  card: { padding: '24px 20px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)', border: '2px solid var(--accent-gold)', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: 'var(--accent-gold)', margin: '0 0 8px 0' },
  cardSub: { fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' },
};

export default ChemistryModeChoice;