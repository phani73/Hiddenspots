const mongoose = require("mongoose");

const impactSchema = new mongoose.Schema({
  spotsDiscovered: { type: Number, default: 0 },
  spotsShared: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  reviewsWritten: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" }, // New Field
    profilePicture: { type: String, default: "" }, // New Field
    impact: { type: impactSchema, default: () => ({}) }, // New Field
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
