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
      if (err) return res.status(500).send("Internal Server Error");

      if (!existingUser) return res.status(401).send("Invalid email or password.");

      if (existingUser.password_hash !== password) return res.status(401).send("Invalid email or password.");

      req.session.user = existingUser;
      res.status(200).send("Logged in successfully.");
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Sign-Up Route
router.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const existingUserQuery = `SELECT * FROM users WHERE email = ?`;
    db.get(existingUserQuery, [email], async (err, existingUser) => {
      if (err) return res.status(500).send("Internal Server Error");

      if (existingUser) return res.status(409).send("Email already in use. Please use a different email.");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUserQuery = `INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)`;

      db.run(newUserQuery, [first_name, last_name, email, hashedPassword, balance], function (err) {
        if (err) return res.status(500).send("Internal Server Error");

        res.status(201).send("User created successfully.");
      });
    });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).send("Internal Server Error");
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
