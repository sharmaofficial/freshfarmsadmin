import React, { useEffect, useState } from "react";
import { Select, Button, Input, Form, Typography, message } from "antd";
import { getApiCall, getUserData, postApiCall } from "../utils";

const Notifications = () => {
  const [form] = Form.useForm();
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const user = getUserData();

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      if (user) {
        const response = await getApiCall("admin/notificationUsersList", user.token);
        const { data, message: msg, status } = response.data;

        if (status) {
          const { fcmList, userList } = data;
          message.success("User list Fetched!!")
          const combinedData = userList.users.map((u) => {
            const fcm = fcmList.find((f) => f.userId === u.$id);
            return {
              label: u.name || "Unknown User",
              value: fcm?.fcmToken || null,
            };
          });

          setUserOptions(combinedData.filter((item) => item.value)); 
        }
        else{
          message.error(msg||"Error in fetching users!!")
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const handleSelectChange = (value) => {
    setSelectedUsers(value);
  };

  const handleSelectAll = () => {
    const allTokens = userOptions.map((option) => option.value);
    setSelectedUsers(allTokens);
    form.setFieldsValue({ tokenList: allTokens });
  };

  const handleFormSubmit = async(values) => {
    try {
      if (user) {
        const response = await postApiCall("admin/sendNotifications", values, user.token);
        const { data, message: msg, status } = response.data;
        if (status) {   
          message.success(msg)
        } else {
          message.error(msg)
        }
      }
    } catch (error) {
      message.error(error.message)
    }
  };

  return (
    <div>
      <Typography.Title level={3} style={{ marginBottom: "20px" }}>
        Notify Users
      </Typography.Title>

      <Form form={form} onFinish={handleFormSubmit} layout="vertical">
        <Form.Item
          name="tokenList"
          label="Select Users"
          rules={[{ required: true, message: "Please select users!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select users"
            value={selectedUsers}
            onChange={handleSelectChange}
            options={userOptions}
          />
        </Form.Item>

        <Button type="link" onClick={handleSelectAll}>
          Select All
        </Button>

        <Form.Item
          name="notificationTitle"
          label="Notification Heading"
          rules={[{ required: true, message: "Please enter a heading!" }]}
        >
          <Input placeholder="Enter heading" />
        </Form.Item>

        <Form.Item
          name="notificationBody"
          label="Notification Body"
          rules={[{ required: true, message: "Please enter a body!" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter notification body" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Send Notification
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Notifications;
