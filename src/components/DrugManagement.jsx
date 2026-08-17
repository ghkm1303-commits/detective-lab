import React, { useState } from 'react';
import LanguageToggle from './LanguageToggle';

const DrugManagement = ({ drugs, onDrugsUpdate, onBack, currentLang, onLanguageChange }) => {
  const [newDrugName, setNewDrugName] = useState('');
  const [newDrugClass, setNewDrugClass] = useState('cardiovascular');
  const [customDrugs, setCustomDrugs] = useState(drugs.filter(d => d.id > 1000));

  const categories = [
    { id: 'cardiovascular', name: currentLang === 'en' ? 'Cardiovascular' : 'Cardiaque' },
    { id: 'nervous', name: currentLang === 'en' ? 'Nervous System' : 'Système Nerveux' },
    { id: 'endocrine', name: currentLang === 'en' ? 'Endocrine' : 'Endocrinien' },
    { id: 'respiratory', name: currentLang === 'en' ? 'Respiratory' : 'Respiratoire' },
    { id: 'digestive', name: currentLang === 'en' ? 'Digestive' : 'Digestif' },
    { id: 'immune', name: currentLang === 'en' ? 'Immune System' : 'Système Immunitaire' }
  ];

  const addDrug = () => {
    if (!newDrugName.trim()) {
      alert(currentLang === 'en' ? 'Please enter a drug name' : 'Veuillez entrer un nom');
      return;
    }

    const newDrug = {
      id: Math.random() * 10000,
      names: { en: newDrugName, fr: newDrugName },
      class: newDrugClass,
      therapeuticClass: '',
      effects: [],
      indications: '',
      route: 'Oral',
      mechanism: '',
      sideEffects: [],
      contraindications: [],
      metabolism: '',
      elimination: '',
      halfLife: '',
      dosing: { standard: '', maxDose: '', frequency: '' },
      brandNames: [],
      clinicalPearls: []
    };

    const updatedDrugs = [...drugs, newDrug];
    onDrugsUpdate(updatedDrugs);
    setCustomDrugs([...customDrugs, newDrug]);
    setNewDrugName('');
  };

  const removeDrug = (drugId) => {
    const updatedDrugs = drugs.filter(d => d.id !== drugId);
    onDrugsUpdate(updatedDrugs);
    setCustomDrugs(customDrugs.filter(d => d.id !== drugId));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← {currentLang === 'en' ? 'Back' : 'Retour'}
        </button>
        <LanguageToggle currentLang={currentLang} onLanguageChange={onLanguageChange} />
      </div>

      <h1 style={styles.title}>
        {currentLang === 'en' ? '⚙️ Manage Drugs' : '⚙️ Gérer les Médicaments'}
      </h1>

      <div style={styles.addSection}>
        <h2 style={styles.sectionTitle}>
          {currentLang === 'en' ? '➕ Add New Drug' : '➕ Ajouter un Nouveau Médicament'}
        </h2>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            {currentLang === 'en' ? 'Drug Name' : 'Nom du Médicament'}
          </label>
          <input
            type="text"
            value={newDrugName}
            onChange={(e) => setNewDrugName(e.target.value)}
            placeholder={currentLang === 'en' ? 'Enter drug name...' : 'Entrez le nom...'}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            {currentLang === 'en' ? 'Category' : 'Catégorie'}
          </label>
          <select
            value={newDrugClass}
            onChange={(e) => setNewDrugClass(e.target.value)}
            style={styles.select}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button style={styles.addButton} onClick={addDrug}>
          {currentLang === 'en' ? '✓ Add Drug' : '✓ Ajouter'}
        </button>
      </div>

      <div style={styles.listSection}>
        <h2 style={styles.sectionTitle}>
          {currentLang === 'en' ? '📋 Custom Drugs' : '📋 Médicaments Personnalisés'}
        </h2>

        {customDrugs.length > 0 ? (
          <div style={styles.drugsList}>
            {customDrugs.map(drug => (
              <div key={drug.id} style={styles.drugItem}>
                <div style={styles.drugInfo}>
                  <h4 style={styles.drugName}>{drug.names.en}</h4>
                  <p style={styles.drugClass}>{drug.class}</p>
                </div>
                <button
                  style={styles.deleteButton}
                  onClick={() => removeDrug(drug.id)}
                >
                  {currentLang === 'en' ? '🗑️ Delete' : '🗑️ Supprimer'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyMessage}>
            {currentLang === 'en' ? 'No custom drugs added yet' : 'Aucun médicament personnalisé'}
          </div>
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
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    color: 'var(--accent-gold)',
    textAlign: 'center',
    margin: '0 0 30px 0'
  },
  addSection: {
    maxWidth: '600px',
    margin: '0 auto 40px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '20px'
  },
  sectionTitle: {
    fontSize: '16px',
    color: 'var(--accent-gold)',
    fontWeight: '700',
    margin: '0 0 15px 0',
    fontFamily: "'Playfair Display', serif"
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: '10px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  addButton: {
    width: '100%',
    padding: '10px',
    background: 'rgba(0, 208, 132, 0.15)',
    border: '2px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit'
  },
  listSection: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  drugsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  drugItem: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '8px',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  drugInfo: {
    flex: 1
  },
  drugName: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 4px 0'
  },
  drugClass: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  deleteButton: {
    padding: '6px 12px',
    background: 'rgba(255, 71, 87, 0.15)',
    border: '1px solid rgba(255, 71, 87, 0.3)',
    color: 'var(--danger)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontFamily: 'inherit',
    fontWeight: '600'
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'var(--text-secondary)',
    fontSize: '13px'
  }
};

export default DrugManagement;