import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { actionService } from '../services/actionService';
import { dreamTimeService } from '../services/dreamTimeService';
import toast from 'react-hot-toast';

const priorityLabel = { low: 'Low', medium: 'Medium', high: 'High' };

export default function TodayPage() {
  const [actions, setActions] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [actionsRes, blocksRes] = await Promise.all([
        actionService.getAll({ today: 'true' }),
        dreamTimeService.getAll({ today: 'true' }),
      ]);
      setActions(actionsRes.data.data || []);
      setBlocks(blocksRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load today\'s plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleComplete = async (action) => {
    const nextStatus = action.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await actionService.update(action._id, { status: nextStatus });
      setActions(prev => prev.map(a => a._id === action._id ? res.data.data : a));
      toast.success(nextStatus === 'completed' ? 'Action completed!' : 'Marked pending');
    } catch (err) {
      toast.error('Could not update action');
    }
  };

  const markBlockDone = async (block) => {
    try {
      const res = await dreamTimeService.update(block._id, { status: 'completed' });
      setBlocks(prev => prev.map(b => b._id === block._id ? res.data.data : b));
      toast.success('Dream Time completed');
    } catch (err) {
      toast.error('Could not update Dream Time');
    }
  };

  const pending = actions.filter(a => a.status !== 'completed' && a.status !== 'skipped');
  const done = actions.filter(a => a.status === 'completed');
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">Today</h2>
          <p className="page__subtitle" style={{ marginBottom: 0 }}>{todayLabel}</p>
        </div>
        <Link to="/actions"><Button variant="secondary">+ Add Action</Button></Link>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          <div className="stats-grid">
            <Card className="stat-card">
              <div className="stat-card__value">{pending.length}</div>
              <div className="stat-card__label">Actions left</div>
            </Card>
            <Card className="stat-card">
              <div className="stat-card__value">{done.length}</div>
              <div className="stat-card__label">Completed</div>
            </Card>
            <Card className="stat-card">
              <div className="stat-card__value">{blocks.length}</div>
              <div className="stat-card__label">Dream Time blocks</div>
            </Card>
            <Card className="stat-card">
              <div className="stat-card__value">
                {actions.length ? Math.round((done.length / actions.length) * 100) : 0}%
              </div>
              <div className="stat-card__label">Day progress</div>
            </Card>
          </div>

          <div className="section">
            <h3 className="section__title">Dream Time Today</h3>
            {blocks.length === 0 ? (
              <Card className="empty-state">
                <p>No protected time blocked for today. <Link to="/dream-time">Schedule Dream Time</Link></p>
              </Card>
            ) : (
              <div className="actions-list">
                {blocks.map(block => (
                  <Card key={block._id} className="today-block">
                    <div
                      className="today-block__dot"
                      style={{ background: block.dream?.color || 'var(--primary)' }}
                    />
                    <div className="today-block__body">
                      <strong>{block.title || 'Dream Time'}</strong>
                      <p>
                        {block.startTime} – {block.endTime}
                        {block.dream?.title ? ` · ${block.dream.title}` : ''}
                      </p>
                    </div>
                    <span className={`badge badge--${block.status === 'completed' ? 'completed' : 'active'}`}>
                      {block.status}
                    </span>
                    {block.status === 'planned' && (
                      <Button size="sm" variant="secondary" onClick={() => markBlockDone(block)}>
                        Done
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="section">
            <h3 className="section__title">Actions Today</h3>
            {actions.length === 0 ? (
              <Card className="empty-state">
                <p>Nothing scheduled for today. <Link to="/actions">Add an action</Link> and set today as the date.</p>
              </Card>
            ) : (
              <div className="actions-list">
                {actions.map(action => {
                  const dreamColor = action.milestone?.goal?.dream?.color || 'var(--primary)';
                  const isDone = action.status === 'completed';
                  return (
                    <Card key={action._id} className={`action-card ${isDone ? 'action-card--done' : ''}`}>
                      <button
                        type="button"
                        className={`action-card__check ${isDone ? 'action-card__check--done' : ''}`}
                        style={isDone ? { background: dreamColor, borderColor: dreamColor } : { borderColor: dreamColor }}
                        onClick={() => toggleComplete(action)}
                      >
                        {isDone ? '✓' : ''}
                      </button>
                      <div className="action-card__body">
                        {action.milestone?.title && (
                          <span className="action-card__meta" style={{ color: dreamColor }}>
                            {action.milestone.title}
                          </span>
                        )}
                        <h3 className={isDone ? 'action-card__title--done' : ''}>{action.title}</h3>
                        <div className="action-card__footer">
                          <span className={`priority-badge priority-badge--${action.priority}`}>
                            {priorityLabel[action.priority]}
                          </span>
                          <span className="action-card__duration">{action.duration} min</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
