import {
  mockedPrismaUserDB,
  mockedPrismaMessagesDB,
} from "../fixtures/mockedPrismaDB";

jest.mock("../../utils/PrismaClient", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: {
      create: async (userData: any) => {
        const {
          data: {
            refreshToken: {
              create: { value: refreshToken },
            },
            ...userInfo
          },
        } = userData;

        const isMockedNewUserRegistered = mockedPrismaUserDB.get(
          userInfo.email
        );

        if (isMockedNewUserRegistered) {
          throw new Error("User already registered");
        }

        mockedPrismaUserDB.set(userInfo.email, {
          ...userInfo,
          id: Math.random() * Number.MAX_SAFE_INTEGER,
          refreshToken,
        });

        return mockedPrismaUserDB;
      },
      findUnique: async (target: { where: { email: string } }) => {
        const {
          where: { email },
        } = target;
        const registeredUsers = mockedPrismaUserDB.get(email);

        return registeredUsers;
      },
      update: async (updateArgs: {
        where: { email: string };
        data: {
          refreshToken: {
            update: {
              value: string;
            };
          };
        };
      }) => {
        const { email } = updateArgs.where;
        const {
          update: { value: refreshToken },
        } = updateArgs.data.refreshToken;

        mockedPrismaUserDB.set(email, {
          ...mockedPrismaUserDB.get(email),
          refreshToken: refreshToken,
        });
      },
    },
    messages: {
      findMany: async (findArgs: {
        where: {
          OR: {
            senderId: number;
            recieverId: number;
          }[];
        };
        orderBy: {
          createdAt: string;
        };
      }) => {
        const { recieverId, senderId } = findArgs.where.OR[0];

        const filteredMessages = mockedPrismaMessagesDB.filter((message) => {
          return (
            (+message.recieverId === +recieverId &&
              +message.senderId === +senderId) ||
            (+message.recieverId === +senderId &&
              +message.senderId === +recieverId)
          );
        });

        filteredMessages.sort((AMessage, BMessage) => {
          return (
            new Date(AMessage.createdAt).valueOf() -
            new Date(BMessage.createdAt).valueOf()
          );
        });

        return filteredMessages;
      },
      updateMany: async () => {},
      create: async () => {},
    },
  })),
}));
