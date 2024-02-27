import { Button } from "antd";
import axios from "axios";

// const BASE_URL = `http://192.168.1.190:8080/`
const BASE_URL = `http://192.168.0.104:8080/`
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
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Mobile',
          dataIndex: 'mobile',
          key: 'mobile',
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
    encryptToken,
    decryptToken,
    formatOrderDateTime
}