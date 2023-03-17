import express from 'express';
// TODO: For route protection
// import { verifyAuth } from '../middleware/auth.js';
import {
    fetchRandomUser,
    addUsers,
    encryptUser,
} from '../controllers/user.js';

const router = express.Router();

router.post('/user/random/add', addUsers);
router.get('/user/random/test', fetchRandomUser);
router.post('/user/encrypt', encryptUser);

export default router;
