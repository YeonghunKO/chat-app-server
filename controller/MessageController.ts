import { Request, Response, NextFunction } from "express";

export const getMessages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(201).json({
    messages: ["message from server"],
  });
};
