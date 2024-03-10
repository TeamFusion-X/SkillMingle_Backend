import express from 'express';
import * as requestController from './../controllers/requestController.js';
import * as authController from './../controllers/authController.js';

export const router = express.Router();

router.use(authController.protect);

router.get('/', requestController.getRequests);
router.route('/send/:skill/:username').get(requestController.sendRequest);


