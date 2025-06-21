const express = require("express");
const router = express.Router();
const multer = require("multer");
const SpotInteraction = require("../models/SpotInteraction");
const cloudinary = require("../utils/cloudinary");
const Spot = require("../models/Spot");


// Configure multer to handle multipart/form-data
const storage = multer.memoryStorage(); // Temporary storage in memory
const upload = multer({ storage: storage });

// POST API to add a spot with image upload
router.post("/add", upload.array("images", 5), async (req, res) => {
  console.log("Add Spot API Hit");
  console.log("Raw request body (fields):", req.body);
  console.log("Raw request files:", req.files);

  try {
    const { name, userName, vibe, description, personalStory } = req.body;

    // Upload all images to Cloudinary
    const uploadedImages = [];

    for (const file of req.files) {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "community_spots", // Optional folder in Cloudinary
      });
      uploadedImages.push(uploadResponse.secure_url);
    }

    const newSpot = new Spot({
      name,
      userName,
      vibe,
      description,
      personalStory,
      images: uploadedImages, // Store URLs
      location: {
        type: "Point",
        coordinates: [78.167, 26.2183], // Gwalior coordinates
      },
    });

    await newSpot.save();
    console.log("Spot saved to database successfully:", newSpot);

    res
      .status(201)
      .json({ message: "Spot added successfully!", spot: newSpot });
  } catch (error) {
    console.error("Error adding spot:", error.message);
    res.status(500).json({ error: "Server error while adding spot." });
  }
});

// GET route to fetch all spots
router.get("/", async (req, res) => {
  try {
    const spots = await Spot.find().sort({ createdAt: -1 }); // latest first
    const interactions = await SpotInteraction.find();

    // Merge spots with their interaction data
    const mergedSpots = spots.map((spot) => {
      const interaction = interactions.find(
        (inter) => inter.spotId.toString() === spot._id.toString()
      );

      return {
        ...spot._doc,
        likes: interaction ? interaction.likes : 0,
        comments: interaction ? interaction.comments : 0,
      };
    });

    res.status(200).json(mergedSpots);
  } catch (error) {
    console.error("Error fetching spots:", error.message);
    res.status(500).json({ error: "Server error while fetching spots." });
  }
});

router.post("/:id/like", async (req, res) => {
  try {
    let interaction = await SpotInteraction.findOne({ spotId: req.params.id });

    if (!interaction) {
      interaction = new SpotInteraction({ spotId: req.params.id, likes: 1 });
    } else {
      interaction.likes += 1;
    }

    await interaction.save();
    res.status(200).json({ message: "Like updated", likes: interaction.likes });
  } catch (error) {
    res.status(500).json({ error: "Error updating like" });
  }
});

router.post("/:id/comment", async (req, res) => {
  try {
    let interaction = await SpotInteraction.findOne({ spotId: req.params.id });

    if (!interaction) {
      interaction = new SpotInteraction({ spotId: req.params.id, comments: 1 });
    } else {
      interaction.comments += 1;
    }

    await interaction.save();
    res
      .status(200)
      .json({ message: "Comment updated", comments: interaction.comments });
  } catch (error) {
    res.status(500).json({ error: "Error updating comment" });
  }
});



module.exports = router;
