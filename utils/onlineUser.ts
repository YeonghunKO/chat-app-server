interface IOnlineUser {
  setUserBySocketId: (userId: number, socketId: string) => void;
  isUserLoggedIn: (userId: number) => boolean;
  getSocketIdByUserId: (userId: number) => string;
}

class OnlineUser implements IOnlineUser {
  private onlineUser: Map<any, any>;
  constructor() {
    this.onlineUser = new Map();
  }

  isUserLoggedIn(userId: number) {
    return !!this.onlineUser.get(userId);
  }

  getSocketIdByUserId(userId: number) {
    return this.onlineUser.get(userId);
  }

  setUserBySocketId(userId: number, socketId: string) {
    this.onlineUser.set(userId, socketId);
  }
}

const onlineUser = new OnlineUser();

export { onlineUser };
