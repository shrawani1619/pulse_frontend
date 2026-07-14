import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminStats } from '../../services/adminService';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [range, setRange] = useState(30);

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data.stats))
      .catch(() => toast.error('Failed to load admin stats'))
      .finally(() => setLoading(false));
  }, []);

  const growthSlice = useMemo(() => {
    if (!stats?.growth) return [];
    return stats.growth.slice(-range);
  }, [stats, range]);

  const maxGrowth = useMemo(
    () => Math.max(1, ...growthSlice.map((g) => g.count)),
    [growthSlice]
  );

  const totalInRange = useMemo(
    () => growthSlice.reduce((s, g) => s + g.count, 0),
    [growthSlice]
  );

  if (loading) return <div className="loader">Loading...</div>;
  if (!stats) return null;

  const kpis = [
    { key: 'total', label: 'Total Users', value: stats.totalUsers, to: '/admin/users', hint: 'Open all users' },
    { key: 'active', label: 'Active Users', value: stats.activeUsers, to: '/admin/users?status=active', hint: 'Filter active' },
    { key: 'banned', label: 'Banned Users', value: stats.bannedUsers, to: '/admin/users?status=banned', hint: 'Filter banned' },
    { key: 'dreams', label: 'Dreams', value: stats.totalDreams, to: '/admin/dreams', hint: 'View dreams' },
    { key: 'goals', label: 'Goals', value: stats.totalGoals, to: '/admin/dreams', hint: 'Related dreams' },
    { key: 'actions', label: 'Actions Done', value: stats.actionsCompleted, to: '/admin/logs', hint: 'View activity logs' },
  ];

  return (
    <div className="page admin-page">
      <div className="page__header">
        <h1 className="page__title" style={{ marginBottom: 0 }}>Admin Dashboard</h1>
        <p className="card-meta">Click cards or chart bars to explore</p>
      </div>

      <div className="stats-grid">
        {kpis.map((kpi) => (
          <button
            key={kpi.key}
            type="button"
            className="stat-card stat-card--interactive card"
            title={kpi.hint}
            onClick={() => navigate(kpi.to)}
          >
            <div className="stat-card__value">{kpi.value}</div>
            <div className="stat-card__label">{kpi.label}</div>
            <span className="stat-card__cta">{kpi.hint} →</span>
          </button>
        ))}
      </div>

      <Card>
        <div className="page__header" style={{ marginBottom: '1rem' }}>
          <h2 className="admin-section-title" style={{ marginBottom: 0 }}>User growth</h2>
          <div className="admin-range-toggle">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                type="button"
                className={`admin-range-btn ${range === days ? 'is-active' : ''}`}
                onClick={() => { setRange(days); setSelectedDay(null); }}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>

        <div className="admin-chart-meta">
          <span>{totalInRange} signups in last {range} days</span>
          {selectedDay && (
            <strong>
              {selectedDay.date}: {selectedDay.count} user{selectedDay.count === 1 ? '' : 's'}
            </strong>
          )}
        </div>

        <div className="admin-chart" role="img" aria-label="User growth chart">
          {growthSlice.map((g) => {
            const height = `${Math.max(4, (g.count / maxGrowth) * 100)}%`;
            const active = selectedDay?.date === g.date;
            return (
              <button
                key={g.date}
                type="button"
                className={`admin-chart__col ${active ? 'is-active' : ''} ${g.count ? 'has-value' : ''}`}
                style={{ '--bar-h': height }}
                onClick={() => setSelectedDay(g)}
                onMouseEnter={() => setSelectedDay(g)}
                title={`${g.date}: ${g.count}`}
              >
                <span className="admin-chart__tooltip">{g.count}</span>
                <span className="admin-chart__bar" />
                <span className="admin-chart__label">{g.date.slice(5)}</span>
              </button>
            );
          })}
        </div>

        {selectedDay && (
          <div className="admin-chart-detail">
            <p>
              On <strong>{selectedDay.date}</strong>, <strong>{selectedDay.count}</strong> user(s) signed up.
            </p>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => navigate('/admin/users')}
            >
              Open users
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => navigate('/admin/logs')}
            >
              View logs
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
