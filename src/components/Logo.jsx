import React from 'react';
import './Logo.css';

function LogoIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="320 367 441 346"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon points="574.33 382.14 505.67 382.14 334.67 382.14 334.67 542.26 381.01 542.26 381.01 436.09 505.67 436.09 574.33 436.09 698.99 436.09 698.99 542.26 745.33 542.26 745.33 382.14 574.33 382.14" />
      <path d="M540.35,697.86q-31.12,0-54.3-9.69a100.49,100.49,0,0,1-38.39-27.49q-15.23-17.82-22.82-43.4t-7.61-57.41q0-14.52,1.21-33.89a276.89,276.89,0,0,1,5-38.05H656.89a319.75,319.75,0,0,1,4.67,38.91q1.22,20.24,1.21,34.76,0,30.78-6.92,55.85t-21.78,43.06q-14.88,18-38.05,27.66T540.35,697.86Zm-76.09-156q-.35,3.79-.52,8.81t-.17,11.94q0,40.46,20.41,60t56.37,19.54q37.68,0,57.06-18.68t19.36-59.14c0-3.69,0-7.49-.17-11.41a109.24,109.24,0,0,0-.86-11.06Z" />
    </svg>
  );
}

function Logo({ variant = 'horizontal', theme = 'dark' }) {
  if (variant === 'icon') {
    return (
      <div className={`logo logo-icon-only logo-${theme}`}>
        <LogoIcon className="logo-icon" />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`logo logo-stacked logo-${theme}`}>
        <LogoIcon className="logo-icon" />
        <span className="logo-text-single">Detective Labs</span>
      </div>
    );
  }

  // horizontal (default): icon | Detective / Labs — matches the original SVG lockup
  return (
    <div className={`logo logo-horizontal logo-${theme}`}>
      <LogoIcon className="logo-icon" />
      <div className="logo-divider"></div>
      <span className="logo-text">
        Detective<br />Labs
      </span>
    </div>
  );
}

export default Logo;