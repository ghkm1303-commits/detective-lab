import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const DrugManagement = ({ drugs, onBack, currentLang, userName, onStats, theme, onThemeChange }) => {
  const [selectedDrug, setSelectedDrug] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <div style={styles.rightGroup}>
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          <button onClick={onStats} className="user-button">
            👤 {userName}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>
          {currentLang === 'en' ? '📚 Drug Database' : '📚 Base de Données des Médicaments'}
        </h1>

        <div style={styles.drugsGrid}>
          {drugs.map(drug => (
            <div key={drug.id} style={styles.drugCard}>
              <h3 style={styles.drugCardTitle}>{drug.names.en}</h3>
              <p style={styles.drugCardSubtitle}>{drug.names.fr}</p>
              <p style={styles.drugCardClass}>{drug.therapeuticClass}</p>
              <button
                style={styles.viewButton}
                onClick={() => setSelectedDrug(drug)}
              >
                {currentLang === 'en' ? 'View Details' : 'Voir les Détails'}
              </button>
            </div>
          ))}
        </div>

        {drugs.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              {currentLang === 'en' ? 'No drugs in database' : 'Aucun médicament dans la base de données'}
            </p>
          </div>
        )}
      </div>

      {selectedDrug && (
        <div style={styles.modalOverlay} onClick={() => setSelectedDrug(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{selectedDrug.names.en}</h2>
              <button
                style={styles.closeButton}
                onClick={() => setSelectedDrug(null)}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.infoRow}>
                <label style={styles.label}>{currentLang === 'en' ? 'Class:' : 'Classe:'}</label>
                <p style={styles.value}>{selectedDrug.therapeuticClass}</p>
              </div>
              <div style={styles.infoRow}>
                <label style={styles.label}>{currentLang === 'en' ? 'Category:' : 'Catégorie:'}</label>
                <p style={styles.value}>{selectedDrug.category}</p>
              </div>
              <div style={styles.infoRow}>
                <label style={styles.label}>{currentLang === 'en' ? 'Route:' : 'Voie:'}</label>
                <p style={styles.value}>{selectedDrug.route}</p>
              </div>
              <div style={styles.infoRow}>
                <label style={styles.label}>{currentLang === 'en' ? 'Mechanism:' : 'Mécanisme:'}</label>
                <p style={styles.value}>{selectedDrug.mechanism}</p>
              </div>
              <div style={styles.infoRow}>
                <label style={styles.label}>{currentLang === 'en' ? 'Indications:' : 'Indications:'}</label>
                <p style={styles.value}>{selectedDrug.indications}</p>
              </div>
              <div style={styles.infoRow}>
                <label style={styles.label}>{currentLang === 'en' ? 'Side Effects:' : 'Effets Secondaires:'}</label>
                <p style={styles.value}>{selectedDrug.sideEffects.join(', ')}</p>
              </div>
              <div style={styles.infoRow}>
                <label style={styles.label}>{currentLang === 'en' ? 'Dosing:' : 'Posologie:'}</label>
                <p style={styles.value}>
                  <strong>{currentLang === 'en' ? 'Standard:' : 'Standard:'}</strong> {selectedDrug.dosing.standard}<br/>
                  <strong>{currentLang === 'en' ? 'Max:' : 'Max:'}</strong> {selectedDrug.dosing.maxDose}<br/>
                  <strong>{currentLang === 'en' ? 'Frequency:' : 'Fréquence:'}</strong> {selectedDrug.dosing.frequency}
                </p>
              </div>
            </div>
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
    background: 'rgba(184, 154, 90, 0.1)',
    border: '2px solid #B89A5A',
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
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    textAlign: 'center',
    marginBottom: '40px',
    color: 'var(--accent-gold)',
    fontSize: '36px',
    fontFamily: "'Playfair Display', serif"
  },
  drugsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  drugCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  drugCardTitle: {
    color: 'var(--accent-gold)',
    fontSize: '18px',
    margin: '0 0 5px 0',
    fontFamily: "'Playfair Display', serif"
  },
  drugCardSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '12px',
    margin: '0 0 10px 0'
  },
  drugCardClass: {
    color: 'var(--accent-teal)',
    fontSize: '13px',
    margin: '0 0 15px 0',
    fontWeight: '600'
  },
  viewButton: {
    padding: '8px 16px',
    background: 'var(--accent-gold)',
    color: 'var(--bg-obsidian)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyText: {
    color: 'var(--text-secondary)',
    fontSize: '16px'
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
    zIndex: 1000
  },
  modal: {
    background: 'var(--bg-card)',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    border: '2px solid var(--accent-gold)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  modalTitle: {
    color: 'var(--accent-gold)',
    fontSize: '24px',
    margin: '0',
    fontFamily: "'Playfair Display', serif"
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: 'var(--accent-gold)',
    fontSize: '24px',
    cursor: 'pointer'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  infoRow: {
    paddingBottom: '15px',
    borderBottom: '1px solid var(--border-gold)'
  },
  label: {
    color: 'var(--accent-gold)',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '8px'
  },
  value: {
    color: 'var(--text-primary)',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '0'
  }
};

export default DrugManagement;