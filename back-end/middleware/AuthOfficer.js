// Middleware untuk memproteksi endpoint

import Officer from "../models/OfficerModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyOfficer = async (req, res, next) => {
  try {
    // Ekstrak token dari header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Jika tidak ada token, kembalikan status dan pesan error
    if (!token) {
      return res.status(401).json({ msg: "Please log in first!" });
    }

    // Verifikasi dan decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cari officer berdasarkan uuid yang terdapat dalam token
    const officer = await Officer.findOne({
      where: {
        uuid: decoded.uuid,
      },
    });

    // Jika officer tidak ditemukan, kembalikan status dan pesan error
    if (!officer) {
      return res.status(404).json({ msg: "Officer not found!" });
    }

    // Pastikan officer memiliki properti roles
    if (!officer.roles) {
      return res.status(403).json({ msg: "Officer roles not defined!" });
    }

    // Menyimpan data officer pada objek req untuk digunakan pada middleware selanjutnya
    req.officer = officer;

    // Menyimpan data officer Id pada objek req untuk digunakan pada middleware selanjutnya
    req.officerId = officer.id;

    // Menyimpan data officer roles pada objek req untuk digunakan pada middleware selanjutnya
    req.roles = officer.roles;

    next();
  } catch (error) {
    console.error("Error in verifyOfficer middleware:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Middleware untuk membatasi akses hanya untuk super admin
export const superAdminOnly = async (req, res, next) => {
  try {
    // Ekstrak token dari header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Jika tidak ada token, kembalikan status dan pesan error
    if (!token) {
      return res.status(401).json({ msg: "Please log in first!" });
    }

    // Verifikasi dan decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(403).json({ msg: "Invalid token" });

    // Cari officer berdasarkan uuid yang terdapat dalam token
    const officer = await Officer.findOne({
      where: {
        uuid: decoded.uuid,
      },
    });

    // Jika officer tidak ditemukan, kembalikan status dan pesan error
    if (!officer) return res.status(404).json({ msg: "Officer not found!" });

    // Jika yang login bukan super admin, maka akses akan ditolak
    if (officer.roles !== "superadmin")
      return res.status(403).json({ msg: "Access has been denied!" });

    // next() memungkinkan request untuk melanjutkan ke middleware/endpoint berikutnya
    next();
  } catch (error) {
    // Tangani kesalahan
    console.error("Error in superAdminOnly middleware:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Middleware untuk membatasi akses hanya untuk admin
export const adminOnly = async (req, res, next) => {
  // Ekstrak token dari header Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Jika tidak ada token, kembalikan status dan pesan error
  if (!token) {
    return res.status(401).json({ msg: "Please log in first!" });
  }

  // Verifikasi dan decode token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) return res.status(403).json({ msg: "Invalid token" });

  // Cari officer berdasarkan uuid yang terdapat dalam token
  const officer = await Officer.findOne({
    where: {
      uuid: decoded.uuid,
    },
  });

  // Jika officer tidak ditemukan, kembalikan status dan pesan error
  if (!officer) return res.status(404).json({ msg: "Officer not found!" });

  // Jika yang login bukan admin, maka akses akan ditolak
  if (officer.roles !== "admin")
    return res.status(403).json({ msg: "Access has been denied!" });

  // next() memungkinkan request untuk melanjutkan ke middleware/endpoint berikutnya
  next();
};

// Middleware untuk membatasi akses hanya untuk kasir
export const cashierOnly = async (req, res, next) => {
  // Ekstrak token dari header Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Jika tidak ada token, kembalikan status dan pesan error
  if (!token) {
    return res.status(401).json({ msg: "Please log in first!" });
  }

  // Verifikasi dan decode token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) return res.status(403).json({ msg: "Invalid token" });

  // Cari officer berdasarkan uuid yang terdapat dalam token
  const officer = await Officer.findOne({
    where: {
      uuid: decoded.uuid,
    },
  });

  // Jika officer tidak ditemukan, kembalikan status dan pesan error
  if (!officer) return res.status(404).json({ msg: "Officer not found!" });

  // Jika yang login bukan kasir, maka akses akan ditolak
  if (officer.roles !== "kasir")
    return res.status(403).json({ msg: "Access has been denied!" });

  // next() memungkinkan request untuk melanjutkan ke middleware/endpoint berikutnya
  next();
};
