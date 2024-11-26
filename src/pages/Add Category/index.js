import { Button, Card, Form, Image, Input, Switch, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { InboxOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import Title from 'antd/es/typography/Title';

const AddCategory = ({ onAdd, onUpdate, formName, preFill}) => {
    const { Dragger } = Upload;
    const formRef = useRef();
    const [isEdit, setIsEdit] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [formData, setFormaData] = useState({
        name: "",
        Image: {}
    });

    useEffect(() => {
        setIsTouched(false);
        if (preFill) {
            console.log(preFill, "PREFILL");
            setIsEdit(true);
            setFormaData({
                ...formData,
                name: preFill.name,
                Image: preFill.Image,
                isActive: preFill.isActive,
                id: preFill.$id
            });
            formRef.current.setFieldsValue({
                ...formData,
                Name: preFill.name,
                active: preFill.isActive
            })
        } else {
            setIsEdit(false);
        }
    }, [preFill])

    async function onChange(event) {
        const base64 = await convertBase64(event.target.files[0]);
        const base64Data = base64.split(',')[1];

        setFormaData({
            ...formData,
            Image: event.target.files[0]
        });
        setIsTouched(true);
    }

    function convertBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    function handleChangeStatus(v) {
        setFormaData({
            ...formData,
            isActive: v
        })
    }

    return (
        <Card style={{ margin: 10, border: 0 }}>
            <Form ref={formRef} name={formName || 'Add Category'}>
                {
                    isEdit && (
                        <Form.Item name="Id" label="Category Id">
                            <Input
                                defaultValue={formData.id}
                                disabled
                            />
                        </Form.Item>
                    )
                }
                <Form.Item 
                    name="Name" 
                    label="Category Name"
                    rules={isEdit ? [] : [{ required: true, message: 'Category name is required' }]}
                >
                    <Input
                        name='Category Name'
                        placeholder='Fruit, Vegitable, etc.'
                        onChange={(e) => setFormaData({ ...formData, name: e.target.value })}
                        value={formData.name}
                    />
                </Form.Item>
                <Form.Item 
                    name="Category Image" 
                    label="Category Image"
                    rules={isEdit ? [] : [{ required: true, message: 'Category image is required' }]}
                >
                    <input
                        ref="file" type="file" name="file"
                        className="upload-file"
                        id="file"
                        onChange={onChange}
                        encType="multipart/form-data"
                        required
                    />
                </Form.Item>
                {
                    isEdit ?
                        <Form.Item name="active" label="Category Status">
                            <Switch
                                checkedChildren="Active"
                                unCheckedChildren="Inactive"
                                checked={formData.isActive}
                                onChange={v => handleChangeStatus(v)}
                            />
                        </Form.Item>
                        :
                        null
                }
                {
                    isEdit ?
                        !isTouched ?
                            <div style={{ marginTop: 10, marginBottom: 10 }}>
                                <Image
                                    src={formData.imageURI}
                                    width={200}
                                />
                            </div>
                            :
                            <div style={{ marginTop: 10, marginBottom: 10 }}>
                                <Image
                                    src={`data:image/png;base64,${formData.coverImage}`}
                                    width={200}
                                />
                            </div>
                        :
                        null
                }
                <Form.Item style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button 
                    disabled={!isEdit && (formData.name === "" || !(formData.Image instanceof File))}
                    onClick={() => { isEdit ? onUpdate(formData) : onAdd(formData) }} style={{ background: '#1677ff', color: '#fff' }}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default AddCategory;
