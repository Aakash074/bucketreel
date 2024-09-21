import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { fetchMintedNFTs } from './fetchNFTs'; // Import the function to fetch NFTs
import { Button, Card } from 'antd';
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
        }
        catch (error) {
            console.error("Error liking NFT", error);
        }
    };
    return (_jsxs("div", { className: 'p-4', children: [_jsx("h2", { className: 'text-md font-bold', children: "Minted Location NFTs" }), _jsx("div", { className: "nft-list flex flex-wrap", children: nfts.filter(nft => nft.metadata && nft.metadata?.attributes?.[0]?.trait_type).map(nft => (
                // @ts-ignore
                _jsxs(Card, { className: "nft-card flex justify-center items-center m-2", children: [_jsx("img", { src: `https://peach-accused-eel-595.mypinata.cloud/ipfs/${nft.metadata?.image?.split('ipfs://')[1]}`, alt: nft.metadata?.name, className: 'rounded-md', style: { width: '100%', maxWidth: '250px' } }), _jsxs("div", { className: 'flex flex-row justify-between items-center pt-4', children: [_jsxs("div", { className: 'flex flex-col', children: [_jsx("h3", { children: nft.metadata?.name }), _jsx("p", { children: nft.metadata?.description })] }), _jsxs(Button, { onClick: () => handleLike(nft.tokenInfo?.token_id), children: ["Like (", likeCounts[nft?.tokenInfo?.token_id] || 0, ")"] })] })] }, nft.tokenInfo?.token_id))) })] }));
};
export default NFTDisplay;
