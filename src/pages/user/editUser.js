import { Card, Typography } from "antd"
import { formatOrderDateTime, postApiCall } from "../../utils";
import { Button, FormControl, FormHelperText, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useLocalStorage from "../../utils/localStorageHook";
const { Paragraph, Text, Title } = Typography;

const EditUser = ({data, successCallback, errorCallback}) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const {userData} = useLocalStorage('user');

    useEffect(() => {
        setFormData({...data.data});
    },[data])

    const {
        name,
        email,
        mobile
    } = data.data;

    const userId = data._id


    async function updateUser() {
        setLoading(true);
        let payload = {
            ...formData
        }
        delete payload.email;
        try {
            const response = await postApiCall("admin/editUser", {data: payload, userId}, userData.token);
            const {data, status, message} = response.data;
            console.log("data", data);
            setLoading(false);
            if(status){
                setFormData({});
                successCallback(message, data);
            }else{
                errorCallback(message)
            }
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            errorCallback(error.message);
        }
    }

    return(
        <Card>
            <div>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Address details</Text>
                <FormControl>
                    <FormHelperText>Username</FormHelperText>
                    <Input
                        value={formData.name}
                        size='sm'
                        width='inherit'
                        placeholder='Name'
                        variant='outline'
                        onChange={(v) => setFormData({...formData, name: v.target.value})}
                    />
                    <FormHelperText>Email</FormHelperText>
                    <Input
                        value={formData.email}
                        size='sm'
                        width='inherit'
                        placeholder='Email'
                        variant='outline'
                        type="email"
                        disabled
                    />
                    <FormHelperText>Mobile Number</FormHelperText>
                    <Input
                        value={formData.mobile}
                        size='sm'
                        width='inherit'
                        placeholder='Mobile'
                        variant='outline'
                        onChange={(v) => {setFormData({...formData, mobile: v.target.value})}}
                    />
                    <div style={{marginTop: 10}}>
                        <Button onClick={updateUser} isLoading={loading} disabled={loading}>Update</Button>
                    </div>
                </FormControl>
            </div>
        </Card>
    )
};

export default EditUser;