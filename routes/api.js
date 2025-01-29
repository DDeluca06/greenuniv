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
