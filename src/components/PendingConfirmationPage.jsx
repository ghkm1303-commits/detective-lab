import React, { useState } from 'react';
import Logo from './Logo';
import '../tailwind.css';
import '../detective.css';

const INSTAGRAM_URL = 'https://www.instagram.com/detective_labs/';

const PLAN_LABELS = {
  monthly: { en: 'Monthly Pass (150 DA)', fr: 'Pass Mensuel (150 DA)' },
  yearly: { en: 'Annual Pass (1000 DA)', fr: 'Pass Annuel (1000 DA)' },
};

// status : 'review' (paiement signalé, en attente de vérification) ou 'denied' (demande refusée)
const PendingConfirmationPage = ({ userName, status, plan, onCheckAgain, onLogout, currentLang }) => {
  const t = (en, fr) => (currentLang === 'fr' ? fr : en);
  const denied = status === 'denied';

  const [checking, setChecking] = useState(false);
  const [checkedAt, setCheckedAt] = useState(null);

  const planLabel = PLAN_LABELS[plan] ? t(PLAN_LABELS[plan].en, PLAN_LABELS[plan].fr) : null;

  const handleCheck = async () => {
    setChecking(true);
    try {
      await onCheckAgain();
      setCheckedAt(new Date());
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="dl-app relative isolate flex flex-col overflow-x-clip">
      <div className="dl-app-bg" aria-hidden="true" />

      <header className="relative z-10 border-b border-[#B89A5A]/25 bg-[#1D2A3A]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Logo variant="horizontal" theme="dark" />
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-[#E63946]/60 bg-transparent px-3.5 py-2 text-sm font-semibold text-[#ff8f9a] transition-colors hover:bg-[#E63946]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8f9a]"
          >
            🚪 {t('Logout', 'Déconnexion')}
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 items-center px-4 py-10 sm:px-6">
        <section
          aria-live="polite"
          className={`dl-fade-in w-full rounded-2xl border-2 bg-[#1D2A3A] p-6 text-center shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] sm:p-8 ${
            denied ? 'border-[#E63946]/70' : 'border-[#B89A5A]'
          }`}
        >
          <p
            className={`inline-block rounded-full border px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] ${
              denied ? 'border-[#E63946]/70 bg-[#E63946]/10 text-[#ff8f9a]' : 'border-[#B89A5A] bg-[#B89A5A]/10 text-[#B89A5A]'
            }`}
          >
            {denied ? t('REQUEST NOT APPROVED', 'DEMANDE NON APPROUVÉE') : t('UNDER REVIEW', 'EN COURS DE VÉRIFICATION')}
          </p>

          <div className="mt-5 text-5xl" aria-hidden="true">
            {denied ? '🔒' : '🔎'}
          </div>

          <h1 className="dl-display mt-4 text-2xl font-bold leading-tight text-[#F2EFE6] sm:text-3xl">
            {denied
              ? t('Access request declined', "Demande d'accès refusée")
              : t('Payment under verification', 'Paiement en cours de vérification')}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-[#F2EFE6]/70">
            {denied
              ? t(
                  `${userName ? `${userName}, your` : 'Your'} access request was not approved. If you think this is a mistake, contact us on Instagram.`,
                  `${userName ? `${userName}, votre` : 'Votre'} demande d'accès n'a pas été approuvée. Si vous pensez qu'il s'agit d'une erreur, contactez-nous sur Instagram.`
                )
              : t(
                  `${userName ? `Thanks ${userName}. ` : ''}We received your payment notice and we are checking it. Your access opens as soon as it is approved.`,
                  `${userName ? `Merci ${userName}. ` : ''}Nous avons reçu votre signalement de paiement et nous le vérifions. Votre accès s'ouvre dès son approbation.`
                )}
          </p>

          {!denied && planLabel && (
            <dl className="mt-5 rounded-xl border border-[#F2EFE6]/15 bg-[#0B0D0D]/40 px-4 py-4 text-left">
              <dt className="text-xs text-[#F2EFE6]/55">{t('Pass', 'Pass')}</dt>
              <dd className="m-0 mt-0.5 text-sm font-semibold text-[#F2EFE6]">{planLabel}</dd>
            </dl>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleCheck}
              disabled={checking}
              className="w-full rounded-lg border-0 bg-[#3F628C] px-5 py-3.5 text-base font-semibold text-[#F2EFE6] transition-colors hover:bg-[#4a73a3] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D2A3A]"
            >
              🔄 {checking ? t('Checking...', 'Vérification...') : t('Check status', 'Vérifier le statut')}
            </button>
            {checkedAt && !checking && (
              <p className="text-xs text-[#F2EFE6]/50" role="status">
                {t('Last checked at', 'Dernière vérification à')} {checkedAt.toLocaleTimeString()}
              </p>
            )}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg border border-[#B89A5A]/60 bg-transparent px-5 py-3 text-center text-sm font-semibold text-[#B89A5A] no-underline transition-colors hover:bg-[#B89A5A]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
            >
              {t('Message us on Instagram', 'Écrivez-nous sur Instagram')}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PendingConfirmationPage;