import { useState, useEffect } from 'react';
import { goalService } from '../services/goalService';
import toast from 'react-hot-toast';

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await goalService.getAll();
      setGoals(res.data.data);
    } catch (err) {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const addGoal = async (data) => {
    const res = await goalService.create(data);
    const created = res.data.data;
    setGoals(prev => [created, ...prev]);
    toast.success('Goal created!');
    return created;
  };

  const updateGoal = async (id, data) => {
    const res = await goalService.update(id, data);
    setGoals(prev => prev.map(g => g._id === id ? res.data.data : g));
    toast.success('Goal updated!');
  };

  const removeGoal = async (id) => {
    await goalService.delete(id);
    setGoals(prev => prev.filter(g => g._id !== id));
    toast.success('Goal removed');
  };

  return { goals, loading, addGoal, updateGoal, removeGoal, refetch: fetchGoals };
};
