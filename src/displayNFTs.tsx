import React, { useState, useEffect } from 'react';
import { fetchMintedNFTs } from './fetchNFTs'; // Import the function to fetch NFTs
import { Button, Card } from 'antd'

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
  const handleLike = async () => {
    try {
      // You would have an API that stores the like count
    //   const response = await axios.post('/api/like', { tokenId });

      // Update like counts (this assumes the API returns the new like count)
    //   setLikeCounts(prev => ({ ...prev, [tokenId]: likeCounts + 1 }));
    } catch (error) {
      console.error("Error liking NFT", error);
    }
  };

  return (
    <div className='p-4'>
      <h2 className='text-md font-bold'>Minted Location NFTs</h2>
      <div className="nft-list flex flex-wrap">
      {/* @ts-ignore */}
        {nfts.filter(nft => nft.metadata && nft.metadata?.attributes?.[0]?.trait_type).map(nft => (
            // @ts-ignore
          <Card key={nft.tokenInfo?.token_id} className="nft-card flex justify-center items-center m-2">
            {/* @ts-ignore */}
            <img src={`https://peach-accused-eel-595.mypinata.cloud/ipfs/${nft.metadata?.image?.split('ipfs://')[1]}`} alt={nft.metadata?.name} className='rounded-md' style={{ width: '100%', maxWidth: '250px' }} />
            <div className='flex flex-row justify-between items-center pt-4'>
            <div className='flex flex-col'>
            {/* @ts-ignore */}
                <h3>{nft.metadata?.name}</h3>
                {/* @ts-ignore */}
                <p>{nft.metadata?.description}</p>
            </div>
            {/* @ts-ignore */}
            <Button onClick={() => handleLike(nft.tokenInfo?.token_id)}>
            {/* @ts-ignore */}
              Like ({likeCounts[nft?.tokenInfo?.token_id] || 0})
            </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NFTDisplay;
