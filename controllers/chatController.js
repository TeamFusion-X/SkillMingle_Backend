import { User } from "./../models/userModel.js";
import { Chat } from "./../models/chatModel.js";
import { catchAsync } from "./../utils/catchAsync.js";

export const getTeachingChats = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	const chatPromise = user.teachingConversations.map(async (chatID) => {
		const chat = await Chat.findById(chatID)
		.populate({
            path: "participants",
            select: "username displayPicture"  
        });;
		const id = chat._id;
		const chatTitle = chat.chatTitle;
		const chatWith =
			req.user.id == chat.participants[0]._id
				? chat.participants[1].username
				: chat.participants[0].username;
		const displayPicture = 
			req.user.id == chat.participants[0]._id
				? chat.participants[1].displayPicture
				: chat.participants[0].displayPicture;
		const updatedAt = chat.updatedAt;

		return { id, chatTitle, chatWith, displayPicture, updatedAt };
	});

	const chats = await Promise.all(chatPromise);
	chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

	let allTeachingChats = [];
	allTeachingChats.push(...chats);

	res.status(200).json({
		status: "success",
		teachingChats: allTeachingChats,
	});
});

export const getLearningChats = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	const chatPromise = user.teachingConversations.map(async (chatID) => {
		const chat = await Chat.findById(chatID)
		.populate({
            path: "participants",
            select: "username displayPicture"  
        });;
		const id = chat._id;
		const chatTitle = chat.chatTitle;
		const chatWith =
			req.user.id == chat.participants[0]._id
				? chat.participants[1].username
				: chat.participants[0].username;
		const displayPicture = 
			req.user.id == chat.participants[0]._id
				? chat.participants[1].displayPicture
				: chat.participants[0].displayPicture;
		const updatedAt = chat.updatedAt;

		return { id, chatTitle, chatWith, displayPicture, updatedAt };
	});

	const chats = await Promise.all(chatPromise);
	chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

	let allLearningChats = [];
	allLearningChats.push(...chats);

	res.status(200).json({
		status: "success",
		learningChats: allLearningChats,
	});
});

export const getChat = catchAsync(async (req, res, next) => {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
        return next(new AppError('No chat found with this ID', 404));
    }

    const populatedChat = await Chat.findById(req.params.chatId)
        .populate({
            path: "messages",
            select: "content sender createdAt"  
        })
        .populate({
            path: "participants",
            select: "name username displayPicture"  
        });

    res.status(200).json({
        status: "success",
        chat: populatedChat,
    });
});

export const increaseSkillPercentage = catchAsync(async (req, res, next) => {
	const chat = await Chat.findByIdAndUpdate(req.params.chatId, {
		skillProgress: skillProgress + 10,
	});

	res.status(200).json({
		status: "success",
	});
});
