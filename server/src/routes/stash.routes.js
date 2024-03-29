import { Router } from 'express';
import {
    createStash,
    getPublicStashes,
    getStashesOfCurrentUser,
    getStashByUsername,
    getStashesSortedByDate,
    updateStash,
    deleteStash
} from '../controllers/stash.controller.js';
import { checkIfGuest, verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/create').post(checkIfGuest, createStash)
router.route('/public').get(getPublicStashes)
router.route('/user').get(verifyJWT, getStashesOfCurrentUser)
router.route('/users/:username').get(getStashByUsername)
router.route('/sorted').get(getStashesSortedByDate)
router.route('/update/:id').patch(verifyJWT, updateStash)
router.route('/delete/:id').delete(verifyJWT, deleteStash)

export default router;