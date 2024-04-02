import { Router } from 'express';
import {
    createCollection,
    addStashToCollection
} from '../controllers/collection.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/create').post(verifyJWT, createCollection);
router.route('/add-stash/:collectionSlug').patch(verifyJWT, addStashToCollection);


export default router;