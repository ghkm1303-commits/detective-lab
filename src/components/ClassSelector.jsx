import React from 'react';
import LanguageToggle from './LanguageToggle';

const ClassSelector = ({ onSelectClass, onBack, currentLang, onLanguageChange }) => {
  const frenchCategories = [
    {
      id: 'cardiovascular',
      frName: 'Médicaments du Système Cardiaque',
      enName: 'Cardiovascular System Drugs',
      icon: '❤️',
      frDesc: 'Hypertension, arythmies, insuffisance cardiaque',
      enDesc: 'Hypertension, arrhythmias, heart failure'
    },
    {
      id: 'nervous',
      frName: 'Médicaments du Système Nerveux',
      enName: 'Nervous System Drugs',
      icon: '🧠',
      frDesc: 'Neurologiques, psychotropes, antidépresseurs',
      enDesc: 'Neurological, psychotropic, antidepressants'
    },
    {
      id: 'endocrine',
      frName: 'Médicaments du Système Endocrinien',
      enName: 'Endocrine System Drugs',
      icon: '⚗️',
      frDesc: 'Diabète, thyroïde, hormones',
      enDesc: 'Diabetes, thyroid, hormones'
    },
    {
      id: 'respiratory',
      frName: 'Médicaments du Système Respiratoire',
      enName: 'Respiratory System Drugs',
      icon: '💨',
      frDesc: 'Asthme, bronchite, allergies',
      enDesc: 'Asthma, bronchitis, allergies'
    },
    {
      id: 'digestive',
      frName: 'Médicaments du Système Digestif',
      enName: 'Digestive System Drugs',
      icon: '🍽️',
      frDesc: 'Estomac, foie, intestins',
      enDesc: 'Stomach, liver, intestines'
    },
    {
      id: 'immune',
      frName: 'Médicaments du Système Immunitaire',
      enName: 'Immune System Drugs',
      icon: '🛡️',
      frDesc: 'Antibiotiques, vaccins, immunomodulateurs',
      enDesc: 'Antibiotics, vaccines, immunomodulators'
    },
    {
      id: 'musculoskeletal',
      frName: 'Médicaments Musculo-Squelettiques',
      enName: 'Musculoskeletal Drugs',
      icon: '🦴',
      frDesc: 'Anti-inflammatoires, relaxants musculaires',
      enDesc: 'Anti-inflammatories, muscle relaxants'
    },
    {
      id: 'renal',
      frName: 'Médicaments du Système Rénal',
      enName: 'Renal System Drugs',
      icon: '💧',
      frDesc: 'Diurétiques, électrolytes',
      enDesc: 'Diuretics, electrolytes'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>← {currentLang === 'en' ? 'Back' : 'Retour'}</button>
        <LanguageToggle currentLang={currentLang} onLanguageChange={onLanguageChange} />
      </div>

      <h1 style={styles.title}>
        {currentLang === 'en' ? '📚 Choose Your Category' : '📚 Choisissez Votre Catégorie'}
      </h1>
      <p style={styles.subtitle}>
        {currentLang === 'en' ? 'Select your specialty' : 'Sélectionnez votre spécialité'}
      </p>

      <div style={styles.categoriesGrid}>
        {frenchCategories.map(category => (
          <button
            key={category.id}
            style={styles.categoryCard}
            onClick={() => onSelectClass(category.id)}
          >
            <div style={styles.categoryIcon}>{category.icon}</div>
            <h3 style={styles.categoryNameFr}>
              {currentLang === 'en' ? category.enName : category.frName}
            </h3>
            <p style={styles.categoryDescription}>
              {currentLang === 'en' ? category.enDesc : category.frDesc}
            </p>
            <div style={styles.categoryArrow}>→</div>
          </button>
        ))}
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
    fontSize: '36px',
    color: 'var(--accent-gold)',
    textAlign: 'center',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    margin: '0 0 30px 0'
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '15px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  categoryCard: {
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    position: 'relative'
  },
  categoryIcon: {
    fontSize: '48px',
    marginBottom: '12px',
    display: 'block'
  },
  categoryNameFr: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 8px 0',
    fontFamily: "'Playfair Display', serif"
  },
  categoryDescription: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    margin: '0'
  },
  categoryArrow: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    fontSize: '24px',
    color: 'var(--accent-gold)'
  }
};

export default ClassSelector;