import mongoose from 'mongoose';
import validator from 'validator';

const chatMessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Sender'
        },
        content:{
            type : String
        }
    }, 
    { timestamps: true }
);

const chatSchema = new mongoose.Schema(
    {
        isGroupChat: {
            type: Boolean,
            default: false
        },
        chatTitle : {
            type : String,
            default : "New Conversation"
        },
        participants: {
            type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
        },
        skillProgress : {
            type : Number,
            default : 0,
            min : 0,
            max : 100
        },
        messages : {
            type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
        }
    }, 
    { timestamps: true }
);

export const Message = mongoose.model('Message', chatMessageSchema);
export const Chat = mongoose.model('Chat', chatSchema);