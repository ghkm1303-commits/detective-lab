import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import SubscriptionPage from './components/SubscriptionPage';
import PendingConfirmationPage from './components/PendingConfirmationPage';
import SubjectSelector from './components/SubjectSelector';
import StatsPanel from './components/StatsPanel';
import ModeSelector from './components/ModeSelector';
import PracticeMode from './components/PracticeMode';
import ResultScreen from './components/ResultScreen';
import ParasiteClassSelector from './components/ParasiteClassSelector';
import ParasiteGame from './components/ParasiteGame';
import ParasiteDirectory from './components/ParasiteDirectory';
import PharmaClassSelector from './components/PharmaClassSelector';
import PharmaGame from './components/PharmaGame';
import PharmaDirectory from './components/PharmaDirectory';
import parasitesData from './data/parasites.json';
import pharmaV2Data from './data/pharmacology_drugs_v2.json';
import chemistryData from './data/chemistry.json';
import './App.css';
import Logo from './components/Logo';
import { isAdmin } from './utils/admin';
import { getSubscriptionStatus, submitPaymentConfirmation } from './utils/subscription';
import ChemistryHub from './components/ChemistryHub';
import ChemistryModeChoice from './components/ChemistryModeChoice';
import ChemistryLessonSelector from './components/ChemistryLessonSelector';
import ChemistryArchive from './components/ChemistryArchive';
import GameGuessing from './components/GameGuessing';

