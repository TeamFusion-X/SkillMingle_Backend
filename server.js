import mongoose from "mongoose";

process.on("uncaughtException", (err) => {
	console.log("Uncaught Exception! Shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});

const DB = process.env.DATABASE_LOCAL;
if (process.env.NODE_ENV == "production"){
	DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
}

mongoose
	.connect(DB)
	.then(() => console.log("Database Connection Successful!"))
    .catch(err => console.log("Database Connection Unsuccessful!\n", err.name, err.message));

const port = process.env.PORT || 5500;
import {app} from './app.js';

const server = app.listen(port, () => {
	console.log(`Server running on port ${port}..`);
});


// ----------------------------------------------------
// Socket 
import {Server as socket} from 'socket.io';
import {Message} from './models/chatModel.js';
import {Chat} from './models/chatModel.js';

const io = new socket(server);

io.on('connection', (socket) => {
    console.log('Connected...')

	socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });
	
    socket.on('send-message', async(msg,room) => {
        if(room === ""){
			socket.broadcast.emit('receive-message', msg)
		}
		else{
			const currentChat = await Chat.findById(room); // Get Current Chat
			const currentSender = msg.name; // Get sender (To be Changed);
			// Message 
			const currentMessage = await Message.create({
				sender: currentChat._id,
				content: msg.message
			});
			
			//Store Message to Chat Schema
			currentChat.messages.push(currentMessage._id);
			await currentChat.save();

			// Send to receiver
			socket.to(room).emit('receive-message',msg)
		}

    })
});

process.on("unhandledRejection", (err) => {
	console.log("Unhandled Rejection! Shutting down..");
	console.log(err.name, err.message);
	server.close(() => process.exit(1));
});
