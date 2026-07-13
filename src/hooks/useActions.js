import { useState, useEffect } from 'react';
import { actionService } from '../services/actionService';
import toast from 'react-hot-toast';

export const useActions = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActions = async () => {
    try {
      setLoading(true);
      const res = await actionService.getAll();
      setActions(res.data.data);
    } catch (err) {
      toast.error('Failed to load actions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActions(); }, []);

  const addAction = async (data) => {
    const res = await actionService.create(data);
    const created = res.data.data;
    setActions(prev => [created, ...prev]);
    toast.success('Action created!');
    return created;
  };

  const updateAction = async (id, data) => {
    const res = await actionService.update(id, data);
    setActions(prev => prev.map(a => a._id === id ? res.data.data : a));
    toast.success('Action updated!');
    return res.data.data;
  };

  const removeAction = async (id) => {
    await actionService.delete(id);
    setActions(prev => prev.filter(a => a._id !== id));
    toast.success('Action removed');
  };

  return { actions, loading, addAction, updateAction, removeAction, refetch: fetchActions };
};
