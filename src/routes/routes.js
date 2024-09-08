import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import { isAuthenticated } from '../utils';
import ProtectedRoute from './ProtectedRoute';
import { MessageProvider } from '../utils/MessageProvider';
import User from '../pages/User';
import Settings from '../pages/Settings';

const AppRoutes = () => {
  return (
    <MessageProvider>
      <Router>
        <Routes>
          {/* Redirect "/" based on authentication */}
          <Route
            path="/"
            element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />

          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          >
            {/* Nested routes inside dashboard (Note: No leading '/' in nested paths) */}
            <Route path="users" element={<User />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </MessageProvider>
  );
};

export default AppRoutes;
