import { Sequelize } from "sequelize";
import pg from "pg";
import "dotenv/config";

// Inisialisasi database
const db = new Sequelize(
  "postgres://postgres:password@localhost:5432/duaputri",
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
