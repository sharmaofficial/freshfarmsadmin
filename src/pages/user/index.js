import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { decryptToken, formatUsersDataForTable, getApiCall } from '../../utils';
import useLocalStorage from '../../utils/localStorageHook';

const Users = () => {
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [columns, setColumns] = useState([]);
    const {userData} = useLocalStorage('user');

    useEffect(() => {
        getUsersList();
    },[userData]);

    async function getUsersList() {
        setLoading(true);
        try {
            if(userData){
                // const response = await getApiCall("", decryptToken(user.token, 'freshfarms'));
                const response = await getApiCall("", userData.token);
                const {data, status, message} = response.data;
                if(status){
                    const {columns, transformedArray} = formatUsersDataForTable(data);
                    setColumns(columns);
                    setUsersList(transformedArray);
                }
            }
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    return (
        <Table loading={loading} dataSource={userList} columns={columns} />
    );
}

export default Users;