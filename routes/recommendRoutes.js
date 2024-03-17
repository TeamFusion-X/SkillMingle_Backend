import express from 'express';
import * as recommendController  from './../controllers/recommendController.js';
import * as authController from './../controllers/authController.js';

export const router = express.Router();

router.use(authController.protect);

router.get("/:skill/aggregation", recommendController.aggregation);
router.get("/:skill/ml", recommendController.machineLearning);