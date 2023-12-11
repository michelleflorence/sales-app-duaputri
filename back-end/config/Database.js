import { Sequelize } from "sequelize";

// Inisialisasi database
const db = new Sequelize('duaputri', 'postgres', 'password', {
    host: 'localhost', // Alamat server database
    dialect: 'postgres' // Jenis database yang digunakan (PostgreSQL dalam kasus ini)
});

export default db;