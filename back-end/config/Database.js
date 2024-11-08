import { Sequelize } from "sequelize";
import pg from "pg";

// Inisialisasi database
const db = new Sequelize("duaputri", "postgres", "password", {
  host: process.env.DB_HOST || "localhost", // Default to localhost
  dialect: "postgres",
  dialectModule: pg,
  port: process.env.DB_PORT || 5432, // Default to port 5432
  timezone: "Etc/GMT+3",
});

export default db;
