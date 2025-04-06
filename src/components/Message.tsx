import { IMessage } from "../pages/Chat";

interface MessageProps {
    msg: IMessage;
    prev: IMessage | undefined;
    roomType: "dm" | "group";
    setShowTime: React.Dispatch<React.SetStateAction<{ id: number; show: boolean }>>;
    showTime: { id: number, show: boolean };
    i: number;
}

const Message = ({ msg, prev, roomType, setShowTime, showTime, i }: MessageProps) => {
    const newDate = new Date(msg.date);
    const timeDifference = prev ? newDate.getTime() - new Date(prev.date).getTime() : Infinity;
    const moreThan2Hours = timeDifference > 2 * 60 * 60 * 1000;

    const isToday = newDate.toDateString() === new Date().toDateString();
    const isYesterDay = newDate.getDate() === new Date().getDate() - 1 &&
        newDate.getMonth() === new Date().getMonth() &&
        newDate.getFullYear() === new Date().getFullYear();

    const isNewGroup = !prev || prev.sentOrReceived !== msg.sentOrReceived || moreThan2Hours;

    const formattedTime = newDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const formattedDate = newDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long"
    });



    return (
        <div key={i} className={`chat__msgs__msg ${msg.sentOrReceived === "sent" ? "sent" : "received"}`}>

            {isNewGroup &&
                <p className="chat__msgs__msg__date">
                    {isToday
                        ? `Today ${formattedTime}`
                        : isYesterDay
                            ? `Yesterday ${formattedTime}`
                            : `${formattedDate} ${formattedTime}`}
                </p>
            }


            {roomType === "group" && msg.sentOrReceived === "received" &&
                <p className="chat__msgs__msg__name">{msg.name}</p>
            }

            <p className="chat__msgs__msg__content"
                onMouseEnter={() => setShowTime({ id: i, show: true })}
                onMouseLeave={() => setShowTime({ id: 0, show: false })}
            >
                {msg.message}
                {showTime.id === i && showTime.show && <span className="chat__msgs__msg__content__time">{formattedTime}</span>}
            </p>
        </div>

    );
};

export default Message;