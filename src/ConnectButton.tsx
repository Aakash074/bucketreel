import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from 'antd';
import { useAccount, useConnect } from 'wagmi';
import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar
} from "@hashgraph/sdk";
import LogoUrl from "./assets/logo.png";

// Initialize your Hedera client
const client = Client.forTestnet(); // @ts-ignore
console.log(import.meta.env.VITE_HEDERA_TESTNET_ACCOUNT_ID, import.meta.env.VITE_HEDERA_TESTNET_PRIVATE_KEY, "accounts");
//@ts-ignore
client.setOperator(import.meta.env.VITE_HEDERA_TESTNET_ACCOUNT_ID, import.meta.env.VITE_HEDERA_TESTNET_PRIVATE_KEY);

// Create or retrieve a Hedera account
const getOrCreateHederaAccount = async () => {
  try {
    const accountPrivateKey = PrivateKey.generateED25519();

    const response = await new AccountCreateTransaction()
      .setInitialBalance(new Hbar(5)) // Set initial balance to 5 Hbar
      .setKey(accountPrivateKey)
      .execute(client);
    
    const receipt = await response.getReceipt(client);
    
    // Store accountId and privateKey as a JSON string in local storage
    const accountData = { //@ts-ignore
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

export default function ConnectButton() {
  const { open } = useWeb3Modal();
  const { connect } = useConnect();
  const { isConnected } = useAccount();

  const handleConnect = async () => {
    // Open the Web3Modal
    await open();

    // After connecting, create the Hedera account
    if (!isConnected) {
      const accountData = await getOrCreateHederaAccount();
      console.log("Account Data:", accountData);

      // Now, use the newly created Hedera account ID in the WalletConnect
      // You can customize the connection to WalletConnect if necessary
      await connect({  //@ts-ignore
        connector: "walletConnect", // Replace with your desired connector
        accountId: accountData.accountId, // Pass the new Hedera account ID here
        chainId: 296,
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-purple-50 items-center justify-center">
    <img src={LogoUrl} alt="bucketreel" className="w-[360px]" />
    <div className="w-full text-center text-2xl p-2">Influencer-Inspired Travel</div>
    <div className="w-full text-center text-xl p-2">Powered by Web3</div>
    <Button size="middle" className="text-violet-600 text-lg p-2 m-2 border-[1px] border-violet-600" onClick={handleConnect}>Login / Connect Wallet</Button>
    </div>
  );
}
