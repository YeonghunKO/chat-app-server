import { type DefaultEventsMap } from "socket.io/dist/typed-events";
import { io } from "../index";
import { onlineUsers } from "../utils/onlineUser";
import { type Socket } from "socket.io";

const addUser = (
  { me }: { me: number },
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  if (!me) {
    return;
  }
  // set online users soon as logged in
  onlineUsers.setUserValueById({
    userId: me,
    value: {
      chatRoomId: null,
      socketId: socket.id,
    },
  });
  const users = Array.from(onlineUsers.onlineUsersData);
  const currentChatUser = users.find(
    ([userId, { chatRoomId, socketId }]) => chatRoomId === me
  );

  // send users updated online users
  io.emit("get-onlineUsers", {
    onlineUsers: JSON.stringify(users),
  });

  // update count of unread messages in chat list and message status
  // 아래 로직을 common 폴더에 분리해보기. (srp)
  if (currentChatUser) {
    // condition
    const [currentChatUserId, { socketId }] = currentChatUser;

    // recieve msg arg
    socket.to(socketId).emit("get-updated-messages", {
      from: me,
      to: currentChatUserId,
    });

    // update-chat-list-status arg
    setTimeout(() => {
      socket.to(socketId).emit("update-chat-list-status", {
        to: currentChatUserId,
      });
    }, 500);
  }

  // update-chat-list-status arg
  setTimeout(() => {
    socket.emit("update-chat-list-status", {
      to: me,
    });
  }, 500);
};

export { addUser };
