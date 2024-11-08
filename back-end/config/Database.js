import { Sequelize } from "sequelize";
import pg from "pg";

// Inisialisasi database
const db = new Sequelize("duaputri", "postgres", "password", {
  host: "localhost",
  dialect: "postgres",
  dialectModule: pg,
  port: 5432,
  timezone: "Etc/GMT+3",
});

db.authenticate()
  .then(() => console.log("Connection established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

export default db;
