import { type DefaultEventsMap } from "socket.io/dist/typed-events";
import { io } from "../index";
import { onlineUsers } from "../utils/onlineUser";
import { type Socket } from "socket.io";
import { updateChatList } from "./common";

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

  if (currentChatUser) {
    const [currentChatUserId, { socketId }] = currentChatUser;

    updateChatList(socket, {
      from: me,
      to: currentChatUserId,
      otherSocketId: socketId,
    });
  }
};

export { addUser };
