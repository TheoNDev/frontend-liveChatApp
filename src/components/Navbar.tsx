import "../styles/navbar.scss";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import Requests from "./navBarComponents/Requests";





const Navbar = () => {
    const [showRequests, setShowRequests] = useState(false);
    const { logout } = useAuthContext();


    return (
        <div className="nav div2" >
            <p
                className="nav__title"
                style={{ cursor: "pointer" }}
                onClick={() => setShowRequests(!showRequests)}>Requests</p>
            {showRequests && <Requests /*showRequests={showRequests}*/ />}

            <p className="nav__title">Chat</p>

            <p
                style={{ cursor: "pointer" }}
                className="nav__title"
                onClick={logout}
            >
                Logout
            </p>

        </div>
    );
};

export default Navbar;