import express from 'express';
import * as suggestionsController from './../controllers/suggestionsController.js';
import * as authController from '../controllers/authController.js';

export const router = express.Router();

router.use(authController.protect);

router.get("/",suggestionsController.suggestUsers);
router.get("/calculate",suggestionsController.findsuggestions);