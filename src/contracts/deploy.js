import {
    Client,
    PrivateKey,
    ContractCreateTransaction,
    FileCreateTransaction,
    ContractFunctionParameters,
} from "@hashgraph/sdk";

// Replace with your Hedera Account ID and Private Key
const HEDERA_ACCOUNT_ID = "0.0.4866116"; // Your Hedera Testnet Account ID
const HEDERA_PRIVATE_KEY = PrivateKey.fromString("302e020100300506032b657004220420600c8fc074e720e52495c2ab0ac77d38129850d9889e86d2d220d75d59e56a74");

// Bytecode of the BucketList contract
const contractBytecode = "608060405234801561001057600080fd5b50610395806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80635fbfb9cf1461003b578063a68fd5a714610057575b600080fd5b6100556004803603810190610050919061025c565b610073565b005b610071600480360381019061006c919061028a565b61010d565b005b600080600084815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001549050600080600085815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018190555050505050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506000816000016000828254610160919061030e565b92505081905550806000015460008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001546101b5919061030e565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001819055503373ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f2a452d964f1c3b4739b63455f7d7faaab5f51a25b8efce0c96b7cac8d1c105a883600001546040516102519190610364565b60405180910390a3505050565b60008135905061026b8161037f565b92915050565b60008135905061028081610396565b92915050565b60006020828403121561029c57600080fd5b60006102aa8482850161025c565b91505092915050565b6000602082840312156102c557600080fd5b60006102d384828501610271565b91505092915050565b6102e581610397565b82525050565b6102f4816103a1565b82525050565b61030381610397565b82525050565b600061031982610397565b915061032483610397565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156103595761035861041c565b5b828201905092915050565b600060208201905061037960008301846102fa565b92915050565b61038881610397565b811461039357600080fd5b50565b6103aa81610397565b82525050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fdfea264697066735822122088e2e7bdcd16ad1ffbdbd1bdb33a1d8e1da84bf4bc1e384551cc361847dd56d864736f6c63430008000033";

async function main() {
    // Create Hedera client
    const client = Client.forTestnet();
    client.setOperator(HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY);

    // Create a file on Hedera and store the bytecode
    const fileCreateTx = new FileCreateTransaction()
        .setContents(contractBytecode)
        .setKeys([HEDERA_PRIVATE_KEY]);
    const fileCreateSubmit = await fileCreateTx.execute(client);
    const fileCreateRx = await fileCreateSubmit.getReceipt(client);
    const bytecodeFileId = fileCreateRx.fileId;
    console.log(`- The bytecode file ID is: ${bytecodeFileId} \n`);

    // Instantiate the contract instance
    const contractInstantiateTx = new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
        .setGas(100000);
    const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
    const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
    const contractId = contractInstantiateRx.contractId;
    const contractAddress = contractId.toSolidityAddress();
    console.log(`- The contract ID is: ${contractId} \n`);
    console.log(`- The contract address (for use in Solidity) is: ${contractAddress} \n`);

    client.close();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});