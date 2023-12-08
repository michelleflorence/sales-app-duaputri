// Middleware untuk memproteksi endpoint

import Officer from "../models/OfficerModel.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const verifyOfficer = async (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Jika tidak terdapat token, return status dan message error
    if (!token) {
        return res.status(401).json({ msg: 'Please log in first!' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(403).json({ msg: 'Invalid token!' });

    const officer = await Officer.findOne({
        where: {
            uuid: decoded.uuid
        }
    });

    // Jika officer tidak ditemukan, return status dan message error
    if (!officer) return res.status(404).json({msg: "Officer not found!"});

    req.officer = officer;

    // Set officer Id pada middleware (supaya bisa dipake berulang kali)
    req.officerId = officer.id;

    // Set roles pada officer (supaya bisa dipake berulang kali)
    req.roles = officer.roles;
    next();
}

export const superAdminOnly = async (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Jika tidak terdapat token, return status dan message error
    if (!token) {
        return res.status(401).json({ msg: 'Please log in first!' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(403).json({ msg: 'Invalid token' });

    const officer = await Officer.findOne({
        where: {
            uuid: decoded.uuid
        }
    });
    
    // Jika officer tidak ditemukan, return status dan message
    if (!officer) return res.status(404).json({msg: "Officer not found!"});

    // Jika yang login bukan super admin, maka akses akan ditolak
    if (officer.roles !== "superadmin") return res.status(403).json({msg: "Access has been denied!"});

    // req.officer = officer;
    next();
}

export const chefOnly = async (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Jika tidak terdapat token, return status dan message error
    if (!token) {
        return res.status(401).json({ msg: 'Please log in first!' });
    }

    // Verify dan decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(403).json({ msg: 'Invalid token' });

    const officer = await Officer.findOne({
        where: {
            uuid: decoded.uuid
        }
    });
    // Jika officer tidak ditemukan, return status dan error message
    if (!officer) return res.status(404).json({msg: "Officer not found!"});

    // Jika yang login bukan koki, maka akses akan ditolak
    if (officer.roles !== "koki") return res.status(403).json({msg: "Access has been denied!"})

    // req.officer = officer;
    next();
}