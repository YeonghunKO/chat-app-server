import { Socket } from "socket.io";
import { type DefaultEventsMap } from "socket.io/dist/typed-events";

const updateChatList = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  {
    otherSocketId,
    from,
    to,
  }: {
    otherSocketId: string;
    from: number;
    to: number;
  }
) => {
  if (otherSocketId) {
    socket.to(otherSocketId).emit("get-updated-messages", {
      from,
      to,
    });

    setTimeout(() => {
      socket.to(otherSocketId).emit("update-chat-list-status", {
        to,
      });
    }, 500);
  }
  setTimeout(() => {
    // send socket to me
    socket.emit("update-chat-list-status", {
      to: from,
    });
  }, 500);
};

export { updateChatList };
