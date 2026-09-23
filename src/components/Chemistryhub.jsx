import React from 'react';
import Logo from './Logo';
import BackButton from './BackButton';
import Breadcrumb from './Breadcrumb';

// Landing screen for the Chimie Thérapeutique subject.
// Lets the player choose what they want to guess (structural group vs molecule)
// or open the study Archive.
const ChemistryHub = ({ onSelectTarget, onGoArchive, onBack, onGoHome, currentLang, userName, onStats, theme }) => {
  const trail = [
    { label: currentLang === 'en' ? 'Chemistry' : 'Chimie Thérapeutique' },
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
          {currentLang === 'en' ? 'What do you want to guess?' : 'Que veux-tu deviner ?'}
        </h2>

        <div style={styles.grid}>
          <button style={styles.card} onClick={() => onSelectTarget('group')}>
            <h3 style={styles.cardTitle}>
              {currentLang === 'en' ? 'Guess the Group' : 'Deviner le Groupe'}
            </h3>
            <p style={styles.cardSub}>
              {currentLang === 'en'
                ? 'A structural group within a therapeutic class (e.g. benzodiazepines)'
                : 'Un groupe structural au sein d\u2019une classe th\u00e9rapeutique (ex. les benzodiaz\u00e9pines)'}
            </p>
          </button>

          <button style={styles.card} onClick={() => onSelectTarget('molecule')}>
            <h3 style={styles.cardTitle}>
              {currentLang === 'en' ? 'Guess the Molecule' : 'Deviner la Mol\u00e9cule'}
            </h3>
            <p style={styles.cardSub}>
              {currentLang === 'en'
                ? 'One specific drug (DCI) inside a group'
                : 'Un m\u00e9dicament pr\u00e9cis (DCI) \u00e0 l\u2019int\u00e9rieur d\u2019un groupe'}
            </p>
          </button>

          <button style={styles.cardArchive} onClick={onGoArchive}>
            <h3 style={styles.cardTitle}>
              {currentLang === 'en' ? '📖 Archive' : '📖 Archives'}
            </h3>
            <p style={styles.cardSub}>
              {currentLang === 'en'
                ? 'Browse lessons, groups and molecules to study'
                : 'Parcourir les le\u00e7ons, groupes et mol\u00e9cules pour r\u00e9viser'}
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
  content: { maxWidth: '900px', margin: '20px auto 0' },
  title: { fontSize: '22px', color: '#FFFFFF', textAlign: 'center', marginBottom: '20px', fontFamily: "'Ubuntu', sans-serif" },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  card: { padding: '24px 20px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)', border: '2px solid var(--accent-gold)', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
  cardArchive: { padding: '24px 20px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)', border: '2px solid var(--accent-teal)', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: 'var(--accent-gold)', margin: '0 0 8px 0' },
  cardSub: { fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' },
};

export default ChemistryHub;