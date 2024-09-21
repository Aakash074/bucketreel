import {
    Client,
    PrivateKey,
    TopicCreateTransaction,
} from "@hashgraph/sdk";

const HEDERA_ACCOUNT_ID = "0.0.4866116"; // Your Hedera Testnet Account ID
const HEDERA_PRIVATE_KEY = PrivateKey.fromString("302e020100300506032b657004220420600c8fc074e720e52495c2ab0ac77d38129850d9889e86d2d220d75d59e56a74");

const client = Client.forTestnet();
client.setOperator(HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY);

// Create a new topic
let txResponse = await new TopicCreateTransaction().execute(client);

// Grab the newly generated topic ID
let receipt = await txResponse.getReceipt(client);
let topicId = receipt.topicId;
console.log(`Your topic ID is: ${topicId}`);

// Wait 5 seconds between consensus topic creation and subscription creation
await new Promise((resolve) => setTimeout(resolve, 5000));