import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Layout, Menu, Popconfirm } from 'antd';
import { DashboardOutlined, UserOutlined, SettingOutlined,NotificationOutlined,LogoutOutlined, ProductOutlined,TruckOutlined , AppstoreAddOutlined, ShopOutlined, PercentageOutlined} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({collapsed, toggleCollapsed}) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} >
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
        <Menu.Item key="4" icon={<ProductOutlined />}>
          <Link to="/dashboard/products">Product</Link> {/* Correct link to /dashboard/settings */}
        </Menu.Item>
        {/* <Menu.Item key="5" icon={<SettingOutlined />}> */}
          {/* <Link to="/dashboard/productsOld">ProductOld</Link> */}
        {/* </Menu.Item> */}
        <Menu.Item key="6" icon={<AppstoreAddOutlined />}>
          <Link to="/dashboard/categories">Categories</Link>
        </Menu.Item>
        {/* <Menu.Item key="7" icon={<SettingOutlined />}>
          <Link to="/dashboard/categoriesold">Categories Old</Link> 
        </Menu.Item> */}
        <Menu.Item key="8" icon={<ShopOutlined />}>
          <Link to="/dashboard/inventoryLog">Inventory Log</Link>
        </Menu.Item>

        <Menu.Item key="9" icon={<ShopOutlined />}>
          <Link to="/dashboard/inventory">Inventory</Link>
        </Menu.Item>
        {/* <Menu.Item key="9" icon={<SettingOutlined />}>
          <Link to="/dashboard/inventoryold">Inventory Log old</Link>
        </Menu.Item> */}
        <Menu.Item key="10" icon={<TruckOutlined />}>
          <Link to="/dashboard/orders">Orders</Link> {/* Correct link to /dashboard/settings */}
        </Menu.Item>
        {/* <Menu.Item key="11" icon={<SettingOutlined />}>
          <Link to="/dashboard/ordersold">OrdersOld</Link>
        </Menu.Item> */}
        <Menu.Item key="12" icon={<PercentageOutlined />}>
          <Link to="/dashboard/packages">Packages</Link> {/* Correct link to /dashboard/settings */}
        </Menu.Item>
        <Menu.Item key="13" icon={<NotificationOutlined />}>
          <Link to="/dashboard/notifyUsers">Notify Users</Link> {/* Correct link to /dashboard/settings */}
        </Menu.Item>
        {/* <Menu.Item key="13" icon={<SettingOutlined />}>
          <Link to="/dashboard/packagesold">Packages Old</Link>
        </Menu.Item> */}
        <Menu.Item
          key="logout"
          icon={<LogoutOutlined />}
          style={{backgroundColor:'#ff4d4f'}}
        >
          <Popconfirm
            title="Are you sure you want to logout?"
            onConfirm={handleLogout}
            okText="Yes"
            cancelText="No"
          >
            {/* <Button icon={<LogoutOutlined />}  title='Logout'>Logout</Button> */}
            <div>Logout</div>
          </Popconfirm>
        </Menu.Item>
      </Menu>
  </Sider>
  );
};

export default Sidebar;
