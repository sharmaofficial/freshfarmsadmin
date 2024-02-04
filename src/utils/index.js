import axios from "axios";

// const BASE_URL = `http://192.168.1.190:8080/`
const BASE_URL = `http://3.108.219.90:8080/`
const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWJjOGYyZmRkNjE2NDFiYTBhZGQ0YWUiLCJpYXQiOjE3MDcwNDM2MTN9.UcrRo0FmgcWUjFY5sP-ORE6BcjIB_IeddzP-WDNujsU`

const postApiCall = async(path, params) => {
    return await axios.post(`${BASE_URL}${path}`,{...params}, {headers: {Authorization: token}});
}
  
const getApiCall = async(path="") => {
    return await axios.get(`${BASE_URL}${path}`,{headers: { Authorization: token }});
}

function formatUsersDataForTable(data) {
    const transformedArray = data.map((item, index) => ({
        key: item._id,
        id: item._id,
        name: item.data.name,
        email: item.data.email,
        mobile: item.data.mobile || "-"
    }));

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
    ];

    return {transformedArray, columns};
}

export {
    getApiCall,
    postApiCall,
    formatUsersDataForTable
}