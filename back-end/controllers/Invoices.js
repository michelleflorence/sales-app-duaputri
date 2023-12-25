import Orders from "../models/OrderModel.js";
import Invoices from '../models/InvoiceModel.js';

const getInvoices = async (req, res) => {
    try {
        // Menggunakan Sequelize untuk mengambil semua pembayaran dari basis data
        const invoice = await Invoices.findAll({
            attributes: ['uuid', 'invoiceDate', 'price', 'paymentType'], 
            include: [{
                model: Orders, 
                attributes: ['orderNumber', 'status'] 
            }] 
        });
        res.status(200).json(invoice); // Mengirimkan respons JSON dengan daftar pembayaran dan informasi pelanggan terkait
    } catch (error) {
        res.status(500).json({ msg: error.message }); // Mengirimkan respons kesalahan jika terjadi kesalahan pada server atau basis data
    }
}

const getInvoiceById = async (req, res) => {
    try {
        // Menggunakan Sequelize untuk mencari pembayaran berdasarkan UUID yang diberikan
        const invoice = await Invoices.findAll({
            attributes: ['uuid', 'invoiceDate', 'price', 'paymentType'], // Mengambil kolom yang diperlukan dari tabel Invoices
            include: [{
                model: Orders, // Menggabungkan data dari tabel Orders
                attributes: ['orderNumber', 'status'] // Hanya mengambil kolom tertentu dari tabel Orders
            }],
            where: {
                uuid: req.params.id // Mencocokkan pembayaran berdasarkan UUID yang diberikan sebagai parameter rute
            }
        })
        res.status(200).json(invoice); // Mengirimkan respons JSON dengan informasi pembayaran dan pelanggan terkait
    } catch (error) {
        res.status(500).json({ msg: error.message }); // Mengirimkan respons kesalahan jika terjadi kesalahan pada server atau basis data
    }
}

const createInvoice = async (req, res) => {
    const { orderId, invoiceDate, price, paymentType } = req.body;

    try {
        // Memastikan bahwa orderId telah diberikan dan tidak kosong
        if (!orderId) {
            return res.status(400).json({ msg: "Invalid orderId" }); // Mengirimkan respons kesalahan jika orderId tidak valid
        }

        // Menggunakan Sequelize untuk membuat entri baru dalam tabel Invoices
        await Invoices.create({
            orderId: orderId,
            invoiceDate: invoiceDate,
            price: price,
            paymentType: paymentType,
        });
        
        // Mengirimkan respons berhasil jika pembayaran berhasil dibuat
        res.status(201).json({ msg: "Invoices has been created successfully!" });
    } catch (error) {
        res.status(500).json({ msg: error.message }); // Mengirimkan respons kesalahan jika terjadi kesalahan pada server atau basis data
    }
}

const updateInvoice = async (req, res) => {
    try {
        // Mencari pembayaran berdasarkan UUID dari parameter URL
        const invoice = await Invoices.findOne({
            where: {
                uuid: req.params.id
            }
        });

        // Jika tidak terdapat data dengan id yang dikirimkan pembayaran, maka return message pembayaran tidak ditemukan
        if (!invoice) return res.status(404).json({msg: 'Invoices not found!'})

        // Ambil request body dari variabel invoice dan update sesuai dengan id di invoice
        const { invoiceDate, price, paymentType } = req.body;

        const [updatedRowsCount, updatedRows] = await Invoices.update({ invoiceDate, price, paymentType }, {
                where: {
                    uuid: invoice.uuid
                },
                returning: true, // Dapatkan data yang telah diperbarui
            }
        );

        // Periksa apakah ada baris yang diperbarui
        if (updatedRowsCount > 0) {
            res.status(200).json({msg: "Invoices updated successfully!", updatedRows});
        } else {
            res.status(500).json({msg: "No changes detected or failed to update."});
        }
    } catch (error) {
        // Kembalikan error message
        res.status(500).json({msg: error.message})
    }
}

const deleteInvoice = async (req, res) => {
    try {
        // Mencari pembayaran berdasarkan UUID dari parameter URL
        const order = await Invoices.findOne({
            where: {
                uuid: req.params.id
            }
        });
        
        // Jika tidak terdapat data dengan id yang dikirimkan invoice, maka return message invoice tidak ditemukan
        if (!order) return res.status(404).json({msg: 'Invoice not found!'})

        // Menghapus pembayaran berdasarkan UUID
        await Invoices.destroy({
            where:{
                uuid: order.uuid
            }
        });

        // Menangani respons sukses setelah menghapus pembayaran
        res.status(200).json({msg: "Delete invoices successfuly!"});
    } catch (error) {
        // Kembalikan error message
        res.status(500).json({msg: error.message})
    }
}

export {getInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice}
