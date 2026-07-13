import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useFocus } from '../hooks/useFocus';
import { useDreams } from '../hooks/useDreams';

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const PRESETS = [15, 25, 45, 60];

export default function FocusPage() {
  const { active, sessions, elapsed, loading, startSession, completeSession, cancelSession } = useFocus();
  const { dreams } = useDreams();
  const [plannedMinutes, setPlannedMinutes] = useState(25);
  const [dreamId, setDreamId] = useState('');

  const plannedSeconds = (active?.plannedMinutes || plannedMinutes) * 60;
  const remaining = Math.max(0, plannedSeconds - elapsed);
  const progress = plannedSeconds ? Math.min(100, Math.round((elapsed / plannedSeconds) * 100)) : 0;

  const handleStart = async () => {
    await startSession({
      plannedMinutes,
      ...(dreamId && { dream: dreamId }),
    });
  };

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Focus</h2>
      </div>
      <p className="page__subtitle">Deep-work sessions that don’t depend on motivation.</p>

      <Card className="focus-panel">
        {loading ? (
          <p>Loading...</p>
        ) : active ? (
          <>
            <div className="focus-timer">{formatTime(remaining)}</div>
            <p className="focus-timer__label">
              {remaining === 0 ? 'Time complete — finish when ready' : 'remaining'}
            </p>
            {active.dream?.title && (
              <p className="focus-dream" style={{ color: active.dream.color }}>
                {active.dream.title}
              </p>
            )}
            <div className="focus-progress">
              <div className="focus-progress__fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="focus-actions">
              <Button onClick={completeSession}>Complete</Button>
              <Button variant="secondary" onClick={cancelSession}>Cancel</Button>
            </div>
            <p className="focus-elapsed">Elapsed: {formatTime(elapsed)}</p>
          </>
        ) : (
          <>
            <div className="focus-timer">{formatTime(plannedMinutes * 60)}</div>
            <p className="focus-timer__label">planned session</p>
            <div className="focus-presets">
              {PRESETS.map(mins => (
                <button
                  key={mins}
                  type="button"
                  className={`focus-preset ${plannedMinutes === mins ? 'focus-preset--active' : ''}`}
                  onClick={() => setPlannedMinutes(mins)}
                >
                  {mins}m
                </button>
              ))}
            </div>
            <div className="form-group" style={{ maxWidth: 320, margin: '1rem auto' }}>
              <label className="form-label">Link to dream (optional)</label>
              <select
                className="form-input"
                value={dreamId}
                onChange={e => setDreamId(e.target.value)}
              >
                <option value="">Any deep work</option>
                {dreams.map(d => (
                  <option key={d._id} value={d._id}>{d.title}</option>
                ))}
              </select>
            </div>
            <Button onClick={handleStart}>Start Focus</Button>
          </>
        )}
      </Card>

      {sessions.length > 0 && (
        <div className="section">
          <h3 className="section__title">Recent Sessions</h3>
          <div className="actions-list">
            {sessions.slice(0, 8).map(session => (
              <Card key={session._id} className="focus-history-card">
                <div className="focus-history-card__row">
                  <strong>
                    {Math.round((session.elapsedSeconds || 0) / 60)} min
                  </strong>
                  <span className="badge badge--completed">completed</span>
                </div>
                <p>
                  {session.dream?.title || 'General focus'}
                  {session.endedAt && ` · ${new Date(session.endedAt).toLocaleString()}`}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
