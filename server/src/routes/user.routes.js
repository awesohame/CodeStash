import { Router } from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
    getCurrentUser,
    changePassword,
    changeUsername,
} from '../controllers/user.controller.js';
import { verifyJWT, checkIfGuest } from '../middlewares/auth.middleware.js';

const router = Router();

// protected 
router.route('/logout').get(verifyJWT, logoutUser)
router.route('/delete').delete(verifyJWT, deleteUser)
router.route('/changepassword').patch(verifyJWT, changePassword)
router.route('/changeusername').patch(verifyJWT, changeUsername)
router.route('/getuser').get(verifyJWT, getCurrentUser)

// guest


// public
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

export default router;