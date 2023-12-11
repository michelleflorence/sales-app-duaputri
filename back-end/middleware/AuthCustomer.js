import Customers from "../models/CustomerModel.js";

export const verifyCustomer = async (req, res) => {
    // Cari officer berdasarkan uuid 
    const customer = await Customers.findOne({
        where: {
            uuid: customer.uuid
        }
    });

    // Menyimpan data officer pada objek req untuk digunakan pada middleware selanjutnya
    req.customer = customer;

    req.customerId = customer.id;
}