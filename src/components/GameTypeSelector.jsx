export default function GameTypeSelector({ onSelectMode }) {
  return (
    <div className="container">
      <h1 className="title">Choose Your Challenge</h1>
      
      <div className="game-type-grid">
        <div 
          className="game-type-card blind"
          onClick={() => onSelectMode('blind')}
        >
          <div className="icon">🔍</div>
          <h2>Blind Mode</h2>
          <p>No class hints. The drug could be from ANY category.</p>
          <div className="difficulty">Difficulty: HARD 🔥</div>
        </div>

        <div 
          className="game-type-card known"
          onClick={() => onSelectMode('known')}
        >
          <div className="icon">📚</div>
          <h2>Known Class Mode</h2>
          <p>Choose a drug class first, then guess the drug.</p>
          <div className="difficulty">Difficulty: MEDIUM ⭐</div>
        </div>
      </div>
    </div>
  );
}