import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const SubscriptionPage = ({ onSubmitPayment, currentLang, theme, onThemeChange, userName }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState('choose'); // 'choose' | 'instructions'

  const plans = [
    {
      id: 'monthly',
      icon: '📅',
      enName: '1 Month',
      frName: '1 Mois',
      price: '100 DA',
      durationDays: 30,
      enDesc: 'Full access for 1 month',
      frDesc: 'Accès complet pendant 1 mois'
    },
    {
      id: 'yearly',
      icon: '🏆',
      enName: '1 Year',
      frName: '1 An',
      price: '900 DA',
      durationDays: 365,
      enDesc: 'Full access for 1 year — best value',
      frDesc: 'Accès complet pendant 1 an — meilleure offre',
      badge: currentLang === 'en' ? 'BEST VALUE' : 'MEILLEURE OFFRE'
    }
  ];

  const chosenPlan = plans.find(p => p.id === selectedPlan);

  // TODO: replace with your real BaridiMob RIP / phone number / link
  const BARIDIMOB_INFO = {
    rip: '0079999900000000000',
    phone: '05XX XX XX XX',
    name: 'Ghada K.'
  };

  if (step === 'instructions' && chosenPlan) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button className="back-button" onClick={() => setStep('choose')}>
            ← {currentLang === 'en' ? 'Back' : 'Retour'}
          </button>
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
        </div>

        <div style={styles.content}>
          <h1 style={styles.title}>💳 {currentLang === 'en' ? 'Payment Instructions' : 'Instructions de Paiement'}</h1>

          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>
              {currentLang === 'en' ? 'Selected Plan' : 'Formule Choisie'}
            </p>
            <p style={styles.summaryValue}>
              {currentLang === 'en' ? chosenPlan.enName : chosenPlan.frName} — {chosenPlan.price}
            </p>
          </div>

          <div style={styles.instructionsCard}>
            <h3 style={styles.instructionsTitle}>
              {currentLang === 'en' ? 'Send payment via BaridiMob to:' : 'Envoyez le paiement via BaridiMob à :'}
            </h3>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>RIP:</span>
              <span style={styles.infoValue}>{BARIDIMOB_INFO.rip}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>{currentLang === 'en' ? 'Phone' : 'Téléphone'}:</span>
              <span style={styles.infoValue}>{BARIDIMOB_INFO.phone}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>{currentLang === 'en' ? 'Name' : 'Nom'}:</span>
              <span style={styles.infoValue}>{BARIDIMOB_INFO.name}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>{currentLang === 'en' ? 'Amount' : 'Montant'}:</span>
              <span style={styles.infoValueBold}>{chosenPlan.price}</span>
            </div>

            <div style={styles.warningBox}>
              ⚠️ {currentLang === 'en'
                ? 'Important: include your account username in the transfer note so we can identify your payment.'
                : "Important : indiquez votre nom d'utilisateur dans la note du virement pour qu'on puisse identifier votre paiement."}
              <p style={styles.usernameHighlight}>{userName}</p>
            </div>
          </div>

          <button
            style={styles.confirmButton}
            onClick={() => onSubmitPayment(chosenPlan)}
          >
            {currentLang === 'en' ? "✓ I've Sent the Payment" : "✓ J'ai Envoyé le Paiement"}
          </button>

          <p style={styles.note}>
            {currentLang === 'en'
              ? 'Your account will be activated within 24h after we verify the payment.'
              : 'Votre compte sera activé sous 24h après vérification du paiement.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div></div>
        <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>🔬 Detective Lab</h1>
        <p style={styles.welcome}>
          {currentLang === 'en' ? `Welcome, ${userName}!` : `Bienvenue, ${userName}!`}
        </p>
        <h2 style={styles.subtitle}>
          {currentLang === 'en' ? 'Choose Your Plan to Continue' : 'Choisissez votre formule pour continuer'}
        </h2>

        <div style={styles.plansGrid}>
          {plans.map(plan => (
            <button
              key={plan.id}
              style={{
                ...styles.planCard,
                ...(selectedPlan === plan.id ? styles.planCardSelected : {})
              }}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && <div style={styles.badge}>{plan.badge}</div>}
              <div style={styles.planIcon}>{plan.icon}</div>
              <h3 style={styles.planName}>
                {currentLang === 'en' ? plan.enName : plan.frName}
              </h3>
              <p style={styles.planPrice}>{plan.price}</p>
              <p style={styles.planDesc}>
                {currentLang === 'en' ? plan.enDesc : plan.frDesc}
              </p>
            </button>
          ))}
        </div>

        <button
          style={{
            ...styles.payButton,
            opacity: selectedPlan ? 1 : 0.5,
            cursor: selectedPlan ? 'pointer' : 'not-allowed'
          }}
          disabled={!selectedPlan}
          onClick={() => selectedPlan && setStep('instructions')}
        >
          {currentLang === 'en' ? 'Continue →' : 'Continuer →'}
        </button>

        <p style={styles.note}>
          {currentLang === 'en'
            ? 'Manual payment via BaridiMob'
            : 'Paiement manuel via BaridiMob'}
        </p>
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
  content: { maxWidth: '700px', margin: '0 auto', textAlign: 'center' },
  title: { fontSize: '38px', margin: '0 0 5px 0' },
  welcome: { color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 30px 0' },
  subtitle: { fontSize: '22px', color: 'var(--text-primary)', margin: '0 0 30px 0' },
  plansGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px', marginBottom: '30px'
  },
  planCard: {
    position: 'relative',
    padding: '30px 20px',
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'center'
  },
  planCardSelected: {
    border: '2px solid var(--accent-emerald)',
    boxShadow: '0 0 0 3px rgba(47, 125, 91, 0.3)'
  },
  badge: {
    position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
    background: 'var(--accent-emerald)', color: 'white', fontSize: '10px', fontWeight: '700',
    padding: '4px 12px', borderRadius: '20px', whiteSpace: 'nowrap'
  },
  planIcon: { fontSize: '40px', marginBottom: '10px' },
  planName: { color: 'var(--accent-gold)', fontSize: '18px', margin: '0 0 8px 0' },
  planPrice: { color: 'var(--text-primary)', fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' },
  planDesc: { color: 'var(--text-secondary)', fontSize: '12px', margin: '0' },
  payButton: {
    padding: '16px 40px',
    background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%)',
    color: 'var(--bg-obsidian)', border: 'none', borderRadius: '8px',
    fontSize: '16px', fontWeight: '700'
  },
  note: { color: 'var(--text-secondary)', fontSize: '12px', marginTop: '15px' },
  summaryCard: {
    background: 'rgba(184, 154, 90, 0.1)', border: '2px solid var(--accent-gold)',
    borderRadius: '10px', padding: '15px', marginBottom: '20px'
  },
  summaryLabel: { color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 5px 0' },
  summaryValue: { color: 'var(--accent-gold)', fontSize: '18px', fontWeight: '700', margin: '0' },
  instructionsCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-teal)', borderRadius: '10px', padding: '25px', textAlign: 'left',
    marginBottom: '25px'
  },
  instructionsTitle: { color: 'var(--accent-teal)', fontSize: '16px', margin: '0 0 15px 0', textAlign: 'center' },
  infoRow: {
    display: 'flex', justifyContent: 'space-between', padding: '10px 0',
    borderBottom: '1px solid var(--border-gold)'
  },
  infoLabel: { color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' },
  infoValue: { color: 'var(--text-primary)', fontSize: '13px' },
  infoValueBold: { color: 'var(--accent-emerald)', fontSize: '16px', fontWeight: '700' },
  warningBox: {
    marginTop: '15px', padding: '12px', background: 'rgba(230, 57, 70, 0.1)',
    border: '1px solid #E63946', borderRadius: '6px', fontSize: '12px', color: 'var(--text-primary)', textAlign: 'center'
  },
  usernameHighlight: {
    color: 'var(--accent-gold)', fontSize: '18px', fontWeight: '700', margin: '8px 0 0 0'
  },
  confirmButton: {
    padding: '16px 40px', width: '100%',
    background: 'linear-gradient(135deg, var(--accent-emerald) 0%, var(--accent-teal) 100%)',
    color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700'
  }
};

export default SubscriptionPage;