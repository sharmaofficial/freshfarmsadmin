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
    const [password, setPassword] = useState('');
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
        setPassword(value);
    }

    async function handleLogin() {
        // saveData({email, password});
        // dispatch({type: 'LOGIN', payload: {email, password}});
        // navigate('/users')

        // event.preventDefault();
        try {
          const response = await postApiCall('admin/login', { email, password });
          const {status, message, data} = response.data;
          if(status){
            messageApi.success(message);
            let payload = {
                ...data.userData,
                token: data.token
                // token: encryptToken(data.token, 'freshfarms')
            }
            saveData(payload);
            // return <Navigate to="/home" />;
          }else{
            messageApi.error(message);
          }
        } catch (error) {
            console.log("error", error);
        //   setError('Invalid username or password');
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
            <Input
                variant='outlined'
                placeholder='Email'
                value={email}
                onChange={handleChangeEmail}
                allowClear={true}
                style={{marginTop: 20, marginBottom: 20}}
                // addonBefore='example@gmail.com'
            />
            <Input
                variant='outlined'
                placeholder='Password'
                value={password}
                onChange={handleChangePassword}
                allowClear={true}
                style={{marginTop: 5, marginBottom: 20}}
                // addonBefore='example@gmail.com'
            />
            <Button 
                block
                style={{marginTop: 5, marginBottom: 20}}
                onClick={handleLogin}
            >
                Submit
            </Button>
        </Card>
    )
}

export default Login;