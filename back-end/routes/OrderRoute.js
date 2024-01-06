import express from "express";

import {
  getOrders,
  getOrderById,
  getIncomeChart,
  getPaymentChart,
  getTotalIncome,
  getTotalOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/Orders.js";

import { verifyOfficer, cashierOnly } from "../middleware/AuthOfficer.js";

const router = express.Router();

// Parsing middleware ke masing-masing end point

// Endpoint untuk mendapatkan daftar semua order (GET)
router.get("/orders", verifyOfficer, getOrders);

// Endpoint untuk mendapatkan chart pemasukan
router.get("/orders/income-chart", verifyOfficer, getIncomeChart);

// Endpoint untuk mendapatkan chart
router.get("/orders/payment-chart", verifyOfficer, getPaymentChart);

// Endpoint untuk mendapatkan total income
router.get("/orders/total-income", verifyOfficer, getTotalIncome);

// Endpoint untuk mendapatkan total orders
router.get("/orders/total", verifyOfficer, getTotalOrders);

// Endpoint untuk mendapatkan order berdasarkan ID (GET)
router.get("/orders/:id", verifyOfficer, getOrderById);

// Endpoint untuk membuat order baru (POST)
router.post("/orders", verifyOfficer, cashierOnly, createOrder);

// Endpoint untuk memperbarui order berdasarkan ID (PATCH)
router.patch("/orders/:id", verifyOfficer, cashierOnly, updateOrder);

// Endpoint untuk menghapus order berdasarkan ID (DELETE)
router.delete("/orders/:id", verifyOfficer, cashierOnly, deleteOrder);

export default router;
