import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

const StatsPanel = ({ user, userName, onBack, onLogout, theme, onThemeChange, currentLang = 'en', onLanguageChange }) => {
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem(`stats_${user.uid}`);
      return saved ? JSON.parse(saved) : {
        totalGamesPlayed: 0,
        totalXP: 0,
        gameHistory: [],
        modeStats: {}
      };
    } catch {
      return { totalGamesPlayed: 0, totalXP: 0, gameHistory: [], modeStats: {} };
    }
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userLevel = Math.floor(stats.totalXP / 100) + 1;
  const textContent = {
    en: {
      title: '📊 Your Profile & Progress',
      level: 'Level',
      gamesPlayed: 'Games Played',
      totalXP: 'Total XP',
      memberSince: 'Member Since',
      accountStatus: 'Account Status',
      modeStats: '📈 Mode Statistics',
      blindMode: '🔍 Blind Mode',
      focusedMode: '📚 Focused Mode',
      games: 'games',
      recentGames: '🎮 Recent Games',
      logout: '🚪 Logout',
      back: '← Back',
      xpToNextLevel: 'XP to next level',
      premium: 'Premium',
      active: 'Active'
    },
    fr: {
      title: '📊 Votre Profil et Progression',
      level: 'Niveau',
      gamesPlayed: 'Jeux Joués',
      totalXP: 'XP Total',
      memberSince: 'Membre Depuis',
      accountStatus: 'État du Compte',
      modeStats: '📈 Statistiques par Mode',
      blindMode: '🔍 Mode Aveugle',
      focusedMode: '📚 Mode Ciblé',
      games: 'jeux',
      recentGames: '🎮 Jeux Récents',
      logout: '🚪 Déconnexion',
      back: '← Retour',
      xpToNextLevel: 'XP jusqu\'au prochain niveau',
      premium: 'Premium',
      active: 'Actif'
    }
  };

  const t = textContent[currentLang] || textContent.en;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          {t.back}
        </button>
        <div style={styles.rightGroup}>
          <LanguageToggle currentLang={currentLang} onLanguageChange={onLanguageChange} />
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          <button style={styles.logoutButton} onClick={handleLogout}>
            {t.logout}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.pageTitle}>{t.title}</h1>

        <div style={styles.topGrid}>
          <div style={styles.card}>
            <div style={styles.userAvatarSection}>
              <div style={styles.userAvatar}>👤</div>
              <div>
                <h2 style={styles.userName}>{userName}</h2>
                <p style={styles.userEmail}>{user.email}</p>
              </div>
            </div>
            <div style={styles.statusBadge}>{t.active}</div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.levelTitle}>{t.level} {userLevel}</h3>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${((stats.totalXP % 100) / 100) * 100}%`
                }}
              ></div>
            </div>
            <p style={styles.progressText}>{stats.totalXP % 100} / 100 {t.xpToNextLevel}</p>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h4 style={styles.statLabel}>{t.gamesPlayed}</h4>
            <p style={styles.statValue}>{stats.totalGamesPlayed}</p>
          </div>
          <div style={styles.statCard}>
            <h4 style={styles.statLabel}>{t.totalXP}</h4>
            <p style={styles.statValue}>{stats.totalXP}</p>
          </div>
          <div style={styles.statCard}>
            <h4 style={styles.statLabel}>{t.memberSince}</h4>
            <p style={styles.statValue}>{new Date(user.metadata.creationTime).toLocaleDateString()}</p>
          </div>
          <div style={styles.statCard}>
            <h4 style={styles.statLabel}>{t.accountStatus}</h4>
            <p style={styles.statValue}>{t.premium}</p>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>{t.modeStats}</h3>
          <div style={styles.modeStatsGrid}>
            <div style={styles.modeStatCard}>
              <p style={styles.modeLabel}>{t.blindMode}</p>
              <p style={styles.modeStat}>{stats.modeStats['blind']?.played || 0} {t.games}</p>
              <p style={styles.modeXP}>{stats.modeStats['blind']?.totalXP || 0} XP</p>
            </div>
            <div style={styles.modeStatCard}>
              <p style={styles.modeLabel}>{t.focusedMode}</p>
              <p style={styles.modeStat}>{stats.modeStats['known']?.played || 0} {t.games}</p>
              <p style={styles.modeXP}>{stats.modeStats['known']?.totalXP || 0} XP</p>
            </div>
          </div>
        </div>

        {stats.gameHistory.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>{t.recentGames}</h3>
            <div style={styles.historyList}>
              {stats.gameHistory.slice(-5).reverse().map((game, idx) => (
                <div key={idx} style={styles.historyItem}>
                  <div>
                    <p style={styles.drugName}>{game.drugName}</p>
                    <p style={styles.gameMode}>{game.mode === 'blind' ? '🔍 Blind' : '📚 Focused'} • {game.cluesUsed} clues</p>
                  </div>
                  <p style={styles.gameScore}>{game.score} pts</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '15px',
    position: 'relative',
    zIndex: 10,
    background: 'linear-gradient(135deg, var(--bg-obsidian) 0%, var(--bg-dark) 100%)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid var(--border-teal)',
    flexWrap: 'wrap',
    gap: '10px'
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(184, 154, 90, 0.1)',
    border: '2px solid #B89A5A',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: '600'
  },
  rightGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  logoutButton: {
    padding: '8px 16px',
    background: 'rgba(230, 57, 70, 0.1)',
    border: '2px solid #E63946',
    color: '#FF6B7A',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: '600'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  pageTitle: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#B89A5A',
    fontSize: '32px',
    fontFamily: "'Playfair Display', serif"
  },
  topGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  card: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid rgba(184, 154, 90, 0.2)',
    borderRadius: '10px',
    padding: '20px',
    transition: 'all 0.3s ease'
  },
  userAvatarSection: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    marginBottom: '15px'
  },
  userAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(184, 154, 90, 0.3), rgba(22, 124, 128, 0.3))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    border: '2px solid #B89A5A'
  },
  userName: {
    color: '#B89A5A',
    fontSize: '18px',
    margin: '0 0 5px 0',
    fontFamily: "'Playfair Display', serif"
  },
  userEmail: {
    color: 'var(--text-secondary)',
    fontSize: '12px',
    margin: '0'
  },
  statusBadge: {
    display: 'inline-block',
    background: 'rgba(47, 125, 91, 0.2)',
    color: '#2F7D5B',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700'
  },
  levelTitle: {
    color: '#B89A5A',
    fontSize: '24px',
    margin: '0 0 15px 0',
    fontFamily: "'Playfair Display', serif"
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(47, 125, 91, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '10px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #167C80, #2F7D5B)',
    borderRadius: '10px',
    transition: 'width 0.3s ease'
  },
  progressText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid rgba(47, 125, 91, 0.2)',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center'
  },
  statLabel: {
    color: 'var(--text-secondary)',
    fontSize: '11px',
    fontWeight: '700',
    margin: '0 0 10px 0',
    textTransform: 'uppercase'
  },
  statValue: {
    color: '#B89A5A',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0',
    fontFamily: "'Playfair Display', serif"
  },
  sectionTitle: {
    color: '#B89A5A',
    fontSize: '18px',
    margin: '0 0 15px 0',
    fontFamily: "'Playfair Display', serif"
  },
  modeStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px'
  },
  modeStatCard: {
    background: 'rgba(47, 125, 91, 0.1)',
    border: '1px solid rgba(47, 125, 91, 0.2)',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center'
  },
  modeLabel: {
    fontSize: '12px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: 'var(--text-primary)'
  },
  modeStat: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#167C80',
    margin: '0 0 5px 0'
  },
  modeXP: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(47, 125, 91, 0.05)',
    borderRadius: '6px',
    borderLeft: '3px solid #167C80'
  },
  drugName: {
    color: '#B89A5A',
    fontSize: '13px',
    fontWeight: '700',
    margin: '0 0 5px 0'
  },
  gameMode: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  gameScore: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2F7D5B',
    margin: '0'
  }
};

export default StatsPanel;