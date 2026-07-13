import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  return (
    <header className="header">
      <div className="header__left">
        <button
          type="button"
          className="header__menu"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          ☰
        </button>
        <h1 className="header__greeting">Welcome back, {user?.name?.split(' ')[0]}</h1>
      </div>
      <div className="header__avatar">{user?.name?.[0]?.toUpperCase()}</div>
    </header>
  );
}
