import argon2 from 'argon2';
import Customers from "../models/CustomerModel.js";

export const getCustomers = async (req, res) => {
    try {
        const response = await Customers.findAll({
            attributes: ['uuid', 'name', 'email', 'phone']
        });
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const getCustomerById = async (req, res) => {
    try {
        const response = await Customers.findOne({
            attributes: ['uuid', 'name', 'email', 'phone'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const createCustomer = async (req, res) => {
    const {name, email, phone} = req.body;

    try {
        await Customers.create({
            name: name,
            email: email,
            phone: phone
        });
        res.status(201).json({msg: "Customer has been registered successfuly!"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateCustomer = async (req, res) => {
    try {
        // Check id yang dikirimkan oleh Customer
        const customer = await Customers.findOne({
            where: {
                // Ambil uuid dari parameter
                uuid: req.params.id
            }
        })

        // Jika tidak terdapat data dengan id yang dikirimkan customer, maka return message customer tidak ditemukan
        if (!customer) return res.status(404).json({msg: 'Customer not found!'})

        // Ambil request body dari variabel customer dan update sesuai dengan id di customer
        const {name, email, phone} = req.body;
        await Customers.update({name, email, phone}, {
            where: {
                id: customer.id
            }
        })

        // Jika berhasil update, maka berikan respons message berhasil update
        res.status(200).json({msg: "Updated customers successfuly!"});
    } catch (error) {
        // Kembalikan error message
        res.status(500).json({msg: error.message})
    }
}

export const deleteCustomer = async (req, res) => {
    // Mencari customer berdasarkan ID
    const customer = await Customers.findOne({
        where: {
            uuid: req.params.id
        }
    });

    // Menangani jika customer tidak ditemukan
    if (!customer) return res.status(404).json({msg: "Customer not found!"})
    
    try {
        // Menghapus customer dari basis data
        await Customers.destroy({
            where: {
                id: customer.id
            }
        });
        res.status(200).json({msg: "Customer Deleted!"});
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}