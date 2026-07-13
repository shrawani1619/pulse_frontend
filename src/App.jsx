import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TodayPage from './pages/TodayPage';
import DreamsPage from './pages/DreamsPage';
import GoalsPage from './pages/GoalsPage';
import MilestonesPage from './pages/MilestonesPage';
import ActionsPage from './pages/ActionsPage';
import DreamTimePage from './pages/DreamTimePage';
import FocusPage from './pages/FocusPage';
import AchievementsPage from './pages/AchievementsPage';
import InsightsPage from './pages/InsightsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="today" element={<TodayPage />} />
        <Route path="dreams" element={<DreamsPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="milestones" element={<MilestonesPage />} />
        <Route path="actions" element={<ActionsPage />} />
        <Route path="dream-time" element={<DreamTimePage />} />
        <Route path="focus" element={<FocusPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
