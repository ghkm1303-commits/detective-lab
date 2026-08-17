import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase-config';

const Dashboard = ({ user, onLogout, onContinue }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user.uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.userInfo}>
          <h2 style={styles.greeting}>
            👋 Welcome, {userData?.name || user.email}!
          </h2>
          <p style={styles.email}>{user.email}</p>
        </div>
        <button
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔬 Detective Lab</h1>
          <p style={styles.subtitle}>Pharmacy Edition</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🎓 Welcome to Detective Lab!</h2>
          <p style={styles.description}>
            Master pharmaceutical knowledge through interactive games. Choose your specialty, practice different identification modes, and become an expert.
          </p>

          <div style={styles.features}>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>🎮</div>
              <div style={styles.featureContent}>
                <h3 style={styles.featureName}>Main Game</h3>
                <p style={styles.featureDesc}>Guess drugs from AI-given clues</p>
              </div>
            </div>

            <div style={styles.feature}>
              <div style={styles.featureIcon}>🧠</div>
              <div style={styles.featureContent}>
                <h3 style={styles.featureName}>Practice Mode</h3>
                <p style={styles.featureDesc}>AI guesses what you're thinking</p>
              </div>
            </div>

            <div style={styles.feature}>
              <div style={styles.featureIcon}>📖</div>
              <div style={styles.featureContent}>
                <h3 style={styles.featureName}>Dictionary</h3>
                <p style={styles.featureDesc}>Browse all pharmaceutical data</p>
              </div>
            </div>

            <div style={styles.feature}>
              <div style={styles.featureIcon}>➕</div>
              <div style={styles.featureContent}>
                <h3 style={styles.featureName}>Add Drugs</h3>
                <p style={styles.featureDesc}>Build your custom database</p>
              </div>
            </div>
          </div>

          <button
            style={styles.continueButton}
            onClick={onContinue}
          >
            ▶️ Continue to Modules
          </button>
        </div>

        <div style={styles.statsBox}>
          <div style={styles.stat}>
            <div style={styles.statValue}>∞</div>
            <div style={styles.statLabel}>Modules</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>📚</div>
            <div style={styles.statLabel}>Start Learning</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>🎯</div>
            <div style={styles.statLabel}>Track Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    position: 'relative',
    zIndex: 10
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(0, 217, 255, 0.1)'
  },
  userInfo: {
    flex: 1
  },
  greeting: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    color: 'var(--accent-gold)',
    margin: '0 0 5px 0'
  },
  email: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  logoutButton: {
    padding: '10px 20px',
    background: 'rgba(255, 71, 87, 0.15)',
    border: '2px solid var(--danger)',
    color: 'var(--danger)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '12px',
    fontFamily: 'inherit'
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '42px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 5px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  card: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '30px',
    marginBottom: '30px'
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    color: 'var(--accent-gold)',
    margin: '0 0 15px 0'
  },
  description: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    margin: '0 0 25px 0'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '25px'
  },
  feature: {
    display: 'flex',
    gap: '12px',
    padding: '15px',
    background: 'rgba(0, 217, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 217, 255, 0.1)'
  },
  featureIcon: {
    fontSize: '28px'
  },
  featureContent: {
    flex: 1
  },
  featureName: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: '0 0 4px 0'
  },
  featureDesc: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  continueButton: {
    width: '100%',
    padding: '14px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  statsBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px'
  },
  stat: {
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center'
  },
  statValue: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  loadingText: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '14px'
  }
};

export default Dashboard;