import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({collapsed, toggleCollapsed}) => {
  return (
    <Sider collapsible collapsed={collapsed}>
    <div className="logo" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
      Admin
    </div>
    <Menu theme="dark" mode="inline">
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/dashboard/users">Users</Link> {/* Correct link to /dashboard/users */}
        </Menu.Item>
        <Menu.Item key="3" icon={<SettingOutlined />}>
          <Link to="/dashboard/settings">Settings</Link> {/* Correct link to /dashboard/settings */}
        </Menu.Item>
      </Menu>
  </Sider>
  );
};

export default Sidebar;
