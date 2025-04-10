import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
// import Footer from "../components/Footer";
import "../styles/grid-layout.scss";

const MainLayout = () => {

    return (
        <div className="grid">
            <Navbar />
            <SideBar />
            <Outlet />
            {/* <Footer /> */}
        </div>
    );
};

export default MainLayout;