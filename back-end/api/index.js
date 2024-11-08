import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import OfficerRoute from "../routes/OfficerRoute.js";
import ProductRoute from "../routes/ProductRoute.js";
import CustomerRoute from "../routes/CustomerRoute.js";
import OrderRoute from "../routes/OrderRoute.js";
import OrderDetailRoute from "../routes/OrderDetailRoute.js";
import InvoiceRoute from "../routes/InvoiceRoute.js";
import ActivityLogRoute from "../routes/ActivityLogRouter.js";
import AuthRoute from "../routes/AuthRouter.js";

dotenv.config();

const app = express();

// Setup middleware for CORS
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Middleware for JSON and URL-encoded data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use("/uploads", express.static("uploads"));

// Define routes
app.use(OfficerRoute);
app.use(ProductRoute);
app.use(CustomerRoute);
app.use(OrderRoute);
app.use(OrderDetailRoute);
app.use(InvoiceRoute);
app.use(ActivityLogRoute);
app.use(AuthRoute);

// Export the app as a serverless function
export default app;
