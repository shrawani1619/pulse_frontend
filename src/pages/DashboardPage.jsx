import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { useDreams } from '../hooks/useDreams';
import { statsService } from '../services/statsService';
import { achievementService } from '../services/achievementService';
import { insightsService } from '../services/insightsService';

export default function DashboardPage() {
  const { dreams, loading } = useDreams();
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [nudges, setNudges] = useState([]);

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

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title" style={{ marginBottom: 0 }}>Dashboard</h2>
        <Link to="/today" className="section__link">Plan today →</Link>
      </div>

      {nudges.length > 0 && (
        <div className="nudge-list nudge-list--compact">
          {nudges.map(nudge => (
            <Card key={nudge.id} className={`nudge-card nudge-card--${nudge.severity}`}>
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

      <Card className="discipline-card">
        <div className="discipline-card__score">
          <div className="stat-card__value">{stats?.disciplineScore ?? 0}</div>
          <div className="stat-card__label">Discipline Score</div>
        </div>
        <div className="discipline-card__details">
          <p className="discipline-card__formula">
            Simple 30-day score (transparent): streak + actions + focus + dream time.
          </p>
          <ProgressBar value={stats?.disciplineScore ?? 0} color="var(--primary)" label="Out of 100" />
          {breakdown && (
            <div className="discipline-breakdown">
              <span>Streak {breakdown.streakPoints}/40</span>
              <span>Actions {breakdown.actionPoints}/30</span>
              <span>Focus {breakdown.focusPoints}/20</span>
              <span>Dream Time {breakdown.dreamTimePoints}/10</span>
            </div>
          )}
        </div>
      </Card>

      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-card__value">{stats?.currentStreak ?? 0}</div>
          <div className="stat-card__label">Day Streak</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-card__value">{stats?.actionsCompletedToday ?? 0}</div>
          <div className="stat-card__label">Actions Today</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-card__value">{stats?.focusMinutesLast30 ?? 0}</div>
          <div className="stat-card__label">Focus Min (30d)</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-card__value">{stats?.activeDaysLast30 ?? 0}</div>
          <div className="stat-card__label">Active Days (30d)</div>
        </Card>
      </div>

      <div className="stats-grid">
        <Card className="stat-card"><div className="stat-card__value">{dreamStats.totalDreams}</div><div className="stat-card__label">Total Dreams</div></Card>
        <Card className="stat-card"><div className="stat-card__value">{dreamStats.active}</div><div className="stat-card__label">Active</div></Card>
        <Card className="stat-card"><div className="stat-card__value">{dreamStats.completed}</div><div className="stat-card__label">Completed</div></Card>
        <Card className="stat-card"><div className="stat-card__value">{dreamStats.avgProgress}%</div><div className="stat-card__label">Avg Progress</div></Card>
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
              <Card key={item._id || item.key} className="achievement-chip">
                <span className="achievement-chip__icon">{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </Card>
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
          <Card key={dream._id} className="dream-card">
            <div className="dream-card__header">
              <span className="dream-card__dot" style={{ background: dream.color }} />
              <span className="dream-card__title">{dream.title}</span>
              <span className={`dream-card__badge dream-card__badge--${dream.status}`}>{dream.status}</span>
            </div>
            <ProgressBar value={dream.progress} color={dream.color} />
          </Card>
        ))}
      </div>

      <div className="dashboard-links">
        <Link to="/insights">Insights →</Link>
        <Link to="/analytics">Analytics →</Link>
      </div>
    </div>
  );
}
