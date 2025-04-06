import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { IGroup } from "../../types/IUser";
import "../../styles/group_settings.scss";
import axios from "../../utils/axios";
interface GroupSettingsProps {
    item: IGroup;
}

interface IIsFriends {
    id: number;
    isfriends: boolean;
}

const GroupSettings = ({ item }: GroupSettingsProps) => {
    const [isFriends, setIsFriends] = useState<IIsFriends[]>([]);
    const [showMembers, setShowMembers] = useState(false);
    const [showChangeName, setShowChangeName] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [showConfirmLeaveGroup, setShowConfirmLeaveGroup] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [addMemberInput, setAddMemberInput] = useState("");
    const { friends, user } = useAuthContext();
    const group = item;
    useEffect(() => {
        const checkIfFriends = () => {
            const updatedIsFriends: IIsFriends[] = group.members.map((member) => {
                const isFriend = friends.some((friend) => friend.id === member.id);
                return { id: member.id, isfriends: isFriend }
            })
            setIsFriends(updatedIsFriends)

        }
        checkIfFriends();
    }, []);

    const handleAddFriend = (member_id: number) => {
        member_id
    }
    const handleAddMember = async () => {

        try {
            const username = addMemberInput
            const response = await axios.post("/friend/finduser", { username }, { withCredentials: true });
            const addMemberRequestData = {
                sender_id: user?.id,
                receiver_id: response.data.user[0].id,
                group_id: group.id
            }
            await axios.post("/group/invitation/send", addMemberRequestData, { withCredentials: true })

            setShowAddMember(false)
        } catch (error) {
            console.log(error);

        }
    }
    const handleRemoveMember = async () => {

    }

    const handleChangeGroupName = () => {

    }

    const handleLeaveGroup = () => {

    }
    return (
        <div className="relative-div">
            <div className="group-settings">
                <div className="group-settings__options">
                    <p onClick={() => setShowMembers(!showMembers)} className="group-settings__options__option">Members</p>
                    {showMembers &&
                        <div className="group-settings__options__members">
                            {group.members.map((member) => {
                                const isFriend = isFriends.some((friend) => friend.id === member.id && friend.isfriends)
                                const isOwnerOfGroup = member.id === group.created_by;
                                const isOwnerUser = user?.id === group.created_by
                                console.log(`is creator: ${isOwnerOfGroup}, member id: ${member.id}, creator id: ${group.created_by}`);

                                return (
                                    <div key={member.id} className="group-settings__options__members__member">
                                        <p className="group-settings__options__members__member__name">{member.username}</p>
                                        <p>{isOwnerOfGroup && "Creator"}</p>
                                        {isFriend ?
                                            <div>
                                                <p className="group-settings__options__members__member__status">Friend</p>
                                                {isOwnerUser &&
                                                    <p className="group-settings__options__members__member__remove" onClick={handleRemoveMember}>x</p>
                                                }
                                            </div>
                                            :
                                            member.id === user?.id ?
                                                <p
                                                    className="group-settings__options__members__member__status"
                                                >you</p>
                                                :
                                                <div>
                                                    <p onClick={() => handleAddFriend(member.id)}>
                                                        Add Friend
                                                    </p>
                                                    {isOwnerUser &&
                                                        <p className="group-settings__options__members__member__remove" onClick={handleRemoveMember}>x</p>
                                                    }
                                                </div>
                                        }
                                    </div>
                                )
                            })}
                            <div>
                                {showAddMember &&
                                    <input type="text" placeholder="Username" value={addMemberInput} onChange={(e) => setAddMemberInput(e.target.value)} />}
                                <div>
                                    <button onClick={() => !showAddMember ? setShowAddMember(true) : handleAddMember()}>add Member</button>
                                </div>
                            </div>
                        </div>
                    }
                    <p
                        onClick={() => setShowChangeName(true)}
                        className="group-settings__options__option"
                    >
                        Change Group Name
                    </p>
                    {showChangeName &&
                        <div className="group-settings__options__change-name">
                            <input
                                className="group-settings__options__change-name__input"
                                type="text"
                                placeholder="New Group Name"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                            />
                            <div className="group-settings__options__change-name__btns">
                                <button
                                    className="group-settings__options__change-name__btns__btn"
                                    onClick={() => handleChangeGroupName}
                                >
                                    Change Name
                                </button>
                                <button
                                    className="group-settings__options__change-name__btns__btn"
                                    onClick={() => setShowChangeName(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    }
                    <p
                        onClick={() => setShowConfirmLeaveGroup(true)}
                        className="group-settings__options__option"
                    >
                        Leave Group
                    </p>
                </div>

                {showConfirmLeaveGroup &&
                    <div className="group_settings__confirm">
                        <p className="group_settings__confirm__text">Are you sure you want to leave {group.name}?</p>
                        <div className="group_settings__confirm__btns">
                            <button
                                onClick={() => handleLeaveGroup}
                                className="group_settings__confirm__btns__btn"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowConfirmLeaveGroup(false)}
                                className="group_settings__confirm__btns__btn"
                            >
                                No
                            </button>
                        </div>

                    </div>
                }

            </div >
        </div >
    );
};

export default GroupSettings;