import Officer from "../models/OfficerModel.js";
import ActivityLog from "../models/ActivityLogModel.js";
import argon2 from "argon2";

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

// Mendapatkan daftar semua petugas
const getOfficers = async (req, res) => {
  try {
    const response = await Officer.findAll({
      attributes: ["uuid", "name", "email", "roles"],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Mendapatkan informasi petugas berdasarkan ID
const getOfficerById = async (req, res) => {
  try {
    const response = await Officer.findOne({
      attributes: ["uuid", "name", "email", "roles"],
      where: {
        uuid: req.params.id,
      },
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Membuat petugas baru
const createOfficer = async (req, res) => {
  const { name, email, password, confPassword, roles } = req.body;

  // Memeriksa kesesuaian kata sandi
  if (password !== confPassword)
    return res.status(400).json({ msg: "Password not match!" });

  // Menghash kata sandi sebelum menyimpan ke basis data
  const hashPassword = await argon2.hash(password);

  try {
    // Menyimpan petugas baru ke basis data
    await Officer.create({
      name: name,
      email: email,
      password: hashPassword,
      roles: roles,
    });

    // Log aktivitas tambah petugas
    await logActivity(req.officerId, "CREATE OFFICER", `Officer: ${req.roles}`);

    res.status(201).json({ msg: "Officer has created successfully!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Memperbarui informasi petugas
const updateOfficer = async (req, res) => {
  // Mencari petugas berdasarkan ID
  const officer = await Officer.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  // Menangani jika petugas tidak ditemukan
  if (!officer) return res.status(404).json({ msg: "Officer not found!" });

  const { name, email, password, confPassword, roles } = req.body;
  let hashPassword;

  // Mengecek apakah ada perubahan kata sandi
  if (password === "" || password === null) {
    hashPassword = officer.password;
  } else {
    hashPassword = await argon2.hash(password);
  }

  // Memeriksa kesesuaian kata sandi
  if (password !== confPassword)
    return res.status(400).json({ msg: "Password not match!" });
  try {
    // Memperbarui informasi petugas di basis data
    await Officer.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        roles: roles,
      },
      {
        where: {
          id: officer.id,
        },
      }
    );

    await logActivity(req.officerId, "UPDATE OFFICER", `Officer: ${req.roles}`);

    res.status(200).json({ msg: "Officer Updated!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Menghapus petugas berdasarkan ID
const deleteOfficer = async (req, res) => {
  // Mencari petugas berdasarkan ID
  const officer = await Officer.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  // Menangani jika petugas tidak ditemukan
  if (!officer) return res.status(404).json({ msg: "Officer not found!" });

  try {
    // Menghapus petugas dari basis data
    await Officer.destroy({
      where: {
        id: officer.id,
      },
    });

    await logActivity(req.officerId, "DELETE OFFICER", `Officer: ${req.roles}`);
    res.status(200).json({ msg: "Officer Deleted!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export {
  getOfficers,
  getOfficerById,
  createOfficer,
  updateOfficer,
  deleteOfficer,
};
