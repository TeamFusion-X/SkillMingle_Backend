import { Server } from 'socket.io';
import { Message, Chat } from './models/chatModel.js';

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [
                "http://127.0.0.1:5173",
                "http://localhost:5173",
                "https://skill-mingle-frontend-eight.vercel.app"
            ],
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        });

        socket.on('send-message', async ({ message, room, sender }) => {
            try {
                if (!room) return;

                const chat = await Chat.findById(room);
                if (!chat) return;

                const newMessage = await Message.create({
                    sender,
                    content: message
                });

                chat.messages.push(newMessage._id);
                await chat.save();

                io.to(room).emit('receive-message', newMessage);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};
