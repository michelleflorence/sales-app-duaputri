import Orders from "../models/OrderModel.js";
import Customers from "../models/CustomerModel.js";
import OrderDetails from "../models/OrderDetailModel.js";
import Products from "../models/ProductModel.js";
import Invoices from "../models/InvoiceModel.js";

// Mendapatkan daftar semua pesanan
const getOrders = async (req, res) => {
    try {
        // Menggunakan Sequelize untuk mengambil semua pesanan dari basis data
        const order = await Orders.findAll({
            attributes: ['uuid', 'id', 'totalPrice', 'orderNumber', 'status'], // Mengambil kolom yang diperlukan dari tabel Orders
            include: [{
                model: Customers, // Menggabungkan data dari tabel Customers
                attributes: ['name', 'email', 'phone'] // Hanya mengambil kolom name dan email dari tabel Customers
            },
            {
                model: OrderDetails, // Menggabungkan data dari tabel OrderDetails
                attributes: ['quantity', 'totalPrice'], // Hanya mengambil kolom name dan email dari tabel OrderDetails
                include: [{
                    model: Products, // Menggabungkan data dari tabel Products
                    attributes: ['productName'] // Hanya mengambil kolom name dan email dari tabel Products
                }]
            },
            {
                model: Invoices, // Menggabungkan data dari tabel Invoices
                attributes: ['invoiceDate', 'paymentType'] // Hanya mengambil kolom paymentType dan invoiceDate dari tabel Invoices
            }] 
        });
        res.status(200).json(order); // Mengirimkan respons JSON dengan daftar pesanan dan informasi pelanggan terkait
    } catch (error) {
        res.status(500).json({ msg: error.message }); // Mengirimkan respons kesalahan jika terjadi kesalahan pada server atau basis data
    }
}

// Mendapatkan informasi pesanan berdasarkan ID
const getOrderById = async (req, res) => {
    try {
        // Menggunakan Sequelize untuk mencari pesanan berdasarkan UUID yang diberikan
        const order = await Orders.findOne({
            attributes: ['totalPrice', 'orderNumber', 'status'], // Mengambil kolom yang diperlukan dari tabel Orders
            include: [{
                model: Customers, // Menggabungkan data dari tabel Customers
                attributes: ['name', 'email'] // Hanya mengambil kolom name dan email dari tabel Customers
            },
            {
                model: OrderDetails, // Menggabungkan data dari tabel OrderDetails
                attributes: ['quantity', 'totalPrice'], // Hanya mengambil kolom name dan email dari tabel OrderDetails
                include: [{
                    model: Products, // Menggabungkan data dari tabel Products
                    attributes: ['productName'] // Hanya mengambil kolom name dan email dari tabel Products
                }]
            },
            {
                model: Invoices, // Menggabungkan data dari tabel Invoices
                attributes: ['invoiceDate', 'paymentType'] // Hanya mengambil kolom paymentType dan invoiceDate dari tabel Invoices
            }],
            where: {
                uuid: req.params.id // Mencocokkan pesanan berdasarkan UUID yang diberikan sebagai parameter rute
            }
        })
        res.status(200).json(order); // Mengirimkan respons JSON dengan informasi pesanan dan pelanggan terkait
    } catch (error) {
        res.status(500).json({ msg: error.message }); // Mengirimkan respons kesalahan jika terjadi kesalahan pada server atau basis data
    }
}

