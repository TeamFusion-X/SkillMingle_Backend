import express from 'express';
import * as userController from './../controllers/userController.js';
import * as authController from './../controllers/authController.js';

export const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.get('/:username', userController.getUser);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe);
router.patch('/updateMe', userController.updateMe);
router.patch('/updateDP', userController.uploadDP, userController.resizeAndSaveDP)
router.delete('/deleteMe', userController.deleteMe);
