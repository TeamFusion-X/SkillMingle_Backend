import express from 'express';
import * as authController from './../controllers/authController.js';
import * as chatController from './../controllers/chatController.js';
export const router = express.Router();

router.use(authController.protect);

router.get('/teach', chatController.getTeachingChats);
router.get('/learn', chatController.getLearningChats);
router.get('/:chatId', chatController.getChat);