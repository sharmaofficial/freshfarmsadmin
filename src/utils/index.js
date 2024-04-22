import { Space } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import axios from "axios";

// const BASE_URL = `http://192.168.1.190:8080/`
const BASE_URL = `http://192.168.1.110:8080/`
// const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWJjOGYyZmRkNjE2NDFiYTBhZGQ0YWUiLCJpYXQiOjE3MDcwNDM2MTN9.UcrRo0FmgcWUjFY5sP-ORE6BcjIB_IeddzP-WDNujsU`

const postApiCall = async(path, params, token) => {
  return await axios.post(`${BASE_URL}${path}`,{...params}, {headers: {Authorization: token}});
}
  
const getApiCall = async(path="", token) => {
  return await axios.get(`${BASE_URL}${path}`,{headers: { Authorization: token }});
}

function formatUsersDataForTable(data) {
    const columns = [
        {
          title: 'User Id',
          dataIndex: 'id',
          key: 'userId',
          render: (_, record) => {
            console.log(record);
            return (
              <Paragraph copyable>{record.id}</Paragraph>
            )
          }
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          filters: data.map(item => ({
            text: item.data.name,
            value: item.data.name,
          })),
          filterMode: 'tree',
          filterSearch: true,
          onFilter: (value, record) => record.name.includes(value),
          width: '25%',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          filters: data.map(item => ({
            text: item.data.email,
            value: item.data.email,
          })),
          filterMode: 'tree',
          filterSearch: true,
          onFilter: (value, record) => record.name.includes(value),
          width: '20%',
        },
        {
          title: 'Mobile',
          dataIndex: 'mobile',
          key: 'mobile',
          filters: data.map(item => ({
            text: item.data.mobile,
            value: item.data.mobile,
          })),
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
        },
    ];

    return {columns};
}

