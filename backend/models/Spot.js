// models/Spot.js
const mongoose = require("mongoose");

const SpotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true },
  vibe: { type: String, required: true },
  description: { type: String, required: true },
  personalStory: { type: String, required: true },
  images: { type: [String], required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
});

SpotSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Spot", SpotSchema);
