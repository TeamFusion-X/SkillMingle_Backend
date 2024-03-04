const mongoose = require('mongoose')
const validator = require('validator')

const User = require('./../models/userModel')

const skillsSchema = new mongoose.Schema({
    skill: {
        type: String
    },
    users: {
        type: [{type:mongoose.Schema.Types.ObjectId, ref: "User"}]
    }
})


const Skills = mongoose.model('Skills', skillsSchema);

module.exports = Skills;