// Abonnement désactivé temporairement pour le test avec les amis (idée du jeu à valider d'abord).
// Remettre à true pour réactiver la vérification subStatus / SubscriptionPage / PendingConfirmationPage.
const SUBSCRIPTION_ENABLED = false;

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
  // Chimie Thérapeutique: targetType = 'group' | 'molecule', scope = 'all' | <lesson_id>
  const [chemistryTargetType, setChemistryTargetType] = useState(null);
  const [chemistryScope, setChemistryScope] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // subStatus: null (chargement) | 'none' | 'pending' | 'active'
  const [subStatus, setSubStatus] = useState(null);
  const [subPlan, setSubPlan] = useState(null);

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
    const result = await getSubscriptionStatus(user.uid);
    setSubStatus(result.status);
    setSubPlan(result.plan || null);
  }, [user]);

  useEffect(() => {
    if (!SUBSCRIPTION_ENABLED) return;
    if (user) {
      setSubStatus(null); // repasse en "chargement" le temps de vérifier
      checkSubscription();
    }
  }, [user, checkSubscription]);

  const handleSubmitPayment = async (plan) => {
    const result = await submitPaymentConfirmation(user.uid, userName, plan);
    if (result.success) {
      setSubPlan(plan.id);
      setSubStatus('pending');
    } else {
      alert(currentLang === 'en' ? 'Something went wrong. Please try again.' : "Une erreur s'est produite. Réessaie.");
    }
  };

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

  // ---- Vérification de l'abonnement (désactivée pour l'instant via SUBSCRIPTION_ENABLED) ----
  if (SUBSCRIPTION_ENABLED) {
    if (subStatus === null) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', color: 'var(--text-secondary)' }}>
          <Logo variant="stacked" theme={theme} />
          {currentLang === 'en' ? 'Checking your subscription...' : 'Vérification de ton abonnement...'}
        </div>
      );
    }

    if (subStatus === 'none') {
      return (
        <SubscriptionPage
          onSubmitPayment={handleSubmitPayment}
          onLogout={() => setUser(null)}
          currentLang={currentLang}
          userName={userName}
        />
      );
    }

    if (subStatus === 'pending') {
      return (
        <PendingConfirmationPage
          userName={userName}
          plan={subPlan}
          onCheckAgain={checkSubscription}
          onLogout={() => setUser(null)}
          currentLang={currentLang}
        />
      );
    }
  }

  // ---- Accès normal au jeu (abonnement actif, ou vérification désactivée) ----

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
          if (subject === 'chimie_therapeutique') {
            setScreen('chemistryHub');
          } else {
            setScreen('modeSelector');
          }
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

  // ---- Chimie Thérapeutique: navigation handlers ----
  const handleChemistryHubSelect = (target) => {
    // target: 'group' | 'molecule' | 'archive'
    if (target === 'archive') {
      setScreen('chemistryArchive');
    } else {
      setChemistryTargetType(target);
      setScreen('chemistryModeChoice');
    }
  };

  const handleChemistryModeChoice = (mode) => {
    // mode: 'open' | 'targeted'
    if (mode === 'open') {
      setChemistryScope('all');
      setGameMode(`chemistry_${chemistryTargetType}_open`);
      setScreen('chemistryGuessing');
    } else {
      setScreen('chemistryLessonSelector');
    }
  };

  const handleChemistryLessonSelect = (lessonId) => {
    setChemistryScope(lessonId);
    setGameMode(`chemistry_${chemistryTargetType}_targeted`);
    setScreen('chemistryGuessing');
  };

  const handleChemistryGameEnd = (result) => {
    saveGameStats(user.uid, result, gameMode);
    setGameResult(result);
    setScreen('result');
  };

  const handleChemistryBackToHub = () => {
    setScreen('chemistryHub');
    setChemistryTargetType(null);
    setChemistryScope(null);
    setGameMode(null);
    setGameResult(null);
  };

  const handleChemistryPlayAgain = () => {
    setGameResult(null);
    setScreen(chemistryScope === 'all' ? 'chemistryModeChoice' : 'chemistryLessonSelector');
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

      {/* ---- Chimie Thérapeutique (Hub -> Mode Choice -> [Lesson Selector] -> Guessing / Archive) ---- */}
      {screen === 'chemistryHub' && selectedSubject === 'chimie_therapeutique' && (
        <ChemistryHub
          onSelectTarget={handleChemistryHubSelect}
          onGoArchive={() => setScreen('chemistryArchive')}
          onBack={() => setScreen('subjectSelector')}
          onGoHome={() => setScreen('dashboard')}
          currentLang={currentLang} userName={userName}
          onStats={() => setScreen('stats')} theme={theme}
        />
      )}

      {screen === 'chemistryModeChoice' && selectedSubject === 'chimie_therapeutique' && (
        <ChemistryModeChoice
          targetType={chemistryTargetType}
          onSelectMode={handleChemistryModeChoice}
          onBack={() => setScreen('chemistryHub')}
          currentLang={currentLang} userName={userName}
          onStats={() => setScreen('stats')} theme={theme}
        />
      )}

      {screen === 'chemistryLessonSelector' && selectedSubject === 'chimie_therapeutique' && (
        <ChemistryLessonSelector
          data={chemistryData}
          targetType={chemistryTargetType}
          onSelectLesson={handleChemistryLessonSelect}
          onBack={() => setScreen('chemistryModeChoice')}
          currentLang={currentLang} userName={userName}
          onStats={() => setScreen('stats')} theme={theme}
        />
      )}

      {screen === 'chemistryGuessing' && selectedSubject === 'chimie_therapeutique' && (
        <GameGuessing
          data={chemistryData}
          targetType={chemistryTargetType}
          scope={chemistryScope}
          onGameEnd={handleChemistryGameEnd}
          onBack={() => setScreen(chemistryScope === 'all' ? 'chemistryModeChoice' : 'chemistryLessonSelector')}
          currentLang={currentLang}
        />
      )}

      {screen === 'chemistryArchive' && selectedSubject === 'chimie_therapeutique' && (
        <ChemistryArchive
          data={chemistryData}
          onBack={() => setScreen('chemistryHub')}
          currentLang={currentLang} userName={userName}
          onStats={() => setScreen('stats')} theme={theme} onThemeChange={handleThemeChange}
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
          onPlayAgain={selectedSubject === 'chimie_therapeutique' ? handleChemistryPlayAgain : handlePlayAgain}
          onBackToMode={selectedSubject === 'chimie_therapeutique' ? handleChemistryBackToHub : handleBackToMode}
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
      mode: gameMode === 'blind' ? 'blind' : (gameMode && gameMode.startsWith('chemistry_') ? gameMode : 'known'),
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