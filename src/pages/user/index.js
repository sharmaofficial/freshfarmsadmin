import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatUsersDataForTable, getApiCall } from '../../utils';

const Users = () => {
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        getUsersList();
    },[]);

    async function getUsersList() {
        setLoading(true);
        try {
            const response = await getApiCall();
            const {data, status, message} = response.data;
            if(status){
                console.log("data", data);
                const {columns, transformedArray} = formatUsersDataForTable(data);
                setColumns(columns);
                setUsersList(transformedArray);
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