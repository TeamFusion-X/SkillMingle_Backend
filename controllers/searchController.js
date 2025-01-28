import {User} from '../models/userModel.js';
import {Skill} from '../models/skillModel.js';
import {catchAsync} from '../utils/catchAsync.js';
import {exec} from 'child_process';

import path from 'path';
const __dirname = path.resolve();

// Function to run the C++ program
const runCppProgram = (programPath, inputData) => {
    return new Promise((resolve, reject) => {
        let programOutput;
        
        // Creating a child process to execute the c++ program
        const childProcess = exec(programPath, (error, stdout, stderr) => {
            if (error){
                reject(error);
            } 
            else{
                programOutput = stdout;
                resolve(programOutput);
            }
        });
        
        // Feeding input to the c++ program
        childProcess.stdin.write(inputData);
        childProcess.stdin.end();
    });
}

export const rankMatchingUsers = catchAsync(async(req, res, next) => {

    // Preparing input that we are going to pass to the c++ program
    let inputData = "";

    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ status: "fail", message: "User not found" });
    }
    
    inputData += `${user.username} ${user.skillsToTeach.length} `;
    
    user.skillsToTeach.forEach(skill => {
        inputData += `${skill} `;
    });

    const skill = await Skill.findOne({skill : req.params.skill}).populate('usersWillingToTeach');
    
    if (!skill){
        return next(new AppError("No skill found!.", 404));
    }

    const numUsers = skill.usersWillingToTeach.length;
    inputData += `${numUsers} `;

    skill.usersWillingToTeach.forEach(userToRank => {
        const numSkill = userToRank.skillsToLearn.length;
        inputData += `${userToRank.username} ${userToRank.skillsToLearn.length} `;
        
        userToRank.skillsToLearn.forEach(element => {
            inputData += `${element} `;
        });
    });

    // Execution
    try {
        const binary = process.env.NODE_ENV == "production" ? "rankUsers.out" : "rankUsers.exe";
        const programPath = path.join(__dirname, 'utils', binary);

        let programOutput = await runCppProgram(programPath, inputData);
        programOutput = programOutput.slice(0, -1);
        
        const rankedUsers = programOutput.split(" ");
        
        const rankedUsersPromise = rankedUsers.map(async username_match => {
            const x = username_match.split("--");
            const username = x[0];
            const match = x[1];
            
            const user = await User.findOne({username : username});
            let name, dp, rating;
            
            if (user){
                name = user.name;
                dp = user.displayPicture;
                rating  = user.teachingRating
                
                return {username, name, dp, rating, match};
            }
            return null;
        });
    
        let rankedUsersDetails = await Promise.all(rankedUsersPromise);

        rankedUsersDetails = rankedUsersDetails.filter(
            (user) => user !== null
        );

        res.status(200).json({
            status: "success",
            rankedUsers: rankedUsersDetails
        });
    } 
    catch (error) {
        console.error(`Error : ${error}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});