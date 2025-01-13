import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        skill: {
            type : String
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        review: {
            type : String
        }
    },
    {
        timestamps : true
    }
)

export const Review = mongoose.model('Review', reviewSchema);