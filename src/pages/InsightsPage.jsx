import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import { insightsService } from '../services/insightsService';

export default function InsightsPage() {
  const [insights, setInsights] = useState([]);
  const [nudges, setNudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState(null);

  useEffect(() => {
    insightsService.getAll()
      .then(res => {
        setInsights(res.data.data.insights || []);
        setNudges(res.data.data.nudges || []);
        setGeneratedAt(res.data.data.generatedAt);
      })
      .catch(() => {
        setInsights([]);
        setNudges([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Insights</h2>
      </div>
      <p className="page__subtitle">
        Rule-based recommendations from your real activity
        {generatedAt ? ` · updated ${new Date(generatedAt).toLocaleString()}` : ''}.
      </p>

      {loading ? <p>Loading...</p> : (
        <>
          {nudges.length > 0 && (
            <div className="section">
              <h3 className="section__title">Accountability nudges</h3>
              <div className="nudge-list">
                {nudges.map(nudge => (
                  <Card key={nudge.id} className={`nudge-card nudge-card--${nudge.severity}`}>
                    <div className="nudge-card__body">
                      <strong>{nudge.title}</strong>
                      <p>{nudge.message}</p>
                    </div>
                    {nudge.cta && (
                      <Link to={nudge.cta.href} className="nudge-card__cta">
                        {nudge.cta.label} →
                      </Link>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="section">
            <h3 className="section__title">Recommendations</h3>
            {insights.length === 0 ? (
              <Card className="empty-state">
                <p>Add more activity to unlock insights.</p>
              </Card>
            ) : (
              <div className="cards-grid">
                {insights.map(item => (
                  <Card key={item.id} className="insight-card">
                    <span className="insight-card__category">{item.category}</span>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <div className="insight-card__rec">
                      <strong>Try this:</strong> {item.recommendation}
                    </div>
                    {item.metric && (
                      <div className="insight-card__metric">
                        <span className="insight-card__metric-value">
                          {item.metric.value}{item.metric.unit}
                        </span>
                        <span className="insight-card__metric-label">{item.metric.label}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
