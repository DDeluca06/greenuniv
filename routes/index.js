/* --------------------------------- Imports -------------------------------- */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../config/db.js"; // Updated to use Prisma
/* -------------------------------- Constants ------------------------------- */
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const validPages = ['dash', 'dashboard', 'courses', 'assignments', 'payments', 'settings', 'admin', 'facil'];
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

router.get("/courses", async (req, res) => {
    try {

        const userId = req.session.userId; // Ensure session holds user ID
        if (!userId) {
            console.error("No user ID found in session!");
            return res.redirect("/login");
        }

        // Fetch student info including enrollments
        const user = await prisma.students.findUnique({
            where: { StudentID: userId },
            include: {
                Enrollments: { // ✅ Fetch enrolled courses
                    select: { CourseID: true }
                }
            }
        });

        // Fetch all available courses
        const courses = await prisma.courses.findMany();

        if (!user) {
            console.error("User not found in database!");
            return res.redirect("/login");
        }

        // ✅ Extract CourseIDs from the Enrollments array
        const enrolledCourseIds = user.Enrollments?.map(enrollment => enrollment.CourseID) || [];

        res.render("courses", {
            user: {
                id: user.StudentID,
                Email: user.Email,
                FirstName: user.FirstName,
                LastName: user.LastName,
                isAdmin: user.isAdmin,
                isFacilitator: user.isFacilitator,
                enrolledCourses: enrolledCourseIds  // ✅ Ensure enrolledCourses is included
            },
            courses,
        });

    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Loading our other pages
router.get('/partials/:page', async (req, res) => {
    const { page } = req.params;

    if (validPages.includes(page)) {
        try {
            let data = {
                user: req.session?.user || null // Always include session user data
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
                        data.additionalUserData = await prisma.students.findUnique({
                            where: { StudentID: req.session.user.id },
                        });
                        // Add this line to fetch the course data
                        data.course = await prisma.courses.findFirst();
                    break;
                case 'admin':
                    if (!req.session?.user?.isAdmin) {
                        return res.redirect('/');
                    }
                    // Instead of overwriting user, add additional data
                    data.additionalUserData = await prisma.students.findUnique({
                        where: { StudentID: req.session.user.id },
                    });
                    break;
            }
            console.log('Data being passed to template:', data); // Add this log
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
        const userId = req.session.user.id;
        const user = await prisma.students.findUnique({
            where: { StudentID: userId },
            include: {
                Enrollments: {
                    include: {
                        Courses: true
                    }
                }
            }
        });

        const courses = user.Enrollments.map(enrollment => enrollment.Courses);

        res.render('dashboard', { user: req.session.user, courses });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
