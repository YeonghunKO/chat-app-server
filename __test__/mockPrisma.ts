import { mockedPrismaUserDB } from "./fixtures/mockedPrismaDB";

jest.mock("../utils/PrismaClient", () => ({
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
    },
  })),
}));
