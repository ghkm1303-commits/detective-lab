import React, { useState } from 'react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

const DrugDirectory = ({ drugs, onBack, currentLang, onLanguageChange, userName, onStats, theme, onThemeChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState(null);

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

              <button
                style={styles.moreButton}
                onClick={() => setSelectedDrug(drug)}
              >
                {currentLang === 'en' ? 'See More' : 'Voir Plus'} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedDrug && (
        <div style={styles.modalOverlay} onClick={() => setSelectedDrug(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{selectedDrug.names.en}</h2>
                <p style={styles.modalSubtitle}>{selectedDrug.names.fr}</p>
              </div>
              <button 
                style={styles.closeIconButton}
                onClick={() => setSelectedDrug(null)}
              >
                ↑
              </button>
            </div>

            <div style={styles.modalDivider}></div>

            <div style={styles.modalGrid}>
              <div style={styles.modalSection}>
                <h4 style={styles.modalLabel}>
                  {currentLang === 'en' ? 'CLASS:' : 'CLASSE:'}
                </h4>
                <p style={styles.modalText}>{selectedDrug.therapeuticClass}</p>
              </div>

              <div style={styles.modalSection}>
                <h4 style={styles.modalLabel}>
                  {currentLang === 'en' ? 'THERAPEUTIC:' : 'THÉRAPEUTIQUE:'}
                </h4>
                <p style={styles.modalText}>{selectedDrug.category}</p>
              </div>

              <div style={styles.modalSection}>
                <h4 style={styles.modalLabel}>
                  {currentLang === 'en' ? 'ROUTE:' : 'VOIE:'}
                </h4>
                <p style={styles.modalText}>{selectedDrug.route}</p>
              </div>

              <div style={styles.modalSection}>
                <h4 style={styles.modalLabel}>
                  {currentLang === 'en' ? 'MECHANISM:' : 'MÉCANISME:'}
                </h4>
                <p style={styles.modalText}>{selectedDrug.mechanism}</p>
              </div>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{...styles.modalLabel, color: '#4ECDC4'}}>
                ✨ {currentLang === 'en' ? 'EFFECTS:' : 'EFFETS:'}
              </h4>
              <p style={styles.modalText}>
                {selectedDrug.effects && selectedDrug.effects.length > 0
                  ? selectedDrug.effects.join(', ')
                  : currentLang === 'en' ? 'Not specified' : 'Non spécifié'}
              </p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{...styles.modalLabel, color: '#20C997'}}>
                📋 {currentLang === 'en' ? 'INDICATIONS:' : 'INDICATIONS:'}
              </h4>
              <p style={styles.modalText}>{selectedDrug.indications}</p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{...styles.modalLabel, color: '#E63946'}}>
                ⚠️ {currentLang === 'en' ? 'SIDE EFFECTS:' : 'EFFETS SECONDAIRES:'}
              </h4>
              <p style={styles.modalText}>
                {selectedDrug.sideEffects.join(', ')}
              </p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{...styles.modalLabel, color: '#FF6B7A'}}>
                🚫 {currentLang === 'en' ? 'CONTRAINDICATIONS:' : 'CONTRE-INDICATIONS:'}
              </h4>
              <p style={styles.modalText}>
                {selectedDrug.contraindications.join(', ')}
              </p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{...styles.modalLabel, color: '#E8BA24'}}>
                💊 {currentLang === 'en' ? 'DOSING:' : 'POSOLOGIE:'}
              </h4>
              <p style={styles.modalText}>
                <strong>{currentLang === 'en' ? 'Standard:' : 'Standard:'}</strong> {selectedDrug.dosing.standard}<br/>
                <strong>{currentLang === 'en' ? 'Max:' : 'Max:'}</strong> {selectedDrug.dosing.maxDose}<br/>
                <strong>{currentLang === 'en' ? 'Frequency:' : 'Fréquence:'}</strong> {selectedDrug.dosing.frequency}
              </p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{...styles.modalLabel, color: '#667BC6'}}>
                🧬 {currentLang === 'en' ? 'METABOLISM:' : 'MÉTABOLISME:'}
              </h4>
              <p style={styles.modalText}>{selectedDrug.metabolism}</p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{...styles.modalLabel, color: '#4ECDC4'}}>
                💧 {currentLang === 'en' ? 'ELIMINATION:' : 'ÉLIMINATION:'}
              </h4>
              <p style={styles.modalText}>{selectedDrug.elimination}</p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{...styles.modalLabel, color: '#D5622B'}}>
                ⏱️ {currentLang === 'en' ? 'HALF-LIFE:' : 'DEMI-VIE:'}
              </h4>
              <p style={styles.modalText}>{selectedDrug.halfLife}</p>
            </div>

            {selectedDrug.brandNames && selectedDrug.brandNames.length > 0 && (
              <div style={styles.modalSection}>
                <h4 style={{...styles.modalLabel, color: 'var(--accent-gold)'}}>
                  🏷️ {currentLang === 'en' ? 'BRAND NAMES:' : 'NOMS COMMERCIAUX:'}
                </h4>
                <p style={styles.modalText}>{selectedDrug.brandNames.join(', ')}</p>
              </div>
            )}

            {selectedDrug.clinicalPearls && (
              <div style={styles.modalSection}>
                <h4 style={{...styles.modalLabel, color: 'var(--accent-teal)'}}>
                  💡 {currentLang === 'en' ? 'CLINICAL PEARLS:' : 'PERLES CLINIQUES:'}
                </h4>
                <p style={styles.modalText}>{selectedDrug.clinicalPearls}</p>
              </div>
            )}

            <button
              style={styles.modalCloseButton}
              onClick={() => setSelectedDrug(null)}
            >
              {currentLang === 'en' ? 'Close' : 'Fermer'}
            </button>
          </div>
        </div>
      )}
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
    borderBottom: '1px solid var(--border-teal)',
    flexWrap: 'wrap',
    gap: '10px'
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(47, 125, 91, 0.1)',
    border: '2px solid var(--accent-emerald)',
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
  content: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: 'var(--accent-gold)',
    fontSize: '32px',
    fontFamily: "'Playfair Display', serif"
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
    color: 'var(--text-secondary)',
    fontSize: '12px',
    margin: '5px 0'
  },
  drugIndication: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '10px 0'
  },
  moreButton: {
    background: 'rgba(47, 125, 91, 0.2)',
    border: '1px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '10px',
    transition: 'all 0.3s ease',
    width: '100%'
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '15px',
    padding: '30px',
    maxWidth: '700px',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '20px'
  },
  modalTitle: {
    color: 'var(--accent-gold)',
    fontSize: '28px',
    fontFamily: "'Playfair Display', serif",
    margin: '0 0 5px 0'
  },
  modalSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    margin: '0'
  },
  closeIconButton: {
    background: 'transparent',
    border: 'none',
    color: 'var(--accent-gold)',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0',
    fontWeight: '700'
  },
  modalDivider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
    marginBottom: '20px'
  },
  modalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '20px'
  },
  modalSection: {
    marginBottom: '20px'
  },
  modalLabel: {
    color: 'var(--accent-gold)',
    fontSize: '12px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  modalText: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '0'
  },
  modalCloseButton: {
    background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%)',
    color: 'var(--bg-obsidian)',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: '700',
    width: '100%',
    transition: 'all 0.3s ease',
    marginTop: '20px'
  }
};

export default DrugDirectory;