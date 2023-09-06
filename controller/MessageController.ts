import { Request, Response, NextFunction } from "express";
import getPrismaInstance from "../utils/PrismaClient";
import { onlineUser } from "../utils/onlineUser";

export const getMessages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(201).json({
    messages: ["message from server"],
  });
};

export const addMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 유저가 접속하면 client/main에서 add-user socket이 호출
  // server/index에서 add-user를 받아서 onlineusers에 현재 접속한 user를 set할것입
  // 즉 메시지를 전송한 시점에 to user가 접속해있으면 delivered이고 접속해있지 않으면 sent이다.
  // 그리고 client/main에서 currentChatUser를 useEffect를 통해 감지한다음 바뀔때 마다 currentUser에 해당하는 message를
  // get-message api를 통해서 가져와서 chatContainer가 업데이트 됨

  try {
    const { from, to, message } = req.body;
    const prisma = getPrismaInstance();

    const isUser = onlineUser.get(to);

    if (from && to && message) {
      const newMessage = await prisma.messages.create({
        data: {
          message: message,
          status: isUser ? "delivered" : "sent",
          sender: {
            connect: { id: parseInt(from) },
          },
          reciever: {
            connect: { id: parseInt(to) },
          },
        },
        include: {
          reciever: true,
          sender: true,
        },
      });

      return res.status(201).json({ message: newMessage });
    }
  } catch (error) {
    next(error);
  }
};
