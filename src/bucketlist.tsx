import React, { useState, useEffect } from 'react';
import { Card } from 'antd'
import { Client, ContractCallQuery, ContractFunctionParameters, PrivateKey, AccountId } from "@hashgraph/sdk";
import axios from 'axios';

const contractId = "0.0.4887459"
const MIRROR_NODE_API = "https://testnet.mirrornode.hedera.com/api/v1";


const BucketList = () => {
  const [nfts, setNfts] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async function getBucketList() {
    const client = Client.forTestnet(); //@ts-ignore
    const userAccount = JSON.parse(localStorage.getItem('hederaAccountData'));

    // Ensure accountId and privateKey exist in localStorage
    if (!userAccount || !userAccount.accountId || !userAccount.accountPvtKey) {
        throw new Error("Invalid Hedera account data.");
    }

    // Set operator for the client
    // client.setOperator(userAccount?.accountId, PrivateKey.fromStringDer(userAccount?.accountPvtKey));
    client.setOperator(import.meta.env.VITE_HEDERA_TESTNET_ACCOUNT_ID, PrivateKey.fromStringDer(import.meta.env.VITE_HEDERA_TESTNET_PRIVATE_KEY));
    // Convert Hedera account ID to EVM address
    const accountId = AccountId.fromString(userAccount.accountId);
    const evmAddress = '0x' + accountId.toSolidityAddress();
    console.log('EVM Address:', evmAddress); // Check EVM address is correct

    // Prepare contract query
    const query = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)  // Set appropriate gas limit
        .setFunction("getBucketList", new ContractFunctionParameters().addAddress(evmAddress));

    try {
        // Execute the query
        const queryResponse = await query.execute(client);
        console.log('Raw query response:', queryResponse); // Log the raw response

        // function bytesToString() {
            const decoder = new TextDecoder('utf-8');
            const bucketList = decoder.decode(new Uint8Array(Object.values(queryResponse?.bytes))).match(/0\.0\.\d+/g) || [];;
        // }
        
        // const bucketList = bytesToString() //queryResponse?.getBytes();

        console.log(`Bucket list for user: ${bucketList}`);
        return bucketList;

    } catch (error) {
        console.error("Error executing contract call:", error);
        throw error;
    }
}



  useEffect(() => {
    // Fetch NFTs for a given account
    const getNFTs = async () => {
      const nftIds = await getBucketList();

      let nftsList = await Promise.all(
        nftIds.map(async (nft) => {
            const nftsResponse = await axios.get(`${MIRROR_NODE_API}/tokens/${nft}/nfts`);
            return nftsResponse.data.nfts;
        })
      )
      nftsList = nftsList?.flat()

      
          

          const nftDetails = await Promise.all( //@ts-ignore
            nftsList.map(async (nftItem) => {
              const metadataBase64 = nftItem.metadata; // Metadata is base64-encoded
              const metadata = decodeBase64(metadataBase64); // Decode the metadata
              console.log(metadata, nftItem)
              // Fetch the actual metadata from Pinata (assumes metadata contains an IPFS hash)
              const metadataIPFS = await fetchNFTMetadataFromIPFS(metadata);

              return {
                serial_number: nftItem.serial_number,
                metadata: metadataIPFS,
                token_id: nftItem?.token_id,
                account_id: nftItem.account_id
              };
            })
          );
     //@ts-ignore
      setNfts(nftDetails);
    };
    
    getNFTs();
  }, []);

  //@ts-ignore
  const fetchNFTMetadataFromIPFS = async (ipfsHash) => {
    try {
      const ipfsGatewayUrl = `https://peach-accused-eel-595.mypinata.cloud/ipfs/${ipfsHash.split('ipfs://')[1]}`;
      const response = await axios.get(ipfsGatewayUrl);
      return response.data;
    } catch (error) {
      console.error(`Error fetching metadata from IPFS hash: ${ipfsHash}`, error);
      // throw error;
      return null
    }
  };
  
  // Helper function to decode base64 metadata
  //@ts-ignore
  const decodeBase64 = (data) => Buffer.from(data, 'base64').toString('utf8');

  // Function to handle "like" button click 
  //@ts-ignore

  return (
    <div className='p-4'>
      <h2 className='text-md font-bold'>My Bucketlist</h2>
      <div className="nft-list flex justify-center flex-wrap">
      {/* @ts-ignore */}
        {nfts.filter(nft => nft.metadata && nft.metadata?.attributes?.[0]?.trait_type).map(nft => (
            // @ts-ignore
          <Card key={nft.tokenInfo?.token_id} className="nft-card flex justify-center items-center m-2 bg-violet-100 w-[320px]">
            {/* @ts-ignore */}
            <img src={`https://peach-accused-eel-595.mypinata.cloud/ipfs/${nft.metadata?.image?.split('ipfs://')[1]}`} alt={nft.metadata?.name} className='rounded-md' style={{ width: '100%' }} />
            <div className='flex flex-row justify-between items-center pt-4 w-full gap-2'>
            <div className='flex flex-col w-[60%]'>
            {/* @ts-ignore */}
                <h3>{nft.metadata?.name}</h3>
                {/* @ts-ignore */}
                <p>{nft.metadata?.description}</p>
            </div>
            <div className='w-[40%] flex flex-row-reverse'>
            {/* @ts-ignore */}
            {/* <Button onClick={() => addToBucketList(nft?.token_id)}>
            {/* @ts-ignore */}
              {/* Add to Bucket
            </Button> */} 
            </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BucketList;
