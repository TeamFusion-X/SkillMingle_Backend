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
    
    inputData += user.username + " ";
    inputData += user.skillsToTeach.length + " ";
    
    user.skillsToTeach.forEach(element => {
        inputData += element + " ";
    });

    const skill = await Skill.findOne({skill : req.params.skill}).populate('usersWillingToTeach');
    
    const numUsers = skill.usersWillingToTeach.length;
    inputData += numUsers + " ";

    skill.usersWillingToTeach.forEach(userToRank => {
        const numSkill = userToRank.skillsToLearn.length;
        inputData += userToRank.username + " " + numSkill + " ";
        
        userToRank.skillsToLearn.forEach(element => {
            inputData += element + " ";
        })
    });

    // Execution
    try {
        const programPath = path.join(__dirname, 'utils', 'rankUsers.out');

        let programOutput = await runCppProgram(programPath, inputData);
        programOutput = programOutput.slice(0, -1);
        // console.log(programOutput);
        
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
        });
    
        const rankedUsersDetails = await Promise.all(rankedUsersPromise);

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