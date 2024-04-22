import { Button, Drawer, Image, Layout, List, Modal, Switch, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatUsersDataForTable, getApiCall, postApiCall } from '../../utils';
import useLocalStorage from '../../utils/localStorageHook';
import { Content, Footer } from 'antd/es/layout/layout';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import AddCategory from '../Add Category';

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

const Category = () => {
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [columns, setColumns] = useState([]);
    const {userData} = useLocalStorage('user');
    const [visible, setVisible] = useState(false);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        getUsersList();
    },[userData]);

    async function getUsersList() {
        setLoading(true);
        try {
            if(userData){
                // const response = await getApiCall("", decryptToken(user.token, 'freshfarms'));
                const response = await getApiCall("admin/getCategories", userData.token);
                const {data, status, message} = response.data;
                if(status){
                    const transformedArray = data.map((item, index) => ({
                        key: item._id,
                        id: item._id,
                        name: item.name,
                        image: <Image src={item.coverImage} width={20} height={20} />,
                        action: <>
                                    <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10}} onClick={() => setSelectedUserToEdit(item)}>Edit</Button>
                                    <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10}} onClick={() => handleDeleteCategory(item._id)}>Delete</Button>
                                    <Switch checked={item.isActive} onChange={(v) => handleCategoryStateChange({...item, isActive: v})} />
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

    async function handleCategoryStateChange(updatedCategory) {
        console.log("updatedCategory", updatedCategory);
        let payload = {
            name: updatedCategory.name,
            isActive: updatedCategory.isActive,
            _id: updatedCategory._id,
            __v: updatedCategory.__v,
        }
        try {
            const response = await postApiCall("admin/editCategory", payload, userData.token);
            const {data, message, status} = response.data;
            console.log(data);
            console.log(message);
            if(status){
                messageApi.success(message);
                getUsersList();

                //TODO: Api return the updated data row, use this instead of calling the api again
                // let temp = userList.map((item) => {
                //     if (item._id === data._id) {
                //         console.log("in if");
                //         return {
                //             ...item,
                //             ...data
                //         }
                //     } else {
                //         console.log("in else");
                //         return item;
                //     }
                // });
                // console.log("temp", temp);
                // setUsersList(temp);
            }else{
                messageApi.error(message)
            }
        } catch (error) {
            console.log(error);
            messageApi.error(message)
        }
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

    async function handleAddCategory(fromData) {
        try {
            const response = await postApiCall("admin/addCategory", fromData, userData.token);
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

    async function handleUpdateCategory(formData) {
        delete formData.imageURI;
        try {
            const response = await postApiCall("admin/editCategory", formData, userData.token);
            const {data, message, status} = response.data;
            if(status){
                messageApi.success(message);
                getUsersList();
                setSelectedUserToEdit(null);
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

    async function handleDeleteCategory(id) {
        try {
            const response = await postApiCall("admin/deleteCategory", {_id: id}, userData.token);
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
            <Modal title="Edit category" open={selectedUserToEdit} onOk={handleOk} onCancel={handleCancel}>
                {/* {selectedUserToEdit && <p>{selectedUserToEdit.name}</p>} */}
                <AddCategory preFill={selectedUserToEdit} formName={'Edit Category'} onUpdate={(data) => handleUpdateCategory(data)} />
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
                <AddCategory onAdd={(data) => handleAddCategory(data)}/>
                <Table  
                    title={() => 'Categories'}
                    loading={loading} 
                    dataSource={userList} 
                    columns={
                        [
                            {
                              title: 'Name',
                              dataIndex: 'name',
                              key: 'name',
                            },
                            {
                              title: 'image',
                              dataIndex: 'image',
                              key: 'image',
                            },
                            {
                              title: 'Action',
                              dataIndex: 'action',
                              key: 'action',
                            },
                        ]
                    } 
                />
            </Content>
         <Footer>
         </Footer>
     </Layout>
    );
}

export default Category;