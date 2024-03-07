import { Request, Response, NextFunction } from "express";
import getPrismaInstance from "../utils/PrismaClient";
import { verifyAccess, verifyRefresh } from "./jwtAuth";
import { JWT } from "../constant/cookie";
import { extractTokens } from "../utils/extractTokens";

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookie = req.headers.cookie;
    let userEmail: string;
    const { accessToken: accessTokenFromHeader, refreshTokenIdx } =
      extractTokens(cookie);

    userEmail = decodeURIComponent(refreshTokenIdx);

    // 헤더 검증
    if (!accessTokenFromHeader || !userEmail) {
      return res.status(401).json({
        message: "access token and refresh token should be inside headers",
        ok: false,
      });
    }

    const prisma = getPrismaInstance();

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    // db user검증
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "user not found",
        redirctDestination: "/login",
      });
    }

    // token 검증
    const {
      email: accessEmail,
      ok: accessOk,
      message: accessMessage,
    } = verifyAccess(accessTokenFromHeader);

    const {
      email: refreshEmail,
      ok: refreshOk,
      message: refreshMessage,
    } = await verifyRefresh(userEmail);

    // accessToken 유효한지 검증
    if (accessOk && accessMessage !== JWT.EXPIRED) {
      next();
    }

    if (
      refreshOk &&
      refreshMessage !== JWT.EXPIRED &&
      accessMessage === JWT.EXPIRED
    ) {
      next();
    }

    // refreshToken 유효한지 검증
    if (refreshMessage === JWT.EXPIRED && accessMessage === JWT.EXPIRED) {
      return res.status(401).json({
        ok: false,
        message: "both tokens are expired",
        redirctDestination: "/login",
      });
    }
  } catch (error) {
    next(error);
  }
};
