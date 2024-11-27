import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Layout, Menu, Popconfirm } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  NotificationOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
  ShopOutlined,
  PercentageOutlined,
  ProductOutlined,
  TruckOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed, toggleCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current route

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Match the current route with Menu keys
  const getSelectedKey = () => {
    if (location.pathname.startsWith('/dashboard/products')) return '4';
    if (location.pathname.startsWith('/dashboard/users')) return '2';
    if (location.pathname.startsWith('/dashboard/settings')) return '3';
    if (location.pathname.startsWith('/dashboard/categories')) return '6';
    if (location.pathname.startsWith('/dashboard/inventoryLog')) return '8';
    if (location.pathname.startsWith('/dashboard/inventory')) return '9';
    if (location.pathname.startsWith('/dashboard/orders')) return '10';
    if (location.pathname.startsWith('/dashboard/packages')) return '12';
    if (location.pathname.startsWith('/dashboard/notifyUsers')) return '13';
    return '1'; // Default to dashboard key
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div
        className="logo"
        style={{ color: 'white', padding: '20px', textAlign: 'center' }}
      >
        Admin
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={[getSelectedKey()]}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/dashboard/users">Users</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<SettingOutlined />}>
          <Link to="/dashboard/settings">Settings</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<ProductOutlined />}>
          <Link to="/dashboard/products">Product</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<AppstoreAddOutlined />}>
          <Link to="/dashboard/categories">Categories</Link>
        </Menu.Item>
        <Menu.Item key="8" icon={<ShopOutlined />}>
          <Link to="/dashboard/inventoryLog">Inventory Log</Link>
        </Menu.Item>
        <Menu.Item key="9" icon={<ShopOutlined />}>
          <Link to="/dashboard/inventory">Inventory</Link>
        </Menu.Item>
        <Menu.Item key="10" icon={<TruckOutlined />}>
          <Link to="/dashboard/orders">Orders</Link>
        </Menu.Item>
        <Menu.Item key="12" icon={<PercentageOutlined />}>
          <Link to="/dashboard/packages">Packages</Link>
        </Menu.Item>
        <Menu.Item key="13" icon={<NotificationOutlined />}>
          <Link to="/dashboard/notifyUsers">Notify Users</Link>
        </Menu.Item>
        <Menu.Item
          key="logout"
          icon={<LogoutOutlined />}
          style={{ backgroundColor: '#ff4d4f' }}
        >
          <Popconfirm
            title="Are you sure you want to logout?"
            onConfirm={handleLogout}
            okText="Yes"
            cancelText="No"
          >
            <div>Logout</div>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
