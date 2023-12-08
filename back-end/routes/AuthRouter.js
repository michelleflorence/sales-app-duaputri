import express from 'express';
import {login, logOut, Me} from '../controllers/Auth.js'

import { verifyOfficer } from '../middleware/AuthOfficer.js';

const router = express.Router();

router.get('/me', verifyOfficer, Me);
router.post('/login', login);
router.delete('/logout', logOut)

export default router;