import {
  Alert,
  Button,
  Drawer,
  Form,
  Image,
  Layout,
  List,
  Modal,
  Switch,
  Table,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useState } from "react";
import {
  formatProductDataForTable,
  getUserData,
  formatPackageDataForTable,
  getApiCall,
  postApiCall,
} from "../utils";
import AddCategory from "./Add Category";
import AddPackage from "./Add Package";
import actions from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../redux/store";

const Packages = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.package);
  const user = getUserData();
  //   const [loading, setLoading] = useState(false);
  const [userList, setUsersList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editPrefill, setEditPrefill] = useState({});
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [showAddAlertSuccess, setShowAddAlertSuccess] = useState(false);
  const [showErrorAddFail, setErrorAddFail] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    getUsersList();
  }, []);

//   useEffect(() => {
//     formatData(rawList);
//   }, [rawList]);

  const toggleScreenLoading = (status) => {
    dispatch({ type: actions.SET_PACKAGES_LOADING, payload: status });
  };

  async function getUsersList() {
    toggleScreenLoading(true);
    try {
      if (user) {
        const response = await getApiCall("admin/getPackages", user.token);
        const { data, status, message } = response.data;
        if (status) {
          formatData(data);
        }
      }
    } catch (error) {
      console.log("error", error);
      toggleScreenLoading(false);
    }
  }

  const formatData = (data) => {
    const transformedArray = data.map((item, index) => ({
      key: item.$id,
      id: item.$id,
      weigth: Math.abs(Number(item.name)), //This logic needs to be changed. Numbers are coming as strings
      action: (
        <>
          {/* <Button color="primary" variant="outlined" style={{ marginRight: 10}} onClick={() => openEditForm(item)}>Edit</Button> */}
          {/* <Button danger style={{ marginRight: 10}} onClick={() => handleDeletePackage(item.$id)}>Delete</Button> */}
          <Switch
            checkedChildren="Active"
            unCheckedChildren="InActive"
            checked={item.isActive}
            onChange={(v) => handleEditPackage(v, { ...item })}
          />
        </>
      ),
    }));
    const { columns } = formatPackageDataForTable(data);
    setColumns(columns);
    dispatch({
      type: actions.SET_PACKAGES_LIST,
      payload: transformedArray,
    });
      dispatch({ type: actions.SET_RAW_PACKAGES_LIST, payload: data });
    toggleScreenLoading(false);
  };

  async function handleAddPackage(formData) {
    toggleScreenLoading(true);
    try {
      const response = await postApiCall(
        "admin/addPackage",
        formData,
        user.token
      );
      const { data, message: msg, status } = response.data;
      if (status) {
        message.success(msg || "Package added successfully!!");
        addPackageToTable(data, formData);
        setIsAddModalVisible(false);
        setShowAddAlertSuccess(true);
      } else {
        messageApi.error(message);
        toggleScreenLoading(false);
        showErrorAddFail(true);
      }
    } catch (error) {
      console.log(error);
      messageApi.error(message);
      toggleScreenLoading(false);
      setErrorAddFail(true);
    }
  }

  const addPackageToTable = (packageId, data) => {
    if (packageId && data) {
        const {rawList} = store.getState().package;
      let updatedPackageListRaw = [...rawList];
      updatedPackageListRaw.push({
        name: Number(data.name),
        $id: packageId,
        isActive: false,
        $createdAt: new Date(),
        $updatedAt: new Date(),
        updatedAt: new Date(),
        $permissions: [],
      });
      formatData(updatedPackageListRaw);
    }
  };

  async function handleEditPackage(updatedStatus, item) {
      const {rawList} = store.getState().package;
    try {
      toggleScreenLoading(true);
      const payload = { isActive: updatedStatus, id: item.$id };
      const response = await postApiCall(
        "admin/editPackage",
        payload,
        user.token,
        false
      );
      const { data, message: msg, status } = response.data;
      if (status) {
        console.log("rawList", rawList);
        const updatedPackageList = rawList.map((packageItem) => {
          if (packageItem.$id === item.$id) {
            return {
              ...item,
              isActive:
                packageItem.$id === item.$id
                  ? updatedStatus
                  : packageItem.isActive,
            };
          } else {
            return packageItem;
          }
        });
        formatData(updatedPackageList)
        message.success(msg.message || "Status Updated Successfully!");
      } else {
        message.error(msg.message || "Status update failed!!");
      }
      toggleScreenLoading(false);
    } catch (error) {
      console.log(error);
      toggleScreenLoading(false);
      messageApi.error(message);
    }
  }

  const showAddPackagesModal = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  async function handleDeletePackage(packageId) {
    // debugger
    try {
      toggleScreenLoading(true);
      const response = await postApiCall(
        "admin/deletePackage",
        { id: packageId },
        user.token,
        false
      );
      const { data, message: msg, status } = response.data;
      if (status) {
        message.success(msg || "Package deleted Successfully");
        getUsersList();
      } else {
        console.log(message);
        message.error(msg || "Error Deleting package!!");
      }
      toggleScreenLoading(false);
    } catch (error) {
      console.log(error);
      toggleScreenLoading(false);
      message.error("Error Deleting package!!");
    }
  }

  return (
    <div style={{ minWidth: "24cm" }}>
      <h1>Packages</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={showAddPackagesModal}
      >
        Add Package
      </Button>
      <Table
        title={() => "Packages"}
        loading={loading}
        dataSource={list}
        columns={columns}
      />
      <Modal
        title={isEditModalVisible ? "Edit Package" : "Add New Package"}
        open={isAddModalVisible || isEditModalVisible}
        footer={null}
        onCancel={() => {
          setIsEditModalVisible(false);
          setIsAddModalVisible(false);
          //   setEditingProduct(null);
        }}
        // onOk={}
      >
        {isEditModalVisible ? (
          <AddPackage
            onEdit={(data) => handleEditPackage(data)}
            preFill={editPrefill}
          />
        ) : (
          <AddPackage onSubmit={(data) => handleAddPackage(data)} />
        )}
      </Modal>
    </div>
  );
};
export default Packages;
