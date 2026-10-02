import React, { useState } from 'react';
import Logo from './Logo';

const PendingConfirmationPage = ({ userName, status, onCheckAgain, onLogout, currentLang }) => {
  const [checking, setChecking] = useState(false);
  const denied = status === 'denied';

  const handleCheck = async () => {
    setChecking(true);
    await onCheckAgain();
    setChecking(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Logo variant="horizontal" theme="dark" />
        <div style={styles.headerRight}>
          <span style={styles.userBadge}>👤 {userName}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>
            🚪 {currentLang === 'en' ? 'Logout' : 'Déconnexion'}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.iconCircle}>{denied ? '🚫' : '⏳'}</div>

        <h1 style={styles.title}>
          {denied
            ? (currentLang === 'en' ? 'Access Denied' : 'Accès Refusé')
            : (currentLang === 'en' ? 'Waiting for Approval' : "En Attente d'Approbation")}
        </h1>

        <p style={styles.text}>
          {denied
            ? (currentLang === 'en'
                ? `Sorry ${userName}, your access request was not approved.`
                : `Désolé ${userName}, ta demande d'accès n'a pas été approuvée.`)
            : (currentLang === 'en'
                ? `Thanks for signing up, ${userName}! Your access request has been sent.`
                : `Merci pour ton inscription, ${userName} ! Ta demande d'accès a bien été envoyée.`)}
        </p>
        {!denied && (
          <p style={styles.text}>
            {currentLang === 'en'
              ? 'You will be able to play as soon as it is approved.'
              : 'Tu pourras jouer dès qu\'elle sera approuvée.'}
          </p>
        )}

        {!denied && (
          <button style={styles.checkButton} onClick={handleCheck} disabled={checking}>
            {checking
              ? (currentLang === 'en' ? 'Checking...' : 'Vérification...')
              : (currentLang === 'en' ? '🔄 Check Status' : '🔄 Vérifier le Statut')}
          </button>
        )}
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
    borderBottom: '1px solid var(--border-teal)',
    flexWrap: 'wrap',
    gap: '10px'
  },
  headerRight: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  userBadge: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    fontFamily: "'Ubuntu', sans-serif"
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
    textAlign: 'center',
    maxWidth: '440px',
    margin: '0 auto',
    width: '100%'
  },
  iconCircle: {
    fontSize: '48px',
    marginBottom: '20px'
  },
  title: {
    color: '#FFFFFF',
    fontFamily: "'Ubuntu', sans-serif",
    fontWeight: '700',
    fontSize: '24px',
    marginBottom: '18px'
  },
  text: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '12px'
  },
  checkButton: {
    marginTop: '20px',
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%)',
    color: 'var(--bg-obsidian)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Ubuntu', sans-serif"
  }
};

export default PendingConfirmationPage;