
import { Button, Drawer, Image, Layout, Form, Input, List, Modal, Switch, Table, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { formatProductDataForTable, getUserData, formatUsersDataForTable, getApiCall, postApiCall } from '../utils';
import AddProduct from './Add Product';

const Products = () => {
    const user = getUserData();
    const [loading, setLoading] = useState(false);
    const [userList, setUsersList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [shops, setshops] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedItemToEdit, setSelectedItemToEdit] = useState(null);
    const [editPrefill, setEditPrefill] = useState({});
    const [messageApi, contextHolder] = message.useMessage();

    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);


    useEffect(() => {
        getUsersList();
     },[]);

    const handleProductStateChange = async(id, status) =>{
        setLoading(true);
        let payload =  {id, isActive: status};
        try {
            const response = await postApiCall("admin/editProductStatus", payload, user.token);
            const {data, status, message} = response.data;
            if(status){
                getUsersList();
                messageApi.success(message);
            }else {
                messageApi.warning(message);
            }
        } catch(error){
            messageApi.error(message);
        }finally {
            setLoading(false);
        };
    }

    async function getUsersList() {
        setLoading(true);
        try {
            if(user){
                // const response = await getApiCall("", decryptToken(user.token, 'freshfarms'));
                const response = await getApiCall("admin/getProducts", user.token);
                const {data, status, message} = response.data;
                console.log(data, "product Data");
                console.log(status, "status");
                console.log(message, "message");
                setCategories(data.categories);
                setshops(data.shops);
                setProductTypes(data.productTypes);
                // console.log(message);

                // debugger
                if(status){
                    modifyAndStore(data);
                }
            }
            setLoading(false);
        } catch (error) {
            console.log("error ffhhfh", error);
            setLoading(false);
            message.error("Failed to load data")
        }
    };

    const modifyAndStore = (data) => {
        const transformedArray = data.products.map((item, index) => ({
                        
            key: item.$id,
            id: item.$id,
            name: item.name,
            description: item.description,
            image: <Image src={item.image} width={20} height={20} />,
            shopName: item.associated_shop?.name,
            category:item.category?.name ,
            price:"₹"+ item.price ,
            action:
            <>
                <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => openEditForm(item)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => handleDeleteProduct(item.$id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                <Switch style={{marginLeft:10}} checked={item.isActive} onChange={(v) => handleProductStateChange(item.$id, v)} />
            </>
        }));                
        const {columns} = formatProductDataForTable(data.products);
        setColumns(columns);
        setUsersList(transformedArray);
    }

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
        try {
            const response = await postApiCall("admin/addProduct", formData, user.token, true);
            const {data, message, status} = response.data;
            console.log("data", data);
            console.log("message", message);
            console.log("status", status);
            
            if(status){
                setIsAddModalVisible(false);
                messageApi.success(message);
                addProductToTable(data.id, data.imageUrl, formData);
                // getUsersList();

                // addProductToTable(data, formData)
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

    const addProductToTable = (productId, imageUrl, data) => {
        console.log("productId", productId);
        console.log("data", data);
        // {
        //     "name": "new product",
        //     "category": "6648a6f10025a1782129",
        //     "associated_shop": "66c9a7ee003b7882be2c",
        //     "productType": "66c9a86d001f504c1886",
        //     "image": {},
        //     "description": "new product",
        //     "estimated_delivery": "1 day",
        //     "price": "0.23"
        // }
        if(productId && data){
            let temp = [...userList];
            temp.push({
                key: productId,
                id: productId,
                name: data.name,
                description: data.description,
                image: <Image src={imageUrl} width={20} height={20} />,
                shopName: data.associated_shop,
                category: data.category ,
                price:"₹"+ data.price ,
                action:
                <>
                    <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => openEditForm(data)}>Edit</Button>
                        <Popconfirm
                            title="Are you sure you want to delete?"
                            onConfirm={() => handleDeleteProduct(productId)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    <Switch style={{marginLeft:10}} checked={false} onChange={(v) => handleProductStateChange(productId, v)} />
                </>
            });
            setUsersList(temp);
        }
    }

    function openEditForm(item){
        setIsEditModalVisible(true)
        setEditPrefill({
            name:item.name,
            $id: item.$id,
            image:item.image,
            isActive: item.isActive,
            description:item.description,
            category:item.category,
            estimated_delivery:item.estimated_delivery,
            price:item.price,
            associated_shop:item.associated_shop,
            productType:item.productType
        });
    }
    async function handleEditProduct(editParams){
        try {
            const response = await postApiCall("admin/editProduct", {...editParams, isActive: editPrefill.isActive}, user.token, true);
            const {data, message, status} = response.data;
            console.log(data);
            console.log(message);
            if(status){
                messageApi.success(message);
                getUsersList();
            }else{
                messageApi.error(message)
            }
        } catch (error) {
            console.log(error);
            messageApi.error(message)
        }
    }

    async function handleDeleteProduct(productId) {
        try {
          const response = await postApiCall("admin/deleteProduct", {id: productId}, user.token, false);
          const {data, message, status} = response.data;
          console.log(data);
          console.log(message);
          if(status){
              messageApi.success(message);
              getUsersList();
          }else{
          console.log(message);
              messageApi.error(message)
          }
      } catch (error) {
          console.log(error);
          messageApi.error(message)
      }
    }
    
    return(
        <div>
            {contextHolder}
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
        title={isEditModalVisible ? 'Edit Product' : 'Add Product'}
        open={isEditModalVisible || isAddModalVisible}
        footer={false}
        onCancel={() => {
          setIsEditModalVisible(false);
          setIsAddModalVisible(false);
        }}
      > 
        {isEditModalVisible
        ?
        <AddProduct productTypes={productTypes} shops={shops} categories = {categories} onUpdate={(data)=>handleEditProduct(data)} preFill={editPrefill}/>
        :
        <AddProduct productTypes={productTypes} shops={shops} categories = {categories} onSubmit = {(data)=>handleAddProduct(data)} preFill={false}/>}
      </Modal>
        </div>

        
    )
}
export default Products;