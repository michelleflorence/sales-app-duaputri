import Customers from "../models/CustomerModel.js";

// Mendapatkan daftar semua pelanggan
const getCustomers = async (req, res) => {
  try {
    // Mengambil data pelanggan dari database
    const response = await Customers.findAll({
      attributes: ["uuid", "id", "name", "email", "phone"],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json(response); // Mengembalikan data pelanggan dalam format JSON
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Menangani kesalahan server dan memberikan pesan error
  }
};

// Mendapatkan informasi pelanggan berdasarkan UUID
const getCustomerById = async (req, res) => {
  try {
    // Mengambil data pelanggan dari database
    const response = await Customers.findOne({
      attributes: ["uuid", "name", "email", "phone"],
      where: {
        uuid: req.params.id, // Mencocokkan UUID pelanggan dengan nilai parameter ID dari URL
      },
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json(response); // Mengembalikan data pelanggan dalam format JSON
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Menangani kesalahan server dan memberikan pesan error
  }
};

// Membuat pelanggan baru
const createCustomer = async (req, res) => {
  const { name, email, phone } = req.body; // Desktruksi body dari request

  // Menambahkan pelanggan baru ke database
  try {
    await Customers.create({
      name: name,
      email: email,
      phone: phone,
    });
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
    const { name, email, phone } = req.body;
    await Customers.update(
      { name, email, phone },
      {
        where: {
          id: customer.id,
        },
      }
    );

    console.log(req.body);

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
