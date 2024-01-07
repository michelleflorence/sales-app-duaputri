import express from "express";
import { getLogActivities } from "../controllers/ActivityLog.js";
import { verifyOfficer } from "../middleware/AuthOfficer.js";

const router = express.Router();

// Parsing middleware ke masing-masing end point

// Endpoint untuk mendapatkan daftar semua activity log (GET)
router.get("/activitylog", verifyOfficer, getLogActivities);

export default router;
