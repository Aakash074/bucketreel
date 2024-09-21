import { jsx as _jsx } from "react/jsx-runtime";
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import axios from 'axios'; // You will need axios to handle the file upload manually
//@ts-ignore
const JWT = import.meta.env.VITE_PINATA_JWT;
// Replace with your Pinata API key and secret
//@ts-ignore
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
//@ts-ignore
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const uploadToPinata = async (file) => {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Authorization': `Bearer ${JWT}`,
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY,
            },
        });
        return response.data; // Adjust this based on the response structure
    }
    catch (error) {
        console.error('Error uploading file to Pinata:', error);
        throw error;
    }
};
//@ts-ignore
const App = ({ setFile }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = async (info) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            try {
                const result = await uploadToPinata(info.file.originFileObj);
                console.log(result.IpfsHash, result, "result");
                message.success(`File uploaded successfully: ${result.IpfsHash}`);
                setFile(result.IpfsHash);
            }
            catch (error) {
                console.log(error);
                message.error('File upload failed.');
            }
        }
        else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };
    const props = {
        customRequest: async ({ file, onSuccess, onError }) => {
            try { //@ts-ignore
                await uploadToPinata(file);
                onSuccess?.(file);
            }
            catch (error) {
                console.log(error);
                //@ts-ignore
                onError?.(error);
            }
        },
        onChange: handleChange,
    };
    return (_jsx(Upload, { ...props, children: _jsx(Button, { icon: _jsx(UploadOutlined, {}), children: "Add Location Photo / Video to Mint NFTs" }) }));
};
export default App;
