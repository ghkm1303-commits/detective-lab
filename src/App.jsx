import { useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase-config';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import SubscriptionPage from './components/SubscriptionPage';
import PendingConfirmationPage from './components/PendingConfirmationPage';
import StatsPanel from './components/StatsPanel';
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
import { getAccessStatus, requestAccess, submitPaymentConfirmation, getReference } from './utils/subscription';

// Accès sur approbation + abonnement : chaque nouveau compte voit la page des tarifs et envoie une
// demande d'accès que l'admin traite depuis le panneau d'administration (formule 1 mois, 1 an ou
// gratuit ; onglet Membres pour couper / redonner l'accès).
// Mettre à false pour désactiver complètement la vérification (accès direct après connexion).
const SUBSCRIPTION_ENABLED = true;

export default function App() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  // Langue choisie dans le menu du profil, mémorisée dans le navigateur
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      return localStorage.getItem('detective-lab-lang') === 'fr' ? 'fr' : 'en';
    } catch (error) {
      return 'en';
    }
  });
  const [theme, setTheme] = useState('dark');
  const [screen, setScreen] = useState('dashboard');
  const [authMode, setAuthMode] = useState(null);
  const [parasites] = useState(parasitesData.organisms);
  const [pharmaV2Drugs] = useState(pharmaV2Data.drugs);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(null);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [gameMode, setGameMode] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [archiveSearch, setArchiveSearch] = useState('');
  const [archiveOpenId, setArchiveOpenId] = useState(null); // fiche à ouvrir directement dans les Archives
  const [retryOrganismId, setRetryOrganismId] = useState(null); // "Retry Case" : rejouer le même organisme

  // subStatus: null (chargement) | 'pending' | 'active' | 'expired' | 'suspended' | 'denied' | 'error'
  const [subStatus, setSubStatus] = useState(null);
  const [subInfo, setSubInfo] = useState({ requestedPlan: null, paymentSent: false });
  const checkingUidRef = useRef(null);

  useEffect(() => {
    setTheme('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const handleLanguageChange = (lang) => {
    const next = lang === 'fr' ? 'fr' : 'en';
    setCurrentLang(next);
    try {
      localStorage.setItem('detective-lab-lang', next);
    } catch (error) {
      console.error('Language save error:', error);
    }
  };

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
      setSubInfo({
        requestedPlan: result.requestedPlan || null,
        paymentSent: !!result.paymentSent
      });
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

  // Clic sur "J'ai envoyé le paiement" : on signale la formule et la référence à l'admin
  const handleSubmitPayment = async (plan) => {
    const result = await submitPaymentConfirmation(user.uid, plan.id);
    if (result.success) {
      await checkSubscription();
    } else {
      alert(currentLang === 'en' ? 'Something went wrong. Please try again.' : "Une erreur s'est produite. Réessaie.");
    }
  };

  const reference = user ? getReference(user.uid) : '';

  // Après une inscription ou une connexion : on met à jour le nom affiché tout de suite
  // (sinon il resterait vide / égal au préfixe de l'e-mail jusqu'au rechargement de la page)
  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
    setUserName(authUser.displayName || (authUser.email ? authUser.email.split('@')[0] : ''));
  };

  // Vraie déconnexion : on ferme aussi la session Firebase, sinon un rechargement reconnecte le joueur
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
    checkingUidRef.current = null;
    setUser(null);
    setUserName('');
    setSubStatus(null);
    setSubInfo({ requestedPlan: null, paymentSent: false });
    setScreen('dashboard');
    setSelectedSubject(null);
    setSelectedClass(null);
    setSelectedFilters(null);
    setSelectedLessons([]);
    setGameMode(null);
    setGameResult(null);
    setArchiveSearch('');
    setArchiveOpenId(null);
    setRetryOrganismId(null);
    setAuthMode(null);
  };

  const handleModeSelect = (mode, term) => {
    if (mode === 'blind') {
      setGameMode('blind');
      setSelectedClass(null);
      setSelectedFilters(null);
      setScreen('mainGame');
    } else if (mode === 'focused') {
      setGameMode('focused');
      setScreen('classSelector');
    } else if (mode === 'studyMode') {
      setArchiveSearch(typeof term === 'string' ? term : '');
      setArchiveOpenId(null);
      setScreen('drugDirectory');
    } else if (mode === 'byLesson') {
      setGameMode('byLesson');
      setSelectedClass(null);
      setSelectedFilters(null);
      setScreen('lessonSelector');
    }
  };

  // Reçoit soit une catégorie (texte), soit un objet de filtres de la Recherche Ciblée
  const handleClassSelect = (selection) => {
    if (selection && typeof selection === 'object') {
      setSelectedClass(null);
      setSelectedFilters(selection);
    } else {
      setSelectedClass(selection);
      setSelectedFilters(null);
    }
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

  // Retour au hub : on garde le module choisi, donc le joueur retombe sur le choix du mode de jeu
  const handleBackToMode = () => {
    setScreen('dashboard');
    setSelectedClass(null);
    setSelectedFilters(null);
    setSelectedLessons([]);
    setGameMode(null);
    setGameResult(null);
    setArchiveSearch('');
    setArchiveOpenId(null);
    setRetryOrganismId(null);
  };

  const handleBackFromClassSelector = () => {
    setScreen('dashboard');
    setGameMode(null);
  };

  const handleBackFromLessonSelector = () => {
    setScreen('dashboard');
    setGameMode(null);
  };

  // "Next Case File" : un nouveau cas au hasard avec les mêmes réglages (mode, catégorie, filtres, leçons)
  const handleNextCase = () => {
    setRetryOrganismId(null);
    setGameResult(null);
    setScreen('mainGame');
  };

  // "Retry Case" : on rejoue exactement le même organisme
  const handleRetryCase = () => {
    if (!gameResult || !gameResult.organismId) return;
    setRetryOrganismId(gameResult.organismId);
    setGameResult(null);
    setScreen('mainGame');
  };

  // "View Full Archive Entry" : ouvre la fiche complète de l'organisme dans les Archives
  const handleViewArchive = (organism) => {
    if (!organism) return;
    setRetryOrganismId(null);
    setArchiveSearch(organism.names.en);
    setArchiveOpenId(organism.id);
    setGameResult(null);
    setScreen('drugDirectory');
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
        onAuthSuccess={handleAuthSuccess}
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
              onClick={handleLogout}
            >
              🚪 {currentLang === 'en' ? 'Logout' : 'Déconnexion'}
            </button>
          </div>
        </div>
      );
    }

    if (subStatus === 'denied') {
      return (
        <PendingConfirmationPage
          userName={userName}
          status="denied"
          onCheckAgain={checkSubscription}
          onLogout={handleLogout}
          currentLang={currentLang}
        />
      );
    }

    if (['pending', 'expired', 'suspended'].includes(subStatus)) {
      // Le joueur a déjà signalé son paiement : écran d'attente de vérification
      if (subInfo.paymentSent) {
        return (
          <PendingConfirmationPage
            userName={userName}
            status="review"
            plan={subInfo.requestedPlan}
            reference={reference}
            onCheckAgain={checkSubscription}
            onLogout={handleLogout}
            currentLang={currentLang}
          />
        );
      }
      // Sinon : page des tarifs et instructions de paiement
      return (
        <SubscriptionPage
          onSubmitPayment={handleSubmitPayment}
          onCheckAgain={checkSubscription}
          onLogout={handleLogout}
          currentLang={currentLang}
          userName={userName}
          reference={reference}
          mode={subStatus === 'pending' ? 'new' : 'renew'}
        />
      );
    }
  }

  // ---- Accès normal au jeu (accès actif, ou vérification désactivée) ----

  // Hub : étape 1 (choix du module) si aucun module n'est choisi, sinon étape 2 (choix du mode de jeu)
  if (screen === 'dashboard') {
    return (
      <Dashboard
        user={user}
        userName={userName}
        organisms={parasites}
        isPro={SUBSCRIPTION_ENABLED && subStatus === 'active'}
        selectedSubject={selectedSubject}
        onSelectModule={setSelectedSubject}
        onSwitchModule={() => setSelectedSubject(null)}
        onSelectMode={handleModeSelect}
        onStats={() => setScreen('stats')}
        onGoAdmin={() => setScreen('admin')}
        onLogout={handleLogout}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        currentLang={currentLang}
      />
    );
  }

  if (screen === 'admin') {
    return (
      <AdminPanel
        user={user}
        onBack={() => setScreen('dashboard')}
        currentLang={currentLang}
        theme={theme}
      />
    );
  }

  if (screen === 'stats') {
    return (
      <StatsPanel
        user={user} userName={userName} organisms={parasites} onBack={() => setScreen('dashboard')}
        onLogout={handleLogout} theme={theme} onThemeChange={handleThemeChange}
        currentLang={currentLang}
      />
    );
  }

  return (
    <div className="app">
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
          organisms={parasites}
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
          organisms={parasites} selectedClass={selectedClass} selectedFilters={selectedFilters} selectedLessons={selectedLessons} retryOrganismId={retryOrganismId} gameMode={gameMode}
          onGameEnd={handleGameEnd} onBack={handleBackToMode} currentLang={currentLang}
        />
      )}
      {screen === 'drugDirectory' && selectedSubject === 'parasitology' && (
        <ParasiteDirectory
          organisms={parasites} onBack={handleBackToMode} currentLang={currentLang}
          userName={userName} onStats={() => setScreen('stats')} theme={theme} onThemeChange={handleThemeChange}
          initialSearch={archiveSearch} initialOpenId={archiveOpenId} userId={user.uid}
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
          userId={user.uid}
          onNextCase={handleNextCase}
          onRetryCase={handleRetryCase}
          onViewArchive={handleViewArchive}
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