import React, { useState, useEffect } from 'react';
import LanguageToggle from './LanguageToggle';

const DrugDirectory = ({ drugs, onBack, subject, currentLang, onLanguageChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 'cardiovascular', name: currentLang === 'en' ? 'Cardiovascular' : 'Cardiaque' },
    { id: 'nervous', name: currentLang === 'en' ? 'Nervous System' : 'Système Nerveux' },
    { id: 'endocrine', name: currentLang === 'en' ? 'Endocrine' : 'Endocrinien' },
    { id: 'respiratory', name: currentLang === 'en' ? 'Respiratory' : 'Respiratoire' },
    { id: 'digestive', name: currentLang === 'en' ? 'Digestive' : 'Digestif' },
    { id: 'immune', name: currentLang === 'en' ? 'Immune System' : 'Système Immunitaire' }
  ];

  const filteredDrugs = drugs.filter(d => {
    const matchesSearch = d.names.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.names.fr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || d.class === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedDrug) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={() => {
            setSelectedDrug(null);
            setExpandedDetails(false);
          }}>← {currentLang === 'en' ? 'Back' : 'Retour'}</button>
          <LanguageToggle currentLang={currentLang} onLanguageChange={onLanguageChange} />
        </div>

        <div style={styles.detailBox}>
          <h1 style={styles.drugName}>{selectedDrug.names.en}</h1>
          <p style={styles.drugNameFr}>{selectedDrug.names.fr}</p>

          <div style={styles.basicInfoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.label}>{currentLang === 'en' ? 'CLASS:' : 'CLASSE:'}</span>
              <span style={styles.value}>{selectedDrug.class}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>{currentLang === 'en' ? 'THERAPEUTIC:' : 'THÉRAPEUTIQUE:'}</span>
              <span style={styles.value}>{selectedDrug.therapeuticClass}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>{currentLang === 'en' ? 'ROUTE:' : 'VOIE:'}</span>
              <span style={styles.value}>{selectedDrug.route}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>{currentLang === 'en' ? 'MECHANISM:' : 'MÉCANISME:'}</span>
              <span style={styles.value}>{selectedDrug.mechanism}</span>
            </div>
          </div>

          {expandedDetails && (
            <>
              {selectedDrug.indications && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>📋 {currentLang === 'en' ? 'INDICATIONS' : 'INDICATIONS'}</h3>
                  <p style={styles.sectionContent}>{selectedDrug.indications}</p>
                </div>
              )}

              {selectedDrug.effects && selectedDrug.effects.length > 0 && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>✅ {currentLang === 'en' ? 'EFFECTS' : 'EFFETS'}</h3>
                  <p style={styles.sectionContent}>{selectedDrug.effects.join(', ')}</p>
                </div>
              )}

              {selectedDrug.sideEffects && selectedDrug.sideEffects.length > 0 && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>⚠️ {currentLang === 'en' ? 'SIDE EFFECTS' : 'EFFETS SECONDAIRES'}</h3>
                  <p style={styles.sectionContent}>{selectedDrug.sideEffects.join(', ')}</p>
                </div>
              )}

              {selectedDrug.contraindications && selectedDrug.contraindications.length > 0 && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>🚫 {currentLang === 'en' ? 'CONTRAINDICATIONS' : 'CONTRE-INDICATIONS'}</h3>
                  <p style={styles.sectionContent}>{selectedDrug.contraindications.join(', ')}</p>
                </div>
              )}

              {selectedDrug.dosing && selectedDrug.dosing.standard && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>💊 {currentLang === 'en' ? 'DOSING' : 'POSOLOGIE'}</h3>
                  <p style={styles.sectionContent}>
                    <strong>{currentLang === 'en' ? 'Standard:' : 'Standard:'}</strong> {selectedDrug.dosing.standard}<br/>
                    <strong>{currentLang === 'en' ? 'Max:' : 'Max:'}</strong> {selectedDrug.dosing.maxDose}<br/>
                    <strong>{currentLang === 'en' ? 'Frequency:' : 'Fréquence:'}</strong> {selectedDrug.dosing.frequency}
                  </p>
                </div>
              )}

              {selectedDrug.metabolism && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>🧬 {currentLang === 'en' ? 'METABOLISM' : 'MÉTABOLISME'}</h3>
                  <p style={styles.sectionContent}>{selectedDrug.metabolism}</p>
                </div>
              )}

              {selectedDrug.elimination && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>🚽 {currentLang === 'en' ? 'ELIMINATION' : 'ÉLIMINATION'}</h3>
                  <p style={styles.sectionContent}>{selectedDrug.elimination}</p>
                </div>
              )}

              {selectedDrug.halfLife && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>⏱️ {currentLang === 'en' ? 'HALF-LIFE' : 'DEMI-VIE'}</h3>
                  <p style={styles.sectionContent}>{selectedDrug.halfLife}</p>
                </div>
              )}
            </>
          )}

          <div style={styles.buttonGroup}>
            <button 
              style={styles.seeMoreButton}
              onClick={() => setExpandedDetails(!expandedDetails)}
            >
              {expandedDetails ? '▲ ' + (currentLang === 'en' ? 'See Less' : 'Voir Moins') : '▼ ' + (currentLang === 'en' ? 'See More' : 'Voir Plus')}
            </button>
            <button 
              style={styles.closeButton}
              onClick={() => {
                setSelectedDrug(null);
                setExpandedDetails(false);
              }}
            >
              {currentLang === 'en' ? 'Close' : 'Fermer'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>← {currentLang === 'en' ? 'Back' : 'Retour'}</button>
        <LanguageToggle currentLang={currentLang} onLanguageChange={onLanguageChange} />
      </div>

      <h1 style={styles.pageTitle}>📖 {currentLang === 'en' ? 'Drug Dictionary' : 'Dictionnaire des Médicaments'}</h1>

      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder={currentLang === 'en' ? 'Search drugs...' : 'Rechercher des médicaments...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        
        <div style={styles.categoryFilter}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              ...styles.filterBtn,
              background: !selectedCategory ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 217, 255, 0.05)'
            }}
          >
            {currentLang === 'en' ? 'All' : 'Tous'}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                ...styles.filterBtn,
                background: selectedCategory === cat.id ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 217, 255, 0.05)'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.drugsList}>
        {filteredDrugs.length > 0 ? (
          filteredDrugs.map(drug => (
            <button
              key={drug.id}
              style={styles.drugCard}
              onClick={() => {
                setSelectedDrug(drug);
                setExpandedDetails(false);
              }}
            >
              <div style={styles.cardName}>{drug.names.en}</div>
              <div style={styles.cardClass}>{drug.class}</div>
            </button>
          ))
        ) : (
          <div style={styles.noResults}>{currentLang === 'en' ? 'No drugs found' : 'Aucun médicament trouvé'}</div>
        )}
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
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(0, 217, 255, 0.1)'
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid var(--border-glow)',
    color: 'var(--text-primary)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '12px'
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    color: 'var(--accent-gold)',
    textAlign: 'center',
    margin: '0 0 15px 0'
  },
  filterSection: {
    maxWidth: '900px',
    margin: '0 auto 20px'
  },
  searchInput: {
    width: '100%',
    maxWidth: '600px',
    display: 'block',
    margin: '0 auto 15px',
    padding: '10px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  categoryFilter: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  filterBtn: {
    padding: '6px 12px',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '11px',
    fontFamily: 'inherit',
    fontWeight: '600',
    color: 'var(--text-primary)',
    transition: 'all 0.2s ease'
  },
  drugsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '10px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  drugCard: {
    padding: '12px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease'
  },
  cardName: {
    fontWeight: '700',
    color: 'var(--accent-gold)',
    fontSize: '13px',
    marginBottom: '4px'
  },
  cardClass: {
    fontSize: '10px',
    color: 'var(--text-secondary)'
  },
  noResults: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    padding: '40px'
  },
  detailBox: {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '15px',
    maxHeight: '85vh',
    overflowY: 'auto'
  },
  drugName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    color: 'var(--accent-gold)',
    margin: '0 0 3px 0'
  },
  drugNameFr: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '0 0 12px 0'
  },
  basicInfoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '15px'
  },
  infoItem: {
    padding: '8px',
    background: 'rgba(0, 217, 255, 0.05)',
    borderRadius: '6px',
    fontSize: '10px'
  },
  label: {
    color: 'var(--accent-gold)',
    fontWeight: '700',
    display: 'block'
  },
  value: {
    color: 'var(--text-primary)',
    fontSize: '11px',
    marginTop: '2px',
    display: 'block',
    lineHeight: '1.3'
  },
  section: {
    marginBottom: '12px'
  },
  sectionTitle: {
    fontSize: '11px',
    color: 'var(--accent-gold)',
    fontWeight: '700',
    margin: '0 0 6px 0'
  },
  sectionContent: {
    fontSize: '10px',
    color: 'var(--text-secondary)',
    margin: 0,
    lineHeight: '1.4',
    padding: '8px',
    background: 'rgba(0, 217, 255, 0.03)',
    borderRadius: '4px'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '15px'
  },
  seeMoreButton: {
    width: '100%',
    padding: '10px',
    background: 'rgba(0, 208, 132, 0.15)',
    border: '2px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'inherit'
  },
  closeButton: {
    width: '100%',
    padding: '10px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'inherit'
  }
};

export default DrugDirectory;