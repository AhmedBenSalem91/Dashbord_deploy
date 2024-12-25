const mongoose = require("mongoose");
const Message = require("../models/Message");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

async function createMessages() {
  try {
    const messagesData = [
      {
        name: "John Doe",
        email: "john@example.com",
        projets: ["Villa A", "Villa B"],
        comment: "Looking forward to more info.",
        phone: "22554477"
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        projets: ["Project Alpha"],
        comment: "What are the payment plans?",
        phone :"11225588",
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        projets: ["Villa Z"],
        comment: "Can we visit the site?",
        phone :"11225588",
      },
      {
        name: "Alice Brown",
        email: "alice@example.com",
        projets: ["Villa X", "Project Beta"],
        comment: "Please send detailed info.",
        phone :"11225588",
      },
      {
        name: "Tom White",
        email: "tom@example.com",
        projets: ["Villa Y", "Villa Z"],
        comment: "Interested in floor plans.",
        phone :"11225588",
      },
      {
        name: "Emily Davis",
        email: "emily@example.com",
        projets: ["Project Gamma"],
        comment: "Can we schedule a meeting?",
        phone :"11225588",
      },
      {
        name: "Chris Green",
        email: "chris@example.com",
        projets: ["Villa C", "Villa D"],
        comment: "What's the timeline for completion?",
        phone :"11225588",
        isOpened : true
      },
    ];

    await Message.insertMany(messagesData);
    console.log(`7 Messages created successfully`);

    mongoose.disconnect(); // Disconnect from the database once the operation is done
  } catch (err) {
    console.error("Error creating messages:", err);
  }
}

createMessages();
