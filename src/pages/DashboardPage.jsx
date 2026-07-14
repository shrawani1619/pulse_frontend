import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { useDreams } from '../hooks/useDreams';
import { statsService } from '../services/statsService';
import { achievementService } from '../services/achievementService';
import { insightsService } from '../services/insightsService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { dreams, loading } = useDreams();
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [nudges, setNudges] = useState([]);
  const [activeBreakdown, setActiveBreakdown] = useState(null);

  useEffect(() => {
    statsService.getConsistency()
      .then(res => setStats(res.data.data))
      .catch(() => setStats(null));
    achievementService.getAll()
      .then(res => setAchievements((res.data.data.unlocked || []).slice(0, 4)))
      .catch(() => setAchievements([]));
    insightsService.getNudges()
      .then(res => setNudges((res.data.data || []).slice(0, 3)))
      .catch(() => setNudges([]));
  }, []);

  const dreamStats = {
    totalDreams: dreams.length,
    active: dreams.filter(d => d.status === 'active').length,
    completed: dreams.filter(d => d.status === 'completed').length,
    avgProgress: dreams.length ? Math.round(dreams.reduce((s, d) => s + d.progress, 0) / dreams.length) : 0,
  };

  const breakdown = stats?.disciplineBreakdown;
  const breakdownItems = breakdown ? [
    { key: 'streak', label: 'Streak', points: breakdown.streakPoints, max: 40, to: '/today', tip: 'Stay active each day' },
    { key: 'actions', label: 'Actions', points: breakdown.actionPoints, max: 30, to: '/actions', tip: 'Complete more actions' },
    { key: 'focus', label: 'Focus', points: breakdown.focusPoints, max: 20, to: '/focus', tip: 'Log focus sessions' },
    { key: 'dreamTime', label: 'Dream Time', points: breakdown.dreamTimePoints, max: 10, to: '/dream-time', tip: 'Protect dream time' },
  ] : [];

  const activityKpis = [
    { label: 'Day Streak', value: stats?.currentStreak ?? 0, to: '/today', hint: 'Plan today' },
    { label: 'Actions Today', value: stats?.actionsCompletedToday ?? 0, to: '/actions', hint: 'Open actions' },
    { label: 'Focus Min (30d)', value: stats?.focusMinutesLast30 ?? 0, to: '/focus', hint: 'Start focus' },
    { label: 'Active Days (30d)', value: stats?.activeDaysLast30 ?? 0, to: '/analytics', hint: 'See analytics' },
  ];

  const dreamKpis = [
    { label: 'Total Dreams', value: dreamStats.totalDreams, to: '/dreams', hint: 'Manage dreams' },
    { label: 'Active', value: dreamStats.active, to: '/dreams', hint: 'Active dreams' },
    { label: 'Completed', value: dreamStats.completed, to: '/dreams', hint: 'Completed dreams' },
    { label: 'Avg Progress', value: `${dreamStats.avgProgress}%`, to: '/analytics', hint: 'Progress insights' },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title" style={{ marginBottom: 0 }}>Dashboard</h2>
        <Link to="/today" className="section__link">Plan today →</Link>
      </div>

      {nudges.length > 0 && (
        <div className="nudge-list nudge-list--compact">
          {nudges.map(nudge => (
            <Card key={nudge.id} className={`nudge-card nudge-card--${nudge.severity} nudge-card--interactive`}>
              <div className="nudge-card__body">
                <strong>{nudge.title}</strong>
                <p>{nudge.message}</p>
              </div>
              {nudge.cta && (
                <Link to={nudge.cta.href} className="nudge-card__cta">{nudge.cta.label} →</Link>
              )}
            </Card>
          ))}
        </div>
      )}

      <Card className="discipline-card discipline-card--interactive">
        <button
          type="button"
          className="discipline-card__score discipline-card__score-btn"
          onClick={() => navigate('/analytics')}
          title="Open analytics"
        >
          <div className="stat-card__value">{stats?.disciplineScore ?? 0}</div>
          <div className="stat-card__label">Discipline Score</div>
          <span className="stat-card__cta">View analytics →</span>
        </button>
        <div className="discipline-card__details">
          <p className="discipline-card__formula">
            Tap a category to improve that part of your score.
          </p>
          <ProgressBar value={stats?.disciplineScore ?? 0} color="var(--primary)" label="Out of 100" />
          {breakdownItems.length > 0 && (
            <div className="discipline-breakdown discipline-breakdown--interactive">
              {breakdownItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`discipline-chip ${activeBreakdown === item.key ? 'is-active' : ''}`}
                  onClick={() => {
                    setActiveBreakdown(item.key);
                    navigate(item.to);
                  }}
                  onMouseEnter={() => setActiveBreakdown(item.key)}
                  title={item.tip}
                >
                  <span>{item.label}</span>
                  <strong>{item.points}/{item.max}</strong>
                  <span className="discipline-chip__bar">
                    <span style={{ width: `${(item.points / item.max) * 100}%` }} />
                  </span>
                </button>
              ))}
            </div>
          )}
          {activeBreakdown && (
            <p className="card-meta" style={{ marginTop: '0.75rem' }}>
              {breakdownItems.find((b) => b.key === activeBreakdown)?.tip}
            </p>
          )}
        </div>
      </Card>

      <div className="stats-grid">
        {activityKpis.map((kpi) => (
          <button
            key={kpi.label}
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

      <div className="stats-grid">
        {dreamKpis.map((kpi) => (
          <button
            key={kpi.label}
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

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">Recent Achievements</h3>
          <Link to="/achievements" className="section__link">View all</Link>
        </div>
        {achievements.length === 0 ? (
          <Card className="empty-state">
            <p>Achievements unlock as you create dreams, goals, milestones, and complete actions.</p>
          </Card>
        ) : (
          <div className="achievements-row">
            {achievements.map(item => (
              <button
                key={item._id || item.key}
                type="button"
                className="achievement-chip achievement-chip--interactive card"
                onClick={() => navigate('/achievements')}
              >
                <span className="achievement-chip__icon">{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <div className="section__header">
          <h3 className="section__title">Your Dreams</h3>
          <Link to="/dreams" className="section__link">Manage</Link>
        </div>
        {loading ? <p>Loading...</p> : dreams.length === 0 ? (
          <Card className="empty-state">
            <p>Create your first dream to start tracking progress.</p>
            <Link to="/dreams" className="section__link">Add a dream →</Link>
          </Card>
        ) : dreams.slice(0, 5).map(dream => (
          <button
            key={dream._id}
            type="button"
            className="dream-card dream-card--interactive card"
            onClick={() => navigate('/dreams')}
          >
            <div className="dream-card__header">
              <span className="dream-card__dot" style={{ background: dream.color }} />
              <span className="dream-card__title">{dream.title}</span>
              <span className={`dream-card__badge dream-card__badge--${dream.status}`}>{dream.status}</span>
            </div>
            <ProgressBar value={dream.progress} color={dream.color} />
          </button>
        ))}
      </div>

      <div className="dashboard-links">
        <Link to="/insights">Insights →</Link>
        <Link to="/analytics">Analytics →</Link>
      </div>
    </div>
  );
}
