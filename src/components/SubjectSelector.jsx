import React from 'react';

const SubjectSelector = ({ onSelectSubject, onLogout, currentLang, onLanguageChange, onBack }) => {
  const subjects = [
    {
      id: 'pharmacology',
      icon: '💊',
      enName: 'Pharmacology',
      frName: 'Pharmacologie',
      enDesc: 'Study drugs and medications',
      frDesc: 'Étudier les médicaments',
      available: true
    },
    {
      id: 'pharmacognosy',
      icon: '🌿',
      enName: 'Pharmacognosy',
      frName: 'Pharmacognosie',
      enDesc: 'Explore medicinal plants',
      frDesc: 'Explorez les plantes médicinales',
      available: false
    },
    {
      id: 'parasitology',
      icon: '🦠',
      enName: 'Parasitology',
      frName: 'Parasitologie',
      enDesc: 'Learn about parasites and diseases',
      frDesc: 'Apprenez les parasites et maladies',
      available: false
    },
    {
      id: 'biochemistry',
      icon: '⚗️',
      enName: 'Biochemistry',
      frName: 'Biochimie',
      enDesc: 'Understand metabolic processes',
      frDesc: 'Comprenez les processus métaboliques',
      available: false
    },
    {
      id: 'immunology',
      icon: '🛡️',
      enName: 'Immunology',
      frName: 'Immunologie',
      enDesc: 'Study immune system',
      frDesc: 'Étudier le système immunitaire',
      available: false
    },
    {
      id: 'physiopathology',
      icon: '🔬',
      enName: 'Physiopathology',
      frName: 'Physiopathologie',
      enDesc: 'Learn disease mechanisms',
      frDesc: 'Apprenez les mécanismes de maladie',
      available: false
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔬 Detective Lab</h1>
          <h2 style={styles.subtitle}>
            {currentLang === 'en' ? 'Select Your Subject' : 'Sélectionnez Votre Matière'}
          </h2>
          <p style={styles.description}>
            {currentLang === 'en' ? 'Choose your pharmacy specialty' : 'Choisissez votre spécialité pharmaceutique'}
          </p>
        </div>

        <div style={styles.subjectsGrid}>
          {subjects.map(subject => (
            <div
              key={subject.id}
              style={{
                ...styles.subjectCard,
                opacity: subject.available ? 1 : 0.6,
                cursor: subject.available ? 'pointer' : 'not-allowed'
              }}
              onClick={() => {
                if (subject.available) {
                  onSelectSubject(subject.id);
                }
              }}
            >
              <div style={styles.subjectIcon}>{subject.icon}</div>
              <h3 style={styles.subjectName}>
                {currentLang === 'en' ? subject.enName : subject.frName}
              </h3>
              <p style={styles.subjectDesc}>
                {currentLang === 'en' ? subject.enDesc : subject.frDesc}
              </p>
              
              {!subject.available && (
                <div style={styles.comingSoonBadge}>
                  {currentLang === 'en' ? '🚀 Coming Soon' : '🚀 Bientôt'}
                </div>
              )}
              
              {subject.available && (
                <div style={styles.subjectArrow}>→</div>
              )}
            </div>
          ))}
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
  content: {
    maxWidth: '1000px',
    margin: '0 auto'
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
    margin: '0 0 15px 0'
  },
  subtitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: '0 0 10px 0'
  },
  description: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: '0'
  },
  subjectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  subjectCard: {
    padding: '25px',
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(42, 47, 74, 0.8) 100%)',
    border: '2px solid var(--accent-gold)',
    borderRadius: '10px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    position: 'relative'
  },
  subjectIcon: {
    fontSize: '56px',
    marginBottom: '15px'
  },
  subjectName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    margin: '0 0 10px 0'
  },
  subjectDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    margin: '0'
  },
  subjectArrow: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    fontSize: '20px',
    color: 'var(--accent-gold)'
  },
  comingSoonBadge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    background: 'rgba(212, 175, 55, 0.2)',
    padding: '4px 8px',
    borderRadius: '4px',
    whiteSpace: 'nowrap'
  }
};

export default SubjectSelector;