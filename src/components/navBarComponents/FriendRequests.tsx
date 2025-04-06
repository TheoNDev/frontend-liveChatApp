import { ChangeEvent, useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useAuthContext } from "../../hooks/useAuthContext";

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

    const { user } = useAuthContext();

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

    }
    return (
        <div>
            <div>
                <select value={requestsSelect} onChange={handleRequestSelect}>
                    <option value="Received">Received</option>
                    <option value="Sent">Sent</option>
                </select>

            </div>
            <div>
                {showRequestsSent ? (
                    fromUserError ? (
                        <p>{fromUserError}</p>
                    ) : (
                        requestsFromUser.map((request) => (
                            <div key={request.id}>
                                <p>{request.username}</p>
                                <p>{request.status}</p>
                            </div>
                        ))
                    )
                ) : (
                    toUserError ? (
                        <p>{toUserError}</p>
                    ) : (
                        requestsToUser.map((request) => (
                            <div key={request.id}>
                                <p>{request.username}</p>
                                <button onClick={() => handleAcceptRequest(request.id)}>accept</button>
                                <button>deny</button>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default FriendRequests;