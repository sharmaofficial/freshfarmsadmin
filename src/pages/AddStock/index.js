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
    const [loading, setLoading] = useState(false);
    const {userData} = useLocalStorage('user');
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
                console.log("filterePackages[0]?.packages", filterePackages[0]?.packages);
                const result = allPackages.map(item2 => {
                    console.log("item2", item2);
                    const match = filterePackages[0]?.packages?.find(item1 => item1.packageTypeId === item2._id);
                    console.log("matchd", match);

                    return {
                        ...item2,
                        currentQuantity: match ? match.quantity : 0,
                        updateQuantity: 0,
                        isActive: match?.isActive
                    };
                })
                // filterePackages[0]?.packages?.forEach(packageData => {
                //     allPackages.forEach(filteredPackage => {
                //         if(packageData.packageTypeId === filteredPackage._id){
                //             formattedData.push({
                //                 ...filteredPackage,
                //                 currentQuantity: packageData.qauntity,
                //                 updateQuantity: 0
                //             })
                //         }
                //     })
                // });
                setPackagesData(result);
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

    function handleUpdateQuantity(v, index) {
        let updatedPackages = [...packagesData];
        updatedPackages[index].updateQuantity = v.target.value;
        setPackagesData(updatedPackages);
    }

    async function handleUpdateInvetory(params) {
        setLoading(true);
        let payload = {
            productId: selectedProduct.id,
            packagesData: packagesData
        }
        try {
            if(userData){
                // const response = await getApiCall("", decryptToken(user.token, 'freshfarms'));
                const response = await postApiCall("admin/updateStock", payload ,userData.token);
                const {data, status, message} = response.data;
                let formattedData = [];
                data.packages.forEach(pack => {
                    formattedData.push({
                        ...pack,
                        currentQuantity: pack.qauntity,
                        updateQuantity: 0,
                    })
                })
                setPackagesData(formattedData)
            }
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    }

    async function handleProductPackageStateChange(packageId, value, index) {

        setLoading(true);
        let payload = {
            productId: selectedProduct.id,
            packageTypeId: packageId,
            status: value
        }
        try {
            if(userData){
                // const response = await getApiCall("", decryptToken(user.token, 'freshfarms'));
                const response = await postApiCall("admin/updateProductPackageStatus", payload ,userData.token);
                const {data, status, message} = response.data;

                if(status){
                    let updatedPackages = [...packagesData];
                    updatedPackages[index].isActive = value;
                    setPackagesData(updatedPackages);
                }
            }
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
        
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
                {
                    packagesData.map((packageDataa, index) => {
                        return(
                            <div style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                                <div>Package Name: {packageDataa.name} gm</div>                            
                                <Input
                                    value={packageDataa.updateQuantity || packageDataa.currentQuantity}
                                    size='sm'
                                    width='inherit'
                                    placeholder='Quantity'
                                    variant='outline'
                                    style={{marginBottom: 10}}
                                    onChange={(v) => handleUpdateQuantity(v, index)}
                                />
                                <Switch style={{marginLeft: 20}} checked={packageDataa.isActive} onChange={(v) => handleProductPackageStateChange(packageDataa._id, v, index)} />
                            </div>
                        )
                    })
                }
                
                {/* <Form.Item> */}
                    <Button onClick={handleUpdateInvetory}>
                        Submit
                    </Button>
                {/* </Form.Item> */}
            </FormControl>
        </Card>
    )
}

export default AddStock;