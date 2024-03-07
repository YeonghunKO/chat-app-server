import {
  mockedPrismaUserDB,
  mockedPrismaMessagesDB,
  type IMessages,
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
        orderBy: keyof IMessages;
      }) => {
        const { recieverId, senderId } = findArgs.where.OR[0];
        const { orderBy } = findArgs;

        const filteredMessages = mockedPrismaMessagesDB.filter((message) => {
          return (
            (+message.recieverId === +recieverId &&
              +message.senderId === +senderId) ||
            (+message.recieverId === +senderId &&
              +message.senderId === +recieverId)
          );
        });

        if (orderBy) {
          switch (orderBy) {
            case "createdAt":
              filteredMessages.sort((AMessage, BMessage) => {
                return (
                  new Date(AMessage[orderBy]).valueOf() -
                  new Date(BMessage.createdAt).valueOf()
                );
              });
              break;

            default:
              break;
          }
        }

        return filteredMessages;
      },

      updateMany: async (updateArgs: {
        where: {
          id: { in: number[] };
        };
        data: {
          status: "read" | "sent" | "delivered";
        };
      }) => {
        const {
          where: {
            id: { in: updateIds },
          },
          data: { status: updateStatus },
        } = updateArgs;
        mockedPrismaMessagesDB.forEach((message) => {
          if (updateIds.includes(message.id)) {
            message.status = updateStatus;
          }
        });

        return mockedPrismaMessagesDB;
      },
      create: async () => {},
    },
  })),
}));
