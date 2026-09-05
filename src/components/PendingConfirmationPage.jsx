import React from 'react';
import ThemeToggle from './ThemeToggle';

const PendingConfirmationPage = ({ currentLang, theme, onThemeChange, userName, onLogout, submittedAt, planLabel }) => {
  const hoursLeft = submittedAt
    ? Math.max(0, 24 - Math.floor((Date.now() - submittedAt) / (1000 * 60 * 60)))
    : 24;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div></div>
        <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
      </div>

      <div style={styles.content}>
        <div style={styles.icon}>⏳</div>
        <h1 style={styles.title}>
          {currentLang === 'en' ? 'Payment Under Review' : 'Paiement en Cours de Vérification'}
        </h1>
        <p style={styles.subtitle}>
          {currentLang === 'en'
            ? `Hi ${userName}, we've received your confirmation.`
            : `Bonjour ${userName}, nous avons bien reçu votre confirmation.`}
        </p>

        <div style={styles.card}>
          {planLabel && (
            <div style={styles.row}>
              <span style={styles.label}>{currentLang === 'en' ? 'Plan' : 'Formule'}</span>
              <span style={styles.value}>{planLabel}</span>
            </div>
          )}
          <div style={styles.row}>
            <span style={styles.label}>{currentLang === 'en' ? 'Status' : 'Statut'}</span>
            <span style={styles.statusBadge}>
              {currentLang === 'en' ? 'Pending' : 'En attente'}
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>{currentLang === 'en' ? 'Estimated time left' : 'Temps restant estimé'}</span>
            <span style={styles.value}>~{hoursLeft}h</span>
          </div>
        </div>

        <p style={styles.note}>
          {currentLang === 'en'
            ? 'Your account will unlock automatically as soon as we verify your BaridiMob transfer — usually within 24 hours. No need to resend payment.'
            : 'Votre compte se débloquera automatiquement dès la vérification de votre virement BaridiMob — généralement sous 24h. Pas besoin de renvoyer le paiement.'}
        </p>

        <button style={styles.logoutBtn} onClick={onLogout}>
          🚪 {currentLang === 'en' ? 'Logout' : 'Déconnexion'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', padding: '15px' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid var(--border-teal)'
  },
  content: {
    maxWidth: '500px', margin: '60px auto 0', textAlign: 'center'
  },
  icon: { fontSize: '56px', marginBottom: '10px' },
  title: { color: 'var(--accent-gold)', fontSize: '26px', margin: '0 0 10px 0' },
  subtitle: { color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 25px 0' },
  card: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-teal)', borderRadius: '10px', padding: '20px', marginBottom: '20px'
  },
  row: {
    display: 'flex', justifyContent: 'space-between', padding: '10px 0',
    borderBottom: '1px solid var(--border-gold)'
  },
  label: { color: 'var(--text-secondary)', fontSize: '13px' },
  value: { color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600' },
  statusBadge: {
    background: 'rgba(184, 154, 90, 0.2)', color: 'var(--accent-gold)',
    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700'
  },
  note: { color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.6', marginBottom: '25px' },
  logoutBtn: {
    padding: '10px 24px', background: 'rgba(230, 57, 70, 0.1)', border: '2px solid #E63946',
    color: '#FF6B7A', borderRadius: '6px', fontWeight: '600', fontSize: '13px'
  }
};

export default PendingConfirmationPage;