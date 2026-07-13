import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import { achievementService } from '../services/achievementService';

export default function AchievementsPage() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    achievementService.getAll()
      .then(res => setCatalog(res.data.data.catalog || []))
      .catch(() => setCatalog([]))
      .finally(() => setLoading(false));
  }, []);

  const unlocked = catalog.filter(a => a.unlocked);
  const locked = catalog.filter(a => !a.unlocked);

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Achievements</h2>
      </div>
      <p className="page__subtitle">
        {unlocked.length} of {catalog.length} unlocked — keep showing up.
      </p>

      {loading ? <p>Loading...</p> : (
        <>
          <div className="section">
            <h3 className="section__title">Unlocked</h3>
            {unlocked.length === 0 ? (
              <Card className="empty-state">
                <p>No achievements yet. Create a dream, goal, or complete an action to unlock your first one.</p>
              </Card>
            ) : (
              <div className="cards-grid">
                {unlocked.map(item => (
                  <Card key={item.key} className="achievement-card achievement-card--unlocked">
                    <div className="achievement-card__icon">{item.icon}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {item.unlockedAt && (
                      <span className="achievement-card__date">
                        Unlocked {new Date(item.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="section">
            <h3 className="section__title">Locked</h3>
            <div className="cards-grid">
              {locked.map(item => (
                <Card key={item.key} className="achievement-card achievement-card--locked">
                  <div className="achievement-card__icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
