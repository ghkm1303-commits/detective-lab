import React from 'react';
import './Breadcrumb.css';

function Breadcrumb({ currentLang, onHomeClick, trail = [] }) {
  return (
    <div className="breadcrumb">
      <button className="breadcrumb-home" onClick={onHomeClick}>
        {currentLang === 'en' ? 'Home' : 'Accueil'}
      </button>
      {trail.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="breadcrumb-sep">/</span>
          {item.onClick ? (
            <button className="breadcrumb-home" onClick={item.onClick}>
              {item.label}
            </button>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Breadcrumb;