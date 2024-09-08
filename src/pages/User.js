import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, message, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import useLocalStorage from '../utils/localStorageHook';
import { useNavigate } from 'react-router-dom';
import { getApiCall, postApiCall } from '../utils';
import { useMessage } from '../utils/MessageProvider';

// Sample user data for the table
const sampleUsers = [
  {
    "$id": "66486c2900297d4ec8e7",
    "name": "Harry Potter",
    "email": "example@gmail.com",
    "phone": "+919999999999",
    "status": true,
    "labels": ["admin"],
    "targets": [
      { "providerType": "email", "identifier": "example@gmail.com" },
      { "providerType": "sms", "identifier": "+919000000000" }
    ]
  },
  // Add more sample users as needed
];

const Users = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const messageAPI = useMessage()

    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState([
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
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <div>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ marginRight: 8 }}
            />
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => handleDelete(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        ),
      },
    ]
  );
  const {userData, deleteData} = useLocalStorage('userData');
  const [form] = Form.useForm();

  const getUserColumns = () => [
    {
      title: 'ID',
      dataIndex: '$id',
      key: '$id',
    },
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={() => handleStatusToggle(record.status,record.$id)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.$id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleStatusToggle = async(status, userId) => {
    setLoading(true);
    let payload =  {isActive : !status, userId};
    try {
      const response = await postApiCall("admin/updateUserStatus", payload, userData.token);
      const {data, status, message} = response.data;
      console.log("status", status);
      if(status){
        const temp = [...users];
        temp.map(user => {
          if (user.$id === userId) {
            return { ...user, status: !user.status };
          }
          return user;
        });
        console.log("temp", temp);
        setUsers(temp);
        messageAPI.success(message);
        // setUsers(users.map(user => {
        //   if (user.$id === userId) {
        //     console.log("user.status ", user.status);
        //     console.log("{ ...user, status: !user.status }", { ...user, status: !user.status });
        //     // Create a new user object with toggled status
        //     return { ...user, status: !user.status };
        //   }
        //   return user;
        // }));
      }else {
        messageAPI.warning(message);
      }
    } catch(error){
      messageAPI.error(message);
    }finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    getUsersList();
  },[userData]);

  async function getUsersList() {
    setLoading(true);
    try {
        if(userData){
            const response = await getApiCall("", userData.token);
            const {data, status, message} = response.data;
            if(status){
                setColumns(getUserColumns());
                setUsers(data);
            }
            messageAPI.success(message)
        }
        setLoading(false);
    } catch (error) {
        console.log("error", error);
        messageAPI.error(error.message)
        setLoading(false);
    }
};

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsEditModalVisible(true);
  };

  const handleDelete = (userKey) => {
    setUsers(users.filter(user => user.key !== userKey));
    message.success('User deleted successfully.');
  };

  const handleSave = (values) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => user.key === editingUser.key ? { ...user, ...values } : user));
      message.success('User updated successfully.');
    } else {
      // Add new user
      const newUser = {
        key: (users.length + 1).toString(),
        ...values
      };
      setUsers([...users, newUser]);
      message.success('User added successfully.');
    }
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
    setEditingUser(null);
  };

  const showAddUserModal = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  return (
    <div>
      <h1>Users Management</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showAddUserModal}
        style={{ marginBottom: 16 }}
      >
        Add User
      </Button>
      <Table loading={loading} dataSource={users} columns={columns} pagination={false} />

      {/* Modal for editing and adding user */}
      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isEditModalVisible || isAddModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setIsAddModalVisible(false);
          setEditingUser(null);
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the user name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter the user email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select the user role' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;