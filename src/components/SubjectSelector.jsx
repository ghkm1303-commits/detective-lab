import React, { useState } from 'react';
import Logo from './Logo';
import '../tailwind.css';
import '../detective.css';

/* ------------------------------------------------------------------ */
/*  Detective Labs — Subscription / Clearance page                     */
/*  Étape 1 : choisir un pass   →   Étape 2 : payer par BaridiMob      */
/*  puis "J'ai envoyé le paiement" (l'admin valide dans le panneau).   */
/* ------------------------------------------------------------------ */

// ⚠️ REMPLACE ces 3 valeurs par tes VRAIES coordonnées BaridiMob (copie-les depuis ton ancien fichier).
// Tant qu'elles contiennent "REPLACE", la page refuse d'envoyer un paiement (sécurité).
const BARIDIMOB_INFO = {
  rip: 'REPLACE_WITH_YOUR_RIP',
  phone: 'REPLACE_WITH_YOUR_PHONE',
  name: 'REPLACE_WITH_ACCOUNT_NAME',
};

const TELEGRAM_URL = 'https://t.me/detectivelabs_pharmacy';

// Les ids doivent rester 'monthly' et 'yearly' : ce sont ceux que comprend utils/subscription.js
const PLANS = [
  {
    id: 'monthly',
    price: 100,
    enName: 'Monthly Pass',
    frName: 'Pass Mensuel',
    enPeriod: 'per month',
    frPeriod: 'par mois',
    enNote: 'Access for 1 month',
    frNote: 'Accès pendant 1 mois',
  },
  {
    id: 'yearly',
    price: 900,
    enName: 'Annual Pass',
    frName: 'Pass Annuel',
    enPeriod: 'per year',
    frPeriod: 'par an',
    enNote: 'Access for 1 year, save 300 DA',
    frNote: "Accès pendant 1 an, économisez 300 DA",
    best: true,
  },
];

const FEATURES = [
  { en: 'Every game mode: investigations, lesson files, targeted search, archive', fr: "Tous les modes de jeu : enquêtes, dossiers par leçon, recherche ciblée, archives" },
  { en: 'The full organism database with diagnostic clues', fr: "Toute la base d'organismes avec indices diagnostiques" },
  { en: 'Progress tracking, streaks and stats', fr: 'Suivi de la progression, séries et statistiques' },
];

const isConfigured = () => !Object.values(BARIDIMOB_INFO).some((v) => String(v).includes('REPLACE'));

