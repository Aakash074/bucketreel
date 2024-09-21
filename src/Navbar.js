import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from 'antd';
const Navbar = () => {
    return (_jsxs("div", { className: "navbar", children: [_jsx("img", { src: "/path/to/logo.png", alt: "Logo", className: "logo" }), _jsx(Button, { type: "primary", children: "Button" })] }));
};
export default Navbar;
