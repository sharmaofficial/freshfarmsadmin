import { Button, Card, Form, Input, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Title from 'antd/es/typography/Title';

const AddCategory = ({onSubmit}) => {
    const { Dragger } = Upload;

    const [formData, setFormaData] = useState({
        name: "",
        coverImage: null,
        image:{
            type: ""
        }
    })

    async function onChange(event) {
        const base64 = await convertBase64(event.target.files[0]);
        const base64Data = base64.split(',')[1];

        setFormaData({
            ...formData,
            coverImage: base64Data,
            image: {
                type: event.target.files[0].type
            }
        })
    }

    function convertBase64(file){
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

    return(
        <Card style={{margin: 10}}>
            <Title level={4} style={{marginBottom: 20}}>Add Category</Title>
            <Form name='Add Category'>
                <Form.Item name="Name" label="Name">
                    <Input
                        name='Category Name'
                        placeholder='Fruit, Vegitable, etc.'
                        onChange={(e) => setFormaData({...formData, name: e.target.value})}
                        value={formData.name}
                    />
                </Form.Item>
                <Form.Item name="Category Image" label="Category Image">
                    <input 
                        ref="file" type="file" name="file" 
                        className="upload-file" 
                        id="file"
                        onChange={onChange}
                        encType="multipart/form-data" 
                        required
                    />
                </Form.Item>
                <Form.Item>
                    <Button onClick={() => onSubmit(formData)}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default AddCategory;