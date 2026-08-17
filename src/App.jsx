import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import SubjectSelector from './components/SubjectSelector';
import StatsPanel from './components/StatsPanel';
import ModeSelector from './components/ModeSelector';
import GameTypeSelector from './components/GameTypeSelector';
import ClassSelector from './components/ClassSelector';
import MainGame from './components/MainGame';
import PracticeMode from './components/PracticeMode';
import DrugDirectory from './components/DrugDirectory';
import DrugManagement from './components/DrugManagement';
import ResultScreen from './components/ResultScreen';
import drugsData from './data/drugs.json';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState('en');
  const [screen, setScreen] = useState('subjectSelector');
  const [drugs, setDrugs] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('pharmacology');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)'
      }}>
        {currentLang === 'en' ? 'Loading...' : 'Chargement...'}
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

  if (screen === 'dashboard') {
    return (
      <Dashboard
        user={user}
        onLogout={() => setUser(null)}
        onContinue={() => setScreen('subjectSelector')}
      />
    );
  }

  if (screen === 'subjectSelector') {
    return (
      <SubjectSelector
        onSelectSubject={(subject) => {
          if (subject !== 'pharmacology') {
            return;
          }
          setSelectedSubject(subject);
          setScreen('modeSelector');
        }}
        onLogout={() => setUser(null)}
        onBack={() => setScreen('dashboard')}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        userEmail={user.email}
      />
    );
  }

  if (screen === 'stats') {
    return (
      <StatsPanel
        user={user}
        onBack={() => setScreen('modeSelector')}
        onLogout={() => setUser(null)}
      />
    );
  }

  const handleModeSelect = (mode) => {
    if (mode === 'mainGame') setScreen('gameTypeSelector');
    else if (mode === 'practiceMode') setScreen('practiceMode');
    else if (mode === 'drugDirectory') setScreen('drugDirectory');
    else if (mode === 'drugManagement') setScreen('drugManagement');
    else setScreen(mode);
  };

  const handleGameTypeSelect = (type) => {
    setGameMode(type);
    if (type === 'blind') { 
      setSelectedClass(null); 
      setScreen('mainGame'); 
    }
    else setScreen('classSelector');
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

  const handleDrugsUpdate = (updatedDrugs) => {
    setDrugs(updatedDrugs);
    localStorage.setItem('drugs', JSON.stringify(updatedDrugs));
  };

  const handleBackToMode = () => {
    setScreen('modeSelector');
    setSelectedClass(null);
    setGameMode(null);
    setGameResult(null);
  };

  const handleBackToGame = () => setScreen('gameTypeSelector');

  return (
    <div className="app">
      {/* No global header - each component manages its own */}

      {screen === 'modeSelector' && (
        <ModeSelector 
          onSelectMode={handleModeSelect} 
          onBack={() => setScreen('subjectSelector')}
          currentLang={currentLang} 
          onLanguageChange={setCurrentLang}
          userEmail={user.email}
          onStats={() => setScreen('stats')}
        />
      )}
      {screen === 'gameTypeSelector' && (
        <GameTypeSelector 
          onSelectMode={handleGameTypeSelect} 
          onBack={handleBackToMode} 
          currentLang={currentLang} 
          onLanguageChange={setCurrentLang}
          userEmail={user.email}
          onStats={() => setScreen('stats')}
        />
      )}
      {screen === 'classSelector' && (
        <ClassSelector 
          onSelectClass={handleClassSelect} 
          onBack={handleBackToGame} 
          currentLang={currentLang} 
          onLanguageChange={setCurrentLang}
          userEmail={user.email}
          onStats={() => setScreen('stats')}
        />
      )}
      {screen === 'mainGame' && (
        <MainGame 
          drugs={drugs} 
          selectedClass={selectedClass} 
          gameMode={gameMode} 
          onGameEnd={handleGameEnd} 
          onBack={handleBackToMode} 
          currentLang={currentLang} 
        />
      )}
      {screen === 'practiceMode' && (
        <PracticeMode 
          onBack={handleBackToMode} 
          currentLang={currentLang} 
          onLanguageChange={setCurrentLang}
          userEmail={user.email}
          onStats={() => setScreen('stats')}
        />
      )}
      {screen === 'drugDirectory' && (
        <DrugDirectory 
          drugs={drugs} 
          onBack={handleBackToMode} 
          currentLang={currentLang} 
          onLanguageChange={setCurrentLang}
          userEmail={user.email}
          onStats={() => setScreen('stats')}
        />
      )}
      {screen === 'drugManagement' && (
        <DrugManagement 
          drugs={drugs} 
          onDrugsUpdate={handleDrugsUpdate} 
          onBack={handleBackToMode} 
          currentLang={currentLang} 
          onLanguageChange={setCurrentLang}
          userEmail={user.email}
          onStats={() => setScreen('stats')}
        />
      )}
      {screen === 'result' && (
        <ResultScreen 
          result={gameResult} 
          drugs={drugs} 
          onPlayAgain={handleBackToGame} 
          onBackToMode={handleBackToMode} 
          currentLang={currentLang} 
        />
      )}
      {screen === 'stats' && (
        <StatsPanel 
          user={user} 
          onBack={() => setScreen('modeSelector')} 
          onLogout={() => setUser(null)} 
        />
      )}
    </div>
  );
}

function saveGameStats(userId, result, gameMode) {
  try {
    const statsKey = `stats_${userId}`;
    const currentStats = JSON.parse(localStorage.getItem(statsKey)) || {
      totalGamesPlayed: 0,
      totalXP: 0,
      gameHistory: [],
      modeStats: {}
    };

    const gameRecord = {
      mode: gameMode === 'blind' ? 'blind' : 'known',
      score: result.score || 0,
      xpEarned: result.score ? Math.max(result.score - 300, 0) : 0,
      drugName: result.drugName || 'Unknown',
      cluesUsed: result.cluesUsed || 0,
      timestamp: new Date().toISOString()
    };

    currentStats.gameHistory.push(gameRecord);
    currentStats.totalGamesPlayed += 1;
    currentStats.totalXP += gameRecord.xpEarned;

    const mode = gameRecord.mode;
    if (!currentStats.modeStats[mode]) {
      currentStats.modeStats[mode] = {
        played: 0,
        totalScore: 0,
        totalXP: 0
      };
    }
    currentStats.modeStats[mode].played += 1;
    currentStats.modeStats[mode].totalScore += gameRecord.score;
    currentStats.modeStats[mode].totalXP += gameRecord.xpEarned;

    localStorage.setItem(statsKey, JSON.stringify(currentStats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
}