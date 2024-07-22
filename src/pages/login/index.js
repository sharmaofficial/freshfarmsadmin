import { Button, Card, Input, message } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useLocalStorage from '../../utils/localStorageHook';
import { unstable_HistoryRouter, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { encryptToken, postApiCall } from '../../utils';

function Login() {
    const {isAuthenticated, user} = useSelector((state) => state.auth);
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tempLoginData, setTempLoginData] = useState(null);
    const dispatch = useDispatch();
    const {userData, deleteData, saveData} = useLocalStorage('user');
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    
    useEffect(() => {
        if(!isAuthenticated){
            if(userData){
                dispatch({type: 'LOGIN', payload: userData});
            }
        }
    },[])

    function handleChangeEmail(event) {
        event.preventDefault();
        const {value} = event.target;
        setEmail(value);
    }

    function handleChangePassword(event) {
        event.preventDefault();
        const {value} = event.target;
        setOtp(value);
    }

    async function sendOTP() {
        try {
            setLoading(true);
            const response = await postApiCall('loginWithAppWrite', { email });
            const {status, message, data} = response.data;
            if(status){
                console.log("data", data);
                setTempLoginData(data);
                setShowOTP(true);
            }else{
                messageApi.error(message);
            }
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    }

    async function verifyOTP() {
        try {
            setLoading(true);
          const response = await postApiCall('verifyOtpWithAppWrite', { otp: otp, userId: tempLoginData.userId });
          const {status, message, data} = response.data;
          console.log(status, message, data);
          if(status){
            saveData(data);
          }else{
            messageApi.error(message);
          }
          setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    }

    if (userData) {
        return <Navigate to="/home" />;
    }

    return(
        <Card 
            title="Login"
        >
            {contextHolder}
            <Title>Fresh Farms Admin Login</Title>
            {
                !showOTP &&
                <Input
                    variant='outlined'
                    placeholder='Email'
                    value={email}
                    onChange={handleChangeEmail}
                    allowClear={true}
                    style={{marginTop: 20, marginBottom: 20}}
                    // addonBefore='example@gmail.com'
                />
            }

            {
                showOTP &&
                <Input
                    variant='outlined'
                    placeholder='OTP'
                    value={otp}
                    onChange={handleChangePassword}
                    allowClear={true}
                    style={{marginTop: 5, marginBottom: 20}}
                    // addonBefore='example@gmail.com'
                />
            }

            <Button 
                block
                style={{marginTop: 5, marginBottom: 20}}
                onClick={showOTP ? verifyOTP : sendOTP}
                loading={loading}
                disabled={loading}
            >
                Submit
            </Button>
        </Card>
    )
}

export default Login;