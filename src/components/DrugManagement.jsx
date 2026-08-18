import React, { useState } from 'react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

const DrugManagement = ({ drugs, onDrugsUpdate, onBack, currentLang, onLanguageChange, userName, onStats, theme, onThemeChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'cardiovascular',
    therapeuticClass: '',
    indications: '',
    route: 'Oral',
    sideEffects: '',
    dosing: ''
  });

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

  const customDrugs = drugs.filter(d => d.id > 1000);

  const handleAddDrug = () => {
    if (!formData.name.trim()) return;

    const newDrug = {
      id: Math.max(...drugs.map(d => d.id), 1000) + 1,
      names: { en: formData.name, fr: formData.name },
      class: formData.category,
      therapeuticClass: formData.therapeuticClass || formData.name,
      category: formData.category,
      effects: [],
      indications: formData.indications || (currentLang === 'en' ? 'Custom drug' : 'Médicament personnalisé'),
      route: formData.route,
      mechanism: currentLang === 'en' ? 'To be filled' : 'À remplir',
      sideEffects: formData.sideEffects ? formData.sideEffects.split(',').map(s => s.trim()) : [],
      contraindications: [],
      metabolism: currentLang === 'en' ? 'Not specified' : 'Non spécifié',
      elimination: currentLang === 'en' ? 'Not specified' : 'Non spécifié',
      halfLife: currentLang === 'en' ? 'Not specified' : 'Non spécifié',
      dosing: { standard: formData.dosing, maxDose: '', frequency: '' },
      brandNames: [],
      clinicalPearls: ''
    };

    const updated = [...drugs, newDrug];
    onDrugsUpdate(updated);
    setFormData({
      name: '',
      category: 'cardiovascular',
      therapeuticClass: '',
      indications: '',
      route: 'Oral',
      sideEffects: '',
      dosing: ''
    });
  };

  const handleDeleteDrug = (id) => {
    const updated = drugs.filter(d => d.id !== id);
    onDrugsUpdate(updated);
  };

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
        <h1 style={styles.title}>⚙️ {currentLang === 'en' ? 'Manage Drugs' : 'Gérer les Médicaments'}</h1>

        <div style={styles.mainGrid}>
          {/* ADD NEW DRUG SECTION */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>➕ {currentLang === 'en' ? 'Add New Drug' : 'Ajouter un Nouveau Médicament'}</h3>

            <div style={styles.formSection}>
              <label style={styles.label}>
                {currentLang === 'en' ? 'Drug Name *' : 'Nom du Médicament *'}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={currentLang === 'en' ? 'Enter drug name...' : 'Entrez le nom du médicament...'}
                style={styles.input}
              />

              <label style={styles.label}>
                {currentLang === 'en' ? 'Category' : 'Catégorie'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={styles.select}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {currentLang === 'en' ? cat.enName : cat.frName}
                  </option>
                ))}
              </select>

              <label style={styles.label}>
                {currentLang === 'en' ? 'Therapeutic Class' : 'Classe Thérapeutique'}
              </label>
              <input
                type="text"
                value={formData.therapeuticClass}
                onChange={(e) => setFormData({ ...formData, therapeuticClass: e.target.value })}
                placeholder={currentLang === 'en' ? 'e.g., Beta Blocker' : 'ex., Bêta-bloquant'}
                style={styles.input}
              />

              <label style={styles.label}>
                {currentLang === 'en' ? 'Indications' : 'Indications'}
              </label>
              <textarea
                value={formData.indications}
                onChange={(e) => setFormData({ ...formData, indications: e.target.value })}
                placeholder={currentLang === 'en' ? 'Main uses...' : 'Utilisations principales...'}
                style={{...styles.input, minHeight: '60px'}}
              />

              <label style={styles.label}>
                {currentLang === 'en' ? 'Route' : 'Voie'}
              </label>
              <input
                type="text"
                value={formData.route}
                onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                placeholder={currentLang === 'en' ? 'e.g., Oral' : 'ex., Orale'}
                style={styles.input}
              />

              <label style={styles.label}>
                {currentLang === 'en' ? 'Side Effects (comma-separated)' : 'Effets secondaires (séparés par des virgules)'}
              </label>
              <input
                type="text"
                value={formData.sideEffects}
                onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                placeholder={currentLang === 'en' ? 'e.g., Nausea, Dizziness' : 'ex., Nausée, Vertiges'}
                style={styles.input}
              />

              <label style={styles.label}>
                {currentLang === 'en' ? 'Dosing' : 'Posologie'}
              </label>
              <input
                type="text"
                value={formData.dosing}
                onChange={(e) => setFormData({ ...formData, dosing: e.target.value })}
                placeholder={currentLang === 'en' ? 'e.g., 10mg twice daily' : 'ex., 10mg deux fois par jour'}
                style={styles.input}
              />

              <button style={styles.addButton} onClick={handleAddDrug}>
                ✓ {currentLang === 'en' ? 'Add Drug' : 'Ajouter le Médicament'}
              </button>
            </div>
          </div>

          {/* CUSTOM DRUGS SECTION */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📋 {currentLang === 'en' ? 'Custom Drugs' : 'Médicaments Personnalisés'}</h3>

            {customDrugs.length === 0 ? (
              <p style={styles.emptyMessage}>
                {currentLang === 'en' ? 'No custom drugs added yet' : 'Aucun médicament personnalisé ajouté'}
              </p>
            ) : (
              <div style={styles.drugsList}>
                {customDrugs.map(drug => (
                  <div key={drug.id} style={styles.drugItem}>
                    <div>
                      <p style={styles.drugItemName}>{drug.names.en}</p>
                      <p style={styles.drugItemClass}>{drug.therapeuticClass || drug.class}</p>
                    </div>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDeleteDrug(drug.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
    borderBottom: '1px solid var(--border-teal)',
    flexWrap: 'wrap',
    gap: '10px'
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(22, 124, 128, 0.1)',
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
    maxWidth: '1000px',
    margin: '0 auto'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#B89A5A',
    fontSize: '32px',
    fontFamily: "'Playfair Display', serif"
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px'
  },
  card: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '1px solid rgba(184, 154, 90, 0.2)',
    borderRadius: '10px',
    padding: '20px',
    transition: 'all 0.3s ease'
  },
  cardTitle: {
    color: '#B89A5A',
    fontSize: '16px',
    margin: '0 0 20px 0',
    fontFamily: "'Playfair Display', serif"
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  label: {
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  input: {
    padding: '10px',
    background: 'rgba(22, 124, 128, 0.05)',
    border: '2px solid #167C80',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    fontFamily: 'inherit',
    fontSize: '13px'
  },
  select: {
    padding: '10px',
    background: 'rgba(22, 124, 128, 0.05)',
    border: '2px solid #167C80',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    fontFamily: 'inherit',
    fontSize: '13px'
  },
  addButton: {
    padding: '12px',
    background: 'linear-gradient(135deg, #2F7D5B, #3D9B73)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: '700'
  },
  emptyMessage: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    textAlign: 'center',
    padding: '20px'
  },
  drugsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  drugItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(22, 124, 128, 0.05)',
    borderRadius: '6px',
    borderLeft: '3px solid #167C80'
  },
  drugItemName: {
    color: '#B89A5A',
    fontSize: '13px',
    fontWeight: '700',
    margin: '0 0 5px 0'
  },
  drugItemClass: {
    color: 'var(--text-secondary)',
    fontSize: '11px',
    margin: '0'
  },
  deleteButton: {
    background: 'rgba(230, 57, 70, 0.1)',
    border: 'none',
    color: '#E63946',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default DrugManagement;