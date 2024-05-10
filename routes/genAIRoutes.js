import express from 'express';
import * as genAIController from "./../controllers/genAIController.js";

export const router = express.Router();

router.post('/getResponse', genAIController.getResponse);