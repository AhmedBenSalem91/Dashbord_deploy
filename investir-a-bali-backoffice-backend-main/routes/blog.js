const express = require("express");
const Blog = require("../models/Blog");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/blogs");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create a new blog (POST /blogs/create)
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const newBlog = new Blog({
      title,
      description,
      image,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully!" });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Error creating blog", error });
  }
});

// Get all blogs (GET /blogs)
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a blog by ID (GET /blogs/:id)
router.get("/:id", authenticateAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a blog by ID (PUT /blogs/update/:id)
router.put("/update/:id", authenticateAdmin, upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update the blog's details
    blog.title = title || blog.title;
    blog.description = description || blog.description;

    if (req.file) {
      // Update the image if a new image was uploaded
      blog.image = req.file.filename;
    }

    // Save the updated blog
    await blog.save();

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a blog by ID (DELETE /blogs/delete/:id)
router.delete("/delete/:id", authenticateAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete the blog from the database
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
