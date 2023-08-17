import getPrismaInstance from "../utils/PrismaClient";
import { Request, Response, NextFunction } from "express";

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ msg: "Email is required", status: false });
    }

    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return res.json({ meg: "User Found", status: true, data: user });
    } else {
      return res.json({ meg: "User Not Found", status: false });
    }
  } catch (error) {
    next(error);
  }
};
