import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
    {
        skill: {
            type : String
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps : true
    }
)

export const Request = mongoose.model('Requests', requestSchema);