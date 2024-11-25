
import {Button, Drawer, Image, Form, Layout, List, Modal, Switch,Typography, Table, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { formatOrderDateTime, getUserData, formatOrdersDataForTable, getApiCall, postApiCall, formatInventoryDateTime } from '../utils';
import EditOrder from './Edit Order';
import BillFormat from './BillFormat';

const Orders = () => {
    const user = getUserData();
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [columns, setColumns] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const [orderBillData, setOrderBillData] = useState(null);
    const [printBill, setPrintBill] = useState(false);
    const [messageApi, contextHolder] = message.useMessage([{}]);
    const [showModal, setShowModal]= useState(false);
    const [productsForOrderEdit,setProductsForOrderEdit]=useState()
    const [editData,setEditData]=useState({});

    const [form] = Form.useForm();
    const{Text}=Typography;

    useEffect(() => {
        getUsersList();
    },[]);

    const handleCancelOrderConfirm = () => {
        console.log("handleCancelOrderConfirm");    
    }

    function handleGeneratePDF(order) {
        const id = order?.orderId.$id
        setOrderBillData({
            shopName: "Tiger Hills Agro",
            billNo: order.orderId?.$id,
            date: formatInventoryDateTime(order.orderId?.$createdAt),
            customerName: order.orderId?.deliveryAddress?.name,
            email: order.orderId?.deliveryAddress?.contactNumber,
            address: order.orderId?.deliveryAddress?.address,
            products: order ? JSON.parse(order.orderId?.products) : [],
            totalAmount: order.orderId?.totalAmout,
        })
        setPrintBill(true);
        setTimeout(() => {
            const billElement = document.querySelector('#bill');
            if (!billElement) {
                console.error("Bill element not found");
                return;
            }
    
            html2canvas(billElement, { scale: 2 })
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdfWidth = canvas.width * 0.264583;
                    const pdfHeight = canvas.height * 0.264583;
    
                    const pdf = new jsPDF(pdfWidth > pdfHeight ? 'landscape' : 'portrait', 'mm', [pdfWidth, pdfHeight]);
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`Order - ${id}.pdf`);
                })
                .catch((error) => {
                    console.error("Error generating PDF:", error);
                });
        }, 100);
    }
    // const handleCategoryStateChange = () => {
    //     console.log("handleCancelOrderConfirm");    
    // }

    async function getUsersList() {
        setLoading(true);
        // debugger
        try {
            if(user){
                const response = await getApiCall("admin/getOrders", user.token);
                const {data, status, message} = response.data;
                
                if(status){
                    const transformedArray = data.map((item, index) => {
                        console.log("item", item);
                        return {
                            key: item.$id,
                            id: item.$id,
                            orderId: item.orderId.$id,
                            dateTime: formatInventoryDateTime(item?.orderId.$createdAt),
                            address: item.orderId.deliveryAddress.address,
                            status: item.orderId.orderStatus,
                            contact: item.orderId.deliveryAddress.contactNumber,
                            customerName: item.orderId.deliveryAddress.name,
                            totalAmount:"₹"+item.orderId.totalAmout,
                            isPaid:item.orderId.isPaid?<Text type='success'>Paid</Text>:<Text type='danger'>Unpaid</Text>,
                            action:
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => {openEditOrder({...item, status: item.orderId.orderStatus}); setShowModal(true)}}>Edit</Button>
                                {/* <Button danger style={{ marginRight: 10}} onClick={() =>{ handleCancelOrderConfirm(item.$id)}}>Cancel</Button> */}
                            </div>
                            ,
                            options:
                            <div style={{display:'flex', flexDirection:'row'}}>
                                 <Button style={{marginRight: 10}} onClick={() =>{handleGeneratePDF(item)}}>Generate Bill</Button>
                                 {/* <Button danger style={{marginRight: 10}} onClick={() => setSelectedUserToEdit(item)}>Delete</Button> */}
                                {/* <Switch checked={item.isActive} onChange={(v) => handleCategoryStateChange(v, item._id)} /> */}
                            </div>

                        }
                    });                
                    // debugger
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

    function openEditOrder(data){
        // debugger
        setEditData(data)
        setProductsForOrderEdit(JSON.parse(data.orderId.products))
        setIsEditModalVisible(true)
    }

    function editSuccessCallback(data,msg, id, status) {
        try {            
            setIsEditModalVisible(false);
            messageApi.success(msg);
            // debugger
            const temp = userList.map(item => {
                if(item.orderId === id){
                    console.log("element", item);
                    let payload = {
                        key: item.$id,
                        id: item.$id,
                        orderId: item.orderId,
                        dateTime: formatInventoryDateTime(item.dateTime),
                        address: item.address,
                        status: status,
                        contact: item.contact,
                        customerName: item.customerName,
                        totalAmount: item.totalAmount,
                        isPaid: item.isPaid,
                        // orderStatus:item.orderId.orderStatus
                        action:
                        <div key={item.$id} style={{display:'flex', flexDirection:'row'}}>
                            <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => {openEditOrder(data); setShowModal(true)}}>Edit</Button>
                            {/* <Button danger style={{ marginRight: 10}} onClick={() =>{ handleCancelOrderConfirm(item.$id)}}>Cancel</Button> */}
                        </div>
                        ,
                        options:
                        <div key={item.$id} style={{display:'flex', flexDirection:'row'}}>
                             <Button style={{marginRight: 10}} onClick={() =>{ handleGeneratePDF(data)}}>Generate Bill</Button>
                             {/* <Button danger style={{marginRight: 10}} onClick={() => setSelectedUserToEdit(item)}>Delete</Button> */}
                            {/* <Switch checked={item.isActive} onChange={(v) => handleCategoryStateChange(v, item._id)} /> */}
                        </div>
    
                    };
                    console.log("payload", payload);
                    return payload
                } else {
                    return item
                }
            });
            setUsersList(temp);
            setIsEditModalVisible(false);
            messageApi.success(msg);
        } catch (error) {
          console.log("error", error);  
        }
    }

    function editErrorCallback(msg) {
        setIsEditModalVisible(false);
        messageApi.error(msg);
    }

    console.log("selectedUserToEdit?.orderId?.products", selectedUserToEdit?.orderId?.products);
    
    return(
        <div style={{minWidth:'20cm'}}>
        <h1>Orders</h1>
        <Table 
            loading={loading} 
            dataSource={userList} 
            columns={columns} 
        />
         {/* Bill to print */}
         <div  style={{position: 'absolute', left: '-9999px',}} id='bill'>
            {printBill&&<BillFormat
                  shopName={orderBillData?.shopName}
                  billNo={orderBillData?.billNo}
                  date={orderBillData?.date}
                  customerName={orderBillData?.customerName}
                  email={orderBillData?.email}
                  address={orderBillData?.address}
                  products={orderBillData?.products}
                  totalAmount={orderBillData?.totalAmount}
            />}
        </div>
        <Modal
            title={editingProduct ? 'Edit Product' : 'Add Order'}
            open={isEditModalVisible}
            footer={false}
            onCancel={() => {
            setIsEditModalVisible(false);
            setIsAddModalVisible(false);
            //   setEditingProduct(null);
            }}
        >
            <EditOrder
                data={editData} 
                products={productsForOrderEdit}
                successCallback={(data,message, id, status) => editSuccessCallback(data,message, id, status)} 
                errorCallback={(Error)=> editErrorCallback(Error)}
            />
        </Modal>
        </div>
    )
}
export default Orders;