import React, { useState } from 'react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

const DrugDirectory = ({ drugs, onBack, currentLang, onLanguageChange, userName, onStats, theme, onThemeChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMore, setShowMore] = useState({});

  const categories = [
    { id: 'cardiovascular', enName: 'Cardiovascular', frName: 'Cardiovasculaire' },
    { id: 'nervous', enName: 'Nervous System', frName: 'Système Nerveux' },
    { id: 'endocrine', enName: 'Endocrine', frName: 'Endocrinien' },
    { id: 'respiratory', enName: 'Respiratory', frName: 'Respiratoire' },
    { id: 'digestive', enName: 'Digestive', frName: 'Digestif' },
    { id: 'immune', enName: 'Immune', frName: 'Immunitaire' },
    { id: 'musculoskeletal', enName: 'Musculoskeletal', frName: 'Musculo-Squelettique' },
    { id: 'renal', enName: 'Renal', frName: 'Rénal' }
  ];

  const filteredDrugs = selectedCategory
    ? drugs.filter(drug => drug.class === selectedCategory)
    : drugs;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <div style={styles.rightGroup}>
          <LanguageToggle currentLang={currentLang} onLanguageChange={onLanguageChange} />
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          <button onClick={onStats} className="user-button">
            👤 {userName}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>
          {currentLang === 'en' ? '📖 Drug Dictionary' : '📖 Dictionnaire des Médicaments'}
        </h1>

        {/* Category Filter */}
        <div style={styles.categoryFilter}>
          <button
            style={{
              ...styles.filterButton,
              background: !selectedCategory ? 'var(--accent-gold)' : 'transparent',
              color: !selectedCategory ? 'var(--bg-obsidian)' : 'var(--accent-gold)'
            }}
            onClick={() => setSelectedCategory(null)}
          >
            {currentLang === 'en' ? 'All Drugs' : 'Tous les Médicaments'} ({drugs.length})
          </button>
          {categories.map(cat => {
            const count = drugs.filter(d => d.class === cat.id).length;
            return (
              <button
                key={cat.id}
                style={{
                  ...styles.filterButton,
                  background: selectedCategory === cat.id ? 'var(--accent-teal)' : 'transparent',
                  color: selectedCategory === cat.id ? 'white' : 'var(--accent-teal)'
                }}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {currentLang === 'en' ? cat.enName : cat.frName} ({count})
              </button>
            );
          })}
        </div>

        {/* Drugs List */}
        <div style={styles.drugsList}>
          {filteredDrugs.map(drug => (
            <div key={drug.id} style={styles.drugCard}>
              <div style={styles.drugHeader}>
                <h3 style={styles.drugName}>{drug.names.en}</h3>
                <span style={styles.drugId}>ID: {drug.id}</span>
              </div>
              <p style={styles.drugClass}>{drug.therapeuticClass}</p>
              <p style={styles.drugIndication}>
                <strong>{currentLang === 'en' ? 'Indications:' : 'Indications:'}</strong> {drug.indications}
              </p>

              {showMore[drug.id] && (
                <>
                  <p><strong>{currentLang === 'en' ? 'Mechanism:' : 'Mécanisme:'}</strong> {drug.mechanism}</p>
                  <p><strong>{currentLang === 'en' ? 'Side Effects:' : 'Effets Secondaires:'}</strong> {drug.sideEffects.join(', ')}</p>
                  <p><strong>{currentLang === 'en' ? 'Dosing:' : 'Posologie:'}</strong> {drug.dosing.standard}</p>
                </>
              )}

              <button
                style={styles.moreButton}
                onClick={() => setShowMore({ ...showMore, [drug.id]: !showMore[drug.id] })}
              >
                {showMore[drug.id] ? (currentLang === 'en' ? 'Show Less' : 'Voir Moins') : (currentLang === 'en' ? 'See More' : 'Voir Plus')}
              </button>
            </div>
          ))}
        </div>
      </div>
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
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid var(--border-teal)'
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(22, 124, 128, 0.1)',
    border: '2px solid var(--accent-gold)',
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
    alignItems: 'center'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  categoryFilter: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '30px',
    justifyContent: 'center'
  },
  filterButton: {
    padding: '8px 16px',
    border: '2px solid var(--accent-gold)',
    borderRadius: '20px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  drugsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  drugCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '20px',
    transition: 'all 0.3s ease'
  },
  drugHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '10px'
  },
  drugName: {
    color: 'var(--accent-gold)',
    fontSize: '16px',
    margin: '0',
    fontFamily: "'Playfair Display', serif"
  },
  drugId: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    background: 'rgba(22, 124, 128, 0.1)',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  drugClass: {
    color: 'var(--accent-teal)',
    fontSize: '12px',
    margin: '5px 0'
  },
  drugIndication: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '10px 0'
  },
  moreButton: {
    background: 'rgba(22, 124, 128, 0.1)',
    border: '1px solid var(--accent-teal)',
    color: 'var(--accent-teal)',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '600',
    marginTop: '10px'
  }
};

export default DrugDirectory;