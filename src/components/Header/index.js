// src/components/Header.js
import React from 'react';
import { Button } from 'antd';

const Header = ({ onDrawerOpen, logout }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '16px', backgroundColor: '#2ecc72' }}>
      <Button type="primary" onClick={onDrawerOpen}>
        Open Menu
      </Button><Button type="primary" onClick={logout}>
        Logout
      </Button>
      <h2 style={{marginLeft: 10}}>Fresh Farms</h2>
    </div>
  );
};

export default Header;
