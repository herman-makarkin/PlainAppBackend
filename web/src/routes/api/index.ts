import { Hono } from "hono";
import userRoutes from "./users";
// import userChatsRoutes from "./userChats";
import chatRoutes from "./chats";
import messageRoutes from "./messages";
import chatMessagesRoutes from "./chatMessages";
import groupRoutes from "./groups";
import { test } from "./test";
import { getChats, getUsers, getUserByPN, updateUser, createUser, getUser } from './users/handlers'
import { getChat, createChat, getAllChats, getNewChatMessages, markAsRead } from './chats/handlers'


import { createChatMessage, chatInterlocutor, deleteRemovedChatMessages } from './messages/handlers'
import { getChatMessages, removeChatMessage } from "./chatMessages/handlers";
import { chat } from "../../db/schema";

export const apiRoutes = new Hono();
apiRoutes.get("/", (c) => c.text("welcome to my api"));
apiRoutes.route("/user", userRoutes);
apiRoutes.route("/group", groupRoutes);
apiRoutes.route("/chat", chatRoutes);
apiRoutes.route("/message", messageRoutes);
// apiRoutes.route("/userChats", userChatsRoutes);
apiRoutes.route("/chatMessages", chatMessagesRoutes);
apiRoutes.route("/test", test);


const clients = {};

type Message = {
  createdBy: number,
  body: string,
  chatId: number,
}

