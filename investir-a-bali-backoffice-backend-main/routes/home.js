const express = require("express");
const Home = require("../models/Home");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/home"); // Folder where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Create a new home section (POST /home/create)
router.post("/create", authenticateAdmin, upload.fields([{ name: "hero", maxCount: 1 }, { name: "about_img", maxCount: 1 },
  ]),
  async (req, res) => {
    const { title, services, expertises, about_desc } = req.body;

    try {
      // Extract image paths from req.files
      const hero = req.files?.hero ? req.files.hero[0].filename : null;
      const about_img = req.files?.about_img ? req.files.about_img[0].filename : null;

      // Create a new home object
      const newHome = new Home({
        title,
        hero,
        services,
        expertises,
        about_img,
        about_desc,
      });

      // Save the home section to the database
      await newHome.save();

      res.status(201).json({ message: "Home section created successfully", home: newHome });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all home sections (GET /home)
router.get("/", async (req, res) => {
  try {
    const homeSections = await Home.find();
    res.status(200).json(homeSections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a home section by ID (GET /home/:id)
router.get("/:id", authenticateAdmin, async (req, res) => {
  try {
    const homeSection = await Home.findById(req.params.id);
    if (!homeSection) {
      return res.status(404).json({ message: "Home section not found" });
    }
    res.status(200).json(homeSection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Update a home section by ID (PUT /homes/update/:id)
router.put(
  "/update/:id",
  authenticateAdmin,
  upload.fields([
    { name: "hero", maxCount: 1 },
    { name: "about_img", maxCount: 1 },
  ]),
  async (req, res) => {
    const { title, services, expertises, about_desc } = req.body;

    try {
      let homeSection = await Home.findById(req.params.id);
      if (!homeSection) {
        return res.status(404).json({ message: "Home section not found" });
      }

      // Update the home section details
      homeSection.title = title || homeSection.title;
      homeSection.services = services || homeSection.services;
      homeSection.expertises = expertises || homeSection.expertises;
      homeSection.about_desc = about_desc || homeSection.about_desc;

      // Update images if provided
      if (req.files?.hero) {
        homeSection.hero = req.files.hero[0].filename; // Update hero image
      }
      if (req.files?.about_img) {
        homeSection.about_img = req.files.about_img[0].filename; // Update about image
      }

      // Save the updated home section to the database
      await homeSection.save();

      res.status(200).json({ message: "Home section updated successfully", home: homeSection });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);



//////////////////////////////////// EXPERTISES APIS //////////////////////////////////////


// Get EXPERTISE by ID (get /homes/expertise/:id)
router.get("/expertise/:id", authenticateAdmin, async (req, res) => {
  try {
    const homeSection = await Home.find();
    if (!homeSection) {
      return res.status(404).json({ message: "Home section not found" });
    }
    console.log('homeSection[0].expertises', homeSection[0].expertises)
    const expertise = homeSection[0].expertises.find(expertise => expertise._id.toString() === req.params.id);
    res.status(200).json(expertise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



//update EXPERTISE by id (put /homes/expertise/update/:id)
router.put("/expertise/update/:id", authenticateAdmin, async (req, res) => {
  const { name, description } = req.body;

  try {
    const homeSection = await Home.find();
    if (!homeSection) {
      return res.status(404).json({ message: "Home section not found" });
    }

    const expertise = homeSection[0].expertises.find(expertise => expertise._id.toString() === req.params.id);
    if (!expertise) {
      return res.status(404).json({ message: "Expertise not found" });
    }

    expertise.name = name || expertise.name;
    expertise.description = description || expertise.description;

    await homeSection[0].save();

    res.status(200).json({ message: "Expertise updated successfully", expertise });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




// Delete EXPERTISE by ID (DELETE /homes/expertise/delete/:id)
router.put("/expertise/delete/:id",authenticateAdmin, async (req, res) => {
  try {
    const homeSection = await Home.find();
    if (!homeSection) {
      return res.status(404).json({ message: "Home section not found" });
    }

    const expertise = homeSection[0].expertises.find(expertise => expertise._id.toString() === req.params.id);
    if (!expertise) {
      return res.status(404).json({ message: "Expertise not found" });
    }

    const expertisesToKeep = homeSection[0].expertises.filter(exp => exp._id != expertise._id)
    homeSection[0].expertises = expertisesToKeep
    homeSection[0].save()


    res.status(200).json({ message: "Expertise deleted successfully", homeSection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


//Add EXPERTISE by id (/homes/expertise/add)
router.put("/expertise/add", authenticateAdmin, async (req, res) => {

  const { name, description } = req.body;
  const expertiseToAdd = {
    "name": name,
    "description" : description
  }

  try {
    const homeSection = await Home.find();
    if (!homeSection) {
      return res.status(404).json({ message: "Home section not found" });
    }

    homeSection[0].expertises.push(expertiseToAdd);
    homeSection[0].save()

    res.status(200).json({ message: "Expertise added successfully", homeSection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
