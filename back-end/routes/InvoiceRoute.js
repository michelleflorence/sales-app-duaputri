import express from 'express';

import { 
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice
} from '../controllers/Invoices.js';

const router = express.Router();

// Parsing middleware ke masing-masing end point

// Endpoint untuk mendapatkan daftar semua invoice (GET)
router.get('/invoices', getInvoices)

// Endpoint untuk mendapatkan invoice berdasarkan ID (GET)
router.get('/invoices/:id', getInvoiceById)

// Endpoint untuk membuat invoice baru (POST)
router.post('/invoices', createInvoice)

// Endpoint untuk memperbarui invoice berdasarkan ID (PATCH)
router.patch('/invoices/:id', updateInvoice)

// Endpoint untuk menghapus invoice berdasarkan ID (DELETE)
router.delete('/invoices/:id', deleteInvoice)

export default router;
