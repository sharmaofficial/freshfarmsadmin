import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, Outlet } from 'react-router-dom'; // Import Link for navigation and Outlet for rendering child routes
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Sidebar from '../components/Sidebar';

const { Header, Sider, Content, Footer } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Side Drawer (Sider) */}
      <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed}/>

      {/* Main Layout */}
      <Layout className="site-layout">
        {/* Header */}
        <Header className="site-layout-background" style={{ padding: '0 20px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{ fontSize: '16px' }}
          />
          {/* You can add user information or logout button here */}
          <div>
            <span>Welcome, Admin</span>
            {/* Add logout button if needed */}
          </div>
        </Header>

        {/* Content */}
        <Content style={{ margin: '16px', padding: '24px', background: '#fff', minHeight: 280 }}>
          <Outlet /> {/* This renders the selected page content */}
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center' }}>
          E-Commerce Admin Dashboard ©2024 Created by YourCompany
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;