import { User } from "./../models/userModel.js";
import { Review } from "./../models/reviewModel.js"
import { catchAsync } from "./../utils/catchAsync.js";
import { AppError } from "./../utils/appError.js";

export const giveRating = catchAsync(async (req, res, next) => {
    const givenRating = req.body.rating;
    
    if (givenRating > 5 || givenRating < 0){
        res.status(200).json({
            message : "Please provide a rating in the range [0, 5]"
        })
    }

    const user = await User.findOne({username : req.body.username});
    const currentRating = user.teachingRating;
    const numRatings = user.numberOfRatings;

    const newRating = (currentRating*numRatings + givenRating)/(numRatings+1);
    numRatings += 1;

    await User.updateOne({username : req.body.username}, {teachingRating : newRating}, {numberOfRatings : numRatings})

    res.status(200).json({
        status : 'success',
        newRating : newRating
    })
});

export const giveReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create({
		skill : req.body.skill,
		sender : req.user.id,
        review : req.body.review
	})

    await User.updateOne({username : req.body.username}, {$push : {reviews : newReview}});

    res.status(200).json({
        status : "success"
    })
});