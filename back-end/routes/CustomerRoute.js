import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
} from "../controllers/Customers.js";

import { verifyOfficer } from "../middleware/AuthOfficer.js";

const router = express.Router();

// Parsing middleware ke masing-masing end point

// Endpoint untuk mendapatkan daftar semua customer (GET)
router.get("/customers", verifyOfficer, getCustomers);

// Endpoint untuk mendapatkan data customer berdasarkan ID (GET)
router.get("/customers/:id", verifyOfficer, getCustomerById);

// Endpoint untuk membuat customer baru (POST)
router.post("/customers", verifyOfficer, createCustomer);

export default router;
