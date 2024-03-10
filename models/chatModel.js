import mongoose from 'mongoose';
import validator from 'validator';

const chatMessageSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'Sender'},
    content: String,
    chat: {type: mongoose.Schema.Types.ObjectId, ref: 'ChatId'}
    }, 
    { timestamps: true }
);

const chatSchema = new mongoose.Schema({
    isGroupChat: {
        type: Boolean,
        default: false
    },
    participants: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }
    }, 
    { timestamps: true }
);

export const Message = mongoose.model('Message', chatMessageSchema);
export const Chat = mongoose.model('Chat', chatSchema);