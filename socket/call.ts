import { io } from "../index";
import { onlineUsers } from "../utils/onlineUser";

const addUser = ({ me }: { me: number }, socket: any) => {
  if (me) {
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

    io.emit("get-onlineUsers", {
      onlineUsers: JSON.stringify(users),
    });

    // chat container에 상대방이 로그인하면 메시지 상태 변경 및 chat list 숫자 팝업 업데이트
    // 아래 로직을 common 폴더에 분리해보기. (srp)
    if (currentChatUser) {
      // condition
      const [currentChatUserId, { socketId }] = currentChatUser;

      // recieve msg arg
      socket.to(socketId).emit("recieve-msg", {
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
  }
};

export { addUser };
