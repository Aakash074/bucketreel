import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import axios from 'axios'; // You will need axios to handle the file upload manually

const JWT = import.meta.env.VITE_PINATA_JWT;
// Replace with your Pinata API key and secret
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

const uploadToPinata = async (file: File) => {
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
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw error;
  }
};

//@ts-expect-error any
const App: React.FC = ({ setFile }) => { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = async (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      try {
        const result = await uploadToPinata(info.file.originFileObj);
        console.log(result.IpfsHash, result, "result")
        message.success(`File uploaded successfully: ${result.IpfsHash}`);
        setFile(result.IpfsHash)
      } catch (error) {
        console.log(error)
        message.error('File upload failed.');
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const props: UploadProps = {
    customRequest: async ({ file, onSuccess, onError }) => {
      try { //@ts-expect-error any
        await uploadToPinata(file);
        onSuccess?.(file);
      } catch (error) {
        console.log(error)
        //@ts-expect-error any
        onError?.(error);
      }
    },
    onChange: handleChange,
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Add Content</Button>
    </Upload>
  );
};

export default App;
