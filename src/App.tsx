import React, { useState } from "react";
import Web3ModalProvider from "./Web3ModalProvider";
// import ConnectButton from "./ConnectButton";
import Dashboard from "./dashboard";
function App() {
  const [walletData] = useState(null);

  return (
    <div className="App">
      <Web3ModalProvider>
      {/* <button onClick={connectWallet}>Connect Wallet</button> */}
      {/* @ts-ignore */}
      {walletData && <p>Connected: {walletData.accountId}</p>}
      <Dashboard />
      </Web3ModalProvider>
    </div>
  );
}

export default App;
