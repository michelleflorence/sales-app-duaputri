import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import OfficerRoute from "./routes/OfficerRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import CustomerRoute from "./routes/CustomerRoute.js";
import OrderRoute from "./routes/OrderRoute.js";
import OrderDetailRoute from "./routes/OrderDetailRoute.js";
import InvoiceRoute from "./routes/InvoiceRoute.js";
import ActivityLogRoute from "./routes/ActivityLogRouter.js";
import AuthRoute from "./routes/AuthRouter.js";
import db from "./config/Database.js";
import seedSuperAdmin from "./controllers/Superadmin.js";
// import Customers from "./models/CustomerModel.js";
// import Orders from "./models/OrderModel.js";
// import OrderDetails from "./models/OrderDetailModel.js";
// import Invoices from "./models/InvoiceModel.js";

dotenv.config();

const app = express();

// Buat table session dalam database dengan menggunakan fungsi sync
// store.sync();

// Setup middleware untuk CORS agar aplikasi dapat berkomunikasi dengan frontend yang berjalan pada origin tertentu
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://sales-app-duaputri.vercel.app"],
  })
);

// Setup middleware untuk menerima data dalam format JSON
app.use(express.json());

// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

// Setup middleware untuk routing Officer, Product, dan Authentication
app.use(OfficerRoute);
app.use(ProductRoute);
app.use(CustomerRoute);
app.use(OrderRoute);
app.use(OrderDetailRoute);
app.use(InvoiceRoute);
app.use(ActivityLogRoute);
app.use(AuthRoute);
app.use("/", (req, res) => {
  res.send("Server is up and running");
});

// Database connection and synchronization
(async () => {
  try {
    await db.authenticate();
    console.log("Database connected successfully!");

    // Synchronize models with database
    // await db.sync();
    // console.log("Models synchronized with database");

    // Run the seed function after successful DB sync
    await seedSuperAdmin();
    console.log("SuperAdmin seeded successfully");

    // Start the server
    app.listen(process.env.APP_PORT, () => {
      console.log("Server up and running...");
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

export default app;
