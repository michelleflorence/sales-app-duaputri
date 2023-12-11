import Orders from "../models/OrderModel.js";
import Customers from "../models/CustomerModel.js";

// Mendapatkan daftar semua pesanan
export const getOrders = async (req, res) => {
    try {
        const order = await Orders.findAll({
            attributes: ['totalPrice', 'orderNumber', 'status']
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

    // Validasi: Pastikan customerId adalah UUID yang valid dan ada dalam basis data Customers
    const isValidCustomer = await Customers.findOne({
        where: {
            uuid: customerId
        }
    });

    if (!isValidCustomer) {
        return res.status(400).json({ msg: "Invalid customerId" });
    }

    try {
        // Menyimpan pesanan baru ke basis data
        await Orders.create({
            customerId: customerId,
            totalPrice: totalPrice,
            orderNumber: orderNumber,
            status: status
        });
        res.status(201).json({ msg: "Order has been created successfully!" });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateOrder = async (req, res) => {

}

export const deleteOrder = async (req, res) => {

}