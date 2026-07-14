import React, { useEffect, useState } from 'react';
import { getAdminLogs } from '../../services/adminService';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

export default function AdminLogs() {
  const [logs, setLogs] = useState({ signups: [], dreams: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminLogs({ limit: 25 })
      .then((res) => setLogs(res.data.logs))
      .catch(() => toast.error('Failed to load logs'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="page admin-page">
      <h1 className="page__title">System Logs</h1>

      <div className="admin-logs-grid">
        <Card>
          <h2 className="admin-section-title">Recent signups</h2>
          <ul className="admin-list">
            {logs.signups.length === 0 && <li className="card-meta">No recent signups</li>}
            {logs.signups.map((item, i) => (
              <li key={`${item.user.email}-${i}`}>
                <strong>{item.user.name}</strong> · {item.user.email}
                <div className="card-meta">{new Date(item.timestamp).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="admin-section-title">Recent dreams created</h2>
          <ul className="admin-list">
            {logs.dreams.length === 0 && <li className="card-meta">No recent dreams</li>}
            {logs.dreams.map((item, i) => (
              <li key={`${item.title}-${i}`}>
                <strong>{item.title}</strong> · {item.category} · {item.status}
                <div className="card-meta">
                  {item.user?.name || 'Unknown'} · {new Date(item.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
