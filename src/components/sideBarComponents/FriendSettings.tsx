import { IFriend } from "../../types/IUser";

interface FriendSettingsProps {
    item: IFriend;
}

const FriendSettings = ({ item }: FriendSettingsProps) => {

    const friend = item;
    return (
        <>
            {friend}
        </>
    );
};

export default FriendSettings;