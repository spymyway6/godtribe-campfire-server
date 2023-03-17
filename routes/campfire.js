import express from 'express';
// TODO: For route protection
// import { verifyAuth } from '../middleware/auth.js';
import {
    fetchCampfires,
    fetchOwnCampfires,
    fetchPublicCampfires,
    fetchPrivateCampfires,
    fetchCampfireById,
    createCampfire,
    updateCampfire,
    deleteCampfire,
    fetchCampfireMembers,
} from '../controllers/campfire.js';

const router = express.Router();

router.get('/campfires', fetchCampfires);
router.post('/campfires', createCampfire);
router.get('/campfires/owned', fetchOwnCampfires);
router.get('/campfires/public', fetchPublicCampfires);
router.get('/campfires/private', fetchPrivateCampfires);
router.get('/campfires/:id', fetchCampfireById)
router.patch('/campfires/:id', updateCampfire);
router.delete('/campfires/:id', deleteCampfire);
router.get('/campfires/:id/member', fetchCampfireMembers);

export default router;
