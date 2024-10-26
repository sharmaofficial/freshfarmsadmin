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

const AddProduct = ({onSubmit, categories, preFill, formName, onUpdate}) => {
    
    const formRef = useRef();
    const [isEdit, setIsEdit] = useState(false);
    const [shops, setShops] = useState([
        {
            key: `1`,
            label: `Fresh Farms`
        },
        {
            key: `2`,
            label: `Shop 1`
        },
    ]);
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

    const [formData, setFormaData] = useState({
        name: "",
        // coverImage: null,
        // categoryId: "",
        category:"",
        associated_shop:"66c9a7ee003b7882be2c",
        productType: "66c9a86d001f504c1886",
        // shopName: "",
        image:{
            type: ""
        },
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
                imageURI: preFill.coverImage,
                isActive: preFill.isActive,
                description: preFill.description,
                estimated_delivery: preFill.estimated_delivery,
                price: preFill.price,
                categoryId: preFill.categoryId,
                shopName: preFill.shopName,
                _id: preFill._id
            });
            formRef.current.setFieldsValue({
                ...formData,
                Name: preFill.name,
                Description: preFill.description,
                Delivery: preFill.estimated_delivery,
                Price: preFill.price,
                active: preFill.isActive
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
        let label = shops[Number(e.keyPath[0]) - 1].label
        let key = shops[Number(e.keyPath[0]) - 1].key;

        setSelectedShop({
            id: key,
            name: label
        });
        setFormaData(
            {
                ...formData,
                // shopName: label
                associated_shop: "66c9a7ee003b7882be2c",
                productType: "66c9a86d001f504c1886",
                
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
            image: {
                type: event.target.files[0].type
            }
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
                        items: shops,
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
                    <Button onClick={() => {isEdit ? onUpdate(formData) : onSubmit(formData)}} style={{background:'#1677ff', color:"#fff"}}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default AddProduct;