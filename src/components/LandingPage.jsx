import React from 'react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import './LandingPage.css';

const LandingPage = ({ currentLang, theme, onThemeChange, onLogin, onSignup, onViewPricing }) => {
  const t = (en, fr) => (currentLang === 'en' ? en : fr);

  return (
    <div className="landing">
      <header className="landing-header">
        <Logo variant="horizontal" theme={theme} />
        <div className="landing-header-actions">
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
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

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Detective Lab</p>
      </footer>
    </div>
  );
};

export default LandingPage;