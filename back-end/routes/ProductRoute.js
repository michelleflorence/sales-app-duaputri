import express from 'express';
import {
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct
} from '../controllers/Products.js'

import {verifyOfficer, chefOnly} from '../middleware/AuthOfficer.js'

const router = express.Router();

router.get('/products', verifyOfficer, getProducts);
router.get('/products/:id', verifyOfficer, getProductById);
router.post('/products', verifyOfficer, chefOnly, createProduct);
router.patch('/products/:id', verifyOfficer, chefOnly, updateProduct);
router.delete('/products/:id', verifyOfficer, chefOnly, deleteProduct)

export default router;