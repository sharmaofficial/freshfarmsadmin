import React, { useState } from 'react';
import { Layout, Menu, Button, Card } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom'; // Import Link for navigation and Outlet for rendering child routes
// import image from '../assets/images/farmImage1.webp'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Sidebar from '../components/Sidebar';
import Graph from './Graphs';

const { Header, Sider, Content, Footer } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Side Drawer (Sider) */}
      <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed}/>

      {/* Main Layout */} 
      <Layout className="site-layout" style={{width:'auto'}}>
        {/* Header */}
        <Header className="site-layout-background" style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/farmImage1.webp)`,
                        backgroundPosition: 'center',
                        height: '90px',  // Increased height to better display the image,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        color: '#2f4d39',
                        textAlign: 'center', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{ fontSize: '16px' }}
          />
          <div>
            <h1>Tiger Hills Agro</h1>
          </div>
          {/* You can add user information or logout button here */}
          <div>
            <span>Welcome, Admin</span>
            {/* Add logout button if needed */}
          </div>
        </Header>

        {/* Content */}
        <Content style={{minWidth:'24cm' ,margin: '16px', padding: '24px', background: '#fff', minHeight: 280 }}>
          <Outlet /> {/* This renders the selected page content */}
          {/* {location.pathname == '/dashboard' && <Graph/>} */}
          {/* <Graph/> */}
        </Content>  

        {/* Footer */}
        <Footer style={{ textAlign: 'center' }}>
          {/* E-Commerce Admin Dashboard ©2024 Created by YourCompany */}
          Tiger Hills Agro©2024 
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
