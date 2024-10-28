
import { Button, Drawer, Image, Layout, Form, Input, List, Modal, Switch, Table, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { formatProductDataForTable, getUserData, formatUsersDataForTable, getApiCall, postApiCall } from '../utils';
import AddProduct from './Add Product';

const Products = () => {
    const user = getUserData();
    console.log(user, "users")
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedItemToEdit, setSelectedItemToEdit] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);


    useEffect(() => {
        getUsersList();
     },[]);

     const handleProductStateChange = () =>{
        console.log("")
     }

    async function getUsersList() {
        setLoading(true);
        console.log("Get user")
        try {
            if(user){
                // const response = await getApiCall("", decryptToken(user.token, 'freshfarms'));
                const response = await getApiCall("admin/getProducts", user.token);
                const {data, status, message} = response.data;
                console.log(data, "product Data");
                setCategories(data.categories)
                console.log(message);
                if(status){
                    const transformedArray = data.products.map((item, index) => ({
                        key: item.$id,
                        id: item.$id,
                        name: item.name,
                        description: item.description,
                        image: <Image src={item.image} width={20} height={20} />,
                        shopName: item.shopName,
                        action:
                        <>
                            <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => setSelectedItemToEdit(item)}>Edit</Button>
                            <Button danger onClick={() => setSelectedItemToEdit(item)}>Delete</Button>
                            {/* <Switch style={{marginLeft:10}} checked={item.isActive} onChange={(v) => handleProductStateChange({...item, isActive: v})} /> */}
                        </>
                    }));                
                    const {columns} = formatProductDataForTable(data.products);
                    setColumns(columns);
                    setUsersList(transformedArray);
                }
            }
            setLoading(false);
        } catch (error) {
            console.log("error ffhhfh", error);
            setLoading(false);
        }
    };

    const showAddProductModal= () => {
        form.resetFields();
        setIsAddModalVisible(true);
    }

    // const handleSave = (values) => {
    //     if (editingProduct) {
    //       // Update existing Product
    //       setProducts(products.map(prod => prod.key === editingProduct.key ? { ...prod, ...values } : prod));
    //       message.success('Product updated successfully.');
    //     } else {
    //       // Add new user
    //       const newProducts = {
    //         key: (products.length + 1).toString(),
    //         ...values
    //       };
    //       setProducts([...products, newProducts]);
    //       message.success('Product added successfully.');
    //     }
    //     setIsEditModalVisible(false);
    //     setIsAddModalVisible(false);
    //     setEditingProduct(null);
    //   };

    async function handleAddProduct(formData) {
        console.log("formData", formData);

        const payload = new FormData();
       await Object.keys(formData).forEach((key)=>{
            payload.append(key, formData[key]);
            // console.log(key,"key");
            
        })
        for (let [key, value] of payload.entries()) {
            console.log(`${key}: ${value}`);
          }
        // debugger
        try {
            const response = await postApiCall("admin/addProduct", payload, user.token);
            console.log("response", response);
            const {data, message, status} = response.data;
            console.log("Data", data);
            console.log("message", message)
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
    
    return(
        <div>
        <h1>Products</h1>
        <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={showAddProductModal}
      >
        Add Product
      </Button>
        <Table 
        title={() => 'Products'}
        loading={loading} 
        dataSource={userList} 
        columns={columns} 
        />
    
     {/* Modal for editing and adding user */}
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
        <AddProduct categories = {categories} onSubmit = {(data)=>handleAddProduct(data)} />
      </Modal>
        </div>

        
    )
}
export default Products;