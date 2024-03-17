import {User} from './../models/userModel.js';
import {Skill} from './../models/skillModel.js';
import {catchAsync} from './../utils/catchAsync.js';
import {exec} from 'child_process'

import path from 'path';
const __dirname = path.resolve();

export const aggregation =  catchAsync(async(req, res, next) => {
    const programPath = path.join(__dirname, 'utils', 'recommend.exe');

    const childProcess = exec(programPath, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing C++ program: ${error}`);
            return;
        }
        console.log(`C++ program output: ${stdout}`);
    });

    const inputData = "Hello from this side\n";

    childProcess.stdin.write(inputData);
    childProcess.stdin.end();
    
    res.status(200).json({
        status : "success"
    })
});

export const machineLearning = catchAsync(async (req, res, next) => {
    
    
    res.status(200).json({
        status : "success"
    })
});