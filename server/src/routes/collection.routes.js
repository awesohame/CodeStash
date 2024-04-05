import { Router } from 'express';
import {
    createCollection,
    addStashToCollection,
    removeStashFromCollection,
    updateCollectionDetails,
    deleteCollection,
    getCollectionsByUsername,
    getCollectionOfCurrentUser,
} from '../controllers/collection.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

//protected
router.route('/create').post(verifyJWT, createCollection);
router.route('/add-stash/:collectionSlug').patch(verifyJWT, addStashToCollection);
router.route('/update/:collectionSlug').patch(verifyJWT, updateCollectionDetails);
router.route('/delete/:collectionSlug').delete(verifyJWT, deleteCollection);
router.route('/user').get(verifyJWT, getCollectionOfCurrentUser);

//public
router.route('/users/:username').get(getCollectionsByUsername); // public collections

// probably useless
router.route('/remove-stash/:collectionSlug').patch(verifyJWT, removeStashFromCollection);


export default router;