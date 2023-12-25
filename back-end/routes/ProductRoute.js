import express from 'express';
import {
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct
} from '../controllers/Products.js'

import {verifyOfficer, chefOnly} from '../middleware/AuthOfficer.js'
import upload from '../middleware/Upload.js';

const router = express.Router();

// Parsing middleware ke masing-masing end point

// Endpoint untuk mendapatkan daftar semua produk (GET)
router.get("/products", verifyOfficer, getProducts);

// Endpoint untuk mendapatkan data produk berdasarkan ID (GET)
router.get('/products/:id', verifyOfficer, getProductById);

// Endpoint untuk membuat produk baru (POST)
router.post('/products', verifyOfficer, chefOnly, upload.single('images'), createProduct);

// Endpoint untuk memperbarui data produk berdasarkan ID (PATCH)
router.patch('/products/:id', verifyOfficer, chefOnly, upload.single('images'), updateProduct);

// Endpoint untuk menghapus produk berdasarkan ID (DELETE)
router.delete('/products/:id', verifyOfficer, chefOnly, deleteProduct)

export default router;