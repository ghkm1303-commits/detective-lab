import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

// Reads the lesson-based chemistry.json schema:
// { lessons: [ { id, order, name_fr, name_en, group_ids:[...] } ],
//   groups:  [ { id, lesson_id, name_fr, name_en, mechanism_general:{fr,en}, structure_general:{fr,en},
//                sar_rules:{fr:[],en:[]}, synthesis_general:{fr,en}, side_effects_general:{fr,en} (optional),
//                molecule_ids:[...] } ],
//   molecules: [ { id, group_id, lesson_id, dci_fr, dci_en, trade_names:[], note_fr, note_en,
//                  structure_specific:{fr,en}, synthesis_specific:{fr,en}, mechanism_specific:{fr,en},
//                  pharmacokinetics:{fr,en}, differentiator:{fr,en} } ] }
//
// Level 1 (this directory): groups, filterable by lesson (category pastilles) + search.
// "See More" on a group opens its fiche + its example molecules.
// Clicking a molecule inside that modal opens a second, stacked modal with its own fiche.

const t = (field, lang) => (field ? field[lang] || field.fr || '' : '');
const tf = (fr, en, lang) => (lang === 'en' && en ? en : fr) || '';

const ChemistryArchive = ({ data, onBack, currentLang, userName, onStats, theme, onThemeChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null); // lesson_id or null
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMolecule, setSelectedMolecule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const lessons = [...data.lessons].sort((a, b) => a.order - b.order);
  const lessonById = (id) => data.lessons.find((l) => l.id === id);
  const moleculesForGroup = (group) =>
    group.molecule_ids.map((mid) => data.molecules.find((m) => m.id === mid)).filter(Boolean);

  const filteredGroups = data.groups.filter((g) => {
    const matchesCategory = !selectedCategory || g.lesson_id === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      tf(g.name_fr, g.name_en, currentLang).toLowerCase().includes(searchTerm.toLowerCase());
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
          {currentLang === 'en' ? '📖 Chemistry Study Mode' : '📖 Mode Étude - Chimie'}
        </h1>

        <input
          type="text"
          placeholder={currentLang === 'en' ? 'Search group name...' : 'Chercher un groupe...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.categoryFilter}>
          <button
            style={{ ...styles.filterButton, background: !selectedCategory ? 'var(--accent-gold)' : 'transparent', color: !selectedCategory ? 'var(--bg-obsidian)' : 'var(--accent-gold)' }}
            onClick={() => setSelectedCategory(null)}
          >
            {currentLang === 'en' ? 'All' : 'Tous'} ({data.groups.length})
          </button>
          {lessons.map((lesson) => {
            const count = data.groups.filter((g) => g.lesson_id === lesson.id).length;
            if (count === 0) return null;
            return (
              <button
                key={lesson.id}
                style={{ ...styles.filterButton, background: selectedCategory === lesson.id ? 'var(--accent-teal)' : 'transparent', color: selectedCategory === lesson.id ? 'white' : 'var(--accent-teal)' }}
                onClick={() => setSelectedCategory(lesson.id)}
              >
                {tf(lesson.name_fr, lesson.name_en, currentLang)} ({count})
              </button>
            );
          })}
        </div>

        <div style={styles.drugsList}>
          {filteredGroups.map((group) => {
            const lesson = lessonById(group.lesson_id);
            return (
              <div key={group.id} style={styles.drugCard}>
                <h3 style={styles.drugName}>{tf(group.name_fr, group.name_en, currentLang)}</h3>
                <p style={styles.drugClass}>{lesson ? tf(lesson.name_fr, lesson.name_en, currentLang) : ''}</p>
                <button style={styles.moreButton} onClick={() => setSelectedGroup(group)}>
                  {currentLang === 'en' ? 'See More' : 'Voir Plus'} →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* GROUP MODAL */}
      {selectedGroup && (
        <div style={styles.modalOverlay} onClick={() => setSelectedGroup(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{tf(selectedGroup.name_fr, selectedGroup.name_en, currentLang)}</h2>
                <p style={styles.modalSubtitle}>
                  {(() => {
                    const lesson = lessonById(selectedGroup.lesson_id);
                    return lesson ? tf(lesson.name_fr, lesson.name_en, currentLang) : '';
                  })()}
                </p>
              </div>
              <button style={styles.closeIconButton} onClick={() => setSelectedGroup(null)}>✕</button>
            </div>
            <div style={styles.modalDivider}></div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-blue)' }}>
                {currentLang === 'en' ? 'MECHANISM' : 'MÉCANISME'}:
              </h4>
              <p style={styles.modalText}>{t(selectedGroup.mechanism_general, currentLang)}</p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-gold)' }}>
                {currentLang === 'en' ? 'GENERAL STRUCTURE' : 'STRUCTURE GÉNÉRALE'}:
              </h4>
              <p style={styles.modalText}>{t(selectedGroup.structure_general, currentLang)}</p>
            </div>

            {selectedGroup.sar_rules && (selectedGroup.sar_rules.fr?.length || selectedGroup.sar_rules.en?.length) > 0 && (
              <div style={styles.modalSection}>
                <h4 style={{ ...styles.modalLabel, color: 'var(--accent-teal)' }}>
                  {currentLang === 'en' ? 'STRUCTURE-ACTIVITY RELATIONSHIP (SAR)' : 'RELATION STRUCTURE-ACTIVITÉ (RSA)'}:
                </h4>
                <ul style={styles.modalList}>
                  {(selectedGroup.sar_rules[currentLang]?.length ? selectedGroup.sar_rules[currentLang] : selectedGroup.sar_rules.fr).map((r, i) => (
                    <li key={i} style={styles.modalListItem}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {t(selectedGroup.synthesis_general, currentLang) && (
              <div style={styles.modalSection}>
                <h4 style={{ ...styles.modalLabel, color: 'var(--accent-emerald)' }}>
                  {currentLang === 'en' ? 'GENERAL SYNTHESIS' : 'SYNTHÈSE GÉNÉRALE'}:
                </h4>
                <p style={styles.modalText}>{t(selectedGroup.synthesis_general, currentLang)}</p>
              </div>
            )}

            {selectedGroup.side_effects_general && t(selectedGroup.side_effects_general, currentLang) && (
              <div style={styles.modalSection}>
                <h4 style={{ ...styles.modalLabel, color: 'var(--accent-blue)' }}>
                  {currentLang === 'en' ? 'SIDE EFFECTS' : 'EFFETS SECONDAIRES'}:
                </h4>
                <p style={styles.modalText}>{t(selectedGroup.side_effects_general, currentLang)}</p>
              </div>
            )}

            <div style={styles.modalDivider}></div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-gold)' }}>
                {currentLang === 'en' ? 'MOLECULES IN THIS GROUP' : 'MOLÉCULES DE CE GROUPE'}:
              </h4>
              <div style={styles.moleculeGrid}>
                {moleculesForGroup(selectedGroup).map((mol) => (
                  <button key={mol.id} style={styles.moleculeChip} onClick={() => setSelectedMolecule(mol)}>
                    {tf(mol.dci_fr, mol.dci_en, currentLang)}
                  </button>
                ))}
              </div>
            </div>

            <button style={styles.modalCloseButton} onClick={() => setSelectedGroup(null)}>
              {currentLang === 'en' ? 'Close' : 'Fermer'}
            </button>
          </div>
        </div>
      )}

      {/* MOLECULE MODAL (stacked on top of the group modal) */}
      {selectedMolecule && (
        <div style={styles.modalOverlay} onClick={() => setSelectedMolecule(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{tf(selectedMolecule.dci_fr, selectedMolecule.dci_en, currentLang)}</h2>
                <p style={styles.modalSubtitle}>
                  {selectedMolecule.trade_names?.length > 0 ? selectedMolecule.trade_names.join(', ') : ''}
                </p>
              </div>
              <button style={styles.closeIconButton} onClick={() => setSelectedMolecule(null)}>✕</button>
            </div>
            <div style={styles.modalDivider}></div>

            {(currentLang === 'en' ? selectedMolecule.note_en : selectedMolecule.note_fr) && (
              <div style={styles.modalSection}>
                <h4 style={{ ...styles.modalLabel, color: 'var(--accent-teal)' }}>
                  {currentLang === 'en' ? 'NOTE' : 'REMARQUE'}:
                </h4>
                <p style={styles.modalText}>
                  {currentLang === 'en' ? (selectedMolecule.note_en || selectedMolecule.note_fr) : selectedMolecule.note_fr}
                </p>
              </div>
            )}

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-gold)' }}>
                {currentLang === 'en' ? 'SPECIFIC STRUCTURE' : 'STRUCTURE SPÉCIFIQUE'}:
              </h4>
              <p style={styles.modalText}>{t(selectedMolecule.structure_specific, currentLang)}</p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-teal)' }}>
                {currentLang === 'en' ? 'SYNTHESIS' : 'SYNTHÈSE'}:
              </h4>
              <p style={styles.modalText}>{t(selectedMolecule.synthesis_specific, currentLang)}</p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-blue)' }}>
                {currentLang === 'en' ? 'MODE OF ACTION' : "MÉCANISME D'ACTION"}:
              </h4>
              <p style={styles.modalText}>{t(selectedMolecule.mechanism_specific, currentLang)}</p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-emerald)' }}>
                {currentLang === 'en' ? 'PHARMACOKINETICS' : 'PHARMACOCINÉTIQUE'}:
              </h4>
              <p style={styles.modalText}>{t(selectedMolecule.pharmacokinetics, currentLang)}</p>
            </div>

            <div style={styles.modalSection}>
              <h4 style={{ ...styles.modalLabel, color: 'var(--accent-gold)' }}>
                💡 {currentLang === 'en' ? 'DIFFERENTIATION CLUE' : 'INDICE DE DIFFÉRENCIATION'}:
              </h4>
              <p style={styles.modalText}>{t(selectedMolecule.differentiator, currentLang)}</p>
            </div>

            <button style={styles.modalCloseButton} onClick={() => setSelectedMolecule(null)}>
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
  moleculeGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  moleculeChip: {
    padding: '8px 14px', background: 'var(--bg-hover)', border: '1px solid var(--accent-teal)',
    borderRadius: '20px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit'
  },
  modalCloseButton: {
    width: '100%', padding: '12px', background: 'var(--accent-gold)', color: 'var(--bg-obsidian)',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', marginTop: '15px'
  }
};

export default ChemistryArchive;