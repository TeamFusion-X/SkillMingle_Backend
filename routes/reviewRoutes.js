import express from 'express';
import * as reviewController from './../controllers/reviewController.js';
import * as authController from './../controllers/authController.js';

export const router = express.Router();

router.use(authController.protect);

router.post('/rate', reviewController.giveRating);
router.post('/give', reviewController.giveReview);