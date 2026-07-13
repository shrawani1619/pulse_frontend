import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import { useDreamTime } from '../hooks/useDreamTime';
import { useDreams } from '../hooks/useDreams';

const emptyForm = {
  dream: '',
  title: 'Dream Time',
  date: new Date().toISOString().slice(0, 10),
  startTime: '09:00',
  endTime: '10:00',
  notes: '',
  status: 'planned',
};

export default function DreamTimePage() {
  const { blocks, loading, addBlock, updateBlock, removeBlock } = useDreamTime();
  const { dreams, loading: dreamsLoading } = useDreams();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const canCreate = dreams.length > 0;

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      dream: dreams[0]?._id || '',
      date: new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const openEdit = (block) => {
    setEditing(block);
    setForm({
      dream: block.dream?._id || block.dream || '',
      title: block.title || 'Dream Time',
      date: block.date ? String(block.date).slice(0, 10) : '',
      startTime: block.startTime || '09:00',
      endTime: block.endTime || '10:00',
      notes: block.notes || '',
      status: block.status || 'planned',
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
        dream: form.dream,
        title: form.title || 'Dream Time',
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        notes: form.notes,
        status: form.status,
      };
      if (editing) await updateBlock(editing._id, payload);
      else await addBlock(payload);
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Dream Time</h2>
        <Button onClick={openCreate} disabled={!canCreate}>+ Block Time</Button>
      </div>
      <p className="page__subtitle">Protected time reserved only for dream-aligned work.</p>

      {!dreamsLoading && !canCreate && (
        <Card className="empty-state">
          <p>Create a dream first, then block intentional time for it.</p>
        </Card>
      )}

      {loading ? <p>Loading...</p> : (
        <div className="cards-grid">
          {blocks.length === 0 && canCreate ? (
            <Card className="empty-state">
              <p>No Dream Time blocks yet. Schedule protected focus windows for your dreams.</p>
              <Button onClick={openCreate} style={{ marginTop: '1rem' }}>Block Time</Button>
            </Card>
          ) : (
            blocks.map(block => (
              <Card key={block._id} className="dreamtime-card">
                <div
                  className="dreamtime-card__color-bar"
                  style={{ background: block.dream?.color || 'var(--primary)' }}
                />
                <div className="dreamtime-card__body">
                  {block.dream?.title && (
                    <span className="dreamtime-card__dream" style={{ color: block.dream?.color }}>
                      {block.dream.title}
                    </span>
                  )}
                  <h3>{block.title || 'Dream Time'}</h3>
                  <p className="dreamtime-card__when">
                    {new Date(block.date).toLocaleDateString()} · {block.startTime} – {block.endTime}
                  </p>
                  {block.notes && <p>{block.notes}</p>}
                  <div className="dreamtime-card__footer">
                    <span className={`badge badge--${block.status === 'planned' ? 'active' : block.status === 'completed' ? 'completed' : 'paused'}`}>
                      {block.status}
                    </span>
                    {block.status === 'planned' && (
                      <Button size="sm" variant="secondary" onClick={() => updateBlock(block._id, { status: 'completed' })}>
                        Mark done
                      </Button>
                    )}
                    <button className="btn-icon" title="Edit" onClick={() => openEdit(block)}>✏️</button>
                    <button className="btn-icon" title="Delete" onClick={() => removeBlock(block._id)}>🗑</button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editing ? 'Edit Dream Time' : 'Add Dream Time'}>
        <form onSubmit={handleSubmit}>
          <Select
            label="Dream *"
            value={form.dream}
            onChange={e => setForm({ ...form, dream: e.target.value })}
            required
          >
            <option value="">Select a dream</option>
            {dreams.map(d => (
              <option key={d._id} value={d._id}>{d.title}</option>
            ))}
          </Select>
          <Input
            label="Label"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Morning writing block"
          />
          <Input
            label="Date *"
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            required
          />
          <div className="form-row">
            <Input
              label="Start *"
              type="time"
              value={form.startTime}
              onChange={e => setForm({ ...form, startTime: e.target.value })}
              required
            />
            <Input
              label="End *"
              type="time"
              value={form.endTime}
              onChange={e => setForm({ ...form, endTime: e.target.value })}
              required
            />
          </div>
          <Select
            label="Status"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            {['planned', 'completed', 'missed'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Textarea
            label="Notes"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="What will you work on in this block?"
          />
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save Changes' : 'Save Block'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
