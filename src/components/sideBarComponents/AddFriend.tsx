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
        <div>
            <p onClick={() => setShowAddFriend(true)}>+</p>
            {showAddFriend &&
                <div>
                    <input
                        type="text"
                        placeholder="enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleAddFriend}>add Friend</button>
                </div>
            }
        </div>
    );
};

export default AddFriend;