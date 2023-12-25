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

// Endpoint untuk mendapatkan daftar semua officer (GET)
router.get('/officers', verifyOfficer, getOfficers);

// Endpoint untuk mendapatkan data officer berdasarkan ID (GET)
router.get('/officers/:id', verifyOfficer, getOfficerById);

// Endpoint untuk membuat officer baru (POST)
router.post('/officers', verifyOfficer, superAdminOnly, createOfficer);

// Endpoint untuk memperbarui data officer berdasarkan ID (PATCH)
router.patch('/officers/:id', verifyOfficer, superAdminOnly, updateOfficer);

// Endpoint untuk menghapus officer berdasarkan ID (DELETE)
router.delete('/officers/:id', verifyOfficer, superAdminOnly, deleteOfficer)

export default router;