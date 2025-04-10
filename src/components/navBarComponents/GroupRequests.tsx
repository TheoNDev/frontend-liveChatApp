import { ChangeEvent, useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../styles/requests.scss";

interface IRequests {
    group_id: number;
    group_name: string;
    receiver_username?: string;
    sender_username?: string;
    status: string;
    receiver_id?: number;
    sender_id?: number;
}
const GroupRequests = () => {
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
                const response = await axios.get(`/group/requests/${user.id}/received`);
                if (response.status === 200) {
                    setRequestsToUser(response.data.groupInvitations);
                    setToUserError("");
                } else {
                    setToUserError(response.data.message);
                }
            } catch (error: any) {
                setToUserError(error.response?.data?.message || "Failed to fetch group invites");
            }
        };

        fetchRequestsToUser();
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        const fetchRequestsFromUser = async () => {
            try {
                const response = await axios.get(`/group/requests/${user.id}/sent`);
                if (response.status === 200) {
                    setRequestsFromUser(response.data.groupInvitations);
                    setFromUserError("");
                } else {
                    setFromUserError(response.data.message);
                }
            } catch (error: any) {
                setFromUserError(error.response?.data?.message || "Failed to fetch sent invitations");
            }
        };

        fetchRequestsFromUser();
    }, [])

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

    const handleAcceptRequest = async (sender_id: number, group_id: number) => {
        const requestData = {
            sender_id: sender_id,
            receiver_id: user?.id,
            group_id: group_id
        }
        console.log(requestData);

        const response = await axios.post("/group/invitation/accept", requestData, { withCredentials: true })
        console.log(response.data);
        requestsToUser.filter((request) => request.sender_id === requestData.sender_id)


    }

    return (
        <div className="requests">
            <div className="requests__header">
                <select
                    className="requests__header__select"
                    value={requestsSelect}
                    onChange={handleRequestSelect}>
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
                            <div key={request.group_id} className="requests__container__sent">
                                <p className="requests__container__name">{request.group_name}</p>
                                <p className="requests__container__user">{request.receiver_username}</p>
                                <p className="requests__container__status">{request.status}</p>
                            </div>
                        ))
                    )
                ) : (
                    toUserError ? (
                        <p>{toUserError}</p>
                    ) : (
                        requestsToUser.map((request) => (
                            <div key={request.group_id} className="requests__container__received">
                                <p
                                    className="requests__container__received__name"
                                >{request.group_name}</p>
                                <p
                                    className="requests__container__received__user"
                                >from: {request.sender_username}</p>
                                <button
                                    className="requests__container__received__btn"
                                    onClick={() => handleAcceptRequest(request.sender_id!, request.group_id)}>accept</button>
                                <button
                                    className="requests__container__received__btn"
                                >deny</button>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default GroupRequests;