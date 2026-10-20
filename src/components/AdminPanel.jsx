import React, { useState, useEffect, useCallback } from 'react';
import { fetchFeatureRequests, fetchPendingSubscriptions, fetchMembers, ADMIN_EMAIL } from '../utils/admin';
import { grantAccess, denyAccess, suspendAccess } from '../utils/subscription';
import Logo from './Logo';
import '../tailwind.css';
import '../detective.css';

/* ------------------------------------------------------------------ */
/*  Detective Labs — Admin panel                                       */
/*  Même logique qu'avant (accès, membres, suggestions), nouveau look. */
/*  Rappel : la vraie protection des données, ce sont les règles       */
/*  Firestore. L'écran "403" ci-dessous masque seulement la page.      */
/* ------------------------------------------------------------------ */

const DAY_MS = 24 * 60 * 60 * 1000;

const PLAN_OPTIONS = [
  { id: 'monthly', en: '1 month', fr: '1 mois' },
  { id: 'yearly', en: '1 year', fr: '1 an' },
  { id: 'free', en: 'Free (no expiry)', fr: 'Gratuit (sans expiration)' },
];

const STATE_INFO = {
  active: { en: 'Active', fr: 'Actif', cls: 'bg-[#2F7D5B] text-[#F2EFE6]' },
  expired: { en: 'Expired', fr: 'Expiré', cls: 'bg-[#B89A5A] text-[#0B0D0D]' },
  suspended: { en: 'Access cut', fr: 'Accès coupé', cls: 'bg-[#E63946] text-[#F2EFE6]' },
  denied: { en: 'Denied', fr: 'Refusé', cls: 'bg-[#6b7280] text-[#F2EFE6]' },
};

const selectStyle = {
  padding: '0.7rem 0.8rem',
  background: '#0B0D0D',
  color: '#F2EFE6',
  border: '1.5px solid rgba(184, 154, 90, 0.6)',
  borderRadius: '0.5rem',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
};

