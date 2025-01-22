import express from "express";
import bcrypt from "bcrypt"; // Ensure bcrypt is installed
import db from "../config/db.js";

const router = express.Router();

// Log-In Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUserQuery = `SELECT * FROM users WHERE email = ?`;
    db.get(existingUserQuery, [email], async (err, existingUser) => {
      if (err) return res.send("Internal Server Error");

      if (!existingUser) return res.send("Invalid email or password.");

      const isValidPassword = await bcrypt.compare(password, existingUser.password);
      if (!isValidPassword) return res.send("Invalid email or password.");

      req.session.user = existingUser;
      req.session.isLoggedIn = true;
      res.redirect("/dashboard");
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.send("Internal Server Error");
  }
});

// Sign-Up Route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUserQuery = `SELECT * FROM users WHERE email = ?`;
    db.get(existingUserQuery, [email], async (err, existingUser) => {
      if (err) return res.send("Internal Server Error");

      if (existingUser) {
        console.log("User already exists:", existingUser); // Log existing user
        return res.send("Email already in use. Please use a different email.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUserQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

      db.run(newUserQuery, [username, email, hashedPassword], function (err) {
        if (err) {
          console.error("Error inserting user:", err.message);
          return res.send("Internal Server Error");
        }

        res.send("User created successfully."); // Changed to simple response
      });
    });
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
