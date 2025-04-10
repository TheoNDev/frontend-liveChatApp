import { useState } from "react";
import axios from "../../utils/axios";
import { useAuthContext } from "../../hooks/useAuthContext";

const AddFriend = () => {
    const [username, setUsername] = useState("");
    const [showAddFriend, setShowAddFriend] = useState(false);

    const { user } = useAuthContext();

    const handleAddFriend = async () => {
        try {
            const response = await axios.post("/friend/finduser", { username }, { withCredentials: true })
            const friendRequestData = {
                sender_id: user.id,
                receiver_id: response.data.user[0].id
            }
            await axios.post("/friend/send", friendRequestData, { withCredentials: true })
            setShowAddFriend(false)

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="add-friend">
            {!showAddFriend &&
                <button
                    className="add-friend__btn"
                    onClick={() => setShowAddFriend(true)}>Add Friend</button>
            }
            {showAddFriend &&
                <div className="add-friend__container">
                    <input
                        className="add-friend__container__input"
                        type="text"
                        placeholder="enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="add-friend__container__btns">
                        <button
                            className="add-friend__container__btns__btn"
                            onClick={handleAddFriend}>add Friend</button>
                        <button
                            className="add-friend__container__btns__btn"
                            onClick={() => setShowAddFriend(false)}>cancel</button>

                    </div>
                </div>
            }
        </div>
    );
};

export default AddFriend;