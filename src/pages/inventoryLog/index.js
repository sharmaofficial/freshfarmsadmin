import { Button, Drawer, Image, Layout, List, Modal, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatLogsDataForTable, formatOrderDateTime, formatUsersDataForTable, getApiCall, postApiCall } from '../../utils';
import useLocalStorage from '../../utils/localStorageHook';
import { Content, Footer } from 'antd/es/layout/layout';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';

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


const InventoryLog = () => {
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [columns, setColumns] = useState([]);
    const {userData} = useLocalStorage('user');
    const [visible, setVisible] = useState(false);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getUsersList();
    },[userData]);

    async function getUsersList() {
        setLoading(true);
        try {
            if(userData){
                const response = await getApiCall("admin/getInventoryLog", userData.token);
                const {data, status, message} = response.data;
                if(status){
                    const transformedArray = data.map((item, index) => {
                        return {
                            key: item?._id,
                            id: item?._id,
                            orderId: item?.orderId,
                            dateTime: formatOrderDateTime(item?.dateTime),
                            action:
                            <>
                                <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10}} onClick={() => setSelectedUserToEdit(item)}>Edit</Button>
                                {/* <Button style={{backgroundColor:'#2ecc72', color:'#fff'}} onClick={() => setSelectedUserToEdit(item)}>Delete</Button> */}
                                {/* <Switch checked={item.isActive} onChange={(v) => handleCategoryStateChange(v, item._id)} /> */}
                            </>
                        }
                    });                
                    const {columns} = formatLogsDataForTable(data);
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

    return (
         <Layout>
            <Modal title="Edit product" open={selectedUserToEdit} onOk={handleOk} onCancel={handleCancel}>
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
                <Table  
                    title={() => 'Products'}
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

export default InventoryLog;