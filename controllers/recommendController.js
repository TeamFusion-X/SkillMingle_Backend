import {User} from './../models/userModel.js';
import {Skill} from './../models/skillModel.js';
import {catchAsync} from './../utils/catchAsync.js';


export const aggregation =  catchAsync(async(req, res, next) => {


    res.status(200).json({
        status : "success"
    })
});

export const machineLearning = catchAsync(async (req, res, next) => {
    
    
    res.status(200).json({
        status : "success"
    })
});

export const graphs = catchAsync(async (req, res, next) => {
    
    
    res.status(200).json({
        status : "success"
    })
})