import Customers from "../models/CustomerModel.js";
import ActivityLog from "../models/ActivityLogModel.js";
import validator from "validator";

// Fungsi untuk log aktivitas
const logActivity = async (officerId, action, target) => {
  try {
    // Log aktivitas
    await ActivityLog.create({
      officerId,
      action,
      target,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

// Mendapatkan daftar semua pelanggan
const getCustomers = async (req, res) => {
  try {
    // Mengambil data pelanggan dari database
    const response = await Customers.findAll({
      attributes: ["uuid", "id", "name", "phone"],
      order: [["createdAt", "DESC"]],
    });

    // Menghitung jumlah total pelanggan
    const totalCustomers = await Customers.count();

    // Mengembalikan data pelanggan dan jumlah total dalam format JSON
    res.status(200).json({
      customers: response,
      totalCustomers: totalCustomers,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Menangani kesalahan server dan memberikan pesan error
  }
};

// Mendapatkan informasi pelanggan berdasarkan UUID
const getCustomerById = async (req, res) => {
  try {
    // Mengambil data pelanggan dari database
    const response = await Customers.findOne({
      attributes: ["uuid", "name", "phone"],
      where: {
        uuid: req.params.id, // Mencocokkan UUID pelanggan dengan nilai parameter ID dari URL
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(response); // Mengembalikan data pelanggan dalam format JSON
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Menangani kesalahan server dan memberikan pesan error
  }
};

// Membuat pelanggan baru
const createCustomer = async (req, res) => {
  const { name, phone } = req.body; // Desktruksi body dari request

  // Menambahkan pelanggan baru ke database
  try {
    // Validasi nomor telepon hanya jika customerPhone terisi
    if (phone && !validator.isMobilePhone(phone, "id-ID")) {
      return res.status(400).json({ msg: "Invalid phone number format" });
    }

    await Customers.create({
      name: name || "Guest",
      phone: phone,
    });

    await logActivity(
      req.officerId,
      "CREATE CUSTOMER",
      `Officer: ${req.roles}`
    );

    res.status(201).json({ msg: "Customer has been registered successfuly!" }); // Memberikan respons sukses
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Menangani kesalahan server dan memberikan pesan kesalahan
  }
};

export { getCustomers, getCustomerById, createCustomer };
