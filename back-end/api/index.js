import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OfficerRoute from "../routes/OfficerRoute.js";
import ProductRoute from "../routes/ProductRoute.js";
import CustomerRoute from "../routes/CustomerRoute.js";
import OrderRoute from "../routes/OrderRoute.js";
import OrderDetailRoute from "../routes/OrderDetailRoute.js";
import InvoiceRoute from "../routes/InvoiceRoute.js";
import ActivityLogRoute from "../routes/ActivityLogRouter.js";
import AuthRoute from "../routes/AuthRouter.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Setup middleware untuk CORS agar aplikasi dapat berkomunikasi dengan frontend yang berjalan pada origin tertentu
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
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

// Mengaktifkan server untuk mendengarkan pada port yang didefinisikan di file .env
app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running...");
});

export default app;
