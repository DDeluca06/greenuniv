/* --------------------------------- Imports -------------------------------- */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import db from "../config/db.js";
/* -------------------------------- Constants ------------------------------- */
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const validPages = ['dash', 'dashboard', 'courses', 'assignments', 'announcements', 'settings'];
/* --------------------------------- Routing -------------------------------- */
// Main Route
router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "../public/html/login.html"));
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
});

// Loading our other pages
router.get('/partials/:page', async (req, res) => {
    const { page } = req.params;
  
    if (validPages.includes(page)) {
      try {
        let data = {};
        switch (page) {
          case 'courses':
            data.courses = db.all('SELECT * FROM courses');
            break;
          case 'assignments':
            data.assignments = db.all('SELECT * FROM tasks');
            break;
          case 'announcements':
            data.announcements = db.all('SELECT * FROM announcements');
            break;
          case 'settings':
            if (req.session && req.session.user) {
              data.user = db.get('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
            } else {
              return res.redirect('/');
            }
            break;
          case 'dash':
          case 'dashboard':
            if (req.session && req.session.user) {
              data.user = req.session.user;
            } else {
              return res.redirect('/');
            }
            break;
        }
        return res.render(`partials/${page}`, data);
      } catch (error) {
        console.error(`Error fetching data for ${page}:`, error);
        return res.status(500).send('Internal Server Error');
      }
    } else {
        // Ideally, we would flag and delete your account here for going to the wrong page, but my advisor said something about "client confidence" and "treating your users like human beings" - whatever that means.
      return res.status(404).send('<h1>404 - Page Not Found</h1>');
    }
});

// Dashboard Route
router.get('/dashboard', async (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
    try {
        res.render('dashboard', { user: req.session.user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;