import {User} from './../models/userModel.js';
import {Request} from './../models/requestModel.js';
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
})