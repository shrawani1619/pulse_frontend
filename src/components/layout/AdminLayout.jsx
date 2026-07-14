import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiStar, FiActivity, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', icon: <FiHome />, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
  { to: '/admin/dreams', icon: <FiStar />, label: 'Dreams' },
  { to: '/admin/logs', icon: <FiActivity />, label: 'Logs' },
  { to: '/admin/profile', icon: <FiUser />, label: 'Profile' },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`layout layout--admin ${sidebarOpen ? 'layout--sidebar-open' : ''}`}>
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__top">
          <div className="sidebar__logo">Pulse Admin</div>
          <button type="button" className="sidebar__close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            ×
          </button>
        </div>
        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="sidebar__logout" onClick={logout}>
          Sign Out
        </button>
      </aside>
      <div className="main">
        <header className="header">
          <div className="header__left">
            <button type="button" className="header__menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              ☰
            </button>
            <p className="header__greeting">Admin · {user?.name}</p>
          </div>
          <button
            type="button"
            className="header__avatar"
            title="Profile"
            aria-label="Open profile"
            onClick={() => navigate('/admin/profile')}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
