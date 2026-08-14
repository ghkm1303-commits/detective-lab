import React, { useState } from 'react';

const DrugManagement = ({ drugs, onDrugsUpdate, onBack }) => {
  const [formData, setFormData] = useState({
    names_en: '',
    names_fr: '',
    class: ''
  });

  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDrug = () => {
    if (!formData.names_en.trim() || !formData.names_fr.trim() || !formData.class.trim()) {
      alert('Please fill all fields');
      return;
    }

    if (editingId) {
      const updated = drugs.map(d =>
        d.id === editingId
          ? {
              ...d,
              names: { en: formData.names_en, fr: formData.names_fr },
              class: formData.class
            }
          : d
      );
      onDrugsUpdate(updated);
      setEditingId(null);
    } else {
      const newDrug = {
        id: Math.max(...drugs.map(d => d.id), 0) + 1,
        names: { en: formData.names_en, fr: formData.names_fr },
        class: formData.class,
        therapeuticClass: formData.class,
        effects: [],
        indications: '',
        route: 'Oral',
        mechanism: '',
        sideEffects: [],
        contraindications: [],
        metabolism: '',
        elimination: '',
        halfLife: '',
        proteinBinding: '',
        absorption: '',
        distribution: '',
        bioavailability: '',
        volumeOfDistribution: '',
        dosing: { standard: '', maxDose: '', frequency: '' },
        onsetOfAction: '',
        durationOfAction: '',
        peakConcentration: '',
        specialPopulations: {},
        foodInteractions: [],
        monitoringParameters: [],
        tdm: '',
        uniqueFeature: '',
        brandNames: [],
        formulations: [],
        fdaApproval: '',
        clinicalPearls: []
      };
      onDrugsUpdate([...drugs, newDrug]);
    }

    setFormData({ names_en: '', names_fr: '', class: '' });
  };

  const handleDelete = (id) => {
    if (confirm('Delete this drug?')) {
      onDrugsUpdate(drugs.filter(d => d.id !== id));
    }
  };

  const handleEdit = (drug) => {
    setFormData({
      names_en: drug.names.en,
      names_fr: drug.names.fr,
      class: drug.class
    });
    setEditingId(drug.id);
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={onBack}>← Back</button>

      <h1 style={styles.title}>⚙️ Manage Drugs</h1>

      {/* Add/Edit Form */}
      <div style={styles.formBox}>
        <h2 style={styles.formTitle}>{editingId ? 'Edit Drug' : 'Add New Drug'}</h2>
        
        <input
          type="text"
          name="names_en"
          placeholder="Drug name (English)"
          value={formData.names_en}
          onChange={handleInputChange}
          style={styles.input}
        />

        <input
          type="text"
          name="names_fr"
          placeholder="Drug name (French)"
          value={formData.names_fr}
          onChange={handleInputChange}
          style={styles.input}
        />

        <input
          type="text"
          name="class"
          placeholder="Drug class"
          value={formData.class}
          onChange={handleInputChange}
          style={styles.input}
        />

        <button style={styles.addButton} onClick={handleAddDrug}>
          {editingId ? '✓ Update Drug' : '+ Add Drug'}
        </button>

        {editingId && (
          <button
            style={styles.cancelButton}
            onClick={() => {
              setEditingId(null);
              setFormData({ names_en: '', names_fr: '', class: '' });
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Drugs List */}
      <div style={styles.drugsContainer}>
        <h2 style={styles.listTitle}>All Drugs ({drugs.length})</h2>
        
        {drugs.length > 0 ? (
          <div style={styles.drugsList}>
            {drugs.map(drug => (
              <div key={drug.id} style={styles.drugItem}>
                <div style={styles.drugInfo}>
                  <div style={styles.drugName}>{drug.names.en}</div>
                  <div style={styles.drugClass}>{drug.class}</div>
                </div>
                <div style={styles.actionButtons}>
                  <button
                    style={styles.editBtn}
                    onClick={() => handleEdit(drug)}
                  >
                    ✏️
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(drug.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noData}>No drugs yet. Add one!</div>
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
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    color: 'var(--accent-gold)',
    textAlign: 'center',
    margin: '0 0 20px 0'
  },
  formBox: {
    maxWidth: '500px',
    margin: '0 auto 30px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(42, 47, 74, 0.9) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    padding: '15px'
  },
  formTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    color: 'var(--accent-gold)',
    margin: '0 0 12px 0'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
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
    marginBottom: '8px',
    background: 'rgba(212, 175, 55, 0.15)',
    border: '2px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit'
  },
  cancelButton: {
    width: '100%',
    padding: '8px',
    background: 'rgba(255, 71, 87, 0.1)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'inherit'
  },
  drugsContainer: {
    maxWidth: '700px',
    margin: '0 auto'
  },
  listTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    color: 'var(--accent-gold)',
    margin: '0 0 12px 0'
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
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '1px solid var(--border-glow)',
    borderRadius: '8px'
  },
  drugInfo: {
    flex: 1
  },
  drugName: {
    fontWeight: '700',
    color: 'var(--accent-gold)',
    fontSize: '13px',
    marginBottom: '3px'
  },
  drugClass: {
    fontSize: '11px',
    color: 'var(--text-secondary)'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    padding: '6px 10px',
    background: 'rgba(0, 208, 132, 0.15)',
    border: '1px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'inherit'
  },
  deleteBtn: {
    padding: '6px 10px',
    background: 'rgba(255, 71, 87, 0.15)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'inherit'
  },
  noData: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    padding: '40px',
    fontSize: '14px'
  }
};

export default DrugManagement;