const express = require("express");
const Message = require("../models/Message");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const nodemailer = require('nodemailer');


const router = express.Router();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create a new message (POST /messages/create)
router.post("/create", async (req, res) => {
    try {
      const { name, email, projets, comment, phone } = req.body;
  
      // Create a new message in the database
      const newMessage = new Message({
        name,
        email,
        projets,
        comment,
        phone
      });
  
      await newMessage.save();
  
      // Prepare the email content
      const mailOptions = {
        from: email, // Sender's email address
        to: process.env.EMAIL_USER, 
        replyTo: email,
        subject: `Contact Message from ${email}`, // Email subject
        text: `
          You have received a new contact message:
          
          Name: ${name}
          Email: ${email}
          phone number: ${phone}

          Projets: ${projets.join(", ")}

          ${comment}
        `
      };
  
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Message saved but email failed to send", error });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(201).json({ message: "Message sent successfully and email sent!", messageData: newMessage });
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Error sending message", error });
    }
  });

// Get all messages (GET /messages)
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/unread-count", async (req, res) => {
    try {
      const unreadCount = await Message.countDocuments({ isOpened: false });
      res.status(200).json({ unreadCount });
    } catch (error) {
      console.error("Error counting unread messages:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

// Get a message by ID (GET /messages/:id)
router.get("/:id", authenticateAdmin, async (req, res) => {
    try {
      const message = await Message.findById(req.params.id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
  
      // Mark the message as opened when it's fetched
      if (!message.isOpened) {
        message.isOpened = true;
        await message.save();
      }
  
      res.status(200).json(message);
    } catch (err) {
      console.error("Error fetching message:", err);
      res.status(500).json({ message: "Server error" });
    }
  });


// Delete a message by ID (DELETE /messages/delete/:id)
router.delete("/delete/:id", authenticateAdmin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Delete the message from the database
    await Message.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
