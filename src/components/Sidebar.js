import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Layout, Menu, Popconfirm } from 'antd';
import { DashboardOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({collapsed, toggleCollapsed}) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };
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
        <Menu.Item
          key="logout"
        >
          <Popconfirm
            title="Are you sure you want to logout?"
            onConfirm={handleLogout}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<LogoutOutlined />}  title='Logout'>Logout</Button>
          </Popconfirm>
        </Menu.Item>
      </Menu>
  </Sider>
  );
};

export default Sidebar;
