import { Sequelize } from "sequelize";
import pg from "pg";
import "dotenv/config";
const { VERCEL_ENV } = process.env;

// Inisialisasi database
const db =
  VERCEL_ENV === "production"
    ? new Sequelize(
        "postgresql://postgres.scmobavxxsdsbpwvbshh:BWsPP8@Cdpc!KSb@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
        {
          host: "aws-0-ap-southeast-1.pooler.supabase.com",
          dialect: "postgres",
          dialectModule: pg,
          port: 6543,
        }
      )
    : new Sequelize("postgres://postgres:password@localhost:5432/duaputri", {
        host: "localhost",
        dialect: "postgres",
        dialectModule: pg,
      });

export default db;
