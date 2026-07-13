import React from 'react';

export default function ProgressBar({ value = 0, color = '#6366f1', label }) {
  return (
    <div className="progress-bar">
      {label && <span className="progress-bar__label">{label} — {value}%</span>}
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
