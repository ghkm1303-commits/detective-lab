import React, { useState } from 'react';
import Logo from './Logo';

const PendingConfirmationPage = ({ userName, status, plan, reference, onCheckAgain, onLogout, currentLang }) => {
  const [checking, setChecking] = useState(false);
  const en = currentLang === 'en';

  const handleCheck = async () => {
    setChecking(true);
    await onCheckAgain();
    setChecking(false);
  };

  const planNames = {
    monthly: en ? '1 Month' : '1 Mois',
    yearly: en ? '1 Year' : '1 An'
  };
  const planText = plan && planNames[plan]
    ? (en ? ` for the ${planNames[plan]} plan` : ` pour la formule ${planNames[plan]}`)
    : '';

  const content = {
    review: {
      icon: '💳',
      title: en ? 'Payment Under Review' : 'Paiement en Cours de Vérification',
      texts: [
        en
          ? `Thanks, ${userName}! We've received your payment confirmation${planText}.`
          : `Merci, ${userName} ! Nous avons bien reçu ta confirmation de paiement${planText}.`,
        en
          ? 'Your access will be activated within 24h after we verify your BaridiMob transfer.'
          : 'Ton accès sera activé sous 24h après vérification de ton virement BaridiMob.'
      ],
      canCheck: true
    },
    pending: {
      icon: '⏳',
      title: en ? 'Waiting for Approval' : "En Attente d'Approbation",
      texts: [
        en
          ? `Thanks for signing up, ${userName}! Your access request has been sent.`
          : `Merci pour ton inscription, ${userName} ! Ta demande d'accès a bien été envoyée.`,
        en
          ? 'You will be able to play as soon as it is approved.'
          : "Tu pourras jouer dès qu'elle sera approuvée."
      ],
      canCheck: true
    },
    denied: {
      icon: '🚫',
      title: en ? 'Access Denied' : 'Accès Refusé',
      texts: [
        en
          ? `Sorry ${userName}, your access request was not approved.`
          : `Désolé ${userName}, ta demande d'accès n'a pas été approuvée.`
      ],
      canCheck: false
    }
  };

  const view = content[status] || content.pending;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Logo variant="horizontal" theme="dark" />
        <div style={styles.headerRight}>
          <span style={styles.userBadge}>👤 {userName}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>
            🚪 {en ? 'Logout' : 'Déconnexion'}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.iconCircle}>{view.icon}</div>

        <h1 style={styles.title}>{view.title}</h1>

        {view.texts.map((text, i) => (
          <p key={i} style={styles.text}>{text}</p>
        ))}

        {status === 'review' && reference && (
          <p style={styles.text}>
            {en ? 'Your reference code' : 'Ton code de référence'}: <strong style={{ color: 'var(--accent-gold)', letterSpacing: '2px' }}>{reference}</strong>
          </p>
        )}

        {view.canCheck && (
          <button style={styles.checkButton} onClick={handleCheck} disabled={checking}>
            {checking
              ? (en ? 'Checking...' : 'Vérification...')
              : (en ? '🔄 Check Status' : '🔄 Vérifier le Statut')}
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