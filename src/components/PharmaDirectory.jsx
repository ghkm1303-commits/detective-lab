import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const PharmaDirectory = ({ drugs, onBack, currentLang, userName, onStats, theme, onThemeChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'cholinergic', enName: 'Cholinergic', frName: 'Cholinergique' },
    { id: 'adrenergic', enName: 'Adrenergic', frName: 'Adrénergique' },
    { id: 'amino_acid', enName: 'Amino Acids', frName: 'Acides Aminés' },
    { id: 'histamine', enName: 'Histamine', frName: 'Histamine' },
    { id: 'dopaminergic', enName: 'Dopaminergic', frName: 'Dopaminergique' },
    { id: 'renin_angiotensin', enName: 'Renin-Angiotensin', frName: 'Rénine-Angiotensine' },
    { id: 'nitric_oxide', enName: 'Nitric Oxide', frName: "Monoxyde d'Azote" },
    { id: 'serotonergic', enName: 'Serotonergic', frName: 'Sérotoninergique' },
    { id: 'prostaglandin', enName: 'Prostaglandins', frName: 'Prostaglandines' },
    { id: 'ion_channels', enName: 'K+/Ca2+ Channels', frName: 'Canaux K+/Ca2+' },
    { id: 'anesthetics', enName: 'Anesthetics', frName: 'Anesthésiques' },
    { id: 'antibiotics', enName: 'Antibiotics', frName: 'Antibiotiques' },
    { id: 'anticancer', enName: 'Anticancer', frName: 'Anticancéreux' },
    { id: 'ion_transporters', enName: 'Diuretics', frName: 'Diurétiques' },
    { id: 'hemostasis', enName: 'Hemostasis', frName: 'Hémostase' },
    { id: 'opioids', enName: 'Opioids', frName: 'Opioïdes' },
    { id: 'sodium_channels', enName: 'Na+ Channels', frName: 'Canaux Na+' },
    { id: 'pumps', enName: 'Pumps', frName: 'Pompes' }
  ];

  const filteredDrugs = drugs.filter(d => {
    const matchesCategory = !selectedCategory || d.category === selectedCategory;
    const matchesSearch = !searchTerm || d.names.en.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button className="back-button" onClick={onBack}>
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
          {currentLang === 'en' ? '📖 Pharmacology Study Mode' : '📖 Mode Étude - Pharmacologie'}
        </h1>

        <input
          type="text"
          placeholder={currentLang === 'en' ? 'Search drug name...' : 'Chercher un médicament...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.categoryFilter}>
          <button
            style={{ ...styles.filterButton, background: !selectedCategory ? 'var(--accent-gold)' : 'transparent', color: !selectedCategory ? 'var(--bg-obsidian)' : 'var(--accent-gold)' }}
            onClick={() => setSelectedCategory(null)}
          >
            {currentLang === 'en' ? 'All' : 'Tous'} ({drugs.length})
          </button>
          {categories.map(cat => {
            const count = drugs.filter(d => d.category === cat.id).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                style={{ ...styles.filterButton, background: selectedCategory === cat.id ? 'var(--accent-teal)' : 'transparent', color: selectedCategory === cat.id ? 'white' : 'var(--accent-teal)' }}
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
              <h3 style={styles.drugName}>{drug.names.en}</h3>
              <p style={styles.drugClass}>{drug.therapeuticClass}</p>
              <button style={styles.moreButton} onClick={() => setSelectedDrug(drug)}>
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
              <button style={styles.closeIconButton} onClick={() => setSelectedDrug(null)}>✕</button>
            </div>
            <div style={styles.modalDivider}></div>

            {[
              ['CLASS', selectedDrug.therapeuticClass, 'var(--accent-gold)'],
              ['ROUTE', selectedDrug.route, 'var(--accent-teal)'],
              ['MECHANISM', selectedDrug.mechanism, 'var(--accent-blue)'],
              ['INDICATIONS', selectedDrug.indications, 'var(--accent-emerald)']
            ].map(([label, value, color]) => (
              <div key={label} style={styles.modalSection}>
                <h4 style={{ ...styles.modalLabel, color }}>{label}:</h4>
                <p style={styles.modalText}>{value}</p>
              </div>
            ))}

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-blue)' }}>SIDE EFFECTS:</h4>
              <ul style={styles.modalList}>
                {selectedDrug.sideEffects.map((s, i) => <li key={i} style={styles.modalListItem}>{s}</li>)}
              </ul>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-gold)' }}>DOSING:</h4>
              <p style={styles.modalText}>
                <strong>Standard:</strong> {selectedDrug.dosing.standard}<br/>
                <strong>Max:</strong> {selectedDrug.dosing.maxDose}<br/>
                <strong>Frequency:</strong> {selectedDrug.dosing.frequency}
              </p>
            </div>

            {[
              ['METABOLISM', selectedDrug.metabolism, 'var(--accent-teal)'],
              ['ELIMINATION', selectedDrug.elimination, 'var(--accent-emerald)'],
              ['HALF-LIFE', selectedDrug.halfLife, 'var(--accent-gold)']
            ].map(([label, value, color]) => (
              <div key={label} style={styles.modalSection}>
                <h4 style={{ ...styles.modalLabel, color }}>{label}:</h4>
                <p style={styles.modalText}>{value}</p>
              </div>
            ))}

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-blue)' }}>CONTRAINDICATIONS:</h4>
              <ul style={styles.modalList}>
                {selectedDrug.contraindications.map((c, i) => <li key={i} style={styles.modalListItem}>{c}</li>)}
              </ul>
            </div>

            {selectedDrug.clinicalPearls && (
              <div style={styles.modalSection}>
                <h4 style={{ ...styles.modalLabel, color: 'var(--accent-teal)' }}>💡 CLINICAL PEARLS:</h4>
                <p style={styles.modalText}>{selectedDrug.clinicalPearls}</p>
              </div>
            )}

            <button style={styles.modalCloseButton} onClick={() => setSelectedDrug(null)}>
              {currentLang === 'en' ? 'Close' : 'Fermer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', padding: '15px', position: 'relative', zIndex: 10 },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid var(--border-teal)',
    flexWrap: 'wrap', gap: '10px'
  },
  rightGroup: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  content: { maxWidth: '1100px', margin: '0 auto' },
  title: { textAlign: 'center', marginBottom: '20px', color: 'var(--accent-gold)', fontSize: '32px', fontFamily: "'Playfair Display', serif" },
  searchInput: {
    width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '2px solid var(--accent-gold)',
    borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', marginBottom: '20px', fontFamily: 'inherit'
  },
  categoryFilter: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px', justifyContent: 'center' },
  filterButton: {
    padding: '8px 16px', border: '2px solid var(--accent-gold)', borderRadius: '20px',
    cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: '600',
    transition: 'all 0.3s ease', background: 'transparent'
  },
  drugsList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' },
  drugCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid var(--border-gold)', borderRadius: '10px', padding: '18px'
  },
  drugName: { color: 'var(--accent-gold)', fontSize: '15px', margin: '0 0 6px 0', fontFamily: "'Playfair Display', serif" },
  drugClass: { color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 12px 0' },
  moreButton: {
    padding: '8px 12px', background: 'var(--accent-gold)', color: 'var(--bg-obsidian)',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600'
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    background: 'var(--bg-card)', borderRadius: '12px', padding: '30px', maxWidth: '600px',
    maxHeight: '80vh', overflowY: 'auto', border: '2px solid var(--accent-gold)'
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' },
  modalTitle: { color: 'var(--accent-gold)', fontSize: '24px', margin: '0', fontFamily: "'Playfair Display', serif" },
  modalSubtitle: { color: 'var(--text-secondary)', fontSize: '12px', margin: '5px 0 0 0', fontStyle: 'italic' },
  closeIconButton: { background: 'transparent', border: 'none', color: 'var(--accent-gold)', fontSize: '20px', cursor: 'pointer' },
  modalDivider: { height: '1px', background: 'var(--border-gold)', marginBottom: '20px' },
  modalSection: { marginBottom: '20px' },
  modalLabel: { fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 8px 0', letterSpacing: '0.5px' },
  modalText: { color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.6', margin: '0' },
  modalList: { margin: '0', paddingLeft: '18px' },
  modalListItem: { color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '4px' },
  modalCloseButton: {
    width: '100%', padding: '12px', background: 'var(--accent-gold)', color: 'var(--bg-obsidian)',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', marginTop: '15px'
  }
};

export default PharmaDirectory;