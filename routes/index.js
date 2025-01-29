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
    if (!req.session.user) {
        console.error("User session missing! Redirecting to login.");
        return res.redirect("/");
    }

    try {
        const userId = req.session.user.id; // Ensure session holds user ID
        if (!userId) {
            console.error("No user ID found in session!");
            return res.redirect("/");
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
            return res.redirect("/");
        }

        // ✅ Extract CourseIDs from the Enrollments array
        const enrolledCourseIds = user.Enrollments?.map(enrollment => enrollment.CourseID) || [];
        console.log("User session:", req.session.user); // Debugging session data
        res.render("courses", {
            user: {
                id: user.StudentID,
                Email: user.Email,
                FirstName: user.FirstName,
                LastName: user.LastName,
                isAdmin: user.isAdmin,
                isFacilitator: user.isFacilitator,
                enrolledCourses: enrolledCourseIds,  // ✅ Ensure enrolledCourses is included
            },
            courses,
        });

    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/edit-course/:id", async (req, res) => {
    if (!req.session.user || !req.session.user.isFacilitator) {
        return res.status(403).send("Forbidden: Only facilitators can edit courses.");
    }

    const courseId = parseInt(req.params.id, 10);
    if (isNaN(courseId)) {
        return res.status(400).send("Invalid course ID");
    }

    try {
        const course = await prisma.courses.findUnique({
            where: { CourseID: courseId },
        });

        if (!course) {
            return res.status(404).send("Course not found");
        }

        res.render("editCourse", { course, user: req.session.user });
    } catch (error) {
        console.error("Error fetching course for editing:", error);
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
            // console.log('Data being passed to template:', data); // If you REALLY need to debug, uncomment this
            // But it will make your console as useful as color-corrected streetlights for the colorblind.
            // ^^ This sounded funnier when I was writing it. I'm still leaving it in, my corny jokes are amazing. 
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

router.get('/course/:id', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    const courseId = parseInt(req.params.id, 10);
    if (isNaN(courseId)) {
        return res.status(400).json({ error: 'Invalid course ID' });
    }

    try {
        const course = await prisma.courses.findUnique({
            where: { CourseID: courseId },
            include: {
                Enrollments: {
                    include: { Students: true }
                }
            }
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const enrolledStudents = course.Enrollments.map(enrollment => ({
            StudentName: `${enrollment.Students.FirstName} ${enrollment.Students.LastName}`,
            StudentID: enrollment.Students.StudentID
        }));

        res.render('partials/courseDetails', {
            course,
            enrolledStudents,
            user: req.session.user // Ensure user is passed
        });
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
