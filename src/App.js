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
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Navigate, Routes } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/user';

const App = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

