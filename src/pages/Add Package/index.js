import { Button, Card, Dropdown, Form, Input, Space, Upload, message } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import { useEffect, useState , useRef} from 'react';
import Title from 'antd/es/typography/Title';

const AddPackage = ({onSubmit, formName, preFill, onEdit}) => {

    const [formData, setFormaData] = useState({
        name: "",
    });
    const [isEdit, setIsEdit] = useState(false);
    const formRef = useRef();

    useEffect(() => {
        // setIsTouched(false);
        // console.log(preFill, "PREFILL");
        // debugger
        if(preFill){
            console.log(preFill, "PREFILL");
            setIsEdit(true);
            setFormaData({
                ...formData,
                name: preFill.name,
                id: preFill.id
                // imageURI: preFill.coverImage,
            });
            formRef.current.setFieldsValue({
                ...formData,
                Id:preFill.id,
                packageWeight: preFill.name,
            })
        }else{
            setIsEdit(false);
        }
    },[preFill])

    return(
        // <Card style={{margin: 10}}>
        //     <Title level={4} style={{marginBottom: 20}}>Add Package</Title>
            <Form ref={formRef} name={formName || 'Add Packages'}>
                 {
                    isEdit&&(
                <Form.Item name="Id" label="Package Id">
                    <Input
                        defaultValue={formData.id}
                        disabled
                    />
                </Form.Item>
                    )
                }
                <Form.Item rules={[{ required: true, message: 'Enter some package weight!' }]} name="packageWeight" label="Package Weight">
                    <Input
                        name='Package Weight'
                        placeholder='100, 200, etc., in grams'
                        onChange={(e) => setFormaData({...formData, name: e.target.value})}
                        value={formData.name}
                        type='number'
                        suffix='gms'
                        max={"100000"}
                        min={"1"}
                    />
                </Form.Item>
                <Form.Item style={{display:'flex', justifyContent:'end'}}>
                    <Button style={{background:'#1677ff', color:'#fff'}} onClick={()=>{isEdit?onEdit(formData):onSubmit(formData)}} disabled={parseInt(formData.name)<=0 || !formData.name}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        // </Card>
    )
}

export default AddPackage;