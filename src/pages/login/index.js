import { Button, Card, Input } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useLocalStorage from '../../utils/localStorageHook';
import { unstable_HistoryRouter, useNavigate } from 'react-router-dom';

function Login() {
    const {isAuthenticated, user} = useSelector((state) => state.auth);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const {data, deleteData, saveData} = useLocalStorage('user');
    const navigate = useNavigate()
    
    useEffect(() => {
        if(!isAuthenticated){
            if(data){
                dispatch({type: 'LOGIN', payload: data});
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

    function handleLogin() {
        saveData({email, password});
        dispatch({type: 'LOGIN', payload: {email, password}});
        navigate('/users')
    }

    return(
        <Card 
            title="Login"
        >
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