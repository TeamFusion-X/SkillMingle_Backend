import {User} from './../models/userModel.js';
import {Request} from './../models/requestModel.js';
import {Chat} from './../models/chatModel.js';
import {catchAsync} from './../utils/catchAsync.js';
    
export const getTeachingChats = catchAsync(async (req, res, next) => {
    res.status(200).sendFile('/SkillMingle/public/index.html');
})

export const getLearningChats = catchAsync(async (req, res, next) => {
    res.status(200)
})

