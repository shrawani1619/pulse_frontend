import { useState, useEffect } from 'react';
import { dreamService } from '../services/dreamService';
import toast from 'react-hot-toast';

export const useDreams = () => {
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDreams = async () => {
    try {
      setLoading(true);
      const res = await dreamService.getAll();
      setDreams(res.data.data);
    } catch (err) {
      toast.error('Failed to load dreams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDreams(); }, []);

  const addDream = async (data) => {
    const res = await dreamService.create(data);
    setDreams(prev => [res.data.data, ...prev]);
    toast.success('Dream created!');
    return res.data.data;
  };

  const updateDream = async (id, data) => {
    const res = await dreamService.update(id, data);
    setDreams(prev => prev.map(d => d._id === id ? res.data.data : d));
    toast.success('Dream updated!');
  };

  const removeDream = async (id) => {
    await dreamService.delete(id);
    setDreams(prev => prev.filter(d => d._id !== id));
    toast.success('Dream removed');
  };

  return { dreams, loading, addDream, updateDream, removeDream, refetch: fetchDreams };
};
