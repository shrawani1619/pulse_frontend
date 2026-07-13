import React from 'react';

export default function Button({ children, variant = 'primary', size = 'md', loading, ...props }) {
  return (
    <button className={`btn btn--${variant} btn--${size} ${loading ? 'btn--loading' : ''}`} disabled={loading} {...props}>
      {loading ? <span className="spinner" /> : children}
    </button>
  );
}
