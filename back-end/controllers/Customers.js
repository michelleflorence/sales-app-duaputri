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

// Fungsi untuk memperbarui informasi pelanggan berdasarkan UUID
const updateCustomer = async (req, res) => {
  try {
    // Mencari pelanggan berdasarkan UUID dari parameter URL
    const customer = await Customers.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    // Jika tidak terdapat data dengan id yang dikirimkan customer, maka return message customer tidak ditemukan
    if (!customer) return res.status(404).json({ msg: "Customer not found!" });

    // Ambil request body dari variabel customer dan update sesuai dengan id di customer
    const { name, phone } = req.body;

    // Validasi nomor telepon hanya jika customerPhone terisi
    if (phone && !validator.isMobilePhone(phone, "id-ID")) {
      return res.status(400).json({ msg: "Invalid phone number format" });
    }

    await Customers.update(
      {
        name: name || "Guest",
        phone: phone,
      },
      {
        where: {
          id: customer.id,
        },
      }
    );

    await logActivity(
      req.officerId,
      "UPDATE CUSTOMER",
      `Officer: ${req.roles}`
    );

    // Jika berhasil update, maka berikan respons message berhasil update
    res.status(200).json({ msg: "Updated customers successfuly!" });
  } catch (error) {
    // Kembalikan error message
    res.status(500).json({ msg: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  // Mencari pelanggan berdasarkan UUID dari parameter URL
  const customer = await Customers.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  // Menangani jika customer tidak ditemukan
  if (!customer) return res.status(404).json({ msg: "Customer not found!" });

  try {
    // Menghapus customer dari basis data
    await Customers.destroy({
      where: {
        id: customer.id,
      },
    });

    await logActivity(
      req.officerId,
      "DELETE CUSTOMER",
      `Officer: ${req.roles}`
    );

    res.status(200).json({ msg: "Customer Deleted!" });
  } catch (error) {
    // Kembalikan error message
    res.status(400).json({ msg: error.message });
  }
};

export {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
