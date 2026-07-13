import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import ProgressBar from '../components/common/ProgressBar';
import { useMilestones } from '../hooks/useMilestones';
import { useGoals } from '../hooks/useGoals';

const emptyForm = {
  title: '',
  description: '',
  goal: '',
  targetDate: '',
  status: 'active',
  progress: 0,
  order: 0,
};

export default function MilestonesPage() {
  const { milestones, loading, addMilestone, updateMilestone, removeMilestone } = useMilestones();
  const { goals, loading: goalsLoading } = useGoals();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const canCreate = goals.length > 0;

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, goal: goals[0]?._id || '' });
    setShowModal(true);
  };

  const openEdit = (milestone) => {
    setEditing(milestone);
    setForm({
      title: milestone.title || '',
      description: milestone.description || '',
      goal: milestone.goal?._id || milestone.goal || '',
      targetDate: milestone.targetDate ? String(milestone.targetDate).slice(0, 10) : '',
      status: milestone.status || 'active',
      progress: milestone.progress ?? 0,
      order: milestone.order ?? 0,
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
        goal: form.goal,
        status: form.status,
        progress: Number(form.progress) || 0,
        order: Number(form.order) || 0,
        ...(form.targetDate ? { targetDate: form.targetDate } : { targetDate: null }),
      };
      if (editing) await updateMilestone(editing._id, payload);
      else await addMilestone(payload);
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">My Milestones</h2>
        <Button onClick={openCreate} disabled={!canCreate}>+ New Milestone</Button>
      </div>
      <p className="page__subtitle">Staged outcomes under your goals.</p>

      {!goalsLoading && !canCreate && (
        <Card className="empty-state">
          <p>Create a goal first, then add milestones as staged outcomes.</p>
        </Card>
      )}

      {loading ? <p>Loading...</p> : (
        <div className="cards-grid">
          {milestones.length === 0 && canCreate ? (
            <Card className="empty-state">
              <p>No milestones yet. Break a goal into staged outcomes.</p>
              <Button onClick={openCreate} style={{ marginTop: '1rem' }}>Add Milestone</Button>
            </Card>
          ) : (
            milestones.map(milestone => {
              const dreamColor = milestone.goal?.dream?.color || 'var(--primary)';
              return (
                <Card key={milestone._id} className="milestone-card">
                  <div className="milestone-card__color-bar" style={{ background: dreamColor }} />
                  <div className="milestone-card__body">
                    {milestone.goal?.title && (
                      <span className="milestone-card__meta" style={{ color: dreamColor }}>
                        {milestone.goal.dream?.title ? `${milestone.goal.dream.title} · ` : ''}
                        {milestone.goal.title}
                      </span>
                    )}
                    <h3>{milestone.title}</h3>
                    {milestone.description && <p>{milestone.description}</p>}
                    <ProgressBar value={milestone.progress} color={dreamColor} label="Progress" />
                    <div className="milestone-card__footer">
                      <span className={`badge badge--${milestone.status}`}>{milestone.status}</span>
                      {milestone.targetDate && (
                        <span className="milestone-card__date">
                          Target: {new Date(milestone.targetDate).toLocaleDateString()}
                        </span>
                      )}
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(milestone)}>✏️</button>
                      <button className="btn-icon" title="Delete" onClick={() => removeMilestone(milestone._id)}>🗑</button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editing ? 'Edit Milestone' : 'Add Milestone'}>
        <form onSubmit={handleSubmit}>
          <Select
            label="Linked Goal *"
            value={form.goal}
            onChange={e => setForm({ ...form, goal: e.target.value })}
            required
          >
            <option value="">Select a goal</option>
            {goals.map(goal => (
              <option key={goal._id} value={goal._id}>
                {goal.dream?.title ? `${goal.dream.title} — ` : ''}{goal.title}
              </option>
            ))}
          </Select>
          <Input
            label="Milestone Title *"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Complete first training week"
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="What must be true for this milestone to be done?"
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
          <div className="form-row">
            <Input
              label="Target Date"
              type="date"
              value={form.targetDate}
              onChange={e => setForm({ ...form, targetDate: e.target.value })}
            />
            <Input
              label="Order"
              type="number"
              min={0}
              value={form.order}
              onChange={e => setForm({ ...form, order: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save Changes' : 'Create Milestone'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
