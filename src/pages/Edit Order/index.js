import { Button, Card, Form, Select, Typography, Input, message } from "antd"
import { formatOrderDateTime, getUserData, postApiCall } from "../../utils";
import { FormHelperText } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useLocalStorage from "../../utils/localStorageHook";
const { Paragraph, Text } = Typography;

const EditOrder = ({data, successCallback, errorCallback, prefill}) => {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const {userData} = getUserData();

    useEffect(() => {
        console.log("data", data);
        if(typeof data.products === 'string'){
            let newData = {
                ...data,
                products: JSON.parse(data.products),
            }
            setFormData({...newData})
            console.log("newData", newData);
        }else{
            setFormData({...data})
            console.log("data", data);
        }
    },[data]);

    async function updateOrder() {
        setLoading(true);
        try {
            const response = await postApiCall("admin/updateOrderStatus", {status: formData.orderStatus, id: formData.orderId}, userData.token);
            const {data, status, message} = response.data;
            setLoading(false);
            if(status){
                setFormData({});
                successCallback(message, data);
            }else{
                errorCallback(message)
            }
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            errorCallback(error.message);
        }
    }

    return(
        // <Card>
        <Form name ="editOrder" layout="vertical">
            <Form.Item style={{fontWeight: 'bold'}} label="Order Id">
            {/* <Text style={{fontWeight: 'bold', fontSize: 20}}>Order Id</Text> */}
            <Text copyable>{formData.orderId}</Text>
            </Form.Item>
            <Form.Item label="Order Date">
            <div>
                {/* <Text style={{fontWeight: 'bold', fontSize: 20}}>Order Date</Text> */}
                <Text>{formatOrderDateTime(formData.dateTime)}</Text>
            </div>
            </Form.Item>

            {
                formData?.products?.map(product => {
                    return(
                        <Form.Item>                        
                            <div style={{flexDirection: 'column'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20}}>Name: {product?.name}</Text>
                            </div>
                            <div style={{flexDirection: 'column'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20}}>Quantity: {product?.packageType?.name}gm * {product?.quantity}</Text>
                            </div>
                        </Form.Item>
                    )
                })
  
            }
            {
                <Form.Item label='Order Status'>
                    {/* <Text style={{fontWeight: 'bold', fontSize: 20}}>Order Status</Text> */}
                    <Select 
                        style={{width: '100%'}} 
                        value={formData?.orderStatus} 
                        placeholder="Select Order Status"
                        onChange={(v)=> setFormData({...formData, orderStatus: v})}
                        options={[{ value: 'Processing', label: <span>Processing</span> }, { value: 'In Transit', label: <span>In Transit</span> }, { value: 'Delivered', label: <span>Delivered</span> }]} 
                        disabled={formData?.orderStatus === 'Cancelled'}
                    />
                </Form.Item>
            }
            
            <Text style={{fontWeight: 'bold', fontSize: 15}}>Address details</Text>
            <Form.Item style={{marginLeft:'20', marginTop:'10px'}} >
                <Form.Item >
                {/* <Text style={{fontWeight: 'bold', fontSize: 20}}>Address details</Text> */}
                    {/* <FormHelperText>Recipient's Name</FormHelperText> */}
                    <Input
                        value={formData.address?.name}
                        size='sm'
                        width='inherit'
                        placeholder='Name'
                        // variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, name: v.target.value}}); console.log(v.target.value);}}
                    />
            </Form.Item>
            <Form.Item>
                    {/* <FormHelperText>Recipient's House No</FormHelperText> */}
                    <Input
                        value={formData.address?.houseNo}
                        size='sm'
                        width='inherit'
                        placeholder='House No'
                        // variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, houseNo: v.target.value}}); console.log(v.target.value);}}
                        // type="number"
                    />
            </Form.Item>
            <Form.Item>
                    {/* <FormHelperText>Landmark</FormHelperText> */}
                    <Input
                        value={formData.address?.landmark}
                        size='sm'
                        width='inherit'
                        placeholder='landmark'
                        // variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, landmark: v.target.value}}); console.log(v.target.value);}}
                    />
            </Form.Item>
            <Form.Item>
                    {/* <FormHelperText>Recipient's Phone Number</FormHelperText> */}
                    <Input
                        value={formData.address?.phoneNumber}
                        size='sm'
                        width='inherit'
                        placeholder='Phone Number'
                        // variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, phoneNumber: v.target.value}}); console.log(v.target.value);}}
                        type="number"
                    />
            </Form.Item>
            <Form.Item>
                    <Paragraph copyable>Phone : {formData.address?.phoneNumber}</Paragraph>
            </Form.Item>
            <Form.Item>
                    {/* <FormHelperText>Complete Address</FormHelperText> */}
                    <Input.TextArea
                        value={formData.address?.address}
                        size='sm'
                        width='inherit'
                        placeholder='Address'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, address: v.target.value}}); console.log(v.target.value);}}
                    />
            </Form.Item>
            <Form.Item>
                <Paragraph copyable>Complete Address : {formData.address?.address}</Paragraph>
            </Form.Item>
            </Form.Item>

            <div>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Payment details</Text>
                {
                    formData.paymentDetails ?
                    <>                    
                        <Paragraph copyable>Cashfree Order Id : {formData.paymentDetails?.cf_order_id}</Paragraph>
                        <Paragraph>Amount : {formData.paymentDetails?.order_amount}</Paragraph>
                        <Paragraph>Payment Status : {formData.paymentDetails?.order_status}</Paragraph>
                        <Paragraph>Payment link : <Text copyable>{formData.paymentDetails.payments?.url}</Text></Paragraph>
                    </>
                    :
                    <Paragraph>None</Paragraph>
                }
            </div>
            <div style={{marginTop: 10}}>
                <Button onClick={updateOrder} disabled={loading}>Update</Button>
            </div>
            </Form>
        // </Card>
    )
};

export default EditOrder;