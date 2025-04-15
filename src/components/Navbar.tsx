import "../styles/navbar.scss";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import Requests from "./navBarComponents/Requests";
import socket from "../utils/socket";
import axios from "../utils/axios";





const Navbar = () => {
    const [showRequests, setShowRequests] = useState(false);
    const [requestNotification, setRequestNotification] = useState(false);
    const { user, friends, logout } = useAuthContext();

    useEffect(() => {
        if (!user.id) return;

        const fetchRequestsToUser = async () => {
            try {
                const response = await axios.get(`/friend/requests/${user.id}/received`);
                if (response.data.length === 0) {
                    setRequestNotification(false);
                } else if (response.status === 200) {
                    setRequestNotification(true);
                } else {
                    setRequestNotification(false);
                }
            } catch (error: any) {
                console.error("Error fetching requests:", error.response?.data?.message || "Failed to fetch friend requests");
            }

        };
        fetchRequestsToUser();
    }, [friends, user]);

    useEffect(() => {
        socket.on("friend_request_received", () => {
            setRequestNotification(true);
        })
        return () => {
            socket.off("friend_request_received");
        }
    }, []);



    return (
        <div className="nav div2" >
            <div className="nav__left">
                <p
                    className="nav__title"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowRequests(!showRequests)}>Requests</p>
                {requestNotification && <span className="nav__left__notification"></span>}
            </div>
            {showRequests && <Requests />}

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