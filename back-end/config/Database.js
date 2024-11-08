import { Sequelize } from "sequelize";
import pg from "pg";
import "dotenv/config";
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  NODE_ENV = "production",
} = process.env;

// Inisialisasi database
const db =
  NODE_ENV === "production"
    ? new Sequelize({
        dialect: "postgres",
        host: DB_HOST,
        port: 5432,
        database: DB_NAME,
        username: DB_USER,
        password: DB_PASSWORD,
        dialectModule: pg,
      })
    : new Sequelize("postgres://postgres:password@localhost:5432/duaputri", {
        host: "localhost",
        dialect: "postgres",
        dialectModule: pg,
      });

db.authenticate()
  .then(() => console.log("Connection established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

export default db;
