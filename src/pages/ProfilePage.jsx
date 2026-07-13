import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

export default function ProfilePage() {
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
    <div className="page">
      <h2 className="page__title">Profile</h2>
      <Card style={{ maxWidth: 420 }}>
        <div className="profile-avatar">{(name || user?.name)?.[0]?.toUpperCase()}</div>
        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Input
            label="Email"
            value={user?.email || ''}
            disabled
          />
          <p className="form-hint">Email cannot be changed in this version.</p>
          <Button type="submit" loading={saving} style={{ width: '100%', marginTop: '0.5rem' }}>
            Save Profile
          </Button>
        </form>
      </Card>
    </div>
  );
}
