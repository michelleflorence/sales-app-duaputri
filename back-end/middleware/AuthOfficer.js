// Middleware untuk memproteksi endpoint

import Officer from "../models/OfficerModel.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

// Middleware untuk memverifikasi token officer
export const verifyOfficer = async (req, res, next) => {
    // Ekstrak token dari header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Jika tidak ada token, kembalikan status dan pesan error
    if (!token) {
        return res.status(401).json({ msg: 'Please log in first!' });
    }

    // Verifikasi dan decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(403).json({ msg: 'Invalid token!' });

    // Cari officer berdasarkan uuid yang terdapat dalam token
    const officer = await Officer.findOne({
        where: {
            uuid: decoded.uuid
        }
    });

    // Jika officer tidak ditemukan, kembalikan status dan pesan error
    if (!officer) return res.status(404).json({msg: "Officer not found!"});

    // Menyimpan data officer pada objek req untuk digunakan pada middleware selanjutnya
    req.officer = officer;

    // Menyimpan data officer Id pada objek req untuk digunakan pada middleware selanjutnya
    req.officerId = officer.id;

    // Menyimpan data officer roles pada objek req untuk digunakan pada middleware selanjutnya
    req.roles = officer.roles;
    next();
}

// Middleware untuk membatasi akses hanya untuk super admin
export const superAdminOnly = async (req, res, next) => {
    // Ekstrak token dari header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Jika tidak ada token, kembalikan status dan pesan error
    if (!token) {
        return res.status(401).json({ msg: 'Please log in first!' });
    }

    // Verifikasi dan decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(403).json({ msg: 'Invalid token' });

    // Cari officer berdasarkan uuid yang terdapat dalam token
    const officer = await Officer.findOne({
        where: {
            uuid: decoded.uuid
        }
    });
    
    // Jika officer tidak ditemukan, kembalikan status dan pesan error
    if (!officer) return res.status(404).json({msg: "Officer not found!"});

    // Jika yang login bukan super admin, maka akses akan ditolak
    if (officer.roles !== "superadmin") return res.status(403).json({msg: "Access has been denied!"});

    // next() memungkinkan request untuk melanjutkan ke middleware/endpoint berikutnya
    next();
}

// Middleware untuk membatasi akses hanya untuk koki
export const chefOnly = async (req, res, next) => {
    // Ekstrak token dari header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Jika tidak ada token, kembalikan status dan pesan error
    if (!token) {
        return res.status(401).json({ msg: 'Please log in first!' });
    }

    // Verifikasi dan decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(403).json({ msg: 'Invalid token' });

    // Cari officer berdasarkan uuid yang terdapat dalam token
    const officer = await Officer.findOne({
        where: {
            uuid: decoded.uuid
        }
    });

    // Jika officer tidak ditemukan, kembalikan status dan pesan error
    if (!officer) return res.status(404).json({msg: "Officer not found!"});

    // Jika yang login bukan koki, maka akses akan ditolak
    if (officer.roles !== "koki") return res.status(403).json({msg: "Access has been denied!"})

    // next() memungkinkan request untuk melanjutkan ke middleware/endpoint berikutnya
    next();
}