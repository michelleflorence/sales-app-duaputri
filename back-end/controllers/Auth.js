import Officer from "../models/OfficerModel.js";
import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const login = async (req, res) => {
    const officer = await Officer.findOne({
        // Mencari data berdasarkan email
        where: {
            email: req.body.email
        }
    });

    // Jika officer tidak ditemukan berdasarkan email, maka return message error
    if (!officer) return res.status(404).json({msg: "Officer not found!"});

    // Verifikasi password
    const match = await argon2.verify(officer.password, req.body.password);

    // Jika password yang dikirimkan officer tidak cocok, maka return status 400
    if (!match) return res.status(400).json({msg: "Wrong password!"});
    
    // Jika password cocok, maka set token untuk kembalikan objek array
    const token = jwt.sign({ 
        uuid: officer.uuid, 
        name: officer.name, 
        email: officer.email, 
        roles: officer.roles 
    }, process.env.JWT_SECRET);

    res.status(200).json({token});
}

// Untuk check data officer yang sedang login
export const Me = async (req, res) => {
    // Check jika tidak terdapat session officer Id, maka return response status 401
    // Dan pesan untuk login terlebih dahulu
    if(!req.officer.uuid) {
        return res.status(401).json({msg: "Please login first!"});
    }

    // Jika terdapat session, cari data user berdasarkan uuid
    const officer = await Officer.findOne({
        attributes: ['uuid', 'name', 'email', 'roles'],
        where: {
            uuid: req.officer.uuid
        }
    })

    // Jika tidak terdapat officer dengan uuid, return pesan error
    if(!officer) return res.status(404).json({msg: "Officer not found!"})

    // Jika terdapat officer, maka parsing variabel officer
    res.status(200).json(officer);
}

export const logOut = (req, res) => {
    // Hapus session 
    req.session.destroy((err) => {
        // Jika terdapat error, return status 400 dan pesan bahwa tidak dapat logout
        if (err) return res.status(400).json({msg: "Cannot logout"})

        // Jika berhasil return message bahwa berhasil logout
        res.status(200).json({msg: "You've been logged out"})
    });
}