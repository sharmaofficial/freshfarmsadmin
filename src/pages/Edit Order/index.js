import { Button, Row, Col,Form, Select, Typography, Input, message } from "antd";
import { formatInventoryDateTime, formatOrderDateTime, getUserData, postApiCall } from "../../utils";
import { useEffect, useState } from "react";

const { Text, Paragraph } = Typography;

const EditOrder = ({ data, successCallback, errorCallback }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm(); 
    const { userData } = getUserData();

    useEffect(() => {
        const initialData = {
            ...data,
            products: typeof data.products === "string" ? JSON.parse(data.products) : data.products,
            addressName: data.address?.name,
            addressHouseNo: data.address?.houseNo,
            addressLandmark: data.address?.landmark,
            addressPhoneNumber: data.address?.contactNumber,
            addressComplete: data.address?.address,
        };

        form.setFieldsValue(initialData); 
    }, [data, form]); 

    const updateOrder = async (values) => {
        setLoading(true);
        try {
            const response = await postApiCall(
                "admin/updateOrderStatus",
                { status: values.orderStatus, id: values.orderId },
                userData.token
            );
            const { data, status, message } = response.data;
            setLoading(false);
            if (status) {
                form.resetFields();
                successCallback(message, data);
            } else {
                errorCallback(message);
            }
        } catch (error) {
            setLoading(false);
            errorCallback(error.message);
        }
    };

    return (
        <Form
            form={form} // Connect the form instance
            name="editOrder"
            layout="vertical"
            onFinish={updateOrder}
        >
        <Form.Item style={{marginTop:'27px'}}>
            <Row>
                <Text strong>Order Id: </Text>
                <Text copyable style={{ marginLeft: 8 }}>{data.orderId}</Text>
            </Row>
            <Row style={{ marginTop: 8 }}>
                <Text strong>Order Date: </Text>
                <Text  style={{ marginLeft: 8 }}>{formatInventoryDateTime(data.dateTime)}</Text>
            </Row>
            {data?.products?.map((product, index) => (
                <div key={index} style={{marginTop:'16px'}}>
                    <Text><strong>Product Name:</strong> {product?.name}</Text>
                    <br />
                    <Text><strong>Quantity:</strong>{product?.packageType?.name}gm * {product?.quantity}</Text>
                </div>
            ))}
             </Form.Item>

            <Form.Item
                style={{marginTop:'20px'}}
                label="Order Status"
                name="orderStatus"
                rules={[{ required: true, message: "Order Status is required" }]}   
            >
                <Select
                    style={{ width: "100%" }}
                    options={[
                        { value: "Processing", label: "Processing" },
                        { value: "In Transit", label: "In Transit" },
                        { value: "Delivered", label: "Delivered" },
                    ]}
                    disabled={data?.orderStatus === "Cancelled"}
                />
            </Form.Item>

            <Form.Item label="Address Details">
                <Form.Item
                    name="addressName"
                    rules={[{ required: true, message: "Name is required" }]}
                >
                    <Input placeholder="Recipient's Name" />
                </Form.Item>
                <Form.Item
                    name="addressHouseNo"
                    rules={[{ required: true, message: "House No is required" }]}
                >
                    <Input placeholder="House No" />
                </Form.Item>
                <Form.Item
                    name="addressLandmark"
                    // rules={[{ required: true, message: "Landmark is required" }]}
                >
                    <Input placeholder="Landmark" />
                </Form.Item>
                <Form.Item
                    name="addressPhoneNumber"
                    rules={[{ required: true, message: "Phone Number is required" }]}
                >
                    <Input placeholder="Phone Number" type="number" />
                </Form.Item>
                <Form.Item
                    name="addressComplete"
                    rules={[{ required: true, message: "Complete Address is required" }]}
                >
                    <Input.TextArea placeholder="Complete Address" />
                </Form.Item>
            </Form.Item>

            <Form.Item label="Payment Details">
                {data.paymentDetails ? (
                    <>
                        <Paragraph copyable>
                            Cashfree Order Id: {data.paymentDetails?.cf_order_id}
                        </Paragraph>
                        <Paragraph>
                            Amount: {data.paymentDetails?.order_amount}
                        </Paragraph>
                        <Paragraph>
                            Payment Status: {data.paymentDetails?.order_status}
                        </Paragraph>
                        <Paragraph copyable>
                            Payment link: {data.paymentDetails.payments?.url}
                        </Paragraph>
                    </>
                ) : (
                    <Paragraph>None</Paragraph>
                )}
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Update
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditOrder;
