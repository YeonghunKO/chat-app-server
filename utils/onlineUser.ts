export type TOnlineUser = {
  socketId: string;
  chatRoomId: number | undefined | null;
};

interface IOnlineUser {
  setSocketIdByUserId: (userId: number, socketId: string) => void;
  isUserLoggedIn: (userId: number) => boolean;
  getSocketIdByUserId: (userId: number) => string | undefined | null;
  getChatRoomIdByUserId: (userId: number) => number | undefined | null;
  setChatRoomIdByUserId: (userId: number, chatRoomId: number) => void;
  getKeyBySocketId: (socketId: string) => number | undefined | null;
  deleteUser: (userId: number) => void;

  setUserValueById: ({
    userId,
    value,
  }: {
    userId: number;
    value: TOnlineUser;
  }) => void;
}

class OnlineUser implements IOnlineUser {
  private onlineUsers: Map<number, TOnlineUser>;
  constructor() {
    this.onlineUsers = new Map();
  }

  get onlineUsersData() {
    return this.onlineUsers;
  }

  isUserLoggedIn(userId: number) {
    return this.onlineUsers.has(userId);
  }

  getSocketIdByUserId(userId: number) {
    return this.onlineUsers.get(userId)?.socketId;
  }
  getChatRoomIdByUserId(userId: number) {
    return this.onlineUsers.get(userId)?.chatRoomId;
  }

  setSocketIdByUserId(userId: number, socketId: string) {
    if (this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, {
        chatRoomId: this.onlineUsers.get(userId)?.chatRoomId || undefined,
        socketId,
      });
    } else {
      this.onlineUsers.set(userId, { chatRoomId: 0, socketId });
    }
  }

  setChatRoomIdByUserId(userId: number, chatRoomId: number) {
    if (this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, {
        chatRoomId,
        socketId: this.onlineUsers.get(userId)?.socketId || "",
      });
    }
  }

  setUserValueById({ userId, value }: { userId: number; value: TOnlineUser }) {
    if (this.onlineUsers.get(userId)) {
      this.onlineUsers.set(userId, {
        ...this.onlineUsers.get(userId),
        ...value,
      });
    } else {
      this.onlineUsers.set(userId, {
        chatRoomId: value.chatRoomId,
        socketId: value.socketId,
      });
    }
  }

  getKeyBySocketId(socketId: string) {
    for (const [key, value] of this.onlineUsers.entries()) {
      if (value.socketId === socketId) {
        return key;
      }
    }

    return undefined;
  }

  deleteUser(userId: number) {
    this.onlineUsers.delete(userId);
  }

  clearAllUsers() {
    this.onlineUsers.clear();
  }
}

const onlineUsers = new OnlineUser();

export { onlineUsers };
