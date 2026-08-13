import React from 'react';

const ModeSelector = ({ onSelectMode }) => {
  const modes = [
  {
    id: 'mainGame',           // ✅ CORRECT
    title: 'Main Game',
    icon: '🎮',
    description: 'AI picks a drug and gives you clues. Guess the drug name!',
    color: 'var(--accent-gold)',
    hint: 'Test your pharmacology knowledge'
  },
  {
    id: 'practiceMode',       // ✅ CORRECT
    title: 'Practice Mode',
    icon: '🧠',
    description: 'You pick a drug. AI asks yes/no questions and tries to guess it.',
    color: 'var(--accent-emerald)',
    hint: 'Test your deduction skills'
  },
  {
    id: 'drugDirectory',      // ✅ CORRECT
    title: 'Drug Directory',
    icon: '📚',
    description: 'Browse and learn detailed information about all drugs.',
    color: 'var(--border-glow)',
    hint: 'Study comprehensive drug data'
  },
  {
    id: 'drugManagement',     // ✅ CORRECT
    title: 'Manage Drugs',
    icon: '⚙️',
    description: 'Add, edit, and manage your drug database continuously.',
    color: '#ff9800',
    hint: 'Keep your database updated'
  }
];



  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.logo}>🔬</div>
          <h1 style={styles.title}>DETECTIVE LAB</h1>
          <p style={styles.subtitle}>Guess the Drug - Pharmacology Edition</p>
          <p style={styles.description}>
            Two ways to master pharmaceutical knowledge through deduction
          </p>
        </div>

        <div style={styles.modesSection}>
          <h2 style={styles.sectionTitle}>Select Game Mode</h2>
          <div style={styles.modesGrid}>
            {modes.map(mode => (
              <button
                key={mode.id}
                style={{
                  ...styles.modeCard,
                  borderColor: mode.color,
                  backgroundColor: mode.color === 'var(--accent-gold)' 
                    ? 'rgba(212, 175, 55, 0.1)' 
                    : 'rgba(0, 208, 132, 0.1)'
                }}
                onClick={() => onSelectMode(mode.id)}
              >
                <div style={styles.modeIcon}>{mode.icon}</div>
                <h3 style={{ ...styles.modeName, color: mode.color }}>
                  {mode.title}
                </h3>
                <p style={styles.modeDescription}>{mode.description}</p>
                <p style={styles.modeHint}>💡 {mode.hint}</p>
              </button>
            ))}
          </div>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Each mode teaches different skills. Play both to master pharmacology!
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    zIndex: 10
  },
  content: {
    maxWidth: '900px',
    width: '100%'
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px'
  },
  logo: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '56px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    marginBottom: '5px',
    margin: '0 0 5px 0'
  },
  subtitle: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    marginBottom: '20px',
    margin: '0 0 20px 0'
  },
  description: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto'
  },
  modesSection: {
    marginBottom: '50px'
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '30px',
    textAlign: 'center'
  },
  modesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  modeCard: {
    padding: '30px',
    border: '2px solid',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    fontSize: 'inherit',
    fontFamily: 'inherit'
  },
  modeIcon: {
    fontSize: '48px',
    marginBottom: '15px'
  },
  modeName: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '15px',
    fontFamily: "'Playfair Display', serif",
    margin: '0 0 15px 0'
  },
  modeDescription: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '15px',
    margin: '0 0 15px 0'
  },
  modeHint: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    margin: '0'
  },
  footer: {
    textAlign: 'center',
    paddingTop: '30px',
    borderTop: '1px solid rgba(0, 217, 255, 0.1)'
  },
  footerText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: '0'
  }
};

export default ModeSelector;