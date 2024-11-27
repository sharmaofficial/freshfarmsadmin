import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Switch, Alert, message } from 'antd';
import { getApiCall, getUserData, postApiCall } from '../utils';

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const user = getUserData();

  const handleSave = (values) => {
    console.log('Settings Saved:', values);
    // Simulate saving settings (e.g., via API)
  };

  // const setMaintenance = (flag) => {
  //   console.log(flag,"maintaenence");
  // } 

  useEffect(() => {
    getAppSettings()
  }, []);

  const getAppSettings = async() => {
    setLoading(true);
        try {
            if(user){
                const response = await getApiCall("admin/getMaintenanceStatus", user.token);
                const {data, status, message: msg} = response.data;
                if(status){
                  message.success(msg);
                  form.setFieldValue("Switch to maintenance", data);
                } else {
                  message.error(typeof msg === 'string' ? msg : msg.error);
                }
            }
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
  }

  const updateMaintanenceStatus = async(maintanenceStatus) => {
    setLoading(true);
    try {
        if(user){
            const response = await postApiCall("admin/updateMaintenenceStatus", {isActive: maintanenceStatus},  user.token);
            const {status, message: msg} = response.data;
            if(status){
              message.success(msg);
              form.setFieldValue("Switch to maintenance", maintanenceStatus);
            } else {
              message.error(typeof msg === 'string' ? msg : msg.error);
            }
        }
        setLoading(false);
    } catch (error) {
        console.log("error", error);
        setLoading(false);
    }
  }
  
  return (
    <div style={{minWidth:'24cm'}}>
      <h1>Settings</h1>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        {/* <Form.Item
          label="Website Title"
          name="websiteTitle"
          rules={[{ required: true, message: 'Please enter the website title' }]}
        >
          <Input placeholder="Enter website title" />
        </Form.Item> */}
        
        {/* <Form.Item
          label="Admin Email"
          name="adminEmail"
          rules={[{ required: true, message: 'Please enter the admin email' }]}
        >
          <Input placeholder="Enter admin email" />
        </Form.Item> */}
        <Form.Item
          label="Switch to maintenance"
          name={"Switch to maintenance"}
        >
          <Switch
            checkedChildren="On"
            unCheckedChildren="Off"
            onChange={(e)=> updateMaintanenceStatus(e)}
          />
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
