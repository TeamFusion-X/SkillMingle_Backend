const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
	console.log("Uncaught Exception! Shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_LOCAL;
if (process.env.NODE_ENV == "production"){
	DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
}

mongoose
	.connect(DB)
	.then(() => console.log("Database Connection Successful!"))
    .catch(err => console.log("Database Connection Unsuccessful!\n", err.name, err.message));

const port = process.env.PORT || 5500;
const app = require("./app");

const server = app.listen(port, () => {
	console.log(`Server running on port ${port}..`);
});

process.on("unhandledRejection", (err) => {
	console.log("Unhandled Rejection! Shutting down..");
	console.log(err.name, err.message);
	server.close(() => process.exit(1));
});