// Membuat pesanan baru
const createOrder = async (req, res) => {
    const { customerName, customerEmail, customerPhone, items, paymentType } = req.body;

    try {
        // Memastikan bahwa customerName telah diberikan dan tidak kosong
        if (!customerName) {
            return res.status(400).json({ msg: "Invalid customerName" }); // Mengirimkan respons kesalahan jika customerName tidak valid
        }
        if (!items) {
            return res.status(400).json({ msg: "Invalid items" }); // Mengirimkan respons kesalahan jika items tidak valid
        }

        let customerId = 0;
        // Get current customer
        const customer = await Customers.findOne({
            where: {
                phone: customerPhone,
            }
        });
        
        if (customer){
            customerId = customer.id
        } else {
            try {
                const newCustomer = await Customers.create({
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                });
                customerId = newCustomer.id
            } catch (error) {
                console.error("Error creating new customer:", error);
            }
        }
        
        // Menggunakan Sequelize untuk membuat entri baru dalam tabel Orders
        const orderNumber = Math.random().toString(36).substr(2, 8).toUpperCase();

        // Create Order
        const createdOrder = await Orders.create({
            customerId: customerId,
            totalPrice: 0,
            orderNumber: orderNumber,
            status: 0,
        });
        
        let totalPrice = 0;
        for await (const item of items){
            const product = await Products.findOne({
                where: {
                    uuid: item.uuid,
                }
            });
            if (!product) {
                return res.status(400).json({ msg: `Invalid product with uuid: "${item.uuid}" not found` }); // Mengirimkan respons kesalahan jika products tidak valid
            }

            let itemPrice = item.qty * product.price;

            await OrderDetails.create({
                orderId: createdOrder.id,
                productId: product.id,
                quantity: item.qty,
                price: product.price,
                totalPrice: itemPrice,
            });
            totalPrice = totalPrice + itemPrice;
        }

        await Orders.update({ 
                totalPrice: totalPrice 
            },
            { 
            where: { 
                    id: createdOrder.id 
                } 
            });

        await Invoices.create({
            orderId: createdOrder.id,
            invoiceDate: new Date(),
            price: totalPrice,
            paymentType: paymentType,
        });
        
        // Mengirimkan respons berhasil jika pesanan berhasil dibuat
        res.status(201).json({ msg: "Order has been created successfully!" });
    } catch (error) {
        // Mengirimkan respons kesalahan jika terjadi kesalahan selama pembuatan pesanan
        res.status(500).json({ msg: error.message });
    }
}

const updateOrder = async (req, res) => {
    try {
        // Mencari pesanan berdasarkan UUID dari parameter URL
        const order = await Orders.findOne({
            where: {
                uuid: req.params.id
            }
        });

        // Jika tidak terdapat data dengan id yang dikirimkan pesanan, maka return message pesanan tidak ditemukan
        if (!order) return res.status(404).json({msg: 'Order not found!'})

        // Ambil request body dari variabel order dan update sesuai dengan id di order
        const { status } = req.body;

        const [updatedRowsCount, updatedRows] = await Orders.update({ status }, {
                where: {
                    uuid: order.uuid
                },
                returning: true, // Dapatkan data yang telah diperbarui
            }
        );

        // Periksa apakah ada baris yang diperbarui
        if (updatedRowsCount > 0) {
            res.status(200).json({msg: "Order updated successfully!", updatedRows});
        } else {
            res.status(500).json({msg: "No changes detected or failed to update."});
        }
    } catch (error) {
        // Kembalikan error message
        res.status(500).json({msg: error.message})
    }
}

const deleteOrder = async (req, res) => {
    try {
        // Mencari pesanan berdasarkan UUID dari parameter URL
        const order = await Orders.findOne({
            where: {
                uuid: req.params.id
            }
        });
        
        // Jika tidak terdapat data dengan id yang dikirimkan order, maka return message order tidak ditemukan
        if (!order) return res.status(404).json({msg: 'Order not found!'})

        // Menghapus pesanan berdasarkan UUID
        await Orders.destroy({
            where:{
                uuid: order.uuid
            }
        });

        // Menangani respons sukses setelah menghapus pesanan
        res.status(200).json({msg: "Delete orders successfuly!"});
    } catch (error) {
        // Kembalikan error message
        res.status(500).json({msg: error.message})
    }
}

export {getOrders, getOrderById, createOrder, updateOrder, deleteOrder}