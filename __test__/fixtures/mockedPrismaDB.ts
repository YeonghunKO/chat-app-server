export interface IUserInfo {
  id: number | null;
  email: string | null;
  name: string | null;
  profilePicture: string | null;
  about?: string;
  password?: string;
  refreshToken?: string;
  sentMessage?: IMessages[];
  recievedMessage?: IMessages[];
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

export const AEIKA_USER = {
  id: 7,
  email: "aeika@gmail.com",
  about: "I'm the boss",
  profilePicture: "/default_avatar.png",
  name: "aeika ahsek",
};

export const SINKYO_USER = {
  id: 3,
  email: "yhko1988@gmail.com",
  about: "",
  profilePicture:
    "https://lh3.googleusercontent.com/a/AAcHTte4mt9cW8prnT-yizJpQxQy3L6DVLjACaQ-S-o6N1FNHRA=s96-c",
  name: "KIKI KEN",
};

export const BEN_USER = {
  id: 11,
  email: "ben@gmail.com",
  about: "i love harry",
  profilePicture: "ben_prifle.png",
  name: "ben kotlin",
};

export const mockedPrismaUserDB: Map<string, IUserInfo> = new Map();
export const mockedPrismaMessagesDB: IMessages[] = [
  {
    id: 693,
    senderId: 3,
    recieverId: 7,
    sender: SINKYO_USER,
    reciever: AEIKA_USER,
    message: "hey",
    type: "text",
    status: "sent",
    createdAt: "2023-12-07T01:32:41.076Z",
  },
  {
    id: 704,
    senderId: 7,
    recieverId: 11,
    sender: AEIKA_USER,
    reciever: BEN_USER,
    message: "hey ben sub!",
    type: "text",
    status: "sent",
    createdAt: "2023-12-14T12:51:24.728Z",
  },
  {
    id: 704,
    senderId: 7,
    recieverId: 11,
    sender: AEIKA_USER,
    reciever: BEN_USER,
    message: "ㅎㅎ",
    type: "text",
    status: "sent",
    createdAt: "2023-12-14T12:51:24.728Z",
  },
  {
    id: 697,
    senderId: 7,
    recieverId: 3,
    sender: AEIKA_USER,
    reciever: SINKYO_USER,
    message: "sub",
    type: "text",
    status: "sent",
    createdAt: "2023-12-07T02:03:44.847Z",
  },
  {
    id: 700,
    senderId: 7,
    recieverId: 3,
    sender: AEIKA_USER,
    reciever: SINKYO_USER,
    message: "d",
    type: "text",
    status: "sent",
    createdAt: "2023-12-07T02:06:01.609Z",
  },
  {
    id: 701,
    senderId: 3,
    recieverId: 7,
    sender: SINKYO_USER,
    reciever: AEIKA_USER,
    message: "fw",
    type: "text",
    status: "sent",
    createdAt: "2023-12-07T02:06:22.117Z",
  },
];
