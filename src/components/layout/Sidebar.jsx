import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiCalendar, FiStar, FiTarget, FiFlag, FiCheckSquare, FiClock, FiZap, FiAward, FiCompass, FiBarChart2, FiUser, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', icon: <FiHome />, label: 'Dashboard' },
  { to: '/today', icon: <FiCalendar />, label: 'Today' },
  { to: '/dreams', icon: <FiStar />, label: 'Dreams' },
  { to: '/goals', icon: <FiTarget />, label: 'Goals' },
  { to: '/milestones', icon: <FiFlag />, label: 'Milestones' },
  { to: '/actions', icon: <FiCheckSquare />, label: 'Actions' },
  { to: '/dream-time', icon: <FiClock />, label: 'Dream Time' },
  { to: '/focus', icon: <FiZap />, label: 'Focus' },
  { to: '/insights', icon: <FiCompass />, label: 'Insights' },
  { to: '/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
  { to: '/achievements', icon: <FiAward />, label: 'Achievements' },
  { to: '/profile', icon: <FiUser />, label: 'Profile' },
];

export default function Sidebar({ open, onClose }) {
  const { logout, user } = useAuth();

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__top">
        <div className="sidebar__logo">Pulse</div>
        <button type="button" className="sidebar__close" onClick={onClose} aria-label="Close menu">
          ×
        </button>
      </div>
      <nav className="sidebar__nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <FiShield />
            <span>Admin</span>
          </NavLink>
        )}
      </nav>
      <button className="sidebar__logout" onClick={() => { onClose?.(); logout(); }}>
        Sign Out
      </button>
    </aside>
  );
}
