/* ------------------------------- Imports ------------------------------- */
import express from "express";
import db from "../config/db.js";
/* -------------------------------- Constants ------------------------------- */
const router = express.Router();
/* ----------------------------------- API ---------------------------------- */
// Fetch courses
router.get('/courses', (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // We're going to replace this with a real DB query later
    // ^^ NO WE'RE NOT
    const courses = [
        { id: 1, name: "Introduction to Psychology" },
        { id: 2, name: "Advanced Calculus" },
        { id: 3, name: "World History" },
        { id: 4, name: "Computer Science 101" },
    ];
    res.json(courses);
});

// Fetch assignments
router.get('/assignments', (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Replace with database query
    // ^^ (no we're not)
    const assignments = [
        { id: 1, title: "Psychology Essay", dueDate: "2025-02-01" },
        { id: 2, title: "Calculus Homework", dueDate: "2025-01-30" },
        { id: 3, title: "Assignment #3", dueDate: "2025-03-16" },
    ];
    res.json(assignments);
});

export default router;
