import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase-config';

const StatsPanel = ({ user, onBack, onLogout }) => {
  const [stats, setStats] = useState({
    totalGamesPlayed: 0,
    totalXP: 0,
    gameHistory: [],
    modeStats: {}
  });
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadStats();
    loadUserData();
  }, [user.uid]);

  const loadStats = () => {
    try {
      const savedStats = localStorage.getItem(`stats_${user.uid}`);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getModeEmoji = (mode) => {
    const emojis = {
      'blind': '🔍',
      'known': '📚',
      'practice': '🧠'
    };
    return emojis[mode] || '🎮';
  };

  const getModeLabel = (mode) => {
    const labels = {
      'blind': 'Blind Investigation',
      'known': 'Focused Investigation',
      'practice': 'Practice Mode'
    };
    return labels[mode] || mode;
  };

  const getLevel = () => {
    return Math.floor(stats.totalGamesPlayed / 5) + 1;
  };

  const getProgress = () => {
    const gamesInCurrentLevel = stats.totalGamesPlayed % 5;
    return (gamesInCurrentLevel / 5) * 100;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>
        <button style={styles.logoutButton} onClick={handleLogout}>🚪 Logout</button>
      </div>

      <h1 style={styles.title}>📊 Your Profile & Progress</h1>

      {/* PERSONAL INFO SECTION */}
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <div style={styles.profileAvatar}>
            {userData?.name ? userData.name.charAt(0).toUpperCase() : '👤'}
          </div>
          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>{userData?.name || 'User'}</h2>
            <p style={styles.profileEmail}>{user.email}</p>
            <p style={styles.profileMember}>
              Member since {userData?.createdAt 
                ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) 
                : 'Recently'}
            </p>
          </div>
        </div>

        <div style={styles.profileStats}>
          <div style={styles.profileStatItem}>
            <div style={styles.profileStatLabel}>Account Status</div>
            <div style={styles.profileStatValue}>{userData?.subscriptionStatus || 'Active'}</div>
          </div>
        </div>
      </div>

      {/* LEVEL & XP PROGRESS */}
      <div style={styles.levelSection}>
        <div style={styles.levelCard}>
          <div style={styles.levelNumber}>Level {getLevel()}</div>
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div style={{
                ...styles.progressFill,
                width: `${getProgress()}%`
              }}></div>
            </div>
            <p style={styles.progressText}>
              {stats.totalGamesPlayed % 5} / 5 games to next level
            </p>
          </div>
        </div>
      </div>

      {/* STATS SUMMARY */}
      <div style={styles.summaryGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.totalXP}</div>
          <div style={styles.statLabel}>Total XP</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.totalGamesPlayed}</div>
          <div style={styles.statLabel}>Games Played</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {stats.totalGamesPlayed > 0 
              ? Math.round((stats.gameHistory.filter(g => g.score > 500).length / stats.totalGamesPlayed) * 100)
              : 0}%
          </div>
          <div style={styles.statLabel}>Win Rate</div>
        </div>
      </div>

      {/* MODE BREAKDOWN */}
      {Object.keys(stats.modeStats).length > 0 && (
        <div style={styles.modeSection}>
          <h2 style={styles.sectionTitle}>📈 Performance by Mode</h2>
          <div style={styles.modeGrid}>
            {Object.entries(stats.modeStats).map(([mode, data]) => (
              <div key={mode} style={styles.modeCard}>
                <div style={styles.modeIcon}>{getModeEmoji(mode)}</div>
                <h3 style={styles.modeName}>{getModeLabel(mode)}</h3>
                <div style={styles.modeInfo}>
                  <p style={styles.modeData}>
                    Games: <span style={styles.modeValue}>{data.played}</span>
                  </p>
                  <p style={styles.modeData}>
                    Avg Score: <span style={styles.modeValue}>{Math.round(data.totalScore / data.played)}</span>
                  </p>
                  <p style={styles.modeData}>
                    Total XP: <span style={styles.modeValue}>{data.totalXP}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAME HISTORY */}
      {stats.gameHistory.length > 0 && (
        <div style={styles.historySection}>
          <h2 style={styles.sectionTitle}>🎮 Recent Games</h2>
          <div style={styles.historyList}>
            {stats.gameHistory.slice().reverse().slice(0, 10).map((game, idx) => (
              <div key={idx} style={styles.historyItem}>
                <div style={styles.historyLeft}>
                  <div style={styles.historyIcon}>{getModeEmoji(game.mode)}</div>
                  <div style={styles.historyInfo}>
                    <h4 style={styles.historyMode}>{getModeLabel(game.mode)}</h4>
                    <p style={styles.historyDrug}>Answered: <strong>{game.drugName}</strong></p>
                    <p style={styles.historyTime}>
                      {new Date(game.timestamp).toLocaleDateString()} {new Date(game.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
                <div style={styles.historyRight}>
                  <div style={styles.historyScore}>{game.score}</div>
                  <p style={styles.historyXP}>+{game.xpEarned} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.gameHistory.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>🎯</p>
          <p style={styles.emptyText}>No games played yet!</p>
          <p style={styles.emptySubtext}>Start playing to see your stats here</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '15px',
    position: 'relative',
    zIndex: 10
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    gap: '10px'
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid var(--border-glow)',
    color: 'var(--text-primary)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px'
  },
  logoutButton: {
    padding: '8px 16px',
    background: 'rgba(255, 71, 87, 0.1)',
    border: '1px solid rgba(255, 71, 87, 0.3)',
    color: 'var(--danger)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: '600'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    color: 'var(--accent-gold)',
    textAlign: 'center',
    margin: '0 0 30px 0'
  },
  profileCard: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '30px',
    maxWidth: '900px',
    margin: '0 auto 30px'
  },
  profileHeader: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(0, 217, 255, 0.1)'
  },
  profileAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-emerald) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--bg-primary)',
    flexShrink: 0
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    color: 'var(--accent-gold)',
    margin: '0 0 5px 0'
  },
  profileEmail: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '0 0 8px 0'
  },
  profileMember: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    margin: '0',
    fontStyle: 'italic'
  },
  profileStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '15px'
  },
  profileStatItem: {
    background: 'rgba(0, 217, 255, 0.05)',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid rgba(0, 217, 255, 0.1)'
  },
  profileStatLabel: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  profileStatValue: {
    fontSize: '13px',
    color: 'var(--accent-gold)',
    fontWeight: '700'
  },
  levelSection: {
    maxWidth: '900px',
    margin: '0 auto 30px',
    display: 'flex',
    justifyContent: 'center'
  },
  levelCard: {
    background: 'linear-gradient(135deg, rgba(0, 208, 132, 0.15) 0%, rgba(0, 217, 255, 0.15) 100%)',
    border: '2px solid var(--accent-emerald)',
    borderRadius: '10px',
    padding: '20px',
    width: '100%',
    maxWidth: '400px'
  },
  levelNumber: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--accent-emerald)',
    marginBottom: '15px',
    textAlign: 'center'
  },
  progressContainer: {
    width: '100%'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(0, 217, 255, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent-emerald) 0%, var(--accent-gold) 100%)',
    transition: 'width 0.3s ease'
  },
  progressText: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    margin: '0'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '40px',
    maxWidth: '900px',
    margin: '0 auto 40px'
  },
  statCard: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center'
  },
  statValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  modeSection: {
    maxWidth: '900px',
    margin: '0 auto 40px'
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    color: 'var(--accent-gold)',
    margin: '0 0 20px 0'
  },
  modeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  modeCard: {
    background: 'rgba(0, 217, 255, 0.05)',
    border: '2px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center'
  },
  modeIcon: {
    fontSize: '32px',
    marginBottom: '10px'
  },
  modeName: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: '0 0 12px 0'
  },
  modeInfo: {
    fontSize: '12px'
  },
  modeData: {
    color: 'var(--text-secondary)',
    margin: '6px 0',
    display: 'flex',
    justifyContent: 'space-between'
  },
  modeValue: {
    color: 'var(--accent-gold)',
    fontWeight: '700'
  },
  historySection: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  historyItem: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '8px',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  historyLeft: {
    display: 'flex',
    gap: '15px',
    flex: 1
  },
  historyIcon: {
    fontSize: '28px'
  },
  historyInfo: {
    flex: 1
  },
  historyMode: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 4px 0'
  },
  historyDrug: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    margin: '0 0 4px 0'
  },
  historyTime: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  historyRight: {
    textAlign: 'right'
  },
  historyScore: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    marginBottom: '4px'
  },
  historyXP: {
    fontSize: '11px',
    color: 'var(--accent-emerald)',
    fontWeight: '700',
    margin: '0'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    maxWidth: '900px',
    margin: '0 auto'
  },
  emptyIcon: {
    fontSize: '48px',
    margin: '0 0 15px 0'
  },
  emptyText: {
    fontSize: '16px',
    color: 'var(--text-primary)',
    fontWeight: '600',
    margin: '0 0 8px 0'
  },
  emptySubtext: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: '0'
  }
};

export default StatsPanel;