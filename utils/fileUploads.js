import multer from 'multer';
import {AppError} from './appError.js';

const multerStorage = multer.memoryStorage();

const multerFilterDP = (req, file, cb) => { // For Display Picture
    // console.log(file);
    if (file.mimetype.startsWith('image')){
        cb(null, true);
    }
    else{
        cb(new AppError('Not an image! Please upload only images,', 400), false);
    }
}

export const uploadImage = multer({
    storage : multerStorage,
    fileFilter : multerFilterDP
});