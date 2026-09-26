import React from 'react';
import Logo from '../Logo';
import BackButton from '../BackButton';
import Breadcrumb from '../Breadcrumb';

// Lets the player pick a lesson (category) before a Targeted Search guessing round.
const ChemistryLessonSelector = ({ data, targetType, onSelectLesson, onBack, currentLang, userName, onStats, theme }) => {
  const lessons = [...data.lessons].sort((a, b) => a.order - b.order);

  const targetLabel =
    targetType === 'group'
      ? (currentLang === 'en' ? 'Group' : 'Groupe')
      : (currentLang === 'en' ? 'Molecule' : 'Mol\u00e9cule');

  const trail = [
    { label: currentLang === 'en' ? 'Chemistry' : 'Chimie Th\u00e9rapeutique' },
    { label: targetLabel },
    { label: 'Targeted Search' },
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
          {currentLang === 'en' ? 'Choose a lesson' : 'Choisis une le\u00e7on'}
        </h2>

        <div style={styles.grid}>
          {lessons.map((lesson) => {
            const groupCount = lesson.group_ids.length;
            const moleculeCount = data.molecules.filter((m) => m.lesson_id === lesson.id).length;
            return (
              <button key={lesson.id} style={styles.card} onClick={() => onSelectLesson(lesson.id)}>
                <h3 style={styles.cardTitle}>
                  {currentLang === 'en' ? lesson.name_en : lesson.name_fr}
                </h3>
                <p style={styles.cardSub}>
                  {groupCount} {currentLang === 'en' ? 'groups' : 'groupes'} · {moleculeCount}{' '}
                  {currentLang === 'en' ? 'molecules' : 'mol\u00e9cules'}
                </p>
              </button>
            );
          })}
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
  content: { maxWidth: '1000px', margin: '20px auto 0' },
  title: { fontSize: '22px', color: '#FFFFFF', textAlign: 'center', marginBottom: '20px', fontFamily: "'Ubuntu', sans-serif" },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  card: { padding: '20px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)', border: '2px solid var(--accent-gold)', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: 'var(--accent-gold)', margin: '0 0 6px 0' },
  cardSub: { fontSize: '12px', color: 'var(--text-secondary)', margin: 0 },
};

export default ChemistryLessonSelector;