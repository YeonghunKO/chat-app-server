interface IUserInfo {
  id: number | null;
  email: string | null;
  name: string | null;
  profilePicture: string | null;
  about?: string;
  password: string;
  refreshToken: string;
  sentMessage: IMessages[];
  recievedMessage: IMessages[];
}

interface IMessages {
  id: number;
  sender: IUserInfo;
  senderId: number;
  reciever: IUserInfo;
  recieverId: number;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

export const mockedPrismaUserDB: IUserInfo[] = [];
