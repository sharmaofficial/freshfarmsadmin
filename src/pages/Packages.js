
import { Alert, Button, Drawer, Form, Image, Layout, List, Modal, Switch, Table, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { formatProductDataForTable, getUserData, formatPackageDataForTable, getApiCall, postApiCall } from '../utils';
import AddCategory from './Add Category';
import AddPackage from './Add Package';

const Packages = () => {
    const user = getUserData();
    console.log(user, "users")
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [columns, setColumns] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editPrefill, setEditPrefill] = useState({});
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();       
    const [showAddAlertSuccess, setShowAddAlertSuccess] = useState(false);
    const [showErrorAddFail, setErrorAddFail] = useState(false)

    const [form] = Form.useForm();

    useEffect(() => {
        getUsersList();
    },[]);

    async function getUsersList() {
        setLoading(true);
        try {
            if(user){
                // debugger
                // const response = await getApiCall("", decryptToken(user.token, 'freshfarms'));
                const response = await getApiCall("admin/getPackages", user.token);
                const {data, status, message} = response.data;
                console.log(data);
                console.log(message);
                if(status){
                    const transformedArray = data.map((item, index) => ({
                        key: item.$id,
                        id: item.$id,
                        weigth: Math.abs(Number(item.name)), //This logic needs to be changed. Numbers are coming as strings
                        action:
                        <>
                            {/* <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => openEditForm(item)}>Edit</Button> */}
                            <Button danger style={{ marginRight: 10}} onClick={() => handleDeletePackage(item.$id)}>Delete</Button>
                            <Switch checkedChildren="Active" unCheckedChildren="InActive" checked={item.isActive} onChange={(v) => handleEditPackage(v, item.$id)} />
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

    async function handleAddPackage(formData) {
        try {
            const response = await postApiCall("admin/addPackage", formData, user.token);
            const {data, message:msg, status} = response.data;
            console.log(response,"response");
            
            if(status){
                message.success(msg || "Package added successfully!!");
                getUsersList();
                setIsAddModalVisible(false)
                setShowAddAlertSuccess(true)
                
                //TODO: Api return the updated data row, use this instead of calling the api again
                // setUsersList([...userList, data]);
            }else{
                messageApi.error(message)
                showErrorAddFail(true)
                // setIsAddModalVisible(false)
            }
        } catch (error) {
            console.log(error);
            messageApi.error(message)
            setErrorAddFail(true)
        }
    }
    function openEditForm(item){
        setIsEditModalVisible(true)
        setEditPrefill({
            name:item.name,
            id:item.$id
        })
    }


    async function handleEditPackage(editParams, id) {
        // editParams= {...editParams, $id:editPrefill.$id}
        console.log(editParams,"EDIT");
        // editParams={...editParams, $id:id}
        const payload={isActive:editParams, id:id}
        // debugger
        // console.log(typeof editParams.isActive, "Type of isactive");
        
        try {
            const response = await postApiCall("admin/editPackage", payload, user.token, false);
            const {data, message:msg, status} = response.data;
            console.log(data);
            console.log(message);
            if(status){
                message.success(msg||"Status Updated Successfully!");
                getUsersList();

            }else{
                message.error(msg||"Status update failed!!")
            }

        } catch (error) {
            console.log(error);
            messageApi.error(message)
        }
    }

    const showAddPackagesModal= () => {
        form.resetFields();
        setIsAddModalVisible(true);

    }


    async function handleDeletePackage(packageId) {
        // debugger
        try {
          const response = await postApiCall("admin/deletePackage", {id: packageId}, user.token, false);
          const {data, message : msg, status} = response.data;
          console.log(data);
          console.log(message);
          if(status){
              message.success(msg || "Package deleted Successfully");
              getUsersList();
          }else{
          console.log(message);
              message.error(msg || "Error Deleting package!!")
          }
      } catch (error) {
          console.log(error);
          message.error("Error Deleting package!!")
      }
    }
    
    return(
        <div style={{minWidth:'24cm'}}>
        {
            showAddAlertSuccess&& (
                <Alert
                message="Package Successfully added!"
                type='success'
                closable = {true}
                showIcon={true}
                onClose={()=>setShowAddAlertSuccess(false)}
                />
            )
        }
        {
            showErrorAddFail&& (
                <Alert
                message=" Create package failed!!! Try after sometime or contact your Administrator"
                type='error'
                closable = {true}
                showIcon={true}
                onClose={()=>setErrorAddFail(false)}
                />
            )
        }
       <h1>Packages</h1>
        <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={showAddPackagesModal}
      >
        Add Package
      </Button>
        <Table 
        title={() => 'Packages'}
        loading={loading} 
        dataSource={userList} 
        columns={columns} 
        />
    <Modal
        title={isEditModalVisible ? 'Edit Package' : 'Add New Package'}
        open={isAddModalVisible || isEditModalVisible}
        footer={null}
        onCancel={() => {
          setIsEditModalVisible(false);
          setIsAddModalVisible(false);
        //   setEditingProduct(null);
        }}
        // onOk={}
      >
        {
         isEditModalVisible
            ?
            <AddPackage onEdit={(data)=>handleEditPackage(data)} preFill={editPrefill}/>
            :
            <AddPackage onSubmit = {(data)=>handleAddPackage(data)} />
        }
      </Modal>
        </div>
    )
}
export default Packages;