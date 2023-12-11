import express from 'express';

import { 
    getOrders, 
    getOrderById, 
    createOrder, 
    updateOrder, 
    deleteOrder 
} from '../controllers/Orders.js';

const router = express.Router();

// Parsing middleware ke masing-masing end point

// Endpoint untuk mendapatkan daftar semua order (GET)
router.get('/orders', getOrders)

// Endpoint untuk mendapatkan order berdasarkan ID (GET)
router.get('/orders/:id', getOrderById)

// Endpoint untuk membuat order baru (POST)
router.post('/orders', createOrder)

// Endpoint untuk memperbarui order berdasarkan ID (PATCH)
router.patch('/orders/:id', updateOrder)

// Endpoint untuk menghapus order berdasarkan ID (DELETE)
router.delete('/orders/:id', deleteOrder)

export default router;