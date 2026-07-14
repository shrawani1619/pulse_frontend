import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

export default function AdminProfile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page admin-page">
      <h1 className="page__title">Admin Profile</h1>

      <div className="admin-logs-grid">
        <Card style={{ maxWidth: 480 }}>
          <div className="profile-avatar">{(name || user?.name)?.[0]?.toUpperCase()}</div>
          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input label="Email" value={user?.email || ''} disabled />
            <p className="form-hint">Email cannot be changed in this version.</p>
            <Button type="submit" loading={saving} style={{ width: '100%', marginTop: '0.5rem' }}>
              Save Profile
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="admin-section-title">Account info</h2>
          <div className="admin-detail-grid">
            <div>
              <span className="card-meta">Role</span>
              <div><span className="badge badge--active">{user?.role || 'admin'}</span></div>
            </div>
            <div>
              <span className="card-meta">Status</span>
              <div>{user?.isActive === false ? 'Inactive' : 'Active'}</div>
            </div>
            <div>
              <span className="card-meta">User ID</span>
              <div style={{ wordBreak: 'break-all' }}>{user?._id || '—'}</div>
            </div>
            <div>
              <span className="card-meta">Last login</span>
              <div>{user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '—'}</div>
            </div>
            <div>
              <span className="card-meta">Registered</span>
              <div>{user?.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}</div>
            </div>
            <div>
              <span className="card-meta">Updated</span>
              <div>{user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : '—'}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
