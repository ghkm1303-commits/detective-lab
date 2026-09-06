import React from 'react';
import './BackButton.css';

function BackButton({ onClick, label }) {
  return (
    <button className="bb-back-btn" onClick={onClick} aria-label={label || 'Back'}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default BackButton;