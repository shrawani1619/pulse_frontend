import { useState, useEffect } from 'react';
import { milestoneService } from '../services/milestoneService';
import toast from 'react-hot-toast';

export const useMilestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const res = await milestoneService.getAll();
      setMilestones(res.data.data);
    } catch (err) {
      toast.error('Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMilestones(); }, []);

  const addMilestone = async (data) => {
    const res = await milestoneService.create(data);
    const created = res.data.data;
    setMilestones(prev => [...prev, created]);
    toast.success('Milestone created!');
    return created;
  };

  const updateMilestone = async (id, data) => {
    const res = await milestoneService.update(id, data);
    setMilestones(prev => prev.map(m => m._id === id ? res.data.data : m));
    toast.success('Milestone updated!');
  };

  const removeMilestone = async (id) => {
    await milestoneService.delete(id);
    setMilestones(prev => prev.filter(m => m._id !== id));
    toast.success('Milestone removed');
  };

  return { milestones, loading, addMilestone, updateMilestone, removeMilestone, refetch: fetchMilestones };
};
