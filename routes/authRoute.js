import express from 'express'
import {registerController,loginController,testController,} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

// router object
const router = express.Router()

// Routing
// REGISTER || METHOD POST
router.post('/register', registerController)

// LOGIN || POST
router.post('/Login', loginController)

// test routes
router.get('/test',requireSignIn,isAdmin, testController)


export default router;