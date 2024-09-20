/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { Button, Card } from 'antd';
import ConnectButton from './ConnectButton';
import { useAccount } from 'wagmi';
import UploadComponent from './UploadComponent'
import environmentSetup from './hedera';
import { useDisconnect } from 'wagmi'
// import { TokenCreateTransaction, TokenSupplyType } from '@hashgraph/sdk';
// import createFirstNft from './CreateNFT';

const Dashboard: React.FC = () => {

    const { address, isConnecting, isDisconnected } = useAccount()
    const [file, setFile] = React.useState<File | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [hederaClient, setHederaClient] = React.useState<any>(null);
    const { disconnect } = useDisconnect()

    useEffect(() => {
     const client =   environmentSetup()
        setHederaClient(client)
    },[])

    const images = [
        'https://lh5.googleusercontent.com/p/AF1QipPkgKtb16DvNNtwxuUwuTe7r7o7H1dLW9kOnKJZ=w540-h312-n-k-no',
        'https://lh5.googleusercontent.com/p/AF1QipPQsDS8ePCYBxhc4NmO3UVnXBmjKuomjjTclFQ9=w540-h312-n-k-no',
        'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/85/5a/14/view-of-falls-from-bridge.jpg?w=1200&h=-1&s=1',
    ];

    const handleMint = async () => {
//        //Create the NFT
// const nftCreate = await new TokenCreateTransaction()
// .setTokenName("diploma")
// .setTokenSymbol("GRAD")
// .setTokenType(TokenType.NonFungibleUnique)
// .setDecimals(0)
// .setInitialSupply(0)
// .setTreasuryAccountId("0xdae3D2b11bB7F68946cbE14493612afF6f9f8E86")
// .setSupplyType(TokenSupplyType.Finite)
// .setMaxSupply(250)
// .setSupplyKey(supplyKey)
// .freezeWith(hederaClient);

// //Sign the transaction with the treasury key
// const nftCreateTxSign = await nftCreate.sign(treasuryKey);

// //Submit the transaction to a Hedera network
// const nftCreateSubmit = await nftCreateTxSign.execute(client);

// //Get the transaction receipt
// const nftCreateRx = await nftCreateSubmit.getReceipt(client);

// //Get the token ID
// const tokenId = nftCreateRx.tokenId;

// //Log the token ID
// console.log("Created NFT with Token ID: " + tokenId);
// createFirstNft()
    }

    return (
        <div>
            {!address ? <ConnectButton />
                :
                <div>
                    <h2 className='text-center'>Welcome {address}</h2>
                    <Button onClick={() => {localStorage.clear(); disconnect();}}>Disconnect</Button>
                    <div className='flex justify-center my-5'>
                        <UploadComponent />
                        <Button onClick={handleMint}>Mint</Button>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-4'>
                        {images.map((image, index) => (
                            <Card key={index} style={{ width: 300 }}>
                                <img src={image} alt={`Image ${index + 1}`} style={{ width: '100%' }} />
                            </Card>
                        ))}
                    </div>
                </div>}
        </div>
    );
};

export default Dashboard;