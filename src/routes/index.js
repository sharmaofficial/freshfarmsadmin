// routes.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainContent from './MainContent';
import Login from '../pages/login';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={<Navigate to="/login" />}
      />
    </Routes>
  );
};

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/users" element={<div>Users Page</div>} />
      <Route path="/products" element={<div>Products Page</div>} />
      <Route path="/categories" element={<div>Categories Page</div>} />
    </Routes>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route
        path="/*"
        element={
          <MainContent>
            <MainRoutes />
          </MainContent>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
