import React, { useState, useEffect } from 'react';
import { fetchMintedNFTs } from './fetchNFTs'; // Import the function to fetch NFTs
import { Button, Card } from 'antd'
import { Client, ContractExecuteTransaction, ContractFunctionParameters, PrivateKey, TopicMessageSubmitTransaction } from "@hashgraph/sdk";

const contractId = "0.0.4887459"
const topicId = "0.0.4887959"

const NFTDisplay = () => {
  const [nfts, setNfts] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [likeCounts, setLikeCounts] = useState({}); // State to hold like counts

  useEffect(() => {
    // Fetch NFTs for a given account
    const getNFTs = async () => {
      const nfts = await fetchMintedNFTs();
      //@ts-ignore
      setNfts(nfts);
    };
    
    getNFTs();
  }, []);

  // Function to handle "like" button click 
  //@ts-ignore
  async function addToBucketList(nftId) {
    console.log(nftId?.token_id);
    const client = Client.forTestnet(); //@ts-ignore
    const userAccount = JSON.parse(localStorage.getItem('hederaAccountData'));
    client.setOperator(userAccount?.accountId, PrivateKey.fromStringDer(userAccount?.accountPvtKey));

    const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100_000) // Set gas limit appropriately
        .setFunction("addToBucketList", new ContractFunctionParameters().addString(nftId?.token_id)); // Use addString instead of addUint256

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    console.log(`Transaction status: ${receipt.status}`);
    const sendResponse = await new TopicMessageSubmitTransaction({
      topicId: topicId,
      message: `${nftId?.metadata?.name} (${nftId?.token_id}) is added to bucketlist`,
    }).execute(client);
    const getReceipt = await sendResponse.getReceipt(client);

// Get the status of the transaction
const transactionStatus = getReceipt.status
console.log("The message transaction status " + transactionStatus.toString())
}

  return (
    <div className='p-4'>
      <h2 className='text-md font-bold'>Minted Location NFTs</h2>
      <div className="nft-list flex justify-center flex-wrap">
      {/* @ts-ignore */}
        {nfts.filter(nft => nft.metadata && nft.metadata?.attributes?.[0]?.trait_type).map(nft => (
            // @ts-ignore
          <Card key={nft.tokenInfo?.token_id} className="nft-card flex justify-center items-center m-2 bg-[#f2f2f27d] w-[320px]">
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
            <Button onClick={() => addToBucketList(nft)}>
            {/* @ts-ignore */}
              Add to Bucket
            </Button>
            </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NFTDisplay;
