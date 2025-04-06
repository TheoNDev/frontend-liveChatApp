import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";

interface ChatListItemProps<T> {
    item: T;
    type: "group" | "friend";
    SettingsComponent?: React.FC<{ item: T }>;
}

const ChatListItem = <T extends { id: number; name?: string; username?: string }>({
    item,
    type,
    SettingsComponent,
}: ChatListItemProps<T>) => {
    const [showSettings, setShowSettings] = useState({ show: false, id: 0 });

    return (
        <div key={item.id} className="sidebar__chats__chat">
            <Link to={`/chat/${type}/${item.id}`} className="sidebar__chats__chat__link">
                {item.name || item.username}
            </Link>

            {showSettings.show && showSettings.id === item.id ? (
                <IoMdClose onClick={() => setShowSettings({ show: false, id: 0 })} />
            ) : (
                <div className="sidebar__chats__chat__setting" onClick={() => setShowSettings({ show: true, id: item.id })}>
                    <span className="dot dot1"></span>
                    <span className="dot dot2"></span>
                    <span className="dot dot3"></span>
                </div>
            )}

            {showSettings.show && showSettings.id === item.id && SettingsComponent && (
                <SettingsComponent item={item} /> // ✅ Always passes `item`
            )}
        </div>
    );
};

export default ChatListItem;