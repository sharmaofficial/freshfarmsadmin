import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '100px' }}>
    <h1>404 - Not Found!</h1>
    <Link to="/">
      <Button type="primary">Go Home</Button>
    </Link>
  </div>
);

export default NotFound;
