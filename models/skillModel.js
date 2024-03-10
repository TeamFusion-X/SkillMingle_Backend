import mongoose from 'mongoose';
import validator from 'validator'

import {User} from './userModel.js';

const skillsSchema = new mongoose.Schema({
    skill: {
        type: String
    },
    usersWillingToTeach: {
        type: [{type:mongoose.Schema.Types.ObjectId, ref: "User"}]
    }
})


export const Skill = mongoose.model('Skill', skillsSchema);