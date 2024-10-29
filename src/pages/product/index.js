import { Button, Drawer, Image, Layout, List, Modal, Switch, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatProductDataForTable, formatUsersDataForTable, getApiCall, postApiCall } from '../../utils';
import useLocalStorage from '../../utils/localStorageHook';
import { Content, Footer } from 'antd/es/layout/layout';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import AddProduct from '../Add Product';

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

const Product = () => {
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [categories, setCategories] = useState([]);
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
                const response = await getApiCall("admin/getProducts", userData.token);
                const {data, status, message} = response.data;
                console.log(data);
                setCategories(data.categories)
                console.log(message);
                if(status){
                    const transformedArray = data.products.map((item, index) => ({
                        key: item.$id,
                        id: item.$id,
                        name: item.name,
                        description: item.description,
                        image: <Image src={item.image} width={20} height={20} />,
                        shopName: item.shopName,
                        action:
                        <>
                            <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10}} onClick={() => setSelectedUserToEdit(item)}>Edit</Button>
                            <Button style={{backgroundColor:'#2ecc72', color:'#fff'}} onClick={() => alert(item.$id)}>Delete</Button>
                            <Switch checked={item.isActive} onChange={(v) => handleProductStateChange({...item, isActive: v})} />
                        </>
                    }));                
                    const {columns} = formatProductDataForTable(data.products);
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

    async function handleAddProduct(formData) {
        console.log("formData", formData);
        try {
            const response = await postApiCall("admin/addProduct", formData, userData.token);
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

    async function handleProductStateChange(updatedProduct) {
        console.log("updatedProduct", updatedProduct);
        let payload = {
            isActive: updatedProduct.isActive,
            _id: updatedProduct.$id,
        }
        try {
            const response = await postApiCall("admin/editProduct", payload, userData.token);
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

    async function handleProductUpdate(formData) {
        delete formData.imageURI;
        try {
            const response = await postApiCall("admin/editProduct", formData, userData.token);
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

    return (
         <Layout>
            {contextHolder}
            <Modal footer={null} open={selectedUserToEdit} onOk={handleOk} onCancel={handleCancel}>
                {/* {selectedUserToEdit && <p>{selectedUserToEdit.name}</p>} */}
                <AddProduct preFill={selectedUserToEdit} categories={categories} formName={'Edit Product'} onUpdate={handleProductUpdate} />
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
                <AddProduct categories={categories} onSubmit={(data) => handleAddProduct(data)} />
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

export default Product;