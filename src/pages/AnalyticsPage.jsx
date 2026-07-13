import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { insightsService } from '../services/insightsService';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insightsService.getAnalytics()
      .then(res => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><h2 className="page__title">Analytics</h2><p>Loading...</p></div>;
  if (!data) return <div className="page"><h2 className="page__title">Analytics</h2><Card className="empty-state"><p>Could not load analytics.</p></Card></div>;

  const maxBar = Math.max(
    1,
    ...data.activityByDay.map(d => d.actionsCompleted + Math.min(d.focusMinutes / 15, 5))
  );

  const statusTotal = Object.values(data.actionsByStatus).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="page">
      <h2 className="page__title">Analytics</h2>
      <p className="page__subtitle">Deeper reporting for the last {data.periodDays} days.</p>

      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-card__value">{data.totals.activeDays}</div>
          <div className="stat-card__label">Active days</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-card__value">{data.totals.actionsCompleted}</div>
          <div className="stat-card__label">Actions done</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-card__value">{data.totals.focusMinutes}</div>
          <div className="stat-card__label">Focus minutes</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-card__value">{data.totals.dreams}</div>
          <div className="stat-card__label">Dreams</div>
        </Card>
      </div>

      <div className="section">
        <h3 className="section__title">30-day activity</h3>
        <Card className="analytics-chart">
          <div className="analytics-bars">
            {data.activityByDay.map(day => {
              const height = ((day.actionsCompleted + Math.min(day.focusMinutes / 15, 5)) / maxBar) * 100;
              return (
                <div key={day.date} className="analytics-bar-wrap" title={`${day.date}: ${day.actionsCompleted} actions, ${day.focusMinutes} focus min`}>
                  <div
                    className={`analytics-bar ${day.active ? 'analytics-bar--active' : ''}`}
                    style={{ height: `${Math.max(day.active ? 8 : 2, height)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="analytics-chart__legend">
            <span>Each bar = a day · taller = more actions/focus</span>
          </div>
        </Card>
      </div>

      <div className="analytics-split">
        <div className="section" style={{ marginTop: 0 }}>
          <h3 className="section__title">Actions by status</h3>
          <Card>
            {Object.entries(data.actionsByStatus).map(([status, count]) => (
              <div key={status} className="analytics-row">
                <span className="analytics-row__label">{status.replace('_', ' ')}</span>
                <div className="analytics-row__bar">
                  <div style={{ width: `${(count / statusTotal) * 100}%` }} />
                </div>
                <span className="analytics-row__value">{count}</span>
              </div>
            ))}
          </Card>
        </div>

        <div className="section" style={{ marginTop: 0 }}>
          <h3 className="section__title">Actions by priority</h3>
          <Card>
            {Object.entries(data.actionsByPriority).map(([priority, count]) => (
              <div key={priority} className="analytics-row">
                <span className="analytics-row__label">{priority}</span>
                <div className={`analytics-row__bar analytics-row__bar--${priority}`}>
                  <div style={{ width: `${statusTotal ? (count / statusTotal) * 100 : 0}%` }} />
                </div>
                <span className="analytics-row__value">{count}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <div className="section">
        <h3 className="section__title">Dream progress</h3>
        {data.dreamProgress.length === 0 ? (
          <Card className="empty-state"><p>No dreams yet.</p></Card>
        ) : (
          data.dreamProgress.map(dream => (
            <Card key={dream.id} className="dream-card">
              <div className="dream-card__header">
                <span className="dream-card__dot" style={{ background: dream.color }} />
                <span className="dream-card__title">{dream.title}</span>
                <span className={`badge badge--${dream.status}`}>{dream.status}</span>
              </div>
              <ProgressBar value={dream.progress} color={dream.color} label={`${dream.progress}%`} />
            </Card>
          ))
        )}
      </div>

      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-card__value">{data.totals.goals}</div>
          <div className="stat-card__label">Goals</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-card__value">{data.totals.milestones}</div>
          <div className="stat-card__label">Milestones</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-card__value">{data.totals.actions}</div>
          <div className="stat-card__label">Total actions</div>
        </Card>
      </div>
    </div>
  );
}
