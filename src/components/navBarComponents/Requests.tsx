import { useState } from "react";
import FriendRequests from "./FriendRequests";
import GroupRequests from "./GroupRequests";
import SideBarHeader from "../sideBarComponents/SideBarHeader";

interface RequestsProps {
    showRequests: boolean;
}

const Requests = ({ showRequests }: RequestsProps) => {
    const [showGroupRequests, setShowGroupRequests] = useState(false);
    return (
        <div className="nav__requests">
            <div className="nav__requests__header">
                <SideBarHeader setIsGroups={setShowGroupRequests} isGroups={showGroupRequests} headerOne={"Friends"} headerTwo={"Groups"} rootClassName={"nav"} />
                {/* <p
                    className="nav__requests__header__btn"
                    onClick={() => setShowGroupRequests(false)}
                >Friends</p>
                <p
                    className="nav__requests__header__btn"
                    onClick={() => setShowGroupRequests(true)}
                >Groups</p> */}
            </div>
            <div className="nav__requests__container">
                {showGroupRequests ?
                    <GroupRequests /> : <FriendRequests />}
            </div>

        </div>
    );
};

export default Requests;