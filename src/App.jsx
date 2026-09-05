import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import SubjectSelector from './components/SubjectSelector';
import StatsPanel from './components/StatsPanel';
import ModeSelector from './components/ModeSelector';
import ClassSelector from './components/ClassSelector';
import MainGame from './components/MainGame';
import PracticeMode from './components/PracticeMode';
import DrugDirectory from './components/DrugDirectory';
import ResultScreen from './components/ResultScreen';
import ParasiteClassSelector from './components/ParasiteClassSelector';
import ParasiteGame from './components/ParasiteGame';
import ParasiteDirectory from './components/ParasiteDirectory';
import PharmaClassSelector from './components/PharmaClassSelector';
import PharmaGame from './components/PharmaGame';
import PharmaDirectory from './components/PharmaDirectory';
import drugsData from './data/drugs.json';
import parasitesData from './data/parasites.json';
import pharmaV2Data from './data/pharmacology_drugs_v2.json';
import './App.css';
import CloudAssistant from './components/CloudAssistant';
import Logo from './components/Logo';

export default function App() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [screen, setScreen] = useState('subjectSelector');
  const [authMode, setAuthMode] = useState(null); // null = landing, 'login' | 'signup' = AuthPage
  const [drugs, setDrugs] = useState([]);
  const [parasites] = useState(parasitesData.organisms);
  const [pharmaV2Drugs] = useState(pharmaV2Data.drugs);
  const [selectedClass, setSelectedClass] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('pharmacology_old');

  useEffect(() => {
    const savedTheme = localStorage.getItem('detective-lab-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem('drugs');
      if (stored) {
        setDrugs(JSON.parse(stored));
      } else {
        setDrugs(drugsData.drugs);
        localStorage.setItem('drugs', JSON.stringify(drugsData.drugs));
      }
    } catch (error) {
      console.error('Error loading drugs:', error);
      setDrugs(drugsData.drugs);
    }
  }, []);

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

  if (screen === 'dashboard') {
    return (
      <Dashboard
        user={user} userName={userName} onLogout={() => setUser(null)}
        onContinue={() => setScreen('subjectSelector')} theme={theme}
        onThemeChange={handleThemeChange} currentLang={currentLang}
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
        currentLang={currentLang} userName={userName}
        onStats={() => setScreen('stats')} theme={theme}
        onThemeChange={handleThemeChange}
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
    }
  };

  const handleClassSelect = (className) => {
    setSelectedClass(className);
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
    setGameMode(null);
    setGameResult(null);
  };

  const handleBackFromClassSelector = () => {
    setScreen('modeSelector');
    setGameMode(null);
  };

  const handlePlayAgain = () => {
    setGameResult(null);
    setScreen(gameMode === 'focused' ? 'classSelector' : 'mainGame');
  };

  return (
    <div className="app">
      {screen === 'modeSelector' && (
        <ModeSelector
          onSelectMode={handleModeSelect}
          onBack={() => setScreen('subjectSelector')}
          currentLang={currentLang} userName={userName}
          onStats={() => setScreen('stats')} theme={theme}
          onThemeChange={handleThemeChange}
        />
      )}

      {/* ---- OLD Pharmacology (renamed "Médicaments") ---- */}
      {screen === 'classSelector' && selectedSubject === 'pharmacology_old' && (
        <ClassSelector
          onSelectClass={handleClassSelect} onBack={handleBackFromClassSelector}
          currentLang={currentLang} userName={userName} onStats={() => setScreen('stats')}
          theme={theme} onThemeChange={handleThemeChange}
        />
      )}
      {screen === 'mainGame' && selectedSubject === 'pharmacology_old' && (
        <MainGame
          drugs={drugs} selectedClass={selectedClass} gameMode={gameMode}
          onGameEnd={handleGameEnd} onBack={handleBackToMode} currentLang={currentLang} theme={theme}
        />
      )}
      {screen === 'drugDirectory' && selectedSubject === 'pharmacology_old' && (
        <DrugDirectory
          drugs={drugs} onBack={handleBackToMode} currentLang={currentLang}
          userName={userName} onStats={() => setScreen('stats')} theme={theme} onThemeChange={handleThemeChange}
        />
      )}

      {/* ---- NEW Pharmacology (full domain-based curriculum) ---- */}
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
      {screen === 'mainGame' && selectedSubject === 'parasitology' && (
        <ParasiteGame
          organisms={parasites} selectedClass={selectedClass} gameMode={gameMode}
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
          result={gameResult} drugs={drugs} onPlayAgain={handlePlayAgain}
          onBackToMode={handleBackToMode} currentLang={currentLang} theme={theme}
          onThemeChange={handleThemeChange} userName={userName} subject={selectedSubject}
        />
      )}
    <CloudAssistant currentLang={currentLang} screen={screen} userName={userName} />
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