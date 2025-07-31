 import {Router} from 'express';
 import * as userController from '../controllers/user.controller.js';
 import { body } from 'express-validator';
 import * as authmiddleware from '../middleware/auth.middleware.js';


 const router = Router();

 router.post('/register', body('email').isEmail().withMessage('EMAIL MUST BE VALID EMAIL ADDRESS'),
  body('password').isLength({min: 8}).withMessage('PASSWORD MUST BE ATLEAST 8 CHARECTERS LONG'),
   userController.createUserController);

 router.post('/login', body('email').isEmail().withMessage('EMAIL MUST BE VALID EMAIL ADDRESS'),
  body('password').isLength({min: 8}).withMessage('PASSWORD MUST BE ATLEAST 8 CHARECTERS LONG'),
   userController.loginController);
    
 router.get('/profile', authmiddleware.authUser, userController.profilecontroller);

 router.get('/all', authmiddleware.authUser, userController.getAllUsersController);

 router.get('/logout', authmiddleware.authUser, userController.logoutController);

export default router;
