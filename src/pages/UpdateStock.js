import { Button, Form, Input, Select, message } from 'antd';
import { useState } from 'react';
import { getUserData, postApiCall } from '../utils';

const { Option } = Select;

const UpdateStock = ({ editData, onClose, onUpdate }) => {
    const [form] = Form.useForm();
    const user = getUserData();

    const handleUpdateSubmit = async () => {
        try {
            // debugger
            const values = await form.validateFields();
            const payload = {
                inventoryId: editData.$id,
                quantity: parseInt(values.quantity, 10),
                type: values.type,
            };
            console.log(typeof values.quantity);
            
            const response = await postApiCall('admin/updateStock', payload, user.token);
            const {data,message:msg,status} = response.data;
            if (status) {
                message.success("Inventory updated successfully");
                onUpdate(data, payload)
                onClose();
            } else {
                message.error(msg);
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleUpdateSubmit}>
            <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: 'Please enter the quantity' }]}
            >
                <Input type="number" placeholder='Enter Quantity'/>
            </Form.Item>

            <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please select the status' }]}
            >
                <Select placeholder="Select Tyoe">
                    <Option value="incoming">Incoming</Option>
                    <Option value="outgoing">Outgoing</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdateStock;
