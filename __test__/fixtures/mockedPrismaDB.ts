export interface IUserInfo {
  id: number | null;
  email: string | null;
  name: string | null;
  profilePicture: string | null;
  about?: string;
  password?: string;
  refreshToken: string;
  sentMessage: IMessages[];
  recievedMessage: IMessages[];
}

export interface IUserCreateInfo {
  email: string | null;
  name: string | null;
  about?: string;
  password?: string;
}

export interface IMessages {
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
