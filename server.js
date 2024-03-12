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

// Socket 
import {Server as socket} from 'socket.io';

const io = new socket(server);

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})

process.on("unhandledRejection", (err) => {
	console.log("Unhandled Rejection! Shutting down..");
	console.log(err.name, err.message);
	server.close(() => process.exit(1));
});
