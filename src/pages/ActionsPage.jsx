import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import { useActions } from '../hooks/useActions';
import { useMilestones } from '../hooks/useMilestones';

const emptyForm = {
  title: '',
  description: '',
  milestone: '',
  scheduledDate: '',
  priority: 'medium',
  duration: 30,
  status: 'pending',
};

const priorityLabel = { low: 'Low', medium: 'Medium', high: 'High' };
const statusOptions = ['pending', 'in_progress', 'completed', 'skipped'];

export default function ActionsPage() {
  const { actions, loading, addAction, updateAction, removeAction } = useActions();
  const { milestones, loading: milestonesLoading } = useMilestones();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const canCreate = milestones.length > 0;
  const pending = actions.filter(a => a.status !== 'completed' && a.status !== 'skipped');
  const done = actions.filter(a => a.status === 'completed' || a.status === 'skipped');

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      milestone: milestones[0]?._id || '',
      scheduledDate: new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const openEdit = (action) => {
    setEditing(action);
    setForm({
      title: action.title || '',
      description: action.description || '',
      milestone: action.milestone?._id || action.milestone || '',
      scheduledDate: action.scheduledDate ? String(action.scheduledDate).slice(0, 10) : '',
      priority: action.priority || 'medium',
      duration: action.duration ?? 30,
      status: action.status || 'pending',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        milestone: form.milestone,
        priority: form.priority,
        duration: Number(form.duration) || 30,
        status: form.status,
        ...(form.scheduledDate ? { scheduledDate: form.scheduledDate } : { scheduledDate: null }),
      };
      if (editing) await updateAction(editing._id, payload);
      else await addAction(payload);
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const toggleComplete = async (action) => {
    const nextStatus = action.status === 'completed' ? 'pending' : 'completed';
    await updateAction(action._id, { status: nextStatus });
  };

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Daily Actions</h2>
        <Button onClick={openCreate} disabled={!canCreate}>+ New Action</Button>
      </div>
      <p className="page__subtitle">Daily executable tasks linked to your milestones.</p>

      {!milestonesLoading && !canCreate && (
        <Card className="empty-state">
          <p>Create a milestone first, then add daily actions under it.</p>
        </Card>
      )}

      {loading ? <p>Loading...</p> : (
        <>
          {actions.length === 0 && canCreate ? (
            <Card className="empty-state">
              <p>No actions yet. Add a daily task to execute against a milestone.</p>
              <Button onClick={openCreate} style={{ marginTop: '1rem' }}>Add Action</Button>
            </Card>
          ) : (
            <>
              {pending.length > 0 && (
                <div className="section">
                  <h3 className="section__title">To Do</h3>
                  <div className="actions-list">
                    {pending.map(action => (
                      <ActionCard
                        key={action._id}
                        action={action}
                        onToggle={() => toggleComplete(action)}
                        onEdit={() => openEdit(action)}
                        onDelete={() => removeAction(action._id)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {done.length > 0 && (
                <div className="section">
                  <h3 className="section__title">Done</h3>
                  <div className="actions-list">
                    {done.map(action => (
                      <ActionCard
                        key={action._id}
                        action={action}
                        onToggle={() => toggleComplete(action)}
                        onEdit={() => openEdit(action)}
                        onDelete={() => removeAction(action._id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editing ? 'Edit Action' : 'Add Action'}>
        <form onSubmit={handleSubmit}>
          <Select
            label="Linked Milestone *"
            value={form.milestone}
            onChange={e => setForm({ ...form, milestone: e.target.value })}
            required
          >
            <option value="">Select a milestone</option>
            {milestones.map(m => (
              <option key={m._id} value={m._id}>
                {m.goal?.title ? `${m.goal.title} — ` : ''}{m.title}
              </option>
            ))}
          </Select>
          <Input
            label="Action Title *"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Run 20 minutes"
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Optional details for this task"
          />
          <div className="form-row">
            <Input
              label="Scheduled Date"
              type="date"
              value={form.scheduledDate}
              onChange={e => setForm({ ...form, scheduledDate: e.target.value })}
            />
            <Select
              label="Priority"
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
            >
              {['low', 'medium', 'high'].map(p => (
                <option key={p} value={p}>{priorityLabel[p]}</option>
              ))}
            </Select>
          </div>
          <div className="form-row">
            <Input
              label="Duration (min)"
              type="number"
              min={5}
              value={form.duration}
              onChange={e => setForm({ ...form, duration: e.target.value })}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              {statusOptions.map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </Select>
          </div>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save Changes' : 'Create Action'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ActionCard({ action, onToggle, onEdit, onDelete }) {
  const dreamColor = action.milestone?.goal?.dream?.color || 'var(--primary)';
  const isDone = action.status === 'completed';

  return (
    <Card className={`action-card ${isDone ? 'action-card--done' : ''}`}>
      <button
        type="button"
        className={`action-card__check ${isDone ? 'action-card__check--done' : ''}`}
        style={isDone ? { background: dreamColor, borderColor: dreamColor } : { borderColor: dreamColor }}
        onClick={onToggle}
        aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
      >
        {isDone ? '✓' : ''}
      </button>
      <div className="action-card__body">
        {action.milestone?.title && (
          <span className="action-card__meta" style={{ color: dreamColor }}>
            {action.milestone.goal?.dream?.title ? `${action.milestone.goal.dream.title} · ` : ''}
            {action.milestone.title}
          </span>
        )}
        <h3 className={isDone ? 'action-card__title--done' : ''}>{action.title}</h3>
        {action.description && <p>{action.description}</p>}
        <div className="action-card__footer">
          <span className={`priority-badge priority-badge--${action.priority}`}>
            {priorityLabel[action.priority] || action.priority}
          </span>
          <span className={`badge badge--${action.status === 'completed' ? 'completed' : action.status === 'in_progress' ? 'active' : 'paused'}`}>
            {action.status.replace('_', ' ')}
          </span>
          {action.scheduledDate && (
            <span className="action-card__date">
              {new Date(action.scheduledDate).toLocaleDateString()}
            </span>
          )}
          <span className="action-card__duration">{action.duration} min</span>
          <button className="btn-icon" title="Edit" onClick={onEdit}>✏️</button>
          <button className="btn-icon" title="Delete" onClick={onDelete}>🗑</button>
        </div>
      </div>
    </Card>
  );
}
