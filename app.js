import express from "express";
import morgan from "morgan";
import path from "path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { AppError } from "./utils/appError.js";
import { globalErrorHandler } from "./controllers/errorController.js";

dotenv.config({ path: "./config.env" });

// Routes
import { router as userRouter } from "./routes/userRoutes.js";
import { router as requestRouter } from "./routes/requestRoutes.js";
import { router as chatRouter } from "./routes/chatRoutes.js";
import { router as reviewRouter } from "./routes/reviewRoutes.js";
import { router as searchRouter } from "./routes/searchRoutes.js";
import { router as suggestionsRouter } from "./routes/suggestionsRoutes.js";
import { router as genRouter } from "./routes/genAIRoutes.js";

export const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

const corsOptions = {
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Limit requests from same IP
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Serving static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

//Parsing to JSON
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.use(cookieParser());

// Routes
app.use("/api/users", userRouter);
app.use("/api/requests", requestRouter);
app.use("/api/chats", chatRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/search", searchRouter);
app.use("/api/suggestions", suggestionsRouter);
app.use("/api/genAI", genRouter);

app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
