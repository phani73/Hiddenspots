const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Like a spot
router.post("/like/:spotId", async (req, res) => {
  console.log(`Like request received for spotId: ${req.params.spotId}`);
  try {
    let post = await Post.findOne({ spotId: req.params.spotId });
    if (!post) {
      console.log("No post found. Creating new post with 1 like.");
      post = new Post({ spotId: req.params.spotId, likes: 1, comments: 0 });
    } else {
      console.log(
        `Post found. Incrementing likes. Current likes: ${post.likes}`
      );
      post.likes += 1;
    }
    await post.save();
    console.log(`Post saved successfully. Updated likes: ${post.likes}`);
    res
      .status(200)
      .json({ message: "Like added successfully", likes: post.likes });
  } catch (error) {
    console.error("Error liking spot:", error.message);
    res.status(500).json({ error: "Server error while liking spot." });
  }
});

// Add comment
router.post("/comment/:spotId", async (req, res) => {
  console.log(`Comment request received for spotId: ${req.params.spotId}`);
  try {
    let post = await Post.findOne({ spotId: req.params.spotId });
    if (!post) {
      console.log("No post found. Creating new post with 1 comment.");
      post = new Post({ spotId: req.params.spotId, likes: 0, comments: 1 });
    } else {
      console.log(
        `Post found. Incrementing comments. Current comments: ${post.comments}`
      );
      post.comments += 1;
    }
    await post.save();
    console.log(`Post saved successfully. Updated comments: ${post.comments}`);
    res
      .status(200)
      .json({ message: "Comment added successfully", comments: post.comments });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ error: "Server error while adding comment." });
  }
});

// Get likes and comments for a spot
router.get("/:spotId", async (req, res) => {
  console.log(`Fetch request received for spotId: ${req.params.spotId}`);
  try {
    const post = await Post.findOne({ spotId: req.params.spotId });
    if (!post) {
      console.log("No post found. Returning defaults (0 likes, 0 comments).");
      return res.status(200).json({ likes: 0, comments: 0 });
    }
    console.log(
      `Post found. Returning likes: ${post.likes}, comments: ${post.comments}`
    );
    res.status(200).json({ likes: post.likes, comments: post.comments });
  } catch (error) {
    console.error("Error fetching post data:", error.message);
    res.status(500).json({ error: "Server error while fetching post data." });
  }
});

module.exports = router;
