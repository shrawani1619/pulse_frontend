import React, { useEffect, useState } from 'react';
import { getAdminDreams } from '../../services/adminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import toast from 'react-hot-toast';

export default function AdminDreams() {
  const [dreams, setDreams] = useState([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAdminDreams({ status: status || undefined, page, limit: 15 })
      .then((res) => {
        setDreams(res.data.dreams);
        setPagination(res.data.pagination);
      })
      .catch(() => toast.error('Failed to load dreams'))
      .finally(() => setLoading(false));
  }, [status, page]);

  return (
    <div className="page admin-page">
      <div className="page__header">
        <h1 className="page__title" style={{ marginBottom: 0 }}>Dreams Overview</h1>
        <select
          className="form-input"
          style={{ width: 'auto' }}
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <div className="cards-grid">
            {dreams.length === 0 && <Card><p className="card-meta">No dreams found</p></Card>}
            {dreams.map((d) => (
              <Card key={d._id} className="dream-full-card" style={{ padding: '1.25rem' }}>
                <div className="page__header" style={{ marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0 }}>{d.title}</h3>
                  <span className="badge badge--active" style={{ background: d.color || '#6366f1', color: '#fff' }}>
                    {d.category}
                  </span>
                </div>
                <p className="card-meta">
                  {d.user?.name || 'Unknown'} · {d.user?.email || '—'} · {d.status}
                </p>
                <div style={{ marginTop: '0.75rem' }}>
                  <ProgressBar value={d.progress || 0} />
                </div>
              </Card>
            ))}
          </div>

          <div className="admin-pagination">
            <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </Button>
            <span>Page {pagination.page} of {pagination.pages} ({pagination.total} dreams)</span>
            <Button
              size="sm"
              variant="secondary"
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
