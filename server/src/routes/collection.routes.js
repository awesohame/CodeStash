import { Router } from 'express';
import {
    createCollection,
} from '../controllers/collection.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/create').post(verifyJWT, createCollection);


export default router;