
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
    const [orderBillData, setOrderBillData] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [showModal, setShowModal]= useState(false);
    const [editData,setEditData]=useState({});

    const [form] = Form.useForm();
    const{Text}=Typography;

    useEffect(() => {
        getUsersList();
    },[]);

    const handleCancelOrderConfirm = () => {
        console.log("handleCancelOrderConfirm");    
    }

    function handleGeneratePDF(id) {
        const billElement = document.querySelector('#bill');
        html2canvas(billElement, {
            scale: 2, 
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = canvas.width * 0.264583;
            const pdfHeight = canvas.height * 0.264583;
    
            const pdf = new jsPDF(pdfWidth > pdfHeight ? 'landscape' : 'portrait', 'mm', [pdfWidth, pdfHeight]);
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Order - ${id || ''}.pdf`);
        }).catch((error) => {
            console.error("Error generating PDF:", error);
        });
    }
    const handleCategoryStateChange = () => {
        console.log("handleCancelOrderConfirm");    
    }

    async function getUsersList() {
        setLoading(true);
        // debugger
        try {
            if(user){
                const response = await getApiCall("admin/getOrders", user.token);
                const {data, status, message} = response.data;
                console.log("DATAAAA", data);
                
                if(status){
                    const transformedArray = data.map((item, index) => {
                        // const address = JSON.parse(item?.address);
                        // const products = JSON.parse(item?.products);

                        // let parsedItem = {...item, products: products, address: address};
                        
                        // debugger
                        return {
                            key: item.$id,
                            id: item.$id,
                            orderId: item.orderId.orderId,
                            dateTime: formatInventoryDateTime(item?.orderId.$createdAt),
                            address: item.orderId.deliveryAddress.address,
                            status: item.orderId.orderStatus,
                            contact: item.orderId.deliveryAddress.contactNumber,
                            customerName: item.orderId.deliveryAddress.name,
                            totalAmount:"₹"+item.orderId.totalAmout,
                            isPaid:item.orderId.isPaid?<Text type='success'>Paid</Text>:<Text type='danger'>Unpaid</Text>,
                            // orderStatus:item.orderId.orderStatus
                            action:
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => {openEditOrder(item.orderId); setShowModal(true)}}>Edit</Button>
                                <Button danger style={{ marginRight: 10}} onClick={() =>{ handleCancelOrderConfirm(item.$id)}}>Cancel</Button>
                            </div>
                            ,
                            options:
                            <div style={{display:'flex', flexDirection:'row'}}>
                                 <Button style={{marginRight: 10}} onClick={() =>{setSelectedUserToEdit(item.orderId.products); handleGeneratePDF(item.orderId.orderId)}}>Generate Bill</Button>
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
        console.log(data,"openEdit");
        setEditData(data)
        setIsEditModalVisible(true)
        
    }
    
    return(
        <div style={{minWidth:'20cm'}}>
        <h1>Orders</h1>
        {/* <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={showAddOrderModal}
      >
        Add Order
      </Button> */}
        <Table 
        loading={loading} 
        dataSource={userList} 
        columns={columns} 
        />
         {/* Bill to print */}
         <div  style={{position: 'absolute', left: '-9999px',}} id='bill'>
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
        <EditOrder data={editData} successCallback={()=>{console.log("Success")}} errorCallback={()=>{console.log("Error");
        }}/>
      </Modal>
        </div>
    )
}
export default Orders;