import { type DefaultEventsMap } from "socket.io/dist/typed-events";
import { io } from "../index";
import { onlineUsers } from "../utils/onlineUser";
import { type Socket } from "socket.io";
import { updateChatList } from "./common";

const setNewUser = (me: number, socketId: string) => {
  onlineUsers.setUserValueById({
    userId: me,
    value: {
      chatRoomId: null,
      socketId,
    },
  });

  const loggedInUsers = Array.from(onlineUsers.onlineUsersData);
  const userChattingWithMe = loggedInUsers.find(
    ([userId, { chatRoomId, socketId }]) => chatRoomId === me
  );

  return { userChattingWithMe, loggedInUsers };
};

const addUser = (
  { me }: { me: number },
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  if (!me) {
    return;
  }

  const { loggedInUsers, userChattingWithMe } = setNewUser(me, socket.id);

  io.emit("get-onlineUsers", {
    onlineUsers: JSON.stringify(loggedInUsers),
  });

  if (userChattingWithMe) {
    const [userId, { socketId }] = userChattingWithMe;

    updateChatList(socket, {
      from: me,
      to: userId,
      otherSocketId: socketId,
    });
  }
};

export { addUser, setNewUser };
