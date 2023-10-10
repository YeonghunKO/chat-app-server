import { Request, Response, NextFunction } from "express";
import getPrismaInstance from "../utils/PrismaClient";
import { onlineUsers } from "../utils/onlineUser";
import { renameSync } from "fs";

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { from, to } = req.params as { from: any; to: any };
    const primsa = getPrismaInstance();
    if (to !== "undefined" && from !== "undefined") {
      const isUserSameRoomWithOther =
        parseInt(from) === onlineUsers.getChatRoomIdByUserId(parseInt(to));

      const isOtherSameRoomWithUser =
        parseInt(to) === onlineUsers.getChatRoomIdByUserId(parseInt(from));

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
        orderBy: {
          createdAt: "asc",
        },
      });

      const unReadMessages: number[] = [];
      // 내가 메시지를 불러올때 그 중에서 상대방이 나에게 보낸 메시지에 read 표시를 하고
      messages.forEach((message, index) => {
        const isRead = message.status === "read";
        const isMessageFromReciever = message.senderId === parseInt(to);
        if (isMessageFromReciever && !isRead) {
          message.status = isUserSameRoomWithOther
            ? isOtherSameRoomWithUser
              ? "read"
              : "delivered"
            : "delivered";
          unReadMessages.push(message.id);
        }
      });

      // 실제 db에서 까지, 안읽은 메시지들 다 read로 업데이트
      await primsa.messages.updateMany({
        where: {
          id: { in: unReadMessages },
        },
        data: {
          status: isUserSameRoomWithOther
            ? isOtherSameRoomWithUser
              ? "read"
              : "delivered"
            : "delivered",
        },
      });

      return res.status(201).json(messages);
    } else {
      return res.status(401).json({
        message: "from and to are required",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const filterMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { from, message } = req.params as { from: any; message: string };
    const userId = parseInt(from);
    const primsa = getPrismaInstance();

    const userWithMessages = await primsa.user.findUnique({
      where: { id: userId },
      include: {
        sentMessage: {
          where: {
            message: {
              contains: message,
            },
          },
        },
        recievedMessage: {
          where: {
            message: {
              contains: message,
            },
          },
        },
      },
    });

    if (userWithMessages) {
      const filteredMessages = [
        ...userWithMessages.recievedMessage,
        ...userWithMessages.sentMessage,
      ];
      return res.status(201).json(filteredMessages);
    } else {
      return res.status(201).json([]);
    }
  } catch (error) {
    next(error);
  }
};

export const sendUpdatedChatListsData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 누구의 메시지 db를 조회할것인가?
    const { from } = req.params as { from: any };
    const userId = parseInt(from);
    const prisma = getPrismaInstance();

    const usersWithMessages = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentMessage: {
          include: {
            sender: true,
            reciever: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        recievedMessage: {
          include: {
            sender: true,
            reciever: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (usersWithMessages) {
      const allMessages = [
        ...usersWithMessages?.sentMessage,
        ...usersWithMessages?.recievedMessage,
      ];

      allMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const chatLists = new Map();

      allMessages.forEach((message) => {
        // 애초에 처음부터 나의 id나 profile이 포함될 수 가 없다.
        const isSentByMe = message.senderId === userId;

        const otherId = isSentByMe ? message.recieverId : message.senderId;

        if (!chatLists.has(otherId)) {
          const {
            sender: { password: senderPass, ...restSender },
            reciever: { password: recieverPass, ...restReciever },
            ...rest
          } = message;
          if (isSentByMe) {
            chatLists.set(otherId, {
              chatUser: restReciever,
              ...rest,

              totalUnReadCount: 0,
            });
          } else {
            chatLists.set(otherId, {
              chatUser: restSender,
              ...rest,

              totalUnReadCount: message.status !== "read" ? 1 : 0,
            });
          }
        } else if (message.status !== "read" && !isSentByMe) {
          const messageData = chatLists.get(otherId);
          chatLists.set(otherId, {
            ...messageData,
            totalUnReadCount: messageData.totalUnReadCount + 1,
          });
        }
      });
      return res.status(201).json(Array.from(chatLists.values()));
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

    const isUser = onlineUsers.isUserLoggedIn(to);
    const isUserSameRoomWithTo = from === onlineUsers.getChatRoomIdByUserId(to);

    if (from && to && message) {
      const newMessage = await prisma.messages.create({
        data: {
          message: message,
          status: isUser
            ? isUserSameRoomWithTo
              ? "read"
              : "delivered"
            : "sent",
          sender: {
            connect: { id: parseInt(from) },
          },
          reciever: {
            connect: { id: parseInt(to) },
          },
        },
      });

      return res.status(201).json(newMessage);
    } else {
      return res.status(401).json({
        message: "sender, reciever and message are required",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const addImageMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const date = Date.now();
    let fileName = "uploads/images/" + date + req.file?.originalname;

    // uploads/images에 있는 파일은 binary로 되어있다.
    // binary파일 끝에 originalname을 이용해서 png/svg/jpg 같은 확장자가 붙은 이름으로 교체한다.

    renameSync(req.file?.path as string, fileName);

    const { from, to } = req.query as { from: string; to: string };

    if (from && to) {
      const parsedFrom = parseInt(from);
      const parsedTo = parseInt(to);
      const prisma = getPrismaInstance();
      const isUser = onlineUsers.isUserLoggedIn(parsedTo);

      const isUserSameRoomWithTo =
        parsedFrom === onlineUsers.getChatRoomIdByUserId(parsedTo);

      const newMessage = await prisma.messages.create({
        data: {
          message: fileName,
          status: isUser
            ? isUserSameRoomWithTo
              ? "read"
              : "delivered"
            : "sent",
          type: "image",
          sender: {
            connect: { id: parsedFrom },
          },
          reciever: {
            connect: { id: parsedTo },
          },
        },
      });

      return res.status(201).json(newMessage);
    }
    return res.status(401).json({ message: "from and to are required" });
  } catch (error) {
    next(error);
  }
};

export const addAudioMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const date = Date.now();
    let fileName = "uploads/recordings/" + date + req.file?.originalname;

    renameSync(req.file?.path as string, fileName);

    const { from, to } = req.query as { from: string; to: string };

    if (from && to) {
      const parsedFrom = parseInt(from);
      const parsedTo = parseInt(to);
      const prisma = getPrismaInstance();
      const isUser = onlineUsers.isUserLoggedIn(parsedTo);

      const isUserSameRoomWithTo =
        parsedFrom === onlineUsers.getChatRoomIdByUserId(parsedTo);

      const newMessage = await prisma.messages.create({
        data: {
          message: fileName,
          status: isUser
            ? isUserSameRoomWithTo
              ? "read"
              : "delivered"
            : "sent",
          type: "audio",
          sender: {
            connect: { id: parsedFrom },
          },
          reciever: {
            connect: { id: parsedTo },
          },
        },
      });

      return res.status(201).json(newMessage);
    }

    return res.status(401).json({ message: "from and to are required" });
  } catch (error) {
    next(error);
  }
};
