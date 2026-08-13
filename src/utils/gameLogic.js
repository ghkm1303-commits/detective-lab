// Pick a random drug from a class
export const pickRandomDrug = (drugs) => {
  return drugs[Math.floor(Math.random() * drugs.length)];
};

// Get clues progressively (3 at start, then add 1 for each wrong guess)
export const getClues = (drug, gameMode = 'known') => {
  const allClues = [
    `Class: ${drug.class}`,
    `Therapeutic Class: ${drug.therapeuticClass}`,
    `Effects: ${drug.effects.join(', ')}`,
    `Route: ${drug.route}`,
    `Mechanism: ${drug.mechanism}`,
    `Side Effects: ${drug.sideEffects.join(', ')}`,
    `Contraindications: ${drug.contraindications.join(', ')}`,
    `Metabolism: ${drug.metabolism}`,
    `Elimination: ${drug.elimination}`,
    `Half-life: ${drug.halfLife}`
  ];

  // In BLIND mode, skip the first 2 clues (Class & Therapeutic Class)
  if (gameMode === 'blind') {
    return allClues.slice(2);  // Remove class clues
  }

  return allClues;
};

// Check if guess matches drug (bilingual - French or English)
export const checkGuess = (guess, drug) => {
  const normalizedGuess = guess.toLowerCase().trim();
  const normalizedFr = drug.names.fr.toLowerCase().trim();
  const normalizedEn = drug.names.en.toLowerCase().trim();
  
  return normalizedGuess === normalizedFr || normalizedGuess === normalizedEn;
};

// Calculate score (fewer clues = higher score)
export const calculateScore = (cluesUsed) => {
  const baseScore = 1000;
  const cluesDeduction = (cluesUsed - 3) * 100; // 3 clues start = no deduction
  return Math.max(100, baseScore - cluesDeduction);
};

// Get drugs by class
export const getDrugsByClass = (drugs, className) => {
  return drugs.filter(drug => drug.class === className);
};

// Get all unique classes
export const getAllClasses = (drugs) => {
  const classes = [...new Set(drugs.map(drug => drug.class))];
  return classes.sort();
};