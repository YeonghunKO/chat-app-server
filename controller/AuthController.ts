import { COOKIE, JWT } from "../constant/cookie";
import {
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh,
} from "../middleware/jwtAuth";
import getPrismaInstance from "../utils/PrismaClient";

import { Request, Response, NextFunction } from "express";

/**
 * 1. cookie에 refreshToken과 accessToken이 없을때
 * -> 401 , token이 없다고 나오면서 {ok:false}로 리턴
 * 2. refresh가 access가 아직 만료되지 않았을때 201 {ok:true}리턴
 * 3. refresh가 아직 만료되지 않았지만 access가 만료되었을떄 access token을 cookie에 세팅하고 201 {ok:true} 리턴
 * 4. refresh도 만료 access도 만료되면 cookie 삭제하고 401 {ok:false} 리턴
 */

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessTokenFromHeader = (req.headers.authorization as string)?.split(
      "Bearer "
    )[1];
    const userEmail = req.headers.refreshtokenidx as string;

    console.log("accessTokenFromHeader", accessTokenFromHeader);
    console.log("refreshTokenFromHeader", userEmail);

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

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "user not found",
        redirctDestination: "/login",
      });
    }

    const userInfo = user;

    const {
      email: accessEmail,
      ok: accessOk,
      message: accessMessage,
    } = verifyAccess(accessTokenFromHeader);

    console.log("accessEmail", accessEmail);
    console.log("accessOk", accessOk);
    console.log("accessMessage", accessMessage);

    const {
      email: refreshEmail,
      ok: refreshOk,
      message: refreshMessage,
    } = await verifyRefresh(userEmail);

    if (accessOk && accessMessage !== JWT.EXPIRED) {
      return res.status(201).json({
        ok: true,
        message: "access token is still valid",
        userInfo,
      });
    }

    if (
      refreshOk &&
      refreshMessage !== JWT.EXPIRED &&
      accessMessage === JWT.EXPIRED
    ) {
      const newAccessToken = signAccess(userEmail);
      res.cookie(COOKIE.ACCESS_TOKEN, newAccessToken, { httpOnly: true });
      return res.status(201).json({
        accessToken: newAccessToken,
        message: "new access token created",
        userInfo,
      });
    }

    if (refreshMessage === JWT.EXPIRED && accessMessage === JWT.EXPIRED) {
      return res.status(401).json({
        ok: false,
        message: "both tokens are expired",
        redirctDestination: "/login",
      });
    }

    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inloa28xOTg4QGdtYWlsLmNvbSIsImlhdCI6MTY5MzQwMDY4MiwiZXhwIjoxNjkzNDAwNzQyfQ.s93YcPIJTeuGhvoQm4egYV4eHNYCcIevDZ_5RkXz6Ds

    console.log("refreshEmail", refreshEmail);
    console.log("refreshOk", refreshOk);
    console.log("refreshMessage", refreshMessage);

    // const refreshToken

    // console.log("cookie", cookies);

    return res.status(201).send("ok");
    // if()
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, profilePicture, loginType, password } = req.body;
    if (!email) {
      return res.status(403).json({ message: "Email is required" });
    }

    const prisma = getPrismaInstance();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).send({
        ok: false,
        message: "user does not exist",
      });
    }

    if (loginType !== "google" && password !== user?.password) {
      return res.status(401).send({
        ok: false,
        message: "password is incorrect",
      });
    }

    const accessToken = signAccess(email);
    const refreshToken = signRefresh(email);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        refreshToken: {
          update: {
            value: refreshToken,
          },
        },
      },
    });

    res.cookie(COOKIE.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
    });

    res.cookie(COOKIE.REFRESH_IDX, encodeURIComponent(email), {
      httpOnly: true,
    });

    return res.status(201).json({
      user: {
        email,
        name,
        profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const onSignUpUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, about, profilePicture, password } = req.body;
    const prisma = getPrismaInstance();

    const accessToken = signAccess(email);
    const refreshToken = signRefresh(email);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        about,
        profilePicture,
        ...(password && { password }),
        refreshToken: {
          create: {
            value: refreshToken,
          },
        },
      },
    });

    res.cookie(COOKIE.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
    });

    res.cookie(COOKIE.REFRESH_IDX, encodeURIComponent(email), {
      httpOnly: true,
    });

    return res.status(201).json({
      user: {
        email,
        name,
        profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};
