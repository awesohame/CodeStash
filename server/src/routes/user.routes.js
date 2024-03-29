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
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').get(loginUser)
router.route('/logout').get(verifyJWT, logoutUser)
router.route('/delete').delete(verifyJWT, deleteUser)
router.route('/getuser').get(verifyJWT, getCurrentUser)
router.route('/changepassword').patch(verifyJWT, changePassword)
router.route('/changeusername').patch(verifyJWT, changeUsername)

export default router;