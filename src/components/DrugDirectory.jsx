import React, { useState } from 'react';

const DrugDirectory = ({ drugs, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState(false);

  const filteredDrugs = drugs.filter(d =>
    d.names.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.names.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedDrug) {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => {
          setSelectedDrug(null);
          setExpandedDetails(false);
        }}>
          ← Back to List
        </button>

        <div style={styles.detailBox}>
          <h1 style={styles.drugName}>{selectedDrug.names.en}</h1>
          <p style={styles.drugNameFr}>{selectedDrug.names.fr}</p>

          {/* BASIC INFO - ALWAYS SHOWN */}
          <div style={styles.basicInfoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.label}>CLASS:</span>
              <span style={styles.value}>{selectedDrug.class}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>THERAPEUTIC:</span>
              <span style={styles.value}>{selectedDrug.therapeuticClass}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>ROUTE:</span>
              <span style={styles.value}>{selectedDrug.route}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>MECHANISM:</span>
              <span style={styles.value}>{selectedDrug.mechanism}</span>
            </div>
          </div>

          {/* EXPANDED DETAILS - SHOWN WHEN "SEE MORE" CLICKED */}
          {expandedDetails && (
            <>
              {selectedDrug.indications && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>📋 INDICATIONS</h3>
                  <p style={styles.sectionContent}>{selectedDrug.indications}</p>
                </div>
              )}

              {selectedDrug.effects && selectedDrug.effects.length > 0 && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>✅ EFFECTS</h3>
                  <p style={styles.sectionContent}>{selectedDrug.effects.join(', ')}</p>
                </div>
              )}

              {selectedDrug.sideEffects && selectedDrug.sideEffects.length > 0 && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>⚠️ SIDE EFFECTS</h3>
                  <p style={styles.sectionContent}>{selectedDrug.sideEffects.join(', ')}</p>
                </div>
              )}

              {selectedDrug.contraindications && selectedDrug.contraindications.length > 0 && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>🚫 CONTRAINDICATIONS</h3>
                  <p style={styles.sectionContent}>{selectedDrug.contraindications.join(', ')}</p>
                </div>
              )}

              {selectedDrug.dosing && selectedDrug.dosing.standard && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>💊 DOSING</h3>
                  <p style={styles.sectionContent}>
                    <strong>Standard:</strong> {selectedDrug.dosing.standard}<br/>
                    <strong>Max:</strong> {selectedDrug.dosing.maxDose}<br/>
                    <strong>Frequency:</strong> {selectedDrug.dosing.frequency}
                  </p>
                </div>
              )}

              {selectedDrug.metabolism && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>🧬 METABOLISM</h3>
                  <p style={styles.sectionContent}>{selectedDrug.metabolism}</p>
                </div>
              )}

              {selectedDrug.elimination && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>🚽 ELIMINATION</h3>
                  <p style={styles.sectionContent}>{selectedDrug.elimination}</p>
                </div>
              )}

              {selectedDrug.halfLife && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>⏱️ HALF-LIFE</h3>
                  <p style={styles.sectionContent}>{selectedDrug.halfLife}</p>
                </div>
              )}

              {selectedDrug.proteinBinding && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>🔗 PROTEIN BINDING</h3>
                  <p style={styles.sectionContent}>{selectedDrug.proteinBinding}</p>
                </div>
              )}

              {selectedDrug.onsetOfAction && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>⚡ ONSET OF ACTION</h3>
                  <p style={styles.sectionContent}>{selectedDrug.onsetOfAction}</p>
                </div>
              )}

              {selectedDrug.durationOfAction && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>⏳ DURATION</h3>
                  <p style={styles.sectionContent}>{selectedDrug.durationOfAction}</p>
                </div>
              )}

              {selectedDrug.fdaApproval && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>✓ FDA APPROVAL</h3>
                  <p style={styles.sectionContent}>{selectedDrug.fdaApproval}</p>
                </div>
              )}

              {selectedDrug.clinicalPearls && selectedDrug.clinicalPearls.length > 0 && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>💡 CLINICAL PEARLS</h3>
                  <p style={styles.sectionContent}>{selectedDrug.clinicalPearls.join(', ')}</p>
                </div>
              )}
            </>
          )}

          {/* BUTTONS */}
          <div style={styles.buttonGroup}>
            <button 
              style={styles.seeMoreButton}
              onClick={() => setExpandedDetails(!expandedDetails)}
            >
              {expandedDetails ? '▲ See Less' : '▼ See More'}
            </button>
            <button 
              style={styles.closeButton}
              onClick={() => {
                setSelectedDrug(null);
                setExpandedDetails(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={onBack}>← Back</button>

      <h1 style={styles.pageTitle}>📖 Drug Directory</h1>

      <input
        type="text"
        placeholder="Search drugs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

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
          <div style={styles.noResults}>No drugs found</div>
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
    zIndex: 10,
    overflow: 'hidden'
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid var(--border-glow)',
    color: 'var(--text-primary)',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '15px',
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
  searchInput: {
    width: '100%',
    maxWidth: '500px',
    display: 'block',
    margin: '0 auto 20px',
    padding: '10px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
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