const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const nodemailer = require('nodemailer');
const multer = require("multer");
const path = require("path");

const router = express.Router();
const crypto = require('crypto');

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/users"); // Folder where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });


// Create a new user (POST /users)
// Create a new user (POST /users)
router.post('/create', async (req, res) => {
  const { username, email, role } = req.body;
  const registrationToken = crypto.randomBytes(32).toString('hex');

  try {
    const newUser = new User({ username, email, role, registrationToken });
    await newUser.save();

    const registrationLink = `http://localhost:3000/pages/register/${registrationToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Créer compte Investir A Bali',
      html: `<h1>Bienvenue, ${username}</h1><p>Veuillez cliquer sur ce lien pour finaliser la création de votre compte.</p>
             <a href="${registrationLink}">Créer compte</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({ message: 'User created and email sent!' });

  } catch (error) {
    if (error.code === 11000) {  // Duplicate key error
      // Check which field caused the error
      if (error.keyPattern && error.keyPattern.username) {
        return res.status(400).json({ message: 'Nom d utilisateur existe déja !' });
      } else if (error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({ message: 'Email existe déja !' });
      }
    }
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});





// Get all users (GET /users)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
//find connected user by token
// GET /profile - Retrieve user profile using registrationToken from headers
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer token
    if (!token) {
      return res.status(401).json({ message: 'Token missing or invalid' });
    }

    // Find the user by the registrationToken
    const user = await User.findOne({ registrationToken: token }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found or invalid token' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get a user by ID (GET /users/:id)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a user by ID (PUT /users/:id)
// PUT /update/:id - Update user profile
router.put("/update/:id", authenticateAdmin, upload.single('avatar'), async (req, res) => {
  const { username, email, role } = req.body; // No need to destructure profile if you aren't using it directly
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate email or username if changed
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Update the user's basic info
    user.username = username || user.username;
    user.email = email || user.email;
    
    // Update the nested profile fields
    user.profile.firstName = req.body.firstName || user.profile.firstName;
    user.profile.lastName = req.body.lastName || user.profile.lastName;
    user.profile.phoneNumber = req.body.phoneNumber || user.profile.phoneNumber;
    user.profile.email = req.body.email || user.profile.email;

    // Update the avatar only if a new one is uploaded
    if (req.file) {
      user.profile.avatar = req.file.filename; // Update avatar if a new file is uploaded
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



// Delete a user by ID (DELETE /users/:id)
router.delete("/delete/:id", authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const email= user.email
    const username= user.username

    // Delete the user from the database
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted successfully" });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'suppression de compte Investir A Bali',
      html: `<h1>Bonjour, ${username}</h1><p>Votre compte Investir à Bali a été supprimer par un administrateur.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/////////////////////////////////////// registerNew user ///////////////////////////////////////////////////
router.post('/registerNew', async (req, res) => {
  const { username, email,password, role } = req.body;
  const registrationToken = crypto.randomBytes(32).toString('hex');  // Generate token
  console.log("registrationToken", registrationToken)

  try {
    // Create the user with the registration token
    const newUser = new User({ username, email, role, password, registrationToken });
    await newUser.save();

    console.log("New User created:", newUser);

    //const registrationLink = `http://localhost:3000/pages/register/${registrationToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Compte Investir A Bali',
      html: `<h1>Bienvenue, ${username}</h1><p>Votre compte Investir A Bali a été créée avec succés !</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    const userResponse = {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      _id: newUser._id,
      registrationToken: newUser.registrationToken,
        };

    res.status(201).json({ message: 'User created and email sent!' , user: userResponse });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});



/////////////////////////////////////// register a user ///////////////////////////////////////////////////
router.get('/register/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ registrationToken: token });
    if (!user) {
      return res.status(404).json({ message: 'Invalid token' });
    }

    res.json({ username: user.username, email: user.email });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});



////set user password and complete the registration
router.post('/complete-registration/:token', async (req, res) => {
  const { token } = req.params;
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ registrationToken: token });
    if (!user) {
      return res.status(404).json({ message: 'Invalid token' });
    }

    user.username = username
    user.password = password;
    
    await user.save();

    res.status(200).json({ message: 'Registration complete!' });
  } catch (error) {
    console.error('Error completing registration:', error);
    res.status(500).json({ message: 'Error completing registration' });
  }
});



module.exports = router;
