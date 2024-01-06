import Product from "../models/ProductModel.js";
import Officer from "../models/OfficerModel.js";
import ActivityLog from "../models/ActivityLogModel.js";

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

const getProducts = async (req, res) => {
  try {
    const response = await Product.findAll({
      attributes: ["id", "uuid", "productName", "price", "images", "status"],
      include: [
        {
          model: Officer,
          attributes: ["name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    res.status(200).json(totalProducts);
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

    // Jika data ditemukan, check apakah login sebagai admin utk bisa liat product dengan id yang dicari
    let response;
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
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createProduct = async (req, res) => {
  const { productName, price, status } = req.body;

  try {
    // Periksa apakah pengguna yang melakukan request adalah admin
    if (req.roles === "admin") {
      let imagePath = "";

      // Jika terdapat file gambar dalam request, ambil path gambar yang telah dinormalisasi
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

      // Buat entri produk baru dalam database
      await Product.create({
        productName,
        price,
        images: imagePath || null,
        status,
        officerId: req.officerId,
      });

      // Log aktivitas pembuatan produk
      await logActivity(
        req.officerId,
        "CREATE PRODUCT",
        `Officer: ${req.roles}`
      );

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

    // Periksa apakah pengguna yang melakukan request adalah admin
    if (req.roles === "admin") {
      // let imagePath = "";
      // if (req.file) {
      //   imagePath = req.normalizedImagePath;
      // }

      await Product.update(
        { productName, price, status },
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

    await logActivity(req.officerId, "UPDATE PRODUCT", `Officer: ${req.roles}`);

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

    // Periksa apakah pengguna yang melakukan request adalah admin
    if (req.roles === "admin") {
      await Product.destroy({
        where: {
          id: product.id,
        },
      });
    } else {
      // Apabila bukan admin, maka return response bahwa update tidak dapat dilakukan / dilarang
      if (req.officerId !== product.officerId)
        return res.status(403).json({ msg: "Access has been denied!" });
    }

    await logActivity(req.officerId, "DELETE PRODUCT", `Officer: ${req.roles}`);

    res.status(200).json({ msg: "Product deleted successfuly" });
  } catch (error) {
    // Kembalikan error message
    res.status(500).json({ msg: error.message });
  }
};

export {
  getProducts,
  getTotalProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
