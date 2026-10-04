import React, { useState, useEffect, useCallback } from 'react';
import { fetchFeatureRequests, fetchPendingSubscriptions, fetchMembers } from '../utils/admin';
import { grantAccess, denyAccess, suspendAccess } from '../utils/subscription';
import Logo from './Logo';
import BackButton from './BackButton';
import './AdminPanel.css';

const DAY_MS = 24 * 60 * 60 * 1000;

const PLAN_OPTIONS = [
  { id: 'monthly', en: '1 month', fr: '1 mois' },
  { id: 'yearly', en: '1 year', fr: '1 an' },
  { id: 'free', en: 'Free (no expiry)', fr: 'Gratuit (sans expiration)' }
];

const AdminPanel = ({ onBack, currentLang, theme }) => {
  const en = currentLang === 'en';
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [messages, setMessages] = useState([]);
  const [pendingSubs, setPendingSubs] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyUid, setBusyUid] = useState(null);
  const [planChoice, setPlanChoice] = useState({});
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [msgs, subs, mems] = await Promise.all([
        fetchFeatureRequests(),
        fetchPendingSubscriptions(),
        fetchMembers()
      ]);
      setMessages(msgs);
      setPendingSubs(subs);
      setMembers(mems);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError(en ? 'Failed to load data.' : 'Échec du chargement des données.');
    }
    setLoading(false);
  }, [en]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getChoice = (uid, fallback) => planChoice[uid] || fallback;
  const setChoice = (uid, planId) => setPlanChoice(prev => ({ ...prev, [uid]: planId }));

  // Formule proposée par défaut : celle que le joueur dit avoir payée, sinon sa formule actuelle
  const defaultPlanFor = (item) =>
    item.requestedPlan || (item.plan && item.plan !== 'free' ? item.plan : 'monthly');

  const runAction = async (uid, action) => {
    setBusyUid(uid);
    const result = await action();
    if (!result.success) {
      alert(en ? 'Action failed. Please try again.' : "Échec de l'action. Réessaie.");
    }
    setBusyUid(null);
    await loadData();
  };

  const handleGrant = (item) => runAction(item.uid, () => grantAccess(item.uid, getChoice(item.uid, defaultPlanFor(item))));
  const handleDeny = (uid) => runAction(uid, () => denyAccess(uid));
  const handleSuspend = (uid, name) => {
    const ok = window.confirm(
      en ? `Cut access for ${name}? Their account and progress are kept.`
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
    const p = PLAN_OPTIONS.find(o => o.id === planId);
    if (!p) return '—';
    return en ? p.en : p.fr;
  };

  const memberState = (m) => {
    if (m.status === 'suspended') return 'suspended';
    if (m.status === 'denied') return 'denied';
    if (m.status === 'active' && m.expiresAt && m.expiresAt <= Date.now()) return 'expired';
    return 'active';
  };

  const stateInfo = {
    active: { en: 'Active', fr: 'Actif', color: '#2F7D5B' },
    expired: { en: 'Expired', fr: 'Expiré', color: '#B89A5A' },
    suspended: { en: 'Access cut', fr: 'Accès coupé', color: '#E63946' },
    denied: { en: 'Denied', fr: 'Refusé', color: '#7A7A7A' }
  };

  const badgeStyle = (color) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#FFFFFF',
    background: color
  });

  const selectStyle = {
    padding: '8px 10px',
    marginRight: '10px',
    background: 'rgba(255,255,255,0.06)',
    color: 'inherit',
    border: '1px solid rgba(184, 154, 90, 0.6)',
    borderRadius: '6px',
    fontFamily: 'inherit',
    fontSize: '12px'
  };

  const dangerButtonStyle = {
    marginLeft: '10px',
    padding: '8px 16px',
    background: 'rgba(230, 57, 70, 0.1)',
    border: '2px solid #E63946',
    color: '#FF6B7A',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: '600'
  };

  const searchStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    marginBottom: '14px',
    background: 'rgba(255,255,255,0.06)',
    color: 'inherit',
    border: '1px solid rgba(184, 154, 90, 0.6)',
    borderRadius: '6px',
    fontFamily: 'inherit',
    fontSize: '13px'
  };

  const paymentStyle = { color: '#B89A5A', fontWeight: '700' };

  const paymentLine = (item, showNone) => {
    if (item.paymentSentAt) {
      return (
        <p className="admin-card-message" style={paymentStyle}>
          💳 {en ? 'Payment sent' : 'Paiement signalé'}: {planLabel(item.requestedPlan)} — {formatDate(item.paymentSentAt)} — {en ? 'Ref' : 'Réf'}: {item.reference || '—'}
        </p>
      );
    }
    if (showNone) {
      return (
        <p className="admin-card-message">
          {en ? 'No payment reported yet.' : 'Aucun paiement signalé pour le moment.'}
        </p>
      );
    }
    return null;
  };

  const planSelect = (item) => (
    <select
      style={selectStyle}
      value={getChoice(item.uid, defaultPlanFor(item))}
      onChange={(e) => setChoice(item.uid, e.target.value)}
      disabled={busyUid === item.uid}
    >
      {PLAN_OPTIONS.map(o => (
        <option key={o.id} value={o.id} style={{ color: '#000' }}>{en ? o.en : o.fr}</option>
      ))}
    </select>
  );

  const paymentsWaiting = [...pendingSubs, ...members].filter(x => x.paymentSentAt).length;

  const query = search.trim().toLowerCase();
  const filteredMembers = members.filter(m =>
    !query ||
    (m.userName || '').toLowerCase().includes(query) ||
    (m.email || '').toLowerCase().includes(query) ||
    (m.reference || '').toLowerCase().includes(query)
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-left-group">
          <BackButton onClick={onBack} />
          <Logo variant="horizontal" theme={theme} />
        </div>
      </div>

      <div className="admin-content">
        <h1 className="admin-title">
          {en ? 'Admin Panel' : "Panneau d'Administration"}
        </h1>

        {paymentsWaiting > 0 && (
          <p className="admin-card-message" style={paymentStyle}>
            💳 {paymentsWaiting} {en ? 'payment(s) waiting for verification' : 'paiement(s) en attente de vérification'}
          </p>
        )}

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'subscriptions' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            {en ? 'Access requests' : "Demandes d'accès"} ({pendingSubs.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'members' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            {en ? 'Members' : 'Membres'} ({members.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'messages' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            {en ? 'Suggestions' : 'Suggestions'} ({messages.length})
          </button>
        </div>

        {loading && <p className="admin-empty">{en ? 'Loading...' : 'Chargement...'}</p>}
        {error && <p className="admin-error">{error}</p>}

        {/* ---- Demandes d'accès en attente ---- */}
        {!loading && !error && activeTab === 'subscriptions' && (
          <div className="admin-list">
            {pendingSubs.length === 0 && (
              <p className="admin-empty">
                {en ? 'No pending access requests.' : "Aucune demande d'accès en attente."}
              </p>
            )}
            {pendingSubs.map(sub => (
              <div key={sub.uid} className="admin-card">
                <div className="admin-card-header">
                  <span className="admin-card-name">{sub.userName || 'Anonyme'}</span>
                  <span className="admin-card-date">{formatDate(sub.requestedAt || sub.submittedAt)}</span>
                </div>
                <p className="admin-card-message">{sub.email || ''}</p>
                {paymentLine(sub, true)}
                <div>
                  {planSelect(sub)}
                  <button
                    className="admin-approve-btn"
                    onClick={() => handleGrant(sub)}
                    disabled={busyUid === sub.uid}
                  >
                    {busyUid === sub.uid ? '...' : `✓ ${en ? 'Give access' : "Donner l'accès"}`}
                  </button>
                  <button
                    style={dangerButtonStyle}
                    onClick={() => handleDeny(sub.uid)}
                    disabled={busyUid === sub.uid}
                  >
                    ✕ {en ? 'Deny' : 'Refuser'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- Membres : abonnements actifs, expirés, coupés, refusés ---- */}
        {!loading && !error && activeTab === 'members' && (
          <div className="admin-list">
            <input
              style={searchStyle}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={en ? 'Search by name, email or reference...' : 'Rechercher par nom, email ou référence...'}
            />
            {filteredMembers.length === 0 && (
              <p className="admin-empty">
                {en ? 'No members to show.' : 'Aucun membre à afficher.'}
              </p>
            )}
            {filteredMembers.map(m => {
              const state = memberState(m);
              const info = stateInfo[state];
              const daysLeft = m.expiresAt ? Math.ceil((m.expiresAt - Date.now()) / DAY_MS) : null;
              return (
                <div key={m.uid} className="admin-card">
                  <div className="admin-card-header">
                    <span className="admin-card-name">{m.userName || 'Anonyme'}</span>
                    <span style={badgeStyle(info.color)}>{en ? info.en : info.fr}</span>
                  </div>
                  <p className="admin-card-message">{m.email || ''}</p>
                  <p className="admin-card-message">
                    {en ? 'Plan' : 'Formule'}: <strong>{planLabel(m.plan)}</strong>
                    {' — '}
                    {en ? 'Started' : 'Début'}: <strong>{formatDay(m.activatedAt)}</strong>
                    {' — '}
                    {en ? 'Expires' : 'Expire'}:{' '}
                    <strong>
                      {m.expiresAt
                        ? formatDay(m.expiresAt)
                        : (m.status === 'active' ? (en ? 'never' : 'jamais') : '—')}
                    </strong>
                    {state === 'active' && daysLeft !== null && (
                      <span> ({daysLeft} {en ? 'days left' : 'jours restants'})</span>
                    )}
                  </p>
                  {paymentLine(m, false)}
                  <div>
                    {planSelect(m)}
                    <button
                      className="admin-approve-btn"
                      onClick={() => handleGrant(m)}
                      disabled={busyUid === m.uid}
                    >
                      {busyUid === m.uid
                        ? '...'
                        : state === 'active'
                          ? `🔄 ${en ? 'Renew' : 'Renouveler'}`
                          : `✓ ${en ? 'Give access back' : "Redonner l'accès"}`}
                    </button>
                    {state === 'active' && (
                      <button
                        style={dangerButtonStyle}
                        onClick={() => handleSuspend(m.uid, m.userName || m.email)}
                        disabled={busyUid === m.uid}
                      >
                        ✂ {en ? 'Cut access' : "Couper l'accès"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- Suggestions ---- */}
        {!loading && !error && activeTab === 'messages' && (
          <div className="admin-list">
            {messages.length === 0 && (
              <p className="admin-empty">
                {en ? 'No suggestions yet.' : 'Aucune suggestion pour le moment.'}
              </p>
            )}
            {messages.map(msg => (
              <div key={msg.id} className="admin-card">
                <div className="admin-card-header">
                  <span className="admin-card-name">{msg.name || 'Anonyme'}</span>
                  <span className="admin-card-date">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="admin-card-message">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;