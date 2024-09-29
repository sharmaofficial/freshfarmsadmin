import { Button, Card, Dropdown, Form, Input, Space, Upload, message } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Title from 'antd/es/typography/Title';

const AddPackage = ({onSubmit}) => {

    const [formData, setFormaData] = useState({
        name: "",
    });

    return(
        // <Card style={{margin: 10}}>
        //     <Title level={4} style={{marginBottom: 20}}>Add Package</Title>
            <Form name='Add Package'>
                <Form.Item name="Package Weight" label="Package Weight">
                    <Input
                        name='Package Weight'
                        placeholder='100, 200, etc., in grams'
                        onChange={(e) => setFormaData({...formData, name: e.target.value})}
                        value={formData.name}
                        type='number'
                    />
                </Form.Item>
                <Form.Item style={{display:'flex', justifyContent:'end'}}>
                    <Button style={{background:'#1677ff', color:'#fff'}} onClick={() => onSubmit(formData)}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        // </Card>
    )
}

export default AddPackage;