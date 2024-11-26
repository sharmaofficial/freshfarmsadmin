// // App.js
// import React from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { Layout } from 'antd';
// import AppRoutes from './routes';

// const { Layout: AntLayout } = Layout;

// const App = () => {
//   return (
//     <Router>
//       <Layout>
//         <AppRoutes />
//       </Layout>
//     </Router>
//   );
// };

// export default App;

// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Navigate, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/User';
import Category from './pages/category';
import Order from './pages/order';
import Product from './pages/product';
import Package from './pages/package';
import InventoryLog from './pages/InventoryLog';
import useLocalStorage from './utils/localStorageHook';
import { ChakraProvider } from '@chakra-ui/react';
import AddStock from './pages/AddStock';
import AppRoutes from './routes/routes';

const App = () => {
  
  return (
    <div>
    <AppRoutes />
    </div>
    // <ChakraProvider>
    //   <Router>
    //     <div>
    //       <Routes>
    //         <Route path='/' element={<Login />} />
    //         <Route path="/home" element={<Home />} />
    //         <Route path="/Category" element={<Category />} />
    //         <Route path="/Order" element={<Order />} />
    //         <Route path="/Product" element={<Product />} />
    //         <Route path="/Package" element={<Package />} />
    //         <Route path="/inventoryLog" element={<InventoryLog />} />
    //         <Route path="/AddStock" element={<AddStock />} />
    //       </Routes>
    //     </div>
    //   </Router>
    // </ChakraProvider>
  );
};

export default App;

