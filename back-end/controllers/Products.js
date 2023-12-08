import Product from '../models/ProductModel.js';
import Officer from '../models/OfficerModel.js';

export const getProducts = async (req, res) => {
    try {
        // Jika officer login sebagai koki, maka bisa lihat semua data product
        let response;
        if (req.roles === "koki") {
            response = await Product.findAll({
                attributes: ['uuid', 'productName', 'price', 'images', 'status'],
                include: [{
                    model: Officer,
                    attributes: ['name', 'email']
                }]
            })
        
        // Jika bukan sebagai koki, maka hanya bisa melihat product dengan info yang terbatas
        } else {
            response = await Product.findAll({
                attributes: ['productName', 'price', 'images', 'status'],
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const getProductById = async (req, res) => {
    try {
        // Check id yang dikirimkan oleh Officer
        const product = await Product.findOne({
            where: {
                // Ambil uuid dari parameter
                uuid: req.params.id
            }
        })

        // Jika tidak terdapat data dengan id yang dikirimkan user, maka berikan response produk tidak ditemukan
        if (!product) return res.status(404).json({msg: 'Product not found!'})

        // Jika data ditemukan, check apakah login sebagai koki utk bisa liat product dengan id yang dicari
        let response;
        if (req.roles === "koki") {
            response = await Product.findOne({
                attributes: ['uuid', 'productName', 'price', 'images', 'status'],
                where: {
                    id: product.id
                },
                include: [{
                    model: Officer,
                    attributes: ['name', 'email']
                }]
            })
        
        // Jika bukan sebagai koki, maka hanya bisa melihat product dengan info yang terbatas
        } else {
            response = await Product.findOne({
                attributes: ['productName', 'price', 'images', 'status'],
                where: {
                    id: product.id
                }
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const createProduct = async (req, res) => {
    // Destruct request body
    const {productName, price, images, status} = req.body;

    try {
        // Status 0 = available, 1 = empty
        await Product.create({
            productName: productName,
            price: price,
            images: images,
            status: status,
            officerId: req.officerId
        });
        res.status(201).json({msg: "Product has created successfuly!"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateProduct = async (req, res) => {
    try {
        // Check id yang dikirimkan oleh Officer
        const product = await Product.findOne({
            where: {
                // Ambil uuid dari parameter
                uuid: req.params.id
            }
        })

        // Jika tidak terdapat data dengan id yang dikirimkan user, maka return message produk tidak ditemukan
        if (!product) return res.status(404).json({msg: 'Product not found!'})

        // Jika data ditemukan, check apakah login sebagai koki
        // Kalau iya, ambil request body dari variabel product dan update sesuai dengan id di product
        const {productName, price, images, status} = req.body;
        if (req.roles === "koki") {
            await Product.update({productName, price, images, status}, {
                where: {
                    id: product.id
                }
            })
        } else {
            // Apabila bukan koki, maka return response bahwa update tidak dapat dilakukan / dilarang
            if(req.officerId !== product.officerId) return res.status(403).json({msg: "Access has been denied!"})
        }

        // Jika berhasil update, maka berikan respons message berhasil update
        res.status(200).json({msg: "Updated products successfuly!"});
    } catch (error) {
        // Kembalikan error message
        res.status(500).json({msg: error.message})
    }
}

export const deleteProduct = async (req, res) => {
    try {
        // Check id yang dikirimkan oleh Officer
        const product = await Product.findOne({
            where: {
                // Ambil uuid dari parameter
                uuid: req.params.id
            }
        });

        // Jika tidak terdapat produk dengan id yang dikirimkan user, return message produk tidak ditemukan
        if (!product) return res.status(404).json({msg: "Product not found!"});
        
        if (req.role === "koki") {
            await Product.destroy({
                where:{
                    id: product.id
                }
            });
        } else {
            // Apabila bukan koki, maka return response bahwa update tidak dapat dilakukan / dilarang
            if(req.officerId !== product.officerId) return res.status(403).json({msg: "Access has been denied!"});
        }
        res.status(200).json({msg: "Product deleted successfuly"});
    } catch (error) {
        // Kembalikan error message
        res.status(500).json({msg: error.message});
    }
}

// Untuk nambah operator buat di where
// where: {
//     [Op.and]:[{id: product.id}, {officerId: req.officerId}]
// }