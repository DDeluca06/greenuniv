import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Main Route
router.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "../public/html/login.html"));
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
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