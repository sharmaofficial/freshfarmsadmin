import { Button, Card, Dropdown, Form, Image, Input, Space, Upload, message } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import Title from 'antd/es/typography/Title';

// const items = [
//     {
//       label: '1st menu item',
//       key: '1',
//       icon: <UserOutlined />,
//     },
//     {
//       label: '2nd menu item',
//       key: '2',
//       icon: <UserOutlined />,
//     },
//     {
//       label: '3rd menu item',
//       key: '3',
//       icon: <UserOutlined />,
//       danger: true,
//     },
//     {
//       label: '4rd menu item',
//       key: '4',
//       icon: <UserOutlined />,
//       danger: true,
//       disabled: true,
//     },
//   ];
//   const menuProps = {
//     items,
//     // onClick: handleMenuClick,
//   };

const AddProduct = ({onSubmit, categories, preFill, formName, onUpdate, shops, productTypes}) => {
    
    const formRef = useRef();
    const [isEdit, setIsEdit] = useState(false);
    const [shopList, setShops] = useState(shops);
    const [productTypesList, setProductTypes] = useState(shops);
    const [isTouched, setIsTouched] = useState(false);
    const [items, setitems] = useState([])
    const [selectedCategory, setSelectedCategory] = useState({
        id: "",
        name: ""
    });
    const [selectedShop, setSelectedShop] = useState({
        id: "",
        name: ""
    })
    const [selectedProductType, setselectedProductType] = useState({
        id: "",
        name: ""
    })
    const [formData, setFormaData] = useState({
        name: "",
        // coverImage: null,
        // categoryId: "",
        category:"",
        associated_shop:"",
        productType: "",
        // shopName: "",
        image:{},
        // image:{
        //     type: ""
        // },
        description: "",
        estimated_delivery: "",
        price: 0
    });

    useEffect(() => {
        setIsTouched(false);
        if(preFill){
            setSelectedCategory({
                id: "",
                name: ""
            })
            setIsEdit(true);
            setFormaData({
                ...formData,
                name: preFill.name,
                // imageURI: preFill.coverImage,
                isActive: preFill.isActive,
                description: preFill.description,
                estimated_delivery: preFill.estimated_delivery,
                price: preFill.price,
                category: preFill.category,
                image:preFill.image,
                // shopName: preFill.shopName,
                $id: preFill.$id
            });
            formRef.current.setFieldsValue({
                ...formData,
                Name: preFill.name,
                Description: preFill.description,
                Delivery: preFill.estimated_delivery,
                category: preFill.category,
                Price: preFill.price,
                active: preFill.isActive,
                image:preFill.image
            });
        }else{
            setIsEdit(false);
        }
    },[preFill])

    useEffect(() => {
        let temp = categories.map(item => {
            if(isEdit){
                if(item._id === preFill.categoryId){
                    setSelectedCategory({
                        id: item._id,
                        name: item.name
                    })
                }
            }
            return{
                key: item.$id,
                label: item.name
            }
        });
        let updatedShops = shops.map(item => {
            if(isEdit){
                if(item.label === preFill.shopName){
                    setSelectedShop({
                        id: item.key,
                        name: item.label
                    })
                }
            }
            return{
                key: item.key,
                label: item.label
            }
        });
        setitems(temp);
        setShops(updatedShops);
    },[categories, preFill]);

    useEffect(() => {
        let updatedShops = shops.map(item => {
            if(isEdit){
                if(item.$id === preFill.associated_shop.$id){
                    setSelectedShop({
                        id: item._id,
                        name: item.name
                    })
                }
            }
            return{
                key: item.$id,
                label: item.name
            }
        });
        setShops(updatedShops);
    },[shops, preFill]);

    useEffect(() => {
        let updatedProductTypes = productTypes.map(item => {
            if(isEdit){
                if(item.$id === preFill.productType.$id){
                    setselectedProductType({
                        id: item.$id,
                        name: item.name
                    })
                }
            }
            return{
                key: item.$id,
                label: item.name
            }
        });
        setProductTypes(updatedProductTypes);
    },[productTypes, preFill]);

    function handleMenuClick(e) {
        console.log(e.key);
        items.map(category => {
            if(category.key === e.key){
                setSelectedCategory({
                    id: category.key,
                    name: category.label
                });
            }
        });
        setFormaData(
            {
                ...formData,
                category: e.key
            }
        )
    }

    function handleShopSelect(e) {
        shops.map(shop => {
            if(shop.$id === e.key){
                setSelectedShop({
                    id: shop.key,
                    name: shop.name
                });
            }
        });
        setFormaData(
            {
                ...formData,
                associated_shop: e.key
            }
        )
    }

    function handleProductTypeSelect(e) {
        productTypes.map(type => {
            if(type.$id === e.key){
                setselectedProductType({
                    id: type.key,
                    name: type.name
                });
            }
        });
        setFormaData(
            {
                ...formData,
                productType: e.key
            }
        )
    }

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    async function onChange(event) {
        const base64 = await convertBase64(event.target.files[0]);
        const base64Data = base64.split(',')[1];

        setFormaData({
            ...formData,
            // coverImage: base64Data,
            image: event.target.files[0]
            // {
            //     type: event.target.files[0].type,
            //     data:base64Data
            // }
        });
        setIsTouched(true);
    }

    function convertBase64(file){
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result);
          }
          fileReader.onerror = (error) => {
            reject(error);
          }
        })
    }

    return(
        <Card style={{margin: 10, border:0}}>
            {/* <Title level={4} style={{marginBottom: 20}}>{formName || 'Add Product'}</Title> */}
            <div style={{marginBottom: 20}}>
                <Dropdown
                    menu={{
                        items,
                        onClick: handleMenuClick,
                    }}
                >
                    <Button>
                        <Space>
                            {selectedCategory.name || 'Select Category'}
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <div style={{marginBottom: 20}}>
                <Dropdown
                    menu={{
                        items: shopList,
                        onClick: handleShopSelect
                    }}
                >
                    <Button>
                        <Space>
                            {selectedShop.name || 'Select Shop Name'}
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <div style={{marginBottom: 20}}>
                <Dropdown
                    menu={{
                        items: productTypesList,
                        onClick: handleProductTypeSelect
                    }}
                >
                    <Button>
                        <Space>
                            {selectedProductType.name || 'Select Product Type'}
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <Form ref={formRef}  name={formName || 'Add Product'}>
                <Form.Item name="Name" label="Name">
                    <Input
                        name='Product Name'
                        placeholder='Name'
                        onChange={(e) => setFormaData({...formData, name: e.target.value})}
                        value={formData.name}
                    />
                </Form.Item>
                <Form.Item name="Description" label="Description">
                    <Input
                        name='Description'
                        placeholder='Description'
                        onChange={(e) => setFormaData({...formData, description: e.target.value})}
                        value={formData.description}
                    />
                </Form.Item>
                <Form.Item name="Delivery" label="Delivery">
                    <Input
                        name='Estimated Delivery'
                        placeholder='Estimated Delivery Time'
                        onChange={(e) => setFormaData({...formData, estimated_delivery: e.target.value})}
                        value={formData.estimated_delivery}
                    />
                </Form.Item>
                <Form.Item name="Price" label="Price per gram">
                    <Input
                        name='Price'
                        placeholder='Price per gram'
                        onChange={(e) => setFormaData({...formData, price: e.target.value})}
                        value={formData.price}
                        type='number'
                        min={1}
                    />
                </Form.Item>
                <Form.Item name="Product Image" label="Product Image">
                    <input 
                        ref="file" type="file" name="file" 
                        className="upload-file" 
                        id="file"
                        onChange={onChange}
                        encType="multipart/form-data" 
                        required
                    />
                </Form.Item>
                {/* {
                    isEdit ?
                    !isTouched ?
                    <div style={{marginTop: 10, marginBottom: 10}}>                        
                        <Image
                            src={formData.imageURI}
                            width={200}
                        />
                    </div>
                    :
                    <div style={{marginTop: 10, marginBottom: 10}}>                        
                        <Image
                            src={`data:image/png;base64,${formData.coverImage}`}
                            width={200}
                        />
                    </div>
                    :
                    null
                } */}
                <Form.Item style={{display:'flex', justifyContent:'end'}}>
                    <Button 
                    disabled={formData.name=="" || formData.description=="" || formData.estimated_delivery==""|| formData.price==""}
                    onClick={() => {isEdit ? onUpdate(formData) : onSubmit(formData)}} style={{background:'#1677ff', color:"#fff"}}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default AddProduct;