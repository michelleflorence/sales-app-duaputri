import Product from "../models/ProductModel.js";
import Officer from "../models/OfficerModel.js";

const getProducts = async (req, res) => {
  try {
    // Jika officer login sebagai koki, maka bisa lihat semua data product
    let response;
    if (req.roles === "koki") {
      response = await Product.findAll({
        attributes: ["id", "uuid", "productName", "price", "images", "status"],
        include: [
          {
            model: Officer,
            attributes: ["name", "email"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      // Jika bukan sebagai koki, maka hanya bisa melihat product dengan info yang terbatas
    } else {
      response = await Product.findAll({
        attributes: ["id", "productName", "price", "images", "status"],
        order: [["createdAt", "ASC"]],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    // Check id yang dikirimkan oleh Officer
    const product = await Product.findOne({
      where: {
        // Ambil uuid dari parameter
        uuid: req.params.id,
      },
    });

    // Jika tidak terdapat data dengan id yang dikirimkan user, maka berikan response produk tidak ditemukan
    if (!product) return res.status(404).json({ msg: "Product not found!" });

    // Jika data ditemukan, check apakah login sebagai koki utk bisa liat product dengan id yang dicari
    let response;
    if (req.roles === "koki") {
      response = await Product.findOne({
        attributes: ["uuid", "productName", "price", "images", "status"],
        where: {
          id: product.id,
        },
        include: [
          {
            model: Officer,
            attributes: ["name", "email"],
          },
        ],
      });

      // Jika bukan sebagai koki, maka hanya bisa melihat product dengan info yang terbatas
    } else {
      response = await Product.findOne({
        attributes: ["productName", "price", "images", "status"],
        where: {
          id: product.id,
        },
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createProduct = async (req, res) => {
  const { productName, price, status } = req.body;

  try {
    if (req.roles === "koki") {
      let imagePath = "";
      if (req.file) {
        imagePath = req.normalizedImagePath;
      }

      // Perbarui validasi untuk productName, price, dan images
      if (!productName || productName.length === 0) {
        return res.status(400).json({ msg: "Product name is required." });
      }

      if (!price || isNaN(price)) {
        return res.status(400).json({ msg: "Price must be a valid number." });
      }

      if (!req.file) {
        return res.status(400).json({ msg: "Image is required." });
      }

      await Product.create({
        productName,
        price,
        images: imagePath,
        status,
        officerId: req.officerId,
      });

      res.status(201).json({ msg: "Product has created successfully!" });
    } else {
      return res.status(403).json({ msg: "Access has been denied!" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!product) return res.status(404).json({ msg: "Product not found!" });

    const { productName, price, status } = req.body;
    if (req.roles === "koki") {
      let imagePath = "";
      if (req.file) {
        imagePath = req.normalizedImagePath;
      }

      await Product.update(
        { productName, price, status, images: imagePath },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      if (req.officerId !== product.officerId)
        return res.status(403).json({ msg: "Access has been denied!" });
    }

    res.status(200).json({ msg: "Updated product successfully!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    // Check id yang dikirimkan oleh Officer
    const product = await Product.findOne({
      where: {
        // Ambil uuid dari parameter
        uuid: req.params.id,
      },
    });

    // Jika tidak terdapat produk dengan id yang dikirimkan user, return message produk tidak ditemukan
    if (!product) return res.status(404).json({ msg: "Product not found!" });

    if (req.roles === "koki") {
      await Product.destroy({
        where: {
          id: product.id,
        },
      });
    } else {
      // Apabila bukan koki, maka return response bahwa update tidak dapat dilakukan / dilarang
      if (req.officerId !== product.officerId)
        return res.status(403).json({ msg: "Access has been denied!" });
    }
    res.status(200).json({ msg: "Product deleted successfuly" });
  } catch (error) {
    // Kembalikan error message
    res.status(500).json({ msg: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

// Untuk nambah operator buat di where
// where: {
//     [Op.and]:[{id: product.id}, {officerId: req.officerId}]
// }
