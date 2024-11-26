import { Space, Typography } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import axios from "axios";

import CryptoJS from 'crypto-js';
//const BASE_URL = `http://localhost:8080/`
const BASE_URL = `http://api.freshfarmsajmer.online:8080/`
const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWJjOGYyZmRkNjE2NDFiYTBhZGQ0YWUiLCJpYXQiOjE3MDcwNDM2MTN9.UcrRo0FmgcWUjFY5sP-ORE6BcjIB_IeddzP-WDNujsU`

const {Text, Link } = Typography;

const postApiCall = async(path, params, token, isFormData) => {
  // debugger
  return await axios.post(`${BASE_URL}${path}`,{...params}, {headers: {Authorization: token, "Content-Type": isFormData?"multipart/form-data": "application/json"}});
}

const putApiCall = async(path, params, token) => {
  return await axios.put(`${BASE_URL}${path}`,{...params}, {headers: {Authorization: token}});
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
            text: item.name,
            value: item.name,
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
            text: item.email,
            value: item.email,
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
            text: item.phone,
            value: item.phone,
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
// debugger
  const columns = [
      {
        title: 'Order Id',
        dataIndex: 'orderId',
        key: 'orderId',
        filters: data.map(item => ({
          text: item.orderId,
          value: item.orderId,
        })),
        filterSearch: true,
        onFilter: (value, record) => {
          return record?.orderId?.includes(value)
        },
        width: '10%',
        render: (_, record) => {
          return (
            <Paragraph copyable ellipsis={{ rows: 1, expandable: true }}>{record.orderId}</Paragraph>
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
        onFilter: (value, record) => record.dateTime.includes(formatOrderDateTime(value)),
        width: '30%',
        render: (_, record) => {
          return (
            <Paragraph ellipsis={{ rows: 1, expandable: true }}>{record.dateTime}</Paragraph>
          )
        }
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
        onFilter: (value, record) => record?.address.includes(value),
        width: '60%',
        render: (_, record) => {
          return (
            <>
              <Paragraph  ellipsis={{ rows: 1, expandable: true }}><span>Name: </span> <Text copyable>{record?.customerName}</Text></Paragraph>
              {/* <Paragraph copyable ellipsis={{ rows: 1, expandable: true }}>Mobile: <a href={`tel:${record?.contact}`}>{record?.contact}</a></Paragraph> */}
              <Paragraph ellipsis={{ rows: 1, expandable: true }}>
                  <span>Mobile: </span>
                  <Link copyable href={`tel:${record?.contact}`}>{record?.contact}</Link>
              </Paragraph>
              <Paragraph ellipsis= {{rows:2, expandable:true}}copyable>{record?.address}</Paragraph>
            </>
          )
        }
      },
      {
        title: 'Order Status',
        dataIndex: 'status',
        key: 'status',
        filters: ['In Transit', 'Processing', 'Delivered', 'Cancelled'].map(item => ({
          text: item,
          value: item,
        })),
        filterSearch: true,
        onFilter: (value, record) => {
          return record?.status?.includes(value);
        },
        width: '30%',
        render: (_, record) => {
          return(
            <div>
              {
                record?.status === 'Processing'
                ?
                <Paragraph ellipsis={{ rows: 1, expandable: true }} style={{color:'orange', minWidth:'100px'}}>{record?.status}</Paragraph>
                :
                record?.status === 'Delivered'
                ?
                <Paragraph ellipsis={{ rows: 1, expandable: true }} style={{color:'green'}}>{record?.status}</Paragraph>
                :
                record?.status === 'Cancelled'
                ?
                <Paragraph ellipsis={{ rows: 1, expandable: true }} style={{color:'red'}}>{record?.status}</Paragraph>
                :
                <Paragraph ellipsis={{ rows: 1, expandable: true }}>{record?.status}</Paragraph>
              }
            </div>
          )
        }
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
      },
      {
        title: 'Options',
        dataIndex: 'options',
        key: 'options',
      },
      {
        title: 'Total Amount',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
      },
      {
        title: 'Payment Status',
        dataIndex: 'isPaid',
        key: 'isPaid',
      },
  ];

  return {columns};
}

function formatCategoryDataForTable(data) {

  const columns = [
      {
        title: 'Category Id',
        dataIndex: 'id',
        key: 'id',
        filters: data.map(item => ({
          text: item._id,
          value: item._id,
        })),
        filterSearch: true,
        onFilter: (value, record) => {
          return record.categoryId.includes(value)
        },
        width: '25%',
        render: (_, record) => {
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
          text: item.name,
          value: item.name,
        })),
        filterSearch: true,
        onFilter: (value, record) => record.name.includes(value),
        width: '20%',
      },
      {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        width: '20%',
      },
      // {
      //   title: 'Order Status',
      //   dataIndex: 'status',
      //   key: 'status',
      //   filters: ['In Transit', 'Processing', 'Delivered', 'Cancelled'].map(item => ({
      //     text: item,
      //     value: item,
      //   })),
      //   filterSearch: true,
      //   onFilter: (value, record) => {
      //     return record?.status?.includes(value);
      //   },
      //   width: '20%',
      //   render: (_, record) => {
      //     return(
      //       <div>
      //         {
      //           record?.status === 'Processing'
      //           ?
      //           <Paragraph style={{color:'orange'}}>{record?.status}</Paragraph>
      //           :
      //           record?.status === 'Delivered'
      //           ?
      //           <Paragraph style={{color:'green'}}>{record?.status}</Paragraph>
      //           :
      //           record?.status === 'Cancelled'
      //           ?
      //           <Paragraph style={{color:'red'}}>{record?.status}</Paragraph>
      //           :
      //           <Paragraph>{record?.status}</Paragraph>
      //         }
      //       </div>
      //     )
      //   }
      // },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: '30%',
      },
  ];

  return {columns};
}

function formatProductDataForTable(data) {
  const columns = [
      {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: data.map(item => ({
          text: item.name,
          value: item.name,
        })),
        filterSearch: true,
        onFilter: (value, record) => record.name.includes(value),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        filters: data.map(item => ({
          text: item.description,
          value: item.description,
        })),
        filterSearch: true,
        onFilter: (value, record) => record.description.includes(value),
        width:"40%"
      },
      {
        title: 'Shop Name',
        dataIndex: 'shopName',
        key: 'shopName',
        filters: data.map(item => ({
          text: item.shopName,
          value: item.shopName,
        })),
        filterSearch: true,
        onFilter: (value, record) => record.shopName.includes(value),
        width:'15%'
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: 'Price(/gm)',
        dataIndex: 'price',
        key: 'price',
        width:'10%'
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: '30%',
      },
  ];

  return {columns};
}

function formatPackageDataForTable(data) {

  const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        render: (_, record) => {
          return (
            <Paragraph copyable>{record.id}</Paragraph>
          )
        }
      },
      {
        title: 'Weight(in grams)',
        dataIndex: 'weigth',
        key: 'weigth',
        filters: data.map(item => ({
          text: item.name,
          value: item.name,
        })),
        filterSearch: true,
        onFilter: (value, record) => record.weigth.toString().includes(value),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: '30%',
      },
  ];

  return {columns};
}

function formatLogsDataForTable(data) {

  const columns = [
      // {
      //   title: 'Id',
      //   dataIndex: 'id'
      //   key: 'id',
      // },
      {
        title: 'Inventory Log Id',
        dataIndex: 'logId',
        key: 'logId',
        filters: data.map(item => ({
          text: item.$id,
          value: item.$id,
        })),
        filterSearch: true,
        onFilter: (value, record) => record.logId.includes(value),
      },
      {
        title: 'Order Id',
        dataIndex: 'orderId',
        key: 'orderId',
        filters: data.map(item => ({
          text: item.orderId,
          value: item.orderId,
        })),
        filterSearch: true,
        onFilter: (value, record) => record.orderId.includes(value),
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
        onFilter: (value, record) => record.dateTime.includes(formatOrderDateTime(value)),
      },
      {
        title: 'Order type',
        dataIndex: 'orderType'
      },
      // {
      //   title: 'Action',
      //   dataIndex: 'action',
      //   key: 'action',
      // },
  ];

  return {columns};
}


function formatInventoryDataForTable(data) {

  const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Associated Product',
        dataIndex: 'associatedProduct',
        key: 'associatedProduct',
        filters: data.map(item => ({
          text: item.productId.name,
          value: item.productId.name,
        })),
        filterSearch: true,
        onFilter: (value, record) => record.associatedProduct.includes(value),
      },
      {
        title: 'Package',
        dataIndex: 'package',
        key: 'package',
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
        onFilter: (value, record) => record.dateTime.includes(formatOrderDateTime(value)),
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity'
      },
      {
        title: 'Actions',
        dataIndex: 'action'
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

function formatInventoryDateTime(dateTime){
  if (dateTime) {
    const desiredFormatRegex = /^[A-Za-z]+\s\d{1,2},\s\d{4}\sat\s\d{1,2}:\d{2}\s(?:AM|PM)$/;

    if (desiredFormatRegex.test(dateTime)) {
      return dateTime; // Return as is if already in the desired format
    }
    const inputDate = new Date(dateTime);
    
    if (isNaN(inputDate.getTime())) {
      return '-'; // Return '-' if the date is invalid
    }

    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    };
    const formattedDate = inputDate.toLocaleDateString('en-US', options);
    const formattedTime = inputDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    
    return `${formattedDate} at ${formattedTime}`;
  } else {
    return '-';
  }
}

export const isAuthenticated = () => {
  const encryptedToken = localStorage.getItem('user');
  if (!encryptedToken) return false;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, 'freshfarms');
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
    return !!decryptedToken;  // Return true if a valid token exists
  } catch (error) {
    console.error('Error decrypting token:', error);
    return false;
  }
};

const storeToken = (token) => {
  // const encryptedToken = CryptoJS.AES.encrypt(token, 'freshfarms').toString();
  localStorage.setItem('authToken', token);
};

const getToken = () => {
  const encryptedToken = localStorage.getItem('authToken');
  if (!encryptedToken) return null;
  const bytes = CryptoJS.AES.decrypt(encryptedToken, 'freshfarms');
  const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedToken;
};

const storeUserData = (data) => {
  // const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), 'freshfarms').toString();
  localStorage.setItem('user', data);
};

const getUserData = () => {
  const encryptedData = localStorage.getItem('user');
  if (!encryptedData) return null;
  const bytes = CryptoJS.AES.decrypt(encryptedData, 'freshfarms');
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};


export {
    getApiCall,
    postApiCall,
    putApiCall,
    formatUsersDataForTable,
    formatOrdersDataForTable,
    formatCategoryDataForTable,
    formatProductDataForTable,
    formatInventoryDataForTable,
    formatPackageDataForTable,
    formatLogsDataForTable,
    formatInventoryDateTime,
    encryptToken,
    decryptToken,
    formatOrderDateTime,
    storeToken,
    getToken,
    storeUserData,
    getUserData,
}
