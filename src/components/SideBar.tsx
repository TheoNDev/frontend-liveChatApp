import { useEffect, useState } from "react";
import "../styles/sidebar.scss";
import SideBarHeader from "./sideBarComponents/SideBarHeader";
import { useAuthContext } from "../hooks/useAuthContext";
import CreateGroup from "./sideBarComponents/CreateGroup";
import AddFriend from "./sideBarComponents/AddFriend";
import FriendSettings from "./sideBarComponents/FriendSettings";
import GroupSettings from "./sideBarComponents/GroupSettings";
import ChatListItem from "./sideBarComponents/ChatListItem";
import socket from "../utils/socket";


interface IFriendRequestAcceptedData {
    id: number;
    username: string;
}


const SideBar = () => {
    const [isGroups, setIsGroups] = useState(false);
    const { setFriends, friends, groups, user, isAuthenticated } = useAuthContext();

    console.log("user: ", user);
    console.log("isAuthenticated: ", isAuthenticated);

    useEffect(() => {
        socket.on("friend_request_accepted", (friend: IFriendRequestAcceptedData) => {
            console.log("Friend request accepted:", friend);
            setFriends((prev) => [...prev, friend]);
        });
        return () => {
            socket.off("friend_request_accepted");
        }
    }, []);

    return (
        <div className="sidebar div1" >
            <SideBarHeader setIsGroups={setIsGroups} isGroups={isGroups} headerOne={"DMs"} headerTwo={"Groups"} rootClassName={"sidebar"} />
            {isGroups ? <CreateGroup /> : <AddFriend />}
            <div className="sidebar__chats">
                {!isGroups ?
                    friends.length === 0 ?
                        <p>No Friends</p>
                        :
                        friends.map((friend) => (
                            <ChatListItem key={friend.id} item={friend} type={"friend"} SettingsComponent={FriendSettings} />
                        ))
                    :
                    groups.length === 0 ?
                        <p>No Groups</p>
                        :
                        groups.map((group) => (
                            <ChatListItem key={group.id} item={group} type={"group"} SettingsComponent={GroupSettings} />
                        ))
                }
            </div>
        </div>
    );
};

export default SideBar;