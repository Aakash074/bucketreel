import React from 'react';
import { Button } from 'antd';

const Navbar: React.FC = () => {
    return (
        <div className="navbar">
            <img src="/path/to/logo.png" alt="Logo" className="logo" />
            <Button type="primary">Button</Button>
        </div>
    );
};

export default Navbar;