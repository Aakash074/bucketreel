import { jsx as _jsx } from "react/jsx-runtime";
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { hedera, hederaTestnet, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// 0. Setup queryClient
const queryClient = new QueryClient();
// 1. Your Reown Cloud project ID
//@ts-ignore
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;
console.log(projectId);
// 2. Create wagmiConfig
const metadata = {
    name: 'bucketreel',
    description: 'AppKit Example',
    url: 'https://reown.com/appkit', // origin must match your domain & subdomain
    icons: ['https://assets.reown.com/reown-profile-pic.png']
};
const chains = [mainnet, hedera, hederaTestnet];
const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
});
// 3. Create modal
createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true // Optional - false as default
});
//@ts-ignore
export default function Web3ModalProvider({ children }) {
    return (_jsx(WagmiProvider, { config: config, children: _jsx(QueryClientProvider, { client: queryClient, children: children }) }));
}
