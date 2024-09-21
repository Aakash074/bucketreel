/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { Button, Card, Input } from 'antd';
import ConnectButton from './ConnectButton';
import { useAccount } from 'wagmi';
import UploadComponent from './UploadComponent'
import environmentSetup from './hedera';
import { useDisconnect } from 'wagmi'
import { AccountCreateTransaction, Hbar,  Client, TopicMessageQuery, TopicId, PrivateKey } from '@hashgraph/sdk';
// import createFirstNft from './CreateNFT';
import { mintNFT } from "./CreateNFT";
import NFTDisplay from "./displayNFTs";
import BucketList from './bucketlist';
import { Buffer } from "buffer";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  // Import toastify CSS
import { SearchOutlined, BookOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'

window.Buffer = window.Buffer || Buffer;

const topicId = "0.0.4887959"

const Dashboard: React.FC = () => {

    const { address, isConnecting, isDisconnected } = useAccount()
    const [file, setFile] = React.useState<File | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [hederaClient, setHederaClient] = React.useState<any>(null);
    const { disconnect } = useDisconnect()

    const [value, setValue] = React.useState('');

    const [location, setLocation] = React.useState({ lat: 12.34, lon: 56.78 });
    const [tab, setTab] = React.useState("home")
    const [accountData, setAccountData] = React.useState()

    useEffect(() => {
      if(accountData) {
      const client = Client.forTestnet();  // Or Client.forMainnet() if using Mainnet
      //@ts-ignore
      client.setOperator(accountData?.accountId, PrivateKey.fromStringDer(accountData?.accountPvtKey));
    
      
      // Replace this with your actual topic ID
      const topic = TopicId.fromString(topicId);
  
      const subscription = new TopicMessageQuery()
        .setTopicId(topic)
        .subscribe(client, null, (message) => { //@ts-ignore
          const messageAsString = Buffer.from(message.contents, "utf8").toString();
          const timestamp = message.consensusTimestamp.toDate().toLocaleString();
  
          // Display the message as a toast notification
          toast.info(`${timestamp}: ${messageAsString}`, {
            position: 'top-center',
            autoClose: 3000,  // Toast will disappear after 3 seconds
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true
          });
        });

      }
  
      // Cleanup the subscription on component unmount
      return () => {
        // unsubscribe();
      };
    }, [topicId, accountData]);
  
  

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
//@ts-ignore
    const handleChange = (e) => {
      setValue(e.target.value);
    };
//@ts-ignore
    const getOrCreateHederaAccount = async (address) => {
        console.log(address)
      try {
        const accountPrivateKey = address;
    
        const response = await new AccountCreateTransaction()
          .setInitialBalance(new Hbar(5)) // Set initial balance to 5 Hbar
          .setKey(address)
          .execute(hederaClient);
        
        const receipt = await response.getReceipt(hederaClient);
        
        // Store accountId and privateKey as a JSON string in local storage
        const accountData = { //@ts-ignore
          accountId: receipt.accountId.toString(),
          accountPvtKey: accountPrivateKey.toString(), // Convert to string for storage
        };
//@ts-ignore
        setAccountData(accountData)
        
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
        const coordinates = location; //@ts-ignore
        const userAccount = JSON.parse(localStorage.getItem('hederaAccountData'))
        const locationName = value; // User-provided location name
        
        mintNFT(ipfsHash, coordinates, userAccount, locationName)
          .then(() => console.log("NFT minting process completed."))
          .catch(err => console.error("Error minting NFT:", err));
    }

    //@ts-ignore
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
        <div className='bg-purple-50'>
          {address && <div className='flex flex-row fixed bottom-[20px] w-full justify-center items-center z-10'>
            <div className={`flex flex-row  w-[80%] max-w-[400px] rounded-lg justify-evenly overflow-hidden cursor-pointer text-center border-[1px] border-violet-600`}>
                    <div className={`text-2xl flex flex-row items-center gap-2 justify-center ${tab === "home" ? "bg-violet-600 text-white" : "bg-white text-violet-600"} w-[50%] h-full p-2`} onClick={() => setTab("home")}>
                    <SearchOutlined />
                    <div>Explore</div></div>
                    <div className={`text-2xl flex flex-row items-center gap-2 justify-center ${tab === "bucket" ? "bg-violet-600 text-white" : "bg-white text-violet-600"} w-[50%] h-full p-2`}  onClick={() => setTab("bucket")}>
                    <BookOutlined />
                    <div>Bucketlist</div>

                    </div>
                    </div>
                  </div>}
                  <ToastContainer />
            {!address ? <div className='w-screen flex justify-center items-center bg-purple-50'><ConnectButton /></div>
                :
                <div className='w-screen h-screen flex flex-col justify-start bg-purple-50'>
                  <div className='text-2xl font-bold w-full text-center pt-4'>BucketReel</div>
                    <div className='flex flex-row justify-between items-center w-full p-4'>
                    <h2 className='flex flex-row gap-2'>
                    <UserOutlined />
                    <div className='font-bold'>
                       Welcome { //@ts-ignore
                          JSON.parse(localStorage.getItem('hederaAccountData'))?.accountId

                    // showFirstAndLast(address)
                    }</div></h2>
                    <Button className='border-[1px] border-violet-600 flex flex-row items-center justify-center gap-2' onClick={() => {localStorage.clear(); disconnect();}}>
                    <LogoutOutlined /><div>Logout / Disconnect</div></Button>
                    </div>
                    <div className='flex flex-col justify-center mx-5 '>
                        {/* @ts-ignore */}
                        <UploadComponent setFile={setFile} />
                        {file && <div className='flex flex-row p-2 gap-2'>
                            <Input placeholder="Enter Location Name" value={value} onChange={handleChange} />
                            <Button onClick={handleMint}>Mint</Button>
                        </div>}
                    </div>
                    <div className='flex flex-col justify-center items-center gap-4 bg-purple-50'>
                        {tab === "home" ? <NFTDisplay /> : <BucketList />}
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