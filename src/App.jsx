import { useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import PendingConfirmationPage from './components/PendingConfirmationPage';
import SubjectSelector from './components/SubjectSelector';
import StatsPanel from './components/StatsPanel';
import ModeSelector from './components/ModeSelector';
import PracticeMode from './components/PracticeMode';
import ResultScreen from './components/ResultScreen';
import ParasiteClassSelector from './components/parasitology/ParasiteClassSelector';
import ParasiteGame from './components/parasitology/ParasiteGame';
import ParasiteDirectory from './components/parasitology/ParasiteDirectory';
import ParasiteLessonSelector from './components/parasitology/ParasiteLessonSelector';
import PharmaClassSelector from './components/pharmacology/PharmaClassSelector';
import PharmaGame from './components/pharmacology/PharmaGame';
import PharmaDirectory from './components/pharmacology/PharmaDirectory';
import parasitesData from './data/parasites.json';
import pharmaV2Data from './data/pharmacology_drugs_v2.json';
import './App.css';
import Logo from './components/Logo';
import { isAdmin } from './utils/admin';
import { getAccessStatus, requestAccess } from './utils/subscription';

// Accès sur approbation : chaque nouveau compte envoie une demande d'accès, que l'admin
// approuve ou refuse depuis le panneau d'administration. L'admin choisit la formule
// (1 mois, 1 an ou gratuit) et peut couper / redonner l'accès depuis l'onglet Membres.
// Mettre à false pour désactiver complètement la vérification (accès direct après connexion).
const SUBSCRIPTION_ENABLED = true;

export default function App() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [screen, setScreen] = useState('dashboard');
  const [authMode, setAuthMode] = useState(null);
  const [parasites] = useState(parasitesData.organisms);
  const [pharmaV2Drugs] = useState(pharmaV2Data.drugs);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [gameMode, setGameMode] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // subStatus: null (chargement) | 'pending' | 'active' | 'expired' | 'suspended' | 'denied' | 'error'
  const [subStatus, setSubStatus] = useState(null);
  const checkingUidRef = useRef(null);

  useEffect(() => {
    setTheme('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('detective-lab-theme', newTheme);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const name = currentUser.displayName || currentUser.email.split('@')[0];
        setUserName(name);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const checkSubscription = useCallback(async () => {
    if (!user) return;
    if (isAdmin(user)) {
      setSubStatus('active');
      return;
    }
    // Évite deux vérifications simultanées pour le même compte
    if (checkingUidRef.current === user.uid) return;
    checkingUidRef.current = user.uid;
    try {
      const name = user.displayName || (user.email ? user.email.split('@')[0] : '');
      let result = await getAccessStatus(user.uid);
      if (result.status === 'none') {
        // Premier passage de ce compte : on crée automatiquement sa demande d'accès
        await requestAccess(user.uid, name, user.email || '');
        result = await getAccessStatus(user.uid);
        if (result.status === 'none') result = { status: 'error' };
      }
      setSubStatus(result.status);
    } finally {
      checkingUidRef.current = null;
    }
  }, [user]);

  useEffect(() => {
    if (!SUBSCRIPTION_ENABLED) return;
    if (user) {
      setSubStatus(null); // repasse en "chargement" le temps de vérifier
      checkSubscription();
    }
  }, [user, checkSubscription]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', color: 'var(--text-secondary)' }}>
        <Logo variant="stacked" theme={theme} />
        {currentLang === 'en' ? 'Loading...' : 'Chargement...'}
      </div>
    );
  }

  if (!user) {
    if (!authMode) {
      return (
        <LandingPage
          currentLang={currentLang}
          theme={theme}
          onThemeChange={handleThemeChange}
          onLogin={() => setAuthMode('login')}
          onSignup={() => setAuthMode('signup')}
          onViewPricing={() => setAuthMode('signup')}
        />
      );
    }
    return (
      <AuthPage
        onAuthSuccess={setUser}
        initialMode={authMode}
        onBack={() => setAuthMode(null)}
      />
    );
  }

  // ---- Vérification de l'accès (désactivée si SUBSCRIPTION_ENABLED = false) ----
  if (SUBSCRIPTION_ENABLED) {
    if (subStatus === null) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', color: 'var(--text-secondary)' }}>
          <Logo variant="stacked" theme={theme} />
          {currentLang === 'en' ? 'Checking your access...' : 'Vérification de ton accès...'}
        </div>
      );
    }

    if (subStatus === 'error') {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
          <Logo variant="stacked" theme={theme} />
          <p style={{ margin: 0 }}>
            {currentLang === 'en'
              ? 'Could not reach the database. Please try again.'
              : 'Impossible de joindre la base de données. Réessaie.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              style={{ padding: '12px 24px', background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%)', color: 'var(--bg-obsidian)', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => { setSubStatus(null); checkSubscription(); }}
            >
              🔄 {currentLang === 'en' ? 'Retry' : 'Réessayer'}
            </button>
            <button
              style={{ padding: '12px 24px', background: 'rgba(230, 57, 70, 0.1)', border: '2px solid #E63946', color: '#FF6B7A', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => setUser(null)}
            >
              🚪 {currentLang === 'en' ? 'Logout' : 'Déconnexion'}
            </button>
          </div>
        </div>
      );
    }

    if (['pending', 'denied', 'expired', 'suspended'].includes(subStatus)) {
      return (
        <PendingConfirmationPage
          userName={userName}
          status={subStatus}
          onCheckAgain={checkSubscription}
          onLogout={() => setUser(null)}
          currentLang={currentLang}
        />
      );
    }
  }

  // ---- Accès normal au jeu (accès actif, ou vérification désactivée) ----

  if (screen === 'dashboard') {
    return (
      <Dashboard
        user={user} userName={userName} onLogout={() => setUser(null)}
        onContinue={() => setScreen('subjectSelector')}
        onGoAdmin={() => setScreen('admin')}
        theme={theme}
        onThemeChange={handleThemeChange} currentLang={currentLang}
      />
    );
  }

  if (screen === 'admin') {
    return (
      <AdminPanel
        onBack={() => setScreen('dashboard')}
        currentLang={currentLang}
        theme={theme}
      />
    );
  }

  if (screen === 'subjectSelector') {
    return (
      <SubjectSelector
        onSelectSubject={(subject) => {
          setSelectedSubject(subject);
          setScreen('modeSelector');
        }}
        onBack={() => setScreen('dashboard')}
        onGoHome={() => setScreen('dashboard')}
        currentLang={currentLang} userName={userName}
        onStats={() => setScreen('stats')} theme={theme}
      />
    );
  }

  if (screen === 'stats') {
    return (
      <StatsPanel
        user={user} userName={userName} onBack={() => setScreen('modeSelector')}
        onLogout={() => setUser(null)} theme={theme} onThemeChange={handleThemeChange}
        currentLang={currentLang} onLanguageChange={setCurrentLang}
      />
    );
  }

  const handleModeSelect = (mode) => {
    if (mode === 'blind') {
      setGameMode('blind');
      setSelectedClass(null);
      setScreen('mainGame');
    } else if (mode === 'focused') {
      setGameMode('focused');
      setScreen('classSelector');
    } else if (mode === 'studyMode') {
      setScreen('drugDirectory');
    } else if (mode === 'byLesson') {
      setGameMode('byLesson');
      setSelectedClass(null);
      setScreen('lessonSelector');
    }
  };

  const handleClassSelect = (className) => {
    setSelectedClass(className);
    setScreen('mainGame');
  };

  const handleLessonsSelected = (lessonIds) => {
    setSelectedLessons(lessonIds);
    setScreen('mainGame');
  };

  const handleGameEnd = (result) => {
    saveGameStats(user.uid, result, gameMode);
    setGameResult(result);
    setScreen('result');
  };

  const handleBackToMode = () => {
    setScreen('modeSelector');
    setSelectedClass(null);
    setSelectedLessons([]);
    setGameMode(null);
    setGameResult(null);
  };

  const handleBackFromClassSelector = () => {
    setScreen('modeSelector');
    setGameMode(null);
  };

  const handleBackFromLessonSelector = () => {
    setScreen('modeSelector');
    setGameMode(null);
  };

  const handlePlayAgain = () => {
    setGameResult(null);
    if (gameMode === 'focused') {
      setScreen('classSelector');
    } else if (gameMode === 'byLesson') {
      setScreen('lessonSelector');
    } else {
      setScreen('mainGame');
    }
  };

  return (
    <div className="app">
      {screen === 'modeSelector' && (
        <ModeSelector
          onSelectMode={handleModeSelect}
          onBack={() => setScreen('subjectSelector')}
          onGoHome={() => setScreen('dashboard')}
          onGoYear={() => setScreen('subjectSelector')}
          currentLang={currentLang} userName={userName}
          onStats={() => setScreen('stats')} theme={theme}
          selectedSubject={selectedSubject}
        />
      )}

      {/* ---- Pharmacology (full domain-based curriculum) ---- */}
      {screen === 'classSelector' && selectedSubject === 'pharmacology_new' && (
        <PharmaClassSelector
          onSelectClass={handleClassSelect} onBack={handleBackFromClassSelector}
          currentLang={currentLang} userName={userName} onStats={() => setScreen('stats')}
          theme={theme} onThemeChange={handleThemeChange}
        />
      )}
      {screen === 'mainGame' && selectedSubject === 'pharmacology_new' && (
        <PharmaGame
          drugs={pharmaV2Drugs} selectedClass={selectedClass} gameMode={gameMode}
          onGameEnd={handleGameEnd} onBack={handleBackToMode} currentLang={currentLang}
        />
      )}
      {screen === 'drugDirectory' && selectedSubject === 'pharmacology_new' && (
        <PharmaDirectory
          drugs={pharmaV2Drugs} onBack={handleBackToMode} currentLang={currentLang}
          userName={userName} onStats={() => setScreen('stats')} theme={theme} onThemeChange={handleThemeChange}
        />
      )}

      {/* ---- Parasitology ---- */}
      {screen === 'classSelector' && selectedSubject === 'parasitology' && (
        <ParasiteClassSelector
          onSelectClass={handleClassSelect} onBack={handleBackFromClassSelector}
          currentLang={currentLang} userName={userName} onStats={() => setScreen('stats')}
          theme={theme} onThemeChange={handleThemeChange}
        />
      )}
      {screen === 'lessonSelector' && selectedSubject === 'parasitology' && (
        <ParasiteLessonSelector
          organisms={parasites}
          onStart={handleLessonsSelected}
          onBack={handleBackFromLessonSelector}
          currentLang={currentLang} userName={userName} onStats={() => setScreen('stats')}
        />
      )}
      {screen === 'mainGame' && selectedSubject === 'parasitology' && (
        <ParasiteGame
          organisms={parasites} selectedClass={selectedClass} selectedLessons={selectedLessons} gameMode={gameMode}
          onGameEnd={handleGameEnd} onBack={handleBackToMode} currentLang={currentLang}
        />
      )}
      {screen === 'drugDirectory' && selectedSubject === 'parasitology' && (
        <ParasiteDirectory
          organisms={parasites} onBack={handleBackToMode} currentLang={currentLang}
          userName={userName} onStats={() => setScreen('stats')} theme={theme} onThemeChange={handleThemeChange}
        />
      )}

      {screen === 'practiceMode' && (
        <PracticeMode
          onBack={handleBackToMode} currentLang={currentLang} userName={userName}
          onStats={() => setScreen('stats')} theme={theme} onThemeChange={handleThemeChange}
        />
      )}

      {screen === 'result' && (
        <ResultScreen
          result={gameResult}
          onPlayAgain={handlePlayAgain}
          onBackToMode={handleBackToMode}
          currentLang={currentLang} theme={theme}
          onThemeChange={handleThemeChange} userName={userName} subject={selectedSubject}
        />
      )}
    </div>
  );
}

function saveGameStats(userId, result, gameMode) {
  try {
    const statsKey = `stats_${userId}`;
    const currentStats = JSON.parse(localStorage.getItem(statsKey)) || {
      totalGamesPlayed: 0, totalXP: 0, gameHistory: [], modeStats: {}
    };

    const gameRecord = {
      mode: gameMode === 'blind' ? 'blind' : 'known',
      score: result.score || 0,
      xpEarned: result.xpEarned || 0,
      drugName: result.drugName || 'Unknown',
      cluesUsed: result.cluesUsed || 0,
      timestamp: new Date().toISOString()
    };

    currentStats.gameHistory.push(gameRecord);
    currentStats.totalGamesPlayed += 1;
    currentStats.totalXP += gameRecord.xpEarned;

    const mode = gameRecord.mode;
    if (!currentStats.modeStats[mode]) {
      currentStats.modeStats[mode] = { played: 0, totalScore: 0, totalXP: 0 };
    }
    currentStats.modeStats[mode].played += 1;
    currentStats.modeStats[mode].totalScore += gameRecord.score;
    currentStats.modeStats[mode].totalXP += gameRecord.xpEarned;

    localStorage.setItem(statsKey, JSON.stringify(currentStats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
}