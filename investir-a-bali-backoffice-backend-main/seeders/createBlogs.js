const mongoose = require('mongoose');
const Blog = require('../models/Blog'); // Assuming Blog.js is in the models folder
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

async function createBlogs() {
    try {
        const blogsData = [
            {
                title: "Découvrir nos récente",
                description: "Exploring innovative designs that prioritize sustainability in construction.",
                image: "blog1.jpg" // Example file path or URL for the image
            },
            {
                title: "Apprendre plus sur",
                description: "A deep dive into modern interior design trends and techniques.",
                image: "blog2.jpg"
            },
            {
                title: "Explorer nos dernières nouveautés",
                description: "An overview of essential safety measures in construction projects.",
                image: "blog3.jpg"
            },
            {
                title: "Admirez nos récents produits",
                description: "Analyzing the latest trends in the real estate market for the coming year.",
                image: "blog4.jpg"
            }
        ];

        await Blog.insertMany(blogsData);
        console.log(`4 Blogs created successfully`);

        mongoose.disconnect();
    } catch (err) {
        console.error('Error creating blogs:', err);
    }
}

// Run the function to create blogs
createBlogs();
