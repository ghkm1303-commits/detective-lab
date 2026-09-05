import React from 'react';
import ThemeToggle from './ThemeToggle';

const PharmaClassSelector = ({ onSelectClass, onBack, currentLang, userName, onStats, theme, onThemeChange }) => {
  const domains = [
    { id: 'cholinergic', enName: 'Cholinergic', frName: 'Cholinergique', icon: '🧠' },
    { id: 'adrenergic', enName: 'Adrenergic', frName: 'Adrénergique', icon: '⚡' },
    { id: 'amino_acid', enName: 'Amino Acids (AEDs/Anxiolytics)', frName: 'Acides Aminés (Antiépileptiques/Anxiolytiques)', icon: '💤' },
    { id: 'histamine', enName: 'Histamine (H1/H2)', frName: 'Histamine (H1/H2)', icon: '🤧' },
    { id: 'dopaminergic', enName: 'Dopaminergic', frName: 'Dopaminergique', icon: '🎭' },
    { id: 'renin_angiotensin', enName: 'Renin-Angiotensin', frName: 'Rénine-Angiotensine', icon: '🫀' },
    { id: 'nitric_oxide', enName: 'Nitric Oxide', frName: "Monoxyde d'Azote", icon: '💨' },
    { id: 'serotonergic', enName: 'Serotonergic', frName: 'Sérotoninergique', icon: '😊' },
    { id: 'prostaglandin', enName: 'Prostaglandins', frName: 'Prostaglandines', icon: '🔥' },
    { id: 'ion_channels', enName: 'K+/Ca2+ Channels', frName: 'Canaux K+/Ca2+', icon: '🔋' },
    { id: 'anesthetics', enName: 'General Anesthetics', frName: 'Anesthésiques Généraux', icon: '😴' },
    { id: 'antibiotics', enName: 'Antibiotics', frName: 'Antibiotiques', icon: '🦠' },
    { id: 'anticancer', enName: 'Anticancer', frName: 'Anticancéreux', icon: '🎗️' },
    { id: 'ion_transporters', enName: 'Diuretics', frName: 'Diurétiques', icon: '💧' },
    { id: 'hemostasis', enName: 'Hemostasis', frName: 'Hémostase', icon: '🩸' },
    { id: 'opioids', enName: 'Opioids', frName: 'Opioïdes', icon: '🌙' },
    { id: 'sodium_channels', enName: 'Na+ Channels / Local Anesthetics', frName: 'Canaux Na+ / Anesthésiques Locaux', icon: '💉' },
    { id: 'pumps', enName: 'Na+/Proton Pumps', frName: 'Pompes Na+/Protons', icon: '⚙️' }
  ];

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
          {currentLang === 'en' ? 'Select Domain' : 'Sélectionnez le Domaine'}
        </h1>

        <div style={styles.classGrid}>
          {domains.map(d => (
            <button key={d.id} style={styles.classCard} onClick={() => onSelectClass(d.id)}>
              <div style={styles.classIcon}>{d.icon}</div>
              <h3 style={styles.className}>{currentLang === 'en' ? d.enName : d.frName}</h3>
            </button>
          ))}
        </div>
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
  rightGroup: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  content: { maxWidth: '1100px', margin: '0 auto' },
  title: { textAlign: 'center', marginBottom: '40px' },
  classGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' },
  classCard: {
    background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%)',
    border: '2px solid var(--accent-gold)', borderRadius: '10px', padding: '20px',
    cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center'
  },
  classIcon: { fontSize: '32px', marginBottom: '10px' },
  className: { color: 'var(--accent-gold)', fontSize: '13px', margin: '0', fontFamily: "'Playfair Display', serif" }
};

export default PharmaClassSelector;