export const onConnection = (socket) => {

  // Users
  console.log('User connected');
  socket.on('signin', async (id: number) => {
    //FIXME
    const user = await getUser(id);
    if (!user) {
      socket.emit('error', "User not found");
      return;
    }
    console.log('User signed in:', id);
    socket.userId = id;
    console.log(socket.userId);
    clients[Number(id)] = socket;
    socket.emit('signin', 'OK');
  });

  socket.on('createUser', async (user) => {
    try {
      let User = await createUser(user);
      User = User[0];
      console.log('User registered:', User.id);
      if (socket.userId && clients[socket.userId]) {
        delete clients[socket.userId];
      }
      socket.userId = User.id;
      console.log(socket.userId)
      clients[Number(User.id)] = socket;
      socket.emit('createUser', User.id);
    } catch (err) {
      socket.emit('signupError', err);
    }
    // console.log(User);
    // if (!User) {
    //   socket.emit('error', "Incorrect data");
    //   return;
    // }
  });

  socket.on('userByPN', async (PN: string) => {
    let user = await getUserByPN(PN);
    console.log('phone number !!#@$%@#', PN);
    if (!user) {
      socket.emit('error', "User not found");
      return;
    }
    user = user[0];
    socket.emit('userByPN', user);
  })

  socket.on('updateUser', async (data: any) => {
    let user = await updateUser(socket.userId, data);
    if (user instanceof Error) {
      socket.emit('updateUserError', user);
      return;
    }
    user = user[0];
    console.log('User updated:', user.id);
    socket.emit('updateUser', user.id);
  })

  socket.on('isTyping', async (userIds: number[]) => {
    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    for (const id of userIds) {
      if (clients[id]) clients[id].emit('isTyping', socket.userId);
    }
  })

  socket.on('isNotTyping', async (userIds: number[]) => {
    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    for (const id of userIds) {
      if (clients[id]) clients[id].emit('isNotTyping', socket.userId);
    }
  })

  socket.on('isOnline?', async (userIds: number[]) => {
    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    if (userIds) {
      socket.contacts = userIds;

      for (const id of userIds) {
        if (clients[id]) clients[id].emit('isOnline?', socket.userId);
      }
    }
  })

  socket.on('isOnline', async (userIds: number[]) => {
    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    if (userIds) {
      socket.contacts = userIds;

      for (const id of userIds) {
        if (clients[id]) clients[id].emit('isOnline', socket.userId);
      }
    }
  })

  socket.on('isOffline', async (userIds: number[]) => {
    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    if (userIds) {
      socket.contacts = userIds;

      for (const id of userIds) {
        if (clients[id]) clients[id].emit('isOffline', socket.userId);
      }
    }
  })

  // socket.on('searchUserByNickname', (nickname: string) => {
  //     clients[Number(id)] = socket;
  // });

  // Messages

  socket.on('removeChatMessage', async (messageId: number) => {
    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    removeChatMessage(messageId)
    const interlocutor: number = await chatInterlocutor(chatId, socket.userId);
    if (!interlocutor || !clients[interlocutor]) {
      return;
    }

    clients[interlocutor].emit('removeChatMessage', message);
  })

  socket.on('deleteChatMessage', async (chatId) => {
    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    deleteRemovedChatMessages(chatId, socket.userId);
  })


  socket.on('getChatMessages', async (chatIds: number[]) => {
    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    const result = new Array(chatIds.length);

    for (let i = 0; i < chatIds.length; i++) {
      const messages = await getChatMessages(chatIds[i]);
      console.log("result", JSON.stringify(messages), 'i', i);
      result[i] = messages;
    }

    socket.emit('getChatMessages', result);
  });


  socket.on('chatMessage', async (chatId: number, msg: Message) => {
    console.log(msg);
    console.log("socket!!!", socket.userId);
    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }
    console.log(socket.userId);
    const message = await createChatMessage(chatId.toString(), { body: msg.body, createdBy: socket.userId });
    const interlocutor: number = await chatInterlocutor(chatId, socket.userId);
    console.log("message", JSON.stringify(message));
    if (message) {
      socket.emit('chatMessageId', `${message.id}`);
    } else {
      socket.emit('error', 'Invalid Data');
      return;
    }
    if (!clients[interlocutor]) {
      socket.emit('error', 'No such interlocutor');
      return;
    }
    clients[interlocutor].emit('chatMessage', chatId, message);
  });

  socket.on('newChatMessages', async (chatIds: number[]) => {
    // const chatIds = options.chatIds;
    console.log(chatIds, 'chatIds');
    console.log("socket!!!", socket.userId);
    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    const result = new Array(chatIds.length);

    for (let i = 0; i < chatIds.length; i++) {
      const messages = await getNewChatMessages(chatIds[i], socket.userId);
      console.log("result", JSON.stringify(messages), 'i', i);
      result[i] = messages;
    }

    socket.emit('newChatMessages', result);
  });

  socket.on('markAsRead', async (chatId: number) => {
    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }


    const result = await markAsRead(chatId, socket.userId);
    if (result) {
      socket.emit('markAsRead', result);
    } else {
      socket.emit('error', 'Unknown Error')
    }
  })

  socket.on('allChats', async () => {
    socket.emit('allChats', await getAllChats());
  })

  // Chats
  socket.on('myChats', async () => {
    // const s = clients[id];
    // if (!s) return;
    const chats = await getChats(socket.userId);
    socket.emit('myChats', chats);
  })

  socket.on('getUser', async (id: number) => {
    const user = await getUser(id);
    socket.emit('getUser', user);
  })

  socket.on('getUsers', async (idList: number[]) => {
    console.log(idList);
    let users = new Array(idList.length);
    for (let i = 0; i < idList.length; i++) {
      const user = await getUser(idList[i]);
      if (!user) users[i] = undefined;
      else users[i] = user[0];
    }
    console.log(users);
    socket.emit('getUsers', users);
  })

  socket.on('createChat', async (participant1: number,) => {
    let user = await getUser(participant1);
    if (!user) {
      socket.emit('error', "User not found");
      return;
    }
    user = user[0];
    console.log(socket.userId, 'socket', participant1, 'participant1');
    const chat = await createChat({ participant1, participant2: socket.userId });
    if (!chat) return;
    socket.emit('createChat', chat)
    if (!clients[participant1]) return;
    clients[participant1].emit('createChat', chat);

  })
  // Chats End

  socket.on('disconnect', () => {
    if (socket.userId && clients[socket.userId]) {
      if (socket.contacts) {
        for (const id of socket.contacts) {
          if (clients[id]) clients[id].emit('isOffline', socket.userId);
        }
      }
      delete clients[socket.userId];
    }
    console.log('User disconnected');
  });

  // webrtc

  socket.on('join room', async (roomId: string) => {

    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }


    socket.join(roomId);

    console.log(`User ${socket.id} joined room ${roomId}`);

  });

  socket.on('state', async (state: number, chatId: number) => {
    chatId = Number(chatId);

    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    const interlocutor: number = await chatInterlocutor(chatId, socket.userId);
    if (interlocutor && clients[interlocutor]) {
      clients[interlocutor].emit('state', state, chatId);
    }
  });



  socket.on('offer', async (offer, chatId: number) => {
    chatId = Number(chatId);

    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    const interlocutor: number = await chatInterlocutor(chatId, socket.userId);
    if (interlocutor && clients[interlocutor]) {
      clients[interlocutor].emit('offer', offer, chatId);
    }
    // socket.to(roomId).emit('offer', offer);

  });


  socket.on('answer', async (answer, chatId: number) => {
    chatId = Number(chatId);

    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    const interlocutor: number = await chatInterlocutor(chatId, socket.userId);
    if (interlocutor && clients[interlocutor]) {
      clients[interlocutor].emit('answer', answer, chatId);
    }

    // socket.to(roomId).emit('answer', answer);

  });


  socket.on('ice candidate', async (candidate, chatId: number) => {
    chatId = Number(chatId);

    if (!socket.userId) {
      socket.emit('error', "Not singed in");
      return;
    }

    const interlocutor: number = await chatInterlocutor(chatId, socket.userId);
    if (interlocutor && clients[interlocutor]) {
      clients[interlocutor].emit('ice candidate', candidate, chatId);
    }
    // socket.to(roomId).emit('ice candidate', candidate);

  });
}

export default clients;
