import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import ProgressBar from '../components/common/ProgressBar';
import { useDreams } from '../hooks/useDreams';

const emptyForm = {
  title: '',
  description: '',
  category: 'personal',
  color: '#6366f1',
  status: 'active',
  progress: 0,
  targetDate: '',
};

export default function DreamsPage() {
  const { dreams, loading, addDream, updateDream, removeDream } = useDreams();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (dream) => {
    setEditing(dream);
    setForm({
      title: dream.title || '',
      description: dream.description || '',
      category: dream.category || 'personal',
      color: dream.color || '#6366f1',
      status: dream.status || 'active',
      progress: dream.progress ?? 0,
      targetDate: dream.targetDate ? dream.targetDate.slice(0, 10) : '',
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
        category: form.category,
        color: form.color,
        status: form.status,
        progress: Number(form.progress) || 0,
        ...(form.targetDate ? { targetDate: form.targetDate } : { targetDate: null }),
      };
      if (editing) await updateDream(editing._id, payload);
      else await addDream(payload);
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">My Dreams</h2>
        <Button onClick={openCreate}>+ New Dream</Button>
      </div>

      {loading ? <p>Loading...</p> : dreams.length === 0 ? (
        <Card className="empty-state">
          <p>No dreams yet. Add your first long-term vision to begin.</p>
          <Button onClick={openCreate} style={{ marginTop: '1rem' }}>Create Dream</Button>
        </Card>
      ) : (
        <div className="cards-grid">
          {dreams.map(dream => (
            <Card key={dream._id} className="dream-full-card">
              <div className="dream-full-card__color-bar" style={{ background: dream.color }} />
              <div className="dream-full-card__body">
                <h3>{dream.title}</h3>
                <p>{dream.description || 'No description'}</p>
                <ProgressBar value={dream.progress} color={dream.color} label="Progress" />
                <div className="dream-full-card__actions">
                  <span className={`badge badge--${dream.status}`}>{dream.status}</span>
                  <span className="card-meta">{dream.category}</span>
                  <button className="btn-icon" title="Edit" onClick={() => openEdit(dream)}>✏️</button>
                  <button className="btn-icon" title="Delete" onClick={() => removeDream(dream._id)}>🗑</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editing ? 'Edit Dream' : 'Add Dream'}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Dream Title *"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Build a healthy lifestyle"
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="What does this dream look like when achieved?"
          />
          <div className="form-row">
            <Select
              label="Category"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              {['career', 'health', 'relationships', 'finance', 'personal', 'other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            <Select
              label="Status"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              {['active', 'completed', 'paused'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div className="form-row">
            <Input
              label="Progress (%)"
              type="number"
              min={0}
              max={100}
              value={form.progress}
              onChange={e => setForm({ ...form, progress: e.target.value })}
            />
            <Input
              label="Target Date"
              type="date"
              value={form.targetDate}
              onChange={e => setForm({ ...form, targetDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Color</label>
            <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
          </div>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save Changes' : 'Create Dream'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
