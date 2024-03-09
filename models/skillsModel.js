import mongoose from 'mongoose';
import validator from 'validator'

import {User} from './../models/userModel.js';

const skillsSchema = new mongoose.Schema({
    skill: {
        type: String
    },
    usersWillingToTeach: {
        type: [{type:mongoose.Schema.Types.ObjectId, ref: "User"}]
    }
})


export const Skills = mongoose.model('Skills', skillsSchema);