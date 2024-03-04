const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const User = require('./../models/userModel')

exports.signup = async(req,res,next) => {
    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        bio: req.body.bio,
        skills: req.body.skills,
        skillsToLearn: req.body.skillsToLearn,
        skillsToTeach: req.body.skillsToTeach,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    res.status(201).json({
        status: 'success',
        userdata: {
            newUser
        } 
    })
}