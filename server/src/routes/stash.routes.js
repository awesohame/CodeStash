import { Router } from 'express';
import {
    createStash,
    getPublicStashes,
    getStashesOfCurrentUser,
    getStashesByUsername,
    getStashesSortedByDate,
    getStashedSortedByUpdateDate,
    updateStash,
    deleteStash,
    getStashBySlug
} from '../controllers/stash.controller.js';
import { checkIfGuest, verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// protected routes
router.route('/user').get(verifyJWT, getStashesOfCurrentUser)
router.route('/delete/:stashSlug').delete(verifyJWT, deleteStash)

// guest routes
router.route('/update/:stashSlug').patch(checkIfGuest, updateStash)
router.route('/create').post(checkIfGuest, createStash)

// public routes
router.route('/public').get(getPublicStashes)
router.route('/users/:username').get(getStashesByUsername)
router.route('/sorted-created').get(getStashesSortedByDate)
router.route('/sorted-updated').get(getStashedSortedByUpdateDate)
router.route('/:stashSlug').get(getStashBySlug)

export default router;