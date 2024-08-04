import { Alert, Button, Drawer, Image, Layout, List, Modal, Space, Switch, Table, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { formatOrderDateTime, formatOrdersDataForTable, formatUsersDataForTable, getApiCall, postApiCall, putApiCall } from '../../utils';
import useLocalStorage from '../../utils/localStorageHook';
import { Content, Footer } from 'antd/es/layout/layout';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import EditOrder from '../Edit Order';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import BillFormat from './BillFormat';
import './styles.css'
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

const Order = () => {

    const printRef = useRef();
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [columns, setColumns] = useState([]);
    const {userData} = useLocalStorage('user');
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [orderId, setOrderId] = useState(``);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    useEffect(() => {
        getUsersList();
    },[userData]);

    async function getUsersList() {
        setLoading(true);
        try {
            if(userData){
                const response = await getApiCall("admin/getOrders", userData.token);
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
                            dateTime: formatOrderDateTime(item?.dateTime),
                            address: address?.address,
                            status: item?.orderStatus,
                            contact: address?.phoneNumber,
                            customerName: address?.name,
                            action:
                            <>
                                <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10, marginBottom: 10}} onClick={() => {setSelectedUserToEdit(parsedItem); setShowModal(true)}}>Edit</Button>
                                <Button danger style={{ marginRight: 10, marginBottom: 10}} onClick={() =>{ handleCancelOrderConfirm(item.$id)}}>Cancel</Button>
                                <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10}} onClick={() =>{setSelectedUserToEdit(parsedItem); handleGeneratePDF(item?.orderId)}}>Generate Bill</Button>
                                {/* <Button style={{backgroundColor:'#2ecc72', color:'#fff'}} onClick={() => setSelectedUserToEdit(item)}>Delete</Button> */}
                                {/* <Switch checked={item.isActive} onChange={(v) => handleCategoryStateChange(v, item._id)} /> */}
                            </>
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

    function handleGeneratePDF(id){
        html2canvas(document.getElementById("#bill")).then(canvas => {
            document.body.appendChild(canvas);  // if you want see your screenshot in body.
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save(`Order - ${id || ''}.pdf`);
        }).catch((error) => {
            console.error("Error generating PDF:", error);
        });
    };

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setShowModal(false);
    };

    const handleOk = () => {
        setSelectedUserToEdit(null);
        setShowModal(false);
    };
    
    const handleCancel = () => {
        setSelectedUserToEdit(null);
        setShowModal(false);
    };

    const handleUpdateSuccess = async(message, data) => {
        console.log("data", data);
        messageApi.success(message);
        const userIndex = userList.findIndex(item => item.key === data._id);
        const updatedUserList = [...userList]; 
        updatedUserList[userIndex] = {
            key: data?._id,
            id: data?._id,
            orderId: data?.orderId,
            dateTime: formatOrderDateTime(data?.dateTime),
            address: data?.address?.address,
            status: data?.orderStatus,
            contact: data?.address?.phoneNumber,
            customerName: data?.address?.name,
            action:
            <>
                <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10, marginBottom: 10}} onClick={() => {setSelectedUserToEdit(data); setShowModal(true)}}>Edit</Button>
                <Button danger style={{ marginRight: 10, marginBottom: 10}} onClick={() =>{ handleCancelOrderConfirm(data._id)}}>Cancel</Button>
                <Button style={{backgroundColor:'#2ecc72', color:'#fff', marginRight: 10}} onClick={() =>{setSelectedUserToEdit(data); handleGeneratePDF(data?.orderId)}}>Generate Bill</Button>
                {/* <Button style={{backgroundColor:'#2ecc72', color:'#fff'}} onClick={() => setSelectedUserToEdit(item)}>Delete</Button> */}
                {/* <Switch checked={item.isActive} onChange={(v) => handleCategoryStateChange(v, item._id)} /> */}
            </>
        };
        setUsersList(updatedUserList);
        setSelectedUserToEdit(null);
        setLoading(false);
        setOrderId(``);
    };

    const handleCancelOrderConfirm = async(orderId) => {
        setOrderId(orderId)
        setShowAlert(true);        
    }

    const handleCancelOrder = async() => {
        if(showAlert) setShowAlert(false);
        try {
            if(userData){
                setLoading(true);
                const response = await postApiCall('cancelOrder', {orderId: orderId}, userData.token);
                const {status, data, message} = response.data;
                if(status){
                    handleUpdateSuccess(message, data);
                    return
                }
                messageApi.error(message);
                setLoading(false);
                setOrderId(``);
            }else{
                messageApi.error(`Please login to use this feature`);
                setLoading(false);
                setOrderId(``);
            }
        } catch (error) {
            console.log("error", error);
            messageApi.error(`Something Went Wrong ! - ${error.message}`);
            setOrderId(``);
            setLoading(false);
        }
    }

    const handleUpdateError = async(message) => {
        messageApi.error(message)
    };
    console.log("selectedUserToEdit", selectedUserToEdit);

    return (
         <Layout>
            {contextHolder}
            <Modal footer={null} title="Edit order" open={showModal} onOk={handleOk} onCancel={handleCancel}>
                {/* {selectedUserToEdit && <p>{selectedUserToEdit.name}</p>} */}
                <EditOrder successCallback={handleUpdateSuccess} errorCallback={handleUpdateError} data={selectedUserToEdit}/>
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
                {
                    showAlert &&
                    <Alert
                        message="Warning !"
                        description="Are you sure you want to cancel the order"
                        type="warning"
                        action={
                            <Space direction="vertical">
                                <Button onClick={() => handleCancelOrder()} size="small" type="primary">
                                    Accept
                                </Button>
                                <Button onClick={() => setShowAlert(false)} size="small" danger ghost>
                                    Decline
                                </Button>
                            </Space>
                        }
                    />
                }
                <Table  
                    title={() => 'Products'}
                    loading={loading} 
                    dataSource={userList} 
                    columns={columns} 
                />
            </Content>
        <Footer>
        </Footer>
        {/* Bill to print */}
        <div style={{position: 'absolute', left: '-9999px',}} id='#bill'>
            <BillFormat
                shopName="ABC Shop"
                billNo="12345"
                date="April 25, 2024"
                customerName="John Doe"
                email="john@example.com"
                address="123 Main St, City"
                products={selectedUserToEdit?.products}
            />
        </div>

     </Layout>
    );
}

export default Order;