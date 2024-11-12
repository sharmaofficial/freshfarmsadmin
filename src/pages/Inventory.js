
import { Button, Drawer, Image, Form, Layout, List, Modal, Switch, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { formatOrderDateTime, getUserData,formatInventoryDateTime, getApiCall, formatInventoryDataForTable, postApiCall } from '../utils';
import AddInventory from './AddInventory';
import UpdateStock from './UpdateStock';


const Inventory=()=>{

    const user = getUserData();
    console.log(user, "users")
    const [loading, setLoading] = useState(false);
    const [inventoryData, setInventoryData] = useState([]);
    const [columns, setColumns] = useState([]);
    // const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible]= useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editData, setEditData] = useState(null)
    const showModal = () => setIsAddModalVisible(true);
    
    const showEditModal=(data)=>{
        setIsEditModalVisible(true)
        setEditData(data);
    }
    const handleCancel = () => {
        setIsAddModalVisible(false);
         setIsEditModalVisible(false)
    }

    useEffect(() => {
        getInventoryData();
    },[]);

    async function handleInventoryActiveStatus(activeStatus, id){
        // debugger
        console.log(activeStatus);
        const payload={
            isActive:activeStatus,
            inventoryId:id
        }
        try {
            const response = await postApiCall('admin/updateInventoryStatus', payload, user.token);
            const {data, message: msg, status} = response.data;
            if(status){
              message.success("Status update successful!!");
              getInventoryData();
            } else {
             message.error("Status change failed!!")
            }
        } catch (error) {
            console.error("Submission error:", error);
        }
        
    }
    
    async function getInventoryData() {
        // debugger
        setLoading(true);
        try {
            if(user){
                const response = await getApiCall("admin/getInventory", user.token);
                console.log(response.data,"Inventory Data")
                const {data, status, message} = response.data;
                if(status){
                    const transformedArray = data.documents.map((item, index) => {
                        // debugger
                        const packageId = item?.packageId;
                        const productId = item?.productId;

                        return {
                            key: item?.$id,
                            id:item?.$id,
                            associatedProduct:productId.name,
                            package:packageId.name,
                            quantity: item?.quantity,
                            dateTime: formatInventoryDateTime(item?.$createdAt),
                            action:
                            <>
                                <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => showEditModal(item)}>Update Stock</Button>
                                {/* <Button style={{backgroundColor:'#2ecc72', color:'#fff'}} onClick={() => setSelectedUserToEdit(item)}>Delete</Button> */}
                                <Switch checked={item.isActive} onChange={(v) => handleInventoryActiveStatus(v, item.$id)} />
                            </>
                        }
                    });                
                    const {columns} = formatInventoryDataForTable(data.documents);
                    setColumns(columns);
                    setInventoryData(transformedArray);
                }
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
        onClick={showModal}
      >
        Add Inventory
      </Button>

      <Table 
        // title={() => 'Inventory logs'}
        loading={loading} 
        dataSource={inventoryData} 
        columns={columns}
        />
        <Modal
                title={isEditModalVisible ? "Update Stock" : "Add Inventory"}
                open={isAddModalVisible || isEditModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                {isEditModalVisible ? (
                    <UpdateStock editData={editData} onClose={handleCancel} />
                ) : (
                    <AddInventory onClose={handleCancel} />
                )}
            </Modal>

        </div>
    ) 
}

export default Inventory