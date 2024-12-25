const express = require("express");
const Link = require("../models/Link");
const authenticateAdmin = require("../middleware/authenticateAdmin");

const router = express.Router();

// Create a new link (POST /links/create)
router.post("/create", authenticateAdmin, async (req, res) => {
  try {
    const { label, url, type } = req.body;

    const newLink = new Link({
      label,
      url,
      type,
    });

    await newLink.save();
    res.status(201).json({ message: "Link created successfully!", link: newLink });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({ message: "Error creating link", error });
  }
});

// Get all links (GET /links)
router.get("/", async (req, res) => {
  try {
    const links = await Link.find();
    res.status(200).json(links);
  } catch (err) {
    console.error("Error fetching links:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a link by ID (GET /links/:id)
router.get("/:id", authenticateAdmin, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.status(200).json(link);
  } catch (err) {
    console.error("Error fetching link:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a link by ID (PUT /links/update/:id)
router.put("/update/:id", authenticateAdmin, async (req, res) => {
  const { label, url, type } = req.body;
  try {
    let link = await Link.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Update the link's details
    link.label = label;
    link.url = url || "#";
    link.type = type || link.type;

    // Save the updated link
    await link.save();

    res.status(200).json({ message: "Link updated successfully", link });
  } catch (err) {
    console.error("Error updating link:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a link by ID (DELETE /links/delete/:id)
router.delete("/delete/:id", authenticateAdmin, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Delete the link from the database
    await Link.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Link deleted successfully" });
  } catch (err) {
    console.error("Error deleting link:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
