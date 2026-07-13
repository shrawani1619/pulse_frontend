import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import ProgressBar from '../components/common/ProgressBar';
import { useGoals } from '../hooks/useGoals';
import { useDreams } from '../hooks/useDreams';

const emptyForm = {
  title: '',
  description: '',
  dream: '',
  targetDate: '',
  status: 'active',
  progress: 0,
};

export default function GoalsPage() {
  const { goals, loading, addGoal, updateGoal, removeGoal } = useGoals();
  const { dreams, loading: dreamsLoading } = useDreams();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const canCreate = dreams.length > 0;

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, dream: dreams[0]?._id || '' });
    setShowModal(true);
  };

  const openEdit = (goal) => {
    setEditing(goal);
    setForm({
      title: goal.title || '',
      description: goal.description || '',
      dream: goal.dream?._id || goal.dream || '',
      targetDate: goal.targetDate ? String(goal.targetDate).slice(0, 10) : '',
      status: goal.status || 'active',
      progress: goal.progress ?? 0,
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
        dream: form.dream,
        status: form.status,
        progress: Number(form.progress) || 0,
        ...(form.targetDate ? { targetDate: form.targetDate } : { targetDate: null }),
      };
      if (editing) await updateGoal(editing._id, payload);
      else await addGoal(payload);
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">My Goals</h2>
        <Button onClick={openCreate} disabled={!canCreate}>+ New Goal</Button>
      </div>
      <p className="page__subtitle">Concrete objectives linked to your dreams.</p>

      {!dreamsLoading && !canCreate && (
        <Card className="empty-state">
          <p>Create a dream first, then add goals linked to it.</p>
        </Card>
      )}

      {loading ? <p>Loading...</p> : (
        <div className="cards-grid">
          {goals.length === 0 && canCreate ? (
            <Card className="empty-state">
              <p>No goals yet. Break a dream into concrete objectives.</p>
              <Button onClick={openCreate} style={{ marginTop: '1rem' }}>Add Goal</Button>
            </Card>
          ) : (
            goals.map(goal => (
              <Card key={goal._id} className="goal-card">
                <div className="goal-card__color-bar" style={{ background: goal.dream?.color || 'var(--primary)' }} />
                <div className="goal-card__body">
                  {goal.dream?.title && (
                    <span className="goal-card__dream" style={{ color: goal.dream?.color || 'var(--primary)' }}>
                      {goal.dream.title}
                    </span>
                  )}
                  <h3>{goal.title}</h3>
                  {goal.description && <p>{goal.description}</p>}
                  <ProgressBar value={goal.progress} color={goal.dream?.color || 'var(--primary)'} label="Progress" />
                  <div className="goal-card__footer">
                    <span className={`badge badge--${goal.status}`}>{goal.status}</span>
                    {goal.targetDate && (
                      <span className="goal-card__date">
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </span>
                    )}
                    <button className="btn-icon" title="Edit" onClick={() => openEdit(goal)}>✏️</button>
                    <button className="btn-icon" title="Delete" onClick={() => removeGoal(goal._id)}>🗑</button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editing ? 'Edit Goal' : 'Add Goal'}>
        <form onSubmit={handleSubmit}>
          <Select
            label="Linked Dream *"
            value={form.dream}
            onChange={e => setForm({ ...form, dream: e.target.value })}
            required
          >
            <option value="">Select a dream</option>
            {dreams.map(dream => (
              <option key={dream._id} value={dream._id}>{dream.title}</option>
            ))}
          </Select>
          <Input
            label="Goal Title *"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Run a 5K in 8 weeks"
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="What does success look like for this goal?"
          />
          <div className="form-row">
            <Select
              label="Status"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              {['active', 'completed', 'paused'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            <Input
              label="Progress (%)"
              type="number"
              min={0}
              max={100}
              value={form.progress}
              onChange={e => setForm({ ...form, progress: e.target.value })}
            />
          </div>
          <Input
            label="Target Date"
            type="date"
            value={form.targetDate}
            onChange={e => setForm({ ...form, targetDate: e.target.value })}
          />
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save Changes' : 'Create Goal'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
