import OrderDetails from '../models/OrderDetailModel.js';
import Orders from '../models/OrderModel.js';
import Products from '../models/ProductModel.js';

const getOrderDetails = async (req, res) => { 
     try {
        // Menggunakan Sequelize untuk mengambil semua pesanan dari basis data
        const order_details = await OrderDetails.findAll({
            attributes: ['uuid', 'quantity', 'price', 'totalPrice'], // Mengambil kolom yang diperlukan dari tabel Orders
            include: [
                {
                    model: Orders,
                    attributes: ['orderNumber', 'status']
                },
                {
                    model: Products,
                    attributes: ['productName'] 
                }
            ], 
            order: [['createdAt', 'ASC']],
        });
        res.status(200).json(order_details)
     } catch (error) {
        res.status(500).json({ msg: error.message })
     }
}

// Mendapatkan informasi pesanan berdasarkan ID
const getOrderDetailById = async (req, res) => {
    try {
        // Menggunakan Sequelize untuk mencari pesanan berdasarkan UUID yang diberikan
        const order_details = await OrderDetails.findOne({
            attributes: ['quantity', 'price', 'totalPrice'], 
            include: [
                {
                    model: Orders,
                    attributes: ['orderNumber', 'status']
                },
                {
                    model: Products,
                    attributes: ['productName'] 
                }
            ],
            where: {
                uuid: req.params.id // Mencocokkan pesanan berdasarkan UUID yang diberikan sebagai parameter rute
            }
        })
        res.status(200).json(order_details); // Mengirimkan respons JSON dengan informasi pesanan dan pelanggan terkait
    } catch (error) {
        res.status(500).json({ msg: error.message }); // Mengirimkan respons kesalahan jika terjadi kesalahan pada server atau basis data
    }
}

const createOrderDetails = async (req, res) => {
    const { orderId, productId, quantity } = req.body;

    try {
        let totalPrice = 0;
        const product = await Products.findOne({
            where: {
                id: productId, // Menggunakan productId yang telah didefinisikan sebelumnya
            }
        });

        if (!product) {
            return res.status(400).json({ msg: `Invalid product with uuid: "${productId}" not found` });
        }

        let itemPrice = quantity * product.price;

        // Menyimpan OrderDetails baru
        await OrderDetails.create({
            orderId: orderId,
            productId: productId,
            quantity: quantity,
            price: product.price,
            totalPrice: itemPrice,
        });
        totalPrice = totalPrice + itemPrice;

        // Mengirimkan respons berhasil jika pesanan berhasil dibuat
        res.status(201).json({ msg: "Order Details has been created successfully!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const updateOrderDetails = async (req, res) => {
    try {
        // Mencari pesanan berdasarkan UUID dari parameter URL
        const order_details = await OrderDetails.findOne({
            where: {
                uuid: req.params.id
            }
        });

        // Jika tidak terdapat data dengan id yang dikirimkan pesanan, maka return message pesanan tidak ditemukan
        if (!order_details) return res.status(404).json({msg: 'Order Details not found!'})

        // Ambil request body dari variabel order dan update sesuai dengan id di order
        const { orderId, productId, quantity, price, totalPrice } = req.body;

        const [updatedRowsCount, updatedRows] = await OrderDetails.update({ orderId, productId, quantity, price, totalPrice }, 
        {
            where: {
                uuid: order_details.uuid
            },
            returning: true, // Dapatkan data yang telah diperbarui
        });

        // Periksa apakah ada baris yang diperbarui
        if (updatedRowsCount > 0) {
            res.status(200).json({msg: "Order Details updated successfully!", updatedRows});
        } else {
            res.status(500).json({msg: "No changes detected or failed to update."});
        }

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const deleteOrderDetails = async (req, res) => {
    try {
        // Mencari pesanan berdasarkan UUID dari parameter URL
        const order_details = await OrderDetails.findOne({
            where: {
                uuid: req.params.id
            }
        });

        // Jika tidak terdapat data dengan id yang dikirimkan order, maka return message order tidak ditemukan
        if (!order_details) return res.status(404).json({msg: 'Order Details not found!'})

        // Menghapus pesanan berdasarkan UUID
        await OrderDetails.destroy({
            where:{
                uuid: order_details.uuid
            }
        });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export {getOrderDetails, getOrderDetailById, createOrderDetails, updateOrderDetails, deleteOrderDetails}