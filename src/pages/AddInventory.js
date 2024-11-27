// AddInventory.js
import React, { useEffect, useState } from 'react';
import { Form, Select, Button, message, Input } from 'antd';
import axios from 'axios';
import { getApiCall, getUserData, postApiCall } from '../utils';

const { Option } = Select;

const AddInventory = ({ onClose, onUpdate}, ref) => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [packageQuantities, setPackageQuantities] = useState([]);
  const user = getUserData();
  const [messageApi, contextHolder] = message.useMessage();

useEffect(()=>{
    getDataForAddInventory()
},[])

async function getDataForAddInventory() {
    // debugger
    try {
        if(user){
            const response = await getApiCall("admin/getInvetoryCreatePrequisites", user.token);
            console.log(response.data,"Inventory Data")
            const {data, status, message} = response.data;
            if(status){     
                // debugger        
                 setProducts(data[0].products.documents)
                 setPackageQuantities(data[0].packages.documents)
            }
        }
    } catch (error) {
        console.log("error", error);
        message.error("Failed to load prerequisites.");
    }
};


  const handleSubmit = async values => {
    try {
        const updatedAt = new Date().toISOString();
        const dataToSubmit = { 
            ...values, 
            quantity: Number(values.quantity),
            isActive: true,
            updatedAt };
      const response = await postApiCall('admin/createInventoryForProduct', dataToSubmit, user.token);
      const {data, message: msg, status} = response.data;
      if(status){
        message.success(msg || "Inventory created successfully!!");
        form.resetFields();
        onClose();
        onUpdate()
        // getDataForAddInventory();
      } else {
        message.error(msg.error || "Error creating new Inventory, please try again!");
      }
    } catch (error) {
      console.error("Submission error:", error);
      message.error( "Error creating new Inventory, please try again!")
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="productId"
        label="Product"
        rules={[{ required: true, message: 'Please select a product' }]}
      >
        <Select placeholder="Select a product">
          {products.map(product => (
            <Option key={product.$id} value={product.$id}>{product.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="packageId"
        label="Package Quantity"
        rules={[{ required: true, message: 'Please select a package quantity' }]}
      >
        <Select placeholder="Select package quantity">
          {packageQuantities.map(quantity => (
            <Option key={quantity.$id} value={quantity.$id}>{quantity.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="quantity"
        label="Inventory Quantity"
        rules={[{ required: true, message: 'Please enter Inventory quantity' }]}
      >
        <Input placeholder="Enter quantity" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddInventory;