
import {Button, Drawer, Image, Form, Layout, List, Modal, Switch, Table, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { formatOrderDateTime, getUserData, formatOrdersDataForTable, getApiCall, postApiCall, formatInventoryDateTime } from '../utils';
import EditOrder from './Edit Order';

const Orders = () => {
    const user = getUserData();
    console.log(user, "users")
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [columns, setColumns] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [showModal, setShowModal]= useState(false);

    const [form] = Form.useForm();


    useEffect(() => {
        getUsersList();
    },[]);

    const handleCancelOrderConfirm = () => {
        console.log("handleCancelOrderConfirm");    
    }
    const handleGeneratePDF = () => {
        console.log("handleCancelOrderConfirm");    
    }
    const handleCategoryStateChange = () => {
        console.log("handleCancelOrderConfirm");    
    }

    async function getUsersList() {
        setLoading(true);
        try {
            if(user){
                const response = await getApiCall("admin/getOrders", user.token);
                const {data, status, message} = response.data;
                if(status){
                    const transformedArray = data.map((item, index) => {
                        const address = JSON.parse(item?.address);
                        const products = JSON.parse(item?.products);
                        let parsedItem = {...item, products: products, address: address};

                        return {
                            key: item?.$id,
                            id: item?.$id,
                            orderId: item?.orderId,
                            dateTime: formatInventoryDateTime(item?.dateTime),
                            address: address?.address,
                            status: item?.orderStatus,
                            contact: address?.phoneNumber,
                            customerName: address?.name,
                            action:
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => {setSelectedUserToEdit(parsedItem); setShowModal(true)}}>Edit</Button>
                                <Button danger style={{ marginRight: 10}} onClick={() =>{ handleCancelOrderConfirm(item.$id)}}>Cancel</Button>
                            </div>
                            ,
                            options:
                            <div style={{display:'flex', flexDirection:'row'}}>
                                 <Button style={{marginRight: 10}} onClick={() =>{setSelectedUserToEdit(parsedItem); handleGeneratePDF(item?.orderId)}}>Generate Bill</Button>
                                 <Button danger style={{marginRight: 10}} onClick={() => setSelectedUserToEdit(item)}>Delete</Button>
                                <Switch checked={item.isActive} onChange={(v) => handleCategoryStateChange(v, item._id)} />
                            </div>

                        }
                    });                
                    const {columns} = formatOrdersDataForTable(data);
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

    const showAddOrderModal= () => {
        form.resetFields();
        setIsAddModalVisible(true);
    }
    
    return(
        <div>
        <h1>Orders</h1>
        <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={showAddOrderModal}
      >
        Add Order
      </Button>
        <Table 
        loading={loading} 
        dataSource={userList} 
        columns={columns} 
        />

<Modal
        title={editingProduct ? 'Edit Product' : 'Add Order'}
        open={isEditModalVisible || isAddModalVisible}
        footer={false}
        onCancel={() => {
        //   setIsEditModalVisible(false);
          setIsAddModalVisible(false);
        //   setEditingProduct(null);
        }}
      >
        <EditOrder data={categories}/>
      </Modal>
        </div>
    )
}
export default Orders;