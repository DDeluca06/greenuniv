/* --------------------------------- Imports -------------------------------- */
import express from "express";
import session from 'express-session';
import dotenv from 'dotenv';
import routes from "./routes/index.js";
import accroutes from "./routes/accmanage.js";
import { fileURLToPath } from "url";
import path from "path";
import db from "./config/db.js";
import { usertbl, coursestbl, taskstbl } from './db/init.js'; // Reduce clutter
/* -------------------------------- Constants ------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
/* --------------------------------- Middlewares -------------------------------- */
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // We could be getting JSON at some point, the app needs to know what to do with it.
app.use(express.static("public")); // Serve public files
app.set("view engine", "ejs"); // Set view engine to EJS
app.set("views", path.join(__dirname, "views"));
app.use("/", routes);
app.use("/", accroutes);
/* --------------------------------- Database -------------------------------- */
// Create the tables if they don't already exist
db.serialize(() => {
    db.run(usertbl);
    db.run(taskstbl);
    db.run(coursestbl);
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});