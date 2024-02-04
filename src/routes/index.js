// routes.js
import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainContent from './MainContent';
import Login from '../pages/login';
import { useDispatch, useSelector } from 'react-redux';
import useLocalStorage from '../utils/localStorageHook';
import Users from '../pages/user';

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
      <Route path="/users" element={<Users />} />
      <Route path="/products" element={<div>Products Page</div>} />
      <Route path="/categories" element={<div>Categories Page</div>} />
    </Routes>
  );
};

const AppRoutes = () => {
  const {isAuthenticated, user} = useSelector((state) => state.auth);
  const {data, deleteData, saveData, retrieveData} = useLocalStorage('user');
  const dispatch = useDispatch();

  useEffect(() => {
    if(!isAuthenticated){
      if(data){
        dispatch({type: 'LOGIN', payload: data});
      }
    }
  },[])

  return (
    <Routes>
      {/* {
        isAuthenticated?
          <Route
            path="/*"
            element={
              <MainContent>
                <MainRoutes />
              </MainContent>
            }
          />
      :

        <Route path="/auth/*" element={<AuthRoutes />} />
      } */}
      <Route path="/*" element={              <MainContent>
                <MainRoutes />
              </MainContent>} />
    </Routes>
  );
};

export default AppRoutes;
