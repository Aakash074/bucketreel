/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { Button, Card, Input } from 'antd';
import ConnectButton from './ConnectButton';
import { useAccount } from 'wagmi';
import UploadComponent from './UploadComponent'
import environmentSetup from './hedera';
import { useDisconnect } from 'wagmi'
import { AccountCreateTransaction, Hbar } from '@hashgraph/sdk';
// import createFirstNft from './CreateNFT';
import { mintNFT } from "./CreateNFT";
import NFTDisplay from "./displayNFTs";

const Dashboard: React.FC = () => {

    const { address, isConnecting, isDisconnected } = useAccount()
    const [file, setFile] = React.useState<File | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [hederaClient, setHederaClient] = React.useState<any>(null);
    const { disconnect } = useDisconnect()

    const [value, setValue] = React.useState('');

    const [location, setLocation] = React.useState({ lat: 12.34, lon: 56.78 });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

    const handleChange = (e) => {
      setValue(e.target.value);
    };

    const getOrCreateHederaAccount = async (address) => {
        console.log(address)
      try {
        const accountPrivateKey = address;
    
        const response = await new AccountCreateTransaction()
          .setInitialBalance(new Hbar(1)) // Set initial balance to 5 Hbar
          .setKey(address)
          .execute(hederaClient);
        
        const receipt = await response.getReceipt(hederaClient);
        
        // Store accountId and privateKey as a JSON string in local storage
        const accountData = {
          accountId: receipt.accountId.toString(),
          accountPvtKey: accountPrivateKey.toString(), // Convert to string for storage
        };
        
        localStorage.setItem('hederaAccountData', JSON.stringify(accountData));
        
        return accountData; // Return the account data
      } catch (error) {
        console.error("Error creating Hedera account:", error);
        throw error; // Optional: propagate the error for further handling
      }
    };

    useEffect(() => {
      async function createAcc() {
      const accountData = await getOrCreateHederaAccount(address);
        console.log("Account Data:", accountData);
    }
    createAcc()
    }, [address])

    useEffect(() => {
     const client =   environmentSetup()
        setHederaClient(client)
    },[])

    // const images = [
    //     'https://lh5.googleusercontent.com/p/AF1QipPkgKtb16DvNNtwxuUwuTe7r7o7H1dLW9kOnKJZ=w540-h312-n-k-no',
    //     'https://lh5.googleusercontent.com/p/AF1QipPQsDS8ePCYBxhc4NmO3UVnXBmjKuomjjTclFQ9=w540-h312-n-k-no',
    //     'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/85/5a/14/view-of-falls-from-bridge.jpg?w=1200&h=-1&s=1',
    // ];



    const handleMint = async () => {
        console.log(file, "file")
        const ipfsHash = file; // From Pinata
        const coordinates = location;
        const userAccount = JSON.parse(localStorage.getItem('hederaAccountData'))
        const locationName = value; // User-provided location name
        
        mintNFT(ipfsHash, coordinates, userAccount, locationName)
          .then(() => console.log("NFT minting process completed."))
          .catch(err => console.error("Error minting NFT:", err));
    }

    //@ts-expect-error any
    function showFirstAndLast(str) {
        if (str.length <= 8) {
          // If the string is too short to have both first 5 and last 3 characters, return the original string
          return str;
        }
      
        const firstSix = str.slice(0, 6);  // First 6 characters
        const lastFour = str.slice(-4);    // Last 4 characters
      
        return firstSix + '...' + lastFour;  // Return in desired format
      }

    return (
        <div>
            {!address ? <div className='w-screen flex justify-center items-center'><ConnectButton /></div>
                :
                <div className='w-screen h-screen flex flex-col justify-start'>
                    <div className='flex flex-row justify-between w-full p-4'>
                    <h2 className=''> Welcome ${showFirstAndLast(address)}</h2>
                    <Button onClick={() => {localStorage.clear(); disconnect();}}>Logout / Disconnect</Button>
                    </div>
                    <div className='flex flex-col justify-center mx-5 '>
                        {/* @ts-expect-error any */}
                        <UploadComponent setFile={setFile} />
                        {file && <div className='flex flex-row p-2 gap-2'>
                            <Input placeholder="Enter Location Name" value={value} onChange={handleChange} />
                            <Button onClick={handleMint}>Mint</Button>
                        </div>}
                    </div>
                    <div className='flex flex-col justify-center items-center gap-4'>
                        <NFTDisplay />
                        {/* {images.map((image, index) => (
                            <Card key={index} style={{ width: 300 }}>
                                <img src={image} alt={`Image ${index + 1}`} style={{ width: '100%' }} />
                            </Card>
                        ))} */}
                    </div>
                </div>}
        </div>
    );
};

export default Dashboard;