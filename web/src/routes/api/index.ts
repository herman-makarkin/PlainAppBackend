import { Hono } from "hono";
import userRoutes from "./users";
// import userChatsRoutes from "./userChats";
import chatRoutes from "./chats";
import messageRoutes from "./messages";
import chatMessagesRoutes from "./chatMessages";
import groupRoutes from "./groups";
import { test } from "./test";
import { getChats, getUsers, getUserByPN, updateUser, createUser, getUser  } from './users/handlers'
import { getChat, createChat } from './chats/handlers'


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

    socket.on('chatMessage', async (msg: Message) => {
        console.log(msg);
        const message = await createChatMessage(msg.chatId, {body: msg.body, createdBy: msg.createdBy});
        const interlocutor: number = await chatInterlocutor(msg.chatId, msg.createdBy);
        console.log("message", JSON.stringify(message));
        if (!clients[interlocutor]) throw new Error('Gay');
        clients[interlocutor].emit('chatMessage', message);
    });

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

    socket.on('getUsers', async  (idList: number[]) => {
        idList.map(async (el: number) => {
            let user = await getUser(el);
            if (!user) undefined;
            else user[0];
        });
        socket.emit('getUsers', idList);
    })

    socket.on('createChat', async (participant1: number,) => {
        let user = await getUser(participant1);
        if (!user) {
            socket.emit('error', "User not found");
            return;
        }
        user = user[0];
        console.log(socket.userId, 'socket', participant1, 'participant1');
        const chat = await createChat({participant1, participant2: socket.userId});
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
}

export default clients;
