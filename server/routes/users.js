import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Post from "../models/Posts.js";

const router = express.Router();

// Update
router.put("/:id", async (req, res) => {
  if (req.body.id === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can only update your account");
  }
});

// Delete

router.delete("/:id", async (req, res) => {
  if (req.body.id === req.params.id) {
    try {
      const user = User.findById(req.params.id);
      if (user) {
        try {
          await Post.deleteMany({ username: user.usename });
          await User.findByIdAndDelete(req.params.id);
          res.status(200).json("User has been deleted...");
        } catch (error) {
          res.status(500).json(error);
        }
      }
    } catch (error) {
      res.status(404).json("User not found");
    }
  } else {
    res.status(401).json("You can only delete your account!");
  }
});

// Get user

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500);
  }
});

export default router;
