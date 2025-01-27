/* --------------------------------- Imports -------------------------------- */
import express from "express";
import helmet from "helmet";
import session from 'express-session';
import dotenv from 'dotenv';
import routes from "./routes/index.js";
import accroutes from "./routes/accmanage.js";
import apiroute from "./routes/api.js";
import { fileURLToPath } from "url";
import path from "path";
import prisma from "./config/db.js"; // Updated to use Prisma

/* -------------------------------- Constants ------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
/* --------------------------------- Middlewares -------------------------------- */
// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Set up session management
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
// Helmet Config
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://unpkg.com/htmx.org"],
      imgSrc: ["'self'", "data:", "https://pbs.twimg.com"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // We could be getting JSON at some point, the app needs to know what to do with it.
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs"); // Set view engine to EJS
app.set("views", path.join(__dirname, "views"));
app.use("/", routes);
app.use("/", accroutes);
app.use("/api", apiroute);
/* --------------------------------- Database -------------------------------- */
prisma.$connect()
    .then(() => {
        console.log('Connected to the database using Prisma.');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });


app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
