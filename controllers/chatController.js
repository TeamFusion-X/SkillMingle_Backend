import {User} from './../models/userModel.js';
import {Chat} from './../models/chatModel.js';
import {catchAsync} from './../utils/catchAsync.js';

export const getTeachingChats = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    const chatPromise = user.teachingConversations.map(async chatID => {
		const chat = await Chat.findById(chatID).populate("participants");
		const id = chat._id;
		const chatTitle = chat.chatTitle;
		const chatWith = (req.user.id == chat.participants[0]._id) ? chat.participants[1].username : chat.participants[0].username;

		return {id, chatTitle, chatWith};
	});

	const chats = await Promise.all(chatPromise);

	let allTeachingChats = [];
	allTeachingChats.push(...chats)

    res.status(200).json({
        status : "success",
        teachingChats : allTeachingChats
    })
});

export const getLearningChats = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	
    const chatPromise = user.learningConversations.map(async chatID => {
		const chat = await Chat.findById(chatID).populate("participants");
		const id = chat._id;
		const chatTitle = chat.chatTitle;
		const chatWith = (req.user.id == chat.participants[0]._id) ? chat.participants[1].username : chat.participants[0].username;
		
		return {id, chatTitle, chatWith};
	});
	
	const chats = await Promise.all(chatPromise);

	let allLearningChats = [];
	allLearningChats.push(...chats)
	
    res.status(200).json({
		status : "success",
        learningChats : allLearningChats
    })  
});

export const getChat = catchAsync(async (req, res, next) => {
    const chat = await Chat.findById(req.params.chatId);
	console.log(chat);

    res.status(200).json({
		status: "success",
		chat: chat
	})
})

export const increaseSkillPercentage = catchAsync(async (req, res, next) => {
	const chat = await Chat.findByIdAndUpdate(req.params.chatId, {skillProgress : skillProgress + 10});

	res.status(200).json({
		status : "success"
	})
})

