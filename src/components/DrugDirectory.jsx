import React, { useState } from 'react';
import { getAllClasses, getDrugsByClass } from '../utils/gameLogic.js';

const DrugDirectory = ({ drugs, onBack }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState(null);

  const classes = getAllClasses(drugs);

  const classEmojis = {
    'Beta-blocker': '❤️',
    'NSAID': '💊',
    'Analgesic': '😌',
    'Opioid Analgesic': '🔴',
    'Synthetic Opioid Analgesic': '🔴',
    'Loop Diuretic': '💧',
    'Thiazide Diuretic': '💧',
    'Potassium-sparing Diuretic': '💧',
    'Thiazide-like Diuretic': '💧'
  };

  // DRUG DETAIL PAGE
  if (selectedDrug) {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => setSelectedDrug(null)}>
          ← Back to Class
        </button>

        <div style={styles.drugDetailPage}>
          <div style={styles.drugHeader}>
            <h1 style={styles.drugTitle}>{selectedDrug.names.en}</h1>
            <p style={styles.drugTitleFr}>{selectedDrug.names.fr}</p>
            <div style={styles.classTag}>{selectedDrug.class}</div>
          </div>

          <div style={styles.detailsGrid}>
            {/* BASIC INFO */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>📋 Basic Information</h2>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Drug Class:</span>
                <span style={styles.infoValue}>{selectedDrug.class}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Therapeutic Class:</span>
                <span style={styles.infoValue}>{selectedDrug.therapeuticClass}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Route:</span>
                <span style={styles.infoValue}>{selectedDrug.route}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>FDA Approval:</span>
                <span style={styles.infoValue}>{selectedDrug.fdaApproval || 'N/A'}</span>
              </div>
            </section>

            {/* INDICATIONS & EFFECTS */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>✨ Indications & Effects</h2>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Indications:</span>
                <span style={styles.infoValue}>{selectedDrug.indications}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Effects:</span>
                <div style={styles.infoList}>
                  {selectedDrug.effects.map((effect, idx) => (
                    <div key={idx} style={styles.listItem}>• {effect}</div>
                  ))}
                </div>
              </div>
            </section>

            {/* MECHANISM */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>⚙️ Mechanism of Action</h2>
              <p style={styles.infoValue}>{selectedDrug.mechanism}</p>
            </section>

            {/* DOSING */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>💊 Dosing Information</h2>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Standard Dose:</span>
                <span style={styles.infoValue}>{selectedDrug.dosing?.standard || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Maximum Dose:</span>
                <span style={styles.infoValue}>{selectedDrug.dosing?.maxDose || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Frequency:</span>
                <span style={styles.infoValue}>{selectedDrug.dosing?.frequency || 'N/A'}</span>
              </div>
            </section>

            {/* PHARMACOKINETICS */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>🔄 Pharmacokinetics</h2>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Absorption:</span>
                <span style={styles.infoValue}>{selectedDrug.absorption}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Bioavailability:</span>
                <span style={styles.infoValue}>{selectedDrug.bioavailability || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Onset of Action:</span>
                <span style={styles.infoValue}>{selectedDrug.onsetOfAction || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Peak Concentration:</span>
                <span style={styles.infoValue}>{selectedDrug.peakConcentration || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Duration of Action:</span>
                <span style={styles.infoValue}>{selectedDrug.durationOfAction || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Vd (Volume of Distribution):</span>
                <span style={styles.infoValue}>{selectedDrug.volumeOfDistribution || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Distribution:</span>
                <span style={styles.infoValue}>{selectedDrug.distribution}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Protein Binding:</span>
                <span style={styles.infoValue}>{selectedDrug.proteinBinding}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Metabolism:</span>
                <span style={styles.infoValue}>{selectedDrug.metabolism}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Elimination:</span>
                <span style={styles.infoValue}>{selectedDrug.elimination}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Half-life (t½):</span>
                <span style={styles.infoValue}>{selectedDrug.halfLife}</span>
              </div>
            </section>

            {/* ADVERSE REACTIONS */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>⚠️ Adverse Reactions</h2>
              {selectedDrug.adverseReactions?.common && selectedDrug.adverseReactions.common.length > 0 && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Common (≥10%):</span>
                  <div style={styles.infoList}>
                    {selectedDrug.adverseReactions.common.map((effect, idx) => (
                      <div key={idx} style={styles.listItem}>• {effect}</div>
                    ))}
                  </div>
                </div>
              )}
              {selectedDrug.adverseReactions?.uncommon && selectedDrug.adverseReactions.uncommon.length > 0 && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Uncommon (1-10%):</span>
                  <div style={styles.infoList}>
                    {selectedDrug.adverseReactions.uncommon.map((effect, idx) => (
                      <div key={idx} style={styles.listItem}>• {effect}</div>
                    ))}
                  </div>
                </div>
              )}
              {selectedDrug.adverseReactions?.rare && selectedDrug.adverseReactions.rare.length > 0 && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Rare (&lt;1%):</span>
                  <div style={styles.infoList}>
                    {selectedDrug.adverseReactions.rare.map((effect, idx) => (
                      <div key={idx} style={styles.listItem}>• {effect}</div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* CONTRAINDICATIONS */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>🚫 Contraindications</h2>
              <div style={styles.infoList}>
                {selectedDrug.contraindications.map((contra, idx) => (
                  <div key={idx} style={styles.listItem}>• {contra}</div>
                ))}
              </div>
            </section>

            {/* INTERACTIONS */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>💊 Drug Interactions</h2>
              <div style={styles.infoList}>
                {selectedDrug.drugInteractions.map((interaction, idx) => (
                  <div key={idx} style={styles.listItem}>• {interaction}</div>
                ))}
              </div>
              {selectedDrug.foodInteractions && selectedDrug.foodInteractions.length > 0 && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Food Interactions:</span>
                  <div style={styles.infoList}>
                    {selectedDrug.foodInteractions.map((interaction, idx) => (
                      <div key={idx} style={styles.listItem}>• {interaction}</div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* SPECIAL POPULATIONS */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>👨‍👩‍👧‍👦 Special Populations</h2>
              {selectedDrug.specialPopulations?.pregnancy && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Pregnancy:</span>
                  <span style={styles.infoValue}>{selectedDrug.specialPopulations.pregnancy}</span>
                </div>
              )}
              {selectedDrug.specialPopulations?.breastfeeding && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Breastfeeding:</span>
                  <span style={styles.infoValue}>{selectedDrug.specialPopulations.breastfeeding}</span>
                </div>
              )}
              {selectedDrug.specialPopulations?.pediatric && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Pediatric:</span>
                  <span style={styles.infoValue}>{selectedDrug.specialPopulations.pediatric}</span>
                </div>
              )}
              {selectedDrug.specialPopulations?.geriatric && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Geriatric:</span>
                  <span style={styles.infoValue}>{selectedDrug.specialPopulations.geriatric}</span>
                </div>
              )}
            </section>

            {/* MONITORING */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>🔍 Monitoring & TDM</h2>
              {selectedDrug.monitoringParameters && selectedDrug.monitoringParameters.length > 0 && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Monitoring Parameters:</span>
                  <div style={styles.infoList}>
                    {selectedDrug.monitoringParameters.map((param, idx) => (
                      <div key={idx} style={styles.listItem}>• {param}</div>
                    ))}
                  </div>
                </div>
              )}
              {selectedDrug.tdm && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Therapeutic Drug Monitoring:</span>
                  <span style={styles.infoValue}>{selectedDrug.tdm}</span>
                </div>
              )}
            </section>

            {/* WARNINGS */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>⚡ Important Warnings</h2>
              <div style={styles.infoList}>
                {selectedDrug.warnings.map((warning, idx) => (
                  <div key={idx} style={styles.listItem}>• {warning}</div>
                ))}
              </div>
            </section>

            {/* BRAND NAMES & FORMULATIONS */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>🏷️ Brand Names & Formulations</h2>
              {selectedDrug.brandNames && selectedDrug.brandNames.length > 0 && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Brand Names:</span>
                  <div style={styles.infoList}>
                    {selectedDrug.brandNames.map((brand, idx) => (
                      <div key={idx} style={styles.listItem}>• {brand}</div>
                    ))}
                  </div>
                </div>
              )}
              {selectedDrug.formulations && selectedDrug.formulations.length > 0 && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Available Formulations:</span>
                  <div style={styles.infoList}>
                    {selectedDrug.formulations.map((form, idx) => (
                      <div key={idx} style={styles.listItem}>• {form}</div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* UNIQUE FEATURES */}
            {selectedDrug.uniqueFeature && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>⭐ Unique Features</h2>
                <p style={styles.infoValue}>{selectedDrug.uniqueFeature}</p>
              </section>
            )}

            {/* CLINICAL PEARLS */}
            {selectedDrug.clinicalPearls && selectedDrug.clinicalPearls.length > 0 && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>💡 Clinical Pearls</h2>
                <div style={styles.infoList}>
                  {selectedDrug.clinicalPearls.map((pearl, idx) => (
                    <div key={idx} style={styles.listItem}>• {pearl}</div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CLASS DRUGS PAGE
  if (selectedClass) {
    const classDrugs = getDrugsByClass(drugs, selectedClass);

    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => setSelectedClass(null)}>
          ← Back to Classes
        </button>

        <div style={styles.header}>
          <h1 style={styles.title}>{selectedClass}</h1>
          <p style={styles.subtitle}>{classDrugs.length} drugs in this class</p>
        </div>

        <div style={styles.drugsList}>
          {classDrugs.map(drug => (
            <div
              key={drug.id}
              style={styles.drugCard}
              onClick={() => setSelectedDrug(drug)}
            >
              <div style={styles.drugCardHeader}>
                <h3 style={styles.drugCardName}>{drug.names.en}</h3>
                <p style={styles.drugCardNameFr}>{drug.names.fr}</p>
              </div>

              <p style={styles.drugCardIndication}>
                {drug.indications}
              </p>

              <div style={styles.cardFooter}>
                <span style={styles.cardTag}>{drug.route}</span>
                <span style={styles.cardArrow}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // MAIN PAGE - CLASSES
  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={onBack}>
        ← Back to Menu
      </button>

      <div style={styles.header}>
        <div style={styles.logo}>📚</div>
        <h1 style={styles.title}>Drug Directory</h1>
        <p style={styles.subtitle}>Learn about {drugs.length} pharmaceutical drugs</p>
      </div>

      <div style={styles.classesGrid}>
        {classes.map(drugClass => {
          const classCount = getDrugsByClass(drugs, drugClass).length;

          return (
            <button
              key={drugClass}
              style={styles.classCard}
              onClick={() => setSelectedClass(drugClass)}
            >
              <div style={styles.classEmoji}>
                {classEmojis[drugClass] || '💊'}
              </div>
              <h3 style={styles.classCardName}>{drugClass}</h3>
              <p style={styles.classCardCount}>{classCount} drugs</p>
              <span style={styles.classCardArrow}>→</span>
            </button>
          );
        })}
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
    marginBottom: '50px'
  },
  logo: {
    fontSize: '56px',
    marginBottom: '15px'
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
  classesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  classCard: {
    padding: '25px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '2px solid var(--border-glow)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    fontFamily: 'inherit',
    color: 'var(--text-primary)',
    position: 'relative'
  },
  classEmoji: {
    fontSize: '40px',
    marginBottom: '10px'
  },
  classCardName: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--accent-gold)',
    margin: '0 0 8px 0'
  },
  classCardCount: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  classCardArrow: {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '20px',
    color: 'var(--accent-gold)',
    opacity: 0.5
  },
  drugsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '15px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  drugCard: {
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '1px solid var(--border-glow)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  drugCardHeader: {
    marginBottom: '10px'
  },
  drugCardName: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--accent-gold)',
    margin: '0 0 5px 0'
  },
  drugCardNameFr: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  drugCardIndication: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: '0 0 15px 0',
    lineHeight: '1.4',
    flex: 1
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTag: {
    fontSize: '11px',
    padding: '4px 8px',
    background: 'rgba(0, 217, 255, 0.1)',
    color: 'var(--border-glow)',
    borderRadius: '4px'
  },
  cardArrow: {
    color: 'var(--accent-gold)',
    fontSize: '14px'
  },
  drugDetailPage: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  drugHeader: {
    textAlign: 'center',
    marginBottom: '50px',
    paddingBottom: '30px',
    borderBottom: '1px solid rgba(0, 217, 255, 0.2)'
  },
  drugTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '56px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0'
  },
  drugTitleFr: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    margin: '8px 0 15px 0'
  },
  classTag: {
    display: 'inline-block',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--accent-emerald)',
    padding: '6px 15px',
    background: 'rgba(0, 208, 132, 0.15)',
    borderRadius: '20px'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px'
  },
  section: {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '1px solid var(--border-glow)',
    borderRadius: '12px',
    padding: '25px'
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--accent-gold)',
    margin: '0 0 20px 0',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(212, 175, 55, 0.3)'
  },
  infoItem: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  infoLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    textTransform: 'uppercase'
  },
  infoValue: {
    fontSize: '14px',
    color: 'var(--text-primary)',
    lineHeight: '1.6'
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  listItem: {
    fontSize: '14px',
    color: 'var(--text-primary)',
    lineHeight: '1.5',
    paddingLeft: '5px'
  }
};

export default DrugDirectory;