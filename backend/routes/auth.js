const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "questions_121"; // Replace with a strong secret in production

// Middleware to verify JWT and extract user ID
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// ---------------------- Signup Route ----------------------
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

// ---------------------- Login Route ----------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ---------------------- Get Profile (uses token) ----------------------
router.get("/user/profile", authenticate, async (req, res) => {
  console.log("Incoming request headers:", req.headers);


  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Fetch profile error:", err.message);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// ---------------------- Update Profile (uses token) ----------------------
router.put("/user/profile", authenticate, async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.put("/user/impact", authenticate, async (req, res) => {
  try {
    const { spotsDiscovered, spotsShared, totalLikes, reviewsWritten } =
      req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (spotsDiscovered !== undefined)
      user.impact.spotsDiscovered = spotsDiscovered;
    if (spotsShared !== undefined) user.impact.spotsShared = spotsShared;
    if (totalLikes !== undefined) user.impact.totalLikes = totalLikes;
    if (reviewsWritten !== undefined)
      user.impact.reviewsWritten = reviewsWritten;

    await user.save();
    res.status(200).json({ message: "Impact updated successfully", user });
  } catch (err) {
    console.error("Impact update error:", err.message);
    res.status(500).json({ error: "Failed to update impact" });
  }
});

module.exports = router;
