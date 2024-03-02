import { mockedPrismaUserDB } from "./fixtures/mockedPrismaDB";

jest.mock("../utils/PrismaClient", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: {
      create: async (userData: any) => {
        mockedPrismaUserDB.push(userData);
        return mockedPrismaUserDB;
      },
    },
  })),
}));
