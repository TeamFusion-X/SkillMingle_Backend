import mongoose from 'mongoose';

import {Skill} from './skillModel.js';
import {User} from './userModel.js'

const requestSchema = new mongoose.Schema(
    {
        skill: {
            type : String
            // type: [{type:mongoose.Schema.Types.ObjectId, ref: "Skill"}]
        },
        sender: {
            type : String
            // type: [{type:mongoose.Schema.Types.ObjectId, ref: "User"}]
        },
        active: {
            type : Boolean,
            default : true
        }
    },
    {
        timestamps : true
    }
)


export const Request = mongoose.model('Requests', requestSchema);