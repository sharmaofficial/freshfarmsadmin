import { Button, Card, Dropdown, Form, Input, Space, Upload, message } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
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

const AddProduct = ({onSubmit, categories}) => {

    const [formData, setFormaData] = useState({
        name: "",
        coverImage: null,
        categoryId: "",
        image:{
            type: ""
        },
        description: "",
        estimated_delivery: "",
        price: 0
    });

    const [items, setitems] = useState([])
    const [selectedCategory, setSelectedCategory] = useState({
        id: "",
        name: ""
    })

    useEffect(() => {
        let temp = categories.map(item => {
            return{
                key: item._id,
                label: item.name
            }
        });
        setitems(temp);
    },[categories]);

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
                categoryId: e.key
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
            coverImage: base64Data,
            image: {
                type: event.target.files[0].type
            }
        })
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
        <Card style={{margin: 10}}>
            <Title level={4} style={{marginBottom: 20}}>Add Product</Title>
            <div style={{marginBottom: 20}}>
                <Dropdown
                    menu={menuProps}
                    
                >
                    <Button>
                        <Space>
                            {selectedCategory.name || 'Select Category'}
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <Form name='Add Product'>
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
                <Form.Item>
                    <Button onClick={() => onSubmit(formData)}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default AddProduct;