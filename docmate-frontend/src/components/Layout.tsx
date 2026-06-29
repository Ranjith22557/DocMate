import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {

    return (

        <div style={{flex:1, marginLeft: "240px",display: "flex",flexDirection: "column"}}>

            <Sidebar />
            <div style={{flex: 1,display: "flex",flexDirection: "column"}}>
                <Header />
                <div style={{flex: 1,padding: "25px",overflow: "auto"}}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Layout;