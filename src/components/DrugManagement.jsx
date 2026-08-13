import React, { useState, useEffect } from 'react';

const DrugManagement = ({ drugs, onDrugsUpdate, onBack }) => {
  const [formData, setFormData] = useState(getEmptyDrug());
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  function getEmptyDrug() {
    return {
      id: Date.now(),
      names: { fr: '', en: '' },
      class: '',
      therapeuticClass: '',
      effects: [],
      indications: '',
      route: '',
      mechanism: '',
      sideEffects: [],
      contraindications: [],
      drugInteractions: [],
      warnings: [],
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
      specialPopulations: {
        pregnancy: '',
        breastfeeding: '',
        pediatric: '',
        geriatric: ''
      },
      adverseReactions: {
        common: [],
        uncommon: [],
        rare: []
      },
      foodInteractions: [],
      monitoringParameters: [],
      tdm: '',
      uniqueFeature: '',
      brandNames: [],
      formulations: [],
      fdaApproval: '',
      clinicalPearls: []
    };
  }

  const handleInputChange = (e, field, nested = null) => {
    const value = e.target.value;
    
    if (nested) {
      setFormData({
        ...formData,
        [field]: {
          ...formData[field],
          [nested]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleArrayChange = (value, field) => {
    setFormData({
      ...formData,
      [field]: value.split('\n').filter(item => item.trim())
    });
  };

  const handleNestedArrayChange = (value, field, nested) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [nested]: value.split('\n').filter(item => item.trim())
      }
    });
  };

  const handleSave = () => {
    if (!formData.names.en || !formData.names.fr || !formData.class) {
      setMessage('❌ Please fill in: Drug Name (EN), Drug Name (FR), and Class');
      return;
    }

    let updatedDrugs;
    if (editingId) {
      updatedDrugs = drugs.map(d => d.id === editingId ? formData : d);
      setMessage('✅ Drug updated successfully!');
    } else {
      updatedDrugs = [...drugs, formData];
      setMessage('✅ Drug added successfully!');
    }

    onDrugsUpdate(updatedDrugs);
    setTimeout(() => {
      setFormData(getEmptyDrug());
      setEditingId(null);
      setShowForm(false);
      setMessage('');
    }, 1500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this drug?')) {
      const updatedDrugs = drugs.filter(d => d.id !== id);
      onDrugsUpdate(updatedDrugs);
      setMessage('✅ Drug deleted');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleEdit = (drug) => {
    setFormData(drug);
    setEditingId(drug.id);
    setShowForm(true);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ drugs }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `drugs-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const filteredDrugs = drugs.filter(d =>
    d.names.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.names.fr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => {
          setShowForm(false);
          setEditingId(null);
          setFormData(getEmptyDrug());
        }}>
          ← Back to List
        </button>

        <div style={styles.formContainer}>
          <h1 style={styles.title}>
            {editingId ? '✏️ Edit Drug' : '➕ Add New Drug'}
          </h1>

          <div style={styles.formGrid}>
            {/* BASIC INFO */}
            <section style={styles.formSection}>
              <h2 style={styles.formSectionTitle}>Basic Information</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Drug Name (English) *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.names.en}
                  onChange={(e) => handleInputChange(e, 'names', 'en')}
                  placeholder="e.g., Ibuprofen"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Drug Name (French) *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.names.fr}
                  onChange={(e) => handleInputChange(e, 'names', 'fr')}
                  placeholder="e.g., Ibuprofène"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Drug Class *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.class}
                  onChange={(e) => handleInputChange(e, 'class')}
                  placeholder="e.g., NSAID"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Therapeutic Class</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.therapeuticClass}
                  onChange={(e) => handleInputChange(e, 'therapeuticClass')}
                  placeholder="e.g., Analgesic, Antipyretic"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Route of Administration</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.route}
                  onChange={(e) => handleInputChange(e, 'route')}
                  placeholder="e.g., Oral (tablet), IV"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Indications</label>
                <textarea
                  style={styles.textarea}
                  value={formData.indications}
                  onChange={(e) => handleInputChange(e, 'indications')}
                  placeholder="Main clinical uses"
                />
              </div>
            </section>

            {/* MECHANISM & EFFECTS */}
            <section style={styles.formSection}>
              <h2 style={styles.formSectionTitle}>Mechanism & Effects</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Mechanism of Action</label>
                <textarea
                  style={styles.textarea}
                  value={formData.mechanism}
                  onChange={(e) => handleInputChange(e, 'mechanism')}
                  placeholder="How the drug works"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Effects (one per line)</label>
                <textarea
                  style={styles.textarea}
                  value={formData.effects.join('\n')}
                  onChange={(e) => handleArrayChange(e.target.value, 'effects')}
                  placeholder="Reduces pain&#10;Reduces fever"
                />
              </div>
            </section>

            {/* SIDE EFFECTS & SAFETY */}
            <section style={styles.formSection}>
              <h2 style={styles.formSectionTitle}>Side Effects & Safety</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Common Side Effects (one per line)</label>
                <textarea
                  style={styles.textarea}
                  value={formData.adverseReactions.common.join('\n')}
                  onChange={(e) => handleNestedArrayChange(e.target.value, 'adverseReactions', 'common')}
                  placeholder="Nausea&#10;Headache"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Uncommon Side Effects (one per line)</label>
                <textarea
                  style={styles.textarea}
                  value={formData.adverseReactions.uncommon.join('\n')}
                  onChange={(e) => handleNestedArrayChange(e.target.value, 'adverseReactions', 'uncommon')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Rare Side Effects (one per line)</label>
                <textarea
                  style={styles.textarea}
                  value={formData.adverseReactions.rare.join('\n')}
                  onChange={(e) => handleNestedArrayChange(e.target.value, 'adverseReactions', 'rare')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Contraindications (one per line)</label>
                <textarea
                  style={styles.textarea}
                  value={formData.contraindications.join('\n')}
                  onChange={(e) => handleArrayChange(e.target.value, 'contraindications')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Warnings (one per line)</label>
                <textarea
                  style={styles.textarea}
                  value={formData.warnings.join('\n')}
                  onChange={(e) => handleArrayChange(e.target.value, 'warnings')}
                />
              </div>
            </section>

            {/* INTERACTIONS */}
            <section style={styles.formSection}>
              <h2 style={styles.formSectionTitle}>Interactions</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Drug Interactions (one per line)</label>
                <textarea
                  style={styles.textarea}
                  value={formData.drugInteractions.join('\n')}
                  onChange={(e) => handleArrayChange(e.target.value, 'drugInteractions')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Food Interactions (one per line)</label>
                <textarea
                  style={styles.textarea}
                  value={formData.foodInteractions.join('\n')}
                  onChange={(e) => handleArrayChange(e.target.value, 'foodInteractions')}
                />
              </div>
            </section>

            {/* PHARMACOKINETICS */}
            <section style={styles.formSection}>
              <h2 style={styles.formSectionTitle}>Pharmacokinetics</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Absorption</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.absorption}
                  onChange={(e) => handleInputChange(e, 'absorption')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Bioavailability</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.bioavailability}
                  onChange={(e) => handleInputChange(e, 'bioavailability')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Onset of Action</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.onsetOfAction}
                  onChange={(e) => handleInputChange(e, 'onsetOfAction')}
                  placeholder="e.g., 30 minutes"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Peak Concentration Time</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.peakConcentration}
                  onChange={(e) => handleInputChange(e, 'peakConcentration')}
                  placeholder="e.g., 1-2 hours"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Duration of Action</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.durationOfAction}
                  onChange={(e) => handleInputChange(e, 'durationOfAction')}
                  placeholder="e.g., 6-12 hours"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Volume of Distribution</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.volumeOfDistribution}
                  onChange={(e) => handleInputChange(e, 'volumeOfDistribution')}
                  placeholder="e.g., 3-4 L/kg"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Distribution</label>
                <textarea
                  style={styles.textarea}
                  value={formData.distribution}
                  onChange={(e) => handleInputChange(e, 'distribution')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Protein Binding</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.proteinBinding}
                  onChange={(e) => handleInputChange(e, 'proteinBinding')}
                  placeholder="e.g., 99%"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Metabolism</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.metabolism}
                  onChange={(e) => handleInputChange(e, 'metabolism')}
                  placeholder="e.g., Hepatic (liver)"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Elimination</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.elimination}
                  onChange={(e) => handleInputChange(e, 'elimination')}
                  placeholder="e.g., Renal (kidneys)"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Half-life</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.halfLife}
                  onChange={(e) => handleInputChange(e, 'halfLife')}
                  placeholder="e.g., 2-4 hours"
                />
              </div>
            </section>

            {/* DOSING */}
            <section style={styles.formSection}>
              <h2 style={styles.formSectionTitle}>Dosing</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Standard Dose</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.dosing.standard}
                  onChange={(e) => handleInputChange(e, 'dosing', 'standard')}
                  placeholder="e.g., 40 mg twice daily"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Maximum Dose</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.dosing.maxDose}
                  onChange={(e) => handleInputChange(e, 'dosing', 'maxDose')}
                  placeholder="e.g., 320 mg/day"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Frequency</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.dosing.frequency}
                  onChange={(e) => handleInputChange(e, 'dosing', 'frequency')}
                  placeholder="e.g., Divided doses"
                />
              </div>
            </section>

            {/* SPECIAL POPULATIONS */}
            <section style={styles.formSection}>
              <h2 style={styles.formSectionTitle}>Special Populations</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Pregnancy Category</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.specialPopulations.pregnancy}
                  onChange={(e) => handleInputChange(e, 'specialPopulations', 'pregnancy')}
                  placeholder="e.g., Category C"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Breastfeeding</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.specialPopulations.breastfeeding}
                  onChange={(e) => handleInputChange(e, 'specialPopulations', 'breastfeeding')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Pediatric Considerations</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.specialPopulations.pediatric}
                  onChange={(e) => handleInputChange(e, 'specialPopulations', 'pediatric')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Geriatric Considerations</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.specialPopulations.geriatric}
                  onChange={(e) => handleInputChange(e, 'specialPopulations', 'geriatric')}
                />
              </div>
            </section>

            {/* OTHER */}
            <section style={styles.formSection}>
              <h2 style={styles.formSectionTitle}>Additional Information</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Monitoring Parameters (one per line)</label>
                <textarea
                  style={styles.textarea}
                  value={formData.monitoringParameters.join('\n')}
                  onChange={(e) => handleArrayChange(e.target.value, 'monitoringParameters')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Therapeutic Drug Monitoring (TDM)</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.tdm}
                  onChange={(e) => handleInputChange(e, 'tdm')}
                  placeholder="e.g., 50-100 ng/mL"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Brand Names (one per line)</label>
                <textarea
                  style={styles.textarea}
                  value={formData.brandNames.join('\n')}
                  onChange={(e) => handleArrayChange(e.target.value, 'brandNames')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Available Formulations (one per line)</label>
                <textarea
                  style={styles.textarea}
                  value={formData.formulations.join('\n')}
                  onChange={(e) => handleArrayChange(e.target.value, 'formulations')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>FDA Approval Year</label>
                <input
                  type="text"
                  style={styles.input}
                  value={formData.fdaApproval}
                  onChange={(e) => handleInputChange(e, 'fdaApproval')}
                  placeholder="e.g., 1967"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Unique Feature</label>
                <textarea
                  style={styles.textarea}
                  value={formData.uniqueFeature}
                  onChange={(e) => handleInputChange(e, 'uniqueFeature')}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Clinical Pearls (one per line)</label>
                <textarea
                  style={styles.textarea}
                  value={formData.clinicalPearls.join('\n')}
                  onChange={(e) => handleArrayChange(e.target.value, 'clinicalPearls')}
                  placeholder="Important clinical notes"
                />
              </div>
            </section>
          </div>

          {message && (
            <div style={{
              ...styles.messageBox,
              backgroundColor: message.includes('✓') ? 'rgba(0, 208, 132, 0.15)' : 'rgba(255, 71, 87, 0.15)',
              borderColor: message.includes('✓') ? 'var(--accent-emerald)' : 'var(--danger)',
              color: message.includes('✓') ? 'var(--accent-emerald)' : 'var(--danger)'
            }}>
              {message}
            </div>
          )}

          <div style={styles.formButtons}>
            <button
              style={{ ...styles.button, ...styles.saveButton }}
              onClick={handleSave}
            >
              💾 {editingId ? 'Update Drug' : 'Add Drug'}
            </button>
            <button
              style={{ ...styles.button, ...styles.cancelButton }}
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData(getEmptyDrug());
              }}
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={onBack}>← Back to Menu</button>

      <div style={styles.header}>
        <h1 style={styles.title}>💊 Drug Management</h1>
        <p style={styles.subtitle}>Add and manage your drug database</p>
      </div>

      <div style={styles.toolsBar}>
        <div style={styles.searchBox}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search drugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={styles.toolsButtons}>
          <button
            style={{ ...styles.button, ...styles.addButton }}
            onClick={() => {
              setShowForm(true);
              setFormData(getEmptyDrug());
              setEditingId(null);
            }}
          >
            ➕ Add New Drug
          </button>

          <button
            style={{ ...styles.button, ...styles.exportButton }}
            onClick={handleExport}
          >
            📥 Export Data
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          ...styles.messageBox,
          backgroundColor: message.includes('✓') ? 'rgba(0, 208, 132, 0.15)' : 'rgba(255, 71, 87, 0.15)',
          borderColor: message.includes('✓') ? 'var(--accent-emerald)' : 'var(--danger)',
          color: message.includes('✓') ? 'var(--accent-emerald)' : 'var(--danger)'
        }}>
          {message}
        </div>
      )}

      <div style={styles.drugsTable}>
        <div style={styles.tableHeader}>
          <div style={styles.headerCell}>Drug Name</div>
          <div style={styles.headerCell}>Class</div>
          <div style={styles.headerCell}>Route</div>
          <div style={styles.headerCell}>Actions</div>
        </div>

        {filteredDrugs.length === 0 ? (
          <div style={styles.emptyMessage}>
            No drugs found. Click "Add New Drug" to get started!
          </div>
        ) : (
          filteredDrugs.map(drug => (
            <div key={drug.id} style={styles.tableRow}>
              <div style={styles.cell}>
                <div style={styles.drugName}>{drug.names.en}</div>
                <div style={styles.drugNameFr}>{drug.names.fr}</div>
              </div>
              <div style={styles.cell}>{drug.class}</div>
              <div style={styles.cell}>{drug.route}</div>
              <div style={styles.cell}>
                <button
                  style={{ ...styles.button, ...styles.editButtonSmall }}
                  onClick={() => handleEdit(drug)}
                >
                  ✏️ Edit
                </button>
                <button
                  style={{ ...styles.button, ...styles.deleteButtonSmall }}
                  onClick={() => handleDelete(drug.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          Total: {drugs.length} drugs | Showing: {filteredDrugs.length}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '30px',
    position: 'relative',
    zIndex: 10
  },
  backButton: {
    padding: '10px 20px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid var(--border-glow)',
    color: 'var(--text-primary)',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '30px',
    fontFamily: 'inherit',
    fontSize: '14px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '48px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  toolsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  searchBox: {
    flex: 1,
    minWidth: '200px'
  },
  searchInput: {
    width: '100%',
    padding: '12px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid var(--border-glow)',
    borderRadius: '4px',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    fontSize: '14px'
  },
  toolsButtons: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '10px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    transition: 'all 0.2s ease'
  },
  addButton: {
    background: 'rgba(0, 208, 132, 0.15)',
    border: '1px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)'
  },
  exportButton: {
    background: 'rgba(212, 175, 55, 0.15)',
    border: '1px solid var(--accent-gold)',
    color: 'var(--accent-gold)'
  },
  messageBox: {
    padding: '15px',
    borderRadius: '6px',
    border: '1px solid',
    marginBottom: '20px',
    fontWeight: '600'
  },
  drugsTable: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '1px solid var(--border-glow)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '30px'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 2fr',
    gap: '15px',
    padding: '15px',
    background: 'rgba(0, 217, 255, 0.1)',
    borderBottom: '1px solid var(--border-glow)',
    fontWeight: '600',
    color: 'var(--accent-gold)'
  },
  headerCell: {
    fontSize: '13px',
    textTransform: 'uppercase'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 2fr',
    gap: '15px',
    padding: '15px',
    borderBottom: '1px solid rgba(0, 217, 255, 0.1)',
    alignItems: 'center'
  },
  cell: {
    fontSize: '14px',
    color: 'var(--text-primary)'
  },
  drugName: {
    fontWeight: '600'
  },
  drugNameFr: {
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  editButtonSmall: {
    background: 'rgba(212, 175, 55, 0.15)',
    border: '1px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    padding: '6px 12px',
    fontSize: '12px',
    marginRight: '5px'
  },
  deleteButtonSmall: {
    background: 'rgba(255, 71, 87, 0.15)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    padding: '6px 12px',
    fontSize: '12px'
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--text-secondary)'
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid rgba(0, 217, 255, 0.1)',
    color: 'var(--text-secondary)',
    fontSize: '14px'
  },
  footerText: {
    margin: '0'
  },
  formContainer: {
    maxWidth: '100%',
    margin: '0 auto'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px',
    marginBottom: '30px'
  },
  formSection: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '1px solid var(--border-glow)',
    borderRadius: '8px',
    padding: '20px'
  },
  formSectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--accent-gold)',
    margin: '0 0 15px 0',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(0, 217, 255, 0.2)'
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase'
  },
  input: {
    padding: '10px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '4px',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    fontSize: '14px'
  },
  textarea: {
    padding: '10px',
    background: 'rgba(0, 217, 255, 0.05)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '4px',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical'
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '30px'
  },
  saveButton: {
    background: 'rgba(0, 208, 132, 0.15)',
    border: '2px solid var(--accent-emerald)',
    color: 'var(--accent-emerald)',
    padding: '12px 30px'
  },
  cancelButton: {
    background: 'rgba(255, 71, 87, 0.15)',
    border: '2px solid var(--danger)',
    color: 'var(--danger)',
    padding: '12px 30px'
  }
};

export default DrugManagement;