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
import ActivityLog from "../models/ActivityLogModel.js";

const app = express();

// Setup middleware untuk CORS agar aplikasi dapat berkomunikasi dengan frontend
app.use(
  cors({
    credentials: true,
    origin: "https://sales-app-duaputri.vercel.app/", // Ubah ini ke origin yang sesuai di Vercel jika perlu
  })
);

// Middleware untuk menerima data dalam format JSON
app.use(express.json());

// Middleware untuk menerima URL-encoded data
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Middleware untuk file statis
app.use("/uploads", express.static("uploads"));

// Middleware untuk route
app.use(OfficerRoute);
app.use(ProductRoute);
app.use(CustomerRoute);
app.use(OrderRoute);
app.use(OrderDetailRoute);
app.use(InvoiceRoute);
app.use(ActivityLogRoute);
app.use(AuthRoute);

app.get("/", (req, res) => {
  res.send("Hello, welcome to the Sales App API!");
});

export default app;
