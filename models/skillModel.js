import mongoose from 'mongoose';

const skillsSchema = new mongoose.Schema({
    skill: {
        type: String
    },
    usersWillingToTeach: {
        type: [{type:mongoose.Schema.Types.ObjectId, ref: "User"}]
    }
});


export const Skill = mongoose.model('Skill', skillsSchema);