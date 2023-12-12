import Orders from "../models/OrderModel.js";
import Customers from "../models/CustomerModel.js";

// Mendapatkan daftar semua pesanan
export const getOrders = async (req, res) => {
    try {
        const order = await Orders.findAll({
            attributes: ['uuid', 'totalPrice', 'orderNumber', 'status'],
            include: [{
                model: Customers,
                attributes: ['name', 'email']
            }]
        });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Mendapatkan informasi pesanan berdasarkan ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Orders.findOne({
            attributes: ['totalPrice', 'orderNumber', 'status'],
            include: [{
                model: Customers,
                attributes: ['name', 'email']
            }],
            where: {
                uuid: req.params.id
            }
        })
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createOrder = async (req, res) => {
    const { customerId, totalPrice, orderNumber, status } = req.body;

    try {
        // Pastikan req.customerId sudah terdefinisi
        if (!customerId) {
            return res.status(400).json({ msg: "Invalid customerId" });
        }

        await Orders.create({
            customerId: customerId,
            totalPrice: totalPrice,
            orderNumber: orderNumber,
            status: status,
        });
        console.log(Orders)
        res.status(201).json({ msg: "Order has been created successfully!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateOrder = async (req, res) => {
    try {
        // Check id yang dikirimkan oleh Tabel Order
        const order = await Orders.findOne({
            where: {
                // Ambil uuid dari parameter
                uuid: req.params.id
            }
        });

        // Jika tidak terdapat data dengan id yang dikirimkan order, maka return message order tidak ditemukan
        if (!order) return res.status(404).json({msg: 'Order not found!'})

        // Ambil request body dari variabel order dan update sesuai dengan id di order
        const {totalPrice, orderNumber, status} = req.body;

        const [updatedRowsCount, updatedRows] = await Orders.update({ totalPrice, orderNumber, status }, {
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

export const deleteOrder = async (req, res) => {
    try {
        // Check id yang dikirimkan oleh Tabel Order
        const order = await Orders.findOne({
            where: {
                // Ambil uuid dari parameter
                uuid: req.params.id
            }
        });
        
        // Jika tidak terdapat data dengan id yang dikirimkan order, maka return message order tidak ditemukan
        if (!order) return res.status(404).json({msg: 'Order not found!'})

        await Orders.destroy({
            where:{
                uuid: order.uuid
            }
        });

        // Jika berhasil update, maka berikan respons message berhasil update
        res.status(200).json({msg: "Delete orders successfuly!"});
    } catch (error) {
        // Kembalikan error message
        res.status(500).json({msg: error.message})
    }
}