const AdminPanel = ({ user, onBack, currentLang, theme }) => {
  const en = currentLang === 'en';
  // Verrou strict : seul le compte detectivelabstudios@gmail.com (ADMIN_EMAIL) voit le panneau
  const allowed = user?.email === ADMIN_EMAIL;

  const [activeTab, setActiveTab] = useState('subscriptions');
  const [messages, setMessages] = useState([]);
  const [pendingSubs, setPendingSubs] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyUid, setBusyUid] = useState(null);
  const [planChoice, setPlanChoice] = useState({});
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    if (!allowed) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [msgs, subs, mems] = await Promise.all([
        fetchFeatureRequests(),
        fetchPendingSubscriptions(),
        fetchMembers(),
      ]);
      setMessages(msgs);
      setPendingSubs(subs);
      setMembers(mems);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError(en ? 'Failed to load data.' : 'Échec du chargement des données.');
    }
    setLoading(false);
  }, [en, allowed]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---------- Écran 403 : l'accès est réservé à l'admin ---------- */
  if (!allowed) {
    return (
      <div className="dl-app relative isolate flex items-center justify-center overflow-x-clip px-4 py-10">
        <div className="dl-app-bg" aria-hidden="true" />
        <main className="relative z-10 w-full max-w-md rounded-2xl border-2 border-[#B89A5A] bg-[#1D2A3A] px-6 py-10 text-center shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)]">
          <p className="dl-display text-6xl font-bold text-[#B89A5A]">403</p>
          <h1 className="dl-display mt-4 text-xl font-bold tracking-wide text-[#F2EFE6] sm:text-2xl">
            RESTRICTED DOSSIER
          </h1>
          <p className="mt-1 text-sm font-semibold tracking-[0.14em] text-[#B89A5A]">ACCESS DENIED</p>
          <p className="mt-4 text-sm leading-relaxed text-[#F2EFE6]/70">
            {en
              ? 'This file is reserved for the Detective Labs owner.'
              : 'Ce dossier est réservé au propriétaire de Detective Labs.'}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-7 rounded-lg border-0 bg-[#167C80] px-6 py-3 text-sm font-semibold text-[#F2EFE6] shadow-lg shadow-[#167C80]/25 transition-colors hover:bg-[#1a9096] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6]"
          >
            ← {en ? 'Return' : 'Retour'}
          </button>
        </main>
      </div>
    );
  }

  /* ---------- Logique (inchangée) ---------- */

  const getChoice = (uid, fallback) => planChoice[uid] || fallback;
  const setChoice = (uid, planId) => setPlanChoice((prev) => ({ ...prev, [uid]: planId }));

  // Formule proposée par défaut : celle que le joueur dit avoir payée, sinon sa formule actuelle
  const defaultPlanFor = (item) =>
    item.requestedPlan || (item.plan && item.plan !== 'free' ? item.plan : 'monthly');

  const runAction = async (uid, action) => {
    setBusyUid(uid);
    setActionError('');
    const result = await action();
    if (!result.success) {
      setActionError(en ? 'Action failed. Please try again.' : "Échec de l'action. Réessaie.");
    }
    setBusyUid(null);
    await loadData();
  };

  const handleGrant = (item) =>
    runAction(item.uid, () => grantAccess(item.uid, getChoice(item.uid, defaultPlanFor(item))));
  const handleDeny = (uid) => runAction(uid, () => denyAccess(uid));
  const handleSuspend = (uid, name) => {
    const ok = window.confirm(
      en
        ? `Cut access for ${name}? Their account and progress are kept.`
        : `Couper l'accès de ${name} ? Son compte et sa progression sont conservés.`
    );
    if (ok) runAction(uid, () => suspendAccess(uid));
  };

  const formatDate = (value) => {
    if (!value) return '';
    if (value.toDate) return value.toDate().toLocaleString();
    return new Date(value).toLocaleString();
  };
  const formatDay = (value) => (value ? new Date(value).toLocaleDateString() : '—');

  const planLabel = (planId) => {
    const p = PLAN_OPTIONS.find((o) => o.id === planId);
    if (!p) return '—';
    return en ? p.en : p.fr;
  };

  const memberState = (m) => {
    if (m.status === 'suspended') return 'suspended';
    if (m.status === 'denied') return 'denied';
    if (m.status === 'active' && m.expiresAt && m.expiresAt <= Date.now()) return 'expired';
    return 'active';
  };

  const paymentsWaiting = [...pendingSubs, ...members].filter((x) => x.paymentSentAt).length;

  const query = search.trim().toLowerCase();
  const filteredMembers = members.filter(
    (m) =>
      !query ||
      (m.userName || '').toLowerCase().includes(query) ||
      (m.email || '').toLowerCase().includes(query) ||
      (m.reference || '').toLowerCase().includes(query)
  );

  /* ---------- Petits morceaux d'interface ---------- */

  const paymentLine = (item, showNone) => {
    if (item.paymentSentAt) {
      return (
        <p className="mt-3 rounded-lg border border-[#B89A5A]/60 bg-[#B89A5A]/10 px-3 py-2 text-sm font-semibold text-[#B89A5A]">
          💳 {en ? 'Payment sent' : 'Paiement signalé'}: {planLabel(item.requestedPlan)} — {formatDate(item.paymentSentAt)} — {en ? 'Ref' : 'Réf'}:{' '}
          <span className="tracking-widest">{item.reference || '—'}</span>
        </p>
      );
    }
    if (showNone) {
      return (
        <p className="mt-3 text-sm text-[#F2EFE6]/50">
          {en ? 'No payment reported yet.' : 'Aucun paiement signalé pour le moment.'}
        </p>
      );
    }
    return null;
  };

  const planSelect = (item) => (
    <select
      aria-label={en ? 'Plan' : 'Formule'}
      style={selectStyle}
      value={getChoice(item.uid, defaultPlanFor(item))}
      onChange={(e) => setChoice(item.uid, e.target.value)}
      disabled={busyUid === item.uid}
    >
      {PLAN_OPTIONS.map((o) => (
        <option key={o.id} value={o.id} style={{ background: '#1D2A3A', color: '#F2EFE6' }}>
          {en ? o.en : o.fr}
        </option>
      ))}
    </select>
  );

  const primaryBtn =
    'rounded-lg border-0 bg-[#167C80] px-4 py-2.5 text-sm font-semibold text-[#F2EFE6] shadow-lg shadow-[#167C80]/25 transition-colors hover:bg-[#1a9096] disabled:cursor-wait disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6]';
  const dangerBtn =
    'rounded-lg border border-[#E63946]/70 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#ff8f9a] transition-colors hover:bg-[#E63946]/10 disabled:cursor-wait disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8f9a]';
  const cardCls =
    'rounded-xl border border-[#B89A5A]/40 bg-gradient-to-b from-[#24364b] to-[#1D2A3A] p-4 shadow-[0_14px_36px_-18px_rgba(0,0,0,0.85)] sm:p-5';

  const tabs = [
    { id: 'subscriptions', label: en ? 'Access requests' : "Demandes d'accès", count: pendingSubs.length },
    { id: 'members', label: en ? 'Members' : 'Membres', count: members.length },
    { id: 'messages', label: 'Suggestions', count: messages.length },
  ];

  return (
    <div className="dl-app relative isolate overflow-x-clip">
      <div className="dl-app-bg" aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-[#B89A5A]/25 bg-[#1D2A3A]/95 shadow-lg shadow-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-lg border border-[#F2EFE6]/25 bg-transparent px-3.5 py-2 text-sm font-medium text-[#F2EFE6] transition-colors hover:border-[#B89A5A] hover:text-[#B89A5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
            >
              <span aria-hidden="true">←</span> {en ? 'Back' : 'Retour'}
            </button>
            <div className="hidden sm:block">
              <Logo variant="horizontal" theme={theme} />
            </div>
          </div>
          <span className="rounded-full border border-[#B89A5A] bg-[#B89A5A]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#B89A5A]">
            🛠️ ADMIN
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="dl-display text-[1.65rem] font-bold leading-tight text-[#F2EFE6] sm:text-4xl">
              {en ? 'Admin Panel' : "Panneau d'Administration"}
            </h1>
            <p className="mt-1 text-sm text-[#F2EFE6]/60">
              {en ? 'Approve students, manage members, read feedback.' : 'Validez les étudiants, gérez les membres, lisez les retours.'}
            </p>
          </div>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="rounded-lg border border-[#F2EFE6]/25 bg-transparent px-4 py-2 text-sm font-medium text-[#F2EFE6] transition-colors hover:border-[#B89A5A] hover:text-[#B89A5A] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89A5A]"
          >
            ↻ {en ? 'Refresh' : 'Actualiser'}
          </button>
        </div>

        {/* Résumé */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[#F2EFE6]/15 bg-[#1D2A3A] px-3 py-3 text-center sm:px-4">
            <p className="dl-display text-2xl font-bold text-[#B89A5A]">{pendingSubs.length}</p>
            <p className="text-xs text-[#F2EFE6]/60">{en ? 'Pending' : 'En attente'}</p>
          </div>
          <div className="rounded-xl border border-[#F2EFE6]/15 bg-[#1D2A3A] px-3 py-3 text-center sm:px-4">
            <p className="dl-display text-2xl font-bold text-[#7fd1a6]">
              {members.filter((m) => memberState(m) === 'active').length}
            </p>
            <p className="text-xs text-[#F2EFE6]/60">{en ? 'Active members' : 'Membres actifs'}</p>
          </div>
          <div className="rounded-xl border border-[#F2EFE6]/15 bg-[#1D2A3A] px-3 py-3 text-center sm:px-4">
            <p className="dl-display text-2xl font-bold text-[#B89A5A]">{paymentsWaiting}</p>
            <p className="text-xs text-[#F2EFE6]/60">{en ? 'Payments to check' : 'Paiements à vérifier'}</p>
          </div>
        </div>

        {paymentsWaiting > 0 && (
          <p className="mt-4 rounded-lg border border-[#B89A5A]/60 bg-[#B89A5A]/10 px-4 py-3 text-sm font-semibold text-[#B89A5A]">
            💳 {paymentsWaiting} {en ? 'payment(s) waiting for verification' : 'paiement(s) en attente de vérification'}
          </p>
        )}

        {/* Onglets */}
        <div role="tablist" aria-label="Admin sections" className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2EFE6] ${
                activeTab === tab.id
                  ? 'border border-[#3F628C] bg-[#3F628C] text-[#F2EFE6]'
                  : 'border border-[#F2EFE6]/20 bg-transparent text-[#F2EFE6]/75 hover:border-[#3F628C]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {loading && <p className="mt-8 text-center text-sm text-[#F2EFE6]/60">{en ? 'Loading...' : 'Chargement...'}</p>}
        {error && (
          <p role="alert" className="mt-6 rounded-lg border border-[#e8a08f]/40 bg-[#e8a08f]/10 px-4 py-3 text-sm text-[#f0b5a6]">
            {error}
          </p>
        )}
        {actionError && (
          <p role="alert" className="mt-6 rounded-lg border border-[#e8a08f]/40 bg-[#e8a08f]/10 px-4 py-3 text-sm text-[#f0b5a6]">
            {actionError}
          </p>
        )}

        {/* ---- Demandes d'accès en attente ---- */}
        {!loading && !error && activeTab === 'subscriptions' && (
          <div className="mt-5 flex flex-col gap-4">
            {pendingSubs.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#F2EFE6]/20 px-4 py-10 text-center text-sm text-[#F2EFE6]/60">
                {en ? 'No pending access requests.' : "Aucune demande d'accès en attente."}
              </p>
            )}
            {pendingSubs.map((sub) => (
              <article key={sub.uid} className={cardCls}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="dl-display text-lg font-bold text-[#F2EFE6]">{sub.userName || 'Anonyme'}</h3>
                  <span className="text-xs text-[#F2EFE6]/50">{formatDate(sub.requestedAt || sub.submittedAt)}</span>
                </div>
                <p className="mt-1 break-all text-sm text-[#F2EFE6]/70">{sub.email || ''}</p>
                {paymentLine(sub, true)}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                  {planSelect(sub)}
                  <button type="button" className={primaryBtn} onClick={() => handleGrant(sub)} disabled={busyUid === sub.uid}>
                    {busyUid === sub.uid ? '...' : `✓ ${en ? 'Give access' : "Donner l'accès"}`}
                  </button>
                  <button type="button" className={dangerBtn} onClick={() => handleDeny(sub.uid)} disabled={busyUid === sub.uid}>
                    ✕ {en ? 'Deny' : 'Refuser'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ---- Membres : actifs, expirés, coupés, refusés ---- */}
        {!loading && !error && activeTab === 'members' && (
          <div className="mt-5 flex flex-col gap-4">
            <label htmlFor="admin-search" className="sr-only">
              {en ? 'Search members' : 'Rechercher un membre'}
            </label>
            <input
              id="admin-search"
              type="search"
              className="dl-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={en ? 'Search by name, email or reference...' : 'Rechercher par nom, email ou référence...'}
            />
            {filteredMembers.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#F2EFE6]/20 px-4 py-10 text-center text-sm text-[#F2EFE6]/60">
                {en ? 'No members to show.' : 'Aucun membre à afficher.'}
              </p>
            )}
            {filteredMembers.map((m) => {
              const state = memberState(m);
              const info = STATE_INFO[state];
              const daysLeft = m.expiresAt ? Math.ceil((m.expiresAt - Date.now()) / DAY_MS) : null;
              return (
                <article key={m.uid} className={cardCls}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="dl-display text-lg font-bold text-[#F2EFE6]">{m.userName || 'Anonyme'}</h3>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${info.cls}`}>{en ? info.en : info.fr}</span>
                  </div>
                  <p className="mt-1 break-all text-sm text-[#F2EFE6]/70">{m.email || ''}</p>
                  <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-xs text-[#F2EFE6]/50">{en ? 'Plan' : 'Formule'}</dt>
                      <dd className="m-0 font-semibold text-[#F2EFE6]">{planLabel(m.plan)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#F2EFE6]/50">{en ? 'Started' : 'Début'}</dt>
                      <dd className="m-0 font-semibold text-[#F2EFE6]">{formatDay(m.activatedAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#F2EFE6]/50">{en ? 'Expires' : 'Expire'}</dt>
                      <dd className="m-0 font-semibold text-[#F2EFE6]">
                        {m.expiresAt ? formatDay(m.expiresAt) : m.status === 'active' ? (en ? 'never' : 'jamais') : '—'}
                        {state === 'active' && daysLeft !== null && (
                          <span className="font-normal text-[#B89A5A]">
                            {' '}
                            ({daysLeft} {en ? 'days left' : 'jours restants'})
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>
                  {paymentLine(m, false)}
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                    {planSelect(m)}
                    <button type="button" className={primaryBtn} onClick={() => handleGrant(m)} disabled={busyUid === m.uid}>
                      {busyUid === m.uid
                        ? '...'
                        : state === 'active'
                          ? `🔄 ${en ? 'Renew' : 'Renouveler'}`
                          : `✓ ${en ? 'Give access back' : "Redonner l'accès"}`}
                    </button>
                    {state === 'active' && (
                      <button
                        type="button"
                        className={dangerBtn}
                        onClick={() => handleSuspend(m.uid, m.userName || m.email)}
                        disabled={busyUid === m.uid}
                      >
                        ✂ {en ? 'Cut access' : "Couper l'accès"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ---- Suggestions ---- */}
        {!loading && !error && activeTab === 'messages' && (
          <div className="mt-5 flex flex-col gap-4">
            {messages.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#F2EFE6]/20 px-4 py-10 text-center text-sm text-[#F2EFE6]/60">
                {en ? 'No suggestions yet.' : 'Aucune suggestion pour le moment.'}
              </p>
            )}
            {messages.map((msg) => (
              <article key={msg.id} className={cardCls}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="dl-display text-lg font-bold text-[#F2EFE6]">{msg.name || 'Anonyme'}</h3>
                  <span className="text-xs text-[#F2EFE6]/50">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#F2EFE6]/80">
                  {msg.message}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;