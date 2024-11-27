import {
  Button,
  Drawer,
  Image,
  Form,
  Layout,
  List,
  Modal,
  Switch,
  Table,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useState } from "react";
import {
  formatOrderDateTime,
  getUserData,
  formatInventoryDateTime,
  getApiCall,
  formatInventoryDataForTable,
  postApiCall,
} from "../utils";
import AddInventory from "./AddInventory";
import UpdateStock from "./UpdateStock";
import { useDispatch, useSelector } from "react-redux";
import actions from "../redux/actions";
import { store } from "../redux/store";

const Inventory = () => {
    const dispatch = useDispatch();
    const {loading, list, rawList} = useSelector(state => state.inventory);
  const user = getUserData();
//   const [loading, setLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [columns, setColumns] = useState([]);
  // const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const showModal = () => setIsAddModalVisible(true);

  const showEditModal = (data) => {
    setIsEditModalVisible(true);
    setEditData(data);
  };
  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
  };

  const toggleLoading = (status) => {
    dispatch({type: actions.SET_INVENTORY_LOADING, payload: status})
  };

  useEffect(() => {
    getInventoryData();
  }, []);

  async function handleInventoryActiveStatus(activeStatus, id) {
    // debugger
    console.log(activeStatus);
    const payload = {
      isActive: activeStatus,
      inventoryId: id,
    };
    try {
      const response = await postApiCall(
        "admin/updateInventoryStatus",
        payload,
        user.token
      );
      const { data, message: msg, status } = response.data;
      if (status) {
        const {rawList} = store.getState().inventory;
        const updatedInventoryList = rawList.map((packageItem) => {
            return {
                ...packageItem,
                isActive:
                  packageItem.$id === data
                    ? activeStatus
                    : packageItem.isActive,
            }
        });
        formatData({documents: updatedInventoryList})
        message.success("Status update successful!!");
      } else {
        message.error("Status change failed!!");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  }

  async function getInventoryData() {
    toggleLoading(true);
    try {
      if (user) {
        const response = await getApiCall("admin/getInventory", user.token);
        const { data, status, message } = response.data;
        if (status) {
            formatData(data)
        }
      }
      toggleLoading(false);
    } catch (error) {
      console.log("error", error);
      toggleLoading(false);
    }
  }

  const formatData = (data) => {
    const transformedArray = data.documents.map((item, index) => {
        const packageId = item?.packageId;
        const productId = item?.productId;
        return {
          key: item?.$id,
          id: item?.$id,
          associatedProduct: productId.name,
          package: packageId.name,
          quantity: item?.quantity,
          dateTime: formatInventoryDateTime(item?.$createdAt),
          isActive: item.isActive,
          action: (
            <>
              <Button
                color="primary"
                variant="outlined"
                style={{ marginRight: 10 }}
                onClick={() => showEditModal(item)}
              >
                Update Stock
              </Button>
              {/* <Button style={{backgroundColor:'#2ecc72', color:'#fff'}} onClick={() => setSelectedUserToEdit(item)}>Delete</Button> */}
              <Switch
                checked={item.isActive}
                onChange={(v) => handleInventoryActiveStatus(v, item.$id)}
              />
            </>
          ),
        };
      });
      const { columns } = formatInventoryDataForTable(data.documents);
      setColumns(columns);
      dispatch({type: actions.SET_INVENTORY_LIST, payload: transformedArray})
      dispatch({type: actions.SET_RAW_INVENTORY_LIST, payload: data.documents})
      if(isEditModalVisible) setIsEditModalVisible(false)
  }

  function updateStockValueInTable(id, payload) {
    const {rawList} = store.getState().inventory;
    const updatedInventoryList = rawList.map((inventoryItem) => {
        let newQuantity = 0;
        if(inventoryItem.$id === id){
            if (payload.type == "incoming") {
                newQuantity = inventoryItem.quantity + payload.quantity;
            } else if (payload.type == "outgoing") {
                newQuantity = inventoryItem.quantity - payload.quantity;
            }
            return {
                ...inventoryItem,
                quantity: newQuantity,
            }
        } else {
            return inventoryItem;
        }
    });
    formatData({documents: updatedInventoryList})
  }

  function addInventoryToTable(newId, dataToUpdate){

  }

  return (
    <div style={{ minWidth: "24cm" }}>
      <h1>Inventory</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={showModal}
      >
        Add Inventory
      </Button>

      <Table
        // title={() => 'Inventory logs'}
        loading={loading}
        dataSource={list}
        columns={columns}
      />
      <Modal
        title={isEditModalVisible ? "Update Stock" : "Add Inventory"}
        open={isAddModalVisible || isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {isEditModalVisible ? (
          <UpdateStock
            editData={editData}
            onClose={handleCancel}
            onUpdate={(data, payload) => {
              updateStockValueInTable(data, payload);
            }}
          />
        ) : (
          <AddInventory onClose={handleCancel} onUpdate={getInventoryData}/>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;
