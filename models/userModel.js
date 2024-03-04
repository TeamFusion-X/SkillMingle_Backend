const mongoose = require('mongoose')
const validator = require('validator')

const crypto = require('crypto')
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:[true,'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        // unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    bio: {
        type: String
    },
    skills: {
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
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    }
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password'))    return next();

    this.password = await bcrypt.hash(this.password,12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;