import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // Ensure bcrypt is installed

const router = express.Router();
const prisma = new PrismaClient();

// Route to create a user account
router.post("/users", async (req, res) => {
    console.log("Received request body:", req.body); // Debugging log

    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
        const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.students.create({
            data: { FirstName: firstname, LastName: lastname, Email: email, Password: hashedPassword }
        });

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// Route to enroll in a course
router.post("/enroll", async (req, res) => {
    console.log("Received enrollment request:", req.body);

    const { studentId, courseId } = req.body;
    const parsedStudentId = Number(studentId);
    const parsedCourseId = Number(courseId);

    if (isNaN(parsedStudentId) || isNaN(parsedCourseId)) {
        return res.status(400).json({ 
            error: "Invalid student ID or course ID",
            received: { studentId, courseId }
        });
    }

    try {
        const existingEnrollment = await prisma.enrollments.findUnique({
            where: {
                StudentID_CourseID: { StudentID: parsedStudentId, CourseID: parsedCourseId }
            }
        });

        if (existingEnrollment) {
            return res.status(409).json({ error: "Student is already enrolled in this course" });
        }

        const enrollment = await prisma.enrollments.create({
            data: {
                StudentID: parsedStudentId,
                CourseID: parsedCourseId,
                EnrollmentDate: new Date()
            }
        });

        console.log("Enrollment created:", enrollment);
        res.status(201).json({ message: "Successfully enrolled", enrollment });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to enroll in course", details: error.message });
    }
});

// Courses creation route
router.post("/courses", async (req, res) => {
    
    console.log("Received request body:", req.body); // Debugging log

    const { courseName, courseDescription, courseCredits } = req.body;
    if (!courseName || !courseDescription || !courseCredits) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const course = await prisma.courses.create({
            data: {
                CourseName: courseName,
                CourseDesc: courseDescription,
                Credits: parseInt(courseCredits),
            },
        });
        res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
        console.error("Database error:", error); // Log the specific error
        res.status(500).json({ error: "Failed to create course" });
    }
});

router.get("/edit-course-form/:id", async (req, res) => {
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

        res.render("partials/editCourseForm", { course });
    } catch (error) {
        console.error("Error fetching course for editing:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Unenrolling a student
router.post("/unenroll", async (req, res) => {
    console.log("Unenroll request received:", req.body); // Debugging

    const { studentId, courseId } = req.body;

    // Convert to numbers and log the results
    const parsedStudentId = Number(studentId);
    const parsedCourseId = Number(courseId);
    console.log("Parsed studentId:", parsedStudentId, "Parsed courseId:", parsedCourseId); // Debugging

    if (isNaN(parsedStudentId) || isNaN(parsedCourseId)) {
        return res.status(400).json({ error: "Invalid student ID or course ID", received: req.body });
    }

    try {
        const deleted = await prisma.enrollments.deleteMany({
            where: {
                StudentID: parsedStudentId,
                CourseID: parsedCourseId,
            },
        });

        if (deleted.count > 0) {
            console.log(`Student ${parsedStudentId} unenrolled from course ${parsedCourseId}`);
            return res.json({ success: true, message: "Student successfully removed" });
        } else {
            return res.status(404).json({ success: false, error: "Enrollment not found" });
        }
    } catch (error) {
        console.error("Error unenrolling student:", error);
        res.status(500).json({ success: false, error: "Failed to remove student" });
    }
});


router.post("/courses/update", async (req, res) => {
    if (!req.session.user || !req.session.user.isFacilitator) {
        return res.status(403).json({ error: "Forbidden: Only facilitators can update courses" });
    }

    const { courseId, courseName, courseDescription, courseCredits } = req.body;
    
    if (!courseId || !courseName || !courseDescription || !courseCredits) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        await prisma.courses.update({
            where: { CourseID: parseInt(courseId, 10) },
            data: {
                CourseName: courseName,
                CourseDesc: courseDescription,
                Credits: parseInt(courseCredits, 10)
            }
        });

        res.send(`<div class='text-green-600 font-bold'>Course updated successfully!</div>`); // HTMX response
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Failed to update course" });
    }
});

// Route to create a fee
router.post("/fees", async (req, res) => {
    const { feeUser, feeName, feeAmount, feeDate } = req.body;
    try {
        const fee = await prisma.fees.create({
            data: {
                StudentID: feeUser,
                FeeDescription: feeName,
                Amount: feeAmount,
                DueDate: feeDate, 
            },
        });
        res.status(201).json({ message: "Fee created successfully", fee });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to create fee" });
    }
});

export default router;
