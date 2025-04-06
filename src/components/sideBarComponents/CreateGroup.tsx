import { useState } from "react";
import axios from "../../utils/axios";
import { useAuthContext } from "../../hooks/useAuthContext";


const CreateGroup = () => {
    const [name, setName] = useState("");
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    const { user } = useAuthContext();

    const handleCreateGroup = async () => {
        setShowCreateGroup(false)
        const groupData = {
            name: name,
            created_by: user?.id,
        }
        await axios.post("/group/create", groupData, { withCredentials: true })
    }
    return (
        <div className="create-group">
            <button className="create-group__btn" onClick={!showCreateGroup ? () => setShowCreateGroup(true) : handleCreateGroup}>Create Group</button>
            {showCreateGroup &&
                <input className="create-group__input" type="text" placeholder="Group Name" value={name} onChange={(e) => setName(e.target.value)} />
            }
        </div>
    );
};

export default CreateGroup;