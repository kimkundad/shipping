import { useEffect } from "react";

export const useSocket = (socket, roomId, onNewMessage) => {
    useEffect(() => {
        if (roomId?.id) {
            // เข้าร่วมห้อง
            socket.emit("join-room", roomId?.id);
            console.log(`Joined room: ${roomId?.id}`);

            // ฟัง event "new-message"
            socket.on("new-message", onNewMessage);

            return () => {
                // ออกจากห้องและลบ listeners
                socket.emit("leave-room", roomId?.id);
                socket.off("new-message", onNewMessage);
            };
        }
    }, [socket, roomId, onNewMessage]);
};
