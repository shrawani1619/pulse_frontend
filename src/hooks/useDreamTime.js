import { useState, useEffect } from 'react';
import { dreamTimeService } from '../services/dreamTimeService';
import toast from 'react-hot-toast';

export const useDreamTime = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const res = await dreamTimeService.getAll();
      setBlocks(res.data.data);
    } catch (err) {
      toast.error('Failed to load Dream Time');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlocks(); }, []);

  const addBlock = async (data) => {
    const res = await dreamTimeService.create(data);
    setBlocks(prev => [...prev, res.data.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
    toast.success('Dream Time blocked!');
    return res.data.data;
  };

  const updateBlock = async (id, data) => {
    const res = await dreamTimeService.update(id, data);
    setBlocks(prev => prev.map(b => b._id === id ? res.data.data : b));
    toast.success('Dream Time updated!');
  };

  const removeBlock = async (id) => {
    await dreamTimeService.delete(id);
    setBlocks(prev => prev.filter(b => b._id !== id));
    toast.success('Dream Time removed');
  };

  return { blocks, loading, addBlock, updateBlock, removeBlock, refetch: fetchBlocks };
};
