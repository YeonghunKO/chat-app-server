import { Request, Response, NextFunction } from "express";
const errorHandle = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("err", error);

  return res.status(503).json({
    error,
    message: `서버에 문제가 발생했습니다. 에러 코드${error.code}`,
  });
};

export default errorHandle;
