import { Button, Drawer, Image, Layout, List, Modal, Switch, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatPackageDataForTable, formatUsersDataForTable, getApiCall, postApiCall } from '../../utils';
import useLocalStorage from '../../utils/localStorageHook';
import { Content, Footer } from 'antd/es/layout/layout';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import AddPackage from '../Add Package';

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
        title: 'Inventory Log',
        route: "/InventoryLog"
    },
];

const Package = () => {
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [columns, setColumns] = useState([]);
    const {userData} = useLocalStorage('user');
    const [visible, setVisible] = useState(false);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        getUsersList();
    },[userData]);

    async function getUsersList() {
        setLoading(true);
        try {
            if(userData){
                // const response = await getApiCall("", decryptToken(user.token, 'freshfarms'));
                const response = await getApiCall("admin/getPackages", userData.token);
                const {data, status, message} = response.data;
                console.log(data);
                console.log(message);
                if(status){
                    const transformedArray = data.map((item, index) => ({
                        key: item._id,
                        id: item._id,
                        weigth: item.name,
                        action:
                        <>
                            {/* <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10}} onClick={() => setSelectedUserToEdit(item)}>Edit</Button> */}
                            <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10}} onClick={() => setSelectedUserToEdit(item)}>Delete</Button>
                            <Switch checked={item.isActive} onChange={(v) => handleCategoryStateChange(v, item._id)} />
                        </>
                    }));                
                    const {columns} = formatPackageDataForTable(data);
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

    function handleCategoryStateChange(newStatus, categoryId) {
        console.log("newStatus", newStatus);
        console.log("categoryId", categoryId);
    }

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleOk = () => {
        setSelectedUserToEdit(null);
    };
    
    const handleCancel = () => {
        setSelectedUserToEdit(null);
    };

    async function handleAddPackage(formData) {
        try {
            const response = await postApiCall("admin/addPackage", formData, userData.token);
            const {data, message, status} = response.data;
            if(status){
                messageApi.success(message);
                getUsersList();
                
                //TODO: Api return the updated data row, use this instead of calling the api again
                // setUsersList([...userList, data]);
            }else{
                messageApi.error(message)
            }
        } catch (error) {
            console.log(error);
            messageApi.error(message)
        }
    }

    return (
         <Layout>
            {contextHolder}
            <Modal title="Edit package" open={selectedUserToEdit} onOk={handleOk} onCancel={handleCancel}>
                {selectedUserToEdit && <p>{selectedUserToEdit.name}</p>}
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
            <Header onDrawerOpen={showDrawer} />
            <Content>
                <AddPackage onSubmit={(data) => handleAddPackage(data)} />
                <Table  
                    title={() => 'Packages'}
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

export default Package;