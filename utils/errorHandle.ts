import { Request, Response, NextFunction } from "express";
const errorHandle = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.code) {
    switch (error.code) {
      case "P2002":
        const target = error.meta.target[0];
        return res.status(503).json({
          error,
          message: `이미 존재하는 ${target} 이에요!`,
        });

      default:
        return res.status(503).json({
          error,
          message: `서버에 문제가 발생했어요. 에러 코드 ${error.code}`,
        });
    }
  } else {
    return res.status(503).json({
      error,
      message: `서버에 문제가 발생했어요. 서버 로그를 확인해주세요 ${error}`,
    });
  }
};

export default errorHandle;
