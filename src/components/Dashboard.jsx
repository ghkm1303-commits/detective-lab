import React from 'react';
import Logo from './Logo';

const Dashboard = ({ user, userName, onLogout, onContinue, theme, currentLang }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Logo variant="horizontal" theme={theme} />
        <div style={styles.headerActions}>
          <button style={styles.logoutBtn} onClick={onLogout}>
            🚪 {currentLang === 'en' ? 'Logout' : 'Déconnexion'}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <p style={styles.subtitle}>
          {currentLang === 'en' 
            ? `Welcome back, ${userName}!` 
            : `Bienvenue, ${userName}!`}
        </p>

        <button style={styles.continueBtn} onClick={onContinue}>
          {currentLang === 'en' ? 'Start Game' : 'Commencer le Jeu'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '50px',
    paddingBottom: '15px',
    borderBottom: '1px solid var(--border-teal)'
  },
  headerActions: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  logoutBtn: {
    padding: '8px 16px',
    background: 'rgba(230, 57, 70, 0.1)',
    border: '2px solid #E63946',
    color: '#FF6B7A',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: '600'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '20px',
    marginBottom: '40px',
    fontFamily: "'Ubuntu', sans-serif",
    fontWeight: '600'
  },
  continueBtn: {
    padding: '16px 40px',
    background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%)',
    color: 'var(--bg-obsidian)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer'
  }
};

export default Dashboard;