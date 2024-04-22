import { Card, Typography } from "antd"
import { formatOrderDateTime } from "../../utils";
import { FormControl, FormHelperText, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { useState } from "react";
const { Paragraph, Text, Title } = Typography;

const EditOrder = ({data}) => {
    // {
    //     "products": [
    //         {
    //             "availableQuantity": 200,
    //             "categoryId": 1,
    //             "description": "Welcome to Broccoli, your all-in-one health and wellness companion! Broccoli is not just an ordinary e-commerce mobile app; it's a holistic solution designed to enhance your well-being. Inspired by the nutritional powerhouse, our app aims to bring you a curated selection of products that cater to your physical and mental health needs.",
    //             "estimated_delivery": "Today",
    //             "id": 1,
    //             "images": [
    //                 "https://firebasestorage.googleapis.com/v0/b/fresh-farms-2bbdf.appspot.com/o/broccoli.png?alt=media&token=8f1e6d0b-803e-4f84-9e7e-6dc1f985ff76",
    //                 "https://firebasestorage.googleapis.com/v0/b/fresh-farms-2bbdf.appspot.com/o/cabbage.png?alt=media&token=34380075-28a1-4ecd-97ea-ef9bd6f935d7",
    //                 "https://firebasestorage.googleapis.com/v0/b/fresh-farms-2bbdf.appspot.com/o/carrot.png?alt=media&token=32fafdbd-a5ed-4e27-b35a-c299fd9d000f"
    //             ],
    //             "isActive": true,
    //             "name": "Broccoli",
    //             "packaging_type": "weight",
    //             "packaging_weight": 200,
    //             "price": 200,
    //             "quantity": 200
    //         },
    //         {
    //             "availableQuantity": 300,
    //             "categoryId": 1,
    //             "description": "Welcome to Broccoli, your all-in-one health and wellness companion! Broccoli is not just an ordinary e-commerce mobile app; it's a holistic solution designed to enhance your well-being. Inspired by the nutritional powerhouse, our app aims to bring you a curated selection of products that cater to your physical and mental health needs.",
    //             "estimated_delivery": "Today",
    //             "id": 3,
    //             "images": [
    //                 "https://firebasestorage.googleapis.com/v0/b/fresh-farms-2bbdf.appspot.com/o/carrot.png?alt=media&token=32fafdbd-a5ed-4e27-b35a-c299fd9d000f"
    //             ],
    //             "isActive": true,
    //             "name": "Carrot",
    //             "packaging_type": "weight",
    //             "packaging_weight": 200,
    //             "price": 456,
    //             "quantity": 200
    //         },
    //         {
    //             "availableQuantity": 4996,
    //             "categoryId": 2,
    //             "description": "Welcome to Broccoli, your all-in-one health and wellness companion! Broccoli is not just an ordinary e-commerce mobile app; it's a holistic solution designed to enhance your well-being. Inspired by the nutritional powerhouse, our app aims to bring you a curated selection of products that cater to your physical and mental health needs.",
    //             "estimated_delivery": "Tomorrow",
    //             "id": 5,
    //             "images": [
    //                 "https://firebasestorage.googleapis.com/v0/b/fresh-farms-2bbdf.appspot.com/o/strawberry.png?alt=media&token=fcbc147e-13b0-40bd-9a4d-414bb9eb936a"
    //             ],
    //             "isActive": true,
    //             "name": "Strawberry",
    //             "packaging_type": "box",
    //             "packaging_weight": 250,
    //             "price": 2896,
    //             "quantity": 20
    //         }
    //     ],
    //     "_id": "65aa43fa214e3166581b52df",
    //     "address": {
    //         "address": "150/45, Foy Sagar Rd, opp. Kali ka Mandir, near sonam studio, Dayanand Colony, Ajmer, Rajasthan 305001, India",
    //         "houseNo": "1222",
    //         "id": 5,
    //         "isDefault": true,
    //         "landmark": "Kings road",
    //         "location": {
    //             "latitude": 26.464647609162398,
    //             "latitudeDelta": 0.002129510147913294,
    //             "longitude": 74.61710868403316,
    //             "longitudeDelta": 0.0012535974383354187
    //         },
    //         "name": "Piyush Sharma",
    //         "phoneNumber": "1231471594"
    //     },
    //     "dateTime": "16-01-24 13:20",
    //     "orderId": "c9557f88-6182-45f6-91d0-45dcbe71fb2e"
    // }
    const {
        orderId,
        dateTime,
        address,
        paymentDetails
    } = data;

    const [formData, setFormData] = useState({...data});

    return(
        <Card>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>Order Id</Text>
            <Paragraph copyable>{orderId}</Paragraph>
            <div>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Order Date</Text>
                <Paragraph>{formatOrderDateTime(dateTime)}</Paragraph>
            </div>

            <div>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Address details</Text>
                <FormControl>
                    {/* <FormLabel>Name</FormLabel> */}
                    <FormHelperText>Recipient's Name</FormHelperText>
                    <Input
                        value={address.name}
                        size='sm'
                        width='inherit'
                        placeholder='Name'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, name: v.target.value}}); console.log(v.target.value);}}
                    />
                    <FormHelperText>Recipient's House No</FormHelperText>
                    <Input
                        value={address.houseNo}
                        size='sm'
                        width='inherit'
                        placeholder='House No'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, houseNo: v.target.value}}); console.log(v.target.value);}}
                        type="number"
                    />
                    <FormHelperText>Landmark</FormHelperText>
                    <Input
                        value={address.landmark}
                        size='sm'
                        width='inherit'
                        placeholder='landmark'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, landmark: v.target.value}}); console.log(v.target.value);}}
                    />
                    <FormHelperText>Recipient's Phone Number</FormHelperText>
                    <Input
                        value={address.phoneNumber}
                        size='sm'
                        width='inherit'
                        placeholder='Phone Number'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, phoneNumber: v.target.value}}); console.log(v.target.value);}}
                        type="number"
                    />
                    <Paragraph copyable>Phone : {address.phoneNumber}</Paragraph>
                    <FormHelperText>Complete Address</FormHelperText>
                    <Textarea
                        value={address.address}
                        size='sm'
                        width='inherit'
                        placeholder='Address'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, address:{...formData.address, address: v.target.value}}); console.log(v.target.value);}}
                    />
                </FormControl>
                {/* <Paragraph>House No : {address.houseNo}</Paragraph> */}
                {/* <Paragraph>Landmark : {address.landmark}</Paragraph> */}
                
                <Paragraph copyable>Complete Address : {address.address}</Paragraph>
            </div>

            <div>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Payment details</Text>
                {
                    paymentDetails ?
                    <>                    
                        <Paragraph copyable>Cashfree Order Id : {paymentDetails.cf_order_id}</Paragraph>
                        <Paragraph>Amount : {paymentDetails.order_amount}</Paragraph>
                        <Paragraph>Payment Status : {paymentDetails.order_status}</Paragraph>
                        <Paragraph>Payment link : <Text copyable>{paymentDetails.payments.url}</Text></Paragraph>
                    </>
                    :
                    <Paragraph>None</Paragraph>
                }
            </div>
        </Card>
    )
};

export default EditOrder;