import express from "express";

import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/Orders.js";

import { verifyOfficer } from "../middleware/AuthOfficer.js";

const router = express.Router();

// Parsing middleware ke masing-masing end point

// Endpoint untuk mendapatkan daftar semua order (GET)
router.get("/orders", verifyOfficer, getOrders);

// Endpoint untuk mendapatkan order berdasarkan ID (GET)
router.get("/orders/:id", verifyOfficer, getOrderById);

// Endpoint untuk membuat order baru (POST)
router.post("/orders", verifyOfficer, createOrder);

// Endpoint untuk memperbarui order berdasarkan ID (PATCH)
router.patch("/orders/:id", verifyOfficer, updateOrder);

// Endpoint untuk menghapus order berdasarkan ID (DELETE)
router.delete("/orders/:id", verifyOfficer, deleteOrder);

export default router;
