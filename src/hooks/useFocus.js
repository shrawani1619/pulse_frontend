import { useState, useEffect, useRef } from 'react';
import { focusService } from '../services/focusService';
import toast from 'react-hot-toast';

export const useFocus = () => {
  const [active, setActive] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const tickRef = useRef(null);

  const clearTick = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const startTick = (startedAt) => {
    clearTick();
    const startMs = new Date(startedAt).getTime();
    setElapsed(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
    tickRef.current = setInterval(() => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
    }, 1000);
  };

  const load = async () => {
    try {
      setLoading(true);
      const [activeRes, listRes] = await Promise.all([
        focusService.getActive(),
        focusService.getAll({ status: 'completed' }),
      ]);
      const current = activeRes.data.data;
      setActive(current);
      setSessions(listRes.data.data || []);
      if (current?.startedAt) startTick(current.startedAt);
      else {
        clearTick();
        setElapsed(0);
      }
    } catch (err) {
      toast.error('Failed to load focus sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    return clearTick;
  }, []);

  const startSession = async (data) => {
    const res = await focusService.start(data);
    setActive(res.data.data);
    startTick(res.data.data.startedAt);
    toast.success('Focus session started');
    return res.data.data;
  };

  const completeSession = async () => {
    if (!active) return;
    const res = await focusService.complete(active._id, { elapsedSeconds: elapsed });
    clearTick();
    setActive(null);
    setElapsed(0);
    setSessions(prev => [res.data.data, ...prev]);
    toast.success('Focus session completed!');
    return res.data.data;
  };

  const cancelSession = async () => {
    if (!active) return;
    await focusService.cancel(active._id, { elapsedSeconds: elapsed });
    clearTick();
    setActive(null);
    setElapsed(0);
    toast.success('Focus session cancelled');
  };

  return {
    active,
    sessions,
    elapsed,
    loading,
    startSession,
    completeSession,
    cancelSession,
    refetch: load,
  };
};
