import { Button, Card, Select, Typography } from "antd"
import { formatOrderDateTime, postApiCall } from "../../utils";
import { FormControl, FormHelperText, Input, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useLocalStorage from "../../utils/localStorageHook";
const { Paragraph, Text } = Typography;

const EditOrder = ({data, successCallback, errorCallback}) => {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const {userData} = useLocalStorage('user');

    useEffect(() => {
        setFormData({...data})
        console.log("data", data);
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
        <Card>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>Order Id</Text>
            <Paragraph copyable>{formData.orderId}</Paragraph>
            <div>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Order Date</Text>
                <Paragraph>{formatOrderDateTime(formData.dateTime)}</Paragraph>
            </div>

            {
                formData?.products?.map(product => {
                    return(
                        <>                        
                            <div style={{flexDirection: 'column'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20}}>Name: {product?.name}</Text>
                            </div>
                            <div style={{flexDirection: 'column'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 20}}>Quantity: {product?.packageType?.name}gm * {product?.quantity}</Text>
                            </div>
                        </>
                    )
                })
  
            }
            {
                <div>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>Order Status</Text>
                    <Select 
                        style={{width: '100%'}} 
                        value={formData?.orderStatus || 'NA'} 
                        onChange={(v)=> setFormData({...formData, orderStatus: v})}
                        options={[{ value: 'Processing', label: <span>Processing</span> }, { value: 'In Transit', label: <span>In Transit</span> }, { value: 'Delivered', label: <span>Delivered</span> }]} 
                        disabled={formData?.orderStatus === 'Cancelled'}
                    />
                </div>
            }
            

            <div>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Address details</Text>
                <FormControl>
                    <FormHelperText>Recipient's Name</FormHelperText>
                    <Input
                        value={formData.address?.name}
                        size='sm'
                        width='inherit'
                        placeholder='Name'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, name: v.target.value}}); console.log(v.target.value);}}
                    />
                    <FormHelperText>Recipient's House No</FormHelperText>
                    <Input
                        value={formData.address?.houseNo}
                        size='sm'
                        width='inherit'
                        placeholder='House No'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, houseNo: v.target.value}}); console.log(v.target.value);}}
                        type="number"
                    />
                    <FormHelperText>Landmark</FormHelperText>
                    <Input
                        value={formData.address?.landmark}
                        size='sm'
                        width='inherit'
                        placeholder='landmark'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, landmark: v.target.value}}); console.log(v.target.value);}}
                    />
                    <FormHelperText>Recipient's Phone Number</FormHelperText>
                    <Input
                        value={formData.address?.phoneNumber}
                        size='sm'
                        width='inherit'
                        placeholder='Phone Number'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, phoneNumber: v.target.value}}); console.log(v.target.value);}}
                        type="number"
                    />
                    <Paragraph copyable>Phone : {formData.address?.phoneNumber}</Paragraph>
                    <FormHelperText>Complete Address</FormHelperText>
                    <Textarea
                        value={formData.address?.address}
                        size='sm'
                        width='inherit'
                        placeholder='Address'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, address: v.target.value}}); console.log(v.target.value);}}
                    />
                </FormControl>
                
                <Paragraph copyable>Complete Address : {formData.address?.address}</Paragraph>
            </div>

            <div>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Payment details</Text>
                {
                    formData.paymentDetails ?
                    <>                    
                        <Paragraph copyable>Cashfree Order Id : {formData.paymentDetails.cf_order_id}</Paragraph>
                        <Paragraph>Amount : {formData.paymentDetails.order_amount}</Paragraph>
                        <Paragraph>Payment Status : {formData.paymentDetails.order_status}</Paragraph>
                        <Paragraph>Payment link : <Text copyable>{formData.paymentDetails.payments.url}</Text></Paragraph>
                    </>
                    :
                    <Paragraph>None</Paragraph>
                }
            </div>
            <div style={{marginTop: 10}}>
                <Button onClick={updateOrder} isLoading={loading} disabled={loading}>Update</Button>
            </div>
        </Card>
    )
};

export default EditOrder;