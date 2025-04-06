import { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";

import "../styles/chat.scss";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import Message from "../components/Message";

export interface IMessage {
    date: Date;
    message: string;
    sentOrReceived: "sent" | "received";
    sender_id?: number;
    name?: string;
    receiver_id?: number;
    group_id?: number;
    id?: number;
}

interface IMessageReceived {
    name: string;
    date: Date;
    message: string;
}

// interface IDirectMessage {
//     id: number;
//     sender_id: number;
//     receiver_id: number;
//     message: string;
//     date: Date;
//     name: string;
// }
// interface IGroupMessage {
//     id: number;
//     group_id: number;
//     sender_id: number;
//     message: string;
//     date: Date;
// }


interface ChatProps {
    roomType: "dm" | "group";
}

const Chat = ({ roomType }: ChatProps) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false);
    const [showTime, setShowTime] = useState({ id: 0, show: false });
    const { roomId, friendId } = useParams<{ roomId?: string; friendId?: string }>();
    const chatId = roomId ?? friendId;
    const { user } = useAuthContext();




    useEffect(() => {
        if (roomType === "group") {
            socket.on("receive_group_message", (sender_id: number, message: IMessageReceived) => {
                setMessages((prev) => [...prev, {
                    group_id: roomId ? parseInt(roomId) : 0,
                    sender_id: sender_id,
                    name: message.name,
                    date: message.date,
                    message: message.message,
                    sentOrReceived: sender_id === user.id ? "sent" : "received",
                }])
                console.log(sender_id, user.id);

            })
        } else {
            socket.on("receive_dm", (sender_id: number, message: IMessageReceived) => {
                setMessages((prev) => [...prev, {
                    sender_id: sender_id,
                    date: message.date,
                    message: message.message,
                    sentOrReceived: sender_id === user.id ? "sent" : "received",
                }])
            })
        }

        return () => {
            if (roomType === "group") {
                socket.off("receive_group_message")
            } else {
                socket.off("receive_dm")
            }
        }
    }, []);
    useEffect(() => {
        if (roomType === "group") {
            socket.emit("join_group", chatId)
        } else {
            socket.emit("join_dm", { userId: user.id, friendId: chatId })
        }
        return () => {
            if (roomType === "group") {
                socket.emit("leave_group", chatId)
            } else {
                socket.emit("leave_dm", { userId: user.id, friendId: chatId })
            }
        }
    }, [chatId]);
    useEffect(() => {
        const eventName = roomType === "group" ? "history_group" : "history_dm";

        const handleMessageHistory = (messages: IMessage[]) => {
            const formattedMessages: IMessage[] = messages.map((msg) => ({
                ...msg,
                sentOrReceived: msg.sender_id === user.id ? "sent" : "received",
            }));
            setMessages(formattedMessages);
        };

        socket.on(eventName, handleMessageHistory);

        return () => {
            socket.off(eventName, handleMessageHistory);
        };
    }, [roomType, user?.id]);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    useEffect(() => {
        if (isTyping) {
            if (roomType === "group") {
                socket.emit("is_typing_group", chatId)
            } else {
                socket.emit("is_typing_dm", { userId: user?.id, friendId: chatId })
            }

        } else {
            if (roomType === "group") {
                socket.emit("stop_typing_group", chatId)
            } else {
                socket.emit("stop_typing_dm", { userId: user?.id, friendId: chatId })
            }
        }
    }, [isTyping]);
    useEffect(() => {
        const typingEvent = roomType === "group" ? "typing_group" : "typing_dm";
        const notTypingEvent = roomType === "group" ? "not_typing_group" : "not_typing_dm";

        socket.on(typingEvent, () => setTyping(true));
        socket.on(notTypingEvent, () => setTyping(false));

        return () => {
            socket.off(typingEvent);
            socket.off(notTypingEvent);
        };
    }, []);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const timeStamp = new Date();
        const messageData = {
            sender_id: user?.id,
            name: user?.username,
            date: timeStamp,
            message: input,
        };

        if (roomType === "group") {
            socket.emit("send_group_message", { ...messageData, roomId });
        } else {
            socket.emit("send_dm", { ...messageData, receiver_id: friendId });
        }

        setInput("");
    };

    return (
        <div className="chat div4">
            <div className="chat__msgs">
                {messages.map((msg, i) => {
                    const prev = messages[i - 1];
                    return (
                        <Message msg={msg} prev={prev} roomType={roomType} setShowTime={setShowTime} i={i} showTime={showTime} />
                    )
                })}
                <div ref={messagesEndRef}></div>
            </div>
            <div className="chat__bottom">
                {typing &&
                    <div className="chat__bottom__typing">
                        <div className="chat__bottom__typing__dot one"></div>
                        <div className="chat__bottom__typing__dot two"></div>
                        <div className="chat__bottom__typing__dot three"></div>
                    </div>
                }
                <div className="chat__bottom__writing">
                    <form onSubmit={sendMessage} className="chat__bottom__writing__form">
                        <input
                            type="text"
                            value={input}
                            onBlur={() => setIsTyping(false)}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.value.trim() !== '' ?
                                    setIsTyping(true)
                                    :
                                    setIsTyping(false)
                            }}
                            className="chat__bottom__writing__form__input"
                        />
                        <button type="submit" className="chat__bottom__writing__form__btn">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;