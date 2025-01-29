import express from "express";
import bcrypt from "bcrypt"; // Ensure bcrypt is installed
import prisma from "../config/db.js"; // Updated to use Prisma

const router = express.Router();

// Log-In Route
router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  // Validate Email and Password
  if (!Email || !Password) {
    console.log(Email, Password);
    return res.status(400).send("Email and Password are required.");
  }

  try {
    const existingUser = await prisma.students.findUnique({
      where: { Email: Email },
    });

    if (!existingUser) return res.send("Invalid Email or Password.");

    const isValidPassword = await bcrypt.compare(Password, existingUser.Password);
    if (!isValidPassword) return res.send("Invalid Email or Password.");

    req.session.user = {
      id: existingUser.StudentID,
      Email: existingUser.Email,
      FirstName: existingUser.FirstName,
      LastName: existingUser.LastName,
      isAdmin: existingUser.isAdmin,
      isFacilitator: existingUser.isFacilitator // Added this line
    };
    req.session.isLoggedIn = true;

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error during login:", error);
    res.send("Internal Server Error");
  }
});

// Sign-Up Route
router.post("/signup", async (req, res) => {
  const { FirstName, LastName, Email, Password } = req.body;

  console.log("Request body:", req.body);

  // Validate inputs
  if (!Email) return res.status(400).send("Email is required.");
  if (!Password) return res.status(400).send("Password is required.");
  if (!/^[a-zA-Z]+$/.test(FirstName)) return res.status(400).send("First Name can only contain letters.");
  if (!/^[a-zA-Z]+$/.test(LastName)) return res.status(400).send("Last Name can only contain letters.");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(Email)) return res.status(400).send("Invalid Email format.");

  try {
    const lowercasedEmail = Email.toLowerCase();
    console.log("Finding user with email:", lowercasedEmail);

    const existingUser = await prisma.students.findUnique({
      where: { Email: lowercasedEmail },
    });

    if (existingUser) {
      return res.status(400).send("Email already in use. Please use a different Email.");
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = await prisma.students.create({
      data: {
        FirstName,
        LastName,
        Email: lowercasedEmail,
        Password: hashedPassword,
        isAdmin: false,
      },
    });

    res.status(201).send("User created successfully.");
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.redirect('/dashboard');  // Redirect back to dashboard if session destroy fails
    }

    // Clear cookies on the client-side (just in case they aren't automatically cleared)
    res.clearCookie('connect.sid');  // Assuming you're using the default session cookie name
    
    // Redirect to the login page or home page after logout
    res.redirect('/');  // Redirect to the login page after logout
  });
});

// Update Settings Route
router.put("/update-settings", async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email) return res.status(400).send("Email is required.");
  if (!password) return res.status(400).send("Password is required.");

  try {
    const existingUser = await prisma.students.findUnique({
      where: { Email: email },
    });

    if (existingUser) {
      return res.status(400).send("Email already in use. Please use a different Email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.students.update({
      where: { id: req.session.user.id },
      data: {
        Email: email,
        Password: hashedPassword,
      },
    });

    res.send("Settings updated successfully.");
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
