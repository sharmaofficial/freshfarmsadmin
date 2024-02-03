// MainContent.js
// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link, Navigate } from 'react-router-dom';

// const MainContent = ({ children }) => {
//     const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//     const user = useSelector((state) => state.auth.user);
//     const dispatch = useDispatch();
  
//     const handleLogout = () => {
//       dispatch({type: 'LOGOUT'});
//     };
  
//     if (!isAuthenticated) {
//       return <Navigate to="/auth/login" />;
//     }
//   return (
//     <div>
//       <h2>Welcome, {user?.username}!</h2>
//       <nav>
//         <ul>
//           <li>
//             <Link to="/main/users">Users</Link>
//           </li>
//           <li>
//             <Link to="/main/products">Products</Link>
//           </li>
//           <li>
//             <Link to="/main/categories">Categories</Link>
//           </li>
//           {/* Add more main route links as needed */}
//         </ul>
//       </nav>
//       {children}
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// };

// export default MainContent;

// MainContent.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Layout, Menu, Drawer } from 'antd';
import useLocalStorageCrud from '../utils/localStorageHook';
import useLocalStorage from '../utils/localStorageHook';

const { Content, Sider } = Layout;

const MainContent = ({ children }) => {
  const {isAuthenticated, user} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const {data, deleteData, saveData, retrieveData} = useLocalStorage('user');
  console.log("isAuthenticated", isAuthenticated);
  console.log("data", data);

  useEffect(() => {
    if(!isAuthenticated){
      if(data){
        dispatch({type: 'LOGIN', payload: data});
      }
    }
  },[])

  const handleLogout = () => {
    dispatch({type: 'LOGOUT'});
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={80} theme="dark" breakpoint="lg" collapsedWidth="0">
        <button onClick={toggleDrawer}>Toggle Drawer</button>
        <button onClick={toggleDrawer}>Users</button>
        <button onClick={toggleDrawer}>Products</button>
        <button onClick={toggleDrawer}>Categories</button>
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', minHeight: 280 }}>
          <div>
            <h2>Welcome, {user?.username}!</h2>
            {children}
            <button onClick={handleLogout}>Logout</button>
          </div>
        </Content>
      </Layout>
      <Drawer
        title="Main Routes"
        placement="left"
        closable={false}
        onClose={toggleDrawer}
        open={drawerVisible}
        width={200}
      >
        <Menu mode="vertical" defaultSelectedKeys={['users']}>
          <Menu.Item key="users">
            <Link to="/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="products">
            <Link to="/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="categories">
            <Link to="/categories">Categories</Link>
          </Menu.Item>
          {/* Add more main route links as needed */}
        </Menu>
      </Drawer>
    </Layout>
  );
};

export default MainContent;

