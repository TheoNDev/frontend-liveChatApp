import { useState } from "react";
import FriendRequests from "./FriendRequests";
import GroupRequests from "./GroupRequests";


const Requests = () => {
    const [showGroupRequests, setShowGroupRequests] = useState(false);
    return (
        <div className="nav__requests">
            <div className="nav__requests__header">
                <p
                    className="nav__requests__header__btn"
                    style={{ fontWeight: showGroupRequests ? "normal" : "bold" }}
                    onClick={() => setShowGroupRequests(false)}
                >Friends</p>
                <p
                    className="nav__requests__header__btn"
                    style={{ fontWeight: showGroupRequests ? "bold" : "normal" }}
                    onClick={() => setShowGroupRequests(true)}
                >Groups</p>
            </div>
            <div className="nav__requests__container">
                {showGroupRequests ?
                    <GroupRequests /> : <FriendRequests />}
            </div>

        </div>
    );
};

export default Requests;