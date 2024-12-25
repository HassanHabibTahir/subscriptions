import express, { Router } from 'express';
import AuthController from '../controller/authcontroller';

const router = Router();

router.post('/signup', AuthController.signup);


export default router;
