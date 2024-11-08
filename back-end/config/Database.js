import { Sequelize } from "sequelize";
import pg from "pg";
import "dotenv/config";

// Inisialisasi database
const db = new Sequelize(
  process.env.DB_NAME || "duaputri",
  process.env.DB_USERNAME || "postgres",
  process.env.DB_PASSWORD || "password",
  {
    host: "localhost",
    dialect: "postgres",
    dialectModule: pg,
  }
);

db.authenticate()
  .then(() => console.log("Connection established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

export default db;
