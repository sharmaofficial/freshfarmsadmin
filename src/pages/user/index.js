import { Button, Drawer, Layout, List, Modal, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatUsersDataForTable, getApiCall, postApiCall } from '../../utils';
import useLocalStorage from '../../utils/localStorageHook';
import { Content, Footer } from 'antd/es/layout/layout';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import EditUser from './editUser';

const data = [
    {
      title: 'Users',
      route: "/home"
    },
    {
      title: 'Categories',
      route: "/Category"
    },
    {
      title: 'Products',
      route: "/Product"
    },
    {
      title: 'Orders',
      route: "/Order"
    },
    {
        title: 'Packages',
        route: "/Package"
    },
    {
        title: 'Add To Inventory',
        route: "/AddStock"
    },
    {
        title: 'Inventory Log',
        route: "/InventoryLog"
    },
];

const Users = () => {
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [columns, setColumns] = useState([]);
    const {userData, deleteData} = useLocalStorage('user');
    const [visible, setVisible] = useState(false);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const navigate = useNavigate()

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
                console.log(data);
                if(status){
                    const transformedArray = data.map((item, index) => ({
                        key: item._id,
                        id: item._id,
                        name: item.data.name,
                        email: item.data.email,
                        mobile: item.data.mobile || "-",
                        action: <>
                            <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10}} onClick={() => setSelectedUserToEdit(item)}>Edit</Button>
                            {/* <Button style={{backgroundColor:'#2ecc72', color:'#fff'}} onClick={() => setSelectedUserToEdit(item)}>Delete</Button> */}
                            <Switch checked={item.data.isActive} onChange={(v) => updateUserStatus(item.data.isActive, item._id)} />
                        </>
                    }));                
                    const {columns} = formatUsersDataForTable(data);
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

    async function updateUserStatus(isActive, userId) {
        console.log(isActive);
        setLoading(true);
        let payload =  {isActive : isActive ? false : true, userId};
        try {
            const response = await postApiCall("admin/updateUserStatus", payload, userData.token);
            const {data, status, message} = response.data;
            setLoading(false);
            if(status){
                getUsersList()
                // console.log(userList);
                // const userIndex = userList.findIndex(item => item.key === data._id);
                // console.log("userList", userIndex);

                // let updatedUserList = [...userList];
                // console.log("updatedUserList", updatedUserList);

                // updatedUserList[userIndex] = {
                //     key: data._id,
                //     id: data._id,
                //     name: data.data.name,
                //     email: data.data.email,
                //     mobile: data.data.mobile || "-",
                //     action: <>
                //         <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10}} onClick={() => setSelectedUserToEdit(data)}>Edit</Button>
                //         <Switch checked={data.data.isActive} onChange={(v) => updateUserStatus(data.data.isActive)} />
                //     </>
                // };
                // setUsersList(updatedUserList);
            }else{
                // errorCallback(message)
                console.log(message);
            }
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            // errorCallback(error.message);
        }
    }

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleUpdateSuccess = async(message, data) => {
        const userIndex = userList.findIndex(item => item.key === data._id);
        const updatedUserList = [...userList]; 
        updatedUserList[userIndex] = {
            key: data._id,
            id: data._id,
            name: data.data.name,
            email: data.data.email,
            mobile: data.data.mobile || "-",
            action: <>
                <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10}} onClick={() => setSelectedUserToEdit(data)}>Edit</Button>
                <Switch checked={data.data.isActive} onChange={(v) => updateUserStatus(data.data.isActive)} />
            </>
        };
        console.log("updatedUserList", updatedUserList);
        setUsersList(updatedUserList);
        setSelectedUserToEdit(null);
    };

    const handleUpdateError = async(message) => {
        // setSelectedUserToEdit(null);
        console.log(message);
    };
    
    const handleCancel = () => {
        setSelectedUserToEdit(null);
    };

    function logout() {
        deleteData();
    }

    return (
         <Layout>
            <Modal title="Edit user" footer={null} open={selectedUserToEdit} onCancel={handleCancel}>
                <EditUser data={selectedUserToEdit} successCallback={handleUpdateSuccess} errorCallback={handleUpdateError} />
            </Modal>
             <Drawer
                title="Fresh Farms Admin"
                placement="left"
                closable={false}
                onClose={onClose}
                open={visible}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item, index) => (
                        <Button style={{display:'flex', marginTop: 10, width: '100%'}} title={item.title}  onClick={() => navigate(item.route)}>
                            {item.title} 
                        </Button>
                    )}
                />
            </Drawer>
            <Header logout={logout} onDrawerOpen={showDrawer} />
            <Content>
                <Table
                    title={() => 'Users'}
                    loading={loading} 
                    dataSource={userList} 
                    columns={columns} 
                />
            </Content>
         <Footer>
         </Footer>
     </Layout>
    );
}

export default Users;