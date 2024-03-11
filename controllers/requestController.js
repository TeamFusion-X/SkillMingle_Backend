import {User} from './../models/userModel.js';
import {Request} from './../models/requestModel.js';
import {Chat} from './../models/chatModel.js';
import {catchAsync} from './../utils/catchAsync.js';

export const getRequests = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	const reqPromise = user.requestsReceived.map(async requestID => {
		const request = await Request.findById(requestID).populate("sender");
		const id = requestID;
		const skill = request.skill;
		const sender = request.sender.username;

		return {id, skill, sender};
	});

	const requests = await Promise.all(reqPromise);

	let allRequests = [];
	allRequests.push(...requests)

    res.status(201).json({
        status : 'success',
        data : {
            requests : allRequests
        }
    });
});

export const sendRequest = catchAsync(async (req, res, next) => {
	// console.log(req.params);

	const sentFrom = await User.findById(req.user.id);

	const newRequest = await Request.create({
		skill : req.params.skill,
		sender : sentFrom._id
	})
	
	await User.updateOne({username : req.params.username}, {$push : {requestsReceived : newRequest}});
	
	res.status(200).json({
		status : "success",
		message : "Request Sent Successfully"
	});
});

export const takeAction = catchAsync(async (req, res, next) => {
	req.request = await Request.findById(req.params.requestID);
	req.sentFrom = await User.findById(req.request.sender);
	req.sentTo = await User.findById(req.user.id);

	next();
})

export const reject = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, {$pull : {requestsReceived : req.params.requestID} });
	await Request.findByIdAndDelete(req.params.requestID);
	
	res.status(200).json({
		status : "success",
		message : "Request Declined Successfully"
	})
});

export const skillShare = catchAsync(async (req, res, next) => {
	if (req.params.skill){
		const requestSenderWantsToLearn = await Chat.create({
			isGroupChat : false,
			chatTitle : req.request.skill,
			participants : [req.sentFrom._id, req.sentTo._id]
		});
		const requestAcceptorWantsToLearn = await Chat.create({
			isGroupChat : false,
			chatTitle : req.params.skill,
			participants : [req.sentFrom._id, req.sentTo._id]
		});

		// Deleting the request
		await User.findByIdAndUpdate(req.sentTo._id, {$pull : {requestsReceived : req.params.requestID} });
		await Request.findByIdAndDelete(req.params.requestID);

		// Creating new conversations
		await User.findByIdAndUpdate(req.sentTo._id, {$push : {teachingConversations : requestSenderWantsToLearn}});
		await User.findByIdAndUpdate(req.sentFrom._id, {$push : {learningConversations : requestSenderWantsToLearn}});
		await User.findByIdAndUpdate(req.sentTo._id, {$push : {learningConversations : requestAcceptorWantsToLearn}});
		await User.findByIdAndUpdate(req.sentFrom._id, {$push : {teachingConversations : requestAcceptorWantsToLearn}});
		
		res.status(200).json({
			status : "success",
			message : "Conversations Successfully Added"
		})
	}
	else {
		const skillsTheyHave = req.sentFrom.skillsToTeach;

		res.status(200).json({
			status : "success",
			skillsToChooseFrom : skillsTheyHave
		})
	}
});

export const teachFree = catchAsync(async (req, res, next) => {
	const newChat = await Chat.create({
		isGroupChat : false,
		chatTitle : req.request.skill,
		participants : [req.sentFrom._id, req.sentTo._id]
	});

	// Deleting the request
	await User.findByIdAndUpdate(req.sentTo._id, {$pull : {requestsReceived : req.params.requestID} });
	await Request.findByIdAndDelete(req.params.requestID);

	// Creating new conversation
	await User.findByIdAndUpdate(req.sentTo._id, {$push : {teachingConversations : newChat}});
	await User.findByIdAndUpdate(req.sentFrom._id, {$push : {learningConversations : newChat}});

	res.status(200).json({
		status : "success"
	})
});

export const teachPaid = catchAsync(async (req, res, next) => {
	res.status(200).json({
		status : "success"
	})
});