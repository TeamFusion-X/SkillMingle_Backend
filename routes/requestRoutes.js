import express from 'express';
import * as requestController from './../controllers/requestController.js';
import * as authController from './../controllers/authController.js';

export const router = express.Router();

router.use(authController.protect);

router.get('/', requestController.getRequests);
router.route('/send/:skill/:username').get(requestController.sendRequest);

router.route('/accept/:requestID/skillShare/:skill?').get(requestController.takeAction, requestController.skillShare);
router.route('/accept/:requestID/teachFree').get(requestController.takeAction, requestController.teachFree);
router.route('/accept/:requestID/teachPaid').get(requestController.takeAction, requestController.teachPaid);
router.route('/reject/:requestID').get(requestController.reject);
