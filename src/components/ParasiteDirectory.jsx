import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const ParasiteDirectory = ({ organisms, onBack, currentLang, userName, onStats, theme, onThemeChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOrganism, setSelectedOrganism] = useState(null);
  const lang = currentLang === 'fr' ? 'fr' : 'en';

  const categories = [
    { id: 'protozoa', enName: 'Protozoa', frName: 'Protozoaires' },
    { id: 'helminth', enName: 'Helminths', frName: 'Helminthes' },
    { id: 'fungal', enName: 'Mycology', frName: 'Mycologie' },
    { id: 'entomology', enName: 'Entomology', frName: 'Entomologie' },
    { id: 'overview', enName: 'Overview', frName: "Vue d'ensemble" }
  ];

  const filteredOrganisms = selectedCategory
    ? organisms.filter(o => o.category === selectedCategory)
    : organisms;

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
          {currentLang === 'en' ? '📖 Parasitology Study Mode' : '📖 Mode Étude - Parasitologie'}
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
            {currentLang === 'en' ? 'All' : 'Tous'} ({organisms.length})
          </button>
          {categories.map(cat => {
            const count = organisms.filter(o => o.category === cat.id).length;
            if (count === 0) return null;
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

        <div style={styles.organismsList}>
          {filteredOrganisms.map(organism => (
            <div key={organism.id} style={styles.organismCard}>
              <div style={styles.organismHeader}>
                <h3 style={styles.organismName}>{organism.names.en}</h3>
              </div>
              <p style={styles.organismClass}>
                {typeof organism.class === 'object' ? organism.class[lang] : organism.class}
              </p>
              <p style={styles.organismInfo}>
                <strong>{currentLang === 'en' ? 'Transmission:' : 'Transmission:'}</strong>{' '}
                {typeof organism.transmission === 'object' ? organism.transmission[lang] : organism.transmission}
              </p>
              <button style={styles.moreButton} onClick={() => setSelectedOrganism(organism)}>
                {currentLang === 'en' ? 'See More' : 'Voir Plus'} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedOrganism && (
        <div style={styles.modalOverlay} onClick={() => setSelectedOrganism(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{selectedOrganism.names.en}</h2>
                <p style={styles.modalSubtitle}>{selectedOrganism.names.fr}</p>
              </div>
              <button style={styles.closeIconButton} onClick={() => setSelectedOrganism(null)}>✕</button>
            </div>
            <div style={styles.modalDivider}></div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-gold)' }}>
                {currentLang === 'en' ? 'CLASS:' : 'CLASSE:'}
              </h4>
              <p style={styles.modalText}>
                {typeof selectedOrganism.class === 'object' ? selectedOrganism.class[lang] : selectedOrganism.class}
              </p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-teal)' }}>
                🔬 {currentLang === 'en' ? 'MORPHOLOGY:' : 'MORPHOLOGIE:'}
              </h4>
              <p style={styles.modalText}>
                {typeof selectedOrganism.morphology === 'object' ? selectedOrganism.morphology[lang] : selectedOrganism.morphology}
              </p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-emerald)' }}>
                🦟 {currentLang === 'en' ? 'TRANSMISSION:' : 'TRANSMISSION:'}
              </h4>
              <p style={styles.modalText}>
                {typeof selectedOrganism.transmission === 'object' ? selectedOrganism.transmission[lang] : selectedOrganism.transmission}
              </p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-blue)' }}>
                🔄 {currentLang === 'en' ? 'LIFE CYCLE:' : 'CYCLE DE VIE:'}
              </h4>
              <p style={styles.modalText}>
                {typeof selectedOrganism.lifecycle === 'object' ? selectedOrganism.lifecycle[lang] : selectedOrganism.lifecycle}
              </p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-blue)' }}>
                ⚠️ {currentLang === 'en' ? 'CLINICAL MANIFESTATIONS:' : 'MANIFESTATIONS CLINIQUES:'}
              </h4>
              <ul style={styles.modalList}>
                {(Array.isArray(selectedOrganism.clinicalManifestations)
                  ? selectedOrganism.clinicalManifestations
                  : selectedOrganism.clinicalManifestations[lang]
                ).map((m, idx) => (
                  <li key={idx} style={styles.modalListItem}>{m}</li>
                ))}
              </ul>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-gold)' }}>
                🧪 {currentLang === 'en' ? 'DIAGNOSIS:' : 'DIAGNOSTIC:'}
              </h4>
              <p style={styles.modalText}>
                {typeof selectedOrganism.diagnosis === 'object' ? selectedOrganism.diagnosis[lang] : selectedOrganism.diagnosis}
              </p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-teal)' }}>
                💊 {currentLang === 'en' ? 'TREATMENT:' : 'TRAITEMENT:'}
              </h4>
              <p style={styles.modalText}>
                {typeof selectedOrganism.treatment === 'object' ? selectedOrganism.treatment[lang] : selectedOrganism.treatment}
              </p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-emerald)' }}>
                🌍 {currentLang === 'en' ? 'GEOGRAPHIC DISTRIBUTION:' : 'RÉPARTITION GÉOGRAPHIQUE:'}
              </h4>
              <p style={styles.modalText}>
                {typeof selectedOrganism.geographicDistribution === 'object' ? selectedOrganism.geographicDistribution[lang] : selectedOrganism.geographicDistribution}
              </p>
            </div>

            {typeof selectedOrganism.eosinophilia === 'boolean' && (
              <div style={styles.modalSection}>
                <h4 style={{ ...styles.modalLabel, color: 'var(--accent-gold)' }}>
                  🩸 {currentLang === 'en' ? 'EOSINOPHILIA:' : 'HYPERÉOSINOPHILIE:'}
                </h4>
                <p style={styles.modalText}>
                  {selectedOrganism.eosinophilia
                    ? (currentLang === 'en' ? 'Yes' : 'Oui')
                    : (currentLang === 'en' ? 'No' : 'Non')}
                </p>
              </div>
            )}

            <button style={styles.modalCloseButton} onClick={() => setSelectedOrganism(null)}>
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
  content: { maxWidth: '1000px', margin: '0 auto' },
  title: { textAlign: 'center', marginBottom: '30px', color: 'var(--accent-gold)', fontSize: '32px', fontFamily: "'Playfair Display', serif" },
  categoryFilter: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px', justifyContent: 'center' },
  filterButton: {
    padding: '8px 16px', border: '2px solid var(--accent-gold)', borderRadius: '20px',
    cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: '600',
    transition: 'all 0.3s ease', background: 'transparent'
  },
  organismsList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  organismCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid var(--border-gold)', borderRadius: '10px', padding: '20px'
  },
  organismHeader: { marginBottom: '8px' },
  organismName: { color: 'var(--accent-gold)', fontSize: '16px', margin: '0', fontFamily: "'Playfair Display', serif" },
  organismClass: { color: 'var(--text-secondary)', fontSize: '12px', margin: '5px 0' },
  organismInfo: { fontSize: '12px', color: 'var(--text-secondary)', margin: '5px 0 12px 0' },
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

export default ParasiteDirectory;