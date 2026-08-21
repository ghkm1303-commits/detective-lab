import React from 'react';
import ThemeToggle from './ThemeToggle';
import parasitologyLessons from '../data/parasitologyLessons';

const ParasitologyLessons = ({ onBack, currentLang, userName, onStats, theme, onThemeChange }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button className="back-button" onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <div style={styles.rightGroup}>
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          <button onClick={onStats} className="user-button">
            👤 {userName}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>🦠 Parasitologie</h1>
        <p style={styles.subtitle}>
          {currentLang === 'en'
            ? 'Lesson content coming soon — structure ready.'
            : 'Contenu des leçons à venir — structure prête.'}
        </p>

        {parasitologyLessons.map(section => (
          <div key={section.category} style={styles.section}>
            <h2 style={styles.sectionTitle}>{section.frCategory}</h2>
            <div style={styles.lessonGrid}>
              {section.lessons.map(lesson => (
                <div key={lesson.id} className="mode-card-disabled" style={styles.lessonCard}>
                  <div style={styles.lessonNumber}>{lesson.id}</div>
                  <p style={styles.lessonTitle}>{lesson.title}</p>
                  <div style={styles.comingSoon}>
                    {currentLang === 'en' ? 'Coming Soon' : 'Bientôt Disponible'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '15px',
    position: 'relative',
    zIndex: 10
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid var(--border-teal)',
    flexWrap: 'wrap',
    gap: '10px'
  },
  rightGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto'
  },
  title: {
    textAlign: 'center',
    marginBottom: '10px'
  },
  subtitle: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    marginBottom: '40px'
  },
  section: {
    marginBottom: '35px'
  },
  sectionTitle: {
    color: 'var(--accent-gold)',
    fontSize: '20px',
    marginBottom: '15px',
    borderBottom: '1px solid var(--border-gold)',
    paddingBottom: '8px'
  },
  lessonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '15px'
  },
  lessonCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '18px',
    position: 'relative'
  },
  lessonNumber: {
    color: 'var(--accent-teal)',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '8px'
  },
  lessonTitle: {
    color: 'var(--text-primary)',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: '0 0 10px 0'
  },
  comingSoon: {
    display: 'inline-block',
    background: 'var(--accent-teal)',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '9px',
    fontWeight: '700'
  }
};

export default ParasitologyLessons;