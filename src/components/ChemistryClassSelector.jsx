import React, { useState } from 'react';
import Logo from './Logo';
import BackButton from './BackButton';
import Breadcrumb from './Breadcrumb';

const ChemistryClassSelector = ({ classes, multiSelect, onConfirm, onBack, onGoHome, currentLang, userName, onStats, theme }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const minRequired = multiSelect ? 2 : 1;

  const toggleClass = (id) => {
    if (multiSelect) {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  };

  const canConfirm = selectedIds.length >= minRequired;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.leftGroup}>
          <BackButton onClick={onBack} />
          <Logo variant="horizontal" theme={theme} />
        </div>
        <div style={styles.rightGroup}>
          <button onClick={onStats} className="user-button">
            👤 {userName}
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <Breadcrumb
          currentLang={currentLang}
          onHomeClick={onGoHome}
          trail={[{ label: currentLang === 'en' ? 'Therapeutic Chemistry' : 'Chimie Thérapeutique' }]}
        />

        <h2 style={styles.subtitle}>
          {multiSelect
            ? (currentLang === 'en' ? 'Select 2 or more classes' : 'Sélectionnez 2 classes ou plus')
            : (currentLang === 'en' ? 'Select a class' : 'Sélectionnez une classe')}
        </h2>

        {classes.length === 0 ? (
          <p style={styles.emptyMsg}>
            {currentLang === 'en' ? 'No therapeutic classes added yet.' : "Aucune classe thérapeutique n'a encore été ajoutée."}
          </p>
        ) : (
          <>
            <div style={styles.classGrid}>
              {classes.map(cls => {
                const isSelected = selectedIds.includes(cls.id);
                return (
                  <button
                    key={cls.id}
                    style={{
                      ...styles.classCard,
                      ...(isSelected ? styles.classCardSelected : {})
                    }}
                    onClick={() => toggleClass(cls.id)}
                  >
                    {currentLang === 'en' ? cls.names.en : cls.names.fr}
                  </button>
                );
              })}
            </div>
            <button
              style={{ ...styles.confirmButton, opacity: canConfirm ? 1 : 0.5 }}
              disabled={!canConfirm}
              onClick={() => onConfirm(selectedIds)}
            >
              {currentLang === 'en' ? 'Start' : 'Commencer'}
            </button>
          </>
        )}
      </div>
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
  leftGroup: { display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' },
  rightGroup: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  content: { maxWidth: '900px', margin: '0 auto', textAlign: 'center' },
  subtitle: {
    fontSize: '24px', color: '#FFFFFF', margin: '0 0 30px 0',
    fontFamily: "'Ubuntu', sans-serif", fontWeight: '700'
  },
  emptyMsg: { color: 'var(--text-secondary)', fontSize: '14px' },
  classGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' },
  classCard: {
    padding: '18px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--border-gold)', borderRadius: '8px', cursor: 'pointer',
    color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  classCardSelected: {
    border: '2px solid var(--accent-emerald)', background: 'rgba(47, 125, 91, 0.15)'
  },
  confirmButton: {
    padding: '14px 40px', background: 'linear-gradient(135deg, #167C80, #2F7D5B)',
    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: '15px', fontWeight: '700'
  }
};

export default ChemistryClassSelector;