const CopyRow = ({ label, value, copyLabel, copiedLabel, mono = true }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      // Vieux navigateurs : copie via un champ temporaire
      const el = document.createElement('textarea');
      el.value = value;
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand('copy');
      } catch (e) {
        // rien : l'utilisatrice peut recopier à la main
      }
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#F2EFE6]/15 bg-[#0B0D0D]/40 px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-[#F2EFE6]/55">{label}</p>
        <p className={`mt-0.5 break-all text-base font-semibold text-[#F2EFE6] ${mono ? 'tracking-wide' : ''}`}>{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-md border border-[#B89A5A]/60 bg-transparent px-3 py-1.5 text-xs font-semibold text-[#B89A5A] transition-colors hover:bg-[#B89A5A]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
};

const SubscriptionPage = ({
  onSubmitPayment,
  onCheckAgain,
  onLogout,
  currentLang,
  userName,
  reference,
  mode,
}) => {
  const t = (en, fr) => (currentLang === 'fr' ? fr : en);

  const [selectedId, setSelectedId] = useState('yearly');
  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);

  const plan = PLANS.find((p) => p.id === selectedId) || PLANS[0];
  const configured = isConfigured();
  const renewing = mode === 'renew';

  const handleSend = async () => {
    if (!configured || sending) return;
    setSending(true);
    try {
      await onSubmitPayment(plan);
    } finally {
      setSending(false);
    }
  };

  const handleCheck = async () => {
    setChecking(true);
    try {
      await onCheckAgain();
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="dl-app relative isolate overflow-x-clip">
      <div className="dl-app-bg" aria-hidden="true" />

      <header className="relative z-10 border-b border-[#B89A5A]/25 bg-[#1D2A3A]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Logo variant="horizontal" theme="dark" />
          <div className="flex items-center gap-3">
            {userName && <span className="hidden text-sm text-[#F2EFE6]/65 sm:block">{userName}</span>}
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-[#E63946]/60 bg-transparent px-3.5 py-2 text-sm font-semibold text-[#ff8f9a] transition-colors hover:bg-[#E63946]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8f9a]"
            >
              🚪 {t('Logout', 'Déconnexion')}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <div className="dl-fade-in text-center">
          <p className="inline-block rounded-full border border-[#B89A5A] bg-[#B89A5A]/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
            ★ {t('AGENT CLEARANCE UPGRADE', "MISE À NIVEAU D'HABILITATION")}
          </p>
          <h1 className="dl-display mt-5 text-[1.75rem] font-bold leading-tight text-[#F2EFE6] sm:text-5xl">
            {t('Unlock Full Investigation Clearance', "Débloquez l'accès complet aux enquêtes")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-[#F2EFE6]/70">
            {renewing
              ? t('Your clearance has ended. Choose a pass to get back to your cases.', "Votre habilitation est terminée. Choisissez un pass pour reprendre vos enquêtes.")
              : t('Your dossier is ready. Choose a pass to open every case.', 'Votre dossier est prêt. Choisissez un pass pour ouvrir tous les cas.')}
          </p>
        </div>

        {/* ============ ÉTAPE 1 : CHOIX DU PASS ============ */}
        {step === 1 && (
          <section className="dl-fade-in mt-9" aria-label={t('Choose a pass', 'Choisir un pass')}>
            <div role="radiogroup" aria-label={t('Passes', 'Pass')} className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-5">
              {PLANS.map((p) => {
                const on = selectedId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setSelectedId(p.id)}
                    className={`dl-lift relative flex flex-col rounded-2xl border-2 p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] ${
                      on
                        ? 'border-[#B89A5A] bg-gradient-to-b from-[#2d3d3e] to-[#1D2A3A] shadow-[0_0_60px_-24px_rgba(184,154,90,0.6)]'
                        : 'border-[#F2EFE6]/20 bg-gradient-to-b from-[#24364b] to-[#1D2A3A]'
                    }`}
                  >
                    {p.best && (
                      <span className="absolute -top-3 right-5 rounded-full bg-[#B89A5A] px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-[#0B0D0D]">
                        {t('BEST VALUE', 'MEILLEURE OFFRE')}
                      </span>
                    )}
                    <span className="flex items-center justify-between gap-3">
                      <span className="dl-display text-xl font-bold text-[#F2EFE6]">{t(p.enName, p.frName)}</span>
                      <span
                        aria-hidden="true"
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold ${
                          on ? 'border-[#B89A5A] bg-[#B89A5A] text-[#0B0D0D]' : 'border-[#F2EFE6]/35 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                    </span>
                    <span className="mt-4 flex items-baseline gap-2">
                      <span className="dl-display text-5xl font-bold text-[#B89A5A]">{p.price}</span>
                      <span className="text-lg font-semibold text-[#F2EFE6]">DA</span>
                      <span className="text-sm text-[#F2EFE6]/55">{t(p.enPeriod, p.frPeriod)}</span>
                    </span>
                    <span className="mt-1 text-sm text-[#F2EFE6]/65">{t(p.enNote, p.frNote)}</span>
                    <ul className="m-0 mt-5 flex list-none flex-col gap-2.5 p-0">
                      {FEATURES.map((f) => (
                        <li key={f.en} className="flex gap-2.5 text-sm leading-snug text-[#F2EFE6]/85">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2F7D5B] text-[10px] text-[#F2EFE6]" aria-hidden="true">
                            ✓
                          </span>
                          {t(f.en, f.fr)}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="mx-auto mt-8 max-w-md">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full rounded-lg border-0 bg-[#167C80] px-6 py-4 text-base font-semibold text-[#F2EFE6] shadow-lg shadow-[#167C80]/30 transition-all hover:-translate-y-0.5 hover:bg-[#1a9096] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0D]"
              >
                🔓 {t('Unlock Full Clearance', "Débloquer l'accès complet")} · {plan.price} DA
              </button>
              <p className="mt-3 text-center text-xs text-[#F2EFE6]/50">
                {t('Payment by BaridiMob transfer. Access is activated after we verify it.', "Paiement par virement BaridiMob. L'accès est activé après vérification.")}
              </p>
            </div>
          </section>
        )}

        {/* ============ ÉTAPE 2 : PAIEMENT ============ */}
        {step === 2 && (
          <section
            className="dl-fade-in mx-auto mt-9 max-w-xl rounded-2xl border border-[#B89A5A]/60 bg-[#1D2A3A] p-5 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] sm:p-8"
            aria-label={t('Payment instructions', 'Instructions de paiement')}
          >
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
              {t('PAYMENT', 'PAIEMENT')} · {t(plan.enName, plan.frName).toUpperCase()}
            </p>
            <h2 className="dl-display mt-1 text-2xl font-bold text-[#F2EFE6]">
              {t(`Send ${plan.price} DA by BaridiMob`, `Envoyez ${plan.price} DA par BaridiMob`)}
            </h2>

            {!configured && (
              <p role="alert" className="mt-4 rounded-lg border border-[#e8a08f]/50 bg-[#e8a08f]/10 px-4 py-3 text-sm text-[#f0b5a6]">
                {t(
                  'Payment details are not available yet. Please contact us on Telegram.',
                  "Les coordonnées de paiement ne sont pas encore disponibles. Contactez-nous sur Telegram."
                )}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-3">
              <CopyRow label="RIP" value={BARIDIMOB_INFO.rip} copyLabel={t('Copy', 'Copier')} copiedLabel={t('Copied ✓', 'Copié ✓')} />
              <CopyRow label={t('Account name', 'Nom du compte')} value={BARIDIMOB_INFO.name} mono={false} copyLabel={t('Copy', 'Copier')} copiedLabel={t('Copied ✓', 'Copié ✓')} />
              <CopyRow label={t('Phone', 'Téléphone')} value={BARIDIMOB_INFO.phone} copyLabel={t('Copy', 'Copier')} copiedLabel={t('Copied ✓', 'Copié ✓')} />
              <CopyRow label={t('Amount', 'Montant')} value={`${plan.price} DA`} mono={false} copyLabel={t('Copy', 'Copier')} copiedLabel={t('Copied ✓', 'Copié ✓')} />
            </div>

            <div className="mt-5 rounded-xl border-2 border-[#B89A5A] bg-[#B89A5A]/10 px-4 py-4 text-center">
              <p className="text-sm font-semibold text-[#F2EFE6]">
                {t('Write this code in the transfer note:', 'Écrivez ce code dans la note du virement :')}
              </p>
              <p className="dl-display mt-1 text-3xl font-bold tracking-[0.25em] text-[#B89A5A]">{reference}</p>
              <p className="mt-1 text-xs text-[#F2EFE6]/60">
                {t('It lets us match your payment to your account.', 'Il nous permet de relier votre paiement à votre compte.')}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={!configured || sending}
              className="mt-6 w-full rounded-lg border-0 bg-[#167C80] px-6 py-4 text-base font-semibold text-[#F2EFE6] shadow-lg shadow-[#167C80]/30 transition-colors hover:bg-[#1a9096] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D2A3A]"
            >
              {sending ? t('Sending...', 'Envoi...') : `✓ ${t("I've sent the payment", "J'ai envoyé le paiement")}`}
            </button>
            <p className="mt-2 text-center text-xs text-[#F2EFE6]/50">
              {t('Only tap this after the transfer is done.', "Appuyez ici seulement une fois le virement effectué.")}
            </p>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="mx-auto mt-4 block rounded border-0 bg-transparent p-0 text-sm text-[#F2EFE6]/70 underline underline-offset-4 hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
            >
              ← {t('Change pass', 'Changer de pass')}
            </button>
          </section>
        )}

        {/* ============ AIDE ============ */}
        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3 text-center text-sm text-[#F2EFE6]/65">
          <button
            type="button"
            onClick={handleCheck}
            disabled={checking}
            className="rounded-lg border border-[#3F628C] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#8fb0d6] transition-colors hover:bg-[#3F628C]/25 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8fb0d6]"
          >
            🔄 {checking ? t('Checking...', 'Vérification...') : t('Check my status', 'Vérifier mon statut')}
          </button>
          <p>
            {t('Need help?', "Besoin d'aide ?")}{' '}
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#B89A5A] underline underline-offset-4 hover:text-[#F2EFE6]">
              {t('Message us on Telegram', 'Écrivez-nous sur Telegram')}
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;