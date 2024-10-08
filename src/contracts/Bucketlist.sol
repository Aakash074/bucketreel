// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BucketList {

    // Mapping from user address to a list of NFT IDs they've added to their bucket list
    mapping(address => string[]) private userBucketList;

    // Event to be emitted when a user adds an NFT to their bucket list
    event NFTAdded(address indexed user, string nftId);

    // Add an NFT to the user's bucket list
    function addToBucketList(string memory nftId) public {
        userBucketList[msg.sender].push(nftId);
        emit NFTAdded(msg.sender, nftId);
    }

    // Get the bucket list of a specific user
    function getBucketList(address user) public view returns (string[] memory) {
        return userBucketList[user];
    }
}