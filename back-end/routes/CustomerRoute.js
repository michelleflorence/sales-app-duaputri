import express from "express";
import {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from "../controllers/Customers.js";

import { verifyOfficer } from "../middleware/AuthOfficer.js";

const router = express.Router();

// Parsing middleware ke masing-masing end point

// Endpoint untuk mendapatkan daftar semua customer (GET)
router.get('/customers', verifyOfficer, getCustomers);

// Endpoint untuk mendapatkan data customer berdasarkan ID (GET)
router.get('/customers/:id', verifyOfficer, getCustomerById)

// Endpoint untuk membuat customer baru (POST)
router.post('/customers', verifyOfficer, createCustomer)

// Endpoint untuk memperbarui data customer berdasarkan ID (PATCH)
router.patch('/customers/:id', verifyOfficer, updateCustomer)

// Endpoint untuk menghapus customer berdasarkan ID (DELETE)
router.delete('/customers/:id', verifyOfficer, deleteCustomer)

export default router;