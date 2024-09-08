import React from 'react';
import { Form, Input, Button } from 'antd';

const Settings = () => {
  const [form] = Form.useForm();

  const handleSave = (values) => {
    console.log('Settings Saved:', values);
    // Simulate saving settings (e.g., via API)
  };

  return (
    <div>
      <h1>Settings</h1>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          label="Website Title"
          name="websiteTitle"
          rules={[{ required: true, message: 'Please enter the website title' }]}
        >
          <Input placeholder="Enter website title" />
        </Form.Item>
        
        <Form.Item
          label="Admin Email"
          name="adminEmail"
          rules={[{ required: true, message: 'Please enter the admin email' }]}
        >
          <Input placeholder="Enter admin email" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Settings;
