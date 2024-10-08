
import { Button, Drawer, Image, Layout, Form, List, Modal, Switch, Table, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { formatProductDataForTable, getUserData, formatCategoryDataForTable, getApiCall, postApiCall } from '../utils';
import AddCategory from './Add Category';

const Categories = () => {
    const user = getUserData();
    console.log(user, "users")
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
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
                const response = await getApiCall("admin/getCategories", user.token);
                const {data, status, message} = response.data;
                console.log("data", data);
                if(status){
                    const transformedArray = data.documents.map((item, index) => ({
                        key: item.$id,
                        id: item.$id,
                        name: item.name,
                        image: <Image src={item.Image} width={40} height={40} />,
                        action: <>
                                    <Button color="primary" variant="outlined" style={{ marginRight: 10}} /*onClick={() => setSelectedUserToEdit(item)}*/>Edit</Button>
                                    <Button danger style={ {marginRight: 10}} /*onClick={() => handleDeleteCategory(item.$id)}*/>Delete</Button>
                                    {/* <Switch checked={item.isActive} onChange={(v) => handleCategoryStateChange({...item, isActive: v})} /> */}
                                </>
                    }));                
                    const {columns} = formatCategoryDataForTable(data.documents);
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

    async function handleAddCategory(updatedCategory) {
        console.log("updatedCategory", updatedCategory);
        let payload = {
            name: updatedCategory.name,
            isActive: updatedCategory.isActive,
            _id: updatedCategory.$id,
            __v: updatedCategory.__v,
        }
        try {
            const response = await postApiCall("admin/editCategory", payload, user.token);
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

    const showAddCategoryModal= () => {
        form.resetFields();
        setIsAddModalVisible(true);
    }

    return(
        <div style={{minWidth:'24cm'}}>
        <h1>Categories</h1>
        <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={showAddCategoryModal}
      >
        Add Category
      </Button>
        <Table 
        title={() => 'Categories'}
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
        <AddCategory categories = {categories} onAdd = {(data)=>handleAddCategory(data)} />
      </Modal>
        </div>
    )
}
export default Categories;