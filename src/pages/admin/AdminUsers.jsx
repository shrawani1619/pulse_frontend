import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiEye, FiSlash, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import {
  banUser,
  deleteUser,
  getAdminUsers,
  unbanUser
} from '../../services/adminService';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fromUrl = searchParams.get('status') || 'all';
    setStatus(fromUrl);
    setPage(1);
  }, [searchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ search, status, page, limit: 15 });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const onStatusChange = (value) => {
    setStatus(value);
    setPage(1);
    if (value === 'all') setSearchParams({});
    else setSearchParams({ status: value });
  };

  const onBan = async (id) => {
    try {
      await banUser(id);
      toast.success('User banned');
      load();
    } catch {
      toast.error('Ban failed');
    }
  };

  const onUnban = async (id) => {
    try {
      await unbanUser(id);
      toast.success('User unbanned');
      load();
    } catch {
      toast.error('Unban failed');
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Permanently delete this user and all their data?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="page admin-page">
      <div className="page__header">
        <h1 className="page__title" style={{ marginBottom: 0 }}>User Management</h1>
      </div>

      <div className="admin-toolbar">
        <Input
          label="Search"
          placeholder="Name or email"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-input"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <Card className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Dreams</th>
                <th>Goals</th>
                <th>Actions</th>
                <th>Status</th>
                <th>Joined</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty">No users found</td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="admin-user-cell">
                      <span className="header__avatar">{u.name?.[0]?.toUpperCase() || '?'}</span>
                      <div>
                        <strong>{u.name}</strong>
                        <div className="card-meta">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.dreamCount}</td>
                  <td>{u.goalCount}</td>
                  <td>{u.actionCount}</td>
                  <td><span className={`badge badge--${u.status}`}>{u.status}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="admin-icon-btn"
                        title="View"
                        aria-label="View"
                        onClick={() => navigate(`/admin/users/${u._id}`)}
                      >
                        <FiEye />
                      </button>
                      {u.status === 'banned' ? (
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--success"
                          title="Unban"
                          aria-label="Unban"
                          onClick={() => onUnban(u._id)}
                        >
                          <FiCheckCircle />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--warn"
                          title="Ban"
                          aria-label="Ban"
                          onClick={() => onBan(u._id)}
                        >
                          <FiSlash />
                        </button>
                      )}
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--danger"
                        title="Delete"
                        aria-label="Delete"
                        onClick={() => onDelete(u._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="admin-pagination">
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>Page {pagination.page} of {pagination.pages} ({pagination.total} users)</span>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
