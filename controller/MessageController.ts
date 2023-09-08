import { Request, Response, NextFunction } from "express";
import getPrismaInstance from "../utils/PrismaClient";
import { onlineUser } from "../utils/onlineUser";

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { from, to } = req.params;
    const primsa = getPrismaInstance();

    if (from && to) {
      // 내가 짝하마에게 보낸 메시지와 , 짝하마가 나한테 보낸 메시지 전부가 리턴됨.
      // 즉, 나와 상대방이 나눈 대화 전체를 불러온다.
      const messages = await primsa.messages.findMany({
        where: {
          OR: [
            {
              senderId: parseInt(from),
              recieverId: parseInt(to),
            },
            {
              senderId: parseInt(to),
              recieverId: parseInt(from),
            },
          ],
        },
      });

      const unReadMessages: number[] = [];
      // 내가 메시지를 불러올때 그 중에서 상대방이 나에게 보낸 메시지에 read 표시를 하고
      messages.forEach((message, index) => {
        const isRead = message.status === "read";
        const isMessageFromReciever = message.senderId === parseInt(to);
        if (isMessageFromReciever && !isRead) {
          message.status = "read";
          unReadMessages.push(message.id);
        }
      });

      // 실제 db에서 까지, 안읽은 메시지들 다 read로 업데이트
      await primsa.messages.updateMany({
        where: {
          id: { in: unReadMessages },
        },
        data: {
          status: "read",
        },
      });

      return res.status(201).json({
        messages,
      });
    } else {
      return res.status(401).json({
        message: "from and to are required",
      });
    }
  } catch (error) {
    next(error);
  }
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

    const isUser = onlineUser.isUserLoggedIn(to);

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
    } else {
      return res.status(401).json({
        message: "from and to are required",
      });
    }
  } catch (error) {
    next(error);
  }
};
