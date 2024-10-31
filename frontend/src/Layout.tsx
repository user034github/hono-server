import React from 'react';

interface LayoutProps {
    children: React.ReactNode; 
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            <header>
            </header>
            <main>{children}</main>
            <footer>
            </footer>
        </div>
    );
};

export default Layout;