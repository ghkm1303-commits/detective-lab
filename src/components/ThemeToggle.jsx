import React, { useEffect, useState } from 'react';

const ThemeToggle = ({ theme, onThemeChange }) => {
  return (
    <div className="theme-toggle">
      <button
        className={theme === 'dark' ? 'active' : ''}
        onClick={() => onThemeChange('dark')}
        title="Dark Mode"
      >
        🌙
      </button>
      <button
        className={theme === 'light' ? 'active' : ''}
        onClick={() => onThemeChange('light')}
        title="Light Mode"
      >
        ☀️
      </button>
    </div>
  );
};

export default ThemeToggle;