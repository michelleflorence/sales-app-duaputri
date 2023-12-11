import express from 'express';
import {login, logOut, Me} from '../controllers/Auth.js'

import { verifyOfficer } from '../middleware/AuthOfficer.js';

const router = express.Router();

// Endpoint untuk mendapatkan informasi officer yang sedang login
router.get('/me', verifyOfficer, Me);

// Endpoint untuk proses login officer
router.post('/login', login);

// Endpoint untuk proses logout officer
router.delete('/logout', logOut)

export default router;