import { Sequelize } from "sequelize";

// Inisialisasi database
const db = new Sequelize('duaputri', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres'
});

export default db;