function formatOrdersDataForTable(data) {

//   {
//     "products": [
//         {
//             "images": [
//                 "https://firebasestorage.googleapis.com/v0/b/fresh-farms-2bbdf.appspot.com/o/broccoli-1238250_640.jpg?alt=media&token=2303a9cd-e419-4e63-a725-f6ac2d65c321",
//                 "https://firebasestorage.googleapis.com/v0/b/fresh-farms-2bbdf.appspot.com/o/broccoli-1238250_640.jpg?alt=media&token=2303a9cd-e419-4e63-a725-f6ac2d65c321",
//                 "https://firebasestorage.googleapis.com/v0/b/fresh-farms-2bbdf.appspot.com/o/carrot.png?alt=media&token=32fafdbd-a5ed-4e27-b35a-c299fd9d000f"
//             ],
//             "_id": "65aa43a0214e3166581b52d4",
//             "categoryId": "65aa42f1214e3166581b52c7",
//             "description": "Welcome to Broccoli, your all-in-one health and wellness companion! Broccoli is not just an ordinary e-commerce mobile app; it's a holistic solution designed to enhance your well-being. Inspired by the nutritional powerhouse, our app aims to bring you a curated selection of products that cater to your physical and mental health needs.",
//             "estimated_delivery": "Today",
//             "id": 1,
//             "isActive": true,
//             "name": "Broccoli",
//             "packaging_type": "weight",
//             "packaging_weight": 200,
//             "price": 2,
//             "packageType": {
//                 "qauntity": 19951,
//                 "packageTypeId": "65aa4377214e3166581b52ce",
//                 "name": 200,
//                 "id": "65aa4377214e3166581b52ce",
//                 "price": 400,
//                 "selectedQuantity": 0
//             },
//             "quantity": 1
//         }
//     ],
//     "_id": "65e84b1596c5f750f485f590",
//     "address": {
//         "name": "Piyush Sharma",
//         "address": "Foy Sagar Road, FJ78+PRV, near Kali Mandir, Jyoti Nagar, Ajmer, Rajasthan 305001, India",
//         "phoneNumber": "9680362283",
//         "location": {
//             "longitudeDelta": 0.05425941199064255,
//             "latitudeDelta": 0.09219999597697282,
//             "longitude": 74.61717439815402,
//             "latitude": 26.464428882216417
//         },
//         "houseNo": "12",
//         "landmark": "",
//         "isDefault": true,
//         "id": "6d32aeec-5e54-4bb7-976e-f9938b5b7194"
//     },
//     "dateTime": "06-03-24 16:23",
//     "totalAmout": 400,
//     "userId": "65bc8f2fdd61641ba0add4ae",
//     "orderId": "7dc54d1a-d7f2-4e7e-8eaf-87f11d7574a1",
//     "isPaid": true,
//     "orderStatus": "PAID",
//     "__v": 0,
//     "paymentDetails": {
//         "cf_order_id": 2161238917,
//         "created_at": "2024-03-06T16:23:10+05:30",
//         "customer_details": {
//             "customer_id": "65bc8f2fdd61641ba0add4ae",
//             "customer_name": "Piyush Sharma",
//             "customer_email": null,
//             "customer_phone": "9680362283",
//             "customer_uid": null
//         },
//         "entity": "order",
//         "order_amount": 400,
//         "order_currency": "INR",
//         "order_expiry_time": "2024-04-05T16:23:10+05:30",
//         "order_id": "7dc54d1a-d7f2-4e7e-8eaf-87f11d7574a1",
//         "order_meta": {
//             "return_url": null,
//             "notify_url": null,
//             "payment_methods": null
//         },
//         "order_note": null,
//         "order_splits": [],
//         "order_status": "PAID",
//         "order_tags": null,
//         "payment_session_id": "session_IPHMx4O6Y8sPc1DvQ19OMVDUoVwcOnrou9Yd-5myrsnUqiNirVGCbZcTN4J2C1WRRiQ90o3vm15mLkS0FYp2wbfcAtkCver1XnUBNL46fMt0",
//         "payments": {
//             "url": "https://sandbox.cashfree.com/pg/orders/7dc54d1a-d7f2-4e7e-8eaf-87f11d7574a1/payments"
//         },
//         "refunds": {
//             "url": "https://sandbox.cashfree.com/pg/orders/7dc54d1a-d7f2-4e7e-8eaf-87f11d7574a1/refunds"
//         },
//         "settlements": {
//             "url": "https://sandbox.cashfree.com/pg/orders/7dc54d1a-d7f2-4e7e-8eaf-87f11d7574a1/settlements"
//         },
//         "terminal_data": null
//     }
// }

  const columns = [
      {
        title: 'Order Idffff',
        dataIndex: 'orderId',
        key: 'orderId',
        render: (_, record) => {
          console.log(record);
          return (
            <Paragraph copyable>{record.orderId}</Paragraph>
          )
        }
      },
      {
        title: 'Date',
        dataIndex: 'dateTime',
        key: 'dateTime',
        filters: data.map(item => ({
          text: item.dateTime,
          value: item.dateTime,
        })),
        filterSearch: true,
        onFilter: (value, record) => record.name.includes(value),
        width: '25%',
      },
      {
        title: 'Delivery Address',
        dataIndex: 'address',
        key: 'address',
        filters: data.map(item => ({
          text: item?.address?.address,
          value: item?.address?.address,
        })),
        filterSearch: true,
        onFilter: (value, record) => record.name.includes(value),
        width: '20%',
        render: (_, record) => {
          return (
            <Paragraph copyable>{record?.address}</Paragraph>
          )
        }
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
      },
  ];

  return {columns};
}

const encryptToken = async (token, key) => {
  const encodedToken = new TextEncoder().encode(token);
  const encryptedData = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: new Uint8Array(12) }, key, encodedToken);
  return new Uint8Array(encryptedData);
};

const decryptToken = async (encryptedData, key) => {
  const decryptedData = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(12) }, key, encryptedData);
  return new TextDecoder().decode(decryptedData);
};

function formatOrderDateTime(dateTime) {
  if(dateTime){
    const [day, month, yearShort, time] = dateTime.split(/[-\s:]/);
    const year = `20${yearShort}`;
    const inputDate = new Date(`${year}-${month}-${day}T${time}:00`);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    };
    const formattedDate = inputDate.toLocaleDateString('en-US', options);
    const formattedTime = inputDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${formattedDate} at ${formattedTime}`
  }else{
    return '-'
  }
}


export {
    getApiCall,
    postApiCall,
    formatUsersDataForTable,
    formatOrdersDataForTable,
    encryptToken,
    decryptToken,
    formatOrderDateTime
}