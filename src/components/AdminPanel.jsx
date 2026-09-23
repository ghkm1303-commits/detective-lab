import React, { useState, useEffect, useCallback } from 'react';
import { fetchFeatureRequests, fetchPendingSubscriptions } from '../utils/admin';
import { approveSubscription } from '../utils/subscription';
import Logo from './Logo';
import BackButton from './BackButton';
import './AdminPanel.css';

const AdminPanel = ({ onBack, currentLang, theme }) => {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [messages, setMessages] = useState([]);
  const [pendingSubs, setPendingSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvingUid, setApprovingUid] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [msgs, subs] = await Promise.all([
        fetchFeatureRequests(),
        fetchPendingSubscriptions()
      ]);
      setMessages(msgs);
      setPendingSubs(subs);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError(currentLang === 'en' ? 'Failed to load data.' : 'Échec du chargement des données.');
    }
    setLoading(false);
  }, [currentLang]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (uid) => {
    setApprovingUid(uid);
    const result = await approveSubscription(uid);
    if (result.success) {
      setPendingSubs(prev => prev.filter(s => s.uid !== uid));
    } else {
      alert(currentLang === 'en' ? 'Failed to approve subscription.' : "Échec de l'approbation de l'abonnement.");
    }
    setApprovingUid(null);
  };

  const formatDate = (value) => {
    if (!value) return '';
    if (value.toDate) return value.toDate().toLocaleString();
    return new Date(value).toLocaleString();
  };

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
          {currentLang === 'en' ? 'Admin Panel' : "Panneau d'Administration"}
        </h1>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'subscriptions' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            {currentLang === 'en' ? 'Subscriptions' : 'Abonnements'} ({pendingSubs.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'messages' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            {currentLang === 'en' ? 'Suggestions' : 'Suggestions'} ({messages.length})
          </button>
        </div>

        {loading && <p className="admin-empty">{currentLang === 'en' ? 'Loading...' : 'Chargement...'}</p>}
        {error && <p className="admin-error">{error}</p>}

        {!loading && !error && activeTab === 'subscriptions' && (
          <div className="admin-list">
            {pendingSubs.length === 0 && (
              <p className="admin-empty">
                {currentLang === 'en' ? 'No pending subscriptions.' : 'Aucun abonnement en attente.'}
              </p>
            )}
            {pendingSubs.map(sub => (
              <div key={sub.uid} className="admin-card">
                <div className="admin-card-header">
                  <span className="admin-card-name">{sub.userName || 'Anonyme'}</span>
                  <span className="admin-card-date">{formatDate(sub.submittedAt)}</span>
                </div>
                <p className="admin-card-message">
                  {currentLang === 'en' ? 'Plan' : 'Formule'}: <strong>{sub.plan}</strong> — {sub.price}
                </p>
                <button
                  className="admin-approve-btn"
                  onClick={() => handleApprove(sub.uid)}
                  disabled={approvingUid === sub.uid}
                >
                  {approvingUid === sub.uid
                    ? (currentLang === 'en' ? 'Approving...' : 'Approbation...')
                    : `✓ ${currentLang === 'en' ? 'Approve' : 'Approuver'}`}
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && activeTab === 'messages' && (
          <div className="admin-list">
            {messages.length === 0 && (
              <p className="admin-empty">
                {currentLang === 'en' ? 'No suggestions yet.' : 'Aucune suggestion pour le moment.'}
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