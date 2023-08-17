import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient;

const getPrismaInstance = () => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
    return prismaInstance;
  }
  return prismaInstance;
};

export default getPrismaInstance;
