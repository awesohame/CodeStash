import { Router } from 'express';
import {
    createStash,
    getPublicStashes,
    getStashesOfCurrentUser,
    getStashByUsername
} from '../controllers/stash.controller.js';
import { checkIfGuest, verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/create').post(checkIfGuest, createStash)
router.route('/public').get(getPublicStashes)
router.route('/user').get(verifyJWT, getStashesOfCurrentUser)
router.route('/:username').get(getStashByUsername)

export default router;