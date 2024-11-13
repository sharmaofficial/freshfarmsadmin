
import { Button, Drawer, Image, Layout, Form, List,Typography, Modal, Switch, Table, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { formatProductDataForTable, getUserData, formatCategoryDataForTable, getApiCall, postApiCall } from '../utils';
import AddCategory from './Add Category';
import axios from 'axios';

const Categories = () => {
    const user = getUserData();
    console.log(user, "users")
    const{Text} = Typography
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editPrefill, setEditPrefill] = useState({});
    const [showAddAlertSuccess, setShowAddAlertSuccess] = useState(false);
    const [showErrorAddFail, setErrorAddFail] = useState(false)
    // const [openEditForm, setOpenEditForm] = useState(false);
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
                // debugger
                if(status){
                    const transformedArray = data.documents.map((item, index) => ({
                        key: item.$id,
                        id: item.$id,
                        name: item.name,
                        image: <Image src={item.Image} width={40} height={40} />,
                        status:item.isActive?<Text type='success' >Active</Text>:<Text type='danger' >InActive</Text>,
                        action: <>
                                    <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => openEditForm(item.name, item.$id, item.Image, item.isActive)}>Edit</Button>
                                    <Button danger style={ {marginRight: 10}} onClick={() => handleDeleteCategory(item.$id)}>Delete</Button>
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

    async function handleDeleteCategory(categoryId) {
        try {
            const response = await postApiCall("admin/deleteCategory", {id: categoryId}, user.token, false);
            const {data, message : msg, status} = response.data;
            if(status){
                message.success(msg || "Category deleted");
                getUsersList();
            }else{
            console.log(message);
                message.error(msg || "Error deleting category")
            }
        } catch (error) {
            console.log(error);
            message.error("Error Deleting category")
        }
    }

    async function handleAddCategory(formData) {
        // console.log("updatedCategory", updatedCategory);
        // debugger
        // let payload = {
        //     name: updatedCategory.name,
        //     isActive: updatedCategory.isActive,
        //     _id: updatedCategory.$id,
        //     __v: updatedCategory.__v,
        // }
        formData={...formData, isActive:true} //check
        try {
            const response = await postApiCall("admin/addCategory", formData, user.token, true);
            const {data, message : msg, status} = response.data;
            console.log(data);
            console.log(message);
            if(status){
                setIsAddModalVisible(false)
                message.success(msg || "Category added succesfully!");
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
            console.log(message);

                message.error(msg || "Error Adding Category!!")
            }
        } catch (error) {
            console.log(error);
            message.error("Error Adding Category!!")
        }
    }

    function openEditForm(categoryName, categoryId, categoryImage, isActive){
        setIsEditModalVisible(true)
        setEditPrefill({
            name:categoryName,
            $id: categoryId,
            Image:categoryImage,
            isActive:isActive
        })
    }

    async function handleEditCategory(editParams) {
        console.log(editPrefill,"EDIT");
        
        // console.log(typeof editParams.isActive, "Type of isactive");
        
        try {
            const response = await postApiCall("admin/editCategory", editParams, user.token, true);
            const {data, message:msg, status} = response.data;
            console.log(data);
            console.log(message);
            if(status){
                message.success(msg||"Updated Successfully");
                setIsEditModalVisible(false)
                getUsersList();

            }else{
                message.error(msg || "Error Updating ")
            }

        } catch (error) {
            console.log(error);
            messageApi.error("Error Updating")
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
        title={isEditModalVisible ? 'Edit Category' : 'Add New Category'}
        open={isEditModalVisible || isAddModalVisible}
        footer={false}
        onCancel={() => {
          setIsEditModalVisible(false);
          setIsAddModalVisible(false);
          setEditingProduct(null);
        }}
      >
        
        {isEditModalVisible
        ?
        <AddCategory onUpdate={(data)=>handleEditCategory(data)} preFill={editPrefill}/>:
        <AddCategory onAdd = {(data)=>handleAddCategory(data)} preFill={false}/>}
      </Modal>
        </div>
    )
}
export default Categories;