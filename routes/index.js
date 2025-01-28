/* --------------------------------- Imports -------------------------------- */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../config/db.js"; // Updated to use Prisma
/* -------------------------------- Constants ------------------------------- */
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const validPages = ['dash', 'dashboard', 'courses', 'assignments', 'payments', 'settings'];
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
            let data = {
                user: req.session?.user || null // Always include user data
            };
            
            switch (page) {
                case 'courses':
                    data.courses = await prisma.courses.findMany();
                    break;
                case 'payments':
                    data.payments = await prisma.fees.findMany();
                    break;
                case 'settings':
                case 'dash':
                case 'dashboard':
                    if (!req.session?.user) {
                        return res.redirect('/');
                    }
                    data.user = await prisma.students.findUnique({
                        where: { StudentID: req.session.user.id },
                    });
                    break;
                case 'admin':
                    if (!req.session?.user?.isAdmin) {
                        return res.redirect('/');
                    }
                    data.user = await prisma.students.findUnique({
                        where: { StudentID: req.session.user.id },
                    });
                    break;
            }
            return res.render(`partials/${page}`, data);
        } catch (error) {
            console.error(`Error fetching data for ${page}:`, error);
            return res.status(500).send('Internal Server Error');
        }
    } else {
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
