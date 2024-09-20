import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function ConnectButton() {
    const { open, close } = useWeb3Modal()

    return (
        <button onClick={open}>Connect Wallet</button>
    )
  }