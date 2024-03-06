const mongoose = require('mongoose')
const validator = require('validator')

const crypto = require('crypto')
const bcrypt = require('bcryptjs');

const Skills = require('./../models/skillsModel')

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
    userSkills: {
        type: [String]
    },
    skills: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "Skills"}]
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
        minlength: 8
    }
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password'))    return next();

    this.password = await bcrypt.hash(this.password,12);

    this.passwordConfirm = undefined;
    next();
});

// Many to Many referencing 
// User to Skill and Skill to User
userSchema.pre('save',async function(next){
    const userSkills = this.userSkills;

    //Search Skill Objects and their object Id
    const skillPromises = userSkills.map(async item => {
        
        let foundSkill = await Skills.findOne({ skill: item });
        
        if (!foundSkill) {
            foundSkill = await Skills.create({ skill: item });
        }

        //Storing the user data reference in skill database
        foundSkill.users.push(this._id);
        await foundSkill.save();
        return foundSkill._id;
    });
    
    //Get their Object Id
    const skillIds = await Promise.all(skillPromises);
    
    //Store their Object Id
    this.skills.push(...skillIds);
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
