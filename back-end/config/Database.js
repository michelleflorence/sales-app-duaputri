import { Sequelize } from "sequelize";

// Inisialisasi database
const db = new Sequelize(
  process.env.DB_NAME, // Nama database
  process.env.DB_USER, // Nama pengguna database
  process.env.DB_PASSWORD, // Kata sandi database
  {
    host: process.env.DB_HOST, // Host database
    dialect: "postgres",
    port: process.env.DB_PORT || 5432, // Tambahkan port jika diperlukan
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true, // Pastikan koneksi SSL diaktifkan di produksi
        rejectUnauthorized: false, // Diperlukan untuk beberapa layanan hosting PostgreSQL
      },
    },
  }
);

export default db;