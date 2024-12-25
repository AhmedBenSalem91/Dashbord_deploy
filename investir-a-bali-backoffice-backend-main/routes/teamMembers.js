const express = require("express");
const TeamMember = require("../models/TeamMember");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/team-members");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create a new team member (POST /team-members)
router.post("/create", upload.single("avatar"), async (req, res) => {
  try {
    const { name, email, memberRole } = req.body;
    const avatar = req.file ? req.file.filename : null; 

    const newTeamMember = new TeamMember({
      name,
      email,
      memberRole,
      avatar,
    });

    await newTeamMember.save();
    res.status(201).json({ message: "Team member created successfully!" });
  } catch (error) {
    console.error("Error creating team member:", error);
    res.status(500).json({ message: "Error creating team member", error });
  }
});

// Get all team members (GET /team-members)
router.get("/", async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();
    res.status(200).json(teamMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get a team member by ID (GET /team-members/:id)
router.get("/:id", authenticateAdmin, async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.status(200).json(teamMember);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a team member by ID (PUT /team-members/:id)
router.put("/update/:id", authenticateAdmin, upload.single("avatar"), async (req, res) => {
  const { name, email, memberRole } = req.body;
  try {
    let teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // Update the team member's details
    teamMember.name = name || teamMember.name;
    teamMember.email = email || teamMember.email;
    teamMember.memberRole = memberRole || teamMember.memberRole;

    if (req.file) {
      // Update the avatar if a new image was uploaded
      teamMember.avatar = req.file.filename;
    }

    // Save the updated team member
    await teamMember.save();

    res.status(200).json({ message: "Team member updated successfully", teamMember });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a team member by ID (DELETE /team-members/:id)
router.delete("/delete/:id", authenticateAdmin, async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // Delete the team member from the database
    await TeamMember.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
