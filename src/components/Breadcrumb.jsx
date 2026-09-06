import React from 'react';
import './Breadcrumb.css';

const SUBJECT_LABELS = {
  pharmacology_new: { en: 'Pharmacology', fr: 'Pharmacologie' },
  parasitology: { en: 'Parasitology', fr: 'Parasitologie' },
  pharmacognosy: { en: 'Pharmacognosy', fr: 'Pharmacognosie' }
};

function Breadcrumb({ currentLang, subjectId, onHomeClick }) {
  const subjectLabel = SUBJECT_LABELS[subjectId]
    ? (currentLang === 'en' ? SUBJECT_LABELS[subjectId].en : SUBJECT_LABELS[subjectId].fr)
    : null;

  return (
    <div className="breadcrumb">
      <button className="breadcrumb-home" onClick={onHomeClick}>
        {currentLang === 'en' ? 'Home' : 'Accueil'}
      </button>
      {subjectLabel && (
        <>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{subjectLabel}</span>
        </>
      )}
    </div>
  );
}

export default Breadcrumb;