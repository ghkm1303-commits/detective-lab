import React, { useState } from 'react';
import { getAllClasses } from '../utils/gameLogic.js';

const ClassSelector = ({ drugs, onSelectClass, onBack }) => {
  const classes = getAllClasses(drugs);

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={onBack}>← Back</button>

      <div style={styles.header}>
        <h1 style={styles.title}>🔬 SELECT DRUG CLASS</h1>
        <p style={styles.subtitle}>Choose a category to start guessing</p>
      </div>

      <div style={styles.classGrid}>
        {classes.map(drugClass => {
          const drugsInClass = drugs.filter(d => d.class === drugClass);
          
          return (
            <button
              key={drugClass}
              style={styles.classCard}
              onClick={() => onSelectClass(drugClass)}
            >
              <div style={styles.className}>{drugClass}</div>
              <div style={styles.classCount}>
                ({drugsInClass.length} drugs)
              </div>
              <div style={styles.classHint}>
                Click to play with this class
              </div>
            </button>
          );
        })}
      </div>

      {classes.length === 0 && (
        <div style={styles.noClassesMessage}>
          No drug classes found. Make sure drugs are loaded!
        </div>
      )}
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
    marginBottom: '20px',
    fontFamily: 'inherit',
    fontSize: '14px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '48px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: 0,
    textShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    margin: '10px 0 0 0'
  },
  classGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  classCard: {
    padding: '30px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '2px solid var(--border-glow)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    fontFamily: 'inherit',
    boxShadow: '0 0 15px rgba(0, 217, 255, 0.1)'
  },
  className: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    marginBottom: '10px',
    fontFamily: "'Playfair Display', serif"
  },
  classCount: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '10px'
  },
  classHint: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontStyle: 'italic'
  },
  noClassesMessage: {
    textAlign: 'center',
    color: 'var(--danger)',
    fontSize: '16px',
    marginTop: '50px'
  }
};

export default ClassSelector;