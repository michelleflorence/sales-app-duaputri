import { Sequelize } from "sequelize";
import pg from "pg";

// Inisialisasi database
const db = new Sequelize("duaputri", "postgres", "password", {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  dialectModule: pg, // I've added this.
  timezone: "Etc/GMT+3", // Because process.env.TZ generated an error maybe due to time format
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
  },
  logging: false,
});

db.authenticate()
  .then(() => console.log("Connection established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

export default db;
