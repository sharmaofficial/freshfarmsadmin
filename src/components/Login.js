import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, Card } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css';
import { postApiCall } from '../utils';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../utils/MessageProvider';

const { Title, Text } = Typography;

const Login = () => {
  const [email, setEmail] = useState('sharma.official12@gmail.com');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [tempLoginData, setTempLoginData] = useState(null);
  const messageApi = useMessage();

  const navigate = useNavigate(); 

  const handleSendOtp = async () => {
    setLoading(true);
    try {
        const response = await postApiCall('loginWithAppWrite', { email });
        const {status, message, data} = response.data;
        if (status) {
            messageApi.success(message);
            setTempLoginData(data);
            setIsOtpSent(true);
        } else {
          messageApi.error(message);
        }
        } catch (error) {
            console.log("error", error);
            messageApi.error('Error occurred while sending OTP');
        } finally {
          setLoading(false);
        }
    };

  const handleLogin = async () => { 
    setLoading(true);
    try {
      const response = await postApiCall('verifyOtpWithAppWrite', { otp: otp, userId: tempLoginData.userId });
      const {status, message, data} = response.data;
      if (status) {
        messageApi.success(message);
        const { token } = data;
        const encryptedToken = CryptoJS.AES.encrypt(token, 'freshfarms').toString();
        localStorage.setItem('authToken', encryptedToken);
        // Optionally store user data (encrypted if necessary)
        localStorage.setItem('userData', JSON.stringify(data));

        messageApi.success('Login successful! Redirecting to dashboard...');
        
        // Navigate to the dashboard on success
        navigate('/dashboard');
      } else {
        messageApi.error(message);
      }
    } catch (error) {
      messageApi.error('Error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="login-container" align="middle">
      <Col xs={24} sm={16} md={12} lg={8} xl={6} offset={2}>
        <Card className="login-card" bordered={false}>
          <Title level={2} className="login-title">Admin Login</Title>
          <Text type="secondary" className="login-subtitle">Enter your email to receive an OTP</Text>
          <Form className="login-form" layout="vertical">
            <Form.Item label="Email" required>
              <Input
                prefix={<MailOutlined />}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isOtpSent}
                className="login-input"
                rules={[{ required: true, message: 'Please enter your email' }]}
              />
            </Form.Item>

            {isOtpSent && (
              <Form.Item label="OTP" required>
                <Input
                  prefix={<LockOutlined />}
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP"
                  className="login-input"
                  rules={[
                    { required: true, message: 'Please enter the OTP sent to your email' },
                    { pattern: /^\d{6}$/, message: 'OTP must be exactly 6 digits' }, // 6-digit OTP validation rule
                  ]}
                />
              </Form.Item>
            )}

            {!isOtpSent ? (
              <Button
                type="primary"
                block
                onClick={handleSendOtp}
                className="login-button"
                loading={loading}
              >
                Send OTP
              </Button>
            ) : (
              <Button
                type="primary"
                block
                onClick={handleLogin}
                className="login-button"
                loading={loading}
              >
                Login
              </Button>
            )}
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
