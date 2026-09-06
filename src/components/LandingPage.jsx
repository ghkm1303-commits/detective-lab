import React, { useState } from 'react';
import Logo from './Logo';
import { submitFeatureRequest } from '../utils/feedback';
import './LandingPage.css';

const LandingPage = ({ currentLang, theme, onLogin, onSignup, onViewPricing }) => {
  const t = (en, fr) => (currentLang === 'en' ? en : fr);

  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('idle'); // idle | sending | sent | error

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    setFeedbackStatus('sending');
    try {
      await submitFeatureRequest({ name: feedbackName, message: feedbackMessage });
      setFeedbackStatus('sent');
      setFeedbackName('');
      setFeedbackMessage('');
    } catch (err) {
      console.error('Feedback submit error:', err);
      setFeedbackStatus('error');
    }
  };

  return (
    <div className="landing">
      <header className="landing-header">
        <Logo variant="horizontal" theme={theme} />
        <div className="landing-header-actions">
          <button className="landing-btn-ghost" onClick={onLogin}>
            {t('Login', 'Connexion')}
          </button>
          <button className="landing-btn-solid" onClick={onSignup}>
            {t('Sign Up', "S'inscrire")}
          </button>
        </div>
      </header>

      <section className="landing-hero">
        <h1 className="landing-title">
          {t(
            'The Revision Platform for Pharmacy Students',
            'La Plateforme de Révision pour Étudiants en Pharmacie'
          )}
        </h1>
        <p className="landing-subtitle">
          {t(
            'Master drugs, pharmacology and parasitology through interactive detective-style quiz games.',
            'Maîtrise les médicaments, la pharmacologie et la parasitologie grâce à des jeux de quiz façon enquête.'
          )}
        </p>
        <button className="landing-cta" onClick={onSignup}>
          {t('Create your account today', 'Crée ton compte aujourd\'hui')}
        </button>
        <button className="landing-cta-secondary" onClick={onLogin}>
          {t('I already have an account', "J'ai déjà un compte")}
        </button>
      </section>

      <section className="landing-stats">
        <div className="landing-stat">
          <span className="landing-stat-number">254+</span>
          <span className="landing-stat-label">{t('Drugs Covered', 'Médicaments Couverts')}</span>
        </div>
        <div className="landing-stat">
          <span className="landing-stat-number">40+</span>
          <span className="landing-stat-label">{t('Organisms', 'Organismes')}</span>
        </div>
        <div className="landing-stat">
          <span className="landing-stat-number">3</span>
          <span className="landing-stat-label">{t('Subjects', 'Matières')}</span>
        </div>
      </section>

      <section className="landing-pricing-teaser">
        <h2>{t('Plans & Pricing', 'Formules & Tarifs')}</h2>
        <p>
          {t(
            'Unlock every subject, every mode, and full progress tracking.',
            'Débloque toutes les matières, tous les modes, et le suivi complet de ta progression.'
          )}
        </p>
        <button className="landing-btn-outline" onClick={onViewPricing}>
          {t('See Plans & Pricing', 'Voir les Formules & Tarifs')}
        </button>
      </section>

      <section className="landing-feedback">
        <h2>{t('Suggest a Feature', 'Propose une Fonctionnalité')}</h2>
        <p>
          {t(
            "Missing something you'd love to see in Detective Lab? Tell us!",
            'Il te manque quelque chose sur Detective Lab ? Dis-le nous !'
          )}
        </p>

        {feedbackStatus === 'sent' ? (
          <p className="landing-feedback-success">
            {t('Thank you! Your suggestion has been sent.', 'Merci ! Ta suggestion a bien été envoyée.')}
          </p>
        ) : (
          <form className="landing-feedback-form" onSubmit={handleFeedbackSubmit}>
            <input
              type="text"
              className="landing-feedback-input"
              placeholder={t('Your name (optional)', 'Ton nom (optionnel)')}
              value={feedbackName}
              onChange={(e) => setFeedbackName(e.target.value)}
            />
            <textarea
              className="landing-feedback-textarea"
              placeholder={t('Describe the feature you want...', 'Décris la fonctionnalité que tu veux...')}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              rows={4}
              required
            />
            {feedbackStatus === 'error' && (
              <p className="landing-feedback-error">
                {t('Something went wrong. Please try again.', "Une erreur s'est produite. Réessaie.")}
              </p>
            )}
            <button
              type="submit"
              className="landing-btn-solid landing-feedback-submit"
              disabled={feedbackStatus === 'sending'}
            >
              {feedbackStatus === 'sending'
                ? t('Sending...', 'Envoi...')
                : t('Send Suggestion', 'Envoyer')}
            </button>
          </form>
        )}
      </section>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Detective Lab</p>
        <div className="landing-footer-legal">
          <a href="/privacy.html">{t('Privacy Policy', 'Politique de Confidentialité')}</a>
          <span>·</span>
          <a href="/terms.html">{t('Terms & Conditions', "Conditions d'Utilisation")}</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;