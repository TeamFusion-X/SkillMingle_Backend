import mongoose from 'mongoose';

import {Skill} from './skillModel.js';
import {User} from './userModel.js'

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