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
import AddProduct from '../pages/Add Product';
import Product from '../pages/product';
import Products from '../pages/Products';
import InventoryLog from '../pages/InventoryLog';
import Order from '../pages/order';
import Category from '../pages/category';
import Package from '../pages/package';
import Categories from '../pages/Categories';
import Orders from '../pages/Orders';
import Packages from '../pages/Packages';

const AppRoutes = () => {
  console.log("isAuthenticated()", isAuthenticated());
  return (
    <MessageProvider style={{backgroundColor:'red'}}>
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
            <Route path="products" element={<Products />} />
            {/* <Route path="productsOld" element={<Product />} /> */}
            <Route path="categories" element={<Categories />} />
            {/* <Route path="categoriesold" element={<Category />} /> */}
            <Route path="inventory" element={<InventoryLog />} />
            {/* <Route path="inventoryold" element={<InventoryLog/>} /> */}
            <Route path="orders" element={<Orders/>} />
            {/* <Route path="ordersold" element={<Order/>} /> */}
            <Route path="packages" element={<Packages/>} />
            {/* <Route path="packagesold" element={<Package/>} /> */}
          </Route>

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </MessageProvider>
  );
};

export default AppRoutes;
