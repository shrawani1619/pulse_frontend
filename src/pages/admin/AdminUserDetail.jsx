import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  banUser,
  deleteUser,
  getAdminUser,
  unbanUser
} from '../../services/adminService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import toast from 'react-hot-toast';

const fmt = (d) => (d ? new Date(d).toLocaleString() : '—');

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminUser(id);
      setData(res.data);
    } catch {
      toast.error('Failed to load user');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const onBan = async () => {
    try {
      await banUser(id);
      toast.success('User banned');
      load();
    } catch {
      toast.error('Ban failed');
    }
  };

  const onUnban = async () => {
    try {
      await unbanUser(id);
      toast.success('User unbanned');
      load();
    } catch {
      toast.error('Unban failed');
    }
  };

  const onDelete = async () => {
    if (!window.confirm('Permanently delete this user and all their data?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      navigate('/admin/users');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!data) return null;

  const { user, dreams, goals, milestones, actions, dreamTimes, focusSessions, achievements } = data;

  return (
    <div className="page admin-page">
      <div className="page__header">
        <div>
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => navigate('/admin/users')}>
            ← Users
          </button>
          <h1 className="page__title" style={{ marginTop: '0.75rem', marginBottom: 0 }}>User detail</h1>
        </div>
        <div className="admin-actions">
          {user.status === 'banned' ? (
            <Button size="sm" onClick={onUnban}>Unban</Button>
          ) : (
            <Button size="sm" onClick={onBan}>Ban</Button>
          )}
          <Button size="sm" variant="secondary" onClick={onDelete}>Delete</Button>
        </div>
      </div>

      <Card className="admin-profile-card">
        <div className="admin-user-cell" style={{ marginBottom: '1.25rem' }}>
          <span className="header__avatar" style={{ width: 48, height: 48, fontSize: '1.25rem' }}>
            {user.name?.[0]?.toUpperCase() || '?'}
          </span>
          <div>
            <h2 style={{ margin: 0 }}>{user.name}</h2>
            <div className="card-meta">{user.email}</div>
          </div>
          <span className={`badge badge--${user.status}`} style={{ marginLeft: 'auto' }}>{user.status}</span>
        </div>

        <div className="admin-detail-grid">
          <div><span className="card-meta">User ID</span><div>{user._id}</div></div>
          <div><span className="card-meta">Role</span><div>{user.role || 'user'}</div></div>
          <div><span className="card-meta">Active</span><div>{user.isActive ? 'Yes' : 'No'}</div></div>
          <div><span className="card-meta">Registered</span><div>{fmt(user.createdAt)}</div></div>
          <div><span className="card-meta">Updated</span><div>{fmt(user.updatedAt)}</div></div>
          <div><span className="card-meta">Last login</span><div>{fmt(user.lastLoginAt)}</div></div>
          <div><span className="card-meta">Banned at</span><div>{fmt(user.bannedAt)}</div></div>
          <div><span className="card-meta">Avatar</span><div>{user.avatar || '—'}</div></div>
        </div>
      </Card>

      <div className="stats-grid" style={{ marginTop: '1.25rem' }}>
        <Card className="stat-card"><div className="stat-card__value">{user.dreamCount}</div><div className="stat-card__label">Dreams</div></Card>
        <Card className="stat-card"><div className="stat-card__value">{user.goalCount}</div><div className="stat-card__label">Goals</div></Card>
        <Card className="stat-card"><div className="stat-card__value">{user.milestoneCount}</div><div className="stat-card__label">Milestones</div></Card>
        <Card className="stat-card"><div className="stat-card__value">{user.actionCount}</div><div className="stat-card__label">Actions</div></Card>
        <Card className="stat-card"><div className="stat-card__value">{user.dreamTimeCount}</div><div className="stat-card__label">Dream Time</div></Card>
        <Card className="stat-card"><div className="stat-card__value">{user.focusCount}</div><div className="stat-card__label">Focus</div></Card>
        <Card className="stat-card"><div className="stat-card__value">{user.achievementCount}</div><div className="stat-card__label">Achievements</div></Card>
      </div>

      <div className="admin-detail-sections">
        <Card>
          <h2 className="admin-section-title">Dreams ({dreams.length})</h2>
          {dreams.length === 0 ? <p className="card-meta">None</p> : (
            <div className="cards-grid">
              {dreams.map((d) => (
                <div key={d._id} className="admin-item-card">
                  <strong>{d.title}</strong>
                  <div className="card-meta">{d.category} · {d.status} · color {d.color}</div>
                  {d.description && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{d.description}</p>}
                  <div style={{ marginTop: '0.5rem' }}><ProgressBar value={d.progress || 0} /></div>
                  <div className="card-meta" style={{ marginTop: '0.5rem' }}>
                    Target {fmt(d.targetDate)} · Created {fmt(d.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="admin-section-title">Goals ({goals.length})</h2>
          {goals.length === 0 ? <p className="card-meta">None</p> : (
            <ul className="admin-list">
              {goals.map((g) => (
                <li key={g._id}>
                  <strong>{g.title}</strong> · {g.status} · {g.progress || 0}%
                  {g.description && <div style={{ fontSize: '0.9rem' }}>{g.description}</div>}
                  <div className="card-meta">Dream {g.dream} · Target {fmt(g.targetDate)} · {fmt(g.createdAt)}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="admin-section-title">Milestones ({milestones.length})</h2>
          {milestones.length === 0 ? <p className="card-meta">None</p> : (
            <ul className="admin-list">
              {milestones.map((m) => (
                <li key={m._id}>
                  <strong>{m.title}</strong> · {m.status} · {m.progress || 0}%
                  {m.description && <div style={{ fontSize: '0.9rem' }}>{m.description}</div>}
                  <div className="card-meta">Goal {m.goal} · Target {fmt(m.targetDate)} · {fmt(m.createdAt)}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="admin-section-title">Actions ({actions.length})</h2>
          {actions.length === 0 ? <p className="card-meta">None</p> : (
            <ul className="admin-list">
              {actions.map((a) => (
                <li key={a._id}>
                  <strong>{a.title}</strong> · {a.status} · {a.priority}
                  {a.description && <div style={{ fontSize: '0.9rem' }}>{a.description}</div>}
                  <div className="card-meta">
                    Scheduled {fmt(a.scheduledDate)} · Completed {fmt(a.completedAt)} · Duration {a.duration ?? '—'} · {fmt(a.createdAt)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="admin-section-title">Dream Time ({dreamTimes.length})</h2>
          {dreamTimes.length === 0 ? <p className="card-meta">None</p> : (
            <ul className="admin-list">
              {dreamTimes.map((dt) => (
                <li key={dt._id}>
                  <strong>{dt.title || 'Dream Time'}</strong> · {dt.status}
                  <div className="card-meta">
                    {fmt(dt.date)} · {dt.startTime}–{dt.endTime}
                    {dt.notes ? ` · ${dt.notes}` : ''}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="admin-section-title">Focus sessions ({focusSessions.length})</h2>
          {focusSessions.length === 0 ? <p className="card-meta">None</p> : (
            <ul className="admin-list">
              {focusSessions.map((f) => (
                <li key={f._id}>
                  <strong>{f.status}</strong> · planned {f.plannedMinutes}m · elapsed {Math.round((f.elapsedSeconds || 0) / 60)}m
                  {f.notes && <div style={{ fontSize: '0.9rem' }}>{f.notes}</div>}
                  <div className="card-meta">Started {fmt(f.startedAt)} · Ended {fmt(f.endedAt)} · {fmt(f.createdAt)}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="admin-section-title">Achievements ({achievements.length})</h2>
          {achievements.length === 0 ? <p className="card-meta">None</p> : (
            <ul className="admin-list">
              {achievements.map((a) => (
                <li key={a._id}>
                  <strong>{a.icon} {a.title}</strong> ({a.key})
                  {a.description && <div style={{ fontSize: '0.9rem' }}>{a.description}</div>}
                  <div className="card-meta">Unlocked {fmt(a.unlockedAt || a.createdAt)}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
