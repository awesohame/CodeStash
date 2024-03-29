import { Router } from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
    getCurrentUser,
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').get(loginUser)
router.route('/logout').get(verifyJWT, logoutUser)
router.route('/delete').delete(verifyJWT, deleteUser)
router.route('/getuser').get(verifyJWT, getCurrentUser)

export default router;