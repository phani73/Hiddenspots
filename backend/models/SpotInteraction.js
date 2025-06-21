const mongoose = require("mongoose");

const SpotInteractionSchema = new mongoose.Schema(
  {
    spotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spot",
      required: true,
    },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SpotInteraction", SpotInteractionSchema);
