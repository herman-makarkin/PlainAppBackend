import { Hono } from "hono";
import userRoutes from "./users";
// import userChatsRoutes from "./userChats";
import chatRoutes from "./chats";
import messageRoutes from "./messages";
import chatMessagesRoutes from "./chatMessages";
import groupRoutes from "./groups";
import { test } from "./test";
import { getChats, getUsers, getUserByPN, updateUser, createUser, getUser } from './users/handlers'
import { getChat, createChat, getAllChats, getNewChatMessages } from './chats/handlers'


import { createChatMessage, chatInterlocutor } from './messages/handlers'

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
  });
  socket.on('createUser', async (user) => {
    let User = await createUser(user);
    console.log(User);
    if (!User) {
      socket.emit('error', "Incorrect data");
      return;
    }
    User = User[0];
    console.log('User registered:', User.id);
    if (socket.userId && clients[socket.userId]) {
      delete clients[socket.userId];
    }
    socket.userId = User.id;
    console.log(socket.userId)
    clients[Number(User.id)] = socket;
    socket.emit('createUser', User);
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

  socket.on('updateUser', async (data) => {
    const user = await updateUser(socket.userId, data);
    if (!user) {
      socket.emit('error', "Incorrect data");
      return;
    }
    console.log('User updated:', user.id);
    socket.emit('updateUser', user)
  })

  // socket.on('searchUserByNickname', (nickname: string) => {
  //     clients[Number(id)] = socket;
  // });

  // Messages

  socket.on('chatMessage', async (chatId: number, msg: Message) => {
    console.log(msg);
    console.log("socket!!!", socket.userId);
    if (!socket.userId) {
      socket.emmit('error', "Not singed in");
      return;
    }
    console.log(socket.userId);
    const message = await createChatMessage(chatId.toString(), { body: msg.body, createdBy: socket.userId });
    const interlocutor: number = await chatInterlocutor(chatId, socket.userId);
    console.log("message", JSON.stringify(message));
    if (!clients[interlocutor]) {
      socket.emit('error', 'No such interlocutor');
      return;
    }
    clients[interlocutor].emit('chatMessage', chatId, message);
    socket.emit('chatMessageId', `${message.id}`);
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
      delete clients[socket.userId];
    }
    console.log('User disconnected');
  });

  // webrtc

  socket.on('join room', (roomId) => {

    socket.join(roomId);

    console.log(`User ${socket.id} joined room ${roomId}`);

  });


  socket.on('offer', (offer, roomId) => {

    socket.to(roomId).emit('offer', offer);

  });


  socket.on('answer', (answer, roomId) => {

    socket.to(roomId).emit('answer', answer);

  });


  socket.on('ice candidate', (candidate, roomId) => {

    socket.to(roomId).emit('ice candidate', candidate);

  });
}

export default clients;
