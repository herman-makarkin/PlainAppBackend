import { Hono } from "hono";
import userRoutes from "./users";
// import userChatsRoutes from "./userChats";
import chatRoutes from "./chats";
import messageRoutes from "./messages";
import chatMessagesRoutes from "./chatMessages";
import groupRoutes from "./groups";
import { test } from "./test";
import {io} from '../../index'


import {createChatMessage, chatInterlocutor} from './messages/handlers'

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
    console.log('User connected');
    socket.on('signin', (id: number) => {
        console.log('User signedin:', id);
        clients[Number(id)] = socket;
    });

    socket.on('chatMessage', async (msg: Message) => {
        console.log(msg);
        const message = await createChatMessage(msg.chatId, {body: msg.body, createdBy: msg.createdBy});
        const interlocutor: number = await chatInterlocutor(msg.chatId, msg.createdBy);
        console.log("message", JSON.stringify(message));
        if (!clients[interlocutor]) throw new Error('Gay');
        clients[interlocutor].emit('chatMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
}

export default clients;
