import express from 'express';
import { getBase } from '../controllers/base.js';

const router = express.Router();

router.get('', getBase);

export default router;
