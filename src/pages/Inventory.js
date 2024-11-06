
import { Button, Drawer, Image, Form, Layout, List, Modal, Switch, Table, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { formatOrderDateTime, getUserData,formatInventoryDateTime, formatLogsDataForTable, getApiCall, postApiCall } from '../utils';
import AddStock from './AddStock';


const Inventory=()=>{

    const user = getUserData();
    console.log(user, "users")
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        getInventoryData();
    },[]);
    
    async function getInventoryData() {
        // debugger
        setLoading(true);
        try {
            if(user){
                const response = await getApiCall("admin/getInventory", user.token);
                console.log(response.data,"Inventory Data")
                const {data, status, message} = response.data;
                // if(status){
                //     const transformedArray = data.documents.map((item, index) => {
                //         return {
                //             key: item?.id,
                //             orderId: item?.orderId,
                //             orderType: item?.orderType,
                //             dateTime: formatInventoryDateTime(item?.createdAt),
                //             action:
                //             <>
                //                 <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => setSelectedUserToEdit(item)}>Edit</Button>
                //                 {/* <Button style={{backgroundColor:'#2ecc72', color:'#fff'}} onClick={() => setSelectedUserToEdit(item)}>Delete</Button> */}
                //                 {/* <Switch checked={item.isActive} onChange={(v) => handleCategoryStateChange(v, item._id)} />*/}
                //             </>
                //         }
                //     });                
                //     const {columns} = formatLogsDataForTable(data.documents);
                //     setColumns(columns);
                //     setUsersList(transformedArray);
                // }
            }
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    return(
        <div style={{minWidth:'24cm'}}>
        <h1>Inventory</h1>
        <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        // onClick={showAddProductModal}
      >
        Add Inventory
      </Button>

      <Table 
        // title={() => 'Inventory logs'}
        loading={loading} 
        dataSource={userList} 
        columns={columns}
        />
        <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={isEditModalVisible || isAddModalVisible}
        footer={false}
        onCancel={() => {
          setIsEditModalVisible(false);
          setIsAddModalVisible(false);
          setEditingProduct(null);
        }}
      >
        {/* <AddStock categories = {categories} onSubmit = {(data)=>handleInventoryUpdate(data)} /> */}
      </Modal>
        </div>
    ) 
}

export default Inventory