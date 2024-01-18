import Orders from "../models/OrderModel.js";
import Customers from "../models/CustomerModel.js";
import OrderDetails from "../models/OrderDetailModel.js";
import Products from "../models/ProductModel.js";
import Invoices from "../models/InvoiceModel.js";
import ActivityLog from "../models/ActivityLogModel.js";
import validator from "validator";
import db from "../config/Database.js";
import { Sequelize } from "sequelize";

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

// Mendapatkan daftar semua pesanan
const getOrders = async (req, res) => {
  try {
    // Menggunakan Sequelize untuk mengambil semua pesanan dari basis data
    const order = await Orders.findAll({
      attributes: ["uuid", "id", "totalPrice", "orderNumber"], // Mengambil kolom yang diperlukan dari tabel Orders
      include: [
        {
          model: Customers, // Menggabungkan data dari tabel Customers
          attributes: ["name", "phone"], // Hanya mengambil kolom name dan phone dari tabel Customers
        },
        {
          model: OrderDetails, // Menggabungkan data dari tabel OrderDetails
          attributes: ["quantity", "totalPrice"], // Hanya mengambil kolom quantity dan totalPrice dari tabel OrderDetails
          include: [
            {
              model: Products, // Menggabungkan data dari tabel Products
              attributes: ["productName"], // Hanya mengambil kolom productName dari tabel Products
            },
          ],
        },
        {
          model: Invoices, // Menggabungkan data dari tabel Invoices
          attributes: ["invoiceDate", "paymentType"], // Hanya mengambil kolom paymentType dan invoiceDate dari tabel Invoices
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(order); // Mengirimkan respons JSON dengan daftar pesanan dan informasi pelanggan terkait
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Mengirimkan respons kesalahan jika terjadi kesalahan pada server atau basis data
  }
};

// Mendapatkan informasi pesanan berdasarkan ID
const getOrderById = async (req, res) => {
  try {
    // Menggunakan Sequelize untuk mencari pesanan berdasarkan UUID yang diberikan
    const order = await Orders.findOne({
      attributes: ["uuid", "totalPrice", "orderNumber"], // Mengambil kolom yang diperlukan dari tabel Orders
      include: [
        {
          model: Customers, // Menggabungkan data dari tabel Customers
          attributes: ["name", "phone", "uuid"], // Hanya mengambil kolom tertentu dari Customers
        },
        {
          model: OrderDetails, // Menggabungkan data dari tabel OrderDetails
          attributes: ["quantity", "totalPrice"], // Hanya mengambil kolom quantity dan totalPrice dari tabel OrderDetails
          include: [
            {
              model: Products, // Menggabungkan data dari tabel Products
              attributes: ["productName"], // Hanya mengambil kolom productname dari tabel Products
            },
          ],
        },
        {
          model: Invoices, // Menggabungkan data dari tabel Invoices
          attributes: ["invoiceDate", "paymentType"], // Hanya mengambil kolom paymentType dan invoiceDate dari tabel Invoices
        },
      ],
      where: {
        uuid: req.params.id, // Mencocokkan pesanan berdasarkan UUID yang diberikan sebagai parameter rute
      },
    });
    res.status(200).json(order); // Mengirimkan respons JSON dengan informasi pesanan dan pelanggan terkait
  } catch (error) {
    res.status(500).json({ msg: error.message }); // Mengirimkan respons kesalahan jika terjadi kesalahan pada server atau basis data
  }
};

// Membuat pesanan baru
const createOrder = async (req, res) => {
  const { customerName, customerPhone, items, paymentType } = req.body;

  try {
    // Mendapatkan ID pelanggan berdasarkan nomor telepon
    let customerId = 0;
    const customer = await Customers.findOne({
      where: {
        phone: customerPhone,
      },
    });

    // Jika pelanggan sudah ada, gunakan ID yang sudah ada
    if (customer) {
      customerId = customer.id;
    } else {
      try {
        // Validasi nomor telepon hanya jika customerPhone terisi
        if (customerPhone && !validator.isMobilePhone(customerPhone, "id-ID")) {
          return res.status(400).json({ msg: "Invalid phone number format" });
        }

        // Jika pelanggan belum ada, buat pelanggan baru
        const newCustomer = await Customers.create({
          name: customerName || "Guest",
          phone: customerPhone,
        });
        customerId = newCustomer.id;
      } catch (error) {
        console.error("Error creating new customer:", error);
      }
    }

    // Membuat nomor pesanan secara acak
    const orderNumber = Math.random().toString(36).substr(2, 8).toUpperCase();

    // Memeriksa apakah pengguna memiliki peran "kasir"
    if (req.roles === "kasir") {
      // Membuat entri baru dalam tabel Orders
      const createdOrder = await Orders.create({
        customerId: customerId,
        totalPrice: 0,
        orderNumber: orderNumber,
      });

      let totalPrice = 0;

      // Iterasi melalui setiap item dalam pesanan
      for await (const item of items) {
        // Mengambil data produk yang sesuai dengan UUID
        const product = await Products.findOne({
          where: {
            uuid: item.uuid,
          },
        });
        // Memastikan produk dengan UUID tertentu ditemukan
        if (!product) {
          return res.status(400).json({
            msg: `Invalid product with uuid: "${item.uuid}" not found`,
          });
        }

        // Menghitung harga total untuk setiap item
        let itemPrice = item.qty * product.price;

        // Membuat entri baru dalam tabel OrderDetails
        await OrderDetails.create({
          orderId: createdOrder.id,
          productId: product.id,
          quantity: item.qty,
          price: product.price,
          totalPrice: itemPrice,
        });
        // Memperbarui total price
        totalPrice = totalPrice + itemPrice;
      }

      // Memperbarui total harga pesanan di tabel Orders
      await Orders.update(
        {
          totalPrice: totalPrice,
        },
        {
          where: {
            id: createdOrder.id,
          },
        }
      );

      // Membuat entri baru dalam tabel Invoices
      await Invoices.create({
        orderId: createdOrder.id,
        invoiceDate: new Date(),
        price: totalPrice,
        paymentType: paymentType,
      });

      await logActivity(req.officerId, "CREATE ORDER", `Officer: ${req.roles}`);

      // Mengirimkan respons berhasil jika pesanan berhasil dibuat
      res.status(201).json({
        msg: "Order has been created successfully!",
        uuid: createdOrder.uuid, // Menyertakan uuid dalam respons
      });
    } else {
      // Mengirimkan respons akses ditolak jika pengguna bukan "kasir"
      return res.status(403).json({ msg: "Access has been denied!" });
    }
  } catch (error) {
    // Mengirimkan respons kesalahan jika terjadi kesalahan selama pembuatan pesanan
    res.status(500).json({ msg: error.message });
  }
};

const getIncomeChart = async (req, res) => {
  try {
    // Ambil data pesanan dari tabel Orders
    const orders = await Orders.findAll({
      attributes: [
        // Hitung tanggal pembuatan pesanan dengan interval harian
        // Gunakan '\\' jika nama kolom mengandung karakter khusus atau spasi
        [Sequelize.literal("DATE_TRUNC('day', \"createdAt\")"), "x"],

        // Hitung total pendapatan dan bulatkan ke bawah
        [Sequelize.literal('FLOOR(SUM("totalPrice"))'), "y"],
      ],
      // Gunakan '\\' jika nama kolom mengandung karakter khusus atau spasi
      group: [Sequelize.literal("DATE_TRUNC('day', \"createdAt\")")], // Kelompokkan hasil berdasarkan tanggal
      order: [Sequelize.literal("DATE_TRUNC('day', \"createdAt\")")], // Urutkan hasil berdasarkan tanggal
    });

    // Ubah format data agar sesuai untuk grafik
    const mappedData = orders.map((order) => {
      // Pastikan order.x terdefinisi sebelum mengakses propertinya
      const xValue = order.getDataValue("x").toISOString().split("T")[0];

      return {
        x: xValue, // Tanggal pesanan
        y: order.getDataValue("y"), // Total pendapatan
      };
    });

    // Kirim respons dengan status 200 dan data pendapatan harian dalam format JSON
    res.status(200).json(mappedData);
  } catch (error) {
    // Jika ada kesalahan, kirim respons status 500 dan pesan kesalahan
    res.status(500).json({ msg: error.message });
  }
};

// Ambil data pembayaran untuk membuat grafik.
const getPaymentChart = async (req, res) => {
  try {
    // Ambil data pembayaran dari tabel Invoices
    const paymentData = await Invoices.findAll({
      attributes: [
        ["paymentType", "x"], // Map paymentType ke x untuk sumbu x grafik
        [
          Sequelize.fn("FLOOR", Sequelize.fn("SUM", Sequelize.col("price"))),
          "y", // Total harga, map ke y untuk sumbu y grafik
        ],
      ],
      group: ["paymentType"], // Kelompokkan hasil berdasarkan paymentType
    });

    // Kirim respons dengan status 200 dan data pembayaran dalam format JSON
    res.status(200).json(paymentData);
  } catch (error) {
    // Jika ada kesalahan, kirim respons status 500 dan pesan kesalahan
    res.status(500).json({ msg: error.message });
  }
};

const getTotalIncome = async (req, res) => {
  try {
    const totalIncome = await Orders.sum("totalPrice");
    res.status(200).json({ totalIncome });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Orders.count();
    res.status(200).json({ totalOrders });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// const getIncomeChart = async (req, res) => {
//   try {
//     // Menggunakan Sequelize untuk mengambil semua pesanan dari basis data
//     const order = await db.query(
//       `SELECT DATE_TRUNC('day', "createdAt") as x, FLOOR(SUM("totalPrice")) as y FROM ORDERS GROUP BY x ORDER BY x asc`
//     );
//     const mappedData = order[0].map((value) => {
//       return {
//         x: new Date(value.x).toISOString().split("T")[0],
//         y: value.y,
//       };
//     });
//     res.status(200).json(mappedData); // Mengirimkan respons JSON dengan daftar pesanan dan informasi pelanggan terkait
//   } catch (error) {
//     res.status(500).json({ msg: error.message }); // Mengirimkan respons kesalahan jika terjadi kesalahan pada server atau basis data
//   }
// };

// const getPaymentChart = async (req, res) => {
//   try {
//     // Menggunakan Sequelize untuk mengambil semua pesanan dari basis data
//     const invoices = await db.query(
//       `SELECT "paymentType" as x, FLOOR(SUM("price")) as y FROM invoices GROUP BY "paymentType"`
//     );
//     res.status(200).json(invoices[0]); // Mengirimkan respons JSON dengan daftar pesanan dan informasi pelanggan terkait
//   } catch (error) {
//     res.status(500).json({ msg: error.message }); // Mengirimkan respons kesalahan jika terjadi kesalahan pada server atau basis data
//   }
// };

export {
  getOrders,
  getOrderById,
  getIncomeChart,
  getPaymentChart,
  getTotalIncome,
  getTotalOrders,
  createOrder,
};
