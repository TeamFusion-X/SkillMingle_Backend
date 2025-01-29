import mongoose from "mongoose";
import { initializeSocket } from "./socketHandler.js";

process.on("uncaughtException", (err) => {
	console.log("Uncaught Exception! Shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});

let DB = process.env.DATABASE_LOCAL;
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

const io = initializeSocket(server);

process.on("unhandledRejection", (err) => {
	console.log("Unhandled Rejection! Shutting down..");
	console.log(err.name, err.message);
	server.close(() => process.exit(1));
});
