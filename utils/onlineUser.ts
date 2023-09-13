interface IOnlineUser {
  setUserBySocketId: (userId: number, socketId: string) => void;
  isUserLoggedIn: (userId: number) => boolean;
  getSocketIdByUserId: (userId: number) => string;
}

class OnlineUser implements IOnlineUser {
  private onlineUsers: Map<any, any>;
  constructor() {
    this.onlineUsers = new Map();
  }

  isUserLoggedIn(userId: number) {
    return !!this.onlineUsers.get(userId);
  }

  getSocketIdByUserId(userId: number) {
    return this.onlineUsers.get(userId);
  }

  setUserBySocketId(userId: number, socketId: string) {
    this.onlineUsers.set(userId, socketId);
  }
}

const onlineUsers = new OnlineUser();

export { onlineUsers };
