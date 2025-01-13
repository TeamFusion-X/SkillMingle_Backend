import express from 'express';
import * as helloController from './../controllers/helloController.js'

export const router = express.Router();

router.get('/', helloController.saySomething);
