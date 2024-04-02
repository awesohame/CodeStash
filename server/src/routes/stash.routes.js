import { Router } from 'express';
import {
    createStash,
    getPublicStashes,
    getStashesOfCurrentUser,
    getStashesByUsername,
    getStashesSortedByDate,
    updateStash,
    deleteStash,
    getStashBySlug
} from '../controllers/stash.controller.js';
import { checkIfGuest, verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/create').post(checkIfGuest, createStash)
router.route('/public').get(getPublicStashes)
router.route('/user').get(verifyJWT, getStashesOfCurrentUser)
router.route('/users/:username').get(getStashesByUsername)
router.route('/sorted').get(getStashesSortedByDate)
router.route('/update/:uniqueSlug').patch(verifyJWT, updateStash)
router.route('/delete/:uniqueSlug').delete(verifyJWT, deleteStash)
router.route('/:uniqueSlug').get(getStashBySlug)

export default router;