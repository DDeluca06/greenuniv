import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Route to create a user account
router.post("/users", async (req, res) => {
    console.log("Received request body:", req.body); // Debugging log

    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const user = await prisma.students.create({
            data: { FirstName: firstname, LastName: lastname, Email: email, Password: password }
        });

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to create user" });
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

// Route to get all courses
router.get("/courses", async (req, res) => {
    try {
        const courses = await prisma.courses.findMany();
        res.status(200).json(courses);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to retrieve courses" });
    }
});

// Route to enroll in a course
router.post("/enroll", async (req, res) => {
    console.log("Session user:", req.session?.user);
    console.log("Received enrollment request headers:", JSON.stringify(req.headers, null, 2));
    console.log("Received enrollment request body:", JSON.stringify(req.body, null, 2));
    
    const { studentId, courseId } = req.body;
    
    console.log("Parsed studentId:", studentId, "Type:", typeof studentId);
    console.log("Parsed courseId:", courseId, "Type:", typeof courseId);

    if (!studentId || !courseId) {
        console.error("Missing required fields. Body:", req.body);
        return res.status(400).json({ error: "Missing required fields", receivedData: { studentId, courseId } });
    }

    try {
        const enrollment = await prisma.enrollments.create({
            data: {
                StudentID: parseInt(studentId, 10),
                CourseID: parseInt(courseId, 10),
            },
        });
        console.log("Enrollment created:", enrollment);
        res.status(201).json({ message: "Successfully enrolled", enrollment });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to enroll in course", details: error.message });
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
