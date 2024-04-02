import {User} from '../models/userModel.js';
import {Skill} from '../models/skillModel.js';
import {catchAsync} from '../utils/catchAsync.js';
import { spawn }    from 'child_process';

import path from 'path';
const __dirname = path.resolve();


// Function to run the Python program
const runPythonProgram = (programPath, parameters, inputData) => {
    return new Promise((resolve, reject) => {
        let programOutput = '';

        const pythonProcess = spawn('python', [programPath, ...parameters]);

        pythonProcess.stdout.on('data', (data) => {
            programOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(programOutput);
            } else {
                reject(`Python process exited with code ${code}`);
            }
        });

        pythonProcess.stdin.write(inputData);
        pythonProcess.stdin.end();
    });
}

export const suggestUsers = catchAsync(async(req,res,next) => {
    
    
    const programPath = path.join(__dirname, 'MachineLearning', 'MLmodel.py');

    //Convert Data
    let inputUser = "";
    const user = await User.findById(req.user.id)
    inputUser += user.username + " ";

    let inputSkillsToLearn = "";
    
    user.skillsToLearn.forEach(element => {
        inputSkillsToLearn += element + " ";
    });

    let inputSkillsToTeach = "";
    
    user.skillsToTeach.forEach(element => {
        inputSkillsToTeach += element + " ";
    });


    const inputData = ""
    var programOutput = ""

    //Run Script
    try {
        programOutput = await runPythonProgram(programPath, [inputUser,inputSkillsToLearn,inputSkillsToTeach], inputData);
    } catch (error) {
        console.error('Error running Python program:', error);
    }

    const rankedUsers = programOutput.split(" ");
        
    const rankedUsersPromise = rankedUsers.map(async username_match => {
        const username = username_match;
        
        const user = await User.findOne({username : username});
        let name, dp, rating;
        
        if (user){
            name = user.name;
            dp = user.displayPicture;
            
            return {username, name, dp};
        }
    });

    const rankedUsersDetails = await Promise.all(rankedUsersPromise);
    
    res.status(200).json({
		status: "successfully fetched suggestions",
		data: {
			user: rankedUsers
		},
	});
   
});

export const findsuggestions = catchAsync(async(req,res,next) => {
    const programPath = path.join(__dirname, 'MachineLearning', 'ML2model.py');

    const pythonProcess = spawn('python', [programPath]);

    // Capture the output
    pythonProcess.stdout.on('data', (data) => {
        res.json({ result: data.toString() });
    });

    // Handle errors
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error executing Python script: ${data}`);
        res.status(500).json({ error });
    });

});