import { Button, Card, Dropdown, Form, Image, Space, Switch, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { InboxOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import Title from 'antd/es/typography/Title';
import { getApiCall, postApiCall } from '../../utils';
import useLocalStorage from '../../utils/localStorageHook';
import { FormControl, FormHelperText, Input, Textarea } from "@chakra-ui/react";

const AddStock = ({onAdd, onUpdate, formName, preFill}) => {
    const { Dragger } = Upload;
    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const {userData} = useLocalStorage('user');
    const [isEdit, setIsEdit] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [productsList, setProductsList] = useState([]);
    const [packagesData, setPackagesData] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({
        id: "",
        name: ""
    });
    const [formData, setFormaData] = useState({
        productId: ''
    });


    useEffect(() => {
        getProducts()
    },[]);

    useEffect(() => {
        if(selectedProduct.id){
            getPackagesForSelectedProduct()
        }else{
            
        }
    },[selectedProduct]);

    async function getPackagesForSelectedProduct() {
        setLoading(true);
        try {
            if(userData){
                // const response = await getApiCall("", decryptToken(user.token, 'freshfarms'));
                const response = await postApiCall("admin/getPackageByProductId",{productId: selectedProduct.id},userData.token);
                const {data, status, message} = response.data;
                const {allPackages, filterePackages} = data;
                let formattedData = [];
                filterePackages[0]?.packages?.forEach(packageData => {
                    allPackages.forEach(filteredPackage => {
                        if(packageData.packageTypeId === filteredPackage._id){
                            formattedData.push({
                                ...filteredPackage,
                                currentQuantity: packageData.qauntity,
                                updateQuantity: 0
                            })
                        }
                    })
                });
                setPackagesData(formattedData);
            }
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    }

    async function getProducts() {
        setLoading(true);
        try {
            if(userData){
                // const response = await getApiCall("", decryptToken(user.token, 'freshfarms'));
                const response = await getApiCall("admin/getProducts", userData.token);
                const {data, status, message} = response.data;
                console.log(data.products);
                let temp = data.products.map(item => {
                    return{
                        key: item._id,
                        label: item.name
                    }
                });
                setProductsList(temp)
            }
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    }

    async function onChange(event) {
        const base64 = await convertBase64(event.target.files[0]);
        const base64Data = base64.split(',')[1];

        setFormaData({
            ...formData,
            coverImage: base64Data,
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

    function handleChangeStatus(v) {
        setFormaData({
            ...formData,
            isActive: v
        })
    }

    function handleMenuClick(e) {
        productsList.map(product => {
            if(product.key === e.key){
                setSelectedProduct({
                    id: product.key,
                    name: product.label
                });
            }
        });
        setFormaData(
            {
                ...formData,
                productId: e.key
            }
        )
    }

    return(
        <Card style={{margin: 10}}>
            <Title level={4} style={{marginBottom: 20}}>{formName || 'Add Stock'}</Title>
            <div style={{marginBottom: 20}}>
                <Dropdown
                    menu={{
                        items: productsList,
                        onClick: handleMenuClick
                    }}
                    
                >
                    <Button>
                        <Space>
                            {selectedProduct.name || 'Select Product'}
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <FormControl>
                    {/* <FormHelperText>Recipient's Name</FormHelperText>
                    <Input
                        value={formData.address?.name}
                        size='sm'
                        width='inherit'
                        placeholder='Name'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, name: v.target.value}}); console.log(v.target.value);}}
                    /> */}
                {
                    packagesData.map(packageDataa => {
                        console.log("packageDataa", packageDataa);
                        return(
                            <>
                                <div>Package Name: {packageDataa.name}</div>                            
                                <Input
                                    value={packageDataa.currentQuantity}
                                    size='sm'
                                    width='inherit'
                                    placeholder='Quantity'
                                    variant='outline'
                                    // onChange={(v) => {setFormData({...formData, address:{...formData.address, name: v.target.value}}); console.log(v.target.value);}}
                                    disabled
                                />
                            </>
                        )
                    })
                }
                
                {/* <Form.Item> */}
                    <Button onClick={() =>{isEdit ? onUpdate(formData) : onAdd(formData)}}>
                        Submit
                    </Button>
                {/* </Form.Item> */}
            </FormControl>
        </Card>
    )
}

export default AddStock;