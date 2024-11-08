import { Sequelize } from "sequelize";
import pg from "pg"

// Inisialisasi database
const db = new Sequelize('duaputri', 'postgres', 'password', {
    host: 'localhost', // Alamat server database
    dialect: 'postgres', // Jenis database yang digunakan (PostgreSQL dalam kasus ini)
    dialectModule: pg,
});

export default db;