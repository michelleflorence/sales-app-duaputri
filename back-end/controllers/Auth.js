import Officer from "../models/OfficerModel.js";
import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

// Fungsi untuk menangani proses login officer
const login = async (req, res) => {
    // const roles = req.body
    // console.log(roles)
    const officer = await Officer.findOne({
        // Mencari officer berdasarkan email yang dikirimkan dalam request body
        where: {
            email: req.body.email
        }
    });

    const roles = officer.roles
    
    // Jika officer tidak ditemukan berdasarkan email, kembalikan pesan error
    if (!officer) return res.status(404).json({msg: "Officer not found!"});

    // Verifikasi password menggunakan Argon2
    const match = await argon2.verify(officer.password, req.body.password);

    // Jika password yang dikirimkan officer tidak cocok, kembalikan status 400 dan pesan bahwa password salah
    if (!match) return res.status(400).json({msg: "Wrong password!"});
    
    // Jika password cocok, buat token JWT dan kembalikan sebagai response
    const token = jwt.sign({ 
        uuid: officer.uuid, 
        name: officer.name, 
        email: officer.email, 
        roles: officer.roles 
    }, process.env.JWT_SECRET);

    res.status(200).json({token, roles});
}

// Fungsi untuk mendapatkan data officer yang sedang login
const Me = async (req, res) => {
    // Cek apakah terdapat uuid officer, jika tidak, kembalikan response status 401
    // dan pesan untuk login terlebih dahulu
    if(!req.officer.uuid) {
        return res.status(401).json({msg: "Please login first!"});
    }

    // Jika terdapat uuid officer, cari data officer berdasarkan uuid
    const officer = await Officer.findOne({
        attributes: ['uuid', 'name', 'email', 'roles'],
        where: {
            uuid: req.officer.uuid
        }
    })

    // Jika tidak terdapat officer dengan uuid, kembalikan pesan error
    if(!officer) return res.status(404).json({msg: "Officer not found!"})

    // Jika terdapat officer, kembalikan data officer sebagai response
    res.status(200).json(officer);
}

// Fungsi untuk proses logout officer dan menghapus token
const logOut = (req, res) => {
    // Periksa apakah header Authorization mengandung token
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(400).json({ msg: "No token found in the Authorization header" });
    }

    // Hapus token dari header Authorization
    delete req.headers['authorization'];

    // Kembalikan pesan sukses
    res.status(200).json({ msg: "You've been logged out" });
}

export {login, Me, logOut}