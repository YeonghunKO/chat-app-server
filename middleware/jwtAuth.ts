import jwt from "jsonwebtoken";
import getPrismaInstance from "../utils/PrismaClient";
import dotenv from "dotenv";
dotenv.config();

const accessSecret = process.env.SCRETE_ACCESS as string;
const refreshSecret = process.env.SCRETE_REFRESH as string;

export const signAccess = (email: string) => {
  return jwt.sign({ email }, accessSecret, {
    expiresIn: "1d",
  });
};

export const verifyAccess = (token: string) => {
  try {
    const decoded = jwt.verify(token, accessSecret) as jwt.JwtPayload;
    return {
      ok: true,
      email: decoded.email,
    };
  } catch (error: any) {
    return {
      message: error.message,
      ok: false,
    };
  }
};

export const signRefresh = (email: string) => {
  return jwt.sign({ email }, refreshSecret, { expiresIn: "7d" });
};

export const verifyRefresh = async (email: string) => {
  const prisma = getPrismaInstance();
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: { refreshToken: true },
    });

    if (user && user.refreshToken?.value) {
      try {
        const decoded = jwt.verify(
          user.refreshToken.value,
          refreshSecret
        ) as jwt.JwtPayload;
        return { ok: true, email: decoded.email };
      } catch (error: any) {
        return {
          ok: false,
          message: error.message,
        };
      }
    } else {
      return {
        ok: false,
        message: "No User Found",
      };
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }
};
