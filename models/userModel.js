import mongoose from 'mongoose';
import validator from 'validator';

import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import {Skill} from './skillModel.js';

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        unique : [true, 'This username is already taken! Try another one..'],
        required :[true,'Please set a username']
    },
    name : {
        type : String,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: [true, 'This email is already taken! Try another one..'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    bio: {
        type: String,
        default: "No bio provided"
    },
    displayPicture : {
        type : String,
        default : "/img/users/default-user.jpeg"
    },
    userSkills: {
        type: [String]
    },
    skillsToLearn: {
        type: [String],
        required: [false]
    },
    skillsToTeach: {
        type: [String],
        required: [false]
    },
    requestsReceived: {
        type : [{type: mongoose.Schema.Types.ObjectId, ref: "Request"}]
    },
    teachingConversations : {
        type : [{type: mongoose.Schema.Types.ObjectId, ref: "Chat"}]
    },
    learningConversations : {
        type : [{type: mongoose.Schema.Types.ObjectId, ref: "Chat"}]
    },
    teachingRating : {
        type : Number,
        default : 0
    },
    numberOfRatings : {
        type : Number,
        default : 0
    },
    reviews : {
        type : [{type: mongoose.Schema.Types.ObjectId, ref: "Review"}]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        minlength: 8
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password'))    return next();

    this.password = await bcrypt.hash(this.password,12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.pre(['updateOne', 'findByIdAndUpdate', 'findOneAndUpdate'], async function (next) {
    const newSkillsToTeach = this._update.skillsToTeach; // The updated skills array
    if (!newSkillsToTeach) return next(); // Skip if no skills are being updated

    const userId = this.getFilter('_id')._id; 

    const user = await this.model.findById(userId).select('skillsToTeach');
    const currentSkillsToTeach = user.skillsToTeach || [];

    const removedSkills = currentSkillsToTeach.filter(skill => !newSkillsToTeach.includes(skill));
    const addedSkills = newSkillsToTeach.filter(skill => !currentSkillsToTeach.includes(skill));

    // Handle removed skills: Remove the user reference
    for (const skill of removedSkills) {
        const foundSkill = await Skill.findOne({ skill });
        if (foundSkill) {
            // Remove the user ID from the 'usersWillingToTeach' array
            foundSkill.usersWillingToTeach = foundSkill.usersWillingToTeach.filter(id => !id.equals(userId));

            // If no users are left, optionally delete the skill
            if (foundSkill.usersWillingToTeach.length === 0) {
                await foundSkill.deleteOne();
            } 
            else {
                await foundSkill.save();
            }
        }
    }

    // Handle added skills: Add the user reference (ensuring no duplicates)
    for (const skill of addedSkills) {
        let foundSkill = await Skill.findOne({ skill });
        if (!foundSkill) {
            // Create new skill if it doesn't exist
            foundSkill = await Skill.create({ skill, usersWillingToTeach: [userId] });
        } 
        else {
            // Ensure no duplicate user ID is added
            if (!foundSkill.usersWillingToTeach.some(id => id.equals(userId))) {
                foundSkill.usersWillingToTeach.push(userId);
                await foundSkill.save();
            }
        }
    }

    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
};

export const User = mongoose.model('User', userSchema);
