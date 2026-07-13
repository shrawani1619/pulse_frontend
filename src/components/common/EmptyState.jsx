import React from 'react';
import Button from './Button';

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      {title && <h3 className="empty-state__title">{title}</h3>}
      <p>{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} style={{ marginTop: '1rem' }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
