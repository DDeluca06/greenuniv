import express from "express";
import bcrypt from "bcrypt"; // Ensure bcrypt is installed
import prisma from "../config/db.js"; // Updated to use Prisma

const router = express.Router();

// Log-In Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.students.findUnique({
      where: { email: email },
    });

    if (!existingUser) return res.send("Invalid email or password.");

    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) return res.send("Invalid email or password.");

    req.session.user = existingUser;
    req.session.isLoggedIn = true;
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error during login:", error);
    res.send("Internal Server Error");
  }
});

// Sign-Up Route
router.post("/signup", async (req, res) => {
  const { FirstName, SecondName, email, password, UserType } = req.body;

  try {
    const existingUser = await prisma.students.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      console.log("User already exists:", existingUser); // Log existing user
      return res.send("Email already in use. Please use a different email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.students.create({
      data: {
        FirstName,
        SecondName,
        email,
        password: hashedPassword,
        UserType: "Admin",
      },
    });

    res.send("User created successfully.");
  } catch (error) {
    console.error("Error during sign up:", error);
    res.send("Internal Server Error");
  }
});

// Log Out Route
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect('/dashboard');
    res.redirect('/');
  });
});

export default router;
