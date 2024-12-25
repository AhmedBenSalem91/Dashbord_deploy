const express = require("express");
const Villa = require("../models/Villa"); // Adjust the path if necessary
const authenticateAdmin = require("../middleware/authenticateAdmin");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/villas"); // Folder where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create a new villa (POST /villas)
router.post("/create", authenticateAdmin, upload.array("img_album", 10), async (req, res) => {
  try {
    const {
      villaname,
      location,
      description,
      price,
      state,
      nb_bedroom,
      nb_livingroom,
      nb_bathroom,
      nb_pool,
      parking_capacity,
      area,
    } = req.body;

    // Collect the uploaded image filenames
    const img_album = req.files.map((file) => file.filename);

    // Create the villa object with the data from the request
    const newVilla = new Villa({
      villaname,
      location,
      description,
      price,
      state,
      nb_bedroom,
      nb_livingroom,
      nb_bathroom,
      nb_pool,
      parking_capacity,
      area,
      img_album, // Store the image filenames in the villa document
    });

    // Save the villa to the database
    await newVilla.save();

    res.status(201).json({ message: "Villa created successfully!" });
  } catch (error) {
    console.error("Error creating villa:", error);
    res.status(500).json({ message: "Error creating villa", error });
  }
});

// Get all villas (GET /villas)
router.get("/", async (req, res) => {
  try {
    const villas = await Villa.find();
    res.status(200).json(villas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a villa by ID (GET /villas/:id)
router.get("/:id", async (req, res) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) {
      return res.status(404).json({ message: "Villa not found" });
    }
    res.status(200).json(villa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a villa by ID (PUT /villas/:id)
router.put(
  "/update/:id",
  authenticateAdmin,
  upload.array("img_album"),
  async (req, res) => {
    const {
      villaname,
      location,
      description,
      price,
      state,
      nb_bedroom,
      nb_livingroom,
      nb_bathroom,
      nb_pool,
      parking_capacity,
      area,
      existing_images,
    } = req.body;

    try {
      let villa = await Villa.findById(req.params.id);
      if (!villa) {
        return res.status(404).json({ message: "Villa not found" });
      }

      // Update the villa details
      villa.villaname = villaname || villa.villaname;
      villa.location = location || villa.location;
      villa.description = description || villa.description;
      villa.price = price || villa.price;
      villa.state = state || villa.state;
      villa.nb_bedroom = nb_bedroom || villa.nb_bedroom;
      villa.nb_livingroom = nb_livingroom || villa.nb_livingroom;
      villa.nb_bathroom = nb_bathroom || villa.nb_bathroom;
      villa.nb_pool = nb_pool || villa.nb_pool;
      villa.parking_capacity = parking_capacity || villa.parking_capacity;
      villa.area = area || villa.area;

      let uploadedImages = [];
      // Handle file uploads
      if (req.files && req.files.length > 0) {
        uploadedImages = req.files.map((file) => file.filename); // Use method to access file paths
      }

      const images = Array.isArray(existing_images)
        ? existing_images
        : [existing_images];

      if (existing_images){
        villa.img_album = [...uploadedImages, ...images];
      }
      else{
        villa.img_album = uploadedImages
      }
      

      // Save the updated villa
      await villa.save();

      res.status(200).json({ message: "Villa updated successfully", villa });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete a villa by ID (DELETE /villas/:id)
router.delete("/delete/:id", authenticateAdmin, async (req, res) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) {
      return res.status(404).json({ message: "Villa not found" });
    }

    // Delete the villa from the database
    await Villa.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Villa deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
