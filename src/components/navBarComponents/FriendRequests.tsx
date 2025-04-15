import { ChangeEvent, useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../styles/requests.scss";
import socket from "../../utils/socket";

interface IRequests {
    id: number;
    username: string;
    status: string;
}

const FriendRequests = () => {
    const [requestsToUser, setRequestsToUser] = useState<IRequests[]>([]);
    const [toUserError, setToUserError] = useState("");
    const [requestsFromUser, setRequestsFromUser] = useState<IRequests[]>([]);
    const [fromUserError, setFromUserError] = useState("");
    const [showRequestsSent, setShowRequestsSent] = useState(false);
    const [requestsSelect, setRequestsSelect] = useState("Received");

    const { user, setFriends } = useAuthContext();

    useEffect(() => {
        if (!user?.id) return;

        const fetchRequestsToUser = async () => {
            try {
                const response = await axios.get(`/friend/requests/${user.id}/received`);
                if (response.status === 200) {
                    setRequestsToUser(response.data.friendRequests);
                    setToUserError(""); // Reset error on success
                } else {
                    setToUserError(response.data.message);
                }
            } catch (error: any) {
                setToUserError(error.response?.data?.message || "Failed to fetch friend requests");
            }
        };

        fetchRequestsToUser();
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        const fetchRequestsFromUser = async () => {
            try {
                const response = await axios.get(`/friend/requests/${user.id}/sent`);
                if (response.status === 200) {
                    setRequestsFromUser(response.data.friendRequests);
                    setFromUserError("");
                } else {
                    setFromUserError(response.data.message);
                }
            } catch (error: any) {
                setFromUserError(error.response?.data?.message || "Failed to fetch sent requests");
            }
        };

        fetchRequestsFromUser();
    }, []);

    const handleRequestSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value
        setRequestsSelect(selectedValue)
        console.log(selectedValue);

        if (selectedValue === "Sent") {
            setShowRequestsSent(true)
        } else (
            setShowRequestsSent(false)
        )
    }

    const handleAcceptRequest = async (sender_id: number) => {
        const requestData = {
            sender_id: sender_id,
            receiver_id: user?.id
        }

        const response = await axios.post("/friend/accept", requestData, { withCredentials: true })
        console.log(response.data);
        if (response.status === 200) {
            setRequestsToUser((prevRequests) => prevRequests.filter((request) => request.id !== sender_id));
            setFriends((prevFriends) => [...prevFriends, response.data.friend]);
            socket.emit("accept_friend_request", {
                sender_id: sender_id,
                receiver_id: user.id,
            });
        }

    }
    return (
        <div className="requests">
            <div className="requests__header">
                <select
                    className="requests__header__select"
                    value={requestsSelect} onChange={handleRequestSelect}>
                    <option value="Received">Received</option>
                    <option value="Sent">Sent</option>
                </select>

            </div>
            <div className="requests__container">
                {showRequestsSent ? (
                    fromUserError ? (
                        <p>{fromUserError}</p>
                    ) : (
                        requestsFromUser.map((request) => (
                            <div
                                className="requests__container__sent"
                                key={request.id}>
                                <p className="requests__container__user">{request.username}</p>
                                <p className="requests__container__status">{request.status}</p>
                            </div>
                        ))
                    )
                ) : (
                    toUserError ? (
                        <p>{toUserError}</p>
                    ) : (
                        requestsToUser.map((request) => (
                            <div
                                className="requests__container__received"
                                key={request.id} >
                                <p className="requests__container__user" >{request.username}</p>
                                <button
                                    className="requests__container__btn"
                                    onClick={() => handleAcceptRequest(request.id)}>accept</button>
                                <button
                                    className="requests__container__btn"
                                >deny</button>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default FriendRequests;