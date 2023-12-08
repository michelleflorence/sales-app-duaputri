import express from 'express';
import { 
    getOfficers,
    getOfficerById,
    createOfficer,
    updateOfficer,
    deleteOfficer
} from '../controllers/Officers.js';

import { verifyOfficer, superAdminOnly } from '../middleware/AuthOfficer.js';

const router = express.Router();

// Parsing middleware ke masing-masing end point
router.get('/officers', verifyOfficer, superAdminOnly, getOfficers);
router.get('/officers/:id', verifyOfficer, superAdminOnly, getOfficerById);
router.post('/officers', verifyOfficer, superAdminOnly, createOfficer);
router.patch('/officers/:id', verifyOfficer, superAdminOnly, updateOfficer);
router.delete('/officers/:id', verifyOfficer, superAdminOnly, deleteOfficer)

export default router;