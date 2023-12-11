import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import OfficerRoute from './routes/OfficerRoute.js';
import ProductRoute from './routes/ProductRoute.js';
import AuthRoute from './routes/AuthRouter.js';

dotenv.config();

const app = express();

// Buat variable sessionStore untuk menyimpan sesi ke dalam database
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db
})

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}))

// Setup middleware untuk CORS agar aplikasi dapat berkomunikasi dengan frontend yang berjalan pada origin tertentu
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

// Setup middleware untuk menerima data dalam format JSON
app.use(express.json())

// Setup middleware untuk routing Officer, Product, dan Authentication
app.use(OfficerRoute)
app.use(ProductRoute)
app.use(AuthRoute)

// Mengaktifkan server untuk mendengarkan pada port yang didefinisikan di file .env
app.listen(process.env.APP_PORT, () => {
    console.log("Server up and running...");  
})

// Buat table session dalam database dengan menggunakan fungsi sync
// store.sync();

// Generate table database
// (async() => {
//     await db.sync()
//     .then(() => {
//         console.log('Model synchronized with database');
//     })
//     .catch((error) => {
//         console.log('Error synchronizing model with database:', error);
//     })
// })();
