import express from "express";

import { 
    getOrderDetails,
    getOrderDetailById,
    createOrderDetails,
    updateOrderDetails,
    deleteOrderDetails
} from "../controllers/OrderDetails.js";

const router = express.Router();

// Parsing middleware ke masing-masing end point

// Endpoint untuk mendapatkan daftar semua order details (GET)
router.get('/orderdetails', getOrderDetails)

// Endpoint untuk mendapatkan order details berdasarkan ID (GET)
router.get('/orderdetails/:id', getOrderDetailById)

// Endpoint untuk membuat order detail baru (POST)
router.post('/orderdetails', createOrderDetails)

// Endpoint untuk memperbarui order detail berdasarkan ID (PATCH)
router.patch('/orderdetails/:id', updateOrderDetails)

// Endpoint untuk menghapus order detail berdasarkan ID (DELETE)
router.delete('/orderdetails/:id', deleteOrderDetails)

export default router;


