import React from 'react';

export default function Textarea({ label, error, rows = 3, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <textarea
        className={`form-input form-textarea ${error ? 'form-input--error' : ''}`}
        rows={rows}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
