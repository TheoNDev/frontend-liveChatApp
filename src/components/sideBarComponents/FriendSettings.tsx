import { IFriend } from "../../types/IUser";

interface FriendSettingsProps {
    item: IFriend;
}

const FriendSettings = ({ item }: FriendSettingsProps) => {

    const friend = item;
    return (
        <div>
            {friend.username}
            <button>
                unfriend
            </button>
        </div>
    );
};

export default FriendSettings;