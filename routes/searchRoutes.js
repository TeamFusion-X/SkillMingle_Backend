import express from 'express';
import * as searchController  from '../controllers/searchController.js';
import * as authController from '../controllers/authController.js';

export const router = express.Router();

router.use(authController.protect);

router.get("/:skill", searchController.rankMatchingUsers);