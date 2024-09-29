
import { Button, Drawer, Form, Image, Layout, List, Modal, Switch, Table, message } from 'antd';
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
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const [form] = Form.useForm();

    useEffect(() => {
        getUsersList();
    },[]);

    async function getUsersList() {
        setLoading(true);
        try {
            if(user){
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
                            <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => setSelectedUserToEdit(item)}>Edit</Button>
                            <Button danger style={{backgroundColor:'#f2564b', color:'#fff', marginRight: 10}} onClick={() => setSelectedUserToEdit(item)}>Delete</Button>
                            {/* <Switch checked={item.isActive} onChange={(v) => handleCategoryStateChange(v, item.$id)} /> */}
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
            console.log(formData, 'formdata');
            const response = await postApiCall("admin/addPackage", formData, user.token);
            const {data, message, status} = response.data;
            console.log(response,"response");
            
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

    const showAddPackagesModal= () => {
        form.resetFields();
        setIsAddModalVisible(true);
    }
    
    return(
        <div>
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
        title={"Add New Category"}
        open={isAddModalVisible}
        footer={null}
        onCancel={() => {
        //   setIsEditModalVisible(false);
          setIsAddModalVisible(false);
        //   setEditingProduct(null);
        }}
        // onOk={}
      >
        <AddPackage onSubmit = {(data)=>handleAddPackage(data)} />
      </Modal>

        </div>
    )
}
export default Packages;