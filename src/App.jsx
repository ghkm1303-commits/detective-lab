import { useState, useEffect } from 'react';
import drugsData from './data/drugs.json';
import ModeSelector from './components/ModeSelector';
import GameTypeSelector from './components/GameTypeSelector';
import ClassSelector from './components/ClassSelector';
import MainGame from './components/MainGame';
import PracticeMode from './components/PracticeMode';
import DrugDirectory from './components/DrugDirectory';
import DrugManagement from './components/DrugManagement';
import ResultScreen from './components/ResultScreen';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('modeSelector');
  const [drugs, setDrugs] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  // Load drugs from localStorage or drugsData
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
    }
  }, []);

  const handleModeSelect = (mode) => {
    if (mode === 'mainGame') {
      setScreen('gameTypeSelector');
    } else if (mode === 'practiceMode') {
      setScreen('practiceMode');
    } else if (mode === 'drugDirectory') {
      setScreen('drugDirectory');
    } else if (mode === 'drugManagement') {
      setScreen('drugManagement');
    } else {
      setScreen(mode);
    }
  };

  const handleGameTypeSelect = (type) => {
    setGameMode(type);
    if (type === 'blind') {
      setSelectedClass(null);
      setScreen('mainGame');
    } else {
      setScreen('classSelector');
    }
  };

  const handleClassSelect = (className) => {
    setSelectedClass(className);
    setScreen('mainGame');
  };

  const handleGameEnd = (result) => {
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

  const handleBackToGame = () => {
    setScreen('gameTypeSelector');
  };

  return (
    <div className="app">
      {screen === 'modeSelector' && (
        <ModeSelector onSelectMode={handleModeSelect} />
      )}

      {screen === 'gameTypeSelector' && (
        <GameTypeSelector 
          onSelectMode={handleGameTypeSelect}
          onBack={handleBackToMode}
        />
      )}

      {screen === 'classSelector' && (
        <ClassSelector 
          drugs={drugs} 
          onSelectClass={handleClassSelect}
          onBack={handleBackToGame}
        />
      )}

      {screen === 'mainGame' && (
        <MainGame 
          drugs={drugs}
          selectedClass={selectedClass}
          gameMode={gameMode}
          onGameEnd={handleGameEnd}
          onBack={handleBackToMode}
        />
      )}

      {screen === 'practiceMode' && (
        <PracticeMode 
          drugs={drugs}
          onBack={handleBackToMode}
        />
      )}

      {screen === 'drugDirectory' && (
        <DrugDirectory 
          drugs={drugs}
          onBack={handleBackToMode}
        />
      )}

      {screen === 'drugManagement' && (
        <DrugManagement 
          drugs={drugs}
          onDrugsUpdate={handleDrugsUpdate}
          onBack={handleBackToMode}
        />
      )}

      {screen === 'result' && (
        <ResultScreen 
          result={gameResult}
          drugs={drugs}
          onPlayAgain={handleBackToGame}
          onBackToMode={handleBackToMode}
        />
      )}
    </div>
  );
}