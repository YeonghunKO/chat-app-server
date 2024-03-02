import { mockedPrismaDB } from "./fixtures/mockedPrismaDB";

jest.mock("../utils/PrismaClient", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: {
      create: async (userData: any) => {
        mockedPrismaDB.push(userData);
        return mockedPrismaDB;
      },
    },
  })),
}));
