import express from 'express';
import {
    getProducts,
    getTotalProducts,
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct
} from '../controllers/Products.js'

import {verifyOfficer, adminOnly} from '../middleware/AuthOfficer.js'
import upload from '../middleware/Upload.js';

const router = express.Router();

// Parsing middleware ke masing-masing end point

// Endpoint untuk mendapatkan daftar semua produk (GET)
router.get("/products", verifyOfficer, getProducts);

// Endpoint untuk mendapatkan total produk
router.get("/products/total", verifyOfficer, getTotalProducts);

// Endpoint untuk mendapatkan data produk berdasarkan ID (GET)
router.get('/products/:id', verifyOfficer, getProductById);

// Endpoint untuk membuat produk baru (POST)
router.post('/products', verifyOfficer, adminOnly, upload.single('images'), createProduct);

// Endpoint untuk memperbarui data produk berdasarkan ID (PATCH)
router.patch('/products/:id', verifyOfficer, adminOnly, upload.single('images'), updateProduct);

// Endpoint untuk menghapus produk berdasarkan ID (DELETE)
router.delete('/products/:id', verifyOfficer, adminOnly, deleteProduct)

export default router;