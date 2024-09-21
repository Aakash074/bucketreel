import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import Web3ModalProvider from "./Web3ModalProvider";
// import ConnectButton from "./ConnectButton";
import Dashboard from "./dashboard";
function App() {
    const [walletData] = useState(null);
    return (_jsx("div", { className: "App", children: _jsxs(Web3ModalProvider, { children: [walletData && _jsxs("p", { children: ["Connected: ", walletData.accountId] }), _jsx(Dashboard, {})] }) }));
}
export default App;
