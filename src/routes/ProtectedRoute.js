import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